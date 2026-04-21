import React, { useState, useEffect } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [albums, setAlbums] = useState([]);
  const [activeTab, setActiveTab] = useState('albums');
  const [loading, setLoading] = useState(true);

  // Form states
  const [albumFormData, setAlbumFormData] = useState({ title: '', releaseDate: '', coverImage: '', description: '' });
  const [songFormData, setSongFormData] = useState({ title: '', albumId: '', duration: '' });

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await api.get('/albums');
      setAlbums(res.data);
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
      toast.success('Track added!');
      setSongFormData({ ...songFormData, title: '', duration: '' }); 
    } catch (error) {
       toast.error('Failed to add track');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 animate-in fade-in duration-500">
      
      <div className="p-8 mb-12 bg-gradient-to-r from-purple-800 to-pink-700 rounded-3xl text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Manage Eras Content</h1>
          <p className="text-xl font-medium text-pink-100 max-w-2xl">
            This panel is currently completely open. Add missing albums, fill out the discography, and manage tracks directly!
          </p>
        </div>
      </div>

      <div className="flex gap-4 mb-8 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-fit">
        <button 
          onClick={() => setActiveTab('albums')}
          className={`px-8 py-3 font-black text-lg rounded-xl transition-all duration-300 ${activeTab === 'albums' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          Add Albums
        </button>
        <button 
          onClick={() => setActiveTab('songs')}
          className={`px-8 py-3 font-black text-lg rounded-xl transition-all duration-300 ${activeTab === 'songs' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          Add Tracks
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {activeTab === 'albums' ? (
          <>
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-pink-500/5 border border-pink-100 dark:border-gray-700">
              <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white">Create New Era</h2>
              <form onSubmit={handleAlbumSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Album Title</label>
                  <input required type="text" value={albumFormData.title} onChange={e => setAlbumFormData({...albumFormData, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Release Date</label>
                  <input required type="date" value={albumFormData.releaseDate} onChange={e => setAlbumFormData({...albumFormData, releaseDate: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Cover Image URL</label>
                  <input required type="url" placeholder="https://..." value={albumFormData.coverImage} onChange={e => setAlbumFormData({...albumFormData, coverImage: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                  <textarea required value={albumFormData.description} onChange={e => setAlbumFormData({...albumFormData, description: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium min-h-[120px] focus:ring-2 focus:ring-pink-500 focus:outline-none"></textarea>
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-black text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-pink-500/30 transform hover:-translate-y-0.5">Submit Era</button>
              </form>
            </div>
            
            <div>
              <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white flex items-center gap-3">
                 Currently Live
                 <span className="bg-pink-100 text-pink-600 dark:bg-pink-900 text-sm px-3 py-1 rounded-full">{albums.length}</span>
              </h2>
              {loading ? (
                <div className="animate-pulse space-y-4">
                   {[1,2,3].map(n => <div key={n} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>)}
                </div>
              ) : (
                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                  {albums.map(album => (
                    <div key={album._id} className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow">
                       <img src={album.coverImage} className="w-20 h-20 rounded-xl object-cover shadow-md" alt="cover" />
                       <div>
                         <h3 className="font-black text-xl text-gray-900 dark:text-white mb-1 group-hover:text-pink-500">{album.title}</h3>
                         <p className="text-sm font-bold text-pink-500 dark:text-pink-400">{new Date(album.releaseDate).getFullYear()}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-xl shadow-purple-500/5 border border-purple-100 dark:border-gray-700">
              <h2 className="text-3xl font-black mb-8 text-gray-900 dark:text-white">Add New Track</h2>
              <form onSubmit={handleSongSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Album</label>
                  <select required value={songFormData.albumId} onChange={e => setSongFormData({...songFormData, albumId: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none">
                     <option value="" disabled>Select an Album...</option>
                     {albums.map(album => (
                       <option key={album._id} value={album._id}>{album.title}</option>
                     ))}
                  </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Track Title</label>
                   <input required type="text" value={songFormData.title} onChange={e => setSongFormData({...songFormData, title: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Duration (e.g., 3:45)</label>
                   <input required type="text" value={songFormData.duration} onChange={e => setSongFormData({...songFormData, duration: e.target.value})} className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none" />
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-lg rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30 transform hover:-translate-y-0.5">Publish Track</button>
              </form>
            </div>
            <div className="p-10 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl flex items-center justify-center text-center border border-purple-100 dark:border-gray-700 shadow-inner">
              <div>
                 <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-purple-100 dark:border-gray-700">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                   </svg>
                 </div>
                 <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Expand the Discography</h3>
                 <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-sm mx-auto font-medium leading-relaxed">
                   Select an existing album and distribute new tracks! Every fan will immediately see the newly added tracks locally on the details page.
                 </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
