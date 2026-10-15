import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [albums, setAlbums] = useState([]);
  const [activeTab, setActiveTab] = useState('songs');
  const [loading, setLoading] = useState(true);

  // Form states
  const [albumFormData, setAlbumFormData] = useState({ 
    title: '', 
    releaseDate: '', 
    coverImage: '', 
    description: '' 
  });
  
  const [songFormData, setSongFormData] = useState({ 
    title: '', 
    albumId: '', 
    duration: '',
    previewUrl: '',
    lyrics: ''
  });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/albums');
      setAlbums(res.data);
      if (res.data.length > 0 && !songFormData.albumId) {
        setSongFormData(prev => ({ ...prev, albumId: res.data[0]._id }));
      }
    } catch (error) {
      toast.error('Failed to fetch albums');
    } finally {
      setLoading(false);
    }
  };

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/albums', albumFormData);
      toast.success('Era created successfully!');
      setAlbumFormData({ title: '', releaseDate: '', coverImage: '', description: '' });
      fetchAlbums();
    } catch (error) {
       toast.error('Failed to create era');
    }
  };

  const handleSongSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/songs', songFormData);
      toast.success(`Track "${songFormData.title}" successfully published to the Vault! ✨`, {
        icon: '🎵',
        duration: 4000
      });
      setSongFormData({ ...songFormData, title: '', duration: '', previewUrl: '', lyrics: '' }); 
      fetchAlbums();
    } catch (error) {
       toast.error('Failed to add track');
    }
  };

  const loadPatientZeroPreset = () => {
    // Find Showgirl or TTPD album or first album
    const target = albums.find(a => a.title.includes('Showgirl') || a.title.includes('Poets')) || albums[0];
    setSongFormData({
      title: 'Patient Zero',
      albumId: target ? target._id : '',
      duration: '3:42',
      previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/0e/73/ed0e73df-8ac0-cc4d-c683-62989356fabe/mzaf_5570843588806201632.plus.aac.p.m4a',
      lyrics: `[Verse 1]\nThey called me the contagion in a room full of glass\nCounting down the seconds till the fever would pass\nI was patient zero, waiting in line\nSwallowing the poison and calling it wine\n\n[Chorus]\nOh, you watched the symptoms start to show\nSaid I was dangerous, said I was Patient Zero\nYou built your walls up ten feet high\nLeft me in quarantine under the pale blue sky\nNow the antidote is slipping through your hands\nAnd you will never understand\n\n[Verse 2]\nSterile white corridors, cold white lights\nI wrote my revolutions in the middle of the night...`
    });
    toast('Loaded "Patient Zero" template! Click Publish to add it.', { icon: '✨' });
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500 px-4">
      
      <div className="p-8 md:p-12 mb-12 bg-gradient-to-r from-pink-800 via-purple-900 to-indigo-950 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-pink-300 text-xs font-black uppercase tracking-widest mb-4">
            Curator Console
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">Expand the Anthology</h1>
          <p className="text-lg md:text-xl font-medium text-pink-100 leading-relaxed">
            Add new songs like <strong className="text-white underline">Patient Zero</strong>, attach full lyrics, link audio previews, or release brand new Eras directly into the live discography!
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 bg-white/5 p-2 rounded-2xl border border-white/10 w-fit">
        <button 
          onClick={() => setActiveTab('songs')}
          className={`px-8 py-3 font-black text-base md:text-lg rounded-xl transition-all duration-300 ${activeTab === 'songs' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Add Tracks & Lyrics
        </button>
        <button 
          onClick={() => setActiveTab('albums')}
          className={`px-8 py-3 font-black text-base md:text-lg rounded-xl transition-all duration-300 ${activeTab === 'albums' ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          Create New Era
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {activeTab === 'songs' ? (
          <>
            <div className="bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-black text-white">Add New Track</h2>
                <button 
                  type="button"
                  onClick={loadPatientZeroPreset}
                  className="px-4 py-1.5 rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white transition-all text-xs font-black border border-pink-500/30"
                >
                  Load "Patient Zero" Preset
                </button>
              </div>

              <form onSubmit={handleSongSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Target Album / Era</label>
                  <select 
                    required 
                    value={songFormData.albumId} 
                    onChange={e => setSongFormData({...songFormData, albumId: e.target.value})} 
                    className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                     <option value="" disabled className="bg-slate-900">Select an Album...</option>
                     {albums.map(album => (
                       <option key={album._id} value={album._id} className="bg-slate-900">{album.title}</option>
                     ))}
                  </select>
                </div>

                <div>
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Track Title</label>
                   <input 
                    required 
                    type="text" 
                    placeholder="e.g. Patient Zero"
                    value={songFormData.title} 
                    onChange={e => setSongFormData({...songFormData, title: e.target.value})} 
                    className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g. 3:42"
                      value={songFormData.duration} 
                      onChange={e => setSongFormData({...songFormData, duration: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Audio Preview URL</label>
                    <input 
                      type="url" 
                      placeholder="https://... (optional)"
                      value={songFormData.previewUrl} 
                      onChange={e => setSongFormData({...songFormData, previewUrl: e.target.value})} 
                      className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Full Lyrics Manuscript</label>
                  <textarea 
                    rows="6"
                    placeholder="[Verse 1]&#10;Type or paste full track lyrics here..."
                    value={songFormData.lyrics} 
                    onChange={e => setSongFormData({...songFormData, lyrics: e.target.value})} 
                    className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-mono text-sm leading-relaxed focus:ring-2 focus:ring-pink-500 focus:outline-none resize-none" 
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-lg rounded-xl hover:opacity-90 transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                >
                  Publish Track to Vault
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-6">
              <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 font-black text-xl border border-pink-500/30">
                    🎵
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Full Discography Integration</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Live & Instant</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Every track you add is instantly integrated into the music player, lyrics viewer, and discography tracklist. Even if offline or deployed on Vercel, the Vault is completely unlocked!
                </p>
              </div>

              <div className="p-8 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl border border-white/10">
                <h4 className="text-sm font-black text-pink-400 uppercase tracking-widest mb-3">
                  Currently Loaded Eras ({albums.length})
                </h4>
                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {albums.map(album => (
                    <div key={album._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <img src={album.coverImage} alt={album.title} className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-sm font-black text-white">{album.title}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{album.songs?.length || 0} tracks</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-pink-400">
                        {new Date(album.releaseDate).getFullYear() || 'Vault'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-slate-900/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-xl border border-white/10">
              <h2 className="text-3xl font-black mb-8 text-white">Create New Era</h2>
              <form onSubmit={handleAlbumSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Album Title</label>
                  <input required type="text" value={albumFormData.title} onChange={e => setAlbumFormData({...albumFormData, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Release Date</label>
                  <input required type="date" value={albumFormData.releaseDate} onChange={e => setAlbumFormData({...albumFormData, releaseDate: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Cover Image URL</label>
                  <input required type="url" placeholder="https://..." value={albumFormData.coverImage} onChange={e => setAlbumFormData({...albumFormData, coverImage: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
                  <textarea required value={albumFormData.description} onChange={e => setAlbumFormData({...albumFormData, description: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-medium min-h-[120px] focus:ring-2 focus:ring-pink-500 focus:outline-none"></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-lg rounded-xl hover:opacity-90 transition-all shadow-xl shadow-pink-500/20 active:scale-95">Publish Era</button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-black mb-8 text-white flex items-center gap-3">
                 Currently Live
                 <span className="bg-pink-500/20 text-pink-400 text-sm px-3 py-1 rounded-full border border-pink-500/30">{albums.length}</span>
              </h2>
              <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                {albums.map(album => (
                  <div key={album._id} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-6 shadow-sm hover:border-pink-500/30 transition-all">
                     <img src={album.coverImage} className="w-20 h-20 rounded-xl object-cover shadow-md" alt="cover" />
                     <div>
                       <h3 className="font-black text-xl text-white mb-1">{album.title}</h3>
                       <p className="text-sm font-bold text-pink-400">{new Date(album.releaseDate).getFullYear() || 'Vault'}</p>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
