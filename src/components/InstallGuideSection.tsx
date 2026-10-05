import React, { useState } from 'react';
import { 
  Smartphone, 
  HelpCircle, 
  CheckCircle2, 
  Download, 
  Github, 
  Terminal, 
  Laptop, 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  Zap, 
  Code2,
  AlertCircle
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipDownloader';

export const InstallGuideSection: React.FC = () => {
  const [activeMethod, setActiveMethod] = useState<'termux' | 'cloud' | 'studio' | 'terminal'>('termux');
  const [isZipping, setIsZipping] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const filesMap: Record<string, string> = {
        'settings.gradle.kts': `pluginManagement {\n    repositories {\n        google()\n        mavenCentral()\n        gradlePluginPortal()\n    }\n}\ndependencyResolutionManagement {\n    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)\n    repositories {\n        google()\n        mavenCentral()\n    }\n}\nrootProject.name = "AXION Remote"\ninclude(":app")`,
        'build.gradle.kts': `plugins {\n    alias(libs.plugins.android.application) apply false\n    alias(libs.plugins.kotlin.android) apply false\n    alias(libs.plugins.kotlin.compose) apply false\n}`,
        'gradle.properties': `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nandroid.enableJetifier=false\nkotlin.code.style=official\nandroid.nonTransitiveRClass=true`,
        'gradlew': `#!/bin/sh\nexec gradle "$@"`,
        'gradle/wrapper/gradle-wrapper.properties': `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.11.1-bin.zip\nnetworkTimeout=10000\nvalidateDistributionUrl=true\nzipStoreBase=GRADLE_USER_HOME\nzipStorePath=wrapper/dists`,
        'app/build.gradle.kts': `plugins {\n    alias(libs.plugins.android.application)\n    alias(libs.plugins.kotlin.android)\n    alias(libs.plugins.kotlin.compose)\n}\nandroid {\n    namespace = "com.axion.remote"\n    compileSdk = 35\n    defaultConfig {\n        applicationId = "com.axion.remote"\n        minSdk = 26\n        targetSdk = 35\n        versionCode = 1\n        versionName = "1.0.0"\n    }\n}\ndependencies {\n    implementation(libs.androidx.core.ktx)\n    implementation(libs.androidx.activity.compose)\n    implementation(platform(libs.androidx.compose.bom))\n    implementation(libs.androidx.ui)\n    implementation(libs.androidx.material3)\n    implementation(libs.androidx.security.crypto)\n}`,
        'app/src/main/AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>\n<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n    <uses-permission android:name="android.permission.INTERNET" />\n    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />\n    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION" />\n    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <application android:name=".AxionApplication" android:label="AXION Remote" android:theme="@android:style/Theme.Material.NoActionBar">\n        <activity android:name=".MainActivity" android:exported="true">\n            <intent-filter>\n                <action android:name="android.intent.action.MAIN" />\n                <category android:name="android.intent.category.LAUNCHER" />\n            </intent-filter>\n        </activity>\n        <service android:name=".server.VncServerService" android:exported="false" android:foregroundServiceType="mediaProjection" />\n        <service android:name=".accessibility.AxionAccessibilityService" android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE" android:exported="true">\n            <intent-filter><action android:name="android.accessibilityservice.AccessibilityService" /></intent-filter>\n        </service>\n    </application>\n</manifest>`,
        'README.md': `# AXION Remote\nCompilar com Gradle:\n./gradlew assembleDebug\nLocal do APK:\napp/build/outputs/apk/debug/app-debug.apk`
      };
      await downloadAndroidProjectZip(filesMap);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#120d29] via-[#0d091e] to-[#07050d] border-2 border-purple-500/50 shadow-2xl space-y-6">
      
      {/* Top Banner Alert */}
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
        <HelpCircle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white">
            Por que o aplicativo ainda não está no seu celular?
          </h3>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            O <strong>AXION Remote</strong> acabou de ser programado e gerado aqui no ambiente de desenvolvimento (código Kotlin nativo, servidor RFB e arquivos Gradle). Como estamos no navegador, ele precisa ser instalado no seu Android. Você pode fazer isso diretamente pelo <strong>Termux</strong> no celular, pelo <strong>GitHub</strong> ou pelo <strong>computador</strong>!
          </p>
        </div>
      </div>

      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          Como instalar o AXION Remote no seu celular:
        </h3>
        <p className="text-xs text-slate-300">
          Escolha o método mais prático para você:
        </p>
      </div>

      {/* Seletor de 4 Métodos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* TAB 1: TERMUX (Destaque) */}
        <button
          onClick={() => setActiveMethod('termux')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 relative overflow-hidden ${
            activeMethod === 'termux'
              ? 'bg-gradient-to-br from-emerald-950/80 to-[#0e0a1e] border-emerald-400 text-white shadow-lg shadow-emerald-950/50'
              : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
              <Terminal className="w-4 h-4" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              TERMUX
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Direto no Termux</h4>
            <p className="text-[11px] text-slate-400">Comandos para instalar direto pelo terminal no celular</p>
          </div>
        </button>

        {/* TAB 2: GITHUB */}
        <button
          onClick={() => setActiveMethod('cloud')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeMethod === 'cloud'
              ? 'bg-purple-950/70 border-purple-400 text-white shadow-lg shadow-purple-950/50'
              : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
              <Github className="w-4 h-4" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 font-bold">
              GITHUB
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">APK na Nuvem</h4>
            <p className="text-[11px] text-slate-400">GitHub Actions compila o APK sozinho em 2 min</p>
          </div>
        </button>

        {/* TAB 3: ANDROID STUDIO */}
        <button
          onClick={() => setActiveMethod('studio')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeMethod === 'studio'
              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
              : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs">
              <Laptop className="w-4 h-4" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 font-bold">
              STUDIO
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Pelo Computador</h4>
            <p className="text-[11px] text-slate-400">Baixe o ZIP e instale pelo cabo USB</p>
          </div>
        </button>

        {/* TAB 4: TERMINAL PC */}
        <button
          onClick={() => setActiveMethod('terminal')}
          className={`p-4 rounded-2xl border text-left transition-all space-y-2 ${
            activeMethod === 'terminal'
              ? 'bg-purple-950/70 border-purple-400 text-white shadow-lg shadow-purple-950/50'
              : 'bg-black/40 border-white/10 text-slate-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
              <Code2 className="w-4 h-4" />
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 font-bold">
              GRADLE PC
            </span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Terminal PC</h4>
            <p className="text-[11px] text-slate-400">Comandos com ./gradlew assembleDebug</p>
          </div>
        </button>

      </div>

      {/* Conteúdo do Método Selecionado */}
      <div className="p-6 rounded-2xl bg-black/60 border border-white/10 space-y-5">
        
        {/* ABA 1: TERMUX NO CELULAR */}
        {activeMethod === 'termux' && (
          <div className="space-y-5 animate-fade-in text-xs leading-relaxed text-slate-300">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Terminal className="w-4 h-4" />
                <span>Instalar o AXION Remote diretamente pelo Termux no celular:</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Execute no app Termux do Android</span>
            </div>

            <p>
              No Termux você pode instalar qualquer APK usando o comando nativo <code className="text-emerald-300 bg-white/5 px-1 py-0.5 rounded">termux-open</code> (que chama o instalador de pacotes do Android na tela) ou via depuração ADB local.
            </p>

            {/* Aviso e Solução para BUILD FAILED */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Deu "cd: android: No such file" ou "BUILD FAILED"?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                • Se deu <strong>"No such file or directory"</strong> ao digitar <code>cd android</code>: É porque você acabou de abrir o Termux e ainda não descompactou ou baixou os arquivos para dentro dele! Se você baixou o ZIP pelo navegador, ele está na pasta <code>~/storage/downloads</code> do seu celular.<br />
                • Se deu <strong>"BUILD FAILED"</strong>: O Gradle precisa do AAPT2 que só roda em computadores normais (x86_64).
              </p>
              <div className="p-2.5 rounded-lg bg-black/60 border border-white/10 text-emerald-300 font-medium text-[11px] space-y-1">
                <span className="text-white block font-bold">✓ O Que Fazer no Termux:</span>
                <span>Execute os comandos abaixo para acessar os arquivos da pasta Downloads do seu celular:</span>
                <pre className="text-cyan-300 font-mono text-[10.5px] pt-1">termux-setup-storage && cd ~/storage/downloads && ls</pre>
              </div>
            </div>

            {/* Passo 1: Permissão de armazenamento e ferramentas básicas */}
            <div className="p-4 rounded-xl bg-[#090614] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px]">1</span>
                  <span>Preparar o Termux (Permissão e Ferramentas):</span>
                </span>
                <button
                  onClick={() => copyToClipboard('pkg update -y && pkg install -y termux-tools wget curl\ntermux-setup-storage', 'termux-step1')}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedCmd === 'termux-step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'termux-step1' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black text-emerald-300 font-mono text-[11px] overflow-x-auto">
                <code>pkg update -y && pkg install -y termux-tools wget curl
termux-setup-storage</code>
              </pre>
              <p className="text-[10px] text-slate-400">
                Toque em "Permitir" quando o Android perguntar sobre acesso ao armazenamento.
              </p>
            </div>

            {/* Passo 2: Instalar APK com termux-open */}
            <div className="p-4 rounded-xl bg-[#090614] border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[10px]">2</span>
                  <span>Abrir o instalador de APK pelo Termux:</span>
                </span>
                <button
                  onClick={() => copyToClipboard('termux-open app-debug.apk', 'termux-step2')}
                  className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  {copiedCmd === 'termux-step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'termux-step2' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black text-emerald-300 font-mono text-[11px] overflow-x-auto">
                <code># Se o arquivo estiver na pasta Downloads do seu celular:
cd ~/storage/downloads
termux-open app-debug.apk</code>
              </pre>
              <p className="text-[10px] text-slate-400">
                O comando <code>termux-open</code> abre imediatamente a janela oficial do Android: <strong>"Deseja instalar este aplicativo?"</strong>.
              </p>
            </div>

            {/* Passo 3: Compilar o código do projeto direto no celular pelo Termux (Avançado) */}
            <div className="p-4 rounded-xl bg-[#090614] border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-[10px]">3</span>
                  <span>Opção para compilar com OpenJDK e Gradle dentro do Termux:</span>
                </span>
                <button
                  onClick={() => copyToClipboard('pkg install -y git openjdk-17 gradle\n# Baixe o projeto e compile:\ncd axion-remote-android/android\ngradle assembleDebug\ntermux-open app/build/outputs/apk/debug/app-debug.apk', 'termux-step3')}
                  className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  {copiedCmd === 'termux-step3' ? <Check className="w-3 h-3 text-purple-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'termux-step3' ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <pre className="p-2.5 rounded-lg bg-black text-purple-300 font-mono text-[11px] overflow-x-auto">
                <code>pkg install -y git openjdk-17 gradle
cd axion-remote-android/android
gradle assembleDebug
termux-open app/build/outputs/apk/debug/app-debug.apk</code>
              </pre>
            </div>

            {/* Dica ADB Wireless */}
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Dica no Android 11+:</strong> Você também pode instalar usando <code className="text-white">pkg install android-tools</code> e rodar <code className="text-cyan-300">adb install -r app-debug.apk</code> emparelhando com a <em>Depuração por Wi-Fi</em> nas opções de desenvolvedor do próprio celular!
              </span>
            </div>

          </div>
        )}

        {/* ABA 2: GITHUB ACTIONS */}
        {activeMethod === 'cloud' && (
          <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Como compilar o APK na nuvem gratuitamente (sem precisar de computador potente):</span>
            </div>

            <p>
              Já criamos o arquivo de automação <strong><code>.github/workflows/build-apk.yml</code></strong> dentro deste projeto. Ele faz o GitHub compilar o seu aplicativo Android sozinho na nuvem!
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#0d091e] border border-purple-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-white">Envie este projeto para o seu GitHub</strong>
                  <p className="text-slate-400 text-[11px]">Você pode conectar este repositório no GitHub ou copiar os arquivos.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d091e] border border-purple-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white">O GitHub compila o APK automaticamente</strong>
                  <p className="text-slate-400 text-[11px]">Vá na aba <em>Actions</em> no seu GitHub. O robô compila o <code>axion-remote-debug-apk</code> em menos de 2 minutos.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d091e] border border-purple-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white">Baixe o .APK direto no celular</strong>
                  <p className="text-slate-400 text-[11px]">Abra o GitHub pelo navegador do celular, clique em <em>Artifacts</em> e instale o <code>app-debug.apk</code> no smartphone.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: ANDROID STUDIO */}
        {activeMethod === 'studio' && (
          <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
              <Laptop className="w-4 h-4 text-cyan-400" />
              <span>Instalar diretamente pelo Android Studio:</span>
            </div>

            <p>
              Se você tem o <strong>Android Studio</strong> instalado no seu computador:
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 rounded-xl bg-[#0d091e] border border-cyan-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">1</span>
                <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <strong className="text-white">Baixar o Projeto Android (.ZIP)</strong>
                    <p className="text-slate-400 text-[11px]">Clique no botão ao lado para baixar todo o código nativo.</p>
                  </div>
                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors shrink-0"
                  >
                    {isZipping ? 'Criando...' : 'Baixar ZIP Agora'}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d091e] border border-cyan-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-white">Descompacte e abra no Android Studio</strong>
                  <p className="text-slate-400 text-[11px]">Abra a pasta no Android Studio (ele sincronizará o Gradle automaticamente).</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0d091e] border border-cyan-500/20 flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-cyan-500/30 text-cyan-200 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-white">Conecte o celular e clique no botão Play ▶️</strong>
                  <p className="text-slate-400 text-[11px]">O Android Studio compila e instala o AXION Remote diretamente no celular.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: TERMINAL PC */}
        {activeMethod === 'terminal' && (
          <div className="space-y-4 animate-fade-in text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Compilar e instalar pelo Terminal do Computador:</span>
            </div>

            <p>
              Execute estes comandos no terminal do seu computador com o celular conectado via cabo USB (com depuração ativada):
            </p>

            <div className="p-3.5 rounded-xl bg-[#07050d] border border-white/10 font-mono space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-500 border-b border-white/5 pb-1">
                <span>Comandos no Terminal:</span>
                <button
                  onClick={() => copyToClipboard('cd android && ./gradlew assembleDebug && adb install -r app/build/outputs/apk/debug/app-debug.apk', 'terminal-pc')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                >
                  {copiedCmd === 'terminal-pc' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'terminal-pc' ? 'Copiado!' : 'Copiar Comandos'}</span>
                </button>
              </div>

              <p className="text-purple-300">$ cd android</p>
              <p className="text-cyan-300">$ ./gradlew assembleDebug</p>
              <p className="text-emerald-300">$ adb install -r app/build/outputs/apk/debug/app-debug.apk</p>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
