import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import AlbumCard from '../components/AlbumCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);
  const sectionTitleRef = useRef(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await api.get('/albums');
        const data = Array.isArray(res.data) ? res.data : [];
        setFeaturedAlbums(data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching albums:', error);
        setFeaturedAlbums([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

    tl.fromTo(".hero-bg",
      { scale: 1.2, filter: "blur(20px)", opacity: 0 },
      { scale: 1, filter: "blur(0px)", opacity: 0.5, duration: 2.5 }
    )
    .fromTo(titleRef.current?.children || [],
      { y: 50, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, stagger: 0.2 },
      "-=1.8"
    )
    .fromTo(subtitleRef.current,
      { y: 20, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 },
      "-=1"
    )
    .fromTo(buttonsRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );

    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    if (sectionTitleRef.current) {
      gsap.from(sectionTitleRef.current, {
        scrollTrigger: {
          trigger: sectionTitleRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        filter: "blur(10px)",
        duration: 1.2,
        ease: "power3.out"
      });
    }

    gsap.from(".album-card-reveal", {
      scrollTrigger: {
        trigger: ".album-card-reveal",
        start: "top 85%",
      },
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: "power2.out"
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-[#050505] text-white min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[100svh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="hero-bg absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-50"></div>

          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-600/10 blur-[120px] sm:blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-blue-600/10 blur-[120px] sm:blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 mb-8 sm:mb-12 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping"></div>
            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.4em] sm:tracking-[0.6em] text-violet-400">Welcome to SWIFtAY</span>
          </div>

          <h1 ref={titleRef} className="flex flex-col items-center mb-6 sm:mb-10 filter">
            <span className="text-lg sm:text-2xl md:text-3xl font-serif italic text-slate-600 mb-1 sm:mb-2 tracking-widest opacity-80">The Ultimate</span>
            <span className="text-5xl sm:text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white">
              SWIFt<span className="text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 via-blue-400 to-indigo-400">AY</span>
            </span>
            <span className="text-[8px] sm:text-xs md:text-sm font-black uppercase tracking-[0.8em] sm:tracking-[1.5em] text-violet-500/50 mt-3 sm:mt-6 ml-3 sm:ml-6">E X P E R I E N C E</span>
          </h1>

          <p ref={subtitleRef} className="text-sm sm:text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-8 sm:mb-16 font-light leading-relaxed font-serif italic px-4">
            "In this hub, we don't just listen to the music. We live through the <span className="text-white font-bold not-italic">Eras</span> that defined a generation."
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <Link to="/albums" className="group px-6 sm:px-10 py-3 sm:py-4 rounded-full bg-white text-black font-black text-sm sm:text-lg hover:bg-violet-600 hover:text-white transition-all duration-500 shadow-2xl transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              Explore the Eras
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

            <Link to="/albums" className="group px-6 sm:px-10 py-3 sm:py-4 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl hover:bg-white/10 transition-all font-black text-sm sm:text-lg text-white flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center">
              Listen & Lyrics
              <span className="text-violet-400 group-hover:scale-125 transition-transform">🎤</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 sm:gap-4">
          <div className="w-[1px] h-10 sm:h-16 bg-gradient-to-b from-violet-500 to-transparent"></div>
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.4em] text-slate-600 animate-bounce">Scroll</span>
        </div>
      </section>

      {/* Featured Records Section */}
      <section className="py-16 sm:py-32 container mx-auto px-4 sm:px-6">
        <div ref={sectionTitleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-24 gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
               <div className="w-8 sm:w-12 h-[2px] bg-violet-500"></div>
               <span className="text-violet-500 font-black uppercase tracking-widest text-[10px] sm:text-xs">A Lifetime of Music</span>
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter">Featured Records</h2>
          </div>
          <Link to="/albums" className="group flex items-center gap-3 sm:gap-4 text-slate-600 font-black hover:text-white transition-all text-sm sm:text-lg">
            View All Eras
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-violet-500 group-hover:bg-violet-500/10 transition-all">
              &rarr;
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white/[0.03] rounded-2xl aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : featuredAlbums.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12">
            {featuredAlbums.map((album) => (
              <div key={album._id} className="album-card-reveal">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 glass-card">
            <p className="text-slate-500 font-bold text-lg">No albums loaded yet. Check back soon!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
