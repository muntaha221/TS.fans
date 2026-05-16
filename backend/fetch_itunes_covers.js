const fs = require('fs');
const path = require('path');

const albumsData = require('./seedData');

async function fetchCovers() {
  const updatedAlbums = [];

  for (const album of albumsData) {
    console.log(`Fetching cover for: ${album.title}...`);
    try {
      const searchTerm = encodeURIComponent(`Taylor Swift ${album.title}`);
      const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&entity=album&limit=1`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`  Data received: ${JSON.stringify(data).substring(0, 50)}...`);
      
      if (data && data.results && data.results.length > 0) {
        const result = data.results[0];
        // Get 1000x1000 version
        const highResUrl = result.artworkUrl100.replace('100x100bb.jpg', '1000x1000bb.jpg');
        console.log(`  Found: ${highResUrl}`);
        updatedAlbums.push({
          ...album,
          coverImage: highResUrl
        });
      } else {
        console.warn(`  No results for ${album.title}, keeping original.`);
        updatedAlbums.push(album);
      }
    } catch (error) {
      console.error(`  Error fetching ${album.title}:`, error.message);
      updatedAlbums.push(album);
    }
  }

  const fileContent = `const albumsData = ${JSON.stringify(updatedAlbums, null, 2)};\n\nmodule.exports = albumsData;\n`;
  fs.writeFileSync(path.join(__dirname, 'seedData.js'), fileContent);
  console.log('Successfully updated seedData.js with official iTunes covers!');
}

fetchCovers();
