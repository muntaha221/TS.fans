import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.04] mt-12 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400 tracking-tighter">SWIFtAY</span>
            <p className="text-slate-500 mt-2 text-sm max-w-sm text-center md:text-left">
              The ultimate destination for Taylor Swift fans. Explore albums, listen to songs, and connect with the community.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link to="/" className="text-slate-500 hover:text-violet-400 transition-colors text-sm font-bold">Home</Link>
            <Link to="/about" className="text-slate-500 hover:text-violet-400 transition-colors text-sm font-bold">About</Link>
            <Link to="/albums" className="text-slate-500 hover:text-violet-400 transition-colors text-sm font-bold">Discography</Link>
          </div>
        </div>
        <div className="mt-8 border-t border-white/[0.04] pt-8 flex justify-center">
          <p className="text-slate-600 text-xs">
            &copy; {new Date().getFullYear()} SWIFtAY — Built for fans, by fans.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
