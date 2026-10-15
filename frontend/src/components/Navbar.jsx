import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: '/about', label: 'About' },
    { to: '/albums', label: 'Discography' },
    { to: '/community', label: 'Community' },
  ];

  return (
    <nav className="glass-nav transition-all duration-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="text-xl sm:text-2xl font-black tracking-tighter hover:scale-105 transition-transform duration-500 flex items-center gap-2 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:rotate-12 transition-transform">
              <span className="text-white text-lg sm:text-xl font-serif">S</span>
            </div>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-blue-300 font-black tracking-widest uppercase text-sm sm:text-base">
              SWIFtAY
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-bold text-sm transition-all hover:-translate-y-0.5 ${
                  isActive(link.to) 
                    ? 'text-violet-400' 
                    : 'text-slate-400 hover:text-violet-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none p-2 bg-white/5 rounded-xl border border-white/[0.06]">
              <span className="text-xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-2xl border-b border-white/[0.04] shadow-2xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-bold transition-all ${
                  isActive(link.to)
                    ? 'bg-violet-600/20 text-violet-400 border border-violet-500/20'
                    : 'text-slate-300 hover:bg-white/5 border border-transparent'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
