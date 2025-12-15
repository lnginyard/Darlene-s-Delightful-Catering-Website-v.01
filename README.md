# Darlene's Delightful Catering — Website (v0.1)

**Overview**
- **Purpose:** A small static website for Darlene's Delightful Catering showcasing services, menu items, photos, and contact information.
- **Contents:** Multi-page site built with plain HTML, CSS and JavaScript located in the `DDC Website` folder.

**Quick Start**
- **Open directly:** Open [DDC Website/index.html](DDC%20Website/index.html) in your browser.
- **Run a local server (recommended):**

```bash
cd "DDC Website"
python3 -m http.server 8000
# then open http://localhost:8000/
```

**Project Structure**
- **Root:** See the top-level files like [LICENSE](LICENSE) and this README.
- **Site folder:** [DDC Website](DDC%20Website/) contains:
  - [index.html](DDC%20Website/index.html) — Home page
  - [about.html](DDC%20Website/about.html) — About
  - [menu.html](DDC%20Website/menu.html) — Menu
  - [services.html](DDC%20Website/services.html) — Services
  - [gallery.html](DDC%20Website/gallery.html) — Gallery
  - [testimonials.html](DDC%20Website/testimonials.html) — Testimonials
  - [contact.html](DDC%20Website/contact.html) — Contact
  - [styles.css](DDC%20Website/styles.css) — Styling
  - [script.js](DDC%20Website/script.js) — Front-end JavaScript

**Features**
- Simple, easy-to-read static site suitable for small-business marketing
- Clean layout and coordinated color scheme
- Gallery and multi-page navigation for showcasing offerings

**How to Contribute**
- Make changes in a branch and open a pull request describing your change.
- For content/layout fixes, edit the HTML/CSS files in `DDC Website`.
- There are no automated tests; keep changes focused and minimal.

**License & Contact**
- The project is covered by the license in [LICENSE](LICENSE).
- For questions or issues, open an issue in this repository.

**What's New (Enhancements)**
- Improved UI with CSS animations and transitions for a more inviting experience.
- Interactive gallery with a lightbox to view images larger.
- Menu photo gallery with filter buttons to see starters, mains, desserts, or event photos.
- Testimonial carousel that rotates client stories and adapts to device width.
- Lazy-loading on images for faster loads and better performance.
- Basic contact form validation and friendly success feedback (no backend required).

**Development Notes**
- Placeholder images: The repo contains sample SVG placeholders in `DDC Website/assets/images/`. Replace these with your actual event and menu photos. Keep filenames or update `src` paths in the HTML accordingly.
- Local preview: Use a simple HTTP server from the `DDC Website` folder:

```bash
cd "DDC Website"
python3 -m http.server 8000
# open http://localhost:8000/
```

- Deploy to GitHub Pages:
  - Create a repository on GitHub and push this project.
  - In repository settings enable GitHub Pages and set the source to the `main` branch (root) or the `gh-pages` branch.
  - Alternatively, publish the contents of `DDC Website/` to a branch and point Pages to that folder if desired.

**Next Steps I Can Help With**
- Replace placeholders with curated real photos (I can fetch royalty-free images or import your photos).
- Add accessibility improvements (alt text checks, keyboard navigation enhancements).
- Automate image optimization (resize + compress) and add a build step.
- Setup GitHub Pages publishing and provide a live preview link.

Thanks for checking out Darlene's Delightful Catering website — tell me which of the next steps you'd like me to take and I'll proceed.