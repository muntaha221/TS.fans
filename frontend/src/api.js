import axios from 'axios';
import discographyService from './services/discographyService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
  timeout: 1500
});

// Helper to simulate successful axios response structure
const createMockResponse = (data, status = 200) => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {}
});

// Resilient API wrapper: In production, use local vault. In dev, tries remote first then falls back.
const api = {
  get: async (url, config = {}) => {
    // In production, skip backend network calls and use local vault data directly (instant!)
    if (import.meta.env.PROD) {
      if (url === '/albums' || url === '/albums/') {
        return createMockResponse(discographyService.getAlbums());
      }
      if (url.startsWith('/albums/')) {
        const id = url.replace('/albums/', '').split('?')[0];
        const data = discographyService.getAlbumById(id);
        if (data) return createMockResponse(data);
        return createMockResponse({ album: discographyService.getAlbums()[0], songs: [] });
      }
      if (url.startsWith('/songs/preview/fetch')) {
        return createMockResponse({
          previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/9f/fd/4d9ffd05-b520-fee9-292b-f0d217df21b9/mzaf_6042400680719050354.plus.aac.p.m4a'
        });
      }
      if (url.startsWith('/songs/')) {
        const id = url.replace('/songs/', '').split('?')[0];
        const song = discographyService.getSongById(id);
        if (song) return createMockResponse(song);
      }
      if (url === '/fans' || url === '/fans/') {
        return createMockResponse(discographyService.getFans());
      }
    }

    try {
      const res = await axiosInstance.get(url, config);
      // If remote returned an empty array for albums or fans, check if fallback has rich data
      if (url === '/albums' && Array.isArray(res.data) && res.data.length === 0) {
        return createMockResponse(discographyService.getAlbums());
      }
      return res;
    } catch (err) {
      console.warn(`[API Fallback] Network request to GET ${url} failed, using local vault store.`, err.message);

      // Fallback handlers
      if (url === '/albums' || url === '/albums/') {
        return createMockResponse(discographyService.getAlbums());
      }

      if (url.startsWith('/albums/')) {
        const id = url.replace('/albums/', '').split('?')[0];
        const data = discographyService.getAlbumById(id);
        if (data) return createMockResponse(data);
        return createMockResponse({ album: discographyService.getAlbums()[0], songs: [] });
      }

      if (url.startsWith('/songs/preview/fetch')) {
        return createMockResponse({
          previewUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/4d/9f/fd/4d9ffd05-b520-fee9-292b-f0d217df21b9/mzaf_6042400680719050354.plus.aac.p.m4a'
        });
      }

      if (url.startsWith('/songs/')) {
        const id = url.replace('/songs/', '').split('?')[0];
        const song = discographyService.getSongById(id);
        if (song) return createMockResponse(song);
      }

      if (url === '/fans' || url === '/fans/') {
        return createMockResponse(discographyService.getFans());
      }

      throw err;
    }
  },

  post: async (url, data, config = {}) => {
    try {
      const res = await axiosInstance.post(url, data, config);
      return res;
    } catch (err) {
      console.warn(`[API Fallback] Network request to POST ${url} failed, saving to local vault store.`, err.message);

      if (url === '/albums' || url === '/albums/') {
        const newAlbum = discographyService.createAlbum(data);
        return createMockResponse(newAlbum, 201);
      }

      if (url === '/songs' || url === '/songs/') {
        const newSong = discographyService.createSong(data);
        return createMockResponse(newSong, 201);
      }

      if (url.includes('/like')) {
        const songId = url.replace('/songs/', '').replace('/like', '');
        const updatedLikes = discographyService.likeSong(songId);
        return createMockResponse(updatedLikes);
      }

      if (url.includes('/comment')) {
        const songId = url.replace('/songs/', '').replace('/comment', '');
        const comments = discographyService.addComment(songId, data);
        return createMockResponse(comments);
      }

      if (url === '/fans' || url === '/fans/') {
        const newFan = discographyService.addFan(data);
        return createMockResponse(newFan, 201);
      }

      throw err;
    }
  },

  put: async (url, data, config = {}) => {
    try {
      return await axiosInstance.put(url, data, config);
    } catch {
      return createMockResponse(data);
    }
  },

  delete: async (url, config = {}) => {
    try {
      return await axiosInstance.delete(url, config);
    } catch {
      return createMockResponse({ message: 'Removed' });
    }
  }
};

export default api;
