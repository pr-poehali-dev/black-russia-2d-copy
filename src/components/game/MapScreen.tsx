import { useState } from 'react';

interface MapScreenProps {
  onClose: () => void;
}

const LOCATIONS = [
  { id: 1, name: 'Рынок', desc: 'Торговля, барыги, новые задания', x: 15, y: 25, type: 'trade', emoji: '🏪', status: 'active' },
  { id: 2, name: 'Депо', desc: 'Угон машин и ремонт', x: 55, y: 55, type: 'crime', emoji: '🚗', status: 'active' },
  { id: 3, name: 'Полицейский участок', desc: 'Опасная зона. Разыскиваемые — осторожно!', x: 75, y: 20, type: 'danger', emoji: '🚔', status: 'danger' },
  { id: 4, name: 'Бар «Лось»', desc: 'Отдых, информаторы, мини-игры', x: 35, y: 65, type: 'social', emoji: '🍺', status: 'active' },
  { id: 5, name: 'Заброшенный завод', desc: 'Встреча с группировкой. Опасно!', x: 80, y: 70, type: 'crime', emoji: '🏭', status: 'locked' },
  { id: 6, name: 'Квартира', desc: 'База героя. Сон и сохранение', x: 25, y: 45, type: 'home', emoji: '🏠', status: 'active' },
  { id: 7, name: 'Банк', desc: 'Хранение денег или ограбление', x: 60, y: 35, type: 'trade', emoji: '🏦', status: 'active' },
  { id: 8, name: 'Лес', desc: 'Схрон оружия. Тайные встречи', x: 10, y: 70, type: 'social', emoji: '🌲', status: 'active' },
];

const STATUS_STYLES: Record<string, string> = {
  active: 'border-game-accent text-game-accent hover:bg-game-accent/10',
  danger: 'border-game-red text-game-red hover:bg-game-red/10',
  locked: 'border-game-muted text-game-text-dim opacity-60 cursor-not-allowed',
};

const TYPE_COLORS: Record<string, string> = {
  trade: '#c9a227',
  crime: '#c0392b',
  danger: '#e74c3c',
  social: '#3498db',
  home: '#27ae60',
};

export default function MapScreen({ onClose }: MapScreenProps) {
  const [selected, setSelected] = useState<typeof LOCATIONS[0] | null>(null);
  const [hoveredPath, setHoveredPath] = useState<number | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-roboto">
      <div className="absolute inset-0 bg-black/85" onClick={onClose} />

      <div className="relative bg-game-darker border border-game-border w-[900px] max-h-[90vh] overflow-hidden animate-scale-in"
        style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between bg-game-card border-b border-game-border px-6 py-4">
          <div>
            <h2 className="font-oswald text-xl text-white tracking-widest uppercase">🗺 Карта города</h2>
            <p className="text-game-text-dim text-xs mt-0.5">Выбери точку назначения</p>
          </div>
          <button onClick={onClose}
            className="text-game-text-dim hover:text-white transition-colors text-xl font-bold">×</button>
        </div>

        <div className="flex h-[500px]">
          {/* Map area */}
          <div className="flex-1 relative bg-game-card/20 overflow-hidden">
            {/* Grid */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Roads */}
            <svg className="absolute inset-0 w-full h-full">
              <line x1="15%" y1="25%" x2="35%" y2="45%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="35%" y1="45%" x2="55%" y2="55%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="55%" y1="55%" x2="60%" y2="35%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="60%" y1="35%" x2="75%" y2="20%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="55%" y1="55%" x2="80%" y2="70%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="35%" y1="65%" x2="35%" y2="45%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
              <line x1="10%" y1="70%" x2="35%" y2="65%" stroke="rgba(201,162,39,0.15)" strokeWidth="3" strokeDasharray="8,4" />
            </svg>

            {/* Location pins */}
            {LOCATIONS.map(loc => (
              <button
                key={loc.id}
                onClick={() => loc.status !== 'locked' && setSelected(loc)}
                className={`absolute border transition-all duration-200 w-10 h-10 flex items-center justify-center text-xl rounded-none hover:scale-110 ${STATUS_STYLES[loc.status]}`}
                style={{
                  left: `calc(${loc.x}% - 20px)`,
                  top: `calc(${loc.y}% - 20px)`,
                  clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)',
                  boxShadow: selected?.id === loc.id
                    ? `0 0 20px ${TYPE_COLORS[loc.type]}50`
                    : 'none',
                  background: selected?.id === loc.id ? `${TYPE_COLORS[loc.type]}20` : 'rgba(10,10,15,0.9)',
                  borderColor: selected?.id === loc.id ? TYPE_COLORS[loc.type] : undefined,
                }}>
                {loc.emoji}
              </button>
            ))}

            {/* You are here marker */}
            <div className="absolute w-4 h-4 bg-green-400 rounded-full animate-pulse"
              style={{ left: '22%', top: '42%', boxShadow: '0 0 12px #27ae60' }}>
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-green-400 font-oswald whitespace-nowrap">
                ВЫ
              </div>
            </div>
          </div>

          {/* Location info panel */}
          <div className="w-60 border-l border-game-border bg-game-card/30 p-4">
            {selected ? (
              <div className="animate-fade-in">
                <div className="text-5xl text-center mb-3">{selected.emoji}</div>
                <h3 className="font-oswald text-white text-center text-lg tracking-wider mb-1">{selected.name}</h3>
                <div className="text-[10px] text-center mb-3"
                  style={{ color: TYPE_COLORS[selected.type] }}>
                  {{trade:'Торговля', crime:'Криминал', danger:'Опасность', social:'Социальное', home:'Дом'}[selected.type]}
                </div>
                <div className="w-full h-px bg-game-border mb-3" />
                <p className="text-game-text-dim text-xs leading-relaxed mb-4">{selected.desc}</p>
                <button className="w-full bg-game-accent hover:bg-yellow-400 text-game-darker font-oswald text-sm tracking-wider uppercase py-2 transition-all hover:scale-105"
                  style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                  Переместиться
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <div className="text-4xl opacity-30">🗺</div>
                <p className="text-game-text-dim text-xs text-center">Выбери точку на карте для перемещения</p>
                <div className="w-full mt-4">
                  <div className="text-game-text-dim text-[10px] font-oswald tracking-wider mb-2">ЛЕГЕНДА</div>
                  {[
                    { color: '#c9a227', label: 'Торговля' },
                    { color: '#c0392b', label: 'Криминал' },
                    { color: '#3498db', label: 'Социальное' },
                    { color: '#27ae60', label: 'База' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: l.color }} />
                      <span className="text-game-text-dim text-[10px]">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Locations list */}
        <div className="border-t border-game-border bg-game-card/20 px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {LOCATIONS.map(loc => (
              <button key={loc.id}
                onClick={() => loc.status !== 'locked' && setSelected(loc)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 border text-xs font-oswald tracking-wider transition-all ${
                  selected?.id === loc.id
                    ? 'bg-game-accent/20 text-game-accent border-game-accent'
                    : STATUS_STYLES[loc.status]
                }`}
                style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                <span>{loc.emoji}</span>
                <span>{loc.name}</span>
                {loc.status === 'locked' && <span className="text-[10px]">🔒</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
