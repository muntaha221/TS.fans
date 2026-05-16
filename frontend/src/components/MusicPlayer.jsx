import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
  const { currentSong, isPlaying, progress, volume, setVolume, togglePlay, stopSong, seek } = usePlayer();
  const playerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if they clicked on a SongItem to play it
      if (playerRef.current && !playerRef.current.contains(event.target) && !event.target.closest('.song-item-container')) {
        stopSong();
      }
    };

    if (currentSong) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [currentSong, stopSong]);

  if (!currentSong) return null;

  const coverImage = currentSong.albumCover || (currentSong.albumId && currentSong.albumId.coverImage) || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=200&auto=format&fit=crop';
  const albumTitle = currentSong.albumTitle || (currentSong.albumId && currentSong.albumId.title) || 'Taylor Swift';

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl" ref={playerRef}>
      <div className="bg-slate-900/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 md:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-6">
        
        {/* Song Info */}
        <div className="flex items-center gap-6 w-full md:w-1/3">
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 group">
            <img 
              src={coverImage} 
              alt="cover" 
              className={`w-full h-full rounded-2xl object-cover shadow-2xl transition-transform duration-1000 ${isPlaying ? 'scale-110 rotate-3' : ''}`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-pulse"></div>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white font-black text-lg md:text-xl truncate tracking-tight">{currentSong.title}</h4>
            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest truncate">
              {albumTitle}
            </p>
          </div>
        </div>

        {/* Controls & Progress */}
        <div className="flex flex-col items-center gap-3 flex-grow w-full md:w-auto">
          <div className="flex items-center gap-8">
            <button className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-8 h-8 translate-x-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              )}
            </button>

            <button className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" /></svg>
            </button>
          </div>

          <div className="flex items-center gap-4 w-full max-w-md">
            <span className="text-[10px] font-black text-slate-500 w-8">0:15</span>
            <div className="relative flex-grow h-1.5 bg-white/10 rounded-full overflow-hidden cursor-pointer group" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              seek((x / rect.width) * 100);
            }}>
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-500 w-8">0:30</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center gap-4 w-1/3 justify-end">
          <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white"
          />
        </div>

      </div>
    </div>
  );
};

export default MusicPlayer;
