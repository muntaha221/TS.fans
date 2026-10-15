import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Albums from './pages/Albums';
import AlbumDetails from './pages/AlbumDetails';
import SongDetails from './pages/SongDetails';
import Community from './pages/Community';

import { PlayerProvider } from './context/PlayerContext';
import MusicPlayer from './components/MusicPlayer';

function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-500">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/albums" element={<Albums />} />
              <Route path="/albums/:id" element={<AlbumDetails />} />
              <Route path="/songs/:id" element={<SongDetails />} />
              <Route path="/community" element={<Community />} />
              <Route path="/admin" element={<Navigate to="/albums" replace />} />
            </Routes>
          </main>
          <Footer />
          <MusicPlayer />
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#fff',
              border: '1px solid rgba(236,72,153,0.2)',
              borderRadius: '1rem',
              backdropFilter: 'blur(10px)'
            }
          }}
        />
      </Router>
    </PlayerProvider>
  );
}

export default App;
