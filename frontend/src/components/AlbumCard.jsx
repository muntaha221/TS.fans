import React from 'react';
import { Link } from 'react-router-dom';

const AlbumCard = ({ album }) => {
  return (
    <Link to={`/albums/${album._id}`} className="era-card group block h-full">
      <div className="glass-card overflow-hidden h-full flex flex-col border border-white/5 hover:border-pink-500/30 transition-all duration-500">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={album.coverImage || 'https://via.placeholder.com/400'} 
            alt={album.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
            <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 w-full">
               <button className="w-full py-3 bg-white text-black font-black rounded-xl text-sm uppercase tracking-tighter hover:bg-pink-500 hover:text-white transition-colors">
                 Experience Era
               </button>
            </div>
          </div>

          <div className="absolute top-5 right-5 bg-black/60 backdrop-blur-xl text-white font-black px-4 py-1.5 rounded-full text-xs tracking-widest border border-white/10">
            {new Date(album.releaseDate).getFullYear()}
          </div>
        </div>

        <div className="p-8 flex flex-col flex-grow">
          <h3 className="text-2xl font-black text-white mb-3 group-hover:text-pink-500 transition-colors tracking-tight leading-tight">
            {album.title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-2 mt-auto font-medium leading-relaxed group-hover:text-slate-300 transition-colors">
            {album.description}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default AlbumCard;

