import React from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight,
  Smartphone,
  Cpu,
  Globe
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

export const RoadmapSection: React.FC = () => {
  const steps = [
    {
      phase: 'Fase 01',
      title: 'Estrutura Oficial & Distribuição',
      tag: 'Concluído no Site',
      status: 'completed',
      date: 'Versão 0.1.0 (Atual)',
      description: 'Lançamento do site oficial do AXION com preparação da arquitetura, especificações técnicas dos módulos e ponto de distribuição único para o APK.',
      items: [
        'Site oficial responsivo e preparado para deploy',
        'Configuração centralizada APK_DOWNLOAD_URL',
        'Mapeamento dos módulos de desenvolvimento'
      ]
    },
    {
      phase: 'Fase 02',
      title: 'Compilação do APK Android (Alpha)',
      tag: 'Em Andamento',
      status: 'current',
      date: 'Em desenvolvimento',
      description: 'Construção do aplicativo móvel independente para Android: interface nativa, gerenciamento de projetos e comunicação local.',
      items: [
        'Desenvolvimento da interface mobile tátil',
        'Empacotamento do instalador .APK inicial',
        'Testes de compatibilidade (Android 8.0+)'
      ]
    },
    {
      phase: 'Fase 03',
      title: 'Conexão com o Núcleo Universal AI Engine',
      tag: 'Próxima Etapa',
      status: 'upcoming',
      date: 'Planejamento 2026',
      description: 'Integração do aplicativo móvel com o motor de inteligência artificial assíncrono para geração de código, scripts Roblox e automações.',
      items: [
        'Habilitação dos geradores de código e templates',
        'Integração dos módulos Roblox / Luau',
        'Suporte a múltiplos tipos de projetos'
      ]
    },
    {
      phase: 'Fase 04',
      title: 'Release Público & Comunidade',
      tag: 'Futuro',
      status: 'future',
      date: 'Versão 1.0.0',
      description: 'Disponibilização pública do APK consolidado no site oficial e abertura da comunidade no GitHub para melhorias contínuas.',
      items: [
        'Download direto do APK estável no site',
        'Sincronização de repositório no GitHub',
        'Documentação de APIs e plugins da comunidade'
      ]
    }
  ];

  return (
    <section id="roadmap" className="py-20 relative border-t border-purple-500/10 bg-[#06040b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 uppercase tracking-widest font-mono">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span>Evolução do Projeto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Roadmap do <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">AXION</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Acompanhe o cronograma de desenvolvimento do motor e a preparação do aplicativo móvel para Android.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl flex flex-col justify-between space-y-4 border transition-all ${
                step.status === 'completed'
                  ? 'bg-[#0f0a22]/70 border-emerald-500/30'
                  : step.status === 'current'
                  ? 'bg-gradient-to-b from-[#160d33] to-[#0c081a] border-purple-500/60 shadow-lg shadow-purple-900/30'
                  : 'bg-[#0c0819]/50 border-white/5 opacity-85'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
                    {step.phase}
                  </span>
                  
                  {step.status === 'completed' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {step.tag}
                    </span>
                  )}
                  {step.status === 'current' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/30 text-purple-200 border border-purple-500/50 animate-pulse">
                      {step.tag}
                    </span>
                  )}
                  {step.status !== 'completed' && step.status !== 'current' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-400 border border-white/10">
                      {step.tag}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight">
                  {step.title}
                </h3>

                <p className="text-xs font-mono text-cyan-400/90">
                  {step.date}
                </p>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                {step.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-start gap-1.5">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span className="text-[11px] leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
