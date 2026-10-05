package com.axion.remote

import android.Manifest
import android.app.Activity
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.media.projection.MediaProjectionManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.core.content.ContextCompat
import com.axion.remote.client.PcViewerScreen
import com.axion.remote.client.VncClientManager
import com.axion.remote.client.VncConnectionState
import com.axion.remote.network.IpAddressInfo
import com.axion.remote.network.NetworkManager
import com.axion.remote.security.SecurityPreferences
import com.axion.remote.server.VncServerService
import com.axion.remote.ui.AxionRemoteScreen
import com.axion.remote.ui.theme.AxionRemoteTheme
import kotlinx.coroutines.flow.MutableStateFlow

class MainActivity : ComponentActivity() {

    private lateinit var securityPreferences: SecurityPreferences
    private var vncService: VncServerService? = null
    private var isServiceBound = false

    // Estado do Servidor
    private val isServerRunningFlow = MutableStateFlow(false)
    private val clientCountFlow = MutableStateFlow(0)
    private val logsFlow = MutableStateFlow<List<String>>(emptyList())
    private val ipInfoFlow = MutableStateFlow(IpAddressInfo(null, null, null, null))

    // Gerenciador do Cliente VNC (Ver PC no celular)
    private val vncClientManager = VncClientManager()

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as VncServerService.LocalBinder
            vncService = binder.getService()
            isServiceBound = true

            vncService?.let { s ->
                isServerRunningFlow.value = s.isServerRunning.value
                clientCountFlow.value = s.clientCount.value
                logsFlow.value = s.logs.value
            }
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            vncService = null
            isServiceBound = false
            isServerRunningFlow.value = false
        }
    }

    private val mediaProjectionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            startVncForegroundService(result.resultCode, result.data!!)
        } else {
            Toast.makeText(this, "Permissão de captura de tela recusada pelo usuário.", Toast.LENGTH_SHORT).show()
        }
    }

    private val notificationPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            requestMediaProjection()
        } else {
            Toast.makeText(this, "A permissão de notificação é necessária para manter o serviço ativo.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        securityPreferences = SecurityPreferences(this)
        refreshNetworkInfo()

        setContent {
            AxionRemoteTheme {
                val isRunning by isServerRunningFlow.collectAsState()
                val clientCount by clientCountFlow.collectAsState()
                val logs by logsFlow.collectAsState()
                val ipInfo by ipInfoFlow.collectAsState()

                val clientState by vncClientManager.connectionState.collectAsState()
                val clientFrame by vncClientManager.frameBitmap.collectAsState()

                // Se estiver conectado ao PC, exibe o visualizador em tela cheia
                if (clientState is VncConnectionState.Connected) {
                    val connectedState = clientState as VncConnectionState.Connected
                    PcViewerScreen(
                        desktopName = connectedState.desktopName,
                        width = connectedState.width,
                        height = connectedState.height,
                        frameBitmap = clientFrame,
                        onPointerEvent = { x, y, mask -> vncClientManager.sendPointerEvent(x, y, mask) },
                        onKeyEvent = { key, down -> vncClientManager.sendKeyEvent(key, down) },
                        onDisconnect = { vncClientManager.disconnect() }
                    )
                } else {
                    AxionRemoteScreen(
                        isServerRunning = isRunning,
                        clientCount = clientCount,
                        logs = logs,
                        ipInfo = ipInfo,
                        currentPort = securityPreferences.port,
                        currentPassword = securityPreferences.password,
                        vncClientState = clientState,
                        onConnectToPc = { host, port, password ->
                            vncClientManager.connect(host, port, password)
                        },
                        onStartServerClick = { handleStartServer() },
                        onStopServerClick = { handleStopServer() },
                        onSaveConfig = { newPort, newPassword ->
                            securityPreferences.port = newPort
                            securityPreferences.password = newPassword
                            refreshNetworkInfo()
                            Toast.makeText(this, "Configurações salvas!", Toast.LENGTH_SHORT).show()
                        },
                        onRefreshNetwork = { refreshNetworkInfo() }
                    )
                }
            }
        }
    }

    override fun onStart() {
        super.onStart()
        val intent = Intent(this, VncServerService::class.java)
        bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE)
    }

    override fun onStop() {
        super.onStop()
        if (isServiceBound) {
            unbindService(serviceConnection)
            isServiceBound = false
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        vncClientManager.disconnect()
    }

    private fun handleStartServer() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
                return
            }
        }
        requestMediaProjection()
    }

    private fun requestMediaProjection() {
        val mpManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjectionLauncher.launch(mpManager.createScreenCaptureIntent())
    }

    private fun startVncForegroundService(resultCode: Int, data: Intent) {
        val serviceIntent = Intent(this, VncServerService::class.java).apply {
            action = VncServerService.ACTION_START
            putExtra(VncServerService.EXTRA_RESULT_CODE, resultCode)
            putExtra(VncServerService.EXTRA_RESULT_DATA, data)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            startForegroundService(serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    private fun handleStopServer() {
        val stopIntent = Intent(this, VncServerService::class.java).apply {
            action = VncServerService.ACTION_STOP
        }
        startService(stopIntent)
    }

    private fun refreshNetworkInfo() {
        Thread {
            val info = NetworkManager.getDeviceIpAddresses()
            runOnUiThread {
                ipInfoFlow.value = info
            }
        }.start()
    }
}
