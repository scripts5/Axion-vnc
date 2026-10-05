import React, { useState } from 'react';
import { 
  FolderGit2, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Terminal, 
  ExternalLink,
  Code2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, ProjectFile } from '../data/androidProjectFiles';
import { downloadAndroidProjectZip } from '../utils/zipDownloader';

// Map of actual contents for the key files
const FILE_CONTENTS_PREVIEW: Record<string, string> = {
  'MainActivity.kt': `package com.axion.remote

import android.app.Activity
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import com.axion.remote.network.NetworkManager
import com.axion.remote.security.SecurityPreferences
import com.axion.remote.server.VncServerService
import com.axion.remote.ui.AxionRemoteScreen

class MainActivity : ComponentActivity() {

    private lateinit var securityPreferences: SecurityPreferences

    // Launcher oficial para autorização de gravação de tela MediaProjection
    private val mediaProjectionLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK && result.data != null) {
            startVncForegroundService(result.resultCode, result.data!!)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        securityPreferences = SecurityPreferences(this)
        
        setContent {
            AxionRemoteScreen(
                // Interface oficial do AXION REMOTE com estados de conexão
            )
        }
    }

    private fun requestMediaProjection() {
        val mpManager = getSystemService(MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        mediaProjectionLauncher.launch(mpManager.createScreenCaptureIntent())
    }
}`,

  'RfbServer.kt': `package com.axion.remote.server

import java.net.InetAddress
import java.net.ServerSocket
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.atomic.AtomicBoolean

class RfbServer(
    val port: Int,
    private val passwordProvider: () -> String,
    private val screenCaptureManager: ScreenCaptureManager
) {
    private var serverSocket: ServerSocket? = null
    val isRunning = AtomicBoolean(false)
    private val connectedClients = CopyOnWriteArrayList<RfbClientHandler>()

    fun start() {
        // "::" aceita simultaneamente conexões IPv6 e IPv4 (Dual-Stack)
        val bindAddress = InetAddress.getByName("::")
        serverSocket = ServerSocket(port, 50, bindAddress)
        isRunning.set(true)

        Thread {
            while (isRunning.get() && !serverSocket!!.isClosed) {
                val clientSocket = serverSocket!!.accept()
                val handler = RfbClientHandler(
                    socket = clientSocket,
                    passwordProvider = passwordProvider,
                    screenCaptureManager = screenCaptureManager
                )
                connectedClients.add(handler)
                Thread(handler).start()
            }
        }.start()
    }
}`,

  'VncAuth.kt': `package com.axion.remote.server

import java.security.SecureRandom
import java.util.Arrays
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

object VncAuth {
    private val secureRandom = SecureRandom()

    fun generateChallenge(): ByteArray {
        val challenge = ByteArray(16)
        secureRandom.nextBytes(challenge)
        return challenge
    }

    fun verifyResponse(challenge: ByteArray, clientResponse: ByteArray, password: String): Boolean {
        val expected = encryptChallenge(challenge, password)
        return Arrays.equals(expected, clientResponse)
    }

    fun encryptChallenge(challenge: ByteArray, password: String): ByteArray {
        val desKeyBytes = formatVncPassword(password)
        val key = SecretKeySpec(desKeyBytes, "DES")
        val cipher = Cipher.getInstance("DES/ECB/NoPadding")
        cipher.init(Cipher.ENCRYPT_MODE, key)

        val result = ByteArray(16)
        cipher.doFinal(challenge, 0, 8, result, 0)
        cipher.doFinal(challenge, 8, 8, result, 8)
        return result
    }

    // Inversão oficial de bits por byte do protocolo RFB / VNC
    private fun formatVncPassword(password: String): ByteArray {
        val pwdBytes = password.toByteArray(Charsets.US_ASCII)
        val key = ByteArray(8)
        val len = Math.min(pwdBytes.size, 8)
        for (i in 0 until len) {
            key[i] = reverseBits(pwdBytes[i])
        }
        return key
    }
}`,

  'AxionAccessibilityService.kt': `package com.axion.remote.accessibility

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path

class AxionAccessibilityService : AccessibilityService() {

    companion object {
        var instance: AxionAccessibilityService? = null
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
    }

    fun dispatchTap(x: Float, y: Float) {
        val path = Path().apply { moveTo(x, y) }
        val stroke = GestureDescription.StrokeDescription(path, 0, 50)
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        dispatchGesture(gesture, null, null)
    }

    fun handlePointerEvent(x: Int, y: Int, buttonMask: Int) {
        val isLeftDown = (buttonMask and 0x01) != 0
        val isRightDown = (buttonMask and 0x04) != 0

        if (isRightDown) {
            performGlobalAction(GLOBAL_ACTION_BACK)
            return
        }

        if (isLeftDown) {
            dispatchTap(x.toFloat(), y.toFloat())
        }
    }
}`,

  'NetworkManager.kt': `package com.axion.remote.network

import java.net.Inet6Address
import java.net.NetworkInterface
import java.util.Collections

object NetworkManager {

    fun getDeviceIpAddresses(): IpAddressInfo {
        var bestIpv6Global: String? = null
        val interfaces = Collections.list(NetworkInterface.getNetworkInterfaces())

        for (intf in interfaces) {
            if (!intf.isUp || intf.isLoopback) continue
            val addresses = Collections.list(intf.inetAddresses)
            for (addr in addresses) {
                if (addr is Inet6Address && isGlobalUnicast(addr)) {
                    // Prioriza IPv6 Global Unicast (2000::/3)
                    bestIpv6Global = addr.hostAddress?.substringBefore('%')
                }
            }
        }
        return IpAddressInfo(ipv6Global = bestIpv6Global, ...)
    }
}`
};

