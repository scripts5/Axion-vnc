package com.axion.remote.server

import java.io.DataInputStream
import java.io.DataOutputStream

/**
 * Constantes e definições do protocolo RFB 3.8 (RFC 6143),
 * padrão universal do VNC implementado pelo RealVNC Viewer.
 */
object RfbProtocol {

    const val VERSION_STRING = "RFB 003.008\n"
    const val DESKTOP_NAME = "AXION Remote"

    // Tipos de Segurança RFB
    const val SEC_TYPE_NONE = 1
    const val SEC_TYPE_VNC_AUTH = 2

    // Resultados de Segurança
    const val SEC_RESULT_OK = 0
    const val SEC_RESULT_FAILED = 1

    // Mensagens Cliente -> Servidor
    const val CLIENT_MSG_SET_PIXEL_FORMAT = 0
    const val CLIENT_MSG_SET_ENCODINGS = 2
    const val CLIENT_MSG_FB_UPDATE_REQUEST = 3
    const val CLIENT_MSG_KEY_EVENT = 4
    const val CLIENT_MSG_POINTER_EVENT = 5
    const val CLIENT_MSG_CLIENT_CUT_TEXT = 6

    // Mensagens Servidor -> Cliente
    const val SERVER_MSG_FRAMEBUFFER_UPDATE = 0
    const val SERVER_MSG_BELL = 2
    const val SERVER_MSG_SERVER_CUT_TEXT = 3

    // Tipos de Encodings
    const val ENCODING_RAW = 0
    const val ENCODING_COPYRECT = 1
    const val ENCODING_DESKTOP_SIZE = -223
    const val ENCODING_CURSOR = -239

    data class PixelFormat(
        var bitsPerPixel: Int = 32,
        var depth: Int = 24,
        var bigEndian: Int = 0,
        var trueColour: Int = 1,
        var redMax: Int = 255,
        var greenMax: Int = 255,
        var blueMax: Int = 255,
        var redShift: Int = 16,
        var greenShift: Int = 8,
        var blueShift: Int = 0
    ) {
        fun writeTo(out: DataOutputStream) {
            out.writeByte(bitsPerPixel)
            out.writeByte(depth)
            out.writeByte(bigEndian)
            out.writeByte(trueColour)
            out.writeShort(redMax)
            out.writeShort(greenMax)
            out.writeShort(blueMax)
            out.writeByte(redShift)
            out.writeByte(greenShift)
            out.writeByte(blueShift)
            out.write(ByteArray(3)) // 3 bytes de padding
        }

        companion object {
            fun readFrom(input: DataInputStream): PixelFormat {
                val bpp = input.readUnsignedByte()
                val depth = input.readUnsignedByte()
                val bigEndian = input.readUnsignedByte()
                val trueColour = input.readUnsignedByte()
                val rMax = input.readUnsignedShort()
                val gMax = input.readUnsignedShort()
                val bMax = input.readUnsignedShort()
                val rShift = input.readUnsignedByte()
                val gShift = input.readUnsignedByte()
                val bShift = input.readUnsignedByte()
                input.skipBytes(3) // pular 3 bytes de padding

                return PixelFormat(bpp, depth, bigEndian, trueColour, rMax, gMax, bMax, rShift, gShift, bShift)
            }
        }
    }
}
