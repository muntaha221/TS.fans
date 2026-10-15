import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import AlbumCard from '../components/AlbumCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/albums');
        const data = Array.isArray(res.data) ? res.data : [];
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums', error);
        setAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useGSAP(() => {
    if (!loading && albums.length > 0 && containerRef.current) {
      gsap.from(".album-wrapper", {
        opacity: 0,
        y: 30,
        stagger: 0.06,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, [loading, albums]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen">
      <div className="mb-12 sm:mb-20 text-center relative py-12 sm:py-20 px-4 sm:px-6 rounded-2xl sm:rounded-[3rem] overflow-hidden bg-[#0a0a0a] shadow-2xl border border-white/[0.04]">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-violet-600/8 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-blue-600/8 blur-[100px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black mb-4 sm:mb-6 tracking-tighter text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-blue-500">Anthology</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
            Every chapter, every lyric, every memory. Explore the exhaustive discography of Taylor Swift.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="bg-white/[0.03] rounded-2xl aspect-[3/4] animate-pulse"></div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 sm:py-32 glass-card">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/[0.03] rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 border border-white/[0.06]">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4">The Vault is Loading</h3>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base">Albums are being loaded from the vault. Please refresh or check back soon.</p>
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
          {albums.map(album => (
            <div key={album._id} className="album-wrapper">
              <AlbumCard album={album} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Albums;