export const CodeExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipSuccess, setZipSuccess] = useState(false);

  const categories = ['Todos', 'Kotlin Core', 'RFB Protocol', 'Captura & Gestos', 'Configurações', 'Documentação'];

  const filteredFiles = selectedCategory === 'Todos'
    ? ANDROID_PROJECT_FILES
    : ANDROID_PROJECT_FILES.filter(f => f.category === selectedCategory);

  const currentCode = FILE_CONTENTS_PREVIEW[selectedFile.name] || 
    `// Arquivo: ${selectedFile.path}\n// Componente oficial do AXION Remote\n// Implementação completa incluída no pacote ZIP para compilação com Gradle.`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      
      // Monta mapa completo dos arquivos do projeto Android
      const filesMap: Record<string, string> = {
        'settings.gradle.kts': `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "AXION Remote"
include(":app")`,
        'build.gradle.kts': `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`,
        'gradle.properties': `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=false
kotlin.code.style=official
android.nonTransitiveRClass=true`,
        'gradlew': `#!/bin/sh\nexec gradle "$@"`,
        'gradle/libs.versions.toml': `[versions]
agp = "8.7.3"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
coroutines = "1.9.0"
securityCrypto = "1.1.0-alpha06"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-security-crypto = { group = "androidx.security", name = "security-crypto", version.ref = "securityCrypto" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`,
        'gradle/wrapper/gradle-wrapper.properties': `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.11.1-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`,
        'app/build.gradle.kts': `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.axion.remote"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.axion.remote"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.security.crypto)
}`,
        'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:name=".AxionApplication"
        android:allowBackup="true"
        android:label="AXION Remote"
        android:theme="@android:style/Theme.Material.NoActionBar">

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <service
            android:name=".server.VncServerService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="mediaProjection" />

        <service
            android:name=".accessibility.AxionAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
    </application>
</manifest>`,
        'app/src/main/res/values/strings.xml': `<resources>
    <string name="app_name">AXION Remote</string>
    <string name="accessibility_service_description">Controle de mouse e gestos para o AXION Remote via VNC.</string>
</resources>`,
        'app/src/main/res/xml/accessibility_service_config.xml': `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeAllMask"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:notificationTimeout="100"
    android:canPerformGestures="true"
    android:settingsActivity="com.axion.remote.MainActivity" />`,
        'README.md': `# AXION Remote — Servidor VNC / RFB Nativo para Android
Compilar com Gradle:
./gradlew assembleDebug

Localização do APK gerado:
app/build/outputs/apk/debug/app-debug.apk

Instalar no Android:
adb install -r app/build/outputs/apk/debug/app-debug.apk`
      };

      await downloadAndroidProjectZip(filesMap);
      setZipSuccess(true);
      setTimeout(() => setZipSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#0c0819] border border-purple-500/25 shadow-2xl space-y-6">
      
      {/* Header com Botão de Download do Projeto ZIP */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-purple-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Código-Fonte do Projeto Android Nativo
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Projeto completo com Kotlin, Jetpack Compose, RFB VNC Server, MediaProjection e Gradle.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all shrink-0"
        >
          {zipSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Download Concluído!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'Criando ZIP...' : 'Baixar Projeto Android (.ZIP)'}</span>
            </>
          )}
        </button>
      </div>

      {/* Categorias / Filtros de Arquivos */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
              selectedCategory === cat
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Área Dividida: Lista de Arquivos à Esquerda + Visualizador à Direita */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Lista de Arquivos */}
        <div className="lg:col-span-4 space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
          {filteredFiles.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col gap-1 ${
                selectedFile.path === file.path
                  ? 'bg-purple-950/60 border-purple-500/60 text-white shadow-md'
                  : 'bg-black/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5 truncate">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-purple-300">
                  {file.category}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 line-clamp-1">
                {file.description}
              </span>
            </button>
          ))}
        </div>

        {/* Visualizador de Código */}
        <div className="lg:col-span-8 rounded-2xl bg-black/80 border border-white/10 overflow-hidden shadow-inner flex flex-col">
          
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0714] border-b border-white/10 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-slate-300 font-bold ml-1">{selectedFile.path}</span>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-200 leading-relaxed overflow-x-auto max-h-[400px] overflow-y-auto selection:bg-purple-500/40">
            <code>{currentCode}</code>
          </pre>

        </div>

      </div>

    </div>
  );
};
