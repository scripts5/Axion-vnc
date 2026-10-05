package com.axion.remote.server

import java.security.SecureRandom
import java.util.Arrays
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

/**
 * Implementação do algoritmo padrão de autenticação VNC (DES Challenge-Response),
 * compatível com o RealVNC Viewer, TightVNC, TigerVNC e outros clientes RFB 3.8.
 *
 * Conforme RFC 6143 (Seção 7.2.2):
 * A chave DES de 8 bytes é derivada da senha com os bits de cada byte invertidos (Lollipop reverse).
 */
object VncAuth {

    private val secureRandom = SecureRandom()

    /**
     * Gera um desafio aleatório de 16 bytes para o cliente VNC
     */
    fun generateChallenge(): ByteArray {
        val challenge = ByteArray(16)
        secureRandom.nextBytes(challenge)
        return challenge
    }

    /**
     * Valida a resposta de 16 bytes enviada pelo RealVNC Viewer contra a senha configurada no aparelho.
     */
    fun verifyResponse(challenge: ByteArray, clientResponse: ByteArray, password: String): Boolean {
        if (challenge.size != 16 || clientResponse.size != 16) {
            return false
        }
        val expected = encryptChallenge(challenge, password)
        return Arrays.equals(expected, clientResponse)
    }

    /**
     * Criptografa o desafio de 16 bytes usando a senha segundo o padrão VNC DES.
     */
    fun encryptChallenge(challenge: ByteArray, password: String): ByteArray {
        val desKeyBytes = formatVncPassword(password)
        val key: SecretKey = SecretKeySpec(desKeyBytes, "DES")
        val cipher = Cipher.getInstance("DES/ECB/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key)

        val result = ByteArray(16)
        // Criptografa os dois blocos de 8 bytes de forma independente
        cipher.doFinal(challenge, 0, 8, result, 0)
        cipher.doFinal(challenge, 8, 8, result, 8)
        return result
    }

    /**
     * Ajusta a senha para exatamente 8 bytes e inverte os bits de cada byte,
     * conforme a especificação oficial do protocolo RFB / VNC.
     */
    private fun formatVncPassword(password: String): ByteArray {
        val pwdBytes = password.toByteArray(Charsets.US_ASCII)
        val key = ByteArray(8)
        val len = Math.min(pwdBytes.size, 8)
        for (i in 0 until len) {
            key[i] = reverseBits(pwdBytes[i])
        }
        // Se a senha tiver menos de 8 caracteres, o restante permanece 0x00 invertido = 0x00
        return key
    }

    /**
     * Inverte a ordem dos bits de um byte (bit 0 vira bit 7, bit 1 vira bit 6, etc.)
     */
    private fun reverseBits(b: Byte): Byte {
        var v = b.toInt() and 0xFF
        var r = 0
        for (i in 0 until 8) {
            r = (r shl 1) or (v and 1)
            v = v shr 1
        }
        return r.toByte()
    }
}
