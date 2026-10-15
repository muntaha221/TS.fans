// Live lyrics fetcher using LRCLIB API with local caching

const LYRICS_CACHE_PREFIX = 'swiftay_lyrics_cache_';

export const fetchLiveLyrics = async (title, artist = 'Taylor Swift') => {
  if (!title) return null;

  const cleanTitle = title
    .replace(/\(Taylor's Version\)/gi, '')
    .replace(/\(From The Vault\)/gi, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  const cacheKey = `${LYRICS_CACHE_PREFIX}${cleanTitle.toLowerCase()}`;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return cached;
  } catch (e) {}

  try {
    const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(cleanTitle)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data.plainLyrics && data.plainLyrics.trim().length > 20) {
        const lyrics = data.plainLyrics.trim();
        try {
          localStorage.setItem(cacheKey, lyrics);
        } catch (e) {}
        return lyrics;
      }
    }
  } catch (err) {
    console.warn(`[LyricsService] Failed to fetch live lyrics for ${title}:`, err.message);
  }

  return null;
};

export default { fetchLiveLyrics };
