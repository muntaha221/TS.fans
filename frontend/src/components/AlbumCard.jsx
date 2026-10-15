import React from 'react';
import { Link } from 'react-router-dom';

const AlbumCard = ({ album }) => {
  return (
    <Link to={`/albums/${album._id}`} className="era-card group block h-full">
      <div className="glass-card overflow-hidden h-full flex flex-col border border-white/[0.04] hover:border-violet-500/30 transition-all duration-500">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={album.coverImage || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=400'}
            alt={album.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            style={{ willChange: 'transform' }}
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 w-full">
               <button className="w-full py-3 bg-white text-black font-black rounded-xl text-sm uppercase tracking-tighter hover:bg-violet-600 hover:text-white transition-colors">
                 Experience Era
               </button>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-xl text-white font-black px-3 py-1 rounded-full text-xs tracking-widest border border-white/[0.06]">
            {new Date(album.releaseDate).getFullYear()}
          </div>
        </div>

        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <h3 className="text-lg sm:text-xl font-black text-white mb-2 group-hover:text-violet-400 transition-colors tracking-tight leading-tight">
            {album.title}
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 mt-auto font-medium leading-relaxed group-hover:text-slate-400 transition-colors">
            {album.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;
