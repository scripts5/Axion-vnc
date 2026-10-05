package com.axion.remote.client

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.axion.remote.ui.theme.*

@Composable
fun ConnectToPcTab(
    onConnectClick: (host: String, port: Int, password: String) -> Unit,
    errorMessage: String?,
    isConnecting: Boolean
) {
    var pcHost by remember { mutableStateOf("192.168.0.") }
    var pcPort by remember { mutableStateOf("5900") }
    var pcPassword by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // CARD PRINCIPAL: CONEXÃO COM O PC
        Card(
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = AxionSurface),
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, AxionCyan.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
        ) {
            Column(
                modifier = Modifier.padding(18.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column {
                        Text(
                            text = "VER E CONTROLAR MEU PC",
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            color = AxionCyan
                        )
                        Text(
                            text = "A tela do seu computador aparecerá aqui",
                            fontSize = 11.sp,
                            color = AxionTextMuted
                        )
                    }
                    Icon(
                        imageVector = Icons.Default.Computer,
                        contentDescription = null,
                        tint = AxionCyan,
                        modifier = Modifier.size(28.dp)
                    )
                }

                Divider(color = Color.White.copy(alpha = 0.08f))

                // Campo IP do Computador
                OutlinedTextField(
                    value = pcHost,
                    onValueChange = { pcHost = it },
                    label = { Text("IP do Computador (IPv4 ou IPv6)") },
                    placeholder = { Text("Ex: 192.168.0.25") },
                    leadingIcon = {
                        Icon(Icons.Default.Wifi, contentDescription = null, tint = AxionCyan)
                    },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Uri),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = AxionCyan,
                        unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                        focusedLabelColor = AxionCyan,
                        cursorColor = AxionCyan
                    ),
                    singleLine = true
                )

                // Linha com Porta e Senha
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    OutlinedTextField(
                        value = pcPort,
                        onValueChange = { pcPort = it },
                        label = { Text("Porta") },
                        modifier = Modifier.weight(0.35f),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AxionCyan,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f)
                        ),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = pcPassword,
                        onValueChange = { pcPassword = it },
                        label = { Text("Senha do PC (VNC)") },
                        placeholder = { Text("Opcional") },
                        modifier = Modifier.weight(0.65f),
                        visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                        trailingIcon = {
                            IconButton(onClick = { showPassword = !showPassword }) {
                                Icon(
                                    imageVector = if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                    contentDescription = null,
                                    tint = AxionTextMuted
                                )
                            }
                        },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AxionCyan,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f)
                        ),
                        singleLine = true
                    )
                }

                // Exibição de erro se houver
                if (!errorMessage.isNullOrEmpty()) {
                    Surface(
                        color = AxionRed.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(10.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, AxionRed.copy(alpha = 0.4f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.ErrorOutline, contentDescription = null, tint = AxionRed, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(errorMessage, color = Color.White, fontSize = 11.sp)
                        }
                    }
                }

                // Botão Conectar ao PC
                Button(
                    onClick = {
                        val portInt = pcPort.toIntOrNull() ?: 5900
                        onConnectClick(pcHost.trim(), portInt, pcPassword)
                    },
                    enabled = !isConnecting && pcHost.isNotBlank(),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent),
                    contentPadding = PaddingValues(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .background(
                            brush = Brush.horizontalGradient(listOf(AxionCyan, AxionPurple)),
                            shape = RoundedCornerShape(14.dp)
                        )
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        if (isConnecting) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = Color.White,
                                strokeWidth = 2.dp
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Conectando ao Computador...", fontWeight = FontWeight.Bold, color = Color.White)
                        } else {
                            Icon(Icons.Default.Tv, contentDescription = null, tint = Color.White)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("CONECTAR E VER TELA DO PC", fontWeight = FontWeight.Bold, color = Color.White, fontSize = 13.sp)
                        }
                    }
                }
            }
        }

        // DICAS E GUIA RÁPIDO
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = AxionSurfaceVariant),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Text(
                    text = "Como preparar o seu PC:",
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = Color.White
                )
                Text(
                    text = "1. No computador, abra o TightVNC Server, RealVNC Server ou UltraVNC.\n2. Descubra o IP do PC digitando 'ipconfig' no CMD do Windows.\n3. Digite o IP no campo acima e toque em Conectar!",
                    fontSize = 11.sp,
                    color = AxionTextMuted,
                    lineHeight = 16.sp
                )
            }
        }
    }
}
