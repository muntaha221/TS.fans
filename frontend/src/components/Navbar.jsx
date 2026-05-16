import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Force dark mode as default for the premium look
    document.documentElement.classList.add('dark');
    setIsDarkMode(true);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="glass-nav transition-all duration-500">
      <div className="container mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <Link to="/" className="text-3xl font-black tracking-tighter hover:scale-105 transition-transform duration-500 flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] group-hover:rotate-12 transition-transform">
              <span className="text-white text-2xl font-serif">S</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-slate-400 font-black tracking-widest uppercase">
              SWIFtAY
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-10">
            <Link to="/about" className="text-slate-300 hover:text-pink-400 font-bold transition-all hover:-translate-y-0.5">About</Link>
            <Link to="/albums" className="text-slate-300 hover:text-pink-400 font-bold transition-all hover:-translate-y-0.5">Discography</Link>
            <Link to="/community" className="text-slate-300 hover:text-pink-400 font-bold transition-all hover:-translate-y-0.5">Community</Link>
            <Link to="/trivia" className="text-slate-300 hover:text-pink-400 font-bold transition-all hover:-translate-y-0.5">Trivia</Link>
            
            <Link to="/admin" className="px-7 py-3 rounded-full font-black bg-white text-black hover:bg-pink-500 hover:text-white transition-all shadow-xl hover:shadow-pink-500/40 transform hover:-translate-y-1">
              Admin
            </Link>
            
            <button onClick={toggleDarkMode} className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-300">
              {isDarkMode ? '🌙' : '🌞'}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-4">
             <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              {isDarkMode ? '🌙' : '🌞'}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none p-2 bg-white/5 rounded-xl border border-white/10">
              <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-white/5 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-4 pb-10 space-y-4">
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-2xl text-xl font-bold text-slate-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">About</Link>
            <Link to="/albums" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-2xl text-xl font-bold text-slate-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">Discography</Link>
            <Link to="/community" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-2xl text-xl font-bold text-slate-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">Community</Link>
            <Link to="/trivia" onClick={() => setIsMenuOpen(false)} className="block px-4 py-4 rounded-2xl text-xl font-bold text-slate-300 hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">Trivia</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-6 py-5 rounded-2xl text-xl font-black bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl shadow-pink-500/20">Admin Panel</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

