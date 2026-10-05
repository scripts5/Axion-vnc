package com.axion.remote.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val AxionDarkBackground = Color(0xFF07050D)
val AxionSurface = Color(0xFF0E0A1E)
val AxionSurfaceVariant = Color(0xFF16102C)
val AxionPurple = Color(0xFF8B5CF6)
val AxionCyan = Color(0xFF06B6D4)
val AxionGreen = Color(0xFF10B981)
val AxionRed = Color(0xFFEF4444)
val AxionTextPrimary = Color(0xFFF1F5F9)
val AxionTextSecondary = Color(0xFF94A3B8)

private val DarkColorScheme = darkColorScheme(
    primary = AxionPurple,
    secondary = AxionCyan,
    background = AxionDarkBackground,
    surface = AxionSurface,
    onPrimary = Color.White,
    onSecondary = Color.Black,
    onBackground = AxionTextPrimary,
    onSurface = AxionTextPrimary
)

@Composable
fun AxionRemoteTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
