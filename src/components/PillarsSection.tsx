import React from 'react';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  Server, 
  CheckCircle2, 
  Layers, 
  Radio
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

export const PillarsSection: React.FC = () => {
  return (
    <section id="arquitetura" className="py-20 relative border-t border-purple-500/10 bg-[#06040b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 uppercase tracking-widest font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Arquitetura do Ecossistema</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Pilares Estruturais do AXION
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Para garantir segurança, portabilidade e máxima velocidade, o ecossistema AXION é dividido em camadas modulares:
          </p>
        </div>

        {/* The Pillars Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Pillar 1: SITE */}
          <div className="relative rounded-2xl p-7 bg-[#0c0819] border border-cyan-500/30 shadow-xl shadow-cyan-950/20 flex flex-col justify-between space-y-6 group hover:border-cyan-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Globe className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  ONLINE & ATIVO
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                  Pilar 01 • Distribuição
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  SITE OFICIAL
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Página web oficial, documentação técnica e hub central de download dos instaladores para <strong className="text-white">Computador (PC)</strong> e do pacote <strong className="text-cyan-300">APK</strong>.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                <div className="text-slate-400">Função Principal:</div>
                <div className="text-slate-200 font-medium">Apresentação & Distribuição dos Binários</div>
                <div className="text-slate-400 pt-1">Configuração:</div>
                <div className="text-cyan-300 font-mono">PC_DOWNLOAD_URL & APK_DOWNLOAD_URL</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-cyan-300">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Pronto para receber os arquivos</span>
            </div>
          </div>

          {/* Pillar 2: CLIENTES (PC & APK) */}
          <div className="relative rounded-2xl p-7 bg-gradient-to-b from-[#140c2c] to-[#0c0819] border-2 border-purple-500 shadow-2xl shadow-purple-900/30 flex flex-col justify-between space-y-6 group">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold font-mono tracking-wider bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-md">
              COMPUTADOR & APK
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    <Smartphone className="w-5 h-5" />
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  EM DESENVOLVIMENTO
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block">
                  Pilar 02 • Aplicativo Cliente
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  AXION PC & APK
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Desenvolvidos separadamente: executável para <strong className="text-cyan-300">Computador</strong> (desktop de alta produtividade) e o pacote <strong className="text-purple-300">APK</strong> (para Android ou para rodar em emuladores no Computador).
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                <div className="text-slate-400">Ambientes Alvo:</div>
                <div className="text-slate-200 font-medium">Windows, Linux, macOS, Android</div>
                <div className="text-slate-400 pt-1">Versão Alvo:</div>
                <div className="text-purple-300 font-mono">v{PROJECT_CONFIG.version} Alpha</div>
              </div>
            </div>

            <div className="pt-4 border-t border-purple-500/20 flex items-center gap-2 text-xs text-purple-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Em compilação técnica independente</span>
            </div>
          </div>

          {/* Pillar 3: BACKEND */}
          <div className="relative rounded-2xl p-7 bg-[#0c0819] border border-indigo-500/30 shadow-xl shadow-indigo-950/20 flex flex-col justify-between space-y-6 group hover:border-indigo-400/60 transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Server className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  INFRAESTRUTURA
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider block">
                  Pilar 03 • Núcleo de IA
                </span>
                <h3 className="text-2xl font-bold text-white tracking-tight mt-1">
                  ENGINE & BACKEND
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                Infraestrutura de inteligência artificial autônoma que processa a geração de código, modelos matemáticos e orquestração de tarefas pesadas com total segurança.
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                <div className="text-slate-400">Arquitetura:</div>
                <div className="text-slate-200 font-medium">Serviços distribuídos assíncronos</div>
                <div className="text-slate-400 pt-1">Segurança:</div>
                <div className="text-indigo-300 font-mono">Zero chaves expostas no cliente</div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-indigo-300">
              <Radio className="w-4 h-4 text-indigo-400" />
              <span>Orquestração universal</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
