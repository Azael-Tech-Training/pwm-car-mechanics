# TICKET-PWM-002: Research build tooling & rendering model

Label: `wayfinder:research`
Assignee:
Status: CLOSED
Blocked By: None

## Question

Which build setup should the PWM website use? Compare:

- **Bundler/build tool**: Vite vs Rspack (vs other modern options) — for a content site with interactive widgets.
- **Rendering model**: SPA vs SSR vs SSG — the content is static lessons plus interactive simulator components; the README allows "client side application, or either static page generated website."

Research each option against the actual needs from the audit (static HTML lessons, interactivity, simplicity for beginners, easy deployment). Deliverable: a recommendation in a markdown summary (e.g. `docs/RESEARCH-TOOLING-RENDERING.md`) with a small comparison table and a clearly stated winner: one bundler + one rendering model, with the reasoning in 3-5 bullets.


## Resolution

**Decision:** Use **Vite + static pre-rendered Multi-Page Application (MPA)** as the build and rendering model.

**Deliverable:** `docs/RESEARCH-TOOLING-RENDERING.md`

### Build tooling

Vite remains the build tool.

Rspack and other bundlers were considered but are not recommended because they do not provide a meaningful benefit for the current project and would introduce unnecessary migration and configuration complexity.

### Rendering model

Use static build-time rendering with Vite's MPA support.

The website will generate independent HTML entry points for:

- `/` — landing page
- `/lessons/` — lessons index
- `/lessons/<slug>/` — individual lessons

Interactive simulator components will run as client-side JavaScript inside the otherwise static lesson pages.

### Rationale

- The majority of the website consists of static educational content.
- Vite already supports the required multi-page structure and static deployment.
- Static HTML provides stable URLs and keeps the site simple for beginner contributors.
- Interactive functionality does not require a SPA or SSR; simulator behavior can be isolated to client-side JavaScript.
- SSR and more complex frameworks would introduce deployment and architectural complexity without a current requirement.

### Alternatives rejected

- **Rspack:** No current build-performance or webpack-compatibility requirement justifies migration.
- **SPA:** Adds client-side routing and application complexity for primarily static content.
- **SSR:** Requires runtime/server infrastructure that the current content model does not need.
- **Astro:** Technically suitable for static content with interactive islands, but introduces an additional framework that is not currently justified.
- **React:** Not required for the rendering model; reusable components should be evaluated separately through the component-sharing research.

### Result

The project should continue with:

**Vite → static MPA → client-side JavaScript for interactive widgets → `dist/` for deployment.**

This decision unblocks the subsequent architecture and implementation planning work.

**Status:** CLOSED