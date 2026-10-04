import React, { useState } from 'react';
import { 
  Bot, 
  Download, 
  Menu, 
  X, 
  Github, 
  Cpu, 
  Smartphone,
  Monitor,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PROJECT_CONFIG } from '../config/projectConfig';

interface NavbarProps {
  onDownloadPcClick: () => void;
  onDownloadApkClick: () => void;
  onGithubClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onDownloadPcClick, 
  onDownloadApkClick, 
  onGithubClick 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'O que é o AXION?', href: '#sobre' },
    { name: 'Recursos', href: '#recursos' },
    { name: 'Arquitetura', href: '#arquitetura' },
    { name: 'Download (PC & APK)', href: '#download' },
    { name: 'GitHub', href: '#github' },
    { name: 'Roadmap', href: '#roadmap' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-500/15 bg-[#07050d]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#" className="flex items-center gap-3.5 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0d091a] rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#07050d] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-2 ring-[#07050d]" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                AXION
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 border border-purple-500/30 text-purple-300">
                v{PROJECT_CONFIG.version}
              </span>
            </div>
            <span className="text-[11px] tracking-widest font-mono text-purple-400/80 uppercase">
              Universal AI Engine
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors py-1 relative hover:after:w-full after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-cyan-400 after:absolute after:bottom-0 after:left-0 after:transition-all after:duration-300"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={onGithubClick}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            title="Ver no GitHub"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </button>

          {/* PC Download Button */}
          <button
            onClick={onDownloadPcClick}
            className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md shadow-cyan-600/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Baixar para Computador (Windows / Linux / Mac)"
          >
            <Monitor className="w-4 h-4 text-cyan-200" />
            <span>PC / Desktop</span>
          </button>

          {/* APK Download Button */}
          <button
            onClick={onDownloadApkClick}
            className="relative group overflow-hidden flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md shadow-purple-600/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            title="Baixar APK (Android e Emuladores de PC)"
          >
            <Smartphone className="w-4 h-4 text-purple-200" />
            <span>APK Android</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-slate-300 hover:text-white transition-colors"
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-purple-500/20 bg-[#0c0919] px-4 pt-3 pb-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between py-2 border-b border-white/5">
            <span className="text-xs font-mono text-slate-400">Plataforma</span>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Computador & Android (v{PROJECT_CONFIG.version})
            </span>
          </div>

          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-medium text-slate-200 hover:text-purple-300 border-b border-white/5"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadPcClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-cyan-600/30"
            >
              <Monitor className="w-4 h-4 text-cyan-200" />
              <span>Baixar para Computador (PC)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onDownloadApkClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-600/30"
            >
              <Smartphone className="w-4 h-4 text-purple-200" />
              <span>Baixar APK (Android / Emulador)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGithubClick();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <Github className="w-4 h-4" />
              <span>Ver Projeto no GitHub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
