package com.axion.remote.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.content.Context
import android.graphics.Path
import android.provider.Settings
import android.text.TextUtils
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Serviço de acessibilidade do AXION Remote.
 * Utiliza as APIs oficiais do Android (dispatchGesture) para converter
 * eventos de mouse e ponteiro recebidos do RealVNC Viewer em toques na tela.
 */
class AxionAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "AxionAccessibility"
        
        @Volatile
        var instance: AxionAccessibilityService? = null
            private set

        val isServiceRunning = AtomicBoolean(false)

        /**
         * Verifica se o serviço de acessibilidade foi ativado pelo usuário nas configurações do sistema
         */
        fun isAccessibilityEnabled(context: Context): Boolean {
            val expectedComponentName = "${context.packageName}/${AxionAccessibilityService::class.java.canonicalName}"
            val enabledServicesSetting = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            ) ?: return false

            val colonSplitter = TextUtils.SimpleStringSplitter(':')
            colonSplitter.setString(enabledServicesSetting)
            while (colonSplitter.hasNext()) {
                val componentName = colonSplitter.next()
                if (componentName.equals(expectedComponentName, ignoreCase = true)) {
                    return true
                }
            }
            return false
        }
    }

    // Variáveis para rastrear gestos de arrasto contínuo
    private var lastX: Float = 0f
    private var lastY: Float = 0f
    private var isDragging: Boolean = false

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        isServiceRunning.set(true)
        Log.i(TAG, "AXION Accessibility Service conectado e pronto para gestos.")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        // Não consome eventos de acessibilidade de terceiros
    }

    override fun onInterrupt() {
        Log.w(TAG, "AXION Accessibility Service interrompido.")
    }

    override fun onDestroy() {
        super.onDestroy()
        isServiceRunning.set(false)
        if (instance == this) {
            instance = null
        }
    }

    /**
     * Executa um toque rápido (tap) em coordenadas específicas
     */
    fun dispatchTap(x: Float, y: Float, callback: GestureResultCallback? = null) {
        val path = Path().apply {
            moveTo(x, y)
        }
        val stroke = GestureDescription.StrokeDescription(path, 0, 50)
        val gesture = GestureDescription.Builder()
            .addStroke(stroke)
            .build()

        dispatchGesture(gesture, callback, null)
    }

    /**
     * Executa um arrasto/deslize entre dois pontos
     */
    fun dispatchDrag(
        startX: Float,
        startY: Float,
        endX: Float,
        endY: Float,
        durationMs: Long = 200,
        callback: GestureResultCallback? = null
    ) {
        val path = Path().apply {
            moveTo(startX, startY)
            lineTo(endX, endY)
        }
        val stroke = GestureDescription.StrokeDescription(path, 0, durationMs.coerceAtLeast(50))
        val gesture = GestureDescription.Builder()
            .addStroke(stroke)
            .build()

        dispatchGesture(gesture, callback, null)
    }

    /**
     * Processa eventos de ponteiro recebidos pelo protocolo RFB.
     * buttonMask: bit 0 = botão esquerdo (toque na tela), bit 2 = botão direito (voltar)
     */
    fun handlePointerEvent(x: Int, y: Int, buttonMask: Int) {
        val isLeftDown = (buttonMask and 0x01) != 0
        val isRightDown = (buttonMask and 0x04) != 0

        // Botão direito aciona a ação Voltar nativa do Android
        if (isRightDown) {
            performGlobalAction(GLOBAL_ACTION_BACK)
            return
        }

        val fx = x.toFloat()
        val fy = y.toFloat()

        if (isLeftDown) {
            if (!isDragging) {
                // Início do clique
                isDragging = true
                lastX = fx
                lastY = fy
            } else {
                // Movimento com botão pressionado (arrasto suave)
                val dist = Math.hypot((fx - lastX).toDouble(), (fy - lastY).toDouble())
                if (dist > 15) {
                    dispatchDrag(lastX, lastY, fx, fy, 80)
                    lastX = fx
                    lastY = fy
                }
            }
        } else {
            if (isDragging) {
                // Botão liberado: se não houve grande arrasto, executa toque pontual
                isDragging = false
                dispatchTap(fx, fy)
            }
        }
    }
}
