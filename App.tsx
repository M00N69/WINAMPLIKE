
import React, { useState, useEffect, useRef } from 'react';
import { Station, FavoriteStation, PlayerStatus } from './types';
import { searchStations } from './services/radioBrowser';
import WinampPlayer from './components/WinampPlayer';
import WinampPlaylist from './components/WinampPlaylist';
import WinampSearch from './components/WinampSearch';

const DEFAULT_FAVORITES: FavoriteStation[] = [
  { uuid: 'user-disco-1', name: 'Disco Funk USA', url: 'https://discofunk.streamingmedia.it/usa' },
  { uuid: 'user-disco-2', name: 'Dribbcast Disco', url: 'https://antares.dribbcast.com/proxy/s8190/stream' },
  { uuid: 'user-dance-1', name: 'RauteMusik Breakz', url: 'https://rautemusik.stream25.radiohost.de/breakz' },
  { uuid: 'hardcoded-classical-1', name: 'Radio Classique', url: 'https://radioclassique.ice.infomaniak.ch/radioclassique-high.mp3' },
  { uuid: 'final-workout-1', name: 'OpenFM Fitness', url: 'http://stream.openfmmultimedia.pl/openfm_fitness.mp3' }
];

type Theme = 'emerald' | 'ruby' | 'azure';

const THEMES = {
  emerald: {
    accent: '#34d399',
    glow: 'rgba(52, 211, 153, 0.4)',
    title: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
    skin: 'linear-gradient(180deg, #1e293b 0%, #000000 100%)'
  },
  ruby: {
    accent: '#fb7185',
    glow: 'rgba(251, 113, 133, 0.4)',
    title: 'linear-gradient(90deg, #9f1239 0%, #e11d48 100%)',
    skin: 'linear-gradient(180deg, #450a0a 0%, #000000 100%)'
  },
  azure: {
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.4)',
    title: 'linear-gradient(90deg, #1e3a8a 0%, #0369a1 100%)',
    skin: 'linear-gradient(180deg, #1e1b4b 0%, #000000 100%)'
  }
};

const App: React.FC = () => {
  const [currentStation, setCurrentStation] = useState<Station | FavoriteStation | null>(null);
  const [status, setStatus] = useState<PlayerStatus>(PlayerStatus.STOPPED);
  const [favorites, setFavorites] = useState<FavoriteStation[]>([]);
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState<Theme>('emerald');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Load favorites & theme
  useEffect(() => {
    const savedFavs = localStorage.getItem('winampRadioFavorites');
    const savedTheme = localStorage.getItem('winampRadioTheme') as Theme;
    
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch { setFavorites(DEFAULT_FAVORITES); }
    } else { setFavorites(DEFAULT_FAVORITES); }
    
    if (savedTheme && THEMES[savedTheme]) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('winampRadioFavorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('winampRadioTheme', theme);
  }, [theme]);

  const initAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      audioContextRef.current = ctx;
    }
  };

  const playStation = async (station: Station | FavoriteStation) => {
    initAudioContext();
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (currentStation?.url === station.url && status === PlayerStatus.PLAYING) {
      pause();
      return;
    }

    setStatus(PlayerStatus.LOADING);
    setCurrentStation(station);
    
    if (audioRef.current) {
      audioRef.current.src = station.url;
      try {
        await audioRef.current.play();
        setStatus(PlayerStatus.PLAYING);
      } catch (err) {
        console.error("Playback failed", err);
        setStatus(PlayerStatus.ERROR);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setStatus(PlayerStatus.PAUSED);
    }
  };

  const resume = () => {
    if (audioRef.current && currentStation) {
      audioRef.current.play();
      setStatus(PlayerStatus.PLAYING);
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setStatus(PlayerStatus.STOPPED);
    }
  };

  const toggleFavorite = (station: Station | FavoriteStation) => {
    const uuid = 'stationuuid' in station ? station.stationuuid : station.uuid;
    const isFav = favorites.some(f => f.uuid === uuid);
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.uuid !== uuid));
    } else {
      setFavorites(prev => [...prev, { uuid, name: station.name, url: station.url }]);
    }
  };

  const handleSearch = async (query: string) => {
    const results = await searchStations(query);
    setSearchResults(results);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Dynamic Theme Styling
  const themeVars = {
    '--theme-accent': THEMES[theme].accent,
    '--theme-glow': THEMES[theme].glow,
    '--theme-title': THEMES[theme].title,
    '--theme-skin': THEMES[theme].skin,
  } as React.CSSProperties;

  return (
    <div className="min-h-screen p-2 sm:p-4 flex flex-col items-center justify-start gap-3 sm:gap-4 transition-colors duration-500 overflow-x-hidden" style={themeVars}>
      <audio 
        ref={audioRef} 
        crossOrigin="anonymous" 
        onEnded={() => setStatus(PlayerStatus.STOPPED)}
        onError={() => setStatus(PlayerStatus.ERROR)}
      />

      <div className="flex flex-col gap-2 max-w-[550px] w-full px-1">
        <WinampPlayer 
          currentStation={currentStation}
          status={status}
          onPlay={resume}
          onPause={pause}
          onStop={stop}
          volume={volume}
          setVolume={setVolume}
          isMuted={isMuted}
          setIsMuted={setIsMuted}
          analyser={analyserRef.current}
          theme={theme}
          onThemeChange={setTheme}
          accentColor={THEMES[theme].accent}
        />

        <WinampSearch 
          onSearch={handleSearch}
          results={searchResults}
          favorites={favorites}
          onPlayStation={playStation}
          onToggleFavorite={toggleFavorite}
          currentStationId={currentStation?.url || ''}
        />

        <WinampPlaylist 
          favorites={favorites}
          onPlayStation={playStation}
          onRemoveFavorite={toggleFavorite}
          currentStationId={currentStation?.url || ''}
        />
      </div>

      <footer className="mt-8 text-[9px] sm:text-[10px] text-gray-600 uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono text-center px-4 pb-8">
        Winamp Modern Suite v3.1 • Responsive Multi-Skin Experience
      </footer>
    </div>
  );
};

export default App;
