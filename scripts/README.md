Image fetch & optimize scripts

What it does:
- Downloads a small curated set of royalty-free, bright/airy food images from Unsplash (via source.unsplash.com).
- Saves original JPEGs as `<filename>-orig.jpg` in `DDC Website/assets/images`.
- Optionally generates resized JPEG and WebP versions at 1600px, 800px and 400px widths.

Requirements:
- Node.js (>= 14) and `npm`.
- Internet connection to download images.

Install and run:

```bash
# from project root
npm install
# fetch only originals
npm run fetch-images
# fetch and optimize (resize + webp)
npm run fetch-and-optimize
# add --force to re-download and overwrite
node scripts/fetch-images.js --optimize --force
```

Pexels (recommended for curated food photos)
- To use Pexels, set the `PEXELS_API_KEY` (or `PEXELS_KEY`) environment variable before running the script. Example:

```bash
export PEXELS_API_KEY="YOUR_PEXELS_KEY"
npm run fetch-and-optimize
```

- When Pexels is available the script will prefer Pexels results and store attribution metadata next to the image as `<filename>-meta.json`.
- If Pexels fails (or no key provided) the script falls back to Unsplash (and then to Picsum placeholders if necessary).
Notes & limitations:
- `source.unsplash.com` serves random images for a query; if you need specific images or consistent image IDs, replace the download URL with a direct photo URL.
- This repository can't run `npm install` and fetch images from inside the editor environment; run the commands locally on your machine.
- If you prefer Pexels or images you own, replace the `images.json` entries or directly put your images in `DDC Website/assets/images/` and the site will pick them up.

Next steps I can take for you:
- Run this script locally and commit the resulting images into the repo (if you allow me to handle files you provide).
- Add an automated GitHub Action to run the fetch-and-optimize workflow and commit images to the repo (requires a token and is optional).