import React from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const About = () => {
  useGSAP(() => {
    gsap.from(".about-content > *", {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen about-content">
      <div className="max-w-5xl mx-auto space-y-16">
        
        <div className="text-center relative py-24 px-10 rounded-[4rem] bg-slate-900 shadow-2xl overflow-hidden border border-white/5">
          {/* Animated Background Elements */}
          <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-pink-500/10 blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter relative z-10 leading-none">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Legend</span> Of Taylor
          </h1>
          <p className="text-2xl text-slate-400 font-bold tracking-wide relative z-10 max-w-2xl mx-auto">
            Singer. Songwriter. Visionary. The Architect of Modern Pop.
          </p>
        </div>

        <div className="relative rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 group h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1549834125-82d3c48159a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="Concert stage" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
          />
          <div className="absolute bottom-12 left-12 z-20">
             <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-1 px-4 bg-pink-500"></div>
                <span className="font-black text-xs uppercase tracking-[0.3em]">Era Tour Mainstage</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-300 leading-relaxed font-medium text-lg">
          <div className="space-y-8">
            <p className="first-letter:text-7xl first-letter:font-black first-letter:text-pink-500 first-letter:mr-3 first-letter:float-left">
              Taylor Alison Swift (born December 13, 1989) is an American singer-songwriter. Recognized for her songwriting,
              musical versatility, artistic reinventions, and influence on the music industry, she is a prominent cultural
              figure of the 21st century.
            </p>
            <p>
              Swift began professional songwriting at age 14 and signed with Big Machine Records in 2005 to become a country
              singer. Under Big Machine, she released six studio albums, four of them to country radio, starting with her
              self-titled album (2006).
            </p>
          </div>
          <div className="space-y-8">
            <div className="bg-white/5 border-l-4 border-pink-500 p-8 rounded-r-3xl backdrop-blur-sm">
              <p className="text-2xl font-bold text-white italic m-0">
                "No matter what happens in life, be good to people. Being good to people is a wonderful legacy to leave behind."
              </p>
            </div>
            <p>
              She forwent her country image with 1989 (2014), a synth-pop album supported by the chart-topping songs "Shake
              It Off", "Blank Space", and "Bad Blood". Emancipating from Big Machine, Swift signed with Republic
              Records in 2018 and released the pop album Lover (2019).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

