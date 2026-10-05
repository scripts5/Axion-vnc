package com.axion.remote.client

import android.graphics.Bitmap
import android.graphics.Color
import android.util.Log
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.io.DataInputStream
import java.io.DataOutputStream
import java.net.InetSocketAddress
import java.net.Socket
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

sealed class VncConnectionState {
    object Disconnected : VncConnectionState()
    object Connecting : VncConnectionState()
    data class Connected(val desktopName: String, val width: Int, val height: Int) : VncConnectionState()
    data class Error(val message: String) : VncConnectionState()
}

class VncClientManager {

    private val TAG = "VncClientManager"

    private val _connectionState = MutableStateFlow<VncConnectionState>(VncConnectionState.Disconnected)
    val connectionState = _connectionState.asStateFlow()

    private val _frameBitmap = MutableStateFlow<Bitmap?>(null)
    val frameBitmap = _frameBitmap.asStateFlow()

    private var socket: Socket? = null
    private var inStream: DataInputStream? = null
    private var outStream: DataOutputStream? = null
    private var clientJob: Job? = null

    private var fbWidth = 0
    private var fbHeight = 0
    private var localBitmap: Bitmap? = null
    private var pixelArray: IntArray? = null

    fun connect(host: String, port: Int, password: String) {
        disconnect()

        clientJob = CoroutineScope(Dispatchers.IO).launch {
            _connectionState.value = VncConnectionState.Connecting
            try {
                val s = Socket()
                s.tcpNoDelay = true
                s.connect(InetSocketAddress(host, port), 6000)
                socket = s

                val input = DataInputStream(s.getInputStream())
                val output = DataOutputStream(s.getOutputStream())
                inStream = input
                outStream = output

                // 1. Version Handshake (RFB 003.008)
                val serverVerBytes = ByteArray(12)
                input.readFully(serverVerBytes)
                val serverVer = String(serverVerBytes)
                Log.d(TAG, "Server version: $serverVer")

                output.writeBytes("RFB 003.008\n")
                output.flush()

                // 2. Security Types Handshake
                val numSecurityTypes = input.readUnsignedByte()
                if (numSecurityTypes == 0) {
                    val reasonLen = input.readInt()
                    val reasonBytes = ByteArray(reasonLen)
                    input.readFully(reasonBytes)
                    throw Exception("Conexão recusada pelo servidor: " + String(reasonBytes))
                }

                val secTypes = ByteArray(numSecurityTypes)
                input.readFully(secTypes)

                var chosenSecType = 0
                // Procura None (1) ou VncAuth (2)
                if (password.isEmpty() && secTypes.contains(1.toByte())) {
                    chosenSecType = 1
                } else if (secTypes.contains(2.toByte())) {
                    chosenSecType = 2
                } else if (secTypes.contains(1.toByte())) {
                    chosenSecType = 1
                } else {
                    chosenSecType = secTypes[0].toInt() and 0xFF
                }

                output.writeByte(chosenSecType)
                output.flush()

                // Processa Autenticação
                if (chosenSecType == 2) {
                    // VncAuth
                    val challenge = ByteArray(16)
                    input.readFully(challenge)

                    val response = encryptVncChallenge(challenge, password)
                    output.write(response)
                    output.flush()

                    val authResult = input.readInt()
                    if (authResult != 0) {
                        throw Exception("Senha VNC incorreta.")
                    }
                } else if (chosenSecType == 1) {
                    // None - sem autenticação necessária
                    if (serverVer.contains("003.008")) {
                        val authResult = input.readInt()
                        if (authResult != 0) throw Exception("Autenticação sem senha recusada.")
                    }
                }

                // 3. ClientInit (Shared = 1)
                output.writeByte(1)
                output.flush()

                // 4. ServerInit
                fbWidth = input.readUnsignedShort()
                fbHeight = input.readUnsignedShort()

                // Pixel format (16 bytes)
                val bpp = input.readUnsignedByte()
                val depth = input.readUnsignedByte()
                val bigEndian = input.readUnsignedByte()
                val trueColor = input.readUnsignedByte()
                val redMax = input.readUnsignedShort()
                val greenMax = input.readUnsignedShort()
                val blueMax = input.readUnsignedShort()
                val redShift = input.readUnsignedByte()
                val greenShift = input.readUnsignedByte()
                val blueShift = input.readUnsignedByte()
                val padding = ByteArray(3)
                input.readFully(padding)

                val nameLen = input.readInt()
                val nameBytes = ByteArray(nameLen)
                input.readFully(nameBytes)
                val desktopName = String(nameBytes)

                Log.d(TAG, "Desktop: $desktopName, ${fbWidth}x${fbHeight}, bpp: $bpp")

                // 5. Configurar Encodings suportados (Raw = 0, DesktopSize = -223)
                output.writeByte(2) // SetEncodings message type
                output.writeByte(0) // padding
                output.writeShort(1) // 1 encoding
                output.writeInt(0) // Raw encoding
                output.flush()

                // Aloca o bitmap local para receber as imagens da tela
                val bmp = Bitmap.createBitmap(fbWidth, fbHeight, Bitmap.Config.ARGB_8888)
                localBitmap = bmp
                pixelArray = IntArray(fbWidth * fbHeight)
                _frameBitmap.value = bmp

                _connectionState.value = VncConnectionState.Connected(desktopName, fbWidth, fbHeight)

                // 6. Solicitar primeiro FramebufferUpdateRequest (incremental = 0)
                requestFrameUpdate(false)

                // 7. Loop de mensagens do servidor
                while (isActive && s.isConnected && !s.isClosed) {
                    val msgType = input.readUnsignedByte()
                    when (msgType) {
                        0 -> {
                            // FramebufferUpdate
                            input.readByte() // padding
                            val numRects = input.readUnsignedShort()
                            for (i in 0 until numRects) {
                                val rx = input.readUnsignedShort()
                                val ry = input.readUnsignedShort()
                                val rw = input.readUnsignedShort()
                                val rh = input.readUnsignedShort()
                                val encodingType = input.readInt()

                                if (encodingType == 0) {
                                    // RAW encoding: 4 bytes por pixel (RGBA / BGRA)
                                    val rectPixels = IntArray(rw * rh)
                                    val rectBytes = ByteArray(rw * rh * 4)
                                    input.readFully(rectBytes)

                                    var byteIdx = 0
                                    for (p in 0 until rw * rh) {
                                        val b1 = rectBytes[byteIdx].toInt() and 0xFF
                                        val b2 = rectBytes[byteIdx + 1].toInt() and 0xFF
                                        val b3 = rectBytes[byteIdx + 2].toInt() and 0xFF
                                        // No VNC padrão x86_64 geralmente é B, G, R, A
                                        rectPixels[p] = Color.argb(255, b3, b2, b1)
                                        byteIdx += 4
                                    }

                                    bmp.setPixels(rectPixels, 0, rw, rx, ry, rw, rh)
                                } else {
                                    // Outro encoding ignorado
                                }
                            }
                            _frameBitmap.value = bmp

                            // Pede o próximo frame (incremental = true)
                            requestFrameUpdate(true)
                        }
                        2 -> {
                            // Bell (som)
                        }
                        3 -> {
                            // ServerCutText (clipboard)
                            input.readByte() // padding 1
                            input.readByte() // padding 2
                            input.readByte() // padding 3
                            val clipLen = input.readInt()
                            val clipBytes = ByteArray(clipLen)
                            input.readFully(clipBytes)
                        }
                        else -> {
                            Log.w(TAG, "Mensagem do servidor desconhecida: $msgType")
                        }
                    }
                }

            } catch (e: Exception) {
                Log.e(TAG, "Erro na conexão VNC: ${e.message}", e)
                _connectionState.value = VncConnectionState.Error(e.message ?: "Erro desconhecido na conexão")
            } finally {
                cleanUpSocket()
            }
        }
    }

    private fun requestFrameUpdate(incremental: Boolean) {
        try {
            outStream?.let { out ->
                synchronized(out) {
                    out.writeByte(3) // FramebufferUpdateRequest
                    out.writeByte(if (incremental) 1 else 0)
                    out.writeShort(0) // x
                    out.writeShort(0) // y
                    out.writeShort(fbWidth)
                    out.writeShort(fbHeight)
                    out.flush()
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao solicitar frame: ${e.message}")
        }
    }

    fun sendPointerEvent(x: Int, y: Int, buttonMask: Int) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                outStream?.let { out ->
                    synchronized(out) {
                        out.writeByte(5) // PointerEvent
                        out.writeByte(buttonMask)
                        out.writeShort(x.coerceIn(0, fbWidth))
                        out.writeShort(y.coerceIn(0, fbHeight))
                        out.flush()
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Erro ao enviar ponteiro: ${e.message}")
            }
        }
    }

    fun sendKeyEvent(keySym: Int, isDown: Boolean) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                outStream?.let { out ->
                    synchronized(out) {
                        out.writeByte(4) // KeyEvent
                        out.writeByte(if (isDown) 1 else 0)
                        out.writeShort(0) // padding
                        out.writeInt(keySym)
                        out.flush()
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Erro ao enviar tecla: ${e.message}")
            }
        }
    }

    fun disconnect() {
        clientJob?.cancel()
        clientJob = null
        cleanUpSocket()
        _connectionState.value = VncConnectionState.Disconnected
    }

    private fun cleanUpSocket() {
        try {
            inStream?.close()
            outStream?.close()
            socket?.close()
        } catch (_: Exception) {}
        socket = null
        inStream = null
        outStream = null
    }

    private fun encryptVncChallenge(challenge: ByteArray, password: String): ByteArray {
        val keyBytes = ByteArray(8)
        val passBytes = password.toByteArray(Charsets.US_ASCII)
        for (i in 0 until 8) {
            if (i < passBytes.size) {
                keyBytes[i] = reverseBits(passBytes[i])
            } else {
                keyBytes[i] = 0
            }
        }

        val keySpec = SecretKeySpec(keyBytes, "DES")
        val cipher = Cipher.getInstance("DES/ECB/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, keySpec)
        return cipher.doFinal(challenge)
    }

    private fun reverseBits(b: Byte): Byte {
        var v = b.toInt() and 0xFF
        v = ((v and 0x55) shl 1) or ((v and 0xAA) ushr 1)
        v = ((v and 0x33) shl 2) or ((v and 0xCC) ushr 2)
        v = ((v and 0x0F) shl 4) or ((v and 0xF0) ushr 4)
        return v.toByte()
    }
}
