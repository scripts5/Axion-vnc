# AXION Remote — Servidor VNC/RFB Nativo para Android

O **AXION Remote** transforma o celular Android em um **servidor VNC/RFB autônomo**, permitindo que ele seja controlado remotamente pelo computador utilizando o **RealVNC Viewer**.

---

## 🚀 Como Compilar o APK com Gradle

O projeto Android nativo completo está localizado na pasta `/android/`.

### 1. Entrar na pasta do projeto Android:
```bash
cd android
```

### 2. Compilar o Debug APK:
```bash
# No Linux / macOS:
./gradlew assembleDebug

# No Windows:
gradlew.bat assembleDebug
```

### 3. Localização do APK gerado:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 4. Instalar no celular Android via ADB:
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🖥️ Como Conectar no RealVNC Viewer pelo Computador

1. Abra o **AXION Remote** no celular e toque em **INICIAR SERVIDOR**.
2. Conceda a permissão oficial do Android de gravação de tela (**MediaProjection**).
3. Caso queira controlar por toque/mouse, habilite o **AccessibilityService** nas configurações de acessibilidade.
4. No computador, abra o **RealVNC Viewer**.
5. No campo de endereço, digite o IPv6 formatado com colchetes e a porta:
   ```
   [2001:db8::1234]:5900
   ```
   *(ou o IPv4 local caso estejam na mesma rede Wi-Fi, ex: `192.168.1.100:5900`)*.
6. Digite a senha configurada no aplicativo (padrão: `axion`).
7. A tela do celular será transmitida em tempo real e você poderá interagir com o mouse e teclado!

---

## 📁 Estrutura dos Arquivos Criados

- `android/app/src/main/java/com/axion/remote/MainActivity.kt`: Activity principal e autorização MediaProjection.
- `android/app/src/main/java/com/axion/remote/server/RfbServer.kt`: Servidor TCP dual-stack IPv6/IPv4 escutando em `::`.
- `android/app/src/main/java/com/axion/remote/server/RfbClientHandler.kt`: Protocolo RFB 3.8, ServerInit, FramebufferUpdate e PointerEvent.
- `android/app/src/main/java/com/axion/remote/server/VncAuth.kt`: Autenticação DES oficial do VNC com inversão de bits.
- `android/app/src/main/java/com/axion/remote/capture/ScreenCaptureManager.kt`: Captura com MediaProjection e ImageReader RGBA_8888.
- `android/app/src/main/java/com/axion/remote/accessibility/AxionAccessibilityService.kt`: Despacho oficial de toques com `dispatchGesture()`.
- `android/app/src/main/java/com/axion/remote/network/NetworkManager.kt`: Detecção e priorização de IPv6 Global Unicast (`2000::/3`).
- `android/app/src/main/java/com/axion/remote/security/SecurityPreferences.kt`: Armazenamento seguro de porta e senha via Keystore AES-256.
- `android/app/src/main/java/com/axion/remote/ui/AxionRemoteScreen.kt`: Interface Jetpack Compose oficial do AXION REMOTE.
- `android/app/src/main/AndroidManifest.xml`: Declaração de `foregroundServiceType="mediaProjection"` e Acessibilidade.
- `android/app/build.gradle.kts` e `android/settings.gradle.kts`: Configurações de compilação Gradle.
