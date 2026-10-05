package com.axion.remote.security

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

/**
 * Gerenciador seguro de preferências para o AXION Remote.
 * Utiliza EncryptedSharedPreferences e Android Keystore para manter a senha
 * e a porta do servidor VNC protegidas contra acessos não autorizados.
 */
class SecurityPreferences(private val context: Context) {

    private val prefs: SharedPreferences by lazy {
        try {
            val masterKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .build()

            EncryptedSharedPreferences.create(
                context,
                "axion_secure_prefs",
                masterKey,
                EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
                EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
            )
        } catch (e: Exception) {
            // Fallback seguro caso Keystore não esteja disponível no emulador
            context.getSharedPreferences("axion_fallback_prefs", Context.MODE_PRIVATE)
        }
    }

    companion object {
        private const val KEY_PORT = "vnc_port"
        private const val KEY_PASSWORD = "vnc_password"
        const val DEFAULT_PORT = 5900
        const val DEFAULT_PASSWORD = "axion"
    }

    var port: Int
        get() = prefs.getInt(KEY_PORT, DEFAULT_PORT)
        set(value) {
            prefs.edit().putInt(KEY_PORT, value).apply()
        }

    var password: String
        get() = prefs.getString(KEY_PASSWORD, DEFAULT_PASSWORD) ?: DEFAULT_PASSWORD
        set(value) {
            prefs.edit().putString(KEY_PASSWORD, value).apply()
        }

    /**
     * Retorna a senha mascarada para exibição segura na interface
     */
    fun getMaskedPassword(): String {
        val len = password.length
        return "•".repeat(if (len > 0) len else 8)
    }
}
