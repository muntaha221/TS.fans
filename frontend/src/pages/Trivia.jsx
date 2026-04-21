import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import { useGSAP } from '@gsap/react';

const questions = [
  { q: 'Which era is this lyric from: "I knew you were trouble when you walked in"?', a: 'Red', opts: ['Fearless', 'Red', '1989', 'Lover'] },
  { q: 'In which era did she notoriously delete her entire social media history?', a: 'reputation', opts: ['1989', 'reputation', 'Midnights', 'folklore'] },
  { q: 'Which of these songs belongs to the "Life of a Show Girl" conceptual era?', a: 'Cancelled', opts: ['Style', 'Blank Space', 'Cancelled', 'Delicate'] },
  { q: 'Which era was created entirely during isolation and heavily features indie-folk?', a: 'folklore', opts: ['evermore', 'folklore', 'Red', 'Speak Now'] },
  { q: 'What is the track "All Too Well" famous for?', a: 'A 10-Minute Version', opts: ['A 10-Minute Version', 'A Rap Verse', 'A Heavy Metal Remix', 'Being her debut song'] }
];

const Trivia = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); // start, playing, end
  const [nickname, setNickname] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  
  const containerRef = useRef(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [gameState]);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get('/scores');
      setLeaderboard(res.data);
    } catch(err) {
      console.log('Error fetching leaderboard');
    }
  };

  useGSAP(() => {
    gsap.from(".trivia-header > *", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  const startGame = () => {
    if (!nickname.trim()) { 
      toast.error("Identify yourself, Swiftie!", {
        style: { borderRadius: '1rem', background: '#1e293b', color: '#fff' }
      }); 
      return; 
    }
    setGameState('playing');
    gsap.fromTo(containerRef.current, {scale: 0.9, opacity:0, y: 30}, {scale: 1, opacity: 1, y:0, duration: 0.6, ease: "back.out(1.7)"});
  };

  const handleAnswer = (selected) => {
    const isCorrect = selected === questions[currentQ].a;
    
    // GSAP Feedback animation
    if(isCorrect) {
      setScore(prev => prev + 10);
      gsap.to(containerRef.current, { scale: 1.02, duration: 0.2, backgroundColor: "rgba(34, 197, 94, 0.1)", yoyo: true, repeat: 1 });
    } else {
      gsap.to(containerRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.4, backgroundColor: "rgba(239, 68, 68, 0.1)" });
    }

    setTimeout(() => {
      gsap.to(containerRef.current, { backgroundColor: "" }); 
      if(currentQ + 1 < questions.length) {
        setCurrentQ(prev => prev + 1);
        gsap.fromTo(containerRef.current, {opacity:0, x: 20}, {opacity:1, x:0, duration:0.4});
      } else {
        endGame(score + (isCorrect ? 10 : 0));
      }
    }, 600);
  };

  const endGame = async (finalScore) => {
    try {
      await api.post('/scores', { nickname, score: finalScore });
      toast.success("Legacy recorded on the wall.");
    } catch(err){
      toast.error("The vault is currently sealed.");
    }
    setGameState('end');
    gsap.fromTo(containerRef.current, {y: 50, opacity:0}, {y: 0, opacity:1, duration: 1, ease: 'power3.out'});
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16 trivia-header">
        <div className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
          The Vault Challenge
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none">Eras Pop Quiz</h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          Prove your encyclopedic knowledge of Taylor's discography. Only the truest masters will survive.
        </p>
      </div>

      <div ref={containerRef} className="max-w-3xl mx-auto glass-card p-10 md:p-16 border border-white/5 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        {gameState === 'start' && (
          <div className="text-center space-y-10">
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 group-hover:scale-110 transition-transform">
               <svg className="w-10 h-10 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                 <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                 <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
               </svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-white tracking-tight">Ready for it?</h2>
              <p className="text-slate-400 font-medium">Enter your nickname to establish your rank.</p>
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <input 
                type="text" 
                maxLength="15"
                placeholder="What should we call you?" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-center font-black text-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all placeholder:text-slate-600"
              />
              <button onClick={startGame} className="w-full bg-white text-black font-black py-5 rounded-2xl hover:bg-pink-500 hover:text-white transition-all text-xl shadow-xl shadow-white/5 active:scale-95">
                START SESSION
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="space-y-12">
             <div className="flex justify-between items-center px-2">
                <div className="bg-pink-500/10 px-4 py-2 rounded-xl border border-pink-500/20">
                  <span className="text-pink-500 font-black text-xs uppercase tracking-widest">Question {currentQ + 1} / {questions.length}</span>
                </div>
                <div className="text-white font-black text-xl">Score: <span className="text-pink-500">{score}</span></div>
             </div>

             <h2 className="text-3xl md:text-4xl font-black text-white leading-tight text-center tracking-tight px-4">
               {questions[currentQ].q}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {questions[currentQ].opts.map(opt => (
                 <button 
                   key={opt}
                   onClick={() => handleAnswer(opt)}
                   className="py-6 px-8 bg-white/5 border border-white/5 rounded-2xl font-black text-slate-300 hover:border-pink-500 hover:bg-white/10 hover:text-white transition-all text-lg text-left group"
                 >
                   <span className="opacity-40 group-hover:text-pink-500 transition-colors mr-3">•</span>
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        )}

        {gameState === 'end' && (
          <div className="text-center space-y-8">
            <h2 className="text-4xl font-black text-white tracking-tight">Challenge Concluded</h2>
            
            <div className="relative inline-block">
               <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full"></div>
               <div className="text-8xl font-black text-white relative z-10 px-8 py-4">
                 {score} <span className="text-3xl text-slate-500 uppercase">pts</span>
               </div>
            </div>

            <p className="text-2xl font-bold text-slate-400 max-w-md mx-auto leading-relaxed">
              {score === 50 ? "Absolute Perfection. A True Mastermind. 👑" : score >= 30 ? "Impressive Knowledge. You are an Era Expert. 🌟" : "You might need to study the anthology a bit more. 📖"}
            </p>

            <button 
              onClick={() => {setCurrentQ(0); setScore(0); setGameState('start');}}
              className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-pink-500 hover:text-white transition-all text-xl shadow-xl active:scale-95"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {gameState !== 'playing' && (
        <div className="mt-24">
          <div className="flex items-center gap-6 mb-12 trivia-header">
             <h2 className="text-4xl font-black text-white">Wall of Legends</h2>
             <div className="h-1 flex-grow bg-white/5 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 trivia-header">
            {leaderboard.length === 0 ? (
              <div className="col-span-full p-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                 <p className="text-slate-500 font-bold text-xl">The registry is currently empty.</p>
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <div key={entry._id} className="bg-white/5 border border-white/5 hover:bg-white/10 p-6 rounded-3xl flex justify-between items-center transition-all group backdrop-blur-xl">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 flex justify-center items-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white font-black text-lg shadow-xl shadow-pink-500/10 group-hover:rotate-6 transition-transform">
                      {index + 1}
                    </div>
                    <span className="font-black text-white text-xl group-hover:text-pink-400 transition-colors uppercase tracking-tight">{entry.nickname}</span>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="font-black text-pink-500 text-2xl tracking-tighter">{entry.score}</span>
                     <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Points</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Trivia;

