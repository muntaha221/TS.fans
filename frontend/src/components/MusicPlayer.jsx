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
      {/* FLOATING MINI PLAYER BAR */}
      <div className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-4xl">
        <div className="bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl p-3 sm:p-4 shadow-[0_20px_70px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row items-center gap-3 sm:gap-4 relative">

          {/* Song Info */}
          <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
            <div
              onClick={() => toggleLyrics(true)}
              className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group shadow-lg"
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
              <h4 className="text-white font-black text-sm sm:text-base truncate tracking-tight">
                {currentSong.title}
              </h4>
              <p className="text-violet-400/80 font-bold text-[10px] uppercase tracking-wider truncate">
                {albumTitle}
              </p>
            </div>
          </div>

          {/* Controls & Scrubber */}
          <div className="flex flex-col items-center gap-2 flex-grow w-full sm:w-auto">
            <div className="flex items-center gap-5">
              <button
                onClick={playPrev}
                className="text-slate-500 hover:text-white hover:scale-110 active:scale-95 transition-all"
                title="Previous Track"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_25px_rgba(124,58,237,0.3)]"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              <button
                onClick={playNext}
                className="text-slate-500 hover:text-white hover:scale-110 active:scale-95 transition-all"
                title="Next Track"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                </svg>
              </button>
            </div>

            {/* Scrubber */}
            <div className="flex items-center gap-2 w-full max-w-md">
              <span className="text-[9px] font-black text-slate-500 w-7 text-right font-mono">
                {currentTimeFormatted}
              </span>
              <div
                className="relative flex-grow h-1.5 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer group"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  seek((x / rect.width) * 100);
                }}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"></div>
                </div>
              </div>
              <span className="text-[9px] font-black text-slate-500 w-7 font-mono">
                {durationFormatted !== '0:00' ? durationFormatted : currentSong.duration || '0:30'}
              </span>
            </div>
          </div>

          {/* Right Tools */}
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => toggleLyrics()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all duration-300 ${
                lyricsOpen
                  ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20'
                  : 'bg-white/[0.04] hover:bg-white/10 text-slate-300 border border-white/[0.06]'
              }`}
            >
              <span>🎤</span>
              <span>Lyrics</span>
            </button>

            {/* Volume slider */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button onClick={handleMuteToggle} className="text-slate-500 hover:text-white transition-colors">
                {isMuted || volume === 0 ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
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
                className="w-14 h-1 bg-white/[0.06] rounded-full appearance-none cursor-pointer accent-violet-500"
              />
            </div>

            {/* Close */}
            <button
              onClick={stopSong}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-600 hover:text-white transition-colors"
              title="Close Player"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* EXPANDED FULL-SCREEN LYRICS & STUDIO OVERLAY */}
      {lyricsOpen && (
        <div className="fixed inset-0 z-50 bg-[#050505]/98 backdrop-blur-3xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400">
                SWIFtAY Lyrics Studio
              </span>
            </div>

            <button
              onClick={() => toggleLyrics(false)}
              className="px-4 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-white/[0.06]"
            >
              <span>Minimize</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-grow overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 p-4 sm:p-8 max-w-7xl mx-auto w-full">

            {/* Left: Artwork */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
              <div className="relative group">
                <div className={`w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_30px_90px_rgba(124,58,237,0.2)] border border-white/10 relative transition-transform duration-1000 ${isPlaying ? 'scale-105' : ''}`}>
                  <img
                    src={coverImage}
                    alt={currentSong.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Spinning Vinyl */}
                <div className={`absolute -right-8 top-1/2 -translate-y-1/2 w-40 h-40 lg:w-52 lg:h-52 rounded-full bg-black border-4 border-slate-900 -z-10 shadow-2xl transition-all duration-700 hidden sm:block ${isPlaying ? 'animate-[spin_10s_linear_infinite] opacity-80' : 'opacity-30'}`}>
                  <div className="w-full h-full rounded-full border-8 border-dashed border-slate-800/50 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-violet-600/20 border border-violet-500 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-1">
                  {currentSong.title}
                </h2>
                <p className="text-violet-400 font-bold text-sm uppercase tracking-widest">
                  {albumTitle}
                </p>
              </div>

              {/* In-Studio Scrubber */}
              <div className="w-full max-w-xs space-y-2">
                <div
                  className="relative h-1.5 bg-white/[0.06] rounded-full overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    seek((x / rect.width) * 100);
                  }}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 via-blue-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
                  <span>{currentTimeFormatted}</span>
                  <span>{durationFormatted}</span>
                </div>
              </div>

              {/* Studio Controls */}
              <div className="flex items-center gap-5">
                <button
                  onClick={playPrev}
                  className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4zM16.445 14.832A1 1 0 0018 14V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" /></svg>
                </button>
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-violet-600 to-blue-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-violet-500/30"
                >
                  {isPlaying ? (
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5 0a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                  ) : (
                    <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  )}
                </button>
                <button
                  onClick={playNext}
                  className="p-2.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-white transition-all hover:scale-110 active:scale-95"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4zM11.555 5.168A1 1 0 0010 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" /></svg>
                </button>
              </div>
            </div>

            {/* Right: Full Lyrics */}
            <div className="lg:col-span-7 flex flex-col h-full bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 sm:p-8 overflow-hidden relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.04]">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Full Lyric Manuscript
                </div>
                <div className="text-[10px] font-black text-violet-400">
                  {isPlaying ? '● Playing' : '○ Paused'}
                </div>
              </div>

              {/* Scrollable lyrics */}
              <div className="flex-grow overflow-y-auto pr-2 space-y-4 hide-scrollbar">
                {songLyrics.split('\n\n').map((verse, vIdx) => {
                  const isTag = verse.trim().startsWith('[');
                  return (
                    <div
                      key={vIdx}
                      className={`p-4 rounded-xl transition-all duration-300 ${
                        isTag
                          ? 'bg-violet-600/10 border border-violet-500/10'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      {verse.split('\n').map((line, lIdx) => (
                        <p
                          key={lIdx}
                          className={`text-base sm:text-lg font-medium leading-relaxed tracking-tight ${
                            line.startsWith('[')
                              ? 'text-violet-400 font-black text-xs uppercase tracking-widest mb-2'
                              : 'text-slate-300 hover:text-white transition-colors'
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
