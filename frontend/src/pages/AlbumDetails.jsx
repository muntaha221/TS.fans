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
        y: 20,
        stagger: 0.08,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });
      gsap.from(".tracklist-item", {
        opacity: 0,
        x: -15,
        stagger: 0.03,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, [loading]);

  const handleLikeUpdate = (songId, likes) => {
    setAlbumData(prev => ({
      ...prev,
      songs: (prev.songs || []).map(song =>
        song._id === songId ? { ...song, likes } : song
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#050505]">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-2 border-white/[0.04] animate-ping"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-violet-500 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    );
  }

  const album = albumData?.album || (albumData?.title ? albumData : null);
  const songs = albumData?.songs || album?.songs || [];
  const safeSongs = Array.isArray(songs) ? songs : [];

  if (!album) {
    return (
      <div className="text-center py-20 text-xl font-bold bg-[#050505] text-white min-h-screen flex flex-col items-center justify-center gap-4">
        <span>Era not found in the Anthology</span>
        <Link to="/albums" className="px-6 py-2 rounded-full bg-violet-600 text-white font-bold text-sm">
          Browse All Eras
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <img
          src={album.coverImage}
          className="w-full h-full object-cover blur-[150px] scale-150 rotate-12"
          alt=""
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pt-6 sm:pt-10">
        <div className="mb-6 sm:mb-10">
          <Link to="/albums" className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all font-bold text-slate-400 text-sm">
            &larr; Back to Discography
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 sm:gap-16">
          {/* Left Column: Cover */}
          <div className="w-full lg:w-[350px] flex-shrink-0 album-hero-content">
            <div className="lg:sticky lg:top-32">
              <div className="relative group">
                <div className="absolute inset-0 bg-violet-600/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                <img
                  src={album.coverImage || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600'}
                  alt={album.title}
                  className="w-full rounded-2xl sm:rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] aspect-square object-cover relative z-10 border border-white/[0.06]"
                />
              </div>

              <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
                <div className="p-5 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.04] backdrop-blur-md">
                   <div className="flex justify-between items-center mb-3">
                     <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Released</span>
                     <span className="text-white font-black text-sm">{new Date(album.releaseDate).getFullYear()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Tracks</span>
                     <span className="text-white font-black text-sm">{safeSongs.length}</span>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="flex-grow album-hero-content">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-6 sm:mb-8 leading-none">
              {album.title}
            </h1>

            <div className="bg-white/[0.03] border-l-4 border-violet-500 p-5 sm:p-8 rounded-r-2xl mb-10 sm:mb-16 backdrop-blur-sm">
              <p className="text-base sm:text-xl md:text-2xl text-slate-400 leading-relaxed font-medium">
                {album.description}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between mb-2 sm:mb-4 px-2 sm:px-4">
                <h3 className="text-xl sm:text-3xl font-black text-white">The Tracklist</h3>
                <span className="text-violet-500 font-bold text-[10px] sm:text-sm bg-violet-500/10 px-3 sm:px-4 py-1 rounded-full uppercase tracking-widest">Original Records</span>
              </div>

              {safeSongs.length === 0 ? (
                <div className="p-12 sm:p-20 text-center glass-card">
                  <p className="text-slate-500 font-bold italic">This era's records are being cataloged...</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {safeSongs.map((song, index) => (
                    <div key={song._id} className="tracklist-item">
                      <SongItem
                        song={song}
                        index={index}
                        onLikeUpdate={handleLikeUpdate}
                        isPremium={true}
                        albumCover={album.coverImage}
                        albumTitle={album.title}
                        playlist={safeSongs}
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
