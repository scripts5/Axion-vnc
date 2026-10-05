package com.axion.remote.server

import android.util.Log
import com.axion.remote.accessibility.AxionAccessibilityService
import com.axion.remote.capture.ScreenCaptureManager
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.DataInputStream
import java.io.DataOutputStream
import java.io.IOException
import java.net.Socket
import java.util.concurrent.atomic.AtomicBoolean

class RfbClientHandler(
    private val socket: Socket,
    private val passwordProvider: () -> String,
    private val screenCaptureManager: ScreenCaptureManager,
    private val onDisconnect: (RfbClientHandler) -> Unit,
    private val logCallback: (String) -> Unit
) : Runnable {

    companion object {
        private const val TAG = "RfbClientHandler"
    }

    val isRunning = AtomicBoolean(true)
    val clientAddress: String = socket.remoteSocketAddress.toString()

    private var input: DataInputStream? = null
    private var output: DataOutputStream? = null

    private var clientPixelFormat = RfbProtocol.PixelFormat()
    private var supportedEncodings = mutableListOf<Int>()

    override fun run() {
        try {
            socket.tcpNoDelay = true
            socket.soTimeout = 0 // Timeout indefinido para manter sessão aberta

            input = DataInputStream(BufferedInputStream(socket.getInputStream()))
            output = DataOutputStream(BufferedOutputStream(socket.getOutputStream()))

            logCallback("Novo cliente conectado de $clientAddress. Iniciando handshake RFB...")

            // 1. Handshake de versão RFB
            if (!performVersionHandshake()) {
                logCallback("Falha na negociação de versão com $clientAddress")
                return
            }

            // 2. Handshake de Autenticação VNC (DES Challenge-Response)
            if (!performAuthentication()) {
                logCallback("Autenticação rejeitada para $clientAddress")
                return
            }

            // 3. Inicialização (ClientInit e ServerInit)
            if (!performInitialization()) {
                logCallback("Falha na inicialização com $clientAddress")
                return
            }

            logCallback("Cliente autenticado com sucesso: $clientAddress. Sessão ativa.")

            // 4. Loop principal de mensagens RFB
            messageLoop()

        } catch (e: Exception) {
            if (isRunning.get()) {
                Log.w(TAG, "Conexão encerrada com $clientAddress: ${e.message}")
                logCallback("Cliente desconectado: $clientAddress")
            }
        } finally {
            close()
            onDisconnect(this)
        }
    }

    private fun performVersionHandshake(): Boolean {
        // Envia versão do servidor: RFB 003.008\n
        output!!.writeBytes(RfbProtocol.VERSION_STRING)
        output!!.flush()

        // Lê 12 bytes da versão do cliente
        val clientVersionBytes = ByteArray(12)
        input!!.readFully(clientVersionBytes)
        val clientVersion = String(clientVersionBytes, Charsets.US_ASCII).trim()
        Log.i(TAG, "Versão do cliente $clientAddress: $clientVersion")

        return clientVersion.startsWith("RFB")
    }

    private fun performAuthentication(): Boolean {
        val password = passwordProvider()

        if (password.isEmpty()) {
            // Sem senha: tipo 1 (None)
            output!!.writeByte(1) // 1 tipo suportado
            output!!.writeByte(RfbProtocol.SEC_TYPE_NONE)
            output!!.flush()

            val chosenType = input!!.readUnsignedByte()
            if (chosenType != RfbProtocol.SEC_TYPE_NONE) return false

            output!!.writeInt(RfbProtocol.SEC_RESULT_OK)
            output!!.flush()
            return true
        }

        // Com senha: tipo 2 (VNC Authentication)
        output!!.writeByte(1) // 1 tipo oferecido
        output!!.writeByte(RfbProtocol.SEC_TYPE_VNC_AUTH)
        output!!.flush()

        val chosenType = input!!.readUnsignedByte()
        if (chosenType != RfbProtocol.SEC_TYPE_VNC_AUTH) {
            Log.w(TAG, "Cliente selecionou tipo de segurança não suportado: $chosenType")
            return false
        }

        // Gera e envia desafio aleatório de 16 bytes
        val challenge = VncAuth.generateChallenge()
        output!!.write(challenge)
        output!!.flush()

        // Recebe resposta de 16 bytes do RealVNC Viewer
        val response = ByteArray(16)
        input!!.readFully(response)

        val isValid = VncAuth.verifyResponse(challenge, response, password)
        if (isValid) {
            output!!.writeInt(RfbProtocol.SEC_RESULT_OK)
            output!!.flush()
            return true
        } else {
            output!!.writeInt(RfbProtocol.SEC_RESULT_FAILED)
            val errorMsg = "Senha VNC incorreta para AXION Remote"
            output!!.writeInt(errorMsg.length)
            output!!.writeBytes(errorMsg)
            output!!.flush()
            return false
        }
    }

    private fun performInitialization(): Boolean {
        // Lê ClientInit: 1 byte flag shared
        val sharedFlag = input!!.readUnsignedByte()
        Log.d(TAG, "ClientInit flag shared: $sharedFlag")

        // Envia ServerInit
        val width = screenCaptureManager.width
        val height = screenCaptureManager.height

        output!!.writeShort(width)
        output!!.writeShort(height)

        // PixelFormat padrão
        clientPixelFormat.writeTo(output!!)

        // Nome do Desktop
        val nameBytes = RfbProtocol.DESKTOP_NAME.toByteArray(Charsets.US_ASCII)
        output!!.writeInt(nameBytes.size)
        output!!.write(nameBytes)
        output!!.flush()

        return true
    }

    private fun messageLoop() {
        while (isRunning.get() && !socket.isClosed) {
            val msgType = input!!.readUnsignedByte()

            when (msgType) {
                RfbProtocol.CLIENT_MSG_SET_PIXEL_FORMAT -> {
                    input!!.skipBytes(3) // 3 bytes de padding
                    clientPixelFormat = RfbProtocol.PixelFormat.readFrom(input!!)
                }

                RfbProtocol.CLIENT_MSG_SET_ENCODINGS -> {
                    input!!.readByte() // padding
                    val numEncodings = input!!.readUnsignedShort()
                    supportedEncodings.clear()
                    for (i in 0 until numEncodings) {
                        supportedEncodings.add(input!!.readInt())
                    }
                }

                RfbProtocol.CLIENT_MSG_FB_UPDATE_REQUEST -> {
                    val incremental = input!!.readUnsignedByte()
                    val x = input!!.readUnsignedShort()
                    val y = input!!.readUnsignedShort()
                    val w = input!!.readUnsignedShort()
                    val h = input!!.readUnsignedShort()

                    sendFramebufferUpdate(x, y, w, h)
                }

                RfbProtocol.CLIENT_MSG_KEY_EVENT -> {
                    val downFlag = input!!.readUnsignedByte()
                    input!!.skipBytes(2) // padding
                    val key = input!!.readInt()
                    handleKeyEvent(key, downFlag != 0)
                }

                RfbProtocol.CLIENT_MSG_POINTER_EVENT -> {
                    val buttonMask = input!!.readUnsignedByte()
                    val x = input!!.readUnsignedShort()
                    val y = input!!.readUnsignedShort()

                    // Converte coordenadas e despacha evento de toque via AccessibilityService
                    AxionAccessibilityService.instance?.handlePointerEvent(x, y, buttonMask)
                }

                RfbProtocol.CLIENT_MSG_CLIENT_CUT_TEXT -> {
                    input!!.skipBytes(3)
                    val len = input!!.readInt()
                    if (len > 0) {
                        input!!.skipBytes(len)
                    }
                }

                else -> {
                    Log.w(TAG, "Mensagem desconhecida recebida do cliente: $msgType")
                }
            }
        }
    }

    /**
     * Envia um frame da tela capturada para o RealVNC Viewer em codificação RAW
     */
    private fun sendFramebufferUpdate(reqX: Int, reqY: Int, reqW: Int, reqH: Int) {
        val frameData = screenCaptureManager.latestFramebuffer.get()
        val width = screenCaptureManager.width
        val height = screenCaptureManager.height

        synchronized(output!!) {
            // Header do FramebufferUpdate: msgType(0), padding(0), numRectangles(1)
            output!!.writeByte(RfbProtocol.SERVER_MSG_FRAMEBUFFER_UPDATE)
            output!!.writeByte(0) // padding
            output!!.writeShort(1) // 1 retângulo

            // Cabeçalho do Retângulo
            output!!.writeShort(0) // x
            output!!.writeShort(0) // y
            output!!.writeShort(width) // width
            output!!.writeShort(height) // height
            output!!.writeInt(RfbProtocol.ENCODING_RAW) // Encoding RAW (0)

            if (frameData != null && frameData.size == width * height * 4) {
                // Envia os pixels capturados da tela
                output!!.write(frameData)
            } else {
                // Se nenhum frame estiver pronto ainda, envia tela preta temporária
                val blackFrame = ByteArray(width * height * 4)
                output!!.write(blackFrame)
            }

            output!!.flush()
        }
    }

    private fun handleKeyEvent(key: Int, isDown: Boolean) {
        if (!isDown) return
        // Mapeamentos de teclas especiais úteis:
        // 0xff08: BackSpace, 0xff0d: Enter, 0xff1b: Escape -> Voltar no Android
        if (key == 0xff1b) {
            AxionAccessibilityService.instance?.performGlobalAction(android.accessibilityservice.AccessibilityService.GLOBAL_ACTION_BACK)
        } else if (key == 0xff0d) {
            // Enter
            Log.d(TAG, "Key Enter pressionado via VNC")
        }
    }

    fun close() {
        if (isRunning.compareAndSet(true, false)) {
            try {
                input?.close()
                output?.close()
                socket.close()
            } catch (e: Exception) {
                // Ignore
            }
        }
    }
}
