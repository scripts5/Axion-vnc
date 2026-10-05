import React, { useState } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  HelpCircle, 
  Smartphone, 
  Laptop, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';

export const CompilationGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      title: '1. Baixar ou Clonar o Projeto Android',
      command: 'cd android\n# ou descompacte o arquivo axion-remote-android.zip',
      desc: 'Navegue até a raiz do projeto Android onde estão localizados o settings.gradle.kts e o gradlew.'
    },
    {
      title: '2. Compilar o Debug APK com Gradle',
      command: './gradlew assembleDebug',
      desc: 'O Gradle fará o download das dependências oficiais (Jetpack Compose, AndroidX Security Crypto, Coroutines) e compilará o APK.'
    },
    {
      title: '3. Localizar o APK Compilado',
      command: 'ls -la app/build/outputs/apk/debug/app-debug.apk',
      desc: 'O pacote final gerado estará no diretório padrão de saída do Android Gradle Plugin.'
    },
    {
      title: '4. Instalar no Smartphone via ADB',
      command: 'adb install -r app/build/outputs/apk/debug/app-debug.apk',
      desc: 'Com a Depuração USB ativada no celular, este comando instala ou atualiza o app sem desinstalar os dados existentes.'
    },
    {
      title: '5. Compilar Release APK (Produção)',
      command: './gradlew assembleRelease',
      desc: 'Gera o pacote de release otimizado para distribuição pública.'
    }
  ];

  const handleCopy = (cmd: string, idx: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#0b0817] border border-cyan-500/25 shadow-2xl space-y-6">
      
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Instruções de Compilação com Gradle & Conexão RealVNC
            </h3>
            <span className="text-xs font-mono text-cyan-400">Guia Oficial do Desenvolvedor</span>
          </div>
        </div>
      </div>

      {/* Grid de Passos de Terminal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-black/60 border border-white/5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-300 font-semibold font-sans">
              <span>{step.title}</span>
              <button
                onClick={() => handleCopy(step.command, idx)}
                className="hover:text-cyan-300 transition-colors flex items-center gap-1 text-[11px] font-mono text-slate-400"
              >
                {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <pre className="p-2.5 rounded-xl bg-[#07050d] border border-white/10 text-cyan-300 overflow-x-auto text-[11px]">
              <code>{step.command}</code>
            </pre>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Guia de Conexão no RealVNC Viewer */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black border border-purple-500/30 space-y-3">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Laptop className="w-4 h-4 text-cyan-400" />
          <span>Como conectar no RealVNC Viewer pelo Computador:</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-purple-300 font-bold block">1. Formato com Colchetes:</span>
            <p className="text-[11px] text-slate-400">
              No campo de busca do RealVNC Viewer, digite exatamente com colchetes: <code className="text-cyan-300">[2001:db8::1234]:5900</code>
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-purple-300 font-bold block">2. Autenticação DES:</span>
            <p className="text-[11px] text-slate-400">
              Quando solicitado, insira a senha configurada no aplicativo (padrão: <code className="text-purple-300">axion</code>).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-purple-300 font-bold block">3. Interação:</span>
            <p className="text-[11px] text-slate-400">
              Clique com o botão esquerdo para tocar na tela; clique com o botão direito para acionar o botão Voltar do Android.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
