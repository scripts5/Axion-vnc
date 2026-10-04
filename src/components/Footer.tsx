import React from 'react';
import { 
  Cpu, 
  Smartphone, 
  Monitor, 
  Github, 
  Download 
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface FooterProps {
  onDownloadPcClick: () => void;
  onDownloadApkClick: () => void;
  onGithubClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onDownloadPcClick, 
  onDownloadApkClick, 
  onGithubClick 
}) => {
  return (
    <footer className="border-t border-purple-500/15 bg-[#050309] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#0d091a] rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-4 h-4 text-purple-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-wider text-white">
                  AXION
                </span>
                <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase">
                  Universal AI Engine
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Plataforma de inteligência artificial para criar, programar e transformar ideias em projetos. Página oficial de distribuição para Computador (PC) e Android (APK).
            </p>

            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                v{PROJECT_CONFIG.version} Alpha
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Computador & Android
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#sobre" className="hover:text-purple-300 transition-colors">
                  O que é o AXION?
                </a>
              </li>
              <li>
                <a href="#recursos" className="hover:text-purple-300 transition-colors">
                  Recursos em Desenvolvimento
                </a>
              </li>
              <li>
                <a href="#arquitetura" className="hover:text-purple-300 transition-colors">
                  Arquitetura dos Pilares
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-purple-300 transition-colors">
                  Download (PC & APK)
                </a>
              </li>
              <li>
                <a href="#github" className="hover:text-purple-300 transition-colors">
                  Código Aberto & GitHub
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-purple-300 transition-colors">
                  Roadmap & Versões
                </a>
              </li>
            </ul>
          </div>

          {/* Technical clarification */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Esclarecimento do Projeto
            </h4>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs leading-relaxed text-slate-300">
              <p>
                <strong>SITE:</strong> Página oficial e central de downloads.
              </p>
              <p>
                <strong>COMPUTADOR & APK:</strong> Softwares desenvolvidos separadamente (Desktop e Android/Emulador).
              </p>
              <p>
                <strong>BACKEND:</strong> Infraestrutura da inteligência artificial universal.
              </p>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-white/5">
                Não há links fictícios nem arquivos simulados.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {PROJECT_CONFIG.releaseYear} AXION — Universal AI Engine. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={onGithubClick}
              className="hover:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onDownloadPcClick}
              className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5"
            >
              <Monitor className="w-4 h-4" />
              <span>Computador (PC)</span>
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={onDownloadApkClick}
              className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
            >
              <Smartphone className="w-4 h-4" />
              <span>APK</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
