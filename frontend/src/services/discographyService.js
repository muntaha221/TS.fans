import { initialAlbumsData } from '../data/discographyData';

const ALBUMS_STORAGE_KEY = 'swiftay_discography_albums_v2';
const FANS_STORAGE_KEY = 'swiftay_community_fans_v2';

const initialFansData = [
  {
    _id: 'fan_1',
    nickname: 'LavenderHaze99',
    favoriteEra: 'Midnights',
    message: 'The midnight rain always hits different. Taylor is the poet laureate of our generation.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'fan_2',
    nickname: 'CardiganUnderBed',
    favoriteEra: 'folklore',
    message: 'Folklore healed something in me that nothing else ever could.',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'fan_3',
    nickname: 'AllTooWellVault',
    favoriteEra: 'Red',
    message: 'Patient Zero and All Too Well 10min are forever legendary tracks in the anthology.',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
  }
];

class DiscographyService {
  constructor() {
    this.initStorage();
  }

  initStorage() {
    try {
      const stored = localStorage.getItem(ALBUMS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
      } else {
        // Check if Patient Zero is present in stored albums; if not, merge initial
        const albums = JSON.parse(stored);
        const hasPatientZero = albums.some(a => a.songs && a.songs.some(s => s.title === 'Patient Zero'));
        if (!hasPatientZero) {
          localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
        }
      }

      if (!localStorage.getItem(FANS_STORAGE_KEY)) {
        localStorage.setItem(FANS_STORAGE_KEY, JSON.stringify(initialFansData));
      }
    } catch (e) {
      console.warn('LocalStorage error, using in-memory data:', e);
    }
  }

  getAlbums() {
    try {
      const data = localStorage.getItem(ALBUMS_STORAGE_KEY);
      return data ? JSON.parse(data) : initialAlbumsData;
    } catch {
      return initialAlbumsData;
    }
  }

  saveAlbums(albums) {
    try {
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums));
    } catch (e) {
      console.error('Failed to save albums:', e);
    }
  }

  getAlbumById(id) {
    const albums = this.getAlbums();
    // Support matching by ID or case-insensitive title match
    const album = albums.find(a => a._id === id || a._id === `album_${id}`);
    if (!album) return null;
    return {
      album,
      songs: album.songs || []
    };
  }

  getSongById(id) {
    const albums = this.getAlbums();
    for (const album of albums) {
      const song = (album.songs || []).find(s => s._id === id || s._id === `song_${id}`);
      if (song) {
        return {
          ...song,
          albumId: {
            _id: album._id,
            title: album.title,
            coverImage: album.coverImage
          }
        };
      }
    }
    return null;
  }

  createAlbum(albumData) {
    const albums = this.getAlbums();
    const newAlbum = {
      _id: 'album_' + Date.now(),
      title: albumData.title,
      releaseDate: albumData.releaseDate,
      coverImage: albumData.coverImage || 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600',
      description: albumData.description,
      songs: []
    };
    albums.unshift(newAlbum);
    this.saveAlbums(albums);
    return newAlbum;
  }

  createSong(songData) {
    const albums = this.getAlbums();
    let targetAlbum = albums.find(a => a._id === songData.albumId);
    
    // If no album matches directly, default to the first album or "The Vault"
    if (!targetAlbum && albums.length > 0) {
      targetAlbum = albums[0];
    }

    if (!targetAlbum) {
      throw new Error('No album available to add track');
    }

    const newSong = {
      _id: 'song_' + Date.now(),
      title: songData.title,
      duration: songData.duration || '3:30',
      previewUrl: songData.previewUrl || 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/ed/0e/73/ed0e73df-8ac0-cc4d-c683-62989356fabe/mzaf_5570843588806201632.plus.aac.p.m4a',
      albumId: {
        _id: targetAlbum._id,
        title: targetAlbum.title,
        coverImage: targetAlbum.coverImage
      },
      albumTitle: targetAlbum.title,
      albumCover: targetAlbum.coverImage,
      likes: 13,
      lyrics: songData.lyrics || `[Verse 1]\n${songData.title} rings across the quiet air\nA newly unveiled memory waiting there...\n\n[Chorus]\nTaylor Swift - ${songData.title}\nRecorded for the Vault and forever remembered.`,
      comments: [
        {
          username: 'SwiftieAdmin',
          text: `Added ${songData.title} to ${targetAlbum.title}! Enjoy this brand new track.`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    if (!targetAlbum.songs) {
      targetAlbum.songs = [];
    }
    targetAlbum.songs.unshift(newSong);
    this.saveAlbums(albums);
    return newSong;
  }

  likeSong(songId) {
    const albums = this.getAlbums();
    let updatedLikes = 0;
    for (const album of albums) {
      const song = (album.songs || []).find(s => s._id === songId);
      if (song) {
        song.likes = (song.likes || 0) + 1;
        updatedLikes = song.likes;
        break;
      }
    }
    this.saveAlbums(albums);
    return updatedLikes;
  }

  addComment(songId, { text, username }) {
    const albums = this.getAlbums();
    let comments = [];
    for (const album of albums) {
      const song = (album.songs || []).find(s => s._id === songId);
      if (song) {
        if (!song.comments) song.comments = [];
        const newComment = {
          username: username || 'Anonymous Swiftie',
          text,
          timestamp: new Date().toISOString()
        };
        song.comments.push(newComment);
        comments = song.comments;
        break;
      }
    }
    this.saveAlbums(albums);
    return comments;
  }

  getFans() {
    try {
      const data = localStorage.getItem(FANS_STORAGE_KEY);
      return data ? JSON.parse(data) : initialFansData;
    } catch {
      return initialFansData;
    }
  }

  addFan(fanData) {
    const fans = this.getFans();
    const newFan = {
      _id: 'fan_' + Date.now(),
      nickname: fanData.nickname,
      favoriteEra: fanData.favoriteEra,
      message: fanData.message,
      createdAt: new Date().toISOString()
    };
    fans.unshift(newFan);
    try {
      localStorage.setItem(FANS_STORAGE_KEY, JSON.stringify(fans));
    } catch (e) {
      console.error('Failed to save fans:', e);
    }
    return newFan;
  }
}

export const discographyService = new DiscographyService();
export default discographyService;
