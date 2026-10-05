package com.axion.remote.ui

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.axion.remote.accessibility.AxionAccessibilityService
import com.axion.remote.client.ConnectToPcTab
import com.axion.remote.client.VncConnectionState
import com.axion.remote.network.IpAddressInfo
import com.axion.remote.ui.theme.*

@Composable
fun AxionRemoteScreen(
    isServerRunning: Boolean,
    clientCount: Int,
    logs: List<String>,
    ipInfo: IpAddressInfo,
    currentPort: Int,
    currentPassword: String,
    vncClientState: VncConnectionState,
    onConnectToPc: (host: String, port: Int, password: String) -> Unit,
    onStartServerClick: () -> Unit,
    onStopServerClick: () -> Unit,
    onSaveConfig: (newPort: Int, newPassword: String) -> Unit,
    onRefreshNetwork: () -> Unit
) {
    val context = LocalContext.current
    var showConfigDialog by remember { mutableStateOf(false) }
    var showPasswordPlain by remember { mutableStateOf(false) }
    var selectedTab by remember { mutableIntStateOf(0) } // 0: Ver Meu PC, 1: Transmitir Celular
    val isAccessibilityActive = AxionAccessibilityService.isAccessibilityEnabled(context)

    Scaffold(
        containerColor = AxionDarkBackground,
        topBar = {
            TopAppBar(
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(10.dp)
                                .clip(CircleShape)
                                .background(if (isServerRunning) AxionGreen else AxionCyan)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "AXION REMOTE",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = 1.5.sp,
                            color = Color.White
                        )
                    }
                },
                actions = {
                    IconButton(onClick = onRefreshNetwork) {
                        Icon(
                            imageVector = Icons.Default.Refresh,
                            contentDescription = "Atualizar Rede",
                            tint = AxionCyan
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = AxionDarkBackground)
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {

            // SELETOR DE MODO (DUAL-MODE: VER PC / TRANSMITIR CELULAR)
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = AxionSurface,
                contentColor = AxionCyan,
                modifier = Modifier
                    .clip(RoundedCornerShape(14.dp))
                    .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(14.dp))
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("VER MEU PC", fontWeight = FontWeight.Bold, fontSize = 11.5.sp) },
                    icon = { Icon(Icons.Default.Computer, contentDescription = null, modifier = Modifier.size(18.dp)) }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("TRANSMITIR CELULAR", fontWeight = FontWeight.Bold, fontSize = 11.5.sp) },
                    icon = { Icon(Icons.Default.Sensors, contentDescription = null, modifier = Modifier.size(18.dp)) }
                )
            }

            if (selectedTab == 0) {
                // ABA 1: CLIENTE VNC (VER TELA DO COMPUTADOR NO CELULAR)
                ConnectToPcTab(
                    onConnectClick = onConnectToPc,
                    errorMessage = if (vncClientState is VncConnectionState.Error) (vncClientState as VncConnectionState.Error).message else null,
                    isConnecting = vncClientState is VncConnectionState.Connecting
                )
            } else {
                // ABA 2: SERVIDOR VNC (TRANSMITIR A TELA DO CELULAR)
                Column(
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
            // CARD PRINCIPAL: STATUS DO SERVIDOR
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = AxionSurface),
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        1.dp,
                        if (isServerRunning) AxionGreen.copy(alpha = 0.5f) else AxionPurple.copy(alpha = 0.3f),
                        RoundedCornerShape(20.dp)
                    )
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    // Header de Estado
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "●",
                                color = if (isServerRunning) AxionGreen else AxionRed,
                                fontSize = 16.sp,
                                modifier = Modifier.padding(end = 6.dp)
                            )
                            Text(
                                text = if (isServerRunning) "SERVIDOR ONLINE" else "SERVIDOR OFFLINE",
                                fontWeight = FontWeight.Bold,
                                fontSize = 16.sp,
                                letterSpacing = 1.sp,
                                color = if (isServerRunning) AxionGreen else AxionRed
                            )
                        }

                        if (isServerRunning) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = AxionCyan.copy(alpha = 0.2f),
                                border = androidx.compose.foundation.BorderStroke(1.dp, AxionCyan.copy(alpha = 0.4f))
                            ) {
                                Text(
                                    text = "Clientes: $clientCount",
                                    color = AxionCyan,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                )
                            }
                        }
                    }

                    HorizontalDivider(color = Color.White.copy(alpha = 0.08f))

                    // IPv6
                    Column {
                        Text(
                            text = "IPv6:",
                            fontSize = 12.sp,
                            fontFamily = FontFamily.Monospace,
                            color = AxionTextSecondary
                        )
                        Text(
                            text = ipInfo.getDisplayIpv6(),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            fontFamily = FontFamily.Monospace,
                            color = AxionTextPrimary
                        )
                    }

                    // Porta e Senha Lado a Lado
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Porta:",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AxionTextSecondary
                            )
                            Text(
                                text = "$currentPort",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                color = AxionCyan
                            )
                        }

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Senha VNC:",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AxionTextSecondary
                            )
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(
                                    text = if (showPasswordPlain) currentPassword else "•".repeat(currentPassword.length.coerceAtLeast(6)),
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = AxionPurple
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                IconButton(
                                    onClick = { showPasswordPlain = !showPasswordPlain },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(
                                        imageVector = if (showPasswordPlain) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                        contentDescription = "Alternar Visibilidade",
                                        tint = AxionTextSecondary,
                                        modifier = Modifier.size(16.dp)
                                    )
                                }
                            }
                        }
                    }

                    // Status
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(
                                text = "Status:",
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AxionTextSecondary
                            )
                            Text(
                                text = if (isServerRunning) "ONLINE" else "OFFLINE",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isServerRunning) AxionGreen else AxionTextSecondary
                            )
                        }

                        Column(horizontalAlignment = Alignment.End) {
                            Text(
                                text = "Formato RealVNC:",
                                fontSize = 11.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AxionTextSecondary
                            )
                            Text(
                                text = ipInfo.getFormattedAddress(currentPort),
                                fontSize = 12.sp,
                                fontFamily = FontFamily.Monospace,
                                color = AxionCyan
                            )
                        }
                    }
                }
            }

            // BOTÕES DE CONTROLE
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // CONFIGURAR
                OutlinedButton(
                    onClick = { showConfigDialog = true },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AxionPurple),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AxionPurple.copy(alpha = 0.5f))
                ) {
                    Icon(Icons.Default.Settings, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("CONFIGURAR", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }

                // COPIAR DADOS
                OutlinedButton(
                    onClick = {
                        val formatted = ipInfo.getFormattedAddress(currentPort)
                        val textToCopy = "Endereço: $formatted\nSenha: $currentPassword"
                        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                        clipboard.setPrimaryClip(ClipData.newPlainText("AXION Remote", textToCopy))
                        Toast.makeText(context, "Dados copiados! Cole no RealVNC Viewer: $formatted", Toast.LENGTH_LONG).show()
                    },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = AxionCyan),
                    border = androidx.compose.foundation.BorderStroke(1.dp, AxionCyan.copy(alpha = 0.5f))
                ) {
                    Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("COPIAR DADOS", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }

            // BOTÃO PRINCIPAL: INICIAR / PARAR SERVIDOR
            if (!isServerRunning) {
                Button(
                    onClick = onStartServerClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AxionPurple)
                ) {
                    Icon(Icons.Default.PlayArrow, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "INICIAR SERVIDOR",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            } else {
                Button(
                    onClick = onStopServerClick,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AxionRed)
                ) {
                    Icon(Icons.Default.Stop, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "PARAR SERVIDOR",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.sp
                    )
                }
            }

            // STATUS DE ACESSIBILIDADE / CONTROLE REMOTO
            Surface(
                shape = RoundedCornerShape(12.dp),
                color = if (isAccessibilityActive) AxionSurface else AxionSurfaceVariant,
                border = androidx.compose.foundation.BorderStroke(
                    1.dp,
                    if (isAccessibilityActive) AxionGreen.copy(alpha = 0.3f) else AxionPurple.copy(alpha = 0.4f)
                ),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .padding(12.dp)
                        .fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            imageVector = if (isAccessibilityActive) Icons.Default.CheckCircle else Icons.Default.Warning,
                            contentDescription = null,
                            tint = if (isAccessibilityActive) AxionGreen else Color(0xFFFBBF24),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = if (isAccessibilityActive) "Controle por Toque Ativo" else "Controle por Toque Desativado",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = AxionTextPrimary
                            )
                            Text(
                                text = if (isAccessibilityActive) "AccessibilityService conectado para gestos" else "Toque para ativar nas configurações",
                                fontSize = 10.sp,
                                color = AxionTextSecondary
                            )
                        }
                    }

                    if (!isAccessibilityActive) {
                        TextButton(
                            onClick = {
                                val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
                                context.startActivity(intent)
                            }
                        ) {
                            Text("HABILITAR", fontSize = 11.sp, color = AxionCyan, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // LOGS DE DIAGNÓSTICO
            Column(modifier = Modifier.weight(1f)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "LOGS DE DIAGNÓSTICO",
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        color = AxionTextSecondary,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = "${logs.size} eventos",
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        color = AxionTextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0xFF040308))
                        .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(12.dp))
                        .padding(8.dp)
                ) {
                    val listState = rememberLazyListState()
                    LaunchedEffect(logs.size) {
                        if (logs.isNotEmpty()) {
                            listState.animateScrollToItem(logs.size - 1)
                        }
                    }

                    if (logs.isEmpty()) {
                        Text(
                            text = "Nenhum evento registrado ainda.\nInicie o servidor para visualizar conexões RFB.",
                            fontSize = 11.sp,
                            fontFamily = FontFamily.Monospace,
                            color = AxionTextSecondary.copy(alpha = 0.5f),
                            modifier = Modifier.padding(8.dp)
                        )
                    } else {
                        LazyColumn(state = listState) {
                            items(logs) { log ->
                                Text(
                                    text = log,
                                    fontSize = 10.5.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = if (log.contains("Erro", ignoreCase = true) || log.contains("Falha", ignoreCase = true)) {
                                        AxionRed
                                    } else if (log.contains("ONLINE", ignoreCase = true) || log.contains("sucesso", ignoreCase = true)) {
                                        AxionGreen
                                    } else {
                                        Color(0xFFCBD5E1)
                                    },
                                    modifier = Modifier.padding(vertical = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
                } // Fecha Column do Servidor
            } // Fecha else (Modo Servidor)
        }
    }

    // DIÁLOGO DE CONFIGURAÇÃO (PORTA & SENHA)
    if (showConfigDialog) {
        var tempPort by remember { mutableStateOf(currentPort.toString()) }
        var tempPassword by remember { mutableStateOf(currentPassword) }

        AlertDialog(
            onDismissRequest = { showConfigDialog = false },
            containerColor = AxionSurface,
            title = {
                Text("Configurar Servidor VNC", color = Color.White, fontWeight = FontWeight.Bold)
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "Altere a porta TCP e a senha utilizada para autenticar conexões vindas do RealVNC Viewer.",
                        fontSize = 12.sp,
                        color = AxionTextSecondary
                    )

                    OutlinedTextField(
                        value = tempPort,
                        onValueChange = { tempPort = it },
                        label = { Text("Porta TCP (ex: 5900)") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AxionPurple,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = tempPassword,
                        onValueChange = { tempPassword = it },
                        label = { Text("Senha VNC (máx 8 caracteres)") },
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = AxionPurple,
                            unfocusedBorderColor = Color.White.copy(alpha = 0.2f),
                            focusedTextColor = Color.White,
                            unfocusedTextColor = Color.White
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val portInt = tempPort.toIntOrNull() ?: 5900
                        onSaveConfig(portInt, tempPassword)
                        showConfigDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AxionPurple)
                ) {
                    Text("Salvar")
                }
            },
            dismissButton = {
                TextButton(onClick = { showConfigDialog = false }) {
                    Text("Cancelar", color = AxionTextSecondary)
                }
            }
        )
    }
}
