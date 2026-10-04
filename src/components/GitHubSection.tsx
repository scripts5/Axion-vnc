import React, { useState } from 'react';
import { 
  Github, 
  GitFork, 
  Star, 
  GitBranch, 
  ExternalLink, 
  Check, 
  Copy, 
  Code2, 
  Terminal, 
  FolderGit2,
  AlertCircle
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface GitHubSectionProps {
  onNotifyRepoPending: () => void;
}

export const GitHubSection: React.FC<GitHubSectionProps> = ({ onNotifyRepoPending }) => {
  const [copiedClone, setCopiedClone] = useState(false);

  const gitClonePlaceholder = 'git clone https://github.com/SEU-USUARIO/axion-universal-ai-engine.git';

  const handleCopyClone = () => {
    navigator.clipboard.writeText(gitClonePlaceholder);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  return (
    <section id="github" className="py-20 relative border-t border-purple-500/10 bg-[#07050d]">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 border border-purple-500/25 text-purple-300 uppercase tracking-widest font-mono">
            <Github className="w-3.5 h-3.5 text-purple-400" />
            <span>Código & Comunidade</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Repositório no <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">GitHub</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            O projeto está sendo estruturado para conectar-se ao seu repositório oficial no GitHub. Releases do APK, controle de versão e documentação técnica serão sincronizados.
          </p>
        </div>

        {/* GitHub Repository Card */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="rounded-3xl p-8 bg-[#0c0819] border border-purple-500/25 shadow-xl space-y-6">
            
            {/* Repo Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                  <Github className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-purple-400">axion-project /</span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      axion-universal-ai-engine
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    Página Oficial, Documentação e Releases do APK
                  </span>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                  {PROJECT_CONFIG.isGithubReady ? 'Repositório Ativo' : 'GITHUB_URL: Em Preparação'}
                </span>
              </div>
            </div>

            {/* Repo Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              <div className="space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  Para manter a total transparência solicitada no projeto, nenhuma URL externa foi inventada. O projeto possui um ponto de integração centralizado:
                </p>

                <div className="p-3.5 rounded-xl bg-black/50 border border-purple-500/20 text-xs font-mono space-y-2">
                  <div className="text-slate-400">Variável no código:</div>
                  <div className="text-cyan-300">
                    const <span className="text-purple-300">GITHUB_URL</span> = "{PROJECT_CONFIG.githubUrl || 'GITHUB_URL (placeholder)'}";
                  </div>
                </div>

                <p className="text-xs text-slate-400">
                  Quando você criar o repositório no GitHub, basta inserir a URL real em <code className="text-purple-300">src/config/projectConfig.ts</code>.
                </p>

                {/* Primary Button */}
                <div>
                  {PROJECT_CONFIG.isGithubReady ? (
                    <a
                      href={PROJECT_CONFIG.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
                    >
                      <Github className="w-4 h-4" />
                      <span>Acessar Repositório no GitHub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ) : (
                    <button
                      onClick={onNotifyRepoPending}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10"
                    >
                      <Github className="w-4 h-4" />
                      <span>Conectar ao GitHub (Em breve)</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>

              {/* Terminal Preview */}
              <div className="rounded-2xl bg-black/80 border border-white/10 p-5 space-y-3 font-mono text-xs text-slate-300 shadow-inner">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-slate-500 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-400">bash — git sync</span>
                  </div>
                  <button
                    onClick={handleCopyClone}
                    className="hover:text-white transition-colors flex items-center gap-1"
                    title="Copiar comando de exemplo"
                  >
                    {copiedClone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedClone ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <p className="text-slate-500"># Clonar o projeto após conectar ao GitHub:</p>
                  <p className="text-purple-300 flex items-center gap-1.5">
                    <span className="text-cyan-400">$</span>
                    <span>{gitClonePlaceholder}</span>
                  </p>
                  <p className="text-slate-500 pt-2"># Organização do repositório:</p>
                  <p className="text-slate-400">/site &nbsp; &nbsp; &nbsp;→ Página oficial & distribuição</p>
                  <p className="text-slate-400">/android &nbsp; → Projeto do aplicativo nativo (APK)</p>
                  <p className="text-slate-400">/engine &nbsp;  → Núcleo da IA e orquestração</p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
