import { useState, useEffect } from 'react';
import MainMenu from './components/game/MainMenu';
import GameLevel, { type PlayerData } from './components/game/GameLevel';
import Inventory from './components/game/Inventory';
import MapScreen from './components/game/MapScreen';

type Screen = 'menu' | 'game';

const initialPlayer: PlayerData = {
  name: 'Малыш',
  level: 1,
  xp: 0,
  xpToNext: 100,
  hp: 80,
  maxHp: 100,
  money: 5000,
  skills: {
    strength: 2,
    agility: 1,
    shooting: 1,
    charisma: 1,
    intellect: 1,
    stamina: 2,
  }
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [playerData, setPlayerData] = useState<PlayerData>(initialPlayer);
  const [showInventory, setShowInventory] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handlePlayerUpdate = (data: PlayerData) => {
    let updated = { ...data };
    while (updated.xp >= updated.xpToNext) {
      updated = {
        ...updated,
        level: updated.level + 1,
        xp: updated.xp - updated.xpToNext,
        xpToNext: Math.floor(updated.xpToNext * 1.5),
        maxHp: updated.maxHp + 10,
        hp: updated.maxHp + 10,
      };
    }
    setPlayerData(updated);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screen !== 'game') return;
      if (e.key === 'i' || e.key === 'I') setShowInventory(v => !v);
      if (e.key === 'm' || e.key === 'M') setShowMap(v => !v);
      if (e.key === 'Escape') {
        setShowInventory(false);
        setShowMap(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen]);

  return (
    <div className="w-full h-screen bg-game-darker overflow-hidden">
      {screen === 'menu' && (
        <MainMenu onStart={() => setScreen('game')} />
      )}

      {screen === 'game' && (
        <>
          <GameLevel
            onOpenInventory={() => setShowInventory(true)}
            onOpenMap={() => setShowMap(true)}
            playerData={playerData}
            setPlayerData={handlePlayerUpdate}
          />

          {showInventory && (
            <Inventory
              playerData={playerData}
              setPlayerData={handlePlayerUpdate}
              onClose={() => setShowInventory(false)}
            />
          )}

          {showMap && (
            <MapScreen onClose={() => setShowMap(false)} />
          )}
        </>
      )}
    </div>
  );
}
