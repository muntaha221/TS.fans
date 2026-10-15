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
    if (song.previewUrl) {
      audioRef.current.src = song.previewUrl;
      audioRef.current.play().catch(e => console.log('Autoplay policy caught:', e));
      setIsPlaying(true);
    } else {
      // Dynamic fetch from iTunes for the exact Taylor Swift track
      const cleanTitle = (song.title || '').replace(/\(Taylor's Version\)/gi, '').replace(/\(From The Vault\)/gi, '').trim();
      const term = encodeURIComponent(`Taylor Swift ${cleanTitle}`);
      fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`)
        .then(r => r.json())
        .then(data => {
          if (data?.results?.[0]?.previewUrl) {
            const previewUrl = data.results[0].previewUrl;
            song.previewUrl = previewUrl;
            audioRef.current.src = previewUrl;
            audioRef.current.play().catch(e => console.log('Autoplay caught:', e));
            setIsPlaying(true);
          } else {
            console.log('No audio preview available for this track');
            setIsPlaying(false);
          }
        })
        .catch(err => {
          console.warn('Could not load track preview:', err);
          setIsPlaying(false);
        });
    }
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
