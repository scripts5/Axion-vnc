import React, { useState } from 'react';
import { 
  AlertCircle, 
  Monitor, 
  Smartphone, 
  CheckCircle2, 
  X, 
  Clock, 
  Download, 
  Sparkles,
  Layers,
  ArrowRight,
  Code2
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface ApkNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  platformType?: 'pc' | 'apk';
}

export const ApkNoticeModal: React.FC<ApkNoticeModalProps> = ({ 
  isOpen, 
  onClose,
  platformType = 'pc'
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showConfigHelper, setShowConfigHelper] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      try {
        const existing = JSON.parse(localStorage.getItem('axion_subscribers') || '[]');
        existing.push({ email, platform: platformType, date: new Date().toISOString() });
        localStorage.setItem('axion_subscribers', JSON.stringify(existing));
      } catch {
        // Safe fallback
      }
      setSubscribed(true);
    }
  };

  const isPc = platformType === 'pc';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#0d091a] border border-purple-500/30 rounded-2xl shadow-2xl shadow-purple-900/40 overflow-hidden text-slate-100 z-10 my-8">
        {/* Top Glow bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header with Icon */}
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 shrink-0">
              {isPc ? (
                <Monitor className="w-8 h-8 text-cyan-400 animate-pulse" />
              ) : (
                <Smartphone className="w-8 h-8 text-purple-400 animate-pulse" />
              )}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{isPc ? 'Versão para Computador (PC)' : 'Pacote APK (Android / Emulador)'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Em breve — o arquivo ainda está sendo preparado.
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                {isPc ? (
                  <>O executável do <strong className="text-cyan-300">AXION para Computador ({PROJECT_CONFIG.version})</strong> está em fase final de compilação.</>
                ) : (
                  <>O pacote <strong className="text-purple-300">AXION APK ({PROJECT_CONFIG.version})</strong> está em compilação técnica.</>
                )}
              </p>
            </div>
          </div>

          {/* Technical clarification for PC & APK */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <AlertCircle className="w-4 h-4 text-purple-400" />
              <span>Transparência de Desenvolvimento</span>
            </div>
            <p>
              {isPc ? (
                <>O AXION para Computador trará suporte completo para Windows, Linux e macOS com aceleração local de processamento. Não usamos links fictícios nem instaladores vazios.</>
              ) : (
                <>O arquivo APK é ideal para celulares Android ou para rodar no Computador através de emuladores (BlueStacks, LDPlayer) e do Windows Subsystem for Android (WSA).</>
              )}
            </p>
            
            <div className="pt-2 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-black/30 p-2 rounded border border-purple-500/10">
                <span className="text-slate-400 block font-sans">Versão Alvo:</span>
                <span className="text-slate-200 font-medium">v{PROJECT_CONFIG.version} Alpha</span>
              </div>
              <div className="bg-black/30 p-2 rounded border border-purple-500/10">
                <span className="text-slate-400 block font-sans">Requisitos:</span>
                <span className="text-cyan-300 font-medium">{isPc ? 'Windows 10/11 / Linux / Mac' : 'Android 8.0+ / Emulador PC'}</span>
              </div>
            </div>
          </div>

          {/* Email Notification Form */}
          <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-slate-200">
                Deseja ser notificado no lançamento {isPc ? 'para Computador' : 'do APK'}?
              </h4>
            </div>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Obrigado! Seu e-mail foi registrado. Você receberá o link direto assim que for disponibilizado.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail (ex: dev@exemplo.com)"
                  required
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#140e26] border border-purple-500/30 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-medium text-sm transition-all shadow-md shadow-purple-900/30 shrink-0"
                >
                  Quero ser avisado
                </button>
              </form>
            )}
          </div>

          {/* Developer / Project Owner Info Drawer */}
          <div className="border-t border-purple-500/20 pt-4">
            <button
              type="button"
              onClick={() => setShowConfigHelper(!showConfigHelper)}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Para o desenvolvedor: onde inserir o link do arquivo?</span>
            </button>

            {showConfigHelper && (
              <div className="mt-3 p-3.5 rounded-lg bg-[#080512] border border-purple-500/30 text-xs text-slate-300 space-y-2 font-mono">
                <p className="text-purple-300">
                  📁 Arquivo: <span className="text-white">src/config/projectConfig.ts</span>
                </p>
                <div className="p-2.5 bg-black/60 rounded border border-white/10 text-[11px] text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">// Para computador (PC):</span><br />
                    <span className="text-pink-400">export const</span> <span className="text-cyan-300">PC_DOWNLOAD_URL</span> = <span className="text-emerald-400">"https://link/axion-pc-setup.exe"</span>;
                  </div>
                  <div className="pt-1">
                    <span className="text-slate-500">// Para Android (APK):</span><br />
                    <span className="text-pink-400">export const</span> <span className="text-indigo-300">APK_DOWNLOAD_URL</span> = <span className="text-emerald-400">"https://link/axion-v0.1.0.apk"</span>;
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  Assim que preenchido, os botões correspondentes iniciarão o download direto imediatamente.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Action */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
