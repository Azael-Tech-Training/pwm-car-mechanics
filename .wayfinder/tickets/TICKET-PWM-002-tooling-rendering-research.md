# TICKET-PWM-002: Research build tooling & rendering model

Label: `wayfinder:research`
Assignee:
Status: OPEN
Blocked By: None

## Question

Which build setup should the PWM website use? Compare:

- **Bundler/build tool**: Vite vs Rspack (vs other modern options) — for a content site with interactive widgets.
- **Rendering model**: SPA vs SSR vs SSG — the content is static lessons plus interactive simulator components; the README allows "client side application, or either static page generated website."

Research each option against the actual needs from the audit (static HTML lessons, interactivity, simplicity for beginners, easy deployment). Deliverable: a recommendation in a markdown summary (e.g. `docs/RESEARCH-TOOLING-RENDERING.md`) with a small comparison table and a clearly stated winner: one bundler + one rendering model, with the reasoning in 3-5 bullets.
