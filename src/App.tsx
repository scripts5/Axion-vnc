/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROJECT_CONFIG } from './config/projectConfig';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PillarsSection } from './components/PillarsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DownloadSection } from './components/DownloadSection';
import { GitHubSection } from './components/GitHubSection';
import { RoadmapSection } from './components/RoadmapSection';
import { Footer } from './components/Footer';
import { ApkNoticeModal } from './components/ApkNoticeModal';
import { GithubNoticeModal } from './components/GithubNoticeModal';
import { Settings, Check, ExternalLink, Monitor, Smartphone } from 'lucide-react';

export default function App() {
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedNoticePlatform, setSelectedNoticePlatform] = useState<'pc' | 'apk'>('pc');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  
  // State to simulate real download URLs in preview
  const [simulatedPcUrl, setSimulatedPcUrl] = useState<string | null>(null);
  const [simulatedApkUrl, setSimulatedApkUrl] = useState<string | null>(null);
  const [showDevSimulator, setShowDevSimulator] = useState(false);

  const activePcUrl = simulatedPcUrl ?? PROJECT_CONFIG.pcDownloadUrl;
  const isPcAvailable = Boolean(activePcUrl && activePcUrl.trim().length > 0);

  const activeApkUrl = simulatedApkUrl ?? PROJECT_CONFIG.apkDownloadUrl;
  const isApkAvailable = Boolean(activeApkUrl && activeApkUrl.trim().length > 0);

  const handleDownloadPcClick = () => {
    if (isPcAvailable) {
      window.location.href = activePcUrl;
    } else {
      setSelectedNoticePlatform('pc');
      setIsNoticeModalOpen(true);
    }
  };

  const handleDownloadApkClick = () => {
    if (isApkAvailable) {
      window.location.href = activeApkUrl;
    } else {
      setSelectedNoticePlatform('apk');
      setIsNoticeModalOpen(true);
    }
  };

  const handleGithubClick = () => {
    if (PROJECT_CONFIG.isGithubReady) {
      window.open(PROJECT_CONFIG.githubUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsGithubModalOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07050d] text-slate-100 flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* Dev Simulation Banner if any is active */}
      {(simulatedPcUrl || simulatedApkUrl) && (
        <div className="bg-emerald-950 border-b border-emerald-500/40 text-emerald-300 text-xs py-2 px-4 text-center font-mono flex items-center justify-center gap-2 flex-wrap">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>
            [SIMULAÇÃO ATIVA]: {simulatedPcUrl ? 'PC URL configurada' : ''} {simulatedApkUrl ? 'APK URL configurada' : ''}. Download direto ativado para teste.
          </span>
          <button
            onClick={() => {
              setSimulatedPcUrl(null);
              setSimulatedApkUrl(null);
            }}
            className="underline ml-2 text-white hover:text-emerald-200"
          >
            Resetar para Estado Real (Em Preparação)
          </button>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar 
        onDownloadPcClick={handleDownloadPcClick}
        onDownloadApkClick={handleDownloadApkClick}
        onGithubClick={handleGithubClick} 
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero 
          onDownloadPcClick={handleDownloadPcClick}
          onDownloadApkClick={handleDownloadApkClick}
          onExploreClick={() => scrollToSection('sobre')} 
        />

        <AboutSection />

        <PillarsSection />

        <FeaturesSection />

        <DownloadSection 
          onDownloadPcClick={handleDownloadPcClick}
          onDownloadApkClick={handleDownloadApkClick}
        />

        <GitHubSection 
          onNotifyRepoPending={() => setIsGithubModalOpen(true)} 
        />

        <RoadmapSection />
      </main>

      {/* Site Footer */}
      <Footer 
        onDownloadPcClick={handleDownloadPcClick}
        onDownloadApkClick={handleDownloadApkClick}
        onGithubClick={handleGithubClick} 
      />

      {/* Informative Download Notice Modal (for PC or APK) */}
      <ApkNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        platformType={selectedNoticePlatform}
      />

      {/* GitHub Setup Notice Modal */}
      <GithubNoticeModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />

      {/* Developer Quick-Check Floating Action (Bottom-right) */}
      <div className="fixed bottom-4 right-4 z-40">
        {!showDevSimulator ? (
          <button
            onClick={() => setShowDevSimulator(true)}
            className="p-3 rounded-full bg-[#181131] border border-purple-500/40 text-purple-300 hover:text-white shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 text-xs font-mono"
            title="Painel de Teste para o Dono do Projeto"
          >
            <Settings className="w-4 h-4 animate-spin-slow" />
            <span className="hidden sm:inline">Guia de URLs (PC & APK)</span>
          </button>
        ) : (
          <div className="bg-[#100a26] border border-purple-500/40 rounded-2xl p-4 shadow-2xl w-84 text-xs space-y-3 animate-fade-in font-mono text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-purple-400" />
                Configuração de URLs
              </span>
              <button
                onClick={() => setShowDevSimulator(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              Edite as constantes em <span className="text-purple-300">src/config/projectConfig.ts</span>:
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => setSimulatedPcUrl('https://exemplo.com/axion-pc-setup.exe')}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all ${
                  simulatedPcUrl
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                {simulatedPcUrl ? '✓ PC Simulado Ativo' : 'Simular PC_DOWNLOAD_URL'}
              </button>

              <button
                onClick={() => setSimulatedApkUrl('https://exemplo.com/axion-v0.1.0.apk')}
                className={`w-full py-1.5 px-2.5 rounded-lg border text-left transition-all ${
                  simulatedApkUrl
                    ? 'bg-purple-950/60 border-purple-500/50 text-purple-300'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                }`}
              >
                {simulatedApkUrl ? '✓ APK Simulado Ativo' : 'Simular APK_DOWNLOAD_URL'}
              </button>

              {(simulatedPcUrl || simulatedApkUrl) && (
                <button
                  onClick={() => {
                    setSimulatedPcUrl(null);
                    setSimulatedApkUrl(null);
                  }}
                  className="w-full py-1 text-[10px] text-rose-400 hover:underline"
                >
                  Resetar para estado real (Em desenvolvimento)
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-white/5 text-[10px] text-slate-400 space-y-1">
              <div>PC_DOWNLOAD_URL: <span className="text-cyan-300">{PROJECT_CONFIG.pcDownloadUrl ? 'Definido' : '""'}</span></div>
              <div>APK_DOWNLOAD_URL: <span className="text-purple-300">{PROJECT_CONFIG.apkDownloadUrl ? 'Definido' : '""'}</span></div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
