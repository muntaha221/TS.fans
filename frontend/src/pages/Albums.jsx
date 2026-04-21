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
        setAlbums(res.data);
      } catch (error) {
        console.error('Error fetching albums', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useGSAP(() => {
    if (!loading && albums.length > 0 && containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.album-wrapper');
      
      cards.forEach((card, i) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none"
            }
          }
        );
      });
    }
  }, [loading, albums]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="mb-20 text-center relative py-20 px-6 rounded-[4rem] overflow-hidden bg-slate-900 shadow-2xl border border-white/5">
        {/* Background glow */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-500/10 blur-[120px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-white">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Anthology</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            Every chapter, every lyric, every memory. Explore the exhaustive discography of Taylor Swift.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {[1, 2, 4, 5, 6, 7, 8].map(n => (
            <div key={n} className="bg-white/5 rounded-[3rem] aspect-[3/4] animate-pulse"></div>
          ))}
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-32 glass-card">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
            <svg className="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-3xl font-black text-white mb-4">The Vault is Sealed</h3>
          <p className="text-slate-400 max-w-md mx-auto">Please initialize the database using the Admin Panel to see the magic here.</p>
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
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

