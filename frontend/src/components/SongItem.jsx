import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import api from '../api';
import toast from 'react-hot-toast';

const SongItem = ({ song, index, onLikeUpdate, albumCover, albumTitle }) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  const [isLiking, setIsLiking] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
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

  const handlePlay = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Inject album info into the song object so the player can use it
    const songWithAlbum = { ...song, albumCover, albumTitle };

    if (song.previewUrl) {
      playSong(songWithAlbum);
    } else {
      try {
        setIsFetching(true);
        const term = `Taylor Swift ${song.title}`;
        const res = await api.get(`/songs/preview/fetch`, { params: { term } });
        
        if (res.data && res.data.previewUrl) {
          const previewUrl = res.data.previewUrl;
          const updatedSong = { ...songWithAlbum, previewUrl };
          playSong(updatedSong);
          // Update backend with the previewUrl so we don't fetch it next time
          api.put(`/songs/${song._id}`, { previewUrl });
        } else {
          toast.error('Preview not available for this track');
        }
      } catch (err) {
        toast.error('Failed to fetch preview');
      } finally {
        setIsFetching(false);
      }
    }
  };

  return (
    <div 
      onClick={handlePlay}
      className={`song-item-container group flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer backdrop-blur-md ${isCurrent ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'}`}
    >
      <div className="flex items-center space-x-6">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className={`text-lg font-black transition-opacity duration-300 ${isCurrent && isPlaying ? 'opacity-0' : 'group-hover:opacity-0 text-slate-600'}`}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isFetching ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : isCurrent && isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-blue-500 animate-[bounce_1s_infinite]"></div>
                <div className="w-1 bg-blue-500 animate-[bounce_0.7s_infinite]"></div>
                <div className="w-1 bg-blue-500 animate-[bounce_0.9s_infinite]"></div>
              </div>
            ) : (
              <svg className="w-6 h-6 text-blue-500 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
            )}
          </div>
        </div>
        
        <div>
          <h4 className={`text-xl font-black transition-colors ${isCurrent ? 'text-blue-400' : 'text-white group-hover:text-blue-400'}`}>
            {song.title}
          </h4>
          <div className="flex items-center gap-3 mt-1">
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{song.duration}</span>
             <div className="w-1 h-1 rounded-full bg-slate-700"></div>
             <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest">{likesCount} SWIFTIES LIKED</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={handleLike} 
          disabled={isLiking}
          className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all duration-300 ${isLiking ? 'animate-pulse' : ''} ${hasLiked ? 'bg-pink-500/20 border-pink-500/50 text-pink-500 cursor-default' : 'bg-white/5 border-white/10 text-white hover:bg-pink-500/20 hover:border-pink-500/50 active:scale-90'}`}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SongItem;

