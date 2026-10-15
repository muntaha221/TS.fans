import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import discographyService from '../services/discographyService';

const AdminPanel = () => {
  const [albums, setAlbums] = useState([]);
  const [activeTab, setActiveTab] = useState('songs');
  const [loading, setLoading] = useState(true);

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
      const data = Array.isArray(res.data) ? res.data : [];
      setAlbums(data);
      if (data.length > 0 && !songFormData.albumId) {
        setSongFormData(prev => ({ ...prev, albumId: data[0]._id }));
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
      toast.success(`Track "${songFormData.title}" published to the Vault! ✨`, {
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

  const inputClass = "w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border border-white/[0.06] bg-white/[0.03] text-white font-bold focus:ring-2 focus:ring-violet-500 focus:outline-none text-sm";

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4 min-h-screen">

      {/* Header Banner */}
      <div className="p-6 sm:p-12 mb-8 sm:mb-12 bg-gradient-to-r from-violet-900 via-indigo-950 to-blue-950 rounded-2xl sm:rounded-3xl text-white shadow-2xl relative overflow-hidden border border-violet-500/20">
        <div className="absolute top-0 right-0 w-60 h-60 sm:w-80 sm:h-80 bg-violet-500/15 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-violet-300 text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
            Curator Console
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-3 sm:mb-4 tracking-tight">Expand the Anthology</h1>
          <p className="text-sm sm:text-lg md:text-xl font-medium text-violet-200 leading-relaxed">
            Add new songs like <strong className="text-white underline">Patient Zero</strong>, attach full lyrics, link audio previews, or release brand new Eras!
          </p>
        </div>
      </div>

      {/* Tab Switcher & Restore Clean Data */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex gap-2 sm:gap-4 bg-white/[0.03] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-white/[0.06] w-fit">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-4 sm:px-8 py-2 sm:py-3 font-black text-sm sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 ${activeTab === 'songs' ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Add Tracks
          </button>
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-4 sm:px-8 py-2 sm:py-3 font-black text-sm sm:text-lg rounded-lg sm:rounded-xl transition-all duration-300 ${activeTab === 'albums' ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            New Era
          </button>
        </div>

        <button
          onClick={() => {
            discographyService.resetStorage();
            fetchAlbums();
            toast.success('Restored 100% clean official Vault data with real lyrics!', { icon: '✨' });
          }}
          className="px-4 py-2 sm:py-2.5 rounded-xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 font-bold text-xs sm:text-sm transition-all flex items-center gap-2 active:scale-95"
          title="Clear any outdated browser cache and reload genuine Taylor Swift discography"
        >
          <span>🔄</span>
          <span>Restore Clean Official Discography</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        {activeTab === 'songs' ? (
          <>
            {/* Add Song Form */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-white/[0.06]">
              <div className="flex justify-between items-center mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-3xl font-black text-white">Add New Track</h2>
                <button
                  type="button"
                  onClick={loadPatientZeroPreset}
                  className="px-3 py-1 rounded-lg bg-violet-600/15 text-violet-400 hover:bg-violet-600 hover:text-white transition-all text-[10px] sm:text-xs font-black border border-violet-500/20"
                >
                  Patient Zero
                </button>
              </div>

              <form onSubmit={handleSongSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Target Album / Era</label>
                  <select
                    required
                    value={songFormData.albumId}
                    onChange={e => setSongFormData({...songFormData, albumId: e.target.value})}
                    className={inputClass}
                  >
                     <option value="" disabled className="bg-[#0a0a0a]">Select an Album...</option>
                     {albums.map(album => (
                       <option key={album._id} value={album._id} className="bg-[#0a0a0a]">{album.title}</option>
                     ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Track Title</label>
                  <input
                    required type="text" placeholder="e.g. Patient Zero"
                    value={songFormData.title}
                    onChange={e => setSongFormData({...songFormData, title: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Duration</label>
                    <input
                      required type="text" placeholder="3:42"
                      value={songFormData.duration}
                      onChange={e => setSongFormData({...songFormData, duration: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Audio URL</label>
                    <input
                      type="url" placeholder="https://... (optional)"
                      value={songFormData.previewUrl}
                      onChange={e => setSongFormData({...songFormData, previewUrl: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Full Lyrics</label>
                  <textarea
                    rows="6"
                    placeholder="[Verse 1]&#10;Type or paste full track lyrics here..."
                    value={songFormData.lyrics}
                    onChange={e => setSongFormData({...songFormData, lyrics: e.target.value})}
                    className={`${inputClass} font-mono text-xs leading-relaxed resize-none`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 sm:py-4 mt-2 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-black text-sm sm:text-lg rounded-xl hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 active:scale-95"
                >
                  Publish Track to Vault
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="p-5 sm:p-8 bg-white/[0.02] rounded-2xl sm:rounded-3xl border border-white/[0.06]">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-violet-600/15 flex items-center justify-center text-violet-400 font-black text-lg sm:text-xl border border-violet-500/20">
                    🎵
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-black text-white">Full Discography Integration</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Live & Instant</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Every track you add is instantly integrated into the music player, lyrics viewer, and discography tracklist — even on Vercel!
                </p>
              </div>

              <div className="p-5 sm:p-8 bg-gradient-to-br from-violet-600/8 via-blue-600/8 to-indigo-600/8 rounded-2xl sm:rounded-3xl border border-white/[0.06]">
                <h4 className="text-[10px] sm:text-sm font-black text-violet-400 uppercase tracking-widest mb-3">
                  Currently Loaded Eras ({albums.length})
                </h4>
                <div className="space-y-2 sm:space-y-3 max-h-[250px] sm:max-h-[350px] overflow-y-auto pr-1 hide-scrollbar">
                  {albums.map(album => (
                    <div key={album._id} className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <img src={album.coverImage} alt={album.title} className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
                        <div>
                          <p className="text-xs sm:text-sm font-black text-white">{album.title}</p>
                          <p className="text-[9px] sm:text-[10px] text-slate-500 font-bold">{(album.songs || []).length} tracks</p>
                        </div>
                      </div>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-violet-400">
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
            {/* Create Album Form */}
            <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 sm:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-white/[0.06]">
              <h2 className="text-xl sm:text-3xl font-black mb-6 sm:mb-8 text-white">Create New Era</h2>
              <form onSubmit={handleAlbumSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Album Title</label>
                  <input required type="text" value={albumFormData.title} onChange={e => setAlbumFormData({...albumFormData, title: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Release Date</label>
                  <input required type="date" value={albumFormData.releaseDate} onChange={e => setAlbumFormData({...albumFormData, releaseDate: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Cover Image URL</label>
                  <input required type="url" placeholder="https://..." value={albumFormData.coverImage} onChange={e => setAlbumFormData({...albumFormData, coverImage: e.target.value})} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea required value={albumFormData.description} onChange={e => setAlbumFormData({...albumFormData, description: e.target.value})} className={`${inputClass} min-h-[100px] sm:min-h-[120px] resize-none`}></textarea>
                </div>
                <button type="submit" className="w-full py-3 sm:py-4 mt-2 sm:mt-4 bg-gradient-to-r from-violet-600 to-blue-600 text-white font-black text-sm sm:text-lg rounded-xl hover:opacity-90 transition-all shadow-xl shadow-violet-500/20 active:scale-95">
                  Publish Era
                </button>
              </form>
            </div>

            {/* Albums List */}
            <div>
              <h2 className="text-xl sm:text-3xl font-black mb-6 sm:mb-8 text-white flex items-center gap-3">
                 Currently Live
                 <span className="bg-violet-600/15 text-violet-400 text-xs sm:text-sm px-3 py-1 rounded-full border border-violet-500/20">{albums.length}</span>
              </h2>
              <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[700px] overflow-y-auto pr-1 hide-scrollbar">
                {albums.map(album => (
                  <div key={album._id} className="p-3 sm:p-4 bg-white/[0.02] rounded-xl sm:rounded-2xl border border-white/[0.06] flex items-center gap-4 sm:gap-6 hover:border-violet-500/20 transition-all">
                     <img src={album.coverImage} className="w-14 h-14 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover shadow-md" alt="cover" />
                     <div>
                       <h3 className="font-black text-base sm:text-xl text-white mb-1">{album.title}</h3>
                       <p className="text-xs sm:text-sm font-bold text-violet-400">{new Date(album.releaseDate).getFullYear() || 'Vault'}</p>
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
