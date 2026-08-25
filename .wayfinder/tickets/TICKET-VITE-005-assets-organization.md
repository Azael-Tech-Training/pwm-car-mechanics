# TICKET-VITE-005: Organize static assets

Label: `wayfinder:prototype`
Assignee:
Status: CLOSED
Blocked By: None

## Prototype

See the assets organization prototype at: `public/assets-organization-prototype.md`

This markdown document recommends the following asset organization for the Vite static MPA project:

**Directory Structure:**
- `public/` - non-imported static assets (landing page prototype, etc.)
- `assets/style.css` - shared CSS (already exists in repo)
- `src/` - JavaScript entry points (currently empty, ready for future interactivity)
- `vite.config.js` - Vite config from TICKET-VITE-001
- `dist/` - build output from `npm run build`

**Referencing Scheme:**
- CSS: `/assets/style.css` in HTML documents
- JavaScript: Entry points defined in `vite.config.js` input option, loaded as ES modules
- Images/futre assets: placed in `public/` per Vite conventions

**Rationale:** This organization supports the static MPA approach (homepage, lessons index, individual lessons) while maintaining Vite conventions for future enhancement. The `public/` directory holds assets served as-is, `assets/` contains processed assets, and `src/` is ready for JavaScript modules.