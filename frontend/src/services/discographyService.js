import { initialAlbumsData } from '../data/discographyData';

const ALBUMS_STORAGE_KEY = 'swiftay_discography_albums_v5';
const FANS_STORAGE_KEY = 'swiftay_community_fans_v5';

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
      // Purge all legacy or corrupted keys so old bad state is completely cleared
      const legacyKeys = [
        'swiftay_discography_albums',
        'swiftay_discography_albums_v1',
        'swiftay_discography_albums_v2',
        'swiftay_discography_albums_v3',
        'swiftay_discography_albums_v4',
        'swiftay_community_fans',
        'swiftay_community_fans_v2'
      ];
      legacyKeys.forEach(k => {
        try { localStorage.removeItem(k); } catch (e) {}
      });

      const stored = localStorage.getItem(ALBUMS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
      } else {
        // Validate stored data has authentic songs
        try {
          const parsed = JSON.parse(stored);
          if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].songs || parsed[0].songs.length === 0) {
            localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
          }
        } catch {
          localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
        }
      }

      if (!localStorage.getItem(FANS_STORAGE_KEY)) {
        localStorage.setItem(FANS_STORAGE_KEY, JSON.stringify(initialFansData));
      }
    } catch (e) {
      console.warn('[DiscographyService] LocalStorage error, using memory data:', e);
    }
  }

  resetStorage() {
    try {
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(initialAlbumsData));
      localStorage.setItem(FANS_STORAGE_KEY, JSON.stringify(initialFansData));
    } catch (e) {}
    return initialAlbumsData;
  }

  getAlbums() {
    try {
      const data = localStorage.getItem(ALBUMS_STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialAlbumsData;
  }

  saveAlbums(albums) {
    try {
      localStorage.setItem(ALBUMS_STORAGE_KEY, JSON.stringify(albums));
    } catch (e) {
      console.error('Failed to save albums:', e);
    }
  }

  getAlbumById(id) {
    if (!id) return null;
    const albums = this.getAlbums();
    const cleanId = String(id).trim();

    // Match by _id (e.g. "album_1"), with prefix or raw number
    let album = albums.find(a => 
      a._id === cleanId || 
      a._id === `album_${cleanId}` ||
      cleanId.endsWith(a._id) ||
      a.title.toLowerCase() === cleanId.toLowerCase()
    );

    // Fallback to initial data if not found in storage
    if (!album) {
      album = initialAlbumsData.find(a => 
        a._id === cleanId || 
        a._id === `album_${cleanId}` ||
        a.title.toLowerCase() === cleanId.toLowerCase()
      );
    }

    if (!album) return null;

    // Ensure songs array is always populated
    let songs = album.songs;
    if (!Array.isArray(songs) || songs.length === 0) {
      const orig = initialAlbumsData.find(a => a._id === album._id || a.title === album.title);
      songs = orig ? orig.songs : [];
    }

    return {
      album,
      songs: songs || []
    };
  }

  getSongById(id) {
    if (!id) return null;
    const cleanId = String(id).trim();
    const albums = this.getAlbums();

    for (const album of albums) {
      const song = (album.songs || []).find(s => s._id === cleanId || s._id === `song_${cleanId}`);
      if (song) {
        return {
          ...song,
          albumId: {
            _id: album._id,
            title: album.title,
            coverImage: album.coverImage
          },
          albumTitle: album.title,
          albumCover: album.coverImage
        };
      }
    }

    // Fallback to initialAlbumsData
    for (const album of initialAlbumsData) {
      const song = (album.songs || []).find(s => s._id === cleanId || s._id === `song_${cleanId}`);
      if (song) {
        return {
          ...song,
          albumId: {
            _id: album._id,
            title: album.title,
            coverImage: album.coverImage
          },
          albumTitle: album.title,
          albumCover: album.coverImage
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
    
    // Default to Life of a Showgirl or last vault album
    if (!targetAlbum && albums.length > 0) {
      targetAlbum = albums.find(a => a.title.includes('Showgirl')) || albums[albums.length - 1];
    }

    if (!targetAlbum) {
      throw new Error('No album available to add track');
    }

    const newSong = {
      _id: 'song_' + Date.now(),
      title: songData.title,
      duration: songData.duration || '3:30',
      previewUrl: songData.previewUrl || null,
      albumId: {
        _id: targetAlbum._id,
        title: targetAlbum.title,
        coverImage: targetAlbum.coverImage
      },
      albumTitle: targetAlbum.title,
      albumCover: targetAlbum.coverImage,
      likes: 13,
      lyrics: songData.lyrics || `[Verse 1]\n${songData.title} newly added to the Vault.`,
      comments: [
        {
          username: 'SwiftieAdmin',
          text: `Added ${songData.title} to ${targetAlbum.title}!`,
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
