const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const sharp = require('sharp');

const images = require('./images.json');
const outDir = path.join(__dirname, '..', 'DDC Website', 'assets', 'images');

const sizes = [1600, 800, 400];

function ensureOutDir() {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  const buffer = await res.buffer();
  fs.writeFileSync(dest, buffer);
}

async function optimizeImage(srcPath, baseName) {
  for (const w of sizes) {
    const jpegOut = path.join(outDir, `${baseName}-${w}.jpg`);
    const webpOut = path.join(outDir, `${baseName}-${w}.webp`);
    await sharp(srcPath).resize({ width: w }).jpeg({ quality: 80 }).toFile(jpegOut);
    await sharp(srcPath).resize({ width: w }).webp({ quality: 75 }).toFile(webpOut);
  }
}

// Pexels support: if PEXELS_API_KEY is provided, use Pexels search to get curated food photos
async function fetchFromPexels(query) {
  const key = process.env.PEXELS_API_KEY || process.env.PEXELS_KEY;
  if (!key) throw new Error('No Pexels API key provided');
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  if (!data.photos || data.photos.length === 0) throw new Error('No photos found on Pexels for: ' + query);
  // prefer 'large2x' or 'large'
  const photo = data.photos[0];
  const src = photo.src.large2x || photo.src.large || photo.src.original;
  return { url: src, photographer: photo.photographer, id: photo.id };
}

async function fetchAll({ optimize = false, force = false } = {}) {
  ensureOutDir();

  for (const img of images) {
    try {
      const baseName = img.filename;
      const origPath = path.join(outDir, `${baseName}-orig.jpg`);

      if (fs.existsSync(origPath) && !force) {
        console.log(`Skipped (exists): ${origPath}`);
      } else {
        console.log(`Preparing to download ${img.query} -> ${baseName}`);

        // If PEXELS_API_KEY provided, attempt Pexels first
        let fetched = false;
        if (process.env.PEXELS_API_KEY || process.env.PEXELS_KEY) {
          try {
            const p = await fetchFromPexels(img.query + ' food');
            console.log(`Downloading from Pexels: ${p.url}`);
            await downloadImage(p.url, origPath);
            fetched = true;
            // Record attribution file
            const metaPath = path.join(outDir, `${baseName}-meta.json`);
            fs.writeFileSync(metaPath, JSON.stringify({ source: 'pexels', photographer: p.photographer, id: p.id, query: img.query }, null, 2));
            console.log(`Saved: ${origPath} (Pexels)`);
          } catch (err) {
            console.warn(`Pexels fetch failed for ${baseName}: ${err.message}`);
          }
        }

        if (!fetched) {
          // Using source.unsplash.com to fetch a bright/airy food image by keyword
          let url = `https://source.unsplash.com/1600x900/?${encodeURIComponent(img.query)},food`;

          // Helper: retry with exponential backoff and fallback to picsum if Unsplash is unavailable
          async function fetchWithRetries(url, dest, attempts = 4) {
            for (let i = 0; i < attempts; i++) {
              try {
                await downloadImage(url, dest);
                return true;
              } catch (err) {
                const wait = Math.pow(2, i) * 500; // ms
                console.warn(`Attempt ${i + 1} failed for ${url}: ${err.message}. Retrying in ${wait}ms...`);
                await new Promise(r => setTimeout(r, wait));
              }
            }

            // Fallback: use a generic placeholder from picsum.photos (may not be food, but ensures the site has images)
            const fallbackUrl = `https://picsum.photos/1600/900?random=${Math.floor(Math.random() * 100000)}`;
            console.warn(`All retries failed for ${baseName}. Using fallback: ${fallbackUrl}`);
            try {
              await downloadImage(fallbackUrl, dest);
              return true;
            } catch (err) {
              console.error(`Fallback also failed for ${baseName}: ${err.message}`);
              return false;
            }
          }

          const ok = await fetchWithRetries(url, origPath, 4);
          if (ok) console.log(`Saved: ${origPath}`);
          else console.log(`Failed to obtain image for ${baseName}; leaving placeholder if present`);
        }
      }

      if (optimize) {
        console.log(`Optimizing ${baseName}`);
        await optimizeImage(origPath, baseName);
      }
    } catch (err) {
      console.error('Error fetching', img.filename, err.message);
    }
  }
  console.log('Done.');
}

// CLI handling
const args = process.argv.slice(2);
const options = {
  optimize: args.includes('--optimize'),
  force: args.includes('--force')
};

fetchAll(options).catch(err => {
  console.error(err);
  process.exit(1);
});
