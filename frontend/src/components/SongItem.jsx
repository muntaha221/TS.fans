import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import api from '../api';
import toast from 'react-hot-toast';

const SongItem = ({ song, index, onLikeUpdate, albumCover, albumTitle, playlist = null }) => {
  const { playSong, currentSong, isPlaying, toggleLyrics } = usePlayer();
  const [isLiking, setIsLiking] = useState(false);

  const [hasLiked, setHasLiked] = useState(() => {
    const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
    return likedSongs.includes(song._id);
  });

  const likesCount = song.likes || 0;
  const isCurrent = currentSong?._id === song._id;

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasLiked) {
      toast('You already liked this song! ✨', { icon: '💖' });
      return;
    }

    try {
      setIsLiking(true);
      const res = await api.post(`/songs/${song._id}/like`);

      setHasLiked(true);
      const likedSongs = JSON.parse(localStorage.getItem('likedSongs') || '[]');
      likedSongs.push(song._id);
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));

      if (onLikeUpdate) {
        onLikeUpdate(song._id, res.data);
      }
      toast.success(`Liked ${song.title}!`, { icon: '💖' });
    } catch (error) {
      toast.error('Failed to like song');
    } finally {
      setIsLiking(false);
    }
  };

  const handlePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const songWithAlbum = {
      ...song,
      albumCover: albumCover || song.albumCover,
      albumTitle: albumTitle || song.albumTitle
    };

    playSong(songWithAlbum, playlist);
  };

  const handleOpenLyrics = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const songWithAlbum = {
      ...song,
      albumCover: albumCover || song.albumCover,
      albumTitle: albumTitle || song.albumTitle
    };
    playSong(songWithAlbum, playlist);
    toggleLyrics(true);
  };

  return (
    <div
      onClick={handlePlay}
      className={`song-item-container group flex items-center justify-between p-3 sm:p-4 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-md ${isCurrent ? 'bg-violet-600/10 border-violet-500/30 shadow-lg shadow-violet-500/5' : 'bg-white/[0.02] border-white/[0.04] hover:border-white/10 hover:bg-white/[0.05]'}`}
    >
      <div className="flex items-center space-x-3 sm:space-x-5 min-w-0">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center">
          <span className={`text-sm sm:text-base font-black transition-opacity duration-300 ${isCurrent && isPlaying ? 'opacity-0' : 'group-hover:opacity-0 text-slate-600'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isCurrent && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-violet-500 animate-[bounce_1s_infinite]"></div>
                <div className="w-1 bg-violet-500 animate-[bounce_0.7s_infinite]"></div>
                <div className="w-1 bg-violet-500 animate-[bounce_0.9s_infinite]"></div>
              </div>
            ) : (
              <svg className="w-5 h-5 text-violet-400 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <Link
            to={`/songs/${song._id}`}
            onClick={(e) => e.stopPropagation()}
            className={`text-sm sm:text-base font-black truncate transition-colors flex items-center gap-2 hover:text-violet-400 ${isCurrent ? 'text-violet-400' : 'text-white'}`}
            title="Open Song Details"
          >
            <span className="hover:underline">{song.title}</span>
            {song.title === 'Patient Zero' && (
              <span className="px-2 py-0.5 rounded-full bg-violet-600/20 text-violet-400 text-[8px] font-black uppercase tracking-wider border border-violet-500/30">
                Vault
              </span>
            )}
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-600">{song.duration}</span>
             <div className="w-1 h-1 rounded-full bg-slate-800"></div>
             <span className="text-[9px] sm:text-[10px] font-black text-violet-500/60 uppercase tracking-widest">{likesCount} LIKES</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Quick Lyrics button */}
        <button
          onClick={handleOpenLyrics}
          title="Open Lyrics Studio"
          className="px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold transition-all border border-white/[0.04] hidden sm:flex items-center gap-1"
        >
          <span>🎤</span>
          <span>Lyrics</span>
        </button>

        {/* View Song Link */}
        <Link
          to={`/songs/${song._id}`}
          onClick={(e) => e.stopPropagation()}
          title="View song record page"
          className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/[0.04] flex items-center justify-center"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border transition-all duration-300 ${isLiking ? 'animate-pulse' : ''} ${hasLiked ? 'bg-violet-600/20 border-violet-500/40 text-violet-400 cursor-default' : 'bg-white/[0.03] border-white/[0.06] text-white hover:bg-violet-600/20 hover:border-violet-500/40 active:scale-90'}`}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SongItem;
