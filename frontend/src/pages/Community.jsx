import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Community = () => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', favoriteEra: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eras = [
    "Taylor Swift (Debut)", "Fearless", "Speak Now", "Red", "1989",
    "reputation", "Lover", "folklore", "evermore", "Midnights", "The Tortured Poets Department", "Life of a Showgirl"
  ];

  useEffect(() => {
    fetchFans();
  }, []);

  useGSAP(() => {
    if (!loading) {
      gsap.from(".community-card", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out"
      });
    }
    gsap.from(".community-header > *", {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 1,
      ease: "power2.out"
    });
  }, [loading]);

  const fetchFans = async () => {
    try {
      const res = await api.get('/fans');
      const data = Array.isArray(res.data) ? res.data : [];
      setFans(data);
    } catch (error) {
      console.error('Error fetching fans', error);
      setFans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nickname || !formData.favoriteEra || !formData.message) return;

    try {
      setIsSubmitting(true);
      const res = await api.post('/fans', formData);
      setFans([res.data, ...fans]);
      setFormData({ nickname: '', favoriteEra: '', message: '' });
      toast.success("Welcome to the Anthology.", {
        style: { borderRadius: '1rem', background: '#0a0a0a', color: '#fff', border: '1px solid rgba(124,58,237,0.2)' }
      });
    } catch (error) {
      toast.error("Could not sign the wall.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGradient = (index) => {
    const gradients = [
      "from-violet-600/10 to-blue-600/10",
      "from-blue-600/10 to-indigo-600/10",
      "from-indigo-600/10 to-violet-600/10",
      "from-slate-700/20 to-slate-800/20",
      "from-violet-600/10 to-indigo-600/10"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 min-h-screen">

      <div className="text-center mb-12 sm:mb-20 community-header">
        <div className="inline-block px-3 py-1 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 sm:mb-6">
          Global Connection
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-none">
          The Swiftie Network
        </h1>
        <p className="text-base sm:text-xl md:text-2xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
          Leave your mark. Share your story. Connect with the most passionate community in music history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">

        <div className="lg:col-span-1">
          <div className="glass-card p-6 sm:p-10 border border-white/[0.04] lg:sticky lg:top-32">
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 sm:mb-8 tracking-tight">Join the Registry</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Identity</label>
                <input
                  required type="text" maxLength="25" placeholder="LavenderHaze99"
                  value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-bold focus:ring-2 focus:ring-violet-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Defining Era</label>
                <select
                  required value={formData.favoriteEra} onChange={e => setFormData({...formData, favoriteEra: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-bold focus:ring-2 focus:ring-violet-500 outline-none transition-all appearance-none text-sm"
                >
                  <option value="" disabled className="bg-[#0a0a0a]">Select an Era...</option>
                  {eras.map((era, i) => <option key={i} value={era} className="bg-[#0a0a0a]">{era}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-1">Personal Record</label>
                <textarea
                  required maxLength="120" placeholder="Long live all the magic we made..."
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white font-bold min-h-[100px] sm:min-h-[140px] focus:ring-2 focus:ring-violet-500 outline-none transition-all resize-none text-sm"
                ></textarea>
                <div className="text-right text-[10px] text-slate-600 font-black uppercase tracking-widest pr-2">{formData.message.length}/120</div>
              </div>
              <button
                type="submit" disabled={isSubmitting}
                className="w-full py-4 bg-white text-black font-black text-base sm:text-lg rounded-xl hover:bg-violet-600 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign the Wall'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                {[1,2,3,4].map(n => <div key={n} className="h-36 sm:h-48 bg-white/[0.02] rounded-2xl animate-pulse"></div>)}
             </div>
          ) : fans.length === 0 ? (
            <div className="text-center py-20 sm:py-32 glass-card h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-white/[0.03] rounded-full flex items-center justify-center mb-4 border border-white/[0.06]">
                <span className="text-3xl">🤍</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 sm:mb-4">A Blank Space</h3>
              <p className="text-slate-600 font-bold max-w-xs leading-relaxed text-sm">The wall is completely empty. Write your name and start the legacy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 auto-rows-max">
              {fans.map((fan, index) => (
                <div key={fan._id} className={`community-card p-6 sm:p-10 rounded-2xl glass-card border border-white/[0.04] bg-gradient-to-br ${getGradient(index)} backdrop-blur-3xl group transition-all duration-500 hover:scale-[1.02] hover:border-violet-500/20`}>
                   <div className="flex justify-between items-start mb-4 sm:mb-6">
                     <div>
                       <h3 className="text-lg sm:text-2xl font-black text-white mb-1 sm:mb-2 tracking-tight group-hover:text-violet-400 transition-colors">{fan.nickname}</h3>
                       <span className="inline-block px-3 py-1 bg-white/[0.06] backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 border border-white/[0.04] shadow-inner">
                         {fan.favoriteEra}
                       </span>
                     </div>
                   </div>
                   <p className="text-sm sm:text-lg font-medium leading-relaxed italic text-white/70">
                     "{fan.message}"
                   </p>
                   <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.04] flex justify-end">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                        {new Date(fan.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
