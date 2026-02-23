import { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '@/components/ui/icon';

interface GameLevelProps {
  onOpenInventory: () => void;
  onOpenMap: () => void;
  playerData: PlayerData;
  setPlayerData: (d: PlayerData) => void;
}

export interface PlayerData {
  name: string;
  level: number;
  xp: number;
  xpToNext: number;
  hp: number;
  maxHp: number;
  money: number;
  skills: Record<string, number>;
}

const cityBg = 'https://cdn.poehali.dev/projects/86c7619d-f4c1-4b55-a39e-a3bb2161b363/files/35969dd4-cc06-4b5b-b333-9a3c5789062a.jpg';

const NPCS = [
  { id: 1, x: 200, name: 'Боря', role: 'Барыга', emoji: '🧔' },
  { id: 2, x: 520, name: 'Малёк', role: 'Прохожий', emoji: '👦' },
  { id: 3, x: 760, name: 'Дядя Жора', role: 'Полицай', emoji: '👮' },
];

const COLLECTIBLES = [
  { id: 1, x: 350, emoji: '💰', label: '+500₽', xp: 10 },
  { id: 2, x: 620, emoji: '🔧', label: '+Инструмент', xp: 5 },
  { id: 3, x: 880, emoji: '📦', label: '+Товар', xp: 15 },
];

export default function GameLevel({ onOpenInventory, onOpenMap, playerData, setPlayerData }: GameLevelProps) {
  const [playerX, setPlayerX] = useState(100);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [collected, setCollected] = useState<number[]>([]);
  const [activeNpc, setActiveNpc] = useState<typeof NPCS[0] | null>(null);
  const [dialogMsg, setDialogMsg] = useState('');
  const [showXpGain, setShowXpGain] = useState<{ val: number, id: number } | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const animRef = useRef<number>();
  const walkCycle = useRef(0);

  const handleKeys = useCallback(() => {
    const keys = keysRef.current;
    let moved = false;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      setPlayerX(x => Math.max(30, x - 4));
      setFacing('left');
      moved = true;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      setPlayerX(x => Math.min(1050, x + 4));
      setFacing('right');
      moved = true;
    }
    setIsWalking(moved);
    if (moved) walkCycle.current += 0.25;
    animRef.current = requestAnimationFrame(handleKeys);
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => { keysRef.current[e.key] = true; };
    const onUp = (e: KeyboardEvent) => { keysRef.current[e.key] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    animRef.current = requestAnimationFrame(handleKeys);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [handleKeys]);

  useEffect(() => {
    const nearby = COLLECTIBLES.find(c => !collected.includes(c.id) && Math.abs(c.x - playerX) < 40);
    if (nearby) {
      setCollected(prev => [...prev, nearby.id]);
      setPlayerData({
        ...playerData,
        money: playerData.money + 500,
        xp: playerData.xp + nearby.xp,
      });
      setShowXpGain({ val: nearby.xp, id: nearby.id });
      setTimeout(() => setShowXpGain(null), 1500);
    }

    const npc = NPCS.find(n => Math.abs(n.x - playerX) < 50);
    if (npc) {
      setActiveNpc(npc);
      const dialogs: Record<number, string> = {
        1: 'Есть дело, братан. Надо кое-что передать...',
        2: 'Эй, подожди! У меня к тебе разговор.',
        3: 'Стоять! Предъяви документы!',
      };
      setDialogMsg(dialogs[npc.id]);
    } else {
      setActiveNpc(null);
    }
  }, [playerX]);

  const bobY = isWalking ? Math.sin(walkCycle.current * Math.PI) * 3 : 0;
  const xpPercent = (playerData.xp / playerData.xpToNext) * 100;
  const hpPercent = (playerData.hp / playerData.maxHp) * 100;

  return (
    <div className="relative w-full h-screen overflow-hidden font-roboto select-none">
      {/* Background */}
      <div className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cityBg})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-game-dark/30 to-game-darker/90" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to bottom, #1a1a2a, #0d0d15)' }} />
      <div className="absolute bottom-32 left-0 right-0 h-1 bg-game-accent/20" />

      {/* NPC Characters */}
      {NPCS.map(npc => (
        <div key={npc.id} className="absolute bottom-32 text-center transition-all"
          style={{ left: npc.x - 24, width: 48 }}>
          <div className="text-xs text-game-text-dim font-roboto mb-1 whitespace-nowrap">
            {npc.name}
            <span className="ml-1 text-game-accent text-[10px]">({npc.role})</span>
          </div>
          <div className="text-4xl" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8))' }}>
            {npc.emoji}
          </div>
          {Math.abs(npc.x - playerX) < 50 && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
              <div className="w-2 h-2 rounded-full bg-game-accent animate-pulse" />
            </div>
          )}
        </div>
      ))}

      {/* Collectibles */}
      {COLLECTIBLES.map(c => !collected.includes(c.id) && (
        <div key={c.id} className="absolute bottom-36 text-center animate-fade-in"
          style={{ left: c.x - 16, width: 32 }}>
          <div className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(201,162,39,0.6))' }}>
            {c.emoji}
          </div>
          <div className="text-[9px] text-game-accent font-oswald tracking-wider">{c.label}</div>
        </div>
      ))}

      {/* XP Gain popup */}
      {showXpGain && (
        <div className="absolute font-oswald text-game-accent font-bold text-lg animate-fade-in pointer-events-none"
          style={{ left: playerX, bottom: 200 }}>
          +{showXpGain.val} XP
        </div>
      )}

      {/* Player */}
      <div className="absolute bottom-32 transition-none"
        style={{ left: playerX - 20, transform: `translateY(${-bobY}px)` }}>
        <div style={{ transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
          {/* Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-2 rounded-full bg-black/60 blur-sm" />
          {/* Body */}
          <div className="relative text-center">
            <div className="text-5xl leading-none" style={{
              filter: 'drop-shadow(0 0 12px rgba(201,162,39,0.3)) drop-shadow(0 4px 8px rgba(0,0,0,0.9))'
            }}>🧍</div>
            {/* Name tag */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[10px] font-oswald text-game-accent bg-game-darker/80 px-2 py-0.5 tracking-wider">
                {playerData.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog box */}
      {activeNpc && (
        <div className="absolute bottom-44 left-1/2 -translate-x-1/2 w-80 animate-scale-in">
          <div className="bg-game-darker/95 border border-game-accent/40 p-4"
            style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
            <div className="text-game-accent font-oswald text-sm tracking-wider mb-1">
              {activeNpc.emoji} {activeNpc.name}
            </div>
            <div className="text-game-text text-sm font-roboto leading-relaxed">
              {dialogMsg}
            </div>
            <div className="text-game-text-dim text-[10px] mt-2 font-roboto">[E] — Поговорить</div>
          </div>
        </div>
      )}

      {/* HUD — Top Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
        {/* Player stats */}
        <div className="bg-game-darker/90 border border-game-border p-3 w-56 animate-fade-in"
          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧍</span>
            <div>
              <div className="text-game-text font-oswald text-sm tracking-wider">{playerData.name}</div>
              <div className="text-game-accent text-xs font-roboto">Уровень {playerData.level}</div>
            </div>
          </div>
          {/* HP */}
          <div className="mb-1">
            <div className="flex justify-between text-[10px] font-roboto mb-0.5">
              <span className="text-game-red">❤ HP</span>
              <span className="text-game-text-dim">{playerData.hp}/{playerData.maxHp}</span>
            </div>
            <div className="h-2 bg-game-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-game-red to-red-400 transition-all duration-500"
                style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
          {/* XP */}
          <div>
            <div className="flex justify-between text-[10px] font-roboto mb-0.5">
              <span className="text-game-accent">⭐ Опыт</span>
              <span className="text-game-text-dim">{playerData.xp}/{playerData.xpToNext}</span>
            </div>
            <div className="h-2 bg-game-border rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-game-accent to-yellow-300 transition-all duration-500"
                style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Money */}
        <div className="bg-game-darker/90 border border-game-border px-4 py-2 animate-fade-in"
          style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
          <div className="text-game-accent font-oswald text-xl tracking-wider">
            💵 {playerData.money.toLocaleString('ru')} ₽
          </div>
        </div>
      </div>

      {/* HUD — Bottom Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20 animate-fade-in">
        <button onClick={onOpenInventory}
          className="bg-game-darker/90 border border-game-border hover:border-game-accent text-game-text hover:text-game-accent font-oswald text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200 hover:scale-105"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
          🎒 Инвентарь [I]
        </button>
        <button onClick={onOpenMap}
          className="bg-game-darker/90 border border-game-border hover:border-game-accent text-game-text hover:text-game-accent font-oswald text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200 hover:scale-105"
          style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
          🗺 Карта [M]
        </button>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 right-4 text-game-text-dim text-xs font-roboto tracking-wider animate-fade-in">
        ← → / A D — движение
      </div>
    </div>
  );
}
