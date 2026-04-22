# Liote Website

Corporate website for **Liote** (Publicite Lumineuse et Affichage Liote), a Paris-based OOH/DOOH advertising company specializing in monumental event wraps, illuminated signage, and premium digital displays at the Palais des Congres de Paris. Founded in 1920.

## Tech Stack

- **HTML5 / CSS3 / Vanilla JavaScript** -- no build tools or frameworks required
- **GSAP 3.12 + ScrollTrigger** -- scroll-driven animations loaded from CDN
- **Google Fonts** -- Inter (body) + Montserrat (headings)

## Running Locally

No build step is needed. Two options:

1. **Direct file open** -- open `site/index.html` in any modern browser.
2. **Local server** (recommended for correct asset paths):
   ```bash
   # Python 3
   cd site
   python3 -m http.server 8000

   # Node (npx)
   cd site
   npx serve .
   ```
   Then visit `http://localhost:8000`.

## File Structure

```
site/
  index.html              # Homepage
  css/
    styles.css            # Global stylesheet (variables, layout, components)
  js/
    main.js               # GSAP animations, navbar, scroll behaviors
  assets/
    img/                  # Hero images, photos, favicon
    logos/                 # Client and partner logos
  solutions.html          # Solutions overview (4 product lines)
  toiles-evenementielles.html
  affichage-premium.html
  publicites-lumineuses.html
  realisations.html       # Project gallery / case studies
  renovation-patrimoine.html
  notre-histoire.html     # Company history / about
  equipe.html             # Team page
  engagements.html        # CSR / sustainability commitments
  blog.html               # Blog listing
  contact.html            # Contact form + direct contacts
  mentions-legales.html   # Legal notices
  blog/                   # Individual blog articles
```

## Deployment

The `site/` folder is fully static and can be deployed anywhere:

- **Vercel** -- drag and drop the `site/` folder, or connect the repo and set the root directory to `site`.
- **Netlify** -- drag and drop `site/` into the Netlify dashboard, or set the publish directory to `site` in build settings.
- **Any static host** -- upload the contents of `site/` to the web root.

No build command is required. Set the publish/output directory to `site`.

## Adding Images

Image placeholders in the HTML reference paths like `assets/img/hero-home.jpg` (or `../assets/img/...` from blog articles). To add real images:

1. Place image files in `site/assets/img/` (photos, heroes) or `site/assets/logos/` (client logos).
2. Update the corresponding `src` attributes in the HTML files.
3. Use optimized formats (WebP preferred, JPEG fallback) and reasonable dimensions (heroes: 1920px wide max, thumbnails: 600px).

## Updating Content

- **Page text**: edit the HTML files directly in `site/`. Each page is self-contained.
- **Navigation**: the nav and footer are duplicated in each HTML file. Update all pages when changing nav links.
- **Styles**: all styles live in `site/css/styles.css`. CSS custom properties (variables) are defined at the top of the file for colors, fonts, and spacing.
- **Animations**: GSAP logic is in `site/js/main.js`.
- **Homepage**: edit `site/index.html`.

## Credits

- **Brand**: Liote (Publicite Lumineuse et Affichage Liote)
- **Design direction**: informed by competitive intelligence research across the French OOH/DOOH market
- **Fonts**: Inter and Montserrat via Google Fonts
- **Animations**: GSAP by GreenSock
