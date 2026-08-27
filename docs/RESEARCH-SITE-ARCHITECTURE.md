# TICKET-PWM-005: Site Architecture & Landing Page Research

## Prototype: Wireframe of Landing Page & Lessons Index

The prototype below demonstrates the Vite-based static MPA architecture established by TICKET-PWM-002. It is framework-agnostic (vanilla HTML/JS) and compatible with the Vite configuration.

### Landing Page (`index.html`)

The homepage serves as the visitor's first point of contact with the following structure:

- **Header navigation**: Site logo, Lessons link, Mission link, Resources link
- **Hero section**: Badge, headline, tagline, statistic calls-to-action (8 lessons, +15k students, 4.9 rating), primary CTA "Start Lessons →" and secondary CTA "View Mission →"
- **Features grid**: Three value proposition cards (Diagnose Components, Design Controllers, Read Schematics) with icons and descriptions
- **Signup/CTA column**: Signup card with bonus features checklist (Hands-on simulators, Interactive quizzes, Real-world case studies)
- **Featured lesson preview**: Highlighted lesson 0001 with "View Lesson →" CTA
- **Footer**: Copyright, home link, lessons index link, mission/resources links

### Lessons Index (`lessons/index.html`)

The lessons index provides an organized entry point for discovering all available lessons:

- **Header navigation**: Home link, Lessons Index link
- **Page title**: "Lesson Index - PWM Car Mechanics"
- **Lessons list**: Ordered list of all 8 lessons with title, description, and relative URL link
- **Navigation section**: Guidance on recommended learning path (lessons 1-3 fundamentals, 4-6 diagnostics, 7-8 practical applications)
- **Footer**: Same footer pattern as landing page

### Individual Lesson Pages (`lessons/000X-*.html`)

Each lesson follows a consistent structure:

- **Lesson header**: Metadata, heading, content paragraphs, callout boxes
- **Interactive widget**: Canvas-based or SVG simulator with JavaScript interactivity
- **Quiz section**: 2 multiple-choice questions with feedback and disabled submit state
- **Lesson footer**: Navigation links (prev/next, cheat sheet, home)

### Routing & URL Scheme (Static MPA)

The Vite build generates independent HTML entry points with the following URL scheme:

| Page | URL | Entry Point |
|------|-----|-------------|
| Homepage | `/` | `index.html` |
| Lessons Index | `/lessons/` | `lessons/index.html` |
| Individual Lesson | `/lessons/000X-*.html` | `lessons/000X-*.html` |
| Reference Cheat Sheet | `/reference/pwm-basics.html` | standalone |

### Navigation Pattern

- **Lesson navigation**: Each lesson links prev/next via `./000X-...html` relative paths (from `lessons/` subdirectory)
- **Cross-page navigation**: All lessons link back to `/lessons/` index; individual lessons also link to lesson 0001
- **Breadcrumb/context**: Lesson footer shows "← Previous Lesson / Next Lesson →" with additional links "📚 View Cheat Sheet / Home"
- **Return to index**: Header on all lesson pages includes link back to home (`/`)

### Shared UI Structures

- **Header navigation**: Consistent across all pages (logo, nav links)
- **Footer**: Consistent across all pages (©2026 + Home + Lessons Index + prev/next/cheat sheet links)
- **Lesson navigation footer**: prev/next/cheat sheet/home links at bottom of each lesson
- **Glass-morphism cards**: Reusable visual pattern (`.glass-card`) with dark theme background, teal accent
- **CSS design system**: `assets/style.css` is the single source of truth (dark theme `#0d0f1a`, teal accent `#06d6a0`)
- **Stat display pattern**: Number + label format used throughout (hero stats, feature cards, cheat sheet stat-cards)
- **Button patterns**: Primary (btn-primary), secondary (btn-secondary), outline (btn-outline), block (btn-block), sm (btn-sm)

### Architectural Decisions

- **Build tool**: Vite (established by TICKET-PWM-002)
- **Rendering model**: Static MPA (established by TICKET-PWM-002)
- **No React**: Per ticket constraints, no React introduction
- **No Slidev**: Presentation deck removed from website scope
- **No client-side routing**: Pure static URLs, no SPA routing
- **CSS path pattern**: Root-level `index.html` uses `/assets/style.css`; lesson files in `lessons/` use `../assets/style.css` (intentional subdirectory path)
- **Reference page**: `reference/pwm-basics.html` kept as standalone cheat sheet, not integrated into main navigation

### Unresolved Questions

- **Landing page design evaluation**: The existing `index.html` was "enhanced beyond original prototype" — should it be standardized to a simpler static HTML mockup per TICKET-VITE-002?
- **`reference/pwm-basics.html` integration**: Should it be added to the main navigation or kept as a standalone standalone page?
- **Hosting platform choice**: Netlify, Vercel, or other — affects URL rewriting and redirect rules for the MPA structure
- **Diagram fix priorities**: TICKET-PWM-006 addresses simulator diagram alignment priorities

## Result

The PWM website will be a static MPA with 10 HTML entry points (1 homepage, 1 lessons index, 8 individual lessons, 1 reference page), all built with Vite and deployed from `dist/`. The architecture supports beginner contributors, stable URLs for educational content, and client-side JavaScript interactive widgets within otherwise static lesson pages.