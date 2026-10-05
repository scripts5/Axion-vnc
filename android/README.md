# AXION Remote — Servidor VNC / RFB Nativo para Android

O **AXION Remote** é um aplicativo Android nativo completo que transforma o smartphone ou tablet em um **Servidor VNC/RFB autônomo**. Ele permite que você controle seu celular remotamente pelo computador utilizando o **RealVNC Viewer** (ou qualquer outro cliente VNC padrão), com suporte total a **IPv6**, transmissão de tela via **MediaProjection** e controle de toques e gestos via **AccessibilityService**.

> **IMPORTANTE:** Este aplicativo **NÃO** é um cliente VNC e **NÃO** depende de servidores ou binários externos (como DroidVNC-NG ou VNC Server de terceiros). O protocolo RFB 3.8 está integralmente implementado em Kotlin dentro do próprio aplicativo.

---

## 🏗️ Arquitetura do Projeto

O projeto é modular e dividido em camadas especializadas:

1. **Servidor RFB / VNC (`com.axion.remote.server`)**:
   - `RfbServer.kt`: Escuta em socket dual-stack (`::`), aceitando conexões simultâneas em **IPv6** e **IPv4**.
   - `RfbClientHandler.kt`: Gerencia o ciclo de vida da conexão com o RealVNC Viewer:
     - Handshake de versão (`RFB 003.008\n`);
     - Autenticação VNC segura via **DES Challenge-Response** (`VncAuth.kt`);
     - Negociação de PixelFormat e Encodings (RAW, CopyRect, DesktopSize);
     - Streaming de atualizações de tela (`FramebufferUpdate`);
     - Processamento de eventos de teclado e mouse/ponteiro (`PointerEvent`).
   - `VncAuth.kt`: Implementa o algoritmo criptográfico oficial VNC DES (8-byte bit-reversed key, desafio aleatório de 16 bytes).
   - `RfbProtocol.kt`: Especificação dos pacotes binários e estruturas do RFC 6143.

2. **Captura de Tela em Alta Fidelidade (`com.axion.remote.capture`)**:
   - `ScreenCaptureManager.kt`: Utiliza a API oficial `MediaProjection` com `VirtualDisplay` e `ImageReader` em `PixelFormat.RGBA_8888`.
   - Conversão eficiente de buffers de vídeo com alinhamento de memória e compensação de `rowStride` e `pixelStride`.

3. **Injeção de Gestos e Toques (`com.axion.remote.accessibility`)**:
   - `AxionAccessibilityService.kt`: Implementa o serviço de acessibilidade do Android com `dispatchGesture()`.
   - Converte cliques do mouse do computador em toques pontuais (50ms) e movimentos de arrasto suave no Android. Botão direito aciona a ação nativa "Voltar" (`GLOBAL_ACTION_BACK`).

4. **Gerenciamento de Rede & IPv6 (`com.axion.remote.network`)**:
   - `NetworkManager.kt`: Realiza varredura de todas as interfaces (Wi-Fi, Celular, Ethernet) e prioriza endereços **IPv6 Global Unicast** (`2000::/3`).
   - Formatação automática no padrão exigido pelo RealVNC Viewer: `[IPv6]:porta` (ex: `[2001:db8::1234]:5900`).

5. **Armazenamento Seguro de Credenciais (`com.axion.remote.security`)**:
   - `SecurityPreferences.kt`: Utiliza `EncryptedSharedPreferences` com chave mestre AES-256 no **Android Keystore**. Senhas nunca são expostas em texto puro nem escritas em logs.

6. **Serviço de Primeiro Plano (`VncServerService.kt`)**:
   - Foreground Service do tipo `mediaProjection` (`FOREGROUND_SERVICE_MEDIA_PROJECTION`) em conformidade estrita com o Android 14+ (API 34+).
   - Notificação persistente no sistema com botão de interrupção instantânea.

7. **Interface Gráfica (`com.axion.remote.ui`)**:
   - Desenvolvida em **Jetpack Compose** com design escuro moderno, indicador de status `● SERVIDOR ONLINE / OFFLINE`, contador de clientes conectados, modal de configuração de porta/senha e painel de logs de diagnóstico em tempo real.

---

## 📱 Fluxo de Uso Passo a Passo

1. **Instalação**: Instale o APK no seu celular Android.
2. **Abrir o App**: Abra o **AXION Remote**.
3. **Configurar**: Toque em `[ CONFIGURAR ]` para definir a Porta TCP (padrão: `5900`) e a Senha VNC.
4. **Habilitar Acessibilidade (Opcional, para controle de toque)**: Caso queira controlar a tela pelo computador, toque em `[ HABILITAR ]` no card de acessibilidade e ative o *AXION Remote* nas configurações do Android.
5. **Iniciar Servidor**: Toque em `[ INICIAR SERVIDOR ]`. O Android exibirá o diálogo oficial autorizando a captura de tela (`MediaProjection`). Toque em "Iniciar agora".
6. **Copiar Dados**: Toque em `[ COPIAR DADOS ]` ou visualize o endereço IPv6 na tela (ex: `[2001:xxxx:xxxx::1234]:5900`).
7. **No Computador**:
   - Abra o **RealVNC Viewer**.
   - No campo de conexão, digite o endereço exatamente com colchetes: `[2001:xxxx:xxxx::1234]:5900` (ou o IPv4 local caso estejam na mesma rede Wi-Fi).
   - Pressione Enter.
   - Quando solicitada, digite a senha configurada no AXION Remote.
8. **Pronto**: A tela do Android será transmitida ao vivo para o computador e você poderá interagir com o mouse e teclado!

---

## 🛠️ Como Compilar o Projeto com Gradle

### Pré-requisitos:
- **JDK 17** ou superior (OpenJDK 17 / Oracle JDK 17);
- **Android SDK** com Build-Tools 35 instalado (ou Android Studio Ladybug / Koala);
- Variável `ANDROID_HOME` configurada apontando para seu Android SDK.

### 1. Clonar ou navegar até a pasta do projeto:
```bash
cd android
```

### 2. Compilar o APK de Debug:
No Linux / macOS:
```bash
chmod +x gradlew
./gradlew assembleDebug
```
No Windows:
```cmd
gradlew.bat assembleDebug
```

### 3. Localização do APK gerado:
O APK compilado estará localizado em:
```
app/build/outputs/apk/debug/app-debug.apk
```

### 4. Instalar no celular via USB / ADB:
Conecte o smartphone Android com depuração USB ativada e execute:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### 5. Compilar Release APK (Produção):
```bash
./gradlew assembleRelease
```
O pacote assinado estará em `app/build/outputs/apk/release/`.

---

## 🔒 Segurança e Privacidade

- **Zero Acesso Oculto**: A captura de tela depende da confirmação manual do usuário via diálogo do sistema Android.
- **Transparência Visual**: Uma notificação persistente do sistema é exibida durante todo o tempo em que o servidor estiver ativo.
- **Proteção de Senha**: Senhas armazenadas com chave criptográfica no Keystore do hardware do dispositivo.
- **Isolamento**: Não utiliza nenhuma API de terceiros ou serviços na nuvem; a comunicação TCP ocorre de ponta a ponta entre o seu celular e o RealVNC Viewer.
