import Icon from '@/components/ui/icon';

interface MainMenuProps {
  onStart: () => void;
}

const cityBg = 'https://cdn.poehali.dev/projects/86c7619d-f4c1-4b55-a39e-a3bb2161b363/files/35969dd4-cc06-4b5b-b333-9a3c5789062a.jpg';

export default function MainMenu({ onStart }: MainMenuProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden font-roboto">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${cityBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-game-darker via-game-dark/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-game-darker/60 via-transparent to-game-darker/60" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">

        {/* Logo */}
        <div className="animate-fade-in mb-12 text-center">
          <div className="text-game-accent text-sm font-oswald tracking-[0.4em] uppercase mb-2 animate-flicker">
            — Россия —
          </div>
          <h1 className="font-oswald font-700 text-[72px] leading-none tracking-wider text-white uppercase"
            style={{ textShadow: '0 0 40px rgba(201,162,39,0.4), 0 4px 20px rgba(0,0,0,0.8)' }}>
            BLACK RUSSIA
          </h1>
          <div className="text-game-text-dim font-roboto text-sm tracking-[0.3em] mt-2 uppercase">
            2D Edition
          </div>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-game-accent to-transparent mx-auto mt-4" />
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-3 w-64 animate-scale-in">
          <button
            onClick={onStart}
            className="group relative bg-game-accent hover:bg-yellow-500 text-game-darker font-oswald font-600 text-lg tracking-widest uppercase py-4 px-8 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(201,162,39,0.5)]"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            <span className="relative z-10">▶ Новая игра</span>
          </button>

          <button
            className="group relative bg-transparent border border-game-border hover:border-game-accent text-game-text hover:text-game-accent font-oswald font-500 text-base tracking-widest uppercase py-3 px-8 transition-all duration-200"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Продолжить
          </button>

          <button
            className="group relative bg-transparent border border-game-border hover:border-game-muted text-game-text-dim hover:text-game-text font-oswald font-500 text-base tracking-widest uppercase py-3 px-8 transition-all duration-200"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Настройки
          </button>

          <button
            className="group relative bg-transparent border border-game-border hover:border-game-red text-game-text-dim hover:text-game-red font-oswald font-500 text-base tracking-widest uppercase py-3 px-8 transition-all duration-200"
            style={{ clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
          >
            Выйти
          </button>
        </div>

        {/* Version */}
        <div className="absolute bottom-6 left-8 text-game-text-dim text-xs font-roboto tracking-widest">
          v0.1.0 ALPHA
        </div>
        <div className="absolute bottom-6 right-8 text-game-text-dim text-xs font-roboto tracking-widest">
          BLACK RUSSIA 2D © 2026
        </div>
      </div>
    </div>
  );
}
