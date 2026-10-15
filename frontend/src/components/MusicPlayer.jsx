import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    currentTimeFormatted,
    durationFormatted,
    volume, 
    setVolume, 
    togglePlay, 
    stopSong, 
    seek,
    lyricsOpen,
    toggleLyrics,
    playNext,
    playPrev
  } = usePlayer();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.8);

  if (!currentSong) return null;

  const coverImage = currentSong.albumCover || (currentSong.albumId && currentSong.albumId.coverImage) || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400';
  const albumTitle = currentSong.albumTitle || (currentSong.albumId && currentSong.albumId.title) || 'Taylor Swift';
  const songLyrics = currentSong.lyrics || `[Verse 1]\n${currentSong.title} echoes in the midnight glow\nEvery memory unfolds as the guitars play low...\n\n[Chorus]\nTaylor Swift - ${currentSong.title}\nRecorded for the Vault and forever in the Anthology.`;

  const handleMuteToggle = () => {
    if (isMuted) {
      setVolume(prevVolume || 0.8);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <>
      {/* 1. FLOATING MINI PLAYER BAR */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-5xl animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/10 rounded-[2.2rem] p-4 md:p-5 shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center gap-5 relative">
          
          {/* Song Info */}
          <div className="flex items-center gap-4 w-full md:w-1/3 min-w-0">
            <div 
              onClick={() => toggleLyrics(true)}
              className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group shadow-lg"
              title="Click to view full lyrics"
            >
              <img 
                src={coverImage} 
                alt={currentSong.title} 
                className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'group-hover:scale-110'}`}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-black">🎤</span>
              </div>
            </div>

            <div className="overflow-hidden min-w-0">
              <h4 className="text-white font-black text-base md:text-lg truncate tracking-tight flex items-center gap-2">
                {currentSong.title}
                {currentSong.title === 'Patient Zero' && (
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-400 text-[9px] font-black uppercase tracking-wider border border-pink-500/30">
                    Vault Special
                  </span>
                )}
              </h4>
              <p className="text-pink-400/90 font-bold text-xs uppercase tracking-wider truncate">
                {albumTitle}
              </p>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="flex flex-col items-center gap-2.5 flex-grow w-full md:w-auto">
            <div className="flex items-center gap-6">
              {/* Prev */}
              <button 
                onClick={playPrev}
                className="text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all"
                title="Previous Track"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              {/* Play / Pause */}
              <button 
                onClick={togglePlay}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(236,72,153,0.4)]"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button 
                onClick={playNext}
                className="text-slate-400 hover:text-white hover:scale-110 active:scale-95 transition-all"
                title="Next Track"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                </svg>
              </button>
            </div>

            {/* Scrubber */}
            <div className="flex items-center gap-3 w-full max-w-md">
              <span className="text-[10px] font-black text-slate-400 w-8 text-right font-mono">
                {currentTimeFormatted}
              </span>
              <div 
                className="relative flex-grow h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  seek((x / rect.width) * 100);
                }}
              >
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"></div>
                </div>
              </div>
              <span className="text-[10px] font-black text-slate-400 w-8 font-mono">
                {durationFormatted !== '0:00' ? durationFormatted : currentSong.duration || '0:30'}
              </span>
            </div>
          </div>

          {/* Right Tools: Lyrics Button + Volume + Close */}
          <div className="flex items-center gap-4 w-full md:w-1/3 justify-end">
            
            {/* Lyrics Studio Toggle Button */}
            <button 
              onClick={() => toggleLyrics()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 ${
                lyricsOpen 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/30' 
                  : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/10'
              }`}
            >
              <span>🎤</span>
              <span>Lyrics</span>
            </button>

            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-2">
              <button onClick={handleMuteToggle} className="text-slate-400 hover:text-white transition-colors">
                {isMuted || volume === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                )}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Stop / Close button */}
            <button 
              onClick={stopSong}
              className="p-2 rounded-full hover:bg-white/10 text-slate-500 hover:text-white transition-colors"
              title="Close Player"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXPANDED FULL-SCREEN LYRICS & STUDIO OVERLAY */}
      {lyricsOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-300 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-pink-500 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-pink-400">
                SWIFtAY Lyrics Studio
              </span>
            </div>

            <button 
              onClick={() => toggleLyrics(false)}
              className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all flex items-center gap-2 border border-white/10"
            >
              <span>Minimize</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-12 max-w-7xl mx-auto w-full">
            
            {/* Left: Vinyl & Track Artwork */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative group">
                <div className={`w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-[0_30px_90px_rgba(236,72,153,0.35)] border border-white/20 relative transition-transform duration-1000 ${isPlaying ? 'scale-105' : ''}`}>
                  <img 
                    src={coverImage} 
                    alt={currentSong.title}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Spinning Vinyl Effect Behind Art */}
                <div className={`absolute -right-10 top-1/2 -translate-y-1/2 w-48 h-48 md:w-60 md:h-60 rounded-full bg-black border-4 border-slate-800 -z-10 shadow-2xl transition-all duration-700 hidden sm:block ${isPlaying ? 'animate-[spin_10s_linear_infinite] opacity-90' : 'opacity-40'}`}>
                  <div className="w-full h-full rounded-full border-8 border-dashed border-slate-700/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-pink-500/20 border border-pink-500 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2">
                  {currentSong.title}
                </h2>
                <p className="text-pink-400 font-bold text-lg uppercase tracking-widest">
                  {albumTitle}
                </p>
              </div>

              {/* In-Studio Scrubber */}
              <div className="w-full max-w-sm space-y-3 pt-2">
                <div 
                  className="relative h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    seek((x / rect.width) * 100);
                  }}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                  <span>{currentTimeFormatted}</span>
                  <span>{durationFormatted}</span>
                </div>
              </div>

              {/* Studio Controls */}
              <div className="flex items-center gap-6 pt-2">
                <button 
                  onClick={playPrev}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                </button>
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-pink-500/40"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  )}
                </button>
                <button 
                  onClick={playNext}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" /></svg>
                </button>
              </div>
            </div>

            {/* Right: Full Lyrics Scroll Panel */}
            <div className="lg:col-span-7 flex flex-col h-full bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Full Lyric Manuscript
                </div>
                <div className="text-xs font-black text-pink-400">
                  {isPlaying ? '● Playing' : '○ Paused'}
                </div>
              </div>

              {/* Scrollable lyrics */}
              <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar space-y-6">
                {songLyrics.split('\n\n').map((verse, vIdx) => {
                  const isTag = verse.trim().startsWith('[');
                  return (
                    <div 
                      key={vIdx} 
                      className={`p-6 rounded-2xl transition-all duration-300 ${
                        isTag 
                          ? 'bg-pink-500/10 border border-pink-500/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      {verse.split('\n').map((line, lIdx) => (
                        <p 
                          key={lIdx} 
                          className={`text-xl md:text-2xl font-bold leading-relaxed tracking-tight ${
                            line.startsWith('[') 
                              ? 'text-pink-400 font-black text-sm uppercase tracking-widest mb-2' 
                              : 'text-slate-200 hover:text-white transition-colors'
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
