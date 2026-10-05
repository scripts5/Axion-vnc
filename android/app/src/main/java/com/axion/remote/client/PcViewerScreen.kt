package com.axion.remote.client

import android.graphics.Bitmap
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun PcViewerScreen(
    desktopName: String,
    width: Int,
    height: Int,
    frameBitmap: Bitmap?,
    onPointerEvent: (x: Int, y: Int, buttonMask: Int) -> Unit,
    onKeyEvent: (keySym: Int, isDown: Boolean) -> Unit,
    onDisconnect: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    var mouseX by remember { mutableStateOf(width / 2) }
    var mouseY by remember { mutableStateOf(height / 2) }
    var showKeyboardDialog by remember { mutableStateOf(false) }
    var textInput by remember { mutableStateOf("") }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        // Área principal da tela do PC
        BoxWithConstraints(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            val screenW = maxWidth.value
            val screenH = maxHeight.value

            Canvas(
                modifier = Modifier
                    .fillMaxSize()
                    .pointerInput(width, height) {
                        detectTapGestures(
                            onTap = { offset ->
                                val pcX = ((offset.x / size.width) * width).toInt().coerceIn(0, width - 1)
                                val pcY = ((offset.y / size.height) * height).toInt().coerceIn(0, height - 1)
                                mouseX = pcX
                                mouseY = pcY

                                // Clique com botão esquerdo (pressiona e solta)
                                coroutineScope.launch {
                                    onPointerEvent(pcX, pcY, 1) // Button 1 down
                                    delay(50)
                                    onPointerEvent(pcX, pcY, 0) // Button 1 up
                                }
                            },
                            onLongPress = { offset ->
                                val pcX = ((offset.x / size.width) * width).toInt().coerceIn(0, width - 1)
                                val pcY = ((offset.y / size.height) * height).toInt().coerceIn(0, height - 1)
                                mouseX = pcX
                                mouseY = pcY

                                // Clique com botão direito (Button 4 / bit 2)
                                coroutineScope.launch {
                                    onPointerEvent(pcX, pcY, 4) // Right click down
                                    delay(60)
                                    onPointerEvent(pcX, pcY, 0) // Release
                                }
                            }
                        )
                    }
                    .pointerInput(width, height) {
                        detectDragGestures { change, dragAmount ->
                            change.consume()
                            val pcX = ((change.position.x / size.width) * width).toInt().coerceIn(0, width - 1)
                            val pcY = ((change.position.y / size.height) * height).toInt().coerceIn(0, height - 1)
                            mouseX = pcX
                            mouseY = pcY
                            // Move ponteiro
                            onPointerEvent(pcX, pcY, 0)
                        }
                    }
            ) {
                frameBitmap?.let { bmp ->
                    drawImage(
                        image = bmp.asImageBitmap(),
                        dstOffset = IntOffset.Zero,
                        dstSize = IntSize(size.width.toInt(), size.height.toInt())
                    )
                }
            }
        }

        // Barra Superior Flutuante: Nome da máquina e botão desconectar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp)
                .align(Alignment.TopCenter),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Surface(
                color = Color.Black.copy(alpha = 0.75f),
                shape = RoundedCornerShape(12.dp),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFF00FFCC).copy(alpha = 0.5f))
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF00FF66))
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "$desktopName (${width}x${height})",
                        color = Color.White,
                        fontSize = 12.sp
                    )
                }
            }

            IconButton(
                onClick = onDisconnect,
                modifier = Modifier
                    .clip(CircleShape)
                    .background(Color.Red.copy(alpha = 0.8f))
            ) {
                Icon(Icons.Default.Close, contentDescription = "Desconectar", tint = Color.White)
            }
        }

        // Barra Inferior Flutuante: Atalhos rápidos de teclado e mouse
        Surface(
            color = Color.Black.copy(alpha = 0.85f),
            shape = RoundedCornerShape(20.dp),
            border = androidx.compose.foundation.BorderStroke(1.dp, Color.White.copy(alpha = 0.15f)),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 16.dp)
        ) {
            Row(
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                // Teclado
                IconButton(onClick = { showKeyboardDialog = true }) {
                    Icon(Icons.Default.Keyboard, contentDescription = "Teclado", tint = Color(0xFF00FFCC))
                }

                // Botão Direito do Mouse
                TextButton(
                    onClick = {
                        coroutineScope.launch {
                            onPointerEvent(mouseX, mouseY, 4) // Right button down
                            delay(50)
                            onPointerEvent(mouseX, mouseY, 0)
                        }
                    }
                ) {
                    Text("Direito", color = Color.White, fontSize = 12.sp)
                }

                // Tecla Esc
                TextButton(
                    onClick = {
                        coroutineScope.launch {
                            onKeyEvent(0xFF1B, true) // XK_Escape
                            delay(50)
                            onKeyEvent(0xFF1B, false)
                        }
                    }
                ) {
                    Text("ESC", color = Color.White, fontSize = 12.sp)
                }

                // Tecla Windows (Super)
                TextButton(
                    onClick = {
                        coroutineScope.launch {
                            onKeyEvent(0xFFEB, true) // XK_Super_L
                            delay(50)
                            onKeyEvent(0xFFEB, false)
                        }
                    }
                ) {
                    Text("Win", color = Color(0xFF00CCFF), fontSize = 12.sp)
                }

                // Ctrl + Alt + Del
                TextButton(
                    onClick = {
                        coroutineScope.launch {
                            onKeyEvent(0xFFE3, true) // Ctrl
                            onKeyEvent(0xFFE9, true) // Alt
                            onKeyEvent(0xFFFF, true) // Delete
                            delay(80)
                            onKeyEvent(0xFFFF, false)
                            onKeyEvent(0xFFE9, false)
                            onKeyEvent(0xFFE3, false)
                        }
                    }
                ) {
                    Text("CAD", color = Color(0xFFFF3366), fontSize = 11.sp)
                }
            }
        }
    }

    // Diálogo para enviar texto digitado no celular para o computador
    if (showKeyboardDialog) {
        AlertDialog(
            onDismissRequest = { showKeyboardDialog = false },
            title = { Text("Digitar no Computador", color = Color.White) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(
                        "Digite as palavras abaixo e toque em Enviar para digitar no PC:",
                        fontSize = 12.sp,
                        color = Color.LightGray
                    )
                    OutlinedTextField(
                        value = textInput,
                        onValueChange = { textInput = it },
                        placeholder = { Text("Texto a digitar...") },
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        coroutineScope.launch {
                            for (ch in textInput) {
                                val keySym = ch.code
                                onKeyEvent(keySym, true)
                                delay(20)
                                onKeyEvent(keySym, false)
                                delay(20)
                            }
                            textInput = ""
                            showKeyboardDialog = false
                        }
                    }
                ) {
                    Text("Enviar ao PC")
                }
            },
            dismissButton = {
                TextButton(onClick = { showKeyboardDialog = false }) {
                    Text("Cancelar")
                }
            },
            containerColor = Color(0xFF1E1430)
        )
    }
}
