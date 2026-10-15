import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePlayer } from '../context/PlayerContext';

const SongDetails = () => {
  const { id } = useParams();
  const { playSong, toggleLyrics } = usePlayer();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const res = await api.get(`/songs/${id}`);
        setSong(res.data);
      } catch (error) {
        console.error('Error fetching song', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [id]);

  useGSAP(() => {
    if (!loading && song) {
      gsap.from(".song-header > *", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }, [loading]);

  const handleLike = async () => {
    try {
      const res = await api.post(`/songs/${id}/like`);
      setSong({ ...song, likes: res.data });
      toast.success('Record liked!', {
        icon: '💖',
        style: {
          borderRadius: '1rem',
          background: '#0a0a0a',
          color: '#fff',
          border: '1px solid rgba(124, 58, 237, 0.2)'
        }
      });
    } catch (error) {
      toast.error('Failed to like song');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.post(`/songs/${id}/comment`, {
        text: commentText,
        username: username.trim() || 'Anonymous Swiftie'
      });
      setSong({ ...song, comments: res.data });
      setCommentText('');
      toast.success('Your thought has been recorded.', {
        style: {
          borderRadius: '1rem',
          background: '#0a0a0a',
          color: '#fff'
        }
      });
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!song) {
    return <div className="text-center py-20 text-xl font-bold bg-[#050505] text-white min-h-screen">SONG NOT FOUND</div>;
  }

  const coverImage = song.albumId?.coverImage || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400';
  const safeComments = Array.isArray(song.comments) ? song.comments : [];

  return (
    <div className="min-h-screen pb-24 sm:pb-32">
      <div className="container mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        <div className="mb-6 sm:mb-10">
          <Link
            to={song.albumId ? `/albums/${song.albumId._id}` : '/albums'}
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all font-bold text-slate-400 text-sm"
          >
            &larr; Back to {song.albumId ? song.albumId.title : 'Discography'}
          </Link>
        </div>

        {/* Song Hero */}
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-center sm:items-start mb-10 sm:mb-20 song-header">
          <div className="w-40 h-40 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(124,58,237,0.2)] border border-white/[0.06] relative flex-shrink-0">
            <img
              src={coverImage}
              alt={song.albumId?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/60 to-transparent"></div>
          </div>

          <div className="flex-grow text-center sm:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] font-black tracking-widest uppercase mb-3 sm:mb-4">
              Single Record
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 sm:mb-6 leading-none">{song.title}</h1>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/[0.04]">
                <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                <span className="text-white font-black text-sm">{song.duration}</span>
              </div>

              <button
                onClick={() => playSong({ ...song, albumCover: song.albumId?.coverImage, albumTitle: song.albumId?.title })}
                className="flex items-center gap-2 px-5 sm:px-8 py-2 sm:py-3 rounded-xl bg-white text-black hover:bg-violet-600 hover:text-white transition-all font-black shadow-xl active:scale-95 text-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                <span>Play</span>
              </button>

              <button
                onClick={() => {
                  playSong({ ...song, albumCover: song.albumId?.coverImage, albumTitle: song.albumId?.title });
                  toggleLyrics(true);
                }}
                className="flex items-center gap-2 px-5 sm:px-8 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-black hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 active:scale-95 text-sm"
              >
                <span>🎤</span>
                <span>Lyrics Studio</span>
              </button>

              <button
                onClick={handleLike}
                className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/[0.06] transition-all text-white font-black active:scale-95 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span>{song.likes || 0}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          {/* Comments */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-4xl font-black text-white px-1">Fan Anthology</h2>

            <div className="bg-white/[0.02] rounded-2xl sm:rounded-[2rem] border border-white/[0.04] p-5 sm:p-8 backdrop-blur-xl">
              <form onSubmit={handleCommentSubmit} className="mb-8 sm:mb-12">
                <div className="flex flex-col gap-4 sm:gap-6">
                  <input
                    type="text"
                    placeholder="What should we call you?"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-white/[0.03] border border-white/[0.06] text-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold text-sm"
                  />
                  <div className="relative">
                    <textarea
                      placeholder="Share your thoughts on this record..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={isSubmitting}
                      rows="4"
                      className="w-full bg-white/[0.03] border border-white/[0.06] text-white rounded-xl px-4 sm:px-6 py-3 sm:py-4 focus:ring-2 focus:ring-violet-500 outline-none transition-all font-bold resize-none text-sm"
                    ></textarea>
                    <button
                      type="submit"
                      disabled={isSubmitting || !commentText.trim()}
                      className="absolute bottom-3 right-3 bg-white text-black px-5 sm:px-8 py-2 rounded-lg font-black hover:bg-violet-600 hover:text-white transition-all disabled:opacity-30 active:scale-95 text-sm"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-4 sm:space-y-6">
                {safeComments.length === 0 ? (
                  <div className="text-center py-12 sm:py-20 bg-[#0a0a0a]/50 rounded-2xl border border-dashed border-white/[0.06]">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.06]">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-slate-600 font-bold max-w-xs mx-auto leading-relaxed text-sm">The anthology for this record is waiting for your perspective.</p>
                  </div>
                ) : (
                  safeComments.slice().reverse().map((comment, i) => (
                    <div key={i} className="flex gap-4 sm:gap-6 p-5 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-black text-lg sm:text-2xl shadow-xl shadow-violet-500/10 group-hover:rotate-6 transition-transform">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="font-black text-base sm:text-xl text-white">
                            {comment.username}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm sm:text-lg leading-relaxed font-medium">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 sm:space-y-8">
            <h3 className="text-xl sm:text-2xl font-black text-white px-1">Record Archives</h3>
            <div className="glass-card p-5 sm:p-8 space-y-6 sm:space-y-8">
              <div>
                <span className="block text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-3">Associated Era</span>
                <Link to={`/albums/${song.albumId?._id}`} className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all border border-white/[0.04]">
                  <img src={song.albumId?.coverImage} className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover" alt="" />
                  <span className="font-black text-white group-hover:text-violet-400 transition-colors text-sm sm:text-base">{song.albumId?.title}</span>
                </Link>
              </div>

              <div className="pt-5 sm:pt-8 border-t border-white/[0.04]">
                <span className="block text-slate-600 font-bold uppercase tracking-widest text-[10px] mb-3">Tags</span>
                <div className="flex flex-wrap gap-2">
                  {['Premium', 'Original', 'Vault'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-white/[0.03] text-slate-500 text-[10px] font-black uppercase tracking-tighter border border-white/[0.04]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
