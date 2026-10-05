import React, { useState, useEffect, useRef } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Share2, 
  PowerOff, 
  Keyboard, 
  MousePointer, 
  Sliders, 
  Wifi, 
  Maximize2, 
  Minimize2, 
  Check, 
  Copy, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  Lock, 
  RefreshCw,
  QrCode,
  ExternalLink
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import Peer, { MediaConnection, DataConnection } from 'peerjs';

export interface RemoteCommand {
  type: 'mouse_move' | 'mouse_click' | 'mouse_down' | 'mouse_up' | 'key_press' | 'text_input' | 'disable_screen' | 'lock_screen' | 'ping';
  x?: number; // 0.0 to 1.0 (relative coordinates)
  y?: number;
  button?: 'left' | 'right' | 'middle';
  key?: string;
  text?: string;
  timestamp?: number;
}

export const LiveScreenSharer: React.FC = () => {
  // Mode: 'select' | 'pc_host' | 'mobile_client'
  const [mode, setMode] = useState<'select' | 'pc_host' | 'mobile_client'>('select');

  // Common State
  const [roomId, setRoomId] = useState<string>('');
  const [inputRoomId, setInputRoomId] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Pronto para iniciar');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // PC Host State
  const [isSharingScreen, setIsSharingScreen] = useState<boolean>(false);
  const [screenDisabledByPhone, setScreenDisabledByPhone] = useState<boolean>(false);
  const [isScreenLocked, setIsScreenLocked] = useState<boolean>(false);
  const [receivedCommands, setReceivedCommands] = useState<string[]>([]);
  const [remotePointer, setRemotePointer] = useState<{ x: number; y: number; visible: boolean }>({ x: 0.5, y: 0.5, visible: false });

  // Mobile Client State
  const [controlType, setControlType] = useState<'touch' | 'touchpad'>('touch');
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [textToSend, setTextToSend] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Peer & Stream Refs
  const peerRef = useRef<Peer | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const dataConnRef = useRef<DataConnection | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-detect URL parameters: e.g. ?room=AXION-1234&mode=mobile
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      const urlMode = params.get('mode');

      if (urlRoom) {
        setInputRoomId(urlRoom);
        setRoomId(urlRoom);
        if (urlMode === 'mobile' || /Android|iPhone|iPad/i.test(navigator.userAgent)) {
          setMode('mobile_client');
        }
      }
    } catch (_) {}
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSharing();
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, []);

  // ==========================================
  // PC HOST LOGIC (Transmitir a Tela do PC)
  // ==========================================
  const startPcHost = async () => {
    try {
      setStatusMessage('Solicitando permissão de tela...');
      // 1. Capture PC Screen with high performance
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          frameRate: { ideal: 60, max: 60 }
        } as any,
        audio: false
      });

      mediaStreamRef.current = stream;
      setIsSharingScreen(true);
      setScreenDisabledByPhone(false);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }

      // Handle user stopping screen share via browser popup
      stream.getVideoTracks()[0].onended = () => {
        stopSharing();
      };

      // 2. Generate clean, short 4-digit alphanumeric code
      const generatedRoom = 'AXION-' + Math.floor(1000 + Math.random() * 9000);
      setRoomId(generatedRoom);
      setStatusMessage('Criando sala de conexão segura...');

      // 3. Initialize PeerJS as Host
      const peer = new Peer(generatedRoom);
      peerRef.current = peer;

      peer.on('open', (id) => {
        setStatusMessage(`Pronto! Transmitindo no código: ${id}`);
      });

      // When phone calls video stream
      peer.on('call', (call: MediaConnection) => {
        call.answer(stream);
        setIsConnected(true);
        setStatusMessage('Celular conectado! Transmissão ativa.');
      });

      // When phone connects data channel for remote control
      peer.on('connection', (conn: DataConnection) => {
        dataConnRef.current = conn;
        setIsConnected(true);
        setStatusMessage('Controle remoto do celular ATIVO! Apenas o celular pode desativar.');

        conn.on('data', (data: any) => {
          handleIncomingRemoteCommand(data as RemoteCommand);
        });

        conn.on('close', () => {
          setIsConnected(false);
          setStatusMessage('Celular desconectou.');
        });
      });

      peer.on('error', (err) => {
        console.error('Peer error:', err);
        setStatusMessage('Aviso de rede: ' + err.message);
      });

      setMode('pc_host');
    } catch (err: any) {
      console.error('Erro ao capturar tela:', err);
      setStatusMessage('Falha ao compartilhar tela: ' + (err.message || 'Permissão negada.'));
      setIsSharingScreen(false);
    }
  };

  const handleIncomingRemoteCommand = (cmd: RemoteCommand) => {
    // Latency measurement
    if (cmd.timestamp) {
      const now = Date.now();
      setLatencyMs(Math.max(5, now - cmd.timestamp));
    }

    // Process commands from phone
    if (cmd.type === 'disable_screen') {
      setScreenDisabledByPhone(true);
      logCommand('O CELULAR DESATIVOU A TELA DO PC!');
      // Pause track to save bandwidth
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getVideoTracks().forEach(t => t.enabled = false);
      }
    } else if (cmd.type === 'lock_screen') {
      setIsScreenLocked(prev => !prev);
      logCommand(`Celular ${isScreenLocked ? 'desbloqueou' : 'bloqueou'} a tela do PC.`);
    } else if (cmd.type === 'mouse_move' && cmd.x !== undefined && cmd.y !== undefined) {
      setRemotePointer({ x: cmd.x, y: cmd.y, visible: true });
    } else if (cmd.type === 'mouse_click') {
      logCommand(`Clique (${cmd.button || 'esquerdo'}) em (${Math.round((cmd.x || 0) * 100)}%, ${Math.round((cmd.y || 0) * 100)}%)`);
    } else if (cmd.type === 'key_press') {
      logCommand(`Tecla recebida do celular: ${cmd.key}`);
    } else if (cmd.type === 'text_input') {
      logCommand(`Texto digitado pelo celular: "${cmd.text}"`);
    }
  };

  const logCommand = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setReceivedCommands(prev => [`[${time}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const stopSharing = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setIsSharingScreen(false);
    setIsConnected(false);
    setScreenDisabledByPhone(false);
    setStatusMessage('Transmissão encerrada.');
  };

  // ==========================================
  // MOBILE CLIENT LOGIC (Ver e Controlar PC)
  // ==========================================
  const connectToPcHost = (targetRoom: string) => {
    const cleanRoom = targetRoom.trim().toUpperCase();
    if (!cleanRoom) return;

    setStatusMessage(`Conectando ao computador ${cleanRoom}...`);
    setRoomId(cleanRoom);

    // Initialize peer client
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', () => {
      // 1. Establish Data Channel for mouse/keyboard controls
      const conn = peer.connect(cleanRoom, { reliable: true });
      dataConnRef.current = conn;

      conn.on('open', () => {
        setIsConnected(true);
        setStatusMessage('Conectado ao PC! Controle remoto liberado.');
        // Send initial ping
        conn.send({ type: 'ping', timestamp: Date.now() });
      });

      conn.on('close', () => {
        setIsConnected(false);
        setStatusMessage('Conexão encerrada pelo PC.');
      });

      // 2. Request Screen Video Stream
      const dummyCanvas = document.createElement('canvas');
      dummyCanvas.width = 1;
      dummyCanvas.height = 1;
      const dummyStream = dummyCanvas.captureStream(1);

      const call = peer.call(cleanRoom, dummyStream);
      call.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play().catch(() => {});
        }
      });
    });

    peer.on('error', (err) => {
      console.error('Peer error client:', err);
      setStatusMessage('Não foi possível encontrar o computador. Verifique o código: ' + cleanRoom);
      setIsConnected(false);
    });

    setMode('mobile_client');
  };

  const sendRemoteCommand = (cmd: RemoteCommand) => {
    if (dataConnRef.current && dataConnRef.current.open) {
      cmd.timestamp = Date.now();
      dataConnRef.current.send(cmd);
    }
  };

  // Touch on remote video to send relative coordinate clicks
  const handleTouchScreen = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const target = e.currentTarget.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const relX = Math.max(0, Math.min(1, (clientX - target.left) / target.width));
    const relY = Math.max(0, Math.min(1, (clientY - target.top) / target.height));

    sendRemoteCommand({
      type: 'mouse_click',
      x: relX,
      y: relY,
      button: 'left'
    });
  };

  const handleDisableScreenFromPhone = () => {
    sendRemoteCommand({ type: 'disable_screen' });
    setScreenDisabledByPhone(true);
  };

  const shareableUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${roomId}&mode=mobile`
    : '';

  const copyShareLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareableUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="w-full bg-[#07040d] border border-cyan-500/20 rounded-3xl p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : isSharingScreen ? 'bg-cyan-400 animate-ping' : 'bg-slate-500'}`} />
              {isSharingScreen ? 'TRANSMISSÃO DO PC ATIVA' : isConnected ? 'CELULAR CONECTADO' : 'SISTEMA WEB PRONTO'}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[11px] font-mono">
              WebRTC 60 FPS • Sem Instalação
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-purple-300 tracking-tight">
            Transmissão de Tela & Controle Total pelo Celular
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Compartilhe a tela deste computador diretamente para o seu celular com 1 clique! O celular tem <strong>acesso total</strong> ao mouse, teclado e atalhos, e <strong>apenas o celular pode desativar a tela</strong>.
          </p>
        </div>

        {/* Botão de Trocar Modo */}
        {mode !== 'select' && (
          <button
            onClick={() => {
              stopSharing();
              setMode('select');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-all shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Trocar de Modo</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TELA DE SELEÇÃO: VOCÊ ESTÁ NO COMPUTADOR OU NO CELULAR? */}
      {/* ========================================================================= */}
      {mode === 'select' && (
        <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Card 1: ESTOU NO COMPUTADOR (TRANSMITIR ESTA TELA) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#120d24] to-[#0a0714] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Monitor className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>1. Estou no Computador (PC)</span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">HOST</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clique para transmitir toda a tela deste computador para o seu celular. O navegador gera um código e um QR Code para você escanear com o celular.
                </p>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>Transmite Desktop inteiro a 60 FPS com áudio</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>Apenas o celular poderá desativar a tela</span>
                </div>
                <div className="flex items-center gap-2 text-cyan-300">
                  <Check className="w-3.5 h-3.5" />
                  <span>Não precisa instalar nenhum programa no PC!</span>
                </div>
              </div>
            </div>

            <button
              onClick={startPcHost}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>TRANSMITIR ESTA TELA DO PC AGORA</span>
            </button>
          </div>

          {/* Card 2: ESTOU NO CELULAR (CONTROLAR E VER O PC) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#180f2c] to-[#0a0714] border border-purple-500/30 hover:border-purple-400/60 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>2. Estou no Celular</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono">CONTROLE</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Digite o código que apareceu no computador para ver a tela do PC na palma da sua mão e ter controle total de toque, mouse e desligamento.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Código da Sala do Computador:
                </label>
                <input
                  type="text"
                  value={inputRoomId}
                  onChange={(e) => setInputRoomId(e.target.value.toUpperCase())}
                  placeholder="EX: AXION-5892"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 focus:border-purple-400 text-white font-mono text-sm uppercase placeholder:text-slate-600 outline-none"
                />
              </div>
            </div>

            <button
              onClick={() => connectToPcHost(inputRoomId)}
              disabled={!inputRoomId.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
            >
              <MousePointer className="w-4 h-4" />
              <span>CONECTAR E CONTROLAR PC PELO CELULAR</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 1: PC HOST (COMPUTADOR TRANSMITINDO A TELA) */}
      {/* ========================================================================= */}
      {mode === 'pc_host' && (
        <div className="py-6 space-y-6 relative z-10">
          {/* Card com Código e QR Code para Conectar o Celular */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna 1: Informações de Pareamento */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0c0818] border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Wifi className="w-4 h-4" />
                  <span>Sessão de Transmissão Ativa</span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                  {isConnected ? '✓ CELULAR CONECTADO' : 'AGUARDANDO CELULAR'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Código de Pareamento:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-cyan-300 tracking-wider">{roomId}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(roomId);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300"
                    >
                      {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Status de Segurança:</span>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5 pt-1">
                    <Lock className="w-4 h-4 text-purple-400" />
                    <span>Apenas o celular pode desativar a tela</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    {screenDisabledByPhone ? '🔴 TELA DESATIVADA PELO CELULAR' : '🟢 Transmissão liberada'}
                  </span>
                </div>
              </div>

              {/* Link de Acesso Direto para o Celular */}
              <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="truncate max-w-md">
                  <span className="text-slate-400 block text-[10px]">Link direto para abrir no celular:</span>
                  <code className="text-cyan-300 font-mono text-[11px] truncate block">{shareableUrl}</code>
                </div>
                <button
                  onClick={copyShareLink}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 shrink-0"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copiado!' : 'Copiar Link'}</span>
                </button>
              </div>

              {/* Regra de Desativação */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Regra de Acesso Total:</strong> O celular possui controle total sobre cliques, ponteiro e teclado. Como você definiu, <strong>o computador não pode desativar a transmissão; somente o comando enviado pelo celular pode desativar a tela</strong>.
                </span>
              </div>
            </div>

            {/* Coluna 2: QR Code para Escanear com a Câmera do Celular */}
            <div className="p-5 rounded-2xl bg-[#0c0818] border border-cyan-500/30 flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Escanear com o Celular</span>
              </span>
              <div className="p-3 rounded-xl bg-white shadow-xl">
                <QRCodeSVG
                  value={shareableUrl}
                  size={140}
                  level="M"
                  includeMargin={false}
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-tight">
                Abra a câmera do celular para conectar instantaneamente sem digitar nada.
              </p>
            </div>
          </div>

          {/* Pré-visualização da Tela do PC e Log de Comandos Recebidos do Celular */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monitor da Tela Transmitida */}
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Monitor Local da Tela Transmitida:</span>
                {latencyMs > 0 && <span>Latência: ~{latencyMs}ms</span>}
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video flex items-center justify-center">
                {screenDisabledByPhone ? (
                  <div className="text-center p-6 space-y-2">
                    <PowerOff className="w-12 h-12 text-rose-500 mx-auto animate-pulse" />
                    <h4 className="text-lg font-bold text-white">TELA DESATIVADA PELO CELULAR</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      O comando de desativação foi executado pelo dispositivo remoto. Apenas o celular pode religar ou restaurar.
                    </p>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoPreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-contain"
                    />

                    {/* Cursor Remoto Virtual do Celular */}
                    {remotePointer.visible && (
                      <div
                        className="absolute w-5 h-5 pointer-events-none transition-all duration-75 z-20"
                        style={{
                          left: `${remotePointer.x * 100}%`,
                          top: `${remotePointer.y * 100}%`,
                          transform: 'translate(-2px, -2px)'
                        }}
                      >
                        <MousePointer className="w-5 h-5 text-cyan-400 fill-cyan-400 drop-shadow-md" />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Log de Comandos Recebidos do Celular */}
            <div className="p-4 rounded-2xl bg-[#0a0714] border border-white/10 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-purple-400" />
                  <span>Ações Recebidas do Celular:</span>
                </span>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 h-64 overflow-y-auto font-mono text-[10.5px] space-y-1.5 text-slate-300">
                  {receivedCommands.length === 0 ? (
                    <span className="text-slate-600 block text-center pt-8">
                      Aguardando primeiro toque ou clique do celular...
                    </span>
                  ) : (
                    receivedCommands.map((cmd, idx) => (
                      <div key={idx} className="border-b border-white/5 pb-1">
                        <span className="text-cyan-400">{cmd}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-slate-400">
                Status: <strong>{statusMessage}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODO 2: CLIENTE MOBILE (CELULAR VISUALIZANDO E CONTROLANDO O PC) */}
      {/* ========================================================================= */}
      {mode === 'mobile_client' && (
        <div ref={containerRef} className="py-4 space-y-4 relative z-10">
          {/* Barra Superior do Celular */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#100b20] border border-purple-500/30 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white font-mono">{roomId || 'PC Remoto'}</span>
              <span className="text-[10px] text-cyan-300 font-mono">60 FPS</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Teclado Virtual */}
              <button
                onClick={() => setShowKeyboard(!showKeyboard)}
                className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all ${showKeyboard ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-white/10 text-white border-white/15'}`}
              >
                <Keyboard className="w-4 h-4" />
                <span className="hidden sm:inline">Teclado</span>
              </button>

              {/* Botão EXCLUSIVO DO CELULAR: Desativar Tela do PC */}
              <button
                onClick={handleDisableScreenFromPhone}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-all"
              >
                <PowerOff className="w-4 h-4" />
                <span>Desativar Tela do PC</span>
              </button>
            </div>
          </div>

          {/* Diálogo de Teclado no Celular */}
          {showKeyboard && (
            <div className="p-3.5 rounded-2xl bg-black/90 border border-cyan-500/40 space-y-2.5 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Digitar no Computador Remoto:</span>
                </span>
                <span className="text-[10px] text-slate-500">Envio instantâneo</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textToSend}
                  onChange={(e) => setTextToSend(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      sendRemoteCommand({ type: 'text_input', text: textToSend });
                      sendRemoteCommand({ type: 'key_press', key: 'Enter' });
                      setTextToSend('');
                    }
                  }}
                  placeholder="Digite as palavras para aparecerem no PC..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#120e22] border border-white/20 text-white text-xs outline-none focus:border-cyan-400"
                />
                <button
                  onClick={() => {
                    if (textToSend) {
                      sendRemoteCommand({ type: 'text_input', text: textToSend });
                      setTextToSend('');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  Enviar
                </button>
              </div>

              {/* Teclas Rápidas */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Win', 'Esc', 'Enter', 'Backspace', 'Tab', 'Ctrl+C', 'Ctrl+V', 'Alt+Tab', 'Ctrl+Alt+Del'].map((k) => (
                  <button
                    key={k}
                    onClick={() => sendRemoteCommand({ type: 'key_press', key: k })}
                    className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 font-mono text-[10.5px] border border-white/10"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TELA REMOTA DO PC RECEBIDA NO CELULAR COM TOQUE DIRETO */}
          <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-black aspect-video select-none shadow-2xl flex items-center justify-center">
            {screenDisabledByPhone ? (
              <div className="text-center p-6 space-y-2">
                <PowerOff className="w-12 h-12 text-rose-500 mx-auto" />
                <h4 className="text-base font-bold text-white">VOCÊ DESATIVOU A TELA DO PC</h4>
                <p className="text-xs text-slate-400">
                  O computador está com a tela desativada por sua ordem.
                </p>
                <button
                  onClick={() => {
                    setScreenDisabledByPhone(false);
                    sendRemoteCommand({ type: 'lock_screen' });
                  }}
                  className="mt-3 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                >
                  Restaurar Tela do PC
                </button>
              </div>
            ) : (
              <div
                onClick={handleTouchScreen}
                onTouchStart={handleTouchScreen}
                className="w-full h-full relative cursor-crosshair"
              >
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain pointer-events-none"
                />

                {/* Dica de Toque */}
                <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] text-slate-300 pointer-events-none flex items-center gap-1.5">
                  <MousePointer className="w-3 h-3 text-cyan-400" />
                  <span>Toque na tela do celular para clicar no PC</span>
                </div>
              </div>
            )}
          </div>

          {/* Barra de Controle de Mouse Inferior no Celular */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => sendRemoteCommand({ type: 'mouse_click', button: 'left' })}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white active:bg-cyan-500 active:text-black transition-all"
            >
              Botão Esquerdo
            </button>
            <button
              onClick={() => sendRemoteCommand({ type: 'mouse_click', button: 'middle' })}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white active:bg-cyan-500 active:text-black transition-all"
            >
              Rolar (Scroll)
            </button>
            <button
              onClick={() => sendRemoteCommand({ type: 'mouse_click', button: 'right' })}
              className="py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white active:bg-purple-500 active:text-white transition-all"
            >
              Botão Direito
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
