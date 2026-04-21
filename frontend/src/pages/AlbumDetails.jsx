import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import SongItem from '../components/SongItem';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AlbumDetails = () => {
  const { id } = useParams();
  const [albumData, setAlbumData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await api.get(`/albums/${id}`);
        setAlbumData(res.data);
      } catch (error) {
        console.error('Error fetching album data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  useGSAP(() => {
    if (!loading && albumData) {
      gsap.from(".album-hero-content > *", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
      gsap.from(".tracklist-item", {
        opacity: 0,
        x: -20,
        stagger: 0.05,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.4
      });
    }
  }, [loading]);

  const handleLikeUpdate = (songId, likes) => {
    setAlbumData(prev => ({
      ...prev,
      songs: prev.songs.map(song => 
        song._id === songId ? { ...song, likes } : song
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-950">
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-white/5 animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!albumData || !albumData.album) {
    return <div className="text-center py-20 text-xl font-bold bg-slate-950 text-white min-h-screen">Era not found</div>;
  }

  const { album, songs } = albumData;

  return (
    <div className="min-h-screen pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <img 
          src={album.coverImage} 
          className="w-full h-full object-cover blur-[150px] scale-150 rotate-12"
          alt=""
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-10">
        <div className="mb-10">
          <Link to="/albums" className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-slate-300">
            &larr; Back to Discography
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left Column: Cover */}
          <div className="w-full lg:w-[400px] flex-shrink-0 album-hero-content">
            <div className="sticky top-32">
              <div className="relative group">
                <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <img 
                  src={album.coverImage || 'https://via.placeholder.com/600'} 
                  alt={album.title} 
                  className="w-full rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] aspect-square object-cover relative z-10 border border-white/10"
                />
              </div>
              
              <div className="mt-12 space-y-6">
                <div className="p-8 rounded-[2rem] bg-white/5 border border-white/5 backdrop-blur-md">
                   <div className="flex justify-between items-center mb-4">
                     <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Released</span>
                     <span className="text-white font-black">{new Date(album.releaseDate).getFullYear()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Tracks</span>
                     <span className="text-white font-black">{songs.length}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Details */}
          <div className="flex-grow album-hero-content">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 leading-none">
              {album.title}
            </h1>
            
            <div className="bg-white/5 border-l-4 border-pink-500 p-8 rounded-r-3xl mb-16 backdrop-blur-sm">
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium">
                {album.description}
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-3xl font-black text-white">The Tracklist</h3>
                <span className="text-pink-500 font-bold text-sm bg-pink-500/10 px-4 py-1.5 rounded-full uppercase tracking-widest">Original Records</span>
              </div>

              {songs.length === 0 ? (
                <div className="p-20 text-center glass-card">
                  <p className="text-slate-500 font-bold italic">This era's records are being cataloged...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {songs.map((song, index) => (
                    <div key={song._id} className="tracklist-item">
                      <SongItem 
                        song={song} 
                        index={index} 
                        onLikeUpdate={handleLikeUpdate} 
                        isPremium={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlbumDetails;

