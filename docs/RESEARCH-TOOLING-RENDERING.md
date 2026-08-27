# Research: Build Tooling & Rendering Model

## Decision

**Vite + static pre-rendered Multi-Page Application (MPA)**

## Rationale

- The majority of the website consists of static educational content (8 lessons).
- Vite already supports the required multi-page structure and static deployment.
- Static HTML provides stable URLs and keeps the site simple for beginner contributors.
- Interactive simulator components run as client-side JavaScript inside the otherwise static lesson pages.
- SSR and more complex frameworks would introduce deployment and architectural complexity without a current requirement.

## Build Tooling

- **Vite** remains the build tool.
- Rspack and other bundlers were considered but rejected — no meaningful benefit for this project would justify the migration cost and configuration complexity.

## Rendering Model

The website will generate independent HTML entry points at build time:

- `/` — landing page
- `/lessons/` — lessons index
- `/lessons/<slug>/` — individual lessons

Interactive simulator components will run as client-side JavaScript inside the otherwise static lesson pages.

## Alternatives Rejected

- **Rspack:** No current build-performance or webpack-compatibility requirement justifies migration.
- **SPA:** Adds client-side routing and application complexity for primarily static content.
- **SSR:** Requires runtime/server infrastructure that the current content model does not need.
- **Astro:** Technically suitable for static content with interactive islands, but introduces an additional framework not currently justified.
- **React:** Not required for the rendering model; reusable components should be evaluated separately through the component-sharing research.

## Result

The project should continue with:

**Vite → static MPA → client-side JavaScript for interactive widgets → `dist/` for deployment.**

This decision unblocks the subsequent architecture and implementation planning work.