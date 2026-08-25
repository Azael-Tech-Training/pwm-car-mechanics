# TICKET-VITE-001: Configure Vite project structure

Label: `wayfinder:research`
Assignee:
Status: CLOSED
Blocked By: None

## Question

How should the Vite project be structured for this static landing page — including directory layout, entry points, and build configuration to support a principal page, lessons index, and individual lesson pages?

Deliverable: a markdown summary of the recommended Vite configuration (directory structure, config file contents, build commands) that serves as the foundation for the static site.

## Decision
Use Vite as a static Multi-Page Application (MPA). Each publicly addressable page is represented by an HTML entry point, with the homepage at `/`, the lesson index at `/lessons/`, and individual lessons under `/lessons/<slug>/`. Shared JavaScript and CSS live under `src/`, while non-imported/static assets live under `public/`.

**Rationale:** An MPA matches the static nature of the site and gives each lesson a real HTML document and stable URL without introducing client-side routing. Vite officially supports multiple HTML entry points and preserves their directory structure in the production output.

**Build:** `npm run build` produces the deployable `dist/` directory. `npm run dev` is used for local development and `npm run preview` for validating the production build locally.

**Open implementation detail:** The final implementation should decide whether lesson HTML entry points are explicitly listed in `vite.config.js` or discovered automatically as the lesson catalog grows.