import { useState } from 'react';
import Icon from '@/components/ui/icon';
import type { PlayerData } from './GameLevel';

interface InventoryProps {
  playerData: PlayerData;
  setPlayerData: (d: PlayerData) => void;
  onClose: () => void;
}

const ITEMS = [
  { id: 1, name: 'АКС-74У', type: 'weapon', emoji: '🔫', rarity: 'rare', weight: 3.2, desc: 'Надёжный автомат. Урон +25' },
  { id: 2, name: 'Бронежилет', type: 'armor', emoji: '🦺', rarity: 'uncommon', weight: 4.0, desc: 'Защита от пуль. Броня +30' },
  { id: 3, name: 'Нож', type: 'weapon', emoji: '🔪', rarity: 'common', weight: 0.5, desc: 'Тихое устранение. Урон +10' },
  { id: 4, name: 'Аптечка', type: 'med', emoji: '🩹', rarity: 'common', weight: 0.3, desc: 'Восстановление HP +50' },
  { id: 5, name: 'Рация', type: 'tool', emoji: '📻', rarity: 'uncommon', weight: 0.8, desc: 'Связь с командой' },
  { id: 6, name: 'Деньги', type: 'misc', emoji: '💰', rarity: 'common', weight: 0.1, desc: '10,000 рублей' },
  { id: 7, name: 'Телефон', type: 'tool', emoji: '📱', rarity: 'rare', weight: 0.2, desc: 'Зашифрованный телефон' },
  { id: 8, name: 'Маска', type: 'armor', emoji: '🎭', rarity: 'uncommon', weight: 0.3, desc: 'Скрывает личность' },
];

const RARITY_COLORS: Record<string, string> = {
  common: 'text-gray-400 border-gray-600',
  uncommon: 'text-green-400 border-green-700',
  rare: 'text-blue-400 border-blue-600',
  epic: 'text-purple-400 border-purple-600',
};

const RARITY_LABELS: Record<string, string> = {
  common: 'Обычный',
  uncommon: 'Необычный',
  rare: 'Редкий',
  epic: 'Эпический',
};

const SKILLS_DATA = [
  { key: 'strength', label: 'Сила', emoji: '💪', desc: 'Урон в ближнем бою, переноска груза' },
  { key: 'agility', label: 'Ловкость', emoji: '🏃', desc: 'Скорость, уклонение, карманные кражи' },
  { key: 'shooting', label: 'Стрельба', emoji: '🎯', desc: 'Точность и скорость стрельбы' },
  { key: 'charisma', label: 'Харизма', emoji: '😎', desc: 'Убеждение, торговля, связи' },
  { key: 'intellect', label: 'Интеллект', emoji: '🧠', desc: 'Взлом, хакерство, медицина' },
  { key: 'stamina', label: 'Выносливость', emoji: '❤', desc: 'Макс. HP, скорость регенерации' },
];

export default function Inventory({ playerData, setPlayerData, onClose }: InventoryProps) {
  const [tab, setTab] = useState<'items' | 'skills'>('items');
  const [selected, setSelected] = useState<typeof ITEMS[0] | null>(null);
  const freePoints = Math.max(0, playerData.level * 3 - Object.values(playerData.skills).reduce((a, b) => a + b, 0));

  const upgradeSkill = (key: string) => {
    if (freePoints <= 0) return;
    setPlayerData({
      ...playerData,
      skills: { ...playerData.skills, [key]: (playerData.skills[key] || 0) + 1 }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center font-roboto">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative bg-game-darker border border-game-border w-[800px] max-h-[90vh] overflow-hidden animate-scale-in"
        style={{ clipPath: 'polygon(12px 0, 100% 0, calc(100% - 12px) 100%, 0 100%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between bg-game-card border-b border-game-border px-6 py-4">
          <div>
            <h2 className="font-oswald text-xl text-white tracking-widest uppercase">🎒 Инвентарь</h2>
            <p className="text-game-text-dim text-xs mt-0.5">
              {playerData.name} · Уровень {playerData.level} · 💵 {playerData.money.toLocaleString('ru')} ₽
            </p>
          </div>
          <button onClick={onClose}
            className="text-game-text-dim hover:text-white transition-colors text-xl font-bold">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-game-border">
          {(['items', 'skills'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-8 py-3 font-oswald text-sm tracking-widest uppercase transition-all ${
                tab === t
                  ? 'text-game-accent border-b-2 border-game-accent'
                  : 'text-game-text-dim hover:text-game-text'
              }`}>
              {t === 'items' ? '⚔ Предметы' : '📊 Навыки'}
            </button>
          ))}
          {freePoints > 0 && (
            <div className="ml-auto flex items-center pr-6">
              <span className="bg-game-accent text-game-darker font-oswald text-xs px-2 py-1 tracking-wider">
                {freePoints} очков
              </span>
            </div>
          )}
        </div>

        {tab === 'items' && (
          <div className="flex h-[480px]">
            {/* Item grid */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {ITEMS.map(item => (
                  <button key={item.id} onClick={() => setSelected(item)}
                    className={`relative border p-3 text-center transition-all duration-200 hover:scale-105 ${
                      selected?.id === item.id
                        ? `${RARITY_COLORS[item.rarity]} bg-game-card`
                        : 'border-game-border bg-game-card/50 hover:border-game-muted'
                    }`}
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                    <div className="text-3xl mb-1">{item.emoji}</div>
                    <div className="text-game-text text-xs font-roboto leading-tight">{item.name}</div>
                    <div className={`text-[9px] mt-1 ${RARITY_COLORS[item.rarity]}`}>
                      {RARITY_LABELS[item.rarity]}
                    </div>
                  </button>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 8 - ITEMS.length % 8 || 0 }).map((_, i) => (
                  <div key={`empty-${i}`}
                    className="border border-dashed border-game-border/30 p-3 aspect-square"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }} />
                ))}
              </div>
            </div>

            {/* Item detail */}
            <div className="w-56 border-l border-game-border bg-game-card/30 p-4">
              {selected ? (
                <div className="animate-fade-in">
                  <div className="text-5xl text-center mb-3">{selected.emoji}</div>
                  <div className={`text-[10px] text-center mb-1 ${RARITY_COLORS[selected.rarity]}`}>
                    {RARITY_LABELS[selected.rarity].toUpperCase()}
                  </div>
                  <h3 className="font-oswald text-white text-center text-lg tracking-wider mb-2">{selected.name}</h3>
                  <div className="w-full h-px bg-game-border mb-3" />
                  <p className="text-game-text-dim text-xs leading-relaxed mb-3">{selected.desc}</p>
                  <div className="text-[10px] text-game-text-dim">
                    <div className="flex justify-between mb-1">
                      <span>Тип:</span>
                      <span className="text-game-text capitalize">{selected.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Вес:</span>
                      <span className="text-game-text">{selected.weight} кг</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-game-accent hover:bg-yellow-400 text-game-darker font-oswald text-sm tracking-wider uppercase py-2 transition-all"
                    style={{ clipPath: 'polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)' }}>
                    Использовать
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-game-text-dim text-xs text-center">Выбери предмет для просмотра</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'skills' && (
          <div className="p-6 overflow-y-auto max-h-[480px]">
            <div className="grid grid-cols-2 gap-4">
              {SKILLS_DATA.map(skill => {
                const val = playerData.skills[skill.key] || 0;
                const maxVal = 10;
                return (
                  <div key={skill.key}
                    className="bg-game-card border border-game-border p-4 transition-all hover:border-game-muted"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{skill.emoji}</span>
                        <span className="font-oswald text-white text-sm tracking-wider">{skill.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-oswald text-game-accent text-lg">{val}</span>
                        <span className="text-game-text-dim text-xs">/ {maxVal}</span>
                      </div>
                    </div>
                    {/* Progress bars */}
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: maxVal }).map((_, i) => (
                        <div key={i} className={`flex-1 h-2 transition-all ${
                          i < val ? 'bg-game-accent' : 'bg-game-border'
                        }`} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-game-text-dim text-[10px]">{skill.desc}</p>
                      {freePoints > 0 && val < maxVal && (
                        <button onClick={() => upgradeSkill(skill.key)}
                          className="ml-2 bg-game-accent hover:bg-yellow-400 text-game-darker font-oswald text-xs px-3 py-1 tracking-wider transition-all hover:scale-105 flex-shrink-0">
                          + Прокачать
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
