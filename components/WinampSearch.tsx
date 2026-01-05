
import React, { useState } from 'react';
import { Station, FavoriteStation } from '../types';

interface Props {
  onSearch: (q: string) => void;
  results: Station[];
  favorites: FavoriteStation[];
  onPlayStation: (s: Station) => void;
  onToggleFavorite: (s: Station) => void;
  currentStationId: string;
}

const WinampSearch: React.FC<Props> = ({ 
  onSearch, results, favorites, onPlayStation, onToggleFavorite, currentStationId 
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const isFavorite = (id: string) => favorites.some(f => f.uuid === id);

  return (
    <div className="winamp-skin p-1 flex flex-col gap-1 select-none transition-all duration-500">
      <div className="bg-white/5 px-3 py-2 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        <span><i className="fas fa-search mr-2 accent-text"></i>STATION SEARCH</span>
        <i className="fas fa-satellite accent-text animate-pulse"></i>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 p-3 bg-black/30">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SEARCH RADIO-BROWSER..."
          className="flex-1 bg-black/50 border border-white/10 rounded-sm px-3 py-2 text-[11px] accent-text font-mono outline-none focus:accent-border transition-colors placeholder:text-gray-700"
        />
        <button className="bg-white/5 border border-white/10 rounded-sm px-4 text-[10px] font-bold text-gray-400 hover:accent-bg hover:text-black transition-all">
          FIND
        </button>
      </form>

      <div className="max-h-48 overflow-y-auto bg-black/40 border-t border-white/5">
        {results.length === 0 ? (
          <div className="text-[10px] text-gray-700 font-mono p-10 text-center italic uppercase tracking-widest">
            READY FOR BROADCAST
          </div>
        ) : (
          results.map((station) => {
            const isActive = currentStationId === station.url;
            return (
              <div 
                key={station.stationuuid}
                className={`flex items-center justify-between px-4 py-2.5 border-b border-white/5 group transition-colors
                  ${isActive ? 'bg-black/40' : 'hover:bg-white/5'}`}
              >
                <div 
                  className="flex-1 text-[11px] font-mono cursor-pointer truncate mr-3"
                  onClick={() => onPlayStation(station)}
                >
                  <span className={isActive ? 'accent-text font-bold' : 'text-gray-400 group-hover:text-gray-200'}>
                    {station.name}
                  </span>
                  <span className="text-gray-700 text-[9px] ml-2 font-bold italic tracking-tighter">[{station.country || 'WW'}]</span>
                </div>
                <button 
                  onClick={() => onToggleFavorite(station)}
                  className={`w-7 h-7 flex items-center justify-center rounded-full transition-all 
                    ${isFavorite(station.stationuuid) 
                      ? 'text-red-500 bg-red-500/10' 
                      : 'text-gray-700 hover:text-white hover:bg-white/10'}`}
                >
                  <i className={`${isFavorite(station.stationuuid) ? 'fas' : 'far'} fa-heart text-[10px]`}></i>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WinampSearch;
