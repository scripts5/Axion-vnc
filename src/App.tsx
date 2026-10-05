/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Terminal, 
  ShieldCheck, 
  Wifi, 
  Cpu, 
  Download, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  FileCode,
  Sparkles,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { AndroidSimulator } from './components/AndroidSimulator';
import { CodeExplorer } from './components/CodeExplorer';
import { CompilationGuide } from './components/CompilationGuide';
import { InstallGuideSection } from './components/InstallGuideSection';
import { LiveScreenSharer } from './components/LiveScreenSharer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'webshare' | 'simulator' | 'install' | 'code' | 'guide'>('webshare');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-purple-950/60 via-indigo-950/60 to-cyan-950/60 border-b border-purple-500/20 text-xs py-2 px-4 text-center font-mono flex items-center justify-center gap-2 flex-wrap">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-purple-200 font-bold">AXION REMOTE:</span>
        <span className="text-slate-300">Servidor RFB/VNC Nativo para Android com suporte a IPv6, MediaProjection e RealVNC Viewer.</span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#07050d]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#0d091a] rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-wider text-white">
                  AXION REMOTE
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  VNC Server Android
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase block">
                Nativo Kotlin • RFB 3.8 • IPv6
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider font-mono">
            <button
              onClick={() => { setActiveTab('webshare'); scrollTo('webshare'); }}
              className={`py-1 transition-colors flex items-center gap-1.5 ${activeTab === 'webshare' ? 'text-cyan-300 border-b-2 border-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Transmitir PC ➔ Celular</span>
            </button>
            <button
              onClick={() => { setActiveTab('install'); scrollTo('install'); }}
              className={`py-1 transition-colors ${activeTab === 'install' ? 'text-amber-300 border-b-2 border-amber-400' : 'text-slate-400 hover:text-white'}`}
            >
              Como Instalar no Celular
            </button>
            <button
              onClick={() => { setActiveTab('simulator'); scrollTo('simulator'); }}
              className={`py-1 transition-colors ${activeTab === 'simulator' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}
            >
              Simulador do App
            </button>
            <button
              onClick={() => { setActiveTab('code'); scrollTo('code'); }}
              className={`py-1 transition-colors ${activeTab === 'code' ? 'text-purple-300 border-b-2 border-purple-400' : 'text-slate-400 hover:text-white'}`}
            >
              Código do Projeto
            </button>
            <button
              onClick={() => { setActiveTab('guide'); scrollTo('guide'); }}
              className={`py-1 transition-colors ${activeTab === 'guide' ? 'text-emerald-300 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-white'}`}
            >
              Guia Gradle
            </button>
          </nav>

          {/* Action Button */}
          <button
            onClick={() => { setActiveTab('code'); scrollTo('code'); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-purple-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Baixar Projeto (.ZIP)</span>
          </button>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-xs font-mono text-purple-300 uppercase tracking-widest">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>Servidor Remoto Instalado no Celular • Cliente: RealVNC Viewer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Controle seu Celular pelo Computador com <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AXION Remote</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Aplicativo Android nativo que atua como <strong>servidor VNC/RFB autônomo</strong>. Conecte-se diretamente do seu computador usando o <strong>RealVNC Viewer</strong> via <strong>IPv6</strong> ou IPv4 com transmissão de tela fluida por <strong>MediaProjection</strong> e gestos de toque via <strong>AccessibilityService</strong>.
          </p>

          {/* Badges de Destaque */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sem Chatbot / Sem IA</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Servidor RFB 3.8 Embutido</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Suporte Nativo a IPv6 Global</span>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-slate-300 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Autenticação DES Compatível</span>
            </span>
          </div>
        </section>

        {/* Seção Principal: Transmissor de Tela Web & Controle Remoto pelo Celular */}
        <section id="webshare" className="space-y-6">
          <LiveScreenSharer />
        </section>

        {/* Seção 0: Como Colocar no Celular (Passo a Passo) */}
        <section id="install" className="space-y-6">
          <InstallGuideSection />
        </section>

        {/* Seção 1: Simulador Interativo do Aplicativo Android */}
        <section id="simulator" className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-purple-400" />
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Simulador do Aplicativo Android (AXION Remote)
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Interaja com a interface exatamente como ela é executada no dispositivo móvel.
              </p>
            </div>
          </div>

          <AndroidSimulator />
        </section>

        {/* Seção 2: Arquitetura & Especificações Técnicas */}
        <section id="architecture" className="space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 uppercase tracking-widest font-mono">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Estrutura do Projeto</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Como o AXION Remote Funciona
            </h2>
            <p className="text-sm text-slate-300">
              Conheça os componentes técnicos desenvolvidos em Kotlin nativo para Android.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#0c0819] border border-purple-500/25 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Servidor RFB 3.8 Embutido</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Implementa o protocolo oficial RFB (RFC 6143) em socket TCP dual-stack (<code className="text-purple-300">::</code>). Executa o handshake de versão, autenticação DES challenge-response e streaming de tela.
              </p>
              <div className="text-[11px] font-mono text-purple-400 pt-1">
                • RfbServer.kt & RfbClientHandler.kt
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#0c0819] border border-cyan-500/25 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Captura MediaProjection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Utiliza a API oficial de projeção de mídia com VirtualDisplay e ImageReader. A execução ocorre dentro de um Foreground Service do tipo <code className="text-cyan-300">mediaProjection</code> com autorização explícita do usuário.
              </p>
              <div className="text-[11px] font-mono text-cyan-400 pt-1">
                • ScreenCaptureManager.kt
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#0c0819] border border-emerald-500/25 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Gestos via Acessibilidade</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Eventos de ponteiro (PointerEvent) recebidos do RealVNC Viewer são traduzidos em toques e arrastos oficiais com <code className="text-emerald-300">dispatchGesture()</code> pelo AccessibilityService.
              </p>
              <div className="text-[11px] font-mono text-emerald-400 pt-1">
                • AxionAccessibilityService.kt
              </div>
            </div>

          </div>
        </section>

        {/* Seção 3: Código do Projeto & Download do ZIP */}
        <section id="code" className="space-y-6">
          <CodeExplorer />
        </section>

        {/* Seção 4: Guia de Compilação com Gradle */}
        <section id="guide" className="space-y-6">
          <CompilationGuide />
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/15 bg-[#050309] text-slate-400 text-xs py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-white font-bold">AXION Remote</span>
            <span>— Servidor VNC/RFB Nativo para Android</span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Compatível com RealVNC Viewer • RFC 6143 • IPv6
          </div>
        </div>
      </footer>

    </div>
  );
}
