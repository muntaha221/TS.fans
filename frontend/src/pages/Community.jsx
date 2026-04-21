import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import LiveChat from '../components/LiveChat';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Community = () => {
  const [fans, setFans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ nickname: '', favoriteEra: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eras = [
    "Taylor Swift (Debut)", "Fearless", "Speak Now", "Red", "1989", 
    "reputation", "Lover", "folklore", "evermore", "Midnights", "The Tortured Poets Department"
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
      setFans(res.data);
    } catch (error) {
      console.error('Error fetching fans', error);
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
        style: { borderRadius: '1rem', background: '#1e293b', color: '#fff' }
      });
    } catch (error) {
      toast.error("The vault is currently sealed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getGradient = (index) => {
    const gradients = [
      "from-pink-500/20 to-purple-600/20",
      "from-blue-500/20 to-indigo-600/20",
      "from-amber-500/20 to-orange-600/20",
      "from-emerald-500/20 to-teal-600/20",
      "from-fuchsia-500/20 to-rose-600/20"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      
      <div className="text-center mb-20 community-header">
        <div className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
          Global Connection
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">
          The Swiftie Network
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Leave your mark. Share your story. Connect with the most passionate community in music history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        
        <div className="lg:col-span-1">
          <div className="glass-card p-10 border border-white/5 sticky top-32">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Join the Registry</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Identity</label>
                <input 
                  required type="text" maxLength="25" placeholder=" LavenderHaze99"
                  value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:ring-2 focus:ring-pink-500 outline-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Defining Era</label>
                <select 
                  required value={formData.favoriteEra} onChange={e => setFormData({...formData, favoriteEra: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold focus:ring-2 focus:ring-pink-500 outline-none transition-all appearance-none"
                >
                  <option value="" disabled className="bg-slate-900">Select an Era...</option>
                  {eras.map((era, i) => <option key={i} value={era} className="bg-slate-900">{era}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Personal Record</label>
                <textarea 
                  required maxLength="120" placeholder="Long live all the magic we made..."
                  value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold min-h-[140px] focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none"
                ></textarea>
                <div className="text-right text-[10px] text-slate-600 font-black uppercase tracking-widest pr-2">{formData.message.length}/120</div>
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full py-5 bg-white text-black font-black text-xl rounded-2xl hover:bg-pink-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-30"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign the Wall'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1,2,3,4].map(n => <div key={n} className="h-48 bg-white/5 rounded-[2.5rem] animate-pulse"></div>)}
             </div>
          ) : fans.length === 0 ? (
            <div className="text-center py-32 glass-card h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                <span className="text-4xl text-pink-500">🤍</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-4">A Blank Space</h3>
              <p className="text-slate-500 font-bold max-w-xs leading-relaxed">The wall is completely empty. Write your name and start the legacy.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 auto-rows-max">
              {fans.map((fan, index) => (
                <div key={fan._id} className={`community-card p-10 rounded-[2.5rem] glass-card border border-white/5 bg-gradient-to-br ${getGradient(index)} backdrop-blur-3xl group transition-all duration-500 hover:scale-105`}>
                   <div className="flex justify-between items-start mb-6">
                     <div>
                       <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-pink-400 transition-colors">{fan.nickname}</h3>
                       <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 border border-white/5 shadow-inner">
                         {fan.favoriteEra}
                       </span>
                     </div>
                   </div>
                   <p className="text-xl font-medium leading-relaxed italic text-white/80">
                     "{fan.message}"
                   </p>
                   <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {new Date(fan.createdAt).toLocaleDateString()}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-32 max-w-4xl mx-auto community-header">
         <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black text-white">Live Conversation</h2>
            <div className="h-1 flex-grow bg-white/5 rounded-full"></div>
         </div>
         <LiveChat />
      </div>

    </div>
  );
};

export default Community;

