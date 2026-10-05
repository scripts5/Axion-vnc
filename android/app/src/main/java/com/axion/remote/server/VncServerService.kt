package com.axion.remote.server

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.media.projection.MediaProjection
import android.media.projection.MediaProjectionManager
import android.os.Binder
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.axion.remote.AxionApplication
import com.axion.remote.MainActivity
import com.axion.remote.R
import com.axion.remote.capture.ScreenCaptureManager
import com.axion.remote.security.SecurityPreferences
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow

class VncServerService : Service() {

    companion object {
        private const val TAG = "VncServerService"
        private const val NOTIFICATION_ID = 1001

        const val ACTION_START = "com.axion.remote.ACTION_START"
        const val ACTION_STOP = "com.axion.remote.ACTION_STOP"
        const val EXTRA_RESULT_CODE = "extra_result_code"
        const val EXTRA_RESULT_DATA = "extra_result_data"

        @Volatile
        var instance: VncServerService? = null
            private set
    }

    private val binder = LocalBinder()
    private var mediaProjection: MediaProjection? = null
    private var screenCaptureManager: ScreenCaptureManager? = null
    private var rfbServer: RfbServer? = null
    private lateinit var securityPreferences: SecurityPreferences

    private val _isServerRunning = MutableStateFlow(false)
    val isServerRunning = _isServerRunning.asStateFlow()

    private val _clientCount = MutableStateFlow(0)
    val clientCount = _clientCount.asStateFlow()

    private val _logs = MutableStateFlow<List<String>>(emptyList())
    val logs = _logs.asStateFlow()

    inner class LocalBinder : Binder() {
        fun getService(): VncServerService = this@VncServerService
    }

    override fun onCreate() {
        super.onCreate()
        instance = this
        securityPreferences = SecurityPreferences(this)
        addLog("Serviço em segundo plano inicializado.")
    }

    override fun onBind(intent: Intent?): IBinder = binder

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START -> {
                val resultCode = intent.getIntExtra(EXTRA_RESULT_CODE, 0)
                val resultData = intent.getParcelableExtra<Intent>(EXTRA_RESULT_DATA)
                if (resultCode != 0 && resultData != null) {
                    startForegroundWithNotification()
                    startServer(resultCode, resultData)
                } else {
                    addLog("Erro: Dados de autorização de tela ausentes.")
                    stopSelf()
                }
            }
            ACTION_STOP -> {
                stopServer()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }
        }
        return START_NOT_STICKY
    }

    private fun startForegroundWithNotification() {
        val stopIntent = Intent(this, VncServerService::class.java).apply {
            action = ACTION_STOP
        }
        val stopPendingIntent = PendingIntent.getService(
            this, 0, stopIntent, PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        val openActivityIntent = Intent(this, MainActivity::class.java)
        val openPendingIntent = PendingIntent.getActivity(
            this, 0, openActivityIntent, PendingIntent.FLAG_IMMUTABLE
        )

        val notification: Notification = NotificationCompat.Builder(this, AxionApplication.CHANNEL_ID)
            .setContentTitle(getString(R.string.notification_title))
            .setContentText("Servidor RFB escutando na porta ${securityPreferences.port}")
            .setSmallIcon(android.R.drawable.ic_menu_share)
            .setContentIntent(openPendingIntent)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, getString(R.string.notification_stop), stopPendingIntent)
            .setOngoing(true)
            .build()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            startForeground(
                NOTIFICATION_ID,
                notification,
                ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PROJECTION
            )
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun startServer(resultCode: Int, resultData: Intent) {
        try {
            val mpManager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
            mediaProjection = mpManager.getMediaProjection(resultCode, resultData)

            if (mediaProjection == null) {
                addLog("Falha: MediaProjection retornou nulo.")
                stopSelf()
                return
            }

            screenCaptureManager = ScreenCaptureManager(this, mediaProjection!!).apply {
                start()
            }

            val port = securityPreferences.port
            rfbServer = RfbServer(
                port = port,
                passwordProvider = { securityPreferences.password },
                screenCaptureManager = screenCaptureManager!!,
                onClientCountChanged = { count ->
                    _clientCount.value = count
                },
                onLog = { msg ->
                    addLog(msg)
                }
            )

            rfbServer!!.start()
            _isServerRunning.value = true
            addLog("Servidor ONLINE. Aguardando conexões no IPv6/IPv4.")

        } catch (e: Exception) {
            Log.e(TAG, "Erro ao iniciar servidor VNC: ${e.message}")
            addLog("Erro fatal ao iniciar servidor: ${e.message}")
            stopServer()
        }
    }

    fun stopServer() {
        try {
            rfbServer?.stop()
            rfbServer = null

            screenCaptureManager?.stop()
            screenCaptureManager = null

            mediaProjection?.stop()
            mediaProjection = null

            _isServerRunning.value = false
            _clientCount.value = 0
            addLog("Servidor parado com sucesso.")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao parar servidor: ${e.message}")
        }
    }

    private fun addLog(message: String) {
        val current = _logs.value.toMutableList()
        val timestamp = java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())
        current.add("[$timestamp] $message")
        if (current.size > 100) {
            current.removeAt(0)
        }
        _logs.value = current
    }

    override fun onDestroy() {
        super.onDestroy()
        stopServer()
        if (instance == this) {
            instance = null
        }
    }
}
