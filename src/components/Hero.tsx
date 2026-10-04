import React, { useState } from 'react';
import { 
  Download, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Terminal, 
  Code2, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Check, 
  Boxes,
  Zap,
  Info,
  Laptop
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface HeroProps {
  onDownloadPcClick: () => void;
  onDownloadApkClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ 
  onDownloadPcClick, 
  onDownloadApkClick, 
  onExploreClick 
}) => {
  const [deviceMode, setDeviceMode] = useState<'pc' | 'mobile'>('pc');
  const [activeTab, setActiveTab] = useState<'prompt' | 'code' | 'architecture'>('code');

  return (
    <section className="relative pt-10 pb-24 overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-600/12 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-indigo-500/15 to-cyan-500/10 border border-purple-500/30 text-xs sm:text-sm text-purple-200 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="font-semibold text-white tracking-wide uppercase font-mono text-[11px] sm:text-xs">
              Projeto Oficial
            </span>
            <span className="text-purple-400/50">•</span>
            <span className="text-slate-300">
              Versão {PROJECT_CONFIG.version} ({PROJECT_CONFIG.versionStage})
            </span>
            <span className="text-purple-400/50">•</span>
            <span className="text-cyan-300 font-mono text-xs flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" />
              <span>Computador & Android</span>
            </span>
          </div>
        </div>

        {/* Hero Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headings & CTA */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            
            <div className="space-y-2">
              <span className="inline-block text-xs uppercase tracking-widest font-mono text-cyan-400 font-semibold">
                Plataforma Autônoma & Universal
              </span>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-none">
                <span className="block bg-gradient-to-r from-white via-slate-100 to-purple-200 bg-clip-text text-transparent">
                  {PROJECT_CONFIG.projectName}
                </span>
                <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent mt-2">
                  {PROJECT_CONFIG.projectSubtitle}
                </span>
              </h1>
            </div>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {PROJECT_CONFIG.tagline}
            </p>

            {/* Quick value badges */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span>Para Computador (PC / Windows / Mac / Linux)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                <span>APK Android & Emuladores</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-Ecossistema</span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              
              {/* Primary: Baixar para Computador */}
              <button
                onClick={onDownloadPcClick}
                className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-600/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Monitor className="w-5 h-5 text-cyan-100" />
                <span>BAIXAR PARA COMPUTADOR</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-black/40 text-cyan-300 border border-cyan-400/30">
                  {PROJECT_CONFIG.isPcReady ? 'Disponível' : 'Em Breve'}
                </span>
              </button>

              {/* Secondary: Baixar APK */}
              <button
                onClick={onDownloadApkClick}
                className="w-full sm:w-auto relative group overflow-hidden flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm sm:text-base font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Smartphone className="w-5 h-5 text-purple-200" />
                <span>BAIXAR APK</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-black/40 text-purple-300 border border-purple-400/30">
                  {PROJECT_CONFIG.isApkReady ? 'Disponível' : 'Em Breve'}
                </span>
              </button>
            </div>

            {/* Honest Status Callout */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Status atual: versões para Computador e APK em desenvolvimento ativo.</span>
            </div>

          </div>

          {/* Right Column: Interactive PC & Mobile Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Device Switcher Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/60 border border-purple-500/25 mb-4 text-xs font-mono">
              <button
                onClick={() => setDeviceMode('pc')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${
                  deviceMode === 'pc'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Computador (PC)</span>
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>APK (Mobile/Emulador)</span>
              </button>
            </div>

            {/* PC Desktop Frame */}
            {deviceMode === 'pc' ? (
              <div className="relative w-full max-w-lg rounded-2xl p-3 sm:p-4 bg-[#0d091e] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 backdrop-blur-xl animate-fade-in">
                
                {/* Desktop Window Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-white font-semibold">AXION Desktop Workstation</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                    PC x86_64
                  </span>
                </div>

                {/* Subheader */}
                <div className="pt-3 pb-2 flex items-center justify-between text-[11px] font-mono border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 font-bold">Universal Engine Workspace</span>
                  </div>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Core Ready
                  </span>
                </div>

                {/* PC Content Code & Terminal */}
                <div className="mt-3 space-y-3 font-mono text-xs">
                  <div className="p-3 bg-black/80 rounded-xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-white/5 pb-1">
                      <span>main_project_engine.ts</span>
                      <span className="text-cyan-400">Suporte PC Nativo</span>
                    </div>
                    <pre className="text-slate-300 text-[11px] leading-relaxed overflow-x-auto">
                      <span className="text-purple-400">import</span> &#123; AxionCore &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@axion/engine'</span>;<br/>
                      <br/>
                      <span className="text-slate-500">// Orquestração para Computador & Android</span><br/>
                      <span className="text-pink-400">const</span> engine = <span className="text-cyan-300">new</span> AxionCore(&#123; platform: <span className="text-emerald-300">'desktop'</span> &#125;);<br/>
                      <span className="text-pink-400">await</span> engine.generateProject(&#123; target: <span className="text-emerald-300">'fullstack'</span> &#125;);
                    </pre>
                  </div>

                  <div className="p-2.5 bg-black/60 rounded-xl border border-white/5 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="text-slate-400">Aceleração de CPU / GPU:</span>
                    <span className="text-cyan-300 font-bold">Ativada (Windows / Linux / Mac)</span>
                  </div>

                  <button
                    onClick={onDownloadPcClick}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar para Computador (v{PROJECT_CONFIG.version})</span>
                  </button>
                </div>

              </div>
            ) : (
              /* Mobile / Emulator APK Frame */
              <div className="relative w-full max-w-sm rounded-[32px] p-3.5 bg-gradient-to-b from-purple-500/40 via-indigo-600/20 to-cyan-500/30 border border-white/15 shadow-2xl shadow-purple-950/80 backdrop-blur-xl animate-fade-in">
                <div className="bg-[#0c0919] rounded-[24px] overflow-hidden border border-purple-500/25 p-4 flex flex-col min-h-[380px] justify-between">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-2 border-b border-white/5">
                    <span className="text-white font-semibold">14:15</span>
                    <span className="text-purple-300">APK / Emulador</span>
                  </div>

                  <div className="space-y-3 my-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">AXION APK CLIENT</div>
                        <div className="text-[10px] text-purple-300 font-mono">Android & Emuladores de PC</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-black/60 border border-purple-500/20 text-xs text-slate-300 space-y-1">
                      <div className="text-slate-400 text-[10px]">Pode ser instalado em:</div>
                      <div className="text-white font-medium">• Celulares e Tablets Android</div>
                      <div className="text-white font-medium">• No Computador via BlueStacks / LDPlayer</div>
                      <div className="text-white font-medium">• No Windows via WSA (Subsystem)</div>
                    </div>
                  </div>

                  <button
                    onClick={onDownloadApkClick}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:opacity-90 transition-opacity"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar APK (v{PROJECT_CONFIG.version})</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
