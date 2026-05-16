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
    // Hero Entrance
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    
    tl.fromTo(".hero-bg", 
      { scale: 1.2, filter: "blur(20px)", opacity: 0 },
      { scale: 1, filter: "blur(0px)", opacity: 0.6, duration: 2.5 }
    )
    .fromTo(titleRef.current.children,
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

    // Parallax on Scroll
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

    // Section Title Animation
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

    // Album Cards Staggered Reveal
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
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="hero-bg absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/hero.jpg')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#050505]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
          
          {/* Animated Glows */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-1.5 mb-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></div>
            <span className="text-[9px] font-black uppercase tracking-[0.6em] text-blue-400">Welcome to SWIFtAY</span>
          </div>
          
          <h1 ref={titleRef} className="flex flex-col items-center mb-10 filter">
            <span className="text-2xl md:text-3xl font-serif italic text-slate-500 mb-2 tracking-widest opacity-80">The Ultimate</span>
            <span className="text-6xl md:text-[9rem] font-black tracking-tighter leading-[0.85] text-white">
              SWIFt<span className="text-transparent bg-clip-text bg-gradient-to-tr from-blue-400 via-indigo-400 to-purple-500">AY</span>
            </span>
            <span className="text-xs md:text-sm font-black uppercase tracking-[1.5em] text-blue-500/60 mt-6 ml-6">E X P E R I E N C E</span>
          </h1>

          <p ref={subtitleRef} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed font-serif italic">
            "In this hub, we don't just listen to the music. We live through the <span className="text-white font-bold not-italic">Eras</span> that defined a generation."
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/albums" className="group px-10 py-4 rounded-full bg-white text-black font-black text-lg hover:bg-blue-500 hover:text-white transition-all duration-500 shadow-2xl transform hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              Explore the Eras
              <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
            
            <Link to="/trivia" className="group px-10 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-all font-black text-lg text-white flex items-center gap-3">
              Enter the Vault
              <svg className="w-5 h-5 text-blue-500 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="w-[1px] h-16 bg-gradient-to-b from-blue-500 to-transparent"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 animate-bounce">Scroll</span>
        </div>
      </section>

      {/* Featured Records Section */}
      <section className="py-32 container mx-auto px-6">
        <div ref={sectionTitleRef} className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="w-12 h-[2px] bg-blue-500"></div>
               <span className="text-blue-500 font-black uppercase tracking-widest text-xs">A Lifetime of Music</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter">Featured Records</h2>
          </div>
          <Link to="/albums" className="group flex items-center gap-4 text-slate-500 font-black hover:text-white transition-all text-lg">
            View All Eras
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500/10 transition-all">
              &rarr;
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white/5 rounded-[3rem] aspect-[3/4] animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {featuredAlbums.map((album, i) => (
              <div key={album._id} className="album-card-reveal">
                <AlbumCard album={album} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;


