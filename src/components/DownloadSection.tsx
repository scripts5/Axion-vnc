import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  FileCode, 
  ShieldCheck, 
  Settings2, 
  Sparkles, 
  Copy, 
  Check, 
  HelpCircle,
  Laptop
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface DownloadSectionProps {
  onDownloadPcClick: () => void;
  onDownloadApkClick: () => void;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ 
  onDownloadPcClick, 
  onDownloadApkClick 
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'pc' | 'apk'>('pc');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(
      `// Em src/config/projectConfig.ts:\nexport const PC_DOWNLOAD_URL = "https://seu-link-real/axion-pc-setup.exe";\nexport const APK_DOWNLOAD_URL = "https://seu-link-real/axion-v${PROJECT_CONFIG.version}.apk";`
    );
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      try {
        const existing = JSON.parse(localStorage.getItem('axion_subscribers') || '[]');
        existing.push({ email, platform: selectedPlatform, date: new Date().toISOString() });
        localStorage.setItem('axion_subscribers', JSON.stringify(existing));
      } catch {
        // Fallback
      }
      setSubscribed(true);
    }
  };

  return (
    <section id="download" className="py-24 relative border-t border-purple-500/15 bg-gradient-to-b from-[#07050d] via-[#0d091e] to-[#07050d]">
      
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 uppercase tracking-widest font-mono">
            <Monitor className="w-3.5 h-3.5 text-cyan-400" />
            <span>Distribuição Oficial</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Baixe o <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AXION</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Escolha o instalador para o seu <strong className="text-white">Computador (PC / Desktop)</strong> ou o pacote <strong className="text-purple-300">APK</strong> para Android e emuladores.
          </p>

          {/* Platform Selector Buttons */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => setSelectedPlatform('pc')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                selectedPlatform === 'pc'
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Para Computador (PC / Windows / Mac / Linux)</span>
            </button>
            <button
              onClick={() => setSelectedPlatform('apk')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                selectedPlatform === 'apk'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Pacote APK (Android / Emuladores)</span>
            </button>
          </div>
        </div>

        {/* Central Download Card */}
        <div className="mt-10 max-w-4xl mx-auto">
          
          <div className="relative rounded-3xl p-8 sm:p-10 bg-[#0e0921]/90 border-2 border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-xl space-y-8">
            
            {/* Top Status Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
              
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
                  {selectedPlatform === 'pc' ? (
                    <Monitor className="w-5 h-5 text-cyan-300" />
                  ) : (
                    <Smartphone className="w-5 h-5 text-purple-300" />
                  )}
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedPlatform === 'pc' ? 'Versão para Computador (PC):' : 'Pacote de Instalação APK:'}</span>
                    <span className="text-amber-400 font-mono">Em desenvolvimento</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {selectedPlatform === 'pc' 
                      ? 'Compilação para Windows (.exe / installer), Linux e macOS.' 
                      : 'Pacote Android (.apk) para celulares ou emuladores no PC.'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30">
                  Versão {PROJECT_CONFIG.version}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                  {selectedPlatform === 'pc' ? 'PC Desktop' : 'Android / Emulador'}
                </span>
              </div>
            </div>

            {/* Middle Section: CTA & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  {selectedPlatform === 'pc' ? (
                    <>Máximo desempenho e tela ampla no seu Computador</>
                  ) : (
                    <>Mobilidade no celular ou via emulador no Computador</>
                  )}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedPlatform === 'pc' ? (
                    <>
                      O AXION para Computador oferece um workspace completo com terminal integrado, suporte a atalhos de teclado, compilação acelerada por hardware e sincronização direta com seus repositórios locais.
                    </>
                  ) : (
                    <>
                      O AXION em formato <strong className="text-white">.APK</strong> permite que você instale tanto no seu smartphone/tablet Android quanto no seu Computador através de ferramentas como BlueStacks, LDPlayer ou Windows Subsystem for Android (WSA).
                    </>
                  )}
                </p>

                {/* Main Action Button */}
                <div className="pt-2">
                  {selectedPlatform === 'pc' ? (
                    PROJECT_CONFIG.isPcReady ? (
                      <a
                        href={PROJECT_CONFIG.pcDownloadUrl}
                        download
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Monitor className="w-5 h-5 text-white" />
                        <span>BAIXAR PARA COMPUTADOR (v{PROJECT_CONFIG.version})</span>
                      </a>
                    ) : (
                      <button
                        onClick={onDownloadPcClick}
                        className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-600/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Monitor className="w-5 h-5 text-cyan-100" />
                        <span>BAIXAR PARA COMPUTADOR</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-black/40 text-cyan-300 border border-cyan-400/30">
                          Em desenvolvimento
                        </span>
                      </button>
                    )
                  ) : (
                    PROJECT_CONFIG.isApkReady ? (
                      <a
                        href={PROJECT_CONFIG.apkDownloadUrl}
                        download
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <Smartphone className="w-5 h-5 text-white" />
                        <span>BAIXAR APK AGORA (v{PROJECT_CONFIG.version})</span>
                      </a>
                    ) : (
                      <button
                        onClick={onDownloadApkClick}
                        className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Smartphone className="w-5 h-5 text-purple-200" />
                        <span>BAIXAR APK</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-black/40 text-amber-300 border border-amber-400/30">
                          Em desenvolvimento
                        </span>
                      </button>
                    )
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Assinatura de segurança SHA-256 e código verificado.</span>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="lg:col-span-5 bg-black/50 p-5 rounded-2xl border border-white/5 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-purple-300 font-semibold text-xs tracking-wider uppercase">
                  <span>Ficha Técnica</span>
                  <span>{selectedPlatform === 'pc' ? 'PC Desktop' : 'APK Release'}</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Versão:</span>
                  <span className="text-white font-medium">{PROJECT_CONFIG.version} ({PROJECT_CONFIG.versionStage})</span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Plataforma:</span>
                  <span className="text-cyan-300 font-medium">
                    {selectedPlatform === 'pc' ? 'Windows / Mac / Linux' : 'Android & Emulador PC'}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Requisito:</span>
                  <span className="text-white font-medium">
                    {selectedPlatform === 'pc' ? PROJECT_CONFIG.pcRequirements : PROJECT_CONFIG.minAndroidVersion}
                  </span>
                </div>

                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Arquitetura:</span>
                  <span className="text-purple-300 font-medium">{PROJECT_CONFIG.architecture}</span>
                </div>

                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status do Binário:</span>
                  <span className="text-amber-400 font-semibold">
                    {selectedPlatform === 'pc' 
                      ? (PROJECT_CONFIG.isPcReady ? 'Disponível' : 'Compilação Pendente')
                      : (PROJECT_CONFIG.isApkReady ? 'Disponível' : 'Compilação Pendente')}
                  </span>
                </div>
              </div>

            </div>

            {/* Installation Guide for PC and APK */}
            <div className="pt-6 border-t border-purple-500/20 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>
                  {selectedPlatform === 'pc' 
                    ? 'Como funcionará a instalação no seu Computador:' 
                    : 'Como instalar o APK (no Celular ou no Computador via Emulador):'}
                </span>
              </div>

              {selectedPlatform === 'pc' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-center font-bold">1</span>
                      <h4 className="text-xs font-bold text-white">Baixar o Instalador PC</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Clique em "BAIXAR PARA COMPUTADOR" e faça o download do pacote executável (.exe / installer).
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-mono flex items-center justify-center font-bold">2</span>
                      <h4 className="text-xs font-bold text-white">Executar o Assistente</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Abra o instalador no seu Windows, Mac ou Linux e siga os passos guiados na tela.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-center font-bold">3</span>
                      <h4 className="text-xs font-bold text-white">Iniciar o AXION</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Abra o software no menu Iniciar ou área de trabalho e comece a criar seus projetos.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center justify-center font-bold">1</span>
                      <h4 className="text-xs font-bold text-white">Baixar o .APK</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Baixe o arquivo .apk no celular ou direto no seu Computador para usar em emulador.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-mono flex items-center justify-center font-bold">2</span>
                      <h4 className="text-xs font-bold text-white">No Celular ou Emulador</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      No celular, confirme "Fontes desconhecidas". No PC, basta arrastar o .apk para o BlueStacks/LDPlayer.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center justify-center font-bold">3</span>
                      <h4 className="text-xs font-bold text-white">Pronto para Criar</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Abra o aplicativo AXION e desfrute de todos os recursos de inteligência artificial.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Email Notification Box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-white">
                    Fique sabendo no minuto em que a versão para Computador ou APK for lançada
                  </h4>
                </div>
                <span className="text-xs text-purple-400/80 font-mono">Sem spam • Apenas aviso de lançamento</span>
              </div>

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Cadastro confirmado! Você receberá a notificação assim que o download for liberado.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu e-mail para receber o aviso de lançamento"
                    required
                    className="flex-1 px-4 py-3 rounded-xl bg-[#140e29] border border-purple-500/30 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-sm transition-all shadow-md shadow-cyan-900/30 shrink-0"
                  >
                    Avise-me do Lançamento
                  </button>
                </form>
              )}
            </div>

            {/* Instructions for Project Owner */}
            <div className="p-4 rounded-xl bg-black/60 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-purple-300 flex items-center gap-1.5 font-mono">
                  <Settings2 className="w-3.5 h-3.5" />
                  <span>Configuração para o Dono do Projeto:</span>
                </div>
                <p className="text-xs text-slate-400">
                  Edite as variáveis <code className="text-cyan-300 bg-white/5 px-1 py-0.5 rounded">PC_DOWNLOAD_URL</code> e <code className="text-purple-300 bg-white/5 px-1 py-0.5 rounded">APK_DOWNLOAD_URL</code> em <code className="text-white bg-white/5 px-1 py-0.5 rounded">src/config/projectConfig.ts</code>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopySnippet}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-white/10 hover:bg-white/15 text-slate-200 transition-colors shrink-0"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedSnippet ? 'Copiado!' : 'Copiar Exemplo'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
