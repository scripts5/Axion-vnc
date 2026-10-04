import React, { useState } from 'react';
import { 
  Bot, 
  Code2, 
  Smartphone, 
  Globe, 
  FolderKanban, 
  Gamepad2, 
  Terminal, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { FeatureItem } from '../types';

export const FeaturesSection: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  const features: FeatureItem[] = [
    {
      id: 'ia',
      title: 'Inteligência Artificial',
      category: 'Core Engine',
      shortDescription: 'Motor de raciocínio context-aware para compreensão profunda de regras de negócio e especificações técnicas.',
      fullDescription: 'O módulo central de IA do AXION foi desenhado para processar instruções em linguagem natural e convertê-las em passos lógicos de engenharia de software. Ele mantém memória de contexto e consistência através de diferentes arquivos.',
      status: 'Em Desenvolvimento',
      statusColor: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      highlights: [
        'Compreensão semântica de requisitos',
        'Planejamento de passos lógicos',
        'Refinamento iterativo de soluções'
      ],
      iconName: 'ia'
    },
    {
      id: 'geracao-codigo',
      title: 'Geração de Código',
      category: 'Programação',
      shortDescription: 'Geração de código limpo, tipado e com boas práticas em múltiplas linguagens (TypeScript, Kotlin, Python, Luau, etc.).',
      fullDescription: 'Projetado para produzir código legível, testável e sem boilerplate desnecessário. Em desenvolvimento para seguir padrões estritos de arquitetura limpa (Clean Architecture, SOLID, Design Patterns).',
      status: 'Em Desenvolvimento',
      statusColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      highlights: [
        'Suporte a tipagem estrita',
        'Comentários explicativos objetivos',
        'Padrões modernos de sintaxe'
      ],
      iconName: 'code'
    },
    {
      id: 'android',
      title: 'Desenvolvimento Android',
      category: 'Mobile',
      shortDescription: 'Suporte a layouts modernos em Jetpack Compose, XML, configurações Gradle e ciclo de vida de apps Android.',
      fullDescription: 'Focado em auxiliar na criação de aplicativos móveis reais: criação de composables, integração de APIs REST, Room Database e preparação de pacotes APK com segurança e fluidez.',
      status: 'Em Modelagem',
      statusColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      highlights: [
        'Arquitetura MVVM / MVI',
        'Jetpack Compose moderno',
        'Boas práticas de permissões Android'
      ],
      iconName: 'android'
    },
    {
      id: 'web',
      title: 'Desenvolvimento Web',
      category: 'Frontend & Fullstack',
      shortDescription: 'Criação de páginas responsivas, componentes React, interfaces Tailwind CSS e rotas de backend.',
      fullDescription: 'Planejado para atuar em todo o fluxo web: estruturação de interfaces acessíveis, responsividade mobile-first, chamadas assíncronas e renderização de alta velocidade.',
      status: 'Em Desenvolvimento',
      statusColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      highlights: [
        'React & Vite moderno',
        'Estilização fluida com Tailwind CSS',
        'Consumo de APIs RESTful'
      ],
      iconName: 'web'
    },
    {
      id: 'projetos',
      title: 'Gestão de Projetos',
      category: 'Arquitetura',
      shortDescription: 'Estruturação de árvores de diretórios, separação modular e documentação técnica para novos projetos.',
      fullDescription: 'Ajuda a tirar uma ideia do papel organizando a hierarquia de pastas, convenções de nomenclatura, diagramas de módulos e arquivos de configuração como tsconfig, manifest e gitignore.',
      status: 'Planejado',
      statusColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      highlights: [
        'Scaffolding inteligente de pastas',
        'Geração de README e documentação',
        'Padronização de arquitetura'
      ],
      iconName: 'projects'
    },
    {
      id: 'roblox',
      title: 'Roblox & Luau',
      category: 'Game Scripting',
      shortDescription: 'Scripts especializados em Luau para Roblox Studio: mecânicas de jogo, DataStoreService e UI móvel.',
      fullDescription: 'Dedicado aos criadores de jogos no ecossistema Roblox. O módulo compreende a API do Roblox Studio, hierarquia de instâncias, RemoteEvents para comunicação cliente-servidor e otimização de render.',
      status: 'Em Modelagem',
      statusColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      highlights: [
        'Scripts Luau para Server & Client',
        'Comunicação segura via RemoteEvents',
        'Sistemas de inventário e economia'
      ],
      iconName: 'roblox'
    },
    {
      id: 'assistencia',
      title: 'Assistência para Programação',
      category: 'Debugging & Review',
      shortDescription: 'Diagnóstico de erros, refatoração de código legado e explicação passo a passo de algoritmos.',
      fullDescription: 'Atua como um parceiro técnico no seu fluxo diário: identifique vazamentos de memória, erros de compilação, bugs de concorrência e receba alternativas mais performáticas.',
      status: 'Em Desenvolvimento',
      statusColor: 'text-pink-400 border-pink-500/30 bg-pink-500/10',
      highlights: [
        'Leitura e análise de stack traces',
        'Sugestão de refatoração pontual',
        'Otimização de tempo de execução'
      ],
      iconName: 'assist'
    },
    {
      id: 'automacao',
      title: 'Automação',
      category: 'DevOps & Workflows',
      shortDescription: 'Scripts para tarefas repetitivas, pipelines de build, formatação em lote e rotinas de deploy.',
      fullDescription: 'Em desenvolvimento para automatizar fluxos monótonos como testes, conversão de dados JSON/CSV, renomeação em massa e comandos de orquestração no terminal ou no dispositivo móvel.',
      status: 'Planejado',
      statusColor: 'text-teal-400 border-teal-500/30 bg-teal-500/10',
      highlights: [
        'Scripts shell e utilitários rápidos',
        'Padronização de builds',
        'Redução de trabalho manual'
      ],
      iconName: 'automation'
    }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ia': return <Bot className="w-6 h-6" />;
      case 'code': return <Code2 className="w-6 h-6" />;
      case 'android': return <Smartphone className="w-6 h-6" />;
      case 'web': return <Globe className="w-6 h-6" />;
      case 'projects': return <FolderKanban className="w-6 h-6" />;
      case 'roblox': return <Gamepad2 className="w-6 h-6" />;
      case 'assist': return <Terminal className="w-6 h-6" />;
      case 'automation': return <Cpu className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="recursos" className="py-24 relative bg-[#07050d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Módulos Técnicos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Recursos em Desenvolvimento
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Conheça os pilares funcionais que compõem o escopo do AXION. Cada recurso está sendo planejado para atuar em harmonia dentro do aplicativo Android e no motor central.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-400 font-mono">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Nota: os módulos estão em estágios progressivos de especificação e desenvolvimento.</span>
          </div>
        </div>

        {/* 8 Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="relative p-6 rounded-2xl bg-[#0e0a1e]/80 border border-purple-500/20 hover:border-purple-400/50 flex flex-col justify-between group hover:shadow-xl hover:shadow-purple-950/40 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedFeature(feature)}
            >
              <div className="space-y-4">
                
                {/* Header: Icon + Status */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-300 group-hover:scale-105 group-hover:text-cyan-300 transition-all">
                    {renderIcon(feature.iconName)}
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${feature.statusColor}`}>
                    {feature.status}
                  </span>
                </div>

                {/* Title & Category */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    {feature.category}
                  </span>
                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                </div>

                {/* Short Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {feature.shortDescription}
                </p>

                {/* Highlights preview */}
                <div className="pt-2 border-t border-white/5 space-y-1">
                  {feature.highlights.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <span className="w-1 h-1 rounded-full bg-cyan-400" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Bottom Interactive cue */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-purple-400 group-hover:text-cyan-300 transition-colors">
                <span className="font-medium text-[11px]">Ver detalhes técnicos</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>

            </div>
          ))}
        </div>

        {/* Modal for Feature Details */}
        {selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="fixed inset-0" onClick={() => setSelectedFeature(null)} />
            
            <div className="relative w-full max-w-lg bg-[#0e091f] border border-purple-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    {renderIcon(selectedFeature.iconName)}
                  </div>
                  <div>
                    <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                      {selectedFeature.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedFeature.title}
                    </h3>
                  </div>
                </div>
                
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono border ${selectedFeature.statusColor}`}>
                  {selectedFeature.status}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-300 leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                <h4 className="text-xs font-semibold font-mono text-purple-300 uppercase tracking-wider">
                  Especificação Técnica em Desenvolvimento
                </h4>
                <p>{selectedFeature.fullDescription}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold font-mono text-slate-400 uppercase tracking-wider">
                  Capacidades Planejadas para o AXION:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-200">
                  {selectedFeature.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-sm font-medium transition-colors"
                >
                  Fechar Detalhes
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
