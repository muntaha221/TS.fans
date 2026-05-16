import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Albums from './pages/Albums';
import AlbumDetails from './pages/AlbumDetails';
import SongDetails from './pages/SongDetails';
import AdminPanel from './pages/AdminPanel';
import Community from './pages/Community';
import Trivia from './pages/Trivia';

import { PlayerProvider } from './context/PlayerContext';
import MusicPlayer from './components/MusicPlayer';
import AIChatBot from './components/AIChatBot';

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
              <Route path="/trivia" element={<Trivia />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
          <MusicPlayer />
          <AIChatBot />
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
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
