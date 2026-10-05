package com.axion.remote.capture

import android.content.Context
import android.graphics.PixelFormat
import android.hardware.display.DisplayManager
import android.hardware.display.VirtualDisplay
import android.media.Image
import android.media.ImageReader
import android.media.projection.MediaProjection
import android.os.Handler
import android.os.HandlerThread
import android.util.DisplayMetrics
import android.util.Log
import android.view.WindowManager
import java.nio.ByteBuffer
import java.util.concurrent.atomic.AtomicReference

class ScreenCaptureManager(
    private val context: Context,
    private val mediaProjection: MediaProjection
) {
    companion object {
        private const val TAG = "ScreenCapture"
        const val VIRTUAL_DISPLAY_NAME = "AxionVirtualDisplay"
    }

    var width: Int = 720
        private set
    var height: Int = 1280
        private set
    private var densityDpi: Int = DisplayMetrics.DENSITY_DEFAULT

    private var virtualDisplay: VirtualDisplay? = null
    private var imageReader: ImageReader? = null
    private var backgroundThread: HandlerThread? = null
    private var backgroundHandler: Handler? = null

    // Armazena o último framebuffer capturado e processado para o protocolo RFB
    val latestFramebuffer = AtomicReference<ByteArray?>(null)

    // Listener para notificar novos frames prontos para transmissão RFB
    var onFrameAvailableListener: (() -> Unit)? = null

    init {
        determineDisplayMetrics()
    }

    private fun determineDisplayMetrics() {
        val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
        val metrics = DisplayMetrics()
        @Suppress("DEPRECATION")
        windowManager.defaultDisplay.getRealMetrics(metrics)

        // Limita a resolução máxima inicial (ex: 720p ou 1080p) para transmissão fluida via rede
        val maxDim = 1280
        if (metrics.widthPixels > metrics.heightPixels) {
            // Paisagem
            if (metrics.widthPixels > maxDim) {
                val scale = maxDim.toFloat() / metrics.widthPixels
                width = maxDim
                height = (metrics.heightPixels * scale).toInt()
            } else {
                width = metrics.widthPixels
                height = metrics.heightPixels
            }
        } else {
            // Retrato
            if (metrics.heightPixels > maxDim) {
                val scale = maxDim.toFloat() / metrics.heightPixels
                height = maxDim
                width = (metrics.widthPixels * scale).toInt()
            } else {
                width = metrics.widthPixels
                height = metrics.heightPixels
            }
        }

        // Garante que largura e altura sejam pares para alinhamento de memória
        width = (width / 2) * 2
        height = (height / 2) * 2
        densityDpi = metrics.densityDpi
    }

    fun start() {
        backgroundThread = HandlerThread("AxionScreenCapture").apply { start() }
        backgroundHandler = Handler(backgroundThread!!.looper)

        imageReader = ImageReader.newInstance(width, height, PixelFormat.RGBA_8888, 2)
        imageReader!!.setOnImageAvailableListener({ reader ->
            var image: Image? = null
            try {
                image = reader.acquireLatestImage()
                if (image != null) {
                    processImage(image)
                }
            } catch (e: Exception) {
                Log.e(TAG, "Erro ao adquirir imagem da tela: ${e.message}")
            } finally {
                image?.close()
            }
        }, backgroundHandler)

        virtualDisplay = mediaProjection.createVirtualDisplay(
            VIRTUAL_DISPLAY_NAME,
            width,
            height,
            densityDpi,
            DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            imageReader!!.surface,
            null,
            backgroundHandler
        )

        Log.i(TAG, "Captura MediaProjection iniciada: ${width}x${height} @ ${densityDpi}dpi")
    }

    /**
     * Converte o buffer ImageReader RGBA_8888 (com compensação de rowStride e pixelStride)
     * em um array contíguo de bytes RGBX/RGBA pronto para empacotar em RFB FramebufferUpdate.
     */
    private fun processImage(image: Image) {
        val plane = image.planes[0]
        val buffer: ByteBuffer = plane.buffer
        val pixelStride = plane.pixelStride
        val rowStride = plane.rowStride
        val rowPadding = rowStride - pixelStride * width

        val frameBytes = ByteArray(width * height * 4)
        var offset = 0

        for (row in 0 until height) {
            val rowStart = row * rowStride
            buffer.position(rowStart)

            if (pixelStride == 4 && rowPadding == 0) {
                // Linha contígua sem padding
                buffer.get(frameBytes, offset, width * 4)
                offset += width * 4
            } else {
                // Linha com padding ou stride customizado
                for (col in 0 until width) {
                    val pixelPos = rowStart + col * pixelStride
                    buffer.position(pixelPos)
                    frameBytes[offset++] = buffer.get() // R
                    frameBytes[offset++] = buffer.get() // G
                    frameBytes[offset++] = buffer.get() // B
                    frameBytes[offset++] = buffer.get() // A
                }
            }
        }

        latestFramebuffer.set(frameBytes)
        onFrameAvailableListener?.invoke()
    }

    fun stop() {
        try {
            virtualDisplay?.release()
            virtualDisplay = null

            imageReader?.close()
            imageReader = null

            backgroundThread?.quitSafely()
            backgroundThread = null
            backgroundHandler = null

            Log.i(TAG, "Captura MediaProjection finalizada.")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao finalizar captura: ${e.message}")
        }
    }
}
