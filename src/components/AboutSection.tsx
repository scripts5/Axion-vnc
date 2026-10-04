import React from 'react';
import { 
  Sparkles, 
  Cpu, 
  Workflow, 
  Layers, 
  CheckCircle2, 
  Compass, 
  Boxes, 
  Terminal, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="py-20 relative border-t border-purple-500/10 bg-[#080512]">
      {/* Background soft glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 uppercase tracking-widest font-mono">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Visão do Projeto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            O que é o <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AXION</span>?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            O <strong className="text-white">AXION — Universal AI Engine</strong> está sendo desenvolvido como uma plataforma unificada de inteligência artificial projetada para atuar em múltiplas frentes de criação técnica e desenvolvimento.
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Multi-Domínio */}
          <div className="p-7 rounded-2xl bg-[#0f0b20]/70 border border-purple-500/20 hover:border-purple-500/40 transition-all group hover:shadow-xl hover:shadow-purple-900/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Boxes className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Motor Universal de Tarefas
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Diferente de ferramentas limitadas a uma única linguagem ou nicho, o motor do AXION está sendo modelado para entender requisitos completos: da lógica de negócios e design até scripts de jogos e arquiteturas nativas.
            </p>
            <div className="pt-2 text-xs font-mono text-purple-300/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Multi-paradigma & Modular</span>
            </div>
          </div>

          {/* Card 2: Foco no Desenvolvedor */}
          <div className="p-7 rounded-2xl bg-[#0f0b20]/70 border border-purple-500/20 hover:border-indigo-500/40 transition-all group hover:shadow-xl hover:shadow-indigo-900/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Workflow className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Assistência & Automação Prática
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              O objetivo central é acelerar a transformação de uma simples ideia em um projeto executável. Ele auxilia na escrita de código limpo, estruturação de diretórios, correção de erros e rotinas de automação.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-300/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>Foco em produtividade real</span>
            </div>
          </div>

          {/* Card 3: Mobilidade com Android */}
          <div className="p-7 rounded-2xl bg-[#0f0b20]/70 border border-purple-500/20 hover:border-cyan-500/40 transition-all group hover:shadow-xl hover:shadow-cyan-900/20 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Experiência no Celular
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              A inteligência artificial não deve ficar presa a terminais complexos de desktop. O cliente Android do AXION permitirá gerenciar, consultar e gerar projetos diretamente na palma da sua mão.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-300/80 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Distribuição via APK independente</span>
            </div>
          </div>

        </div>

        {/* Commitment to Truth & Clarity banner */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black border border-purple-500/25 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Fase Atual do AXION: {PROJECT_CONFIG.versionStage} (v{PROJECT_CONFIG.version})
              </h4>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                O projeto está em constante evolução. Cada funcionalidade do motor passa por planejamento detalhado e testes rigorosos antes de ser integrada à versão pública do APK para Android.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-500/30 text-xs font-mono">
              Roadmap 2026 Ativo
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
