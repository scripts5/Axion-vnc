package com.axion.remote.server

import android.util.Log
import com.axion.remote.capture.ScreenCaptureManager
import java.io.IOException
import java.net.InetAddress
import java.net.ServerSocket
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.atomic.AtomicBoolean

class RfbServer(
    val port: Int,
    private val passwordProvider: () -> String,
    private val screenCaptureManager: ScreenCaptureManager,
    private val onClientCountChanged: (Int) -> Unit,
    private val onLog: (String) -> Unit
) {
    companion object {
        private const val TAG = "RfbServer"
    }

    private var serverSocket: ServerSocket? = null
    private var acceptThread: Thread? = null
    val isRunning = AtomicBoolean(false)

    private val connectedClients = CopyOnWriteArrayList<RfbClientHandler>()

    fun start() {
        if (isRunning.get()) return

        try {
            // "::" (IPv6 any / in6addr_any) aceita conexões tanto IPv6 quanto IPv4 em kernels Linux/Android modernos
            val bindAddress = InetAddress.getByName("::")
            serverSocket = ServerSocket(port, 50, bindAddress)
            isRunning.set(true)

            onLog("Servidor RFB/VNC iniciado na porta $port (IPv6 e IPv4 ativos)")
            Log.i(TAG, "Servidor RFB escutando em [::]:$port")

            acceptThread = Thread({
                while (isRunning.get() && serverSocket != null && !serverSocket!!.isClosed) {
                    try {
                        val clientSocket = serverSocket!!.accept()
                        val handler = RfbClientHandler(
                            socket = clientSocket,
                            passwordProvider = passwordProvider,
                            screenCaptureManager = screenCaptureManager,
                            onDisconnect = { client ->
                                connectedClients.remove(client)
                                onClientCountChanged(connectedClients.size)
                                onLog("Cliente desconectado. Total conectados: ${connectedClients.size}")
                            },
                            logCallback = { msg -> onLog(msg) }
                        )

                        connectedClients.add(handler)
                        onClientCountChanged(connectedClients.size)
                        Thread(handler, "RfbClient-${clientSocket.remoteSocketAddress}").start()

                    } catch (e: IOException) {
                        if (isRunning.get()) {
                            Log.e(TAG, "Erro no accept do servidor: ${e.message}")
                        }
                    }
                }
            }, "AxionVncAcceptThread").apply { start() }

        } catch (e: Exception) {
            isRunning.set(false)
            Log.e(TAG, "Falha ao iniciar servidor VNC na porta $port: ${e.message}")
            onLog("Erro ao iniciar servidor na porta $port: ${e.message}")
            throw e
        }
    }

    fun stop() {
        if (!isRunning.compareAndSet(true, false)) return

        try {
            onLog("Encerrando servidor RFB/VNC...")
            serverSocket?.close()
            serverSocket = null

            // Encerra todos os clientes conectados
            for (client in connectedClients) {
                client.close()
            }
            connectedClients.clear()
            onClientCountChanged(0)

            acceptThread?.interrupt()
            acceptThread = null
            onLog("Servidor RFB/VNC parado.")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao parar servidor VNC: ${e.message}")
        }
    }

    fun getConnectedClientsCount(): Int = connectedClients.size
}
