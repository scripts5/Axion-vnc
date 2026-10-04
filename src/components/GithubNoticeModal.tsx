import React from 'react';
import { Github, X, Code2, Check, Copy, ExternalLink } from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface GithubNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GithubNoticeModal: React.FC<GithubNoticeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0e091e] border border-purple-500/30 rounded-2xl shadow-2xl overflow-hidden text-slate-100 z-10 p-6 sm:p-8 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white shrink-0">
            <Github className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Repositório no GitHub
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Conexão com o repositório em preparação.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs sm:text-sm text-slate-300 space-y-2">
          <p>
            Conforme as diretrizes do projeto AXION, não utilizamos links de repositórios fictícios.
          </p>
          <p className="text-slate-400 text-xs">
            Assim que você criar o repositório para o AXION, defina a variável <code className="text-purple-300 bg-black/40 px-1 py-0.5 rounded">GITHUB_URL</code> em <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">src/config/projectConfig.ts</code>.
          </p>
        </div>

        <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 text-xs font-mono space-y-1 text-slate-300">
          <div className="text-slate-500">// src/config/projectConfig.ts</div>
          <div>
            <span className="text-pink-400">export const</span> <span className="text-indigo-300">GITHUB_URL</span> = <span className="text-emerald-400">"https://github.com/seu-usuario/axion"</span>;
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
