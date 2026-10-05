export interface ProjectFile {
  path: string;
  name: string;
  category: 'Kotlin Core' | 'RFB Protocol' | 'Captura & Gestos' | 'Configurações' | 'Documentação';
  description: string;
}

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'app/src/main/java/com/axion/remote/MainActivity.kt',
    name: 'MainActivity.kt',
    category: 'Kotlin Core',
    description: 'Activity principal, autorização MediaProjection e interface Jetpack Compose'
  },
  {
    path: 'app/src/main/java/com/axion/remote/server/VncServerService.kt',
    name: 'VncServerService.kt',
    category: 'Kotlin Core',
    description: 'Foreground Service tipo mediaProjection para transmissão em segundo plano'
  },
  {
    path: 'app/src/main/java/com/axion/remote/server/RfbServer.kt',
    name: 'RfbServer.kt',
    category: 'RFB Protocol',
    description: 'Servidor TCP dual-stack (IPv6 e IPv4) escutando em :: e aceitando conexões'
  },
  {
    path: 'app/src/main/java/com/axion/remote/server/RfbClientHandler.kt',
    name: 'RfbClientHandler.kt',
    category: 'RFB Protocol',
    description: 'Loop do protocolo RFB 3.8: handshake, ServerInit, FramebufferUpdate e PointerEvent'
  },
  {
    path: 'app/src/main/java/com/axion/remote/server/VncAuth.kt',
    name: 'VncAuth.kt',
    category: 'RFB Protocol',
    description: 'Autenticação DES oficial do VNC com inversão de bits por byte (RFC 6143)'
  },
  {
    path: 'app/src/main/java/com/axion/remote/server/RfbProtocol.kt',
    name: 'RfbProtocol.kt',
    category: 'RFB Protocol',
    description: 'Definições do protocolo RFB, tipos de mensagens, PixelFormat e encodings'
  },
  {
    path: 'app/src/main/java/com/axion/remote/capture/ScreenCaptureManager.kt',
    name: 'ScreenCaptureManager.kt',
    category: 'Captura & Gestos',
    description: 'Captura contínua via MediaProjection e conversão de buffer RGBA_8888'
  },
  {
    path: 'app/src/main/java/com/axion/remote/accessibility/AxionAccessibilityService.kt',
    name: 'AxionAccessibilityService.kt',
    category: 'Captura & Gestos',
    description: 'Injeção oficial de toques, cliques e arrastos com dispatchGesture()'
  },
  {
    path: 'app/src/main/java/com/axion/remote/network/NetworkManager.kt',
    name: 'NetworkManager.kt',
    category: 'Kotlin Core',
    description: 'Detecção inteligente de IPv6 Global Unicast (2000::/3) e formatação [IPv6]:porta'
  },
  {
    path: 'app/src/main/java/com/axion/remote/security/SecurityPreferences.kt',
    name: 'SecurityPreferences.kt',
    category: 'Kotlin Core',
    description: 'Armazenamento seguro de porta e senha com EncryptedSharedPreferences e Keystore'
  },
  {
    path: 'app/src/main/java/com/axion/remote/ui/AxionRemoteScreen.kt',
    name: 'AxionRemoteScreen.kt',
    category: 'Kotlin Core',
    description: 'Interface Jetpack Compose com o layout oficial AXION REMOTE solicitado'
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'Configurações',
    description: 'Declaração de permissões, foregroundServiceType mediaProjection e accessibility'
  },
  {
    path: 'app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    category: 'Configurações',
    description: 'Build script do app Android com Compose, Coroutines e Security Crypto'
  },
  {
    path: 'settings.gradle.kts',
    name: 'settings.gradle.kts',
    category: 'Configurações',
    description: 'Configuração dos repositórios Google e Maven Central'
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'Documentação',
    description: 'Guia completo de compilação com Gradle, comandos ADB e conexão RealVNC'
  }
];
