import React, { useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const journeyData = [
  {
    year: "2006",
    title: "The Country Beginnings",
    desc: "At just 16, Taylor released her self-titled debut album. With hits like 'Tim McGraw' and 'Teardrops on My Guitar', she established herself as a country music prodigy, writing her own songs with incredible narrative detail."
  },
  {
    year: "2008",
    title: "Fearless & Mainstream Success",
    desc: "Fearless catapulted her to global superstardom. Winning Album of the Year at the Grammys, it featured iconic anthems like 'Love Story' and 'You Belong With Me', bridging the gap between country and pop."
  },
  {
    year: "2014",
    title: "1989 & The Pop Era",
    desc: "A complete sonic reinvention. 1989 was her first officially documented pop album. It broke records, won Album of the Year, and dominated culture with 'Shake It Off', 'Blank Space', and 'Bad Blood'."
  },
  {
    year: "2020",
    title: "Folklore & Evermore",
    desc: "During the pandemic, Taylor surprised the world with two sister albums. Moving into indie-folk, she proved her unparalleled songwriting versatility and won her third Album of the Year Grammy."
  },
  {
    year: "2023",
    title: "The Eras Tour",
    desc: "A culmination of her entire discography. The Eras Tour became the highest-grossing tour in history, a cultural phenomenon celebrating every musical phase of her unparalleled career."
  }
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(() => {
    gsap.from(".about-content > *", {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  // Animate text change
  useGSAP(() => {
    gsap.fromTo(".journey-text", 
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    );
  }, [activeIndex]);

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen about-content">
      <div className="max-w-6xl mx-auto space-y-16">
        
        <div className="text-center relative py-24 px-10 rounded-[4rem] bg-slate-900 shadow-2xl overflow-hidden border border-white/5">
          {/* Animated Background Elements */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-500/10 blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter relative z-10 leading-none">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Legend</span> Of Taylor
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-bold tracking-wide relative z-10 max-w-3xl mx-auto">
            Singer. Songwriter. Visionary. The Architect of Modern Pop.
          </p>
        </div>

        <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group h-[500px] md:h-[700px]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent z-10"></div>
          <img 
            src="/about_hero.png" 
            alt="Taylor Swift on stage" 
            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
          />
          <div className="absolute bottom-12 left-6 md:left-12 z-20">
             <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-1 px-4 bg-pink-500"></div>
                <span className="font-black text-xs uppercase tracking-[0.3em]">Era Tour Mainstage</span>
             </div>
          </div>
        </div>

        {/* Interactive Journey Timeline */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-16 backdrop-blur-md mt-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 text-center tracking-tighter">
            Her Musical Journey
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Timeline Buttons */}
            <div className="w-full lg:w-1/3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-4 pb-4 lg:pb-0 hide-scrollbar">
              {journeyData.map((item, idx) => (
                <button
                  key={item.year}
                  onClick={() => setActiveIndex(idx)}
                  className={`flex-shrink-0 text-left px-8 py-5 rounded-3xl transition-all duration-300 border ${
                    activeIndex === idx 
                      ? 'bg-pink-500/20 border-pink-500 text-white shadow-[0_0_30px_rgba(236,72,153,0.3)]' 
                      : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`text-sm font-black tracking-widest mb-1 ${activeIndex === idx ? 'text-pink-400' : 'text-slate-500'}`}>
                    {item.year}
                  </div>
                  <div className="font-bold text-lg">{item.title}</div>
                </button>
              ))}
            </div>

            {/* Timeline Content */}
            <div className="w-full lg:w-2/3 bg-slate-900/50 rounded-[2rem] p-8 md:p-12 border border-white/5 journey-text h-full min-h-[300px] flex flex-col justify-center">
              <div className="inline-flex items-center gap-3 mb-6">
                 <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                 <span className="text-pink-500 font-black tracking-widest uppercase">{journeyData[activeIndex].year}</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter">
                {journeyData[activeIndex].title}
              </h3>
              <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-serif">
                {journeyData[activeIndex].desc}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;


