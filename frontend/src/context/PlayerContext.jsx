import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState('0:00');
  const [durationFormatted, setDurationFormatted] = useState('0:00');
  const [volume, setVolume] = useState(0.8);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const audioRef = useRef(new Audio());

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
        setCurrentTimeFormatted(formatTime(audio.currentTime));
        setDurationFormatted(formatTime(audio.duration));
      }
    };

    const handleLoadedMetadata = () => {
      setDurationFormatted(formatTime(audio.duration));
    };

    const handleEnded = () => {
      // Auto play next in queue
      playNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [queue, currentIndex]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playSong = (song, playlist = null) => {
    if (!song) return;

    if (playlist && Array.isArray(playlist)) {
      setQueue(playlist);
      const idx = playlist.findIndex(s => s._id === song._id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    }

    if (currentSong?._id === song._id) {
      togglePlay();
      return;
    }

    setCurrentSong(song);
    const audioUrl = song.previewUrl || 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/9f/fd/4d9ffd05-b520-fee9-292b-f0d217df21b9/mzaf_6042400680719050354.plus.aac.p.m4a';
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(e => console.log('Autoplay policy caught:', e));
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Play error:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const stopSong = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
    setProgress(0);
    setLyricsOpen(false);
  };

  const playNext = () => {
    if (queue.length > 0 && currentIndex !== -1) {
      const nextIdx = (currentIndex + 1) % queue.length;
      setCurrentIndex(nextIdx);
      playSong(queue[nextIdx], queue);
    }
  };

  const playPrev = () => {
    if (queue.length > 0 && currentIndex !== -1) {
      const prevIdx = (currentIndex - 1 + queue.length) % queue.length;
      setCurrentIndex(prevIdx);
      playSong(queue[prevIdx], queue);
    }
  };

  const seek = (val) => {
    if (audioRef.current.duration) {
      const time = (val / 100) * audioRef.current.duration;
      audioRef.current.currentTime = time;
      setProgress(val);
    }
  };

  const toggleLyrics = (val) => {
    setLyricsOpen(prev => (typeof val === 'boolean' ? val : !prev));
  };

  return (
    <PlayerContext.Provider value={{ 
      currentSong, 
      isPlaying, 
      progress, 
      currentTimeFormatted,
      durationFormatted,
      volume, 
      setVolume, 
      playSong, 
      togglePlay,
      stopSong, 
      seek,
      lyricsOpen,
      toggleLyrics,
      playNext,
      playPrev,
      queue
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
