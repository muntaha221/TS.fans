import React, { useState, useEffect, useRef } from 'react';
import api from '../api';
import gsap from 'gsap';
import toast from 'react-hot-toast';
import { useGSAP } from '@gsap/react';

const questionPool = [
  { q: 'Which era is this lyric from: "I knew you were trouble when you walked in"?', a: 'Red', opts: ['Fearless', 'Red', '1989', 'Lover'] },
  { q: 'In which era did she notoriously delete her entire social media history?', a: 'reputation', opts: ['1989', 'reputation', 'Midnights', 'folklore'] },
  { q: 'Which era was created entirely during isolation and heavily features indie-folk?', a: 'folklore', opts: ['evermore', 'folklore', 'Red', 'Speak Now'] },
  { q: 'What is the track "All Too Well" famous for?', a: 'A 10-Minute Version', opts: ['A 10-Minute Version', 'A Rap Verse', 'A Heavy Metal Remix', 'Being her debut song'] },
  { q: "What is Taylor's lucky number?", a: '13', opts: ['22', '13', '1989', '89'] },
  { q: "Which was the first 'Taylor's Version' album released?", a: 'Fearless', opts: ['Red', 'Fearless', 'Speak Now', '1989'] },
  { q: "Which song features the iconic line: 'Darling, I'm a nightmare dressed like a daydream'?", a: 'Blank Space', opts: ['Style', 'Blank Space', 'Bad Blood', 'Wildest Dreams'] },
  { q: "Which 2022 album is inspired by '13 sleepless nights'?", a: 'Midnights', opts: ['Lover', 'Folklore', 'Midnights', 'Evermore'] },
  { q: "How many Album of the Year Grammys has Taylor won (as of 2024)?", a: '4', opts: ['2', '3', '4', '5'] },
  { q: "Which song is widely believed to be about her hometown roots?", a: 'Tim McGraw', opts: ['The Best Day', 'Tim McGraw', 'Mean', 'Mine'] }
];

