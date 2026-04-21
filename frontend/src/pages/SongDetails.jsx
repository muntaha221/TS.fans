import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const SongDetails = () => {
  const { id } = useParams();
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
          background: '#0f172a',
          color: '#fff',
          border: '1px solid rgba(236, 72, 153, 0.2)'
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
          background: '#1e293b',
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
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="w-16 h-16 border-4 border-pink-500/20 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!song) {
    return <div className="text-center py-20 text-xl font-bold bg-slate-950 text-white min-h-screen font-black">SONG NOT FOUND</div>;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-6 pt-10">
        <div className="mb-10">
          <Link to={song.albumId ? `/albums/${song.albumId._id}` : '/albums'} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-slate-400">
            &larr; Back to {song.albumId ? song.albumId.title : 'Discography'}
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-center mb-20 song-header">
           <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(236,72,153,0.3)] border border-white/10 relative">
              <img 
                src={song.albumId?.coverImage || 'https://via.placeholder.com/400'} 
                alt={song.albumId?.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
           </div>

           <div className="flex-grow text-center lg:text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black tracking-widest uppercase mb-4">
                Single Record
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 leading-none">{song.title}</h1>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8">
                 <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Duration</span>
                    <span className="text-white font-black">{song.duration}</span>
                 </div>
                 
                 <button 
                   onClick={handleLike}
                   className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 transition-all text-white font-black shadow-xl shadow-pink-500/20 active:scale-95"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                     <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                   </svg>
                   <span>{song.likes || 0} Likes</span>
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-8">
              <h2 className="text-4xl font-black text-white px-2">Fan Anthology</h2>
              
              <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8 backdrop-blur-xl">
                 <form onSubmit={handleCommentSubmit} className="mb-12">
                    <div className="flex flex-col gap-6">
                       <input 
                        type="text" 
                        placeholder="What should we call you?"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isSubmitting}
                        className="bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all font-bold"
                      />
                      <div className="relative">
                        <textarea 
                          placeholder="Share your thoughts on this record..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          disabled={isSubmitting}
                          rows="4"
                          className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 focus:ring-2 focus:ring-pink-500 outline-none transition-all font-bold resize-none"
                        ></textarea>
                        <button 
                          type="submit" 
                          disabled={isSubmitting || !commentText.trim()}
                          className="absolute bottom-4 right-4 bg-white text-black px-8 py-3 rounded-xl font-black hover:bg-pink-500 hover:text-white transition-all disabled:opacity-30 active:scale-95"
                        >
                          Post thought
                        </button>
                      </div>
                    </div>
                 </form>

                 <div className="space-y-6">
                    {!song.comments || song.comments.length === 0 ? (
                      <div className="text-center py-20 bg-slate-900/50 rounded-3xl border border-dashed border-white/10">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                          <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="text-slate-500 font-bold max-w-xs mx-auto leading-relaxed">The anthology for this record is waiting for your perspective.</p>
                      </div>
                    ) : (
                      song.comments.slice().reverse().map((comment, i) => (
                        <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-black text-2xl shadow-xl shadow-pink-500/10 group-hover:rotate-6 transition-transform">
                            {comment.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-2">
                             <div className="flex items-center gap-3">
                                <span className="font-black text-xl text-white">
                                  {comment.username}
                                </span>
                                <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </span>
                             </div>
                             <p className="text-slate-300 text-lg leading-relaxed font-medium">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                 </div>
              </div>
           </div>

           {/* Sidebar: Details/Meta */}
           <div className="space-y-8">
              <h3 className="text-2xl font-black text-white px-2">Record Archives</h3>
              <div className="glass-card p-8 space-y-8">
                 <div>
                    <span className="block text-slate-500 font-bold uppercase tracking-widest text-xs mb-3">Associated Era</span>
                    <Link to={`/albums/${song.albumId?._id}`} className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5">
                        <img src={song.albumId?.coverImage} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <span className="font-black text-white group-hover:text-pink-400 transition-colors">{song.albumId?.title}</span>
                    </Link>
                 </div>

                 <div className="pt-8 border-t border-white/5">
                    <span className="block text-slate-500 font-bold uppercase tracking-widest text-xs mb-3">Aesthetic</span>
                    <div className="flex flex-wrap gap-2">
                       {['Premium', 'Original', 'Vault'].map(tag => (
                         <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-tighter border border-white/5">
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

