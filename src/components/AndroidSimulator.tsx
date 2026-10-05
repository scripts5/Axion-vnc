import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Settings, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Wifi, 
  ShieldCheck, 
  Smartphone, 
  Monitor, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  Laptop
} from 'lucide-react';

export const AndroidSimulator: React.FC = () => {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [port, setPort] = useState(5900);
  const [password, setPassword] = useState('axion');
  const [showPassword, setShowPassword] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempPort, setTempPort] = useState('5900');
  const [tempPassword, setTempPassword] = useState('axion');

  // IPv6 Global detectado
  const ipv6Address = '2001:0db8:85a3:0000:0000:8a2e:0370:7334';
  const formattedAddress = `[${ipv6Address}]:${port}`;

  const [logs, setLogs] = useState<string[]>([
    '[14:20:01] AXION Remote inicializado no dispositivo Android.',
    '[14:20:02] Interfaces de rede verificadas: IPv6 Global Unicast detectado.',
    '[14:20:02] Pronto para inicialização com permissão MediaProjection.'
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setLogs((prev) => [...prev, `[${time}] ${msg}`].slice(-60));
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleStartServer = () => {
    setIsServerRunning(true);
    addLog(`Foreground Service tipo mediaProjection iniciado.`);
    addLog(`Servidor RFB escutando em [::]:${port} (IPv6 e IPv4 ativos).`);
    addLog(`Aguardando conexões do RealVNC Viewer em ${formattedAddress}`);
  };

  const handleStopServer = () => {
    setIsServerRunning(false);
    setClientCount(0);
    addLog(`Servidor RFB/VNC interrompido pelo usuário.`);
    addLog(`Captura de tela MediaProjection finalizada.`);
  };

  const handleCopyData = () => {
    const text = `Endereço RealVNC: ${formattedAddress}\nSenha VNC: ${password}\nPorta: ${port}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    addLog(`Dados de conexão copiados para a área de transferência.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateRealVncConnection = () => {
    if (!isServerRunning) {
      handleStartServer();
    }
    setTimeout(() => {
      addLog(`RealVNC Viewer conectando de [2001:db8:85a3::100]:54321...`);
      addLog(`Handshake RFB: enviando versão 'RFB 003.008'`);
      addLog(`Negociação de Segurança: Tipo 2 (VNC Authentication DES)`);
      addLog(`Desafio de 16 bytes enviado ao RealVNC Viewer`);
      addLog(`Resposta DES criptografada validada com sucesso!`);
      addLog(`ServerInit enviado: 720x1280 32bpp nome 'AXION Remote'`);
      setClientCount(1);
      addLog(`Sessão RFB ativa: transmitindo tela via MediaProjection.`);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Coluna Esquerda: O Celular Android com AXION REMOTE */}
      <div className="lg:col-span-6 flex flex-col items-center">
        
        {/* Mockup do Smartphone */}
        <div className="w-full max-w-[380px] rounded-[44px] p-3.5 bg-gradient-to-b from-purple-500/40 via-indigo-600/20 to-cyan-500/30 border-2 border-white/20 shadow-2xl shadow-purple-950/80 backdrop-blur-xl">
          
          <div className="bg-[#07050d] rounded-[34px] p-5 border border-purple-500/30 overflow-hidden flex flex-col justify-between min-h-[660px]">
            
            {/* Barra de Status do Android */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pb-3 border-b border-white/10">
              <span className="text-white font-semibold">14:20</span>
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-purple-300 font-bold">IPv6</span>
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
            </div>

            {/* Cabeçalho do App */}
            <div className="pt-3 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black tracking-wider text-white flex items-center gap-2">
                    <span>AXION REMOTE</span>
                  </h2>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">
                    Servidor VNC / RFB Nativo
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono">
                  <span className={`w-2 h-2 rounded-full ${isServerRunning ? 'bg-emerald-400 animate-ping' : 'bg-rose-500'}`} />
                  <span className={isServerRunning ? 'text-emerald-300' : 'text-rose-400'}>
                    {isServerRunning ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>
              </div>
            </div>

            {/* CARD PRINCIPAL (Exatamente como solicitado no prompt) */}
            <div className={`p-4 rounded-2xl border transition-all my-2 space-y-3 ${
              isServerRunning 
                ? 'bg-[#0f1b1b]/80 border-emerald-500/50 shadow-lg shadow-emerald-950/40' 
                : 'bg-[#0e0a1e] border-purple-500/30'
            }`}>
              
              {/* Header de Status */}
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isServerRunning ? 'text-emerald-400' : 'text-rose-500'}`}>●</span>
                  <span className={`text-xs font-extrabold tracking-wider font-mono ${
                    isServerRunning ? 'text-emerald-300' : 'text-rose-400'
                  }`}>
                    {isServerRunning ? 'SERVIDOR ONLINE' : 'SERVIDOR OFFLINE'}
                  </span>
                </div>

                {isServerRunning && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    Clientes: {clientCount}
                  </span>
                )}
              </div>

              {/* IPv6 Field */}
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  IPv6:
                </span>
                <span className="text-xs font-mono text-slate-100 font-semibold break-all block leading-tight">
                  {ipv6Address}
                </span>
              </div>

              {/* Porta & Senha lado a lado */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">Porta:</span>
                  <span className="text-sm font-mono font-bold text-cyan-300">{port}</span>
                </div>

                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Senha:</span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white"
                      title="Alternar visibilidade"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                  <span className="text-sm font-mono font-bold text-purple-300">
                    {showPassword ? password : '••••••••'}
                  </span>
                </div>
              </div>

              {/* Status & Formato RealVNC */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                <div>
                  <span className="text-slate-400 block text-[9px]">Status:</span>
                  <span className={`font-bold ${isServerRunning ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isServerRunning ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[9px]">Formato RealVNC:</span>
                  <span className="text-cyan-300 text-[10px] font-bold">{formattedAddress}</span>
                </div>
              </div>

            </div>

            {/* BOTÕES DE CONTROLE */}
            <div className="space-y-2 py-2">
              <div className="grid grid-cols-2 gap-2">
                {/* [ CONFIGURAR ] */}
                <button
                  onClick={() => {
                    setTempPort(port.toString());
                    setTempPassword(password);
                    setShowConfigModal(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  <Settings className="w-3.5 h-3.5 text-purple-400" />
                  <span>CONFIGURAR</span>
                </button>

                {/* [ COPIAR DADOS ] */}
                <button
                  onClick={handleCopyData}
                  className="py-2.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-200 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                  <span>{copied ? 'COPIADO' : 'COPIAR DADOS'}</span>
                </button>
              </div>

              {/* [ INICIAR / PARAR SERVIDOR ] */}
              {!isServerRunning ? (
                <button
                  onClick={handleStartServer}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>INICIAR SERVIDOR</span>
                </button>
              ) : (
                <button
                  onClick={handleStopServer}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98]"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>PARAR SERVIDOR</span>
                </button>
              )}
            </div>

            {/* Card de Controle de Toque (AccessibilityService) */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-white font-semibold block text-[11px]">Controle por Toque</span>
                  <span className="text-[9px] text-slate-400">AccessibilityService habilitado</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ATIVO</span>
            </div>

            {/* LOGS DE DIAGNÓSTICO DO CELULAR */}
            <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>LOGS DE DIAGNÓSTICO:</span>
                <span>{logs.length} eventos</span>
              </div>
              <div
                ref={logContainerRef}
                className="h-24 overflow-y-auto p-2 rounded-xl bg-black/90 border border-white/5 font-mono text-[9.5px] space-y-1 text-slate-300"
              >
                {logs.map((log, i) => (
                  <div
                    key={i}
                    className={
                      log.includes('Erro') || log.includes('Falha')
                        ? 'text-rose-400'
                        : log.includes('ONLINE') || log.includes('sucesso')
                        ? 'text-emerald-300'
                        : 'text-slate-400'
                    }
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Coluna Direita: O Computador com RealVNC Viewer & Guia */}
      <div className="lg:col-span-6 space-y-6">
        
        {/* Card do RealVNC Viewer no Computador */}
        <div className="rounded-3xl p-6 sm:p-7 bg-[#0d091e] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/40 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  No Computador: RealVNC Viewer
                </h3>
                <span className="text-xs font-mono text-cyan-400">Cliente VNC Oficial</span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              RFB 3.8
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            No computador, abra o <strong>RealVNC Viewer</strong> e conecte-se usando o endereço IPv6 com colchetes:
          </p>

          {/* Campo de Conexão do RealVNC */}
          <div className="p-4 rounded-2xl bg-black/80 border border-white/10 space-y-3 font-mono">
            <span className="text-xs text-slate-400 block font-sans font-semibold">
              Endereço para digitar no RealVNC Viewer:
            </span>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#130d24] border border-cyan-500/40 text-cyan-300 text-sm font-bold">
              <span className="truncate">{formattedAddress}</span>
              <button
                onClick={handleCopyData}
                className="text-xs px-2.5 py-1 rounded bg-white/10 hover:bg-white/15 text-white transition-colors shrink-0 ml-2"
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
              <span>Senha de Acesso:</span>
              <span className="text-purple-300 font-bold">{password}</span>
            </div>
          </div>

          {/* Botão de Testar Conexão RealVNC */}
          <div className="pt-1">
            <button
              onClick={handleSimulateRealVncConnection}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Simular Conexão do RealVNC Viewer</span>
            </button>
          </div>

          {/* Especificações do Protocolo Ativas */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">Autenticação:</span>
              <span className="text-emerald-400 font-bold">VNC DES (RFC 6143)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">Captura de Vídeo:</span>
              <span className="text-purple-400 font-bold">MediaProjection RGBA</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">Controle Remoto:</span>
              <span className="text-cyan-400 font-bold">dispatchGesture()</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-slate-400 block text-[10px]">Pilha de Rede:</span>
              <span className="text-indigo-400 font-bold">Dual-Stack IPv6 / IPv4</span>
            </div>
          </div>

        </div>

        {/* Card Informativo das Regras Técnicas */}
        <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/20 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-purple-300 font-semibold font-mono text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Conformidade com o Android Nativo</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            O AXION Remote opera respeitando estritamente os contratos de segurança do Android:
            captura via <strong>MediaProjection</strong> iniciada apenas por autorização explícita do usuário, serviço de primeiro plano declarado como <strong>mediaProjection</strong> e injeção de toques com o serviço oficial <strong>AccessibilityService</strong>.
          </p>
        </div>

      </div>

      {/* MODAL DE CONFIGURAÇÃO (PORTA & SENHA) */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="fixed inset-0" onClick={() => setShowConfigModal(false)} />

          <div className="relative w-full max-w-md bg-[#0e091f] border border-purple-500/40 rounded-2xl p-6 sm:p-7 space-y-5 z-10 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" />
                <span>Configurar AXION Remote</span>
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">
                  Porta TCP do Servidor VNC:
                </label>
                <input
                  type="number"
                  value={tempPort}
                  onChange={(e) => setTempPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white font-bold focus:outline-none focus:border-cyan-400"
                  placeholder="5900"
                />
                <span className="text-[10px] text-slate-500">Padrão RFB: 5900</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium block">
                  Senha VNC (armazenada com Keystore AES-256):
                </label>
                <input
                  type="text"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  maxLength={8}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-purple-500/30 text-white font-bold focus:outline-none focus:border-purple-400"
                  placeholder="axion"
                />
                <span className="text-[10px] text-slate-500">
                  O padrão VNC DES aceita até 8 caracteres.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const p = parseInt(tempPort, 10) || 5900;
                  setPort(p);
                  setPassword(tempPassword || 'axion');
                  setShowConfigModal(false);
                  addLog(`Configuração atualizada: Porta ${p}, Senha alterada.`);
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-900/30"
              >
                Salvar Configurações
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
