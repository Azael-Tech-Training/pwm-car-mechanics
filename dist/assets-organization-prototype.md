# Assets Organization Prototype

Based on the Vite static MPA configuration (TICKET-VITE-001), here is the recommended asset organization:

## Directory Structure

```
pwm-car-mechanics/
├── public/
│   └── landing-page-prototype.html      ← landing page prototype
├── assets/
│   └── style.css                        ← shared CSS (already exists)
├── src/                                 ← JavaScript entry points (to be created)
│   ├── landing-page.js                  ← landing page script
│   └── lessons-index.js                 ← lessons index script
├── dist/                                ← output from `npm run build`
├── vite.config.js                       ← config from TICKET-VITE-001
└── index.html                           ← homepage entry point
```

## Referencing Scheme

### CSS (`assets/style.css`)

- Imported from Vite config `css.pretty` and `css.nested` options
- Path: `/assets/style.css` in HTML (relative to root)
- Example: `<link rel="stylesheet" href="/assets/style.css">`

### JavaScript (future)

- Entry points defined in `vite.config.js` `input` option
- Example: `src/landing-page.js` → output `assets/landing-page.[hash].js`
- Scripts loaded at end of HTML body: `<script type="module" src="/assets/landing-page.[hash].js"></script>`

## Rationale

- **`public/` directory**: Per Vite conventions, assets placed here are served as-is without transformation. The landing page prototype lives here.
- **`assets/` directory**: CSS and other assets that need processing go here. `style.css` already exists and is referenced directly.
- **`src/` directory**: JavaScript modules that power interactivity. Currently empty since the site is static HTML-first, but ready for future enhancement.

## Build Output (`dist/`)

`npm run build` produces:
- `index.html` (homepage)
- `assets/style.[hash].css` (processed CSS)
- Individual lesson HTML files with embedded references
- All JS chunks from `src/` entries

This organization supports the static MPA approach while keeping the door open for future JavaScript interactivity.