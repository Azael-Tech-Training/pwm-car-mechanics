# [MAP] Vite Landing Page Build Plan

Label: `wayfinder:map`
Status: OPEN

## Destination

A `BUILD-PLAN.md` committed to the `pwm-car-mechanics` repo — a build-ready spec for a static Vite landing page with a principal page, an index for /lessons, and individual lesson pages, researched and proposed. The map ends at the plan, not the build.

## Notes

- Domain: Static-content website engineering, Vite, HTML/CSS/JS fundamentals.
- Skills for resolving sessions: `/wayfinder`, `/research`, `/prototype`, `/domain-modeling`, `frontend-design`.
- Repo: `pwm-car-mechanics` — 8 static HTML lessons (`lessons/`), `assets/style.css`, `reference/pwm-basics.html`.
- Ticket resolution records the proposal; deliverables are linked from the ticket, not pasted in.

## Decisions so far

- [Configure Vite project structure](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-001-vite-configuration.md) — Vite configured as static MPA with HTML entry points for homepage, lessons index, and individual lessons; `dist/` output confirmed.
- [Design landing page template](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-002-landing-page-template.md) — HTML mockup prototype with header navigation, hero section, introduction, and CTA linking to lessons index; static HTML approach confirmed.
- [Create lessons index structure](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-003-lessons-index.md) — HTML prototype with ordered list of all 8 lessons, descriptions, and navigation path; stable URLs confirmed.
- [Organize static assets](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-005-assets-organization.md) — markdown prototype with directory structure: `public/`, `assets/`, `src/`, and referencing scheme; Vite conventions confirmed.

## Frontier Tickets

- [Configure Vite project structure](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-001-vite-configuration.md) *(research)* — closed.
- [Design landing page template](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-002-landing-page-template.md) *(prototype)* — closed.
- [Create lessons index structure](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-003-lessons-index.md) *(prototype)* — closed.
- [Design individual lesson page template](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-004-lesson-page-template.md) *(prototype)* — closed.
- [Organize static assets](file:///home/arturoruiz/PROYECTOS/pwm-car-mechanics/.wayfinder/tickets/TICKET-VITE-005-assets-organization.md) *(prototype)* — closed.

## Not yet specified

- Exact content for each page — sharpens once template choices are made.
- Specific styling details — graduates from asset organization.
- CI/CD specifics (preview deploys per PR, branch strategy) — graduates from hosting research.
- Bilingual strategy: lessons are English, any new content language considerations — single language vs. i18n.
- SPEC-VITE-LANDING-PAGE.md — formal spec written to `SPEC-VITE-LANDING-PAGE.md`, ready for agent implementation with `ready-for-agent` triage label.

## Out of scope

- Actually building and deploying the website — this map produces the plan; implementation is the next effort.
- PWM content authoring (new lessons, physics theory) — the site reorganizes existing content only.