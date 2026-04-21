import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';

const SongItem = ({ song, index, onLikeUpdate }) => {
  const [isLiking, setIsLiking] = useState(false);
  const likesCount = song.likes || 0;

  const handleLike = async (e) => {
    e.preventDefault();
    try {
      setIsLiking(true);
      const res = await api.post(`/songs/${song._id}/like`);
      if (onLikeUpdate) {
        onLikeUpdate(song._id, res.data); // Update to new likes count
      }
      toast.success(`Liked ${song.title}!`, {
        icon: '💖',
        style: {
          borderRadius: '1rem',
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(236, 72, 153, 0.2)'
        }
      });
    } catch (error) {
      toast.error('Failed to like song');
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Link to={`/songs/${song._id}`} className="block w-full group">
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-pink-500/20 hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          <span className="text-slate-600 font-bold text-lg w-8">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h4 className="text-xl font-black text-white group-hover:text-pink-400 transition-colors tracking-tight">
              {song.title}
            </h4>
            <div className="flex items-center gap-3 mt-1">
               <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{song.duration}</span>
               <div className="w-1 h-1 rounded-full bg-slate-700"></div>
               <span className="text-xs font-bold text-pink-500/80">{likesCount} SWIFTIES LIKED</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleLike} 
            disabled={isLiking}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLiking ? 'animate-pulse' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
          
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SongItem;