const Trivia = () => {
  const [questions, setQuestions] = useState([]);
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

  const shuffleQuestions = () => {
    const shuffled = [...questionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5); // Pick 5 random questions for each session
    setQuestions(shuffled);
  };

  const startGame = () => {
    if (!nickname.trim()) { 
      toast.error("Identify yourself, Swiftie!", {
        style: { borderRadius: '1rem', background: '#1e293b', color: '#fff' }
      }); 
      return; 
    }
    shuffleQuestions();
    setCurrentQ(0);
    setScore(0);
    setGameState('playing');
    gsap.fromTo(containerRef.current, {scale: 0.9, opacity:0, y: 30}, {scale: 1, opacity: 1, y:0, duration: 0.6, ease: "back.out(1.7)"});
  };

  const handleAnswer = (selected) => {
    const isCorrect = selected === questions[currentQ].a;
    
    if(isCorrect) {
      setScore(prev => prev + 20); // More points per question
      gsap.to(containerRef.current, { scale: 1.02, duration: 0.2, backgroundColor: "rgba(34, 197, 94, 0.1)", yoyo: true, repeat: 1 });
      toast.success("Spot on!", { duration: 1000 });
    } else {
      gsap.to(containerRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.4, backgroundColor: "rgba(239, 68, 68, 0.1)" });
      toast.error(`The correct answer was ${questions[currentQ].a}`, { duration: 1500 });
    }

    setTimeout(() => {
      gsap.to(containerRef.current, { backgroundColor: "" }); 
      if(currentQ + 1 < questions.length) {
        setCurrentQ(prev => prev + 1);
        gsap.fromTo(containerRef.current, {opacity:0, x: 20}, {opacity:1, x:0, duration:0.4});
      } else {
        endGame(score + (isCorrect ? 20 : 0));
      }
    }, 800);
  };

  const endGame = async (finalScore) => {
    try {
      await api.post('/scores', { nickname, score: finalScore });
    } catch(err){
      console.log("Could not save score");
    }
    setGameState('end');
    gsap.fromTo(containerRef.current, {y: 50, opacity:0}, {y: 0, opacity:1, duration: 1, ease: 'power3.out'});
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-[0.3em] mb-6 animate-pulse">
          Live Connection Established
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-none italic">
          Mastermind <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-500">Arena</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
          The ultimate live trivia battlefield. Every session is unique. Are you a true Era Expert?
        </p>
      </div>

      <div ref={containerRef} className="max-w-3xl mx-auto glass-card p-10 md:p-16 border border-white/5 relative overflow-hidden backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
        
        {gameState === 'start' && (
          <div className="text-center space-y-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl rotate-3 hover:rotate-6 transition-transform cursor-help">
               <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-5xl font-black text-white tracking-tight leading-tight">Ready for <span className="text-pink-500">it?</span></h2>
              <p className="text-slate-400 font-bold text-lg uppercase tracking-widest">Connect your Swiftie ID to begin</p>
            </div>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
              <input 
                type="text" 
                maxLength="15"
                placeholder="NICKNAME / ERA ID" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white text-center font-black text-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 uppercase tracking-widest"
              />
              <button onClick={startGame} className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-black py-5 rounded-2xl hover:brightness-110 transition-all text-xl shadow-2xl shadow-blue-500/20 active:scale-95">
                ENTER ARENA
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && questions.length > 0 && (
          <div className="space-y-12">
             <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-blue-400 font-black text-xs uppercase tracking-widest mb-1">Challenge Progress</span>
                  <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                  <span className="text-slate-500 font-black text-[10px] uppercase block leading-none mb-1">Live Score</span>
                  <span className="text-white font-black text-3xl tracking-tighter">{score}</span>
                </div>
             </div>

             <h2 className="text-3xl md:text-5xl font-black text-white leading-tight text-center tracking-tight px-4 min-h-[120px] flex items-center justify-center">
               {questions[currentQ].q}
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {questions[currentQ].opts.map((opt, i) => (
                 <button 
                   key={opt}
                   onClick={() => handleAnswer(opt)}
                   className="py-6 px-8 bg-white/5 border border-white/5 rounded-2xl font-black text-slate-300 hover:border-blue-500 hover:bg-white/10 hover:text-white transition-all text-xl text-left group relative overflow-hidden"
                 >
                   <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="text-blue-500/30 font-black mr-4">{i + 1}.</span>
                   {opt}
                 </button>
               ))}
             </div>
          </div>
        )}

        {gameState === 'end' && (
          <div className="text-center space-y-8">
            <div className="inline-block p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-black uppercase tracking-widest mb-4">
              Mission Successful
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">Arena Cleared</h2>
            
            <div className="relative inline-block my-4">
               <div className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"></div>
               <div className="text-9xl font-black text-white relative z-10 px-8 py-4 tracking-tighter">
                 {score}
               </div>
               <div className="text-blue-400 font-black text-xl uppercase tracking-[0.3em] mt-[-20px]">Points Gained</div>
            </div>

            <p className="text-2xl font-bold text-slate-400 max-w-md mx-auto leading-relaxed">
              {score >= 80 ? "Absolute Perfection. A True Mastermind. 👑" : score >= 60 ? "Impressive Knowledge. You are an Era Expert. 🌟" : "You might need to study the anthology a bit more. 📖"}
            </p>

            <button 
              onClick={() => {setGameState('start');}}
              className="bg-white text-black font-black px-12 py-5 rounded-2xl hover:bg-blue-500 hover:text-white transition-all text-xl shadow-xl active:scale-95 mt-6"
            >
              RE-ENTER ARENA
            </button>
          </div>
        )}
      </div>

      {gameState !== 'playing' && (
        <div className="mt-24">
          <div className="flex items-center gap-6 mb-12">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none italic">Hall of <span className="text-pink-500">Fame</span></h2>
             <div className="h-0.5 flex-grow bg-gradient-to-r from-white/10 to-transparent rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leaderboard.length === 0 ? (
              <div className="col-span-full p-16 text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                 <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">Registry offline...</p>
              </div>
            ) : (
              leaderboard.slice(0, 9).map((entry, index) => (
                <div key={entry._id} className="bg-white/5 border border-white/5 hover:border-blue-500/30 p-8 rounded-[2rem] flex justify-between items-center transition-all group backdrop-blur-3xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-3xl font-black text-slate-700 italic group-hover:text-blue-500 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <span className="font-black text-white text-2xl group-hover:text-blue-400 transition-colors uppercase tracking-tighter block leading-none mb-1">{entry.nickname}</span>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Swiftie ID Verified</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                     <span className="font-black text-blue-500 text-3xl tracking-tighter leading-none">{entry.score}</span>
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
