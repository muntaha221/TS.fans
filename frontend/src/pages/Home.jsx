import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AlbumCard from '../components/AlbumCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/albums');
        setFeaturedAlbums(res.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    // Initial state and reveal
    tl.from(titleRef.current, { 
      opacity: 0, 
      x: -100, 
      duration: 1.5, 
      ease: "power4.out" 
    })
    .from(subtitleRef.current, { 
      opacity: 0, 
      x: -50, 
      duration: 1.2, 
      ease: "power3.out" 
    }, "-=1")
    .from(buttonsRef.current, { 
      opacity: 0, 
      y: 30, 
      duration: 1.2, 
      ease: "back.out(1.7)" 
    }, "-=0.8");

    // Floating animation for the image
    gsap.to(".hero-image", {
      scale: 1.08,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, { scope: containerRef });


  useGSAP(() => {
    if (!loading && featuredAlbums.length > 0 && cardsRef.current) {
      gsap.fromTo(cardsRef.current.children,
        { opacity: 0, scale: 0.8, y: 50 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
      );
    }
  }, [loading, featuredAlbums]);

  return (
    <div ref={containerRef} className="pb-20 bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center mb-24 py-20">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero.jpg" 
            alt="Taylor Swift Cinematic" 
            className="hero-image w-full h-full object-cover object-right opacity-80"
          />
          {/* Gradients to blend text better */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          
          {/* Glowing Accents matching the image lighting */}
          <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[150px] rounded-full animate-float"></div>
          <div className="absolute bottom-[30%] left-[20%] w-[30%] h-[30%] bg-purple-500/10 blur-[150px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-10">
          <div className="max-w-4xl">
            <div className="inline-block px-5 py-2 mb-6 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-xl">
              <span className="text-blue-400 font-black tracking-[0.2em] text-[10px] uppercase">The Definitive Anthology</span>
            </div>
            
            <h1 ref={titleRef} className="text-5xl md:text-8xl lg:text-[9rem] font-black mb-6 tracking-tighter leading-[0.85] text-white">
              MASTERMIND <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-purple-500 drop-shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                OF ERAS
              </span>
            </h1>

            <p ref={subtitleRef} className="text-lg md:text-xl text-slate-300 max-w-xl mb-10 font-medium leading-relaxed">
              Step into the world where lyrics become history. Explore the meticulous orchestration of style, sound, and soul across the Taylor Swift universe.
            </p>

            <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/albums" className="group w-full sm:w-auto px-12 py-5 rounded-2xl bg-white text-black font-black text-xl hover:bg-blue-500 hover:text-white transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4">
                Experience the Eras
                <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </Link>
              <Link to="/trivia" className="group w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-white/20 bg-white/5 backdrop-blur-3xl hover:bg-white/10 hover:border-white/40 transition-all font-black text-xl text-white flex items-center justify-center shadow-xl gap-4">
                Enter the Vault
                <svg className="w-6 h-6 group-hover:rotate-12 transition-transform text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 animate-pulse">
           <div className="w-1.5 h-12 bg-gradient-to-b from-blue-500 to-transparent rounded-full"></div>
           <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] vertical-text">Scroll To Begin</span>
        </div>
      </section>


      {/* Featured Eras */}
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="w-8 h-1 bg-blue-500"></div>
               <span className="text-blue-500 font-black uppercase tracking-widest text-xs">Cureated Selection</span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-white">Featured Records</h2>
          </div>
          <Link to="/albums" className="group flex items-center gap-3 text-slate-400 font-bold hover:text-blue-400 transition-all">
            Browse the Anthology
            <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white/5 rounded-[3rem] aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredAlbums.map(album => (
              <div key={album._id} className="album-card-wrapper transition-all duration-500 hover:scale-105">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;


