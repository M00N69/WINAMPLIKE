
import React from 'react';
import { FavoriteStation } from '../types';

interface Props {
  favorites: FavoriteStation[];
  onPlayStation: (s: FavoriteStation) => void;
  onRemoveFavorite: (s: FavoriteStation) => void;
  currentStationId: string;
}

const WinampPlaylist: React.FC<Props> = ({ 
  favorites, onPlayStation, onRemoveFavorite, currentStationId 
}) => {
  return (
    <div className="winamp-skin p-1 flex flex-col gap-1 select-none transition-all duration-500">
      <div className="bg-white/5 px-3 py-2 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest border-b border-white/5">
        <span><i className="fas fa-heart mr-2 accent-text"></i>FAVORITES</span>
        <span className="accent-text">{favorites.length} CHANNELS</span>
      </div>

      <div className="bg-black/50 backdrop-blur-sm min-h-[160px] max-h-[220px] overflow-y-auto">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[10px] text-gray-600 font-mono italic">
            NO FAVORITES YET
          </div>
        ) : (
          favorites.map((fav, index) => {
            const isActive = currentStationId === fav.url;
            return (
              <div 
                key={fav.uuid}
                className={`flex items-center px-4 py-2.5 border-b border-white/5 group transition-colors 
                  ${isActive ? 'bg-black/40 border-l-4 accent-border' : 'hover:bg-white/5'}`}
              >
                <div className={`w-6 text-[10px] font-mono ${isActive ? 'accent-text' : 'text-gray-600'}`}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div 
                  className="flex-1 text-[11px] font-medium cursor-pointer truncate"
                  onClick={() => onPlayStation(fav)}
                >
                  <span className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}>
                    {fav.name}
                  </span>
                </div>
                <button 
                  onClick={() => onRemoveFavorite(fav)}
                  className="text-gray-600 hover:text-red-500 text-[10px] opacity-0 group-hover:opacity-100 transition-all p-1"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-between items-center px-4 py-2 bg-black/40 text-[9px] text-gray-500 font-bold">
        <div className="flex gap-4">
           <button className="hover:accent-text transition-colors">EXPORT</button>
           <button className="hover:accent-text transition-colors">CLEAR</button>
        </div>
        <div className="digital-glow text-[11px] opacity-60">
          {favorites.length}:00
        </div>
      </div>
    </div>
  );
};

export default WinampPlaylist;
