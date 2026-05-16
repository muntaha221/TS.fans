const fs = require('fs');
const path = require('path');
const albumsData = require('./seedData');

async function fetchSongPreviews() {
  const updatedAlbums = [];

  for (const album of albumsData) {
    console.log(`Processing album: ${album.title}...`);
    const updatedSongs = [];

    for (const song of album.songs) {
      console.log(`  Fetching preview for: ${song.title}...`);
      try {
        const searchTerm = encodeURIComponent(`Taylor Swift ${song.title}`);
        const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=song&limit=1`, {
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data && data.results && data.results.length > 0) {
          const result = data.results[0];
          console.log(`    Found: ${result.previewUrl}`);
          updatedSongs.push({
            ...song,
            previewUrl: result.previewUrl
          });
        } else {
          console.warn(`    No results for ${song.title}`);
          updatedSongs.push(song);
        }
      } catch (error) {
        console.error(`    Error fetching ${song.title}:`, error.message);
        updatedSongs.push(song);
      }
      
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    updatedAlbums.push({
      ...album,
      songs: updatedSongs
    });
  }

  const fileContent = `const albumsData = ${JSON.stringify(updatedAlbums, null, 2)};\n\nmodule.exports = albumsData;\n`;
  fs.writeFileSync(path.join(__dirname, 'seedData.js'), fileContent);
  console.log('Successfully updated seedData.js with official iTunes song previews!');
}

fetchSongPreviews();
