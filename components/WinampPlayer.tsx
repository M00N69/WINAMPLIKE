
import React, { useState, useEffect } from 'react';
import { Station, FavoriteStation, PlayerStatus } from '../types';
import Visualizer from './Visualizer';

interface Props {
  currentStation: Station | FavoriteStation | null;
  status: PlayerStatus;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  volume: number;
  setVolume: (v: number) => void;
  isMuted: boolean;
  setIsMuted: (m: boolean) => void;
  analyser: AnalyserNode | null;
  theme: string;
  onThemeChange: (t: 'emerald' | 'ruby' | 'azure') => void;
  accentColor: string;
}

const WinampPlayer: React.FC<Props> = ({ 
  currentStation, status, onPlay, onPause, onStop, volume, setVolume, isMuted, setIsMuted, analyser, theme, onThemeChange, accentColor 
}) => {
  const [time, setTime] = useState('00:00');

  useEffect(() => {
    let interval: any;
    if (status === PlayerStatus.PLAYING) {
      const start = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const secs = (elapsed % 60).toString().padStart(2, '0');
        setTime(`${mins}:${secs}`);
      }, 1000);
    } else if (status === PlayerStatus.STOPPED) {
      setTime('00:00');
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="winamp-skin p-1 flex flex-col gap-1 select-none overflow-hidden transition-all duration-500 w-full">
      {/* Title Bar with Theme Selector */}
      <div className="winamp-title-bar px-3 py-1.5 flex justify-between items-center text-[10px] sm:text-[11px] text-white font-bold rounded-t-sm">
        <div className="flex items-center gap-2">
          <div className="bg-white/20 p-1 rounded-full"><i className="fas fa-bolt text-yellow-300 scale-75"></i></div>
          <span className="tracking-widest">WINAMP <span className="opacity-50 font-normal hidden xs:inline">MODERN</span></span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Dots */}
          <div className="flex gap-1.5 bg-black/30 px-2 py-1 rounded-full">
            <button 
              onClick={() => onThemeChange('emerald')}
              className={`w-2.5 h-2.5 rounded-full bg-[#34d399] transition-transform ${theme === 'emerald' ? 'scale-125 ring-1 ring-white' : 'opacity-40'}`}
              title="Emerald Theme"
            />
            <button 
              onClick={() => onThemeChange('ruby')}
              className={`w-2.5 h-2.5 rounded-full bg-[#fb7185] transition-transform ${theme === 'ruby' ? 'scale-125 ring-1 ring-white' : 'opacity-40'}`}
              title="Ruby Theme"
            />
            <button 
              onClick={() => onThemeChange('azure')}
              className={`w-2.5 h-2.5 rounded-full bg-[#38bdf8] transition-transform ${theme === 'azure' ? 'scale-125 ring-1 ring-white' : 'opacity-40'}`}
              title="Azure Theme"
            />
          </div>
          <div className="flex gap-1">
            <button className="hover:bg-white/20 px-1">_</button>
            <button className="hover:bg-red-500 px-1">×</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 p-3">
        {/* LCD Screen Section */}
        <div className="flex-1 lcd-screen rounded-sm p-3 flex flex-col gap-2 relative group overflow-hidden min-w-0">
          <div className="flex justify-between items-center">
            <div className="digital-glow text-3xl sm:text-4xl leading-none tracking-tighter">
              {time}
            </div>
            <div className="flex flex-col gap-1 items-end">
               <div className="flex items-center gap-1">
                 <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${status === PlayerStatus.PLAYING ? 'accent-bg shadow-[0_0_8px_var(--theme-accent)]' : 'bg-gray-800'}`}></div>
                 <span className="text-[8px] text-gray-500 font-bold">STEREO</span>
               </div>
               <div className="text-[9px] accent-text font-bold opacity-60 italic">44.1 KHZ</div>
            </div>
          </div>
          
          <div className="h-10 sm:h-12 overflow-hidden border-y border-white/5 bg-black/60 rounded-sm">
             <Visualizer analyser={analyser} isPlaying={status === PlayerStatus.PLAYING} themeColor={accentColor} />
          </div>

          <div className="h-5 overflow-hidden flex items-center bg-black/20 rounded-sm px-2">
             <div className="whitespace-nowrap animate-marquee text-[10px] accent-text font-mono uppercase tracking-widest">
                {currentStation ? `NOW PLAYING: ${currentStation.name} • RADIO BROWSER NETWORK • ` : 'WAITING FOR STATION SELECTION...'}
             </div>
          </div>
        </div>

        {/* Controls Panel (Vertical on desktop, horizontal/shorter on mobile) */}
        <div className="w-full sm:w-28 flex flex-row sm:flex-col gap-4 py-1 sm:border-l border-white/5 sm:pl-3">
           <div className="flex-1 flex flex-col gap-1">
              <div className="flex justify-between items-center text-[8px] text-gray-500 font-bold uppercase">
                <span>VOL</span>
                <span className="accent-text">{Math.round(volume * 100)}%</span>
              </div>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={isMuted ? 0 : volume} 
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-range"
              />
           </div>
           
           <div className="flex sm:grid sm:grid-cols-2 gap-2 mt-auto">
              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className={`flex-1 sm:flex-none text-[9px] font-bold py-2 px-3 sm:px-0 rounded border transition-all ${isMuted ? 'bg-red-500/20 text-red-400 border-red-500/50' : 'bg-white/5 text-gray-500 border-white/10 hover:bg-white/10'}`}
              >
                {isMuted ? 'ON' : 'MUTE'}
              </button>
              <button className="flex-1 sm:flex-none text-[9px] font-bold py-2 px-3 sm:px-0 rounded border border-white/10 bg-white/5 text-gray-500 hover:bg-white/10">
                INFO
              </button>
           </div>
        </div>
      </div>

      {/* Modern Control Bar */}
      <div className="flex flex-col xs:flex-row justify-between items-center px-4 py-3 bg-black/40 border-t border-white/5 gap-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ModernBtn icon="fa-step-backward" onClick={() => {}} />
          <ModernBtn icon="fa-play" active={status === PlayerStatus.PLAYING} onClick={onPlay} large />
          <ModernBtn icon="fa-pause" active={status === PlayerStatus.PAUSED} onClick={onPause} />
          <ModernBtn icon="fa-stop" active={status === PlayerStatus.STOPPED} onClick={onStop} />
          <ModernBtn icon="fa-step-forward" onClick={() => {}} />
        </div>
        
        <div className="flex items-center gap-4 text-[9px] sm:text-[10px] text-gray-500 font-bold">
           <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
             <i className="fas fa-random"></i> SHUFFLE
           </div>
           <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
             <i className="fas fa-redo"></i> REPEAT
           </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
        .accent-range {
          -webkit-appearance: none;
        }
        .accent-range::-webkit-slider-runnable-track {
           background: #1e293b;
           border-radius: 10px;
           height: 6px;
        }
        .accent-range::-webkit-slider-thumb {
           appearance: none;
           -webkit-appearance: none;
           height: 14px;
           width: 14px;
           background: var(--theme-accent);
           border-radius: 50%;
           cursor: pointer;
           margin-top: -4px;
           box-shadow: 0 0 5px var(--theme-glow);
           border: 2px solid #000;
        }
      `}</style>
    </div>
  );
};

const ModernBtn: React.FC<{ icon: string; onClick: () => void; active?: boolean; large?: boolean }> = ({ icon, onClick, active, large }) => (
  <button 
    onClick={onClick}
    className={`flex items-center justify-center rounded-full transition-all duration-300 touch-manipulation
      ${large ? 'w-10 h-10 sm:w-11 sm:h-11 text-base' : 'w-8 h-8 sm:w-9 sm:h-9 text-xs'}
      ${active 
        ? 'accent-bg text-black shadow-[0_0_15px_var(--theme-glow)]' 
        : 'bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white border border-white/10'
      }
    `}
  >
    <i className={`fas ${icon}`}></i>
  </button>
);

export default WinampPlayer;
