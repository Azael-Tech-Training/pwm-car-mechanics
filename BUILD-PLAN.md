# BUILD-PLAN.md — PWM Car Mechanics Website

## Status

**Build-ready specification** for the PWM Car Mechanics static website, compiled from resolved Wayfinder tickets TICKET-PWM-002 through TICKET-PWM-006. Approved by mentor review.

---

## Stack

| Layer | Technology | Decision Source |
|-------|-----------|----------------|
| **Build tool** | [Vite](https://vitejs.dev/) | TICKET-PWM-002: Vite + static MPA |
| **Rendering model** | Static pre-rendered Multi-Page Application (MPA) | TICKET-PWM-002 |
| **Markup** | Vanilla HTML5 | TICKET-PWM-002, TICKET-PWM-005 |
| **Styling** | CSS (`assets/style.css`) — dark theme (`#0d0f1a`), teal accent (`#06d6a0`), glass-morphism, responsive grid | TICKET-PWM-002, audit observations |
| **Interactivity** | Vanilla JavaScript — client-side simulator widgets (canvas/SVG/JS) inside static lesson pages | TICKET-PWM-002 |
| **Framework** | **No React** — per ticket constraints; reusable components evaluated via standard JavaScript modules, templates, or Web Components if needed | TICKET-PWM-003 |
| **Presentation** | Slidev deck (`pwm-presentation/`) — **excluded** from website scope; independent CI/CD setup | TICKET-PWM-003 |

---

## Site Architecture

### Page Structure (10 HTML entry points)

| Page | Entry Point | URL | Notes |
|------|-------------|-----|-------|
| **Homepage** | `index.html` | `/` | Enhanced landing page with hero, features grid, signup CTA, featured lesson preview |
| **Lessons Index** | `lessons/index.html` | `/lessons/` | Ordered list of all 8 lessons with descriptions and recommended learning path |
| **Lesson 0001** | `lessons/0001-what-is-pwm-and-why-cars.html` | `/lessons/0001-what-is-pwm-and-why-cars.html` | First lesson; format template for subsequent lessons |
| **Lesson 0002** | `lessons/0002-low-side-vs-high-side.html` | `/lessons/0002-low-side-vs-high-side.html` | SVG circuit simulator — low-side vs high-side switching |
| **Lesson 0003** | `lessons/0003-diagnostics-multimeter-oscilloscope.html` | `/lessons/0003-diagnostics-multimeter-oscilloscope.html` | Canvas oscilloscope + SVG diagnostic simulator |
| **Lesson 0004** | `lessons/0004-how-shorts-blow-fuses.html` | `/lessons/0004-how-shorts-blow-fuses.html` | Canvas simulator — Joule heating & fuse physics |
| **Lesson 0005** | `lessons/0005-ecu-control-logic.html` | `/lessons/0005-ecu-control-logic.html` | Canvas simulator — ECU closed-loop control |
| **Lesson 0006** | `lessons/0006-how-low-side-switching-controls-flow.html` | `/lessons/0006-how-low-side-switching-controls-flow.html` | Garden hose analogy + side-by-side circuit/SVG |
| **Lesson 0007** | `lessons/0007-time-is-the-variable.html` | `/lessons/0007-time-is-the-variable.html` | Canvas simulator — duty cycle modulation, time bar |
| **Lesson 0008** | `lessons/0008-pwm-fuel-pump-control.html` | `/lessons/0008-pwm-fuel-pump-control.html` | Canvas simulator — fuel pump, gauge, scope trace, FPDM |
| **Reference/Cheat Sheet** | `reference/pwm-basics.html` | `/reference/pwm-basics.html` | Standalone equations table, frequency table, diagnostic checklist |

### Navigation Pattern

- **Header** (all pages): Logo (`PWM Car Mechanics`), Home link (`/`), Lessons link (`/lessons/`), Mission link (`MISSION.md`), Resources link (`RESOURCES.md`)
- **Lessons Index**: Ordered list (`<ol>`) of all 8 lessons with title, short description, and relative URL link (`./000X-*.html`)
- **Individual Lesson Footer**: 
  - `← Previous Lesson` / `Next Lesson →` (relative paths from `lessons/` subdirectory)
  - `📚 View Cheat Sheet` → `reference/pwm-basics.html`
  - `Home` → `/`
- **Breadcrumb/Context**: Recommended learning path displayed on lessons index: "Start with lessons 1-3 for fundamentals, then 4-6 for diagnostics, and 7-8 for practical applications"
- **Relative paths**: All lesson-internal links use `./` prefix (resolves from `lessons/` directory); root-level pages use `/` prefix

### URL/Routing Structure (Static MPA)

The Vite build generates independent HTML files with no client-side routing. URLs are filesystem-based:

```
/ — homepage
/lessons/ — lessons index
/lessons/0001-what-is-pwm-and-why-cars.html — individual lesson
/reference/pwm-basics.html — cheat sheet
```

No `spa` mode, no hash routing, no programmatic navigation. Each page is a standalone HTML file deployable to any static web server.

### Shared UI Structures (Reusable Across Pages)

| Component | Description | CSS Class | Pages Used |
|-----------|-------------|-----------|------------|
| **Header navigation** | Logo + nav links | Default (no specific class; `header ul li a` patterns) | All pages |
| **Footer** | ©2026 + Home + Lessons Index + prev/next/cheat sheet links | `footer .footer-container`, `footer .footer-links` | All pages |
| **Glass-morphism card** | Dark background with subtle blur, teal accent accent | `.glass-card` | Homepage features, lesson footers, cheat sheet stat-cards |
| **Button patterns** | Primary (`btn-primary`), Secondary (`btn-secondary`), Outline (`btn-outline`), Block (`btn-block`), Small (`btn-sm`) | `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-block`, `.btn-sm` | Homepage CTA, lesson navigation, cheat sheet |
| **Stat display** | Number + label format (e.g., "8 Lessons", "+15k Students", "4.9 Rating") | `.stat-number`, `.stat-label` | Homepage, cheat sheet `.stat-card` |
| **Feature grid** | 3-column grid on desktop, 1-column on mobile | `.grid`, `.features-grid` (homepage), `.lessons-list ol` (lessons index) | Homepage, lessons index |
| **Lesson meta** | `lesson-meta` div → `h1` → content → widget → quiz → footer | `.lesson-meta`, `.lesson-footer` | All 8 lesson files (consistent template) |
| **CSS design system** | Single source: `assets/style.css` — dark theme, grid, buttons, responsive breakpoints | `html` selector, CSS variables | All pages |

**CSS path pattern** (intentional, per audit):
- `index.html` (root) → `href="/assets/style.css"` (absolute path from root)
- `lessons/*.html` (subdirectory) → `href="../assets/style.css"` (relative path from `lessons/`)
- `reference/pwm-basics.html` → `href="../assets/style.css"` (relative path)

### Lesson Structure (Consistent Template)

Each lesson HTML follows this pattern (per audit observations):

1. `lesson-meta` div (metadata/callout)
2. `h1` (lesson title)
3. Content paragraphs (theory, physics, context)
4. Callout boxes (key concepts, warnings, tips)
5. **Interactive simulator widget** (canvas or SVG with JS event handlers)
6. 2 multiple-choice quiz questions with feedback div and disabled submit button after answer
7. `lesson-footer` with navigation links (prev/next, cheat sheet, home)

---

## Component Architecture

### Reuse Strategy: Framework-Agnostic JavaScript Modules

No React or Web Components are introduced. Reuse within the Vite website is achieved through:

- **Shared CSS**: `assets/style.css` is the single source of truth for all visual styling (design tokens, grid, buttons, responsive patterns)
- **Shared HTML template pattern**: Lessons follow the `lesson-meta → h1 → content → widget → quiz → footer` structure — this is intentional design consistency, not code duplication
- **Shared UI components** (pure CSS/HTML, no framework dependency):
  - `.glass-card` — reusable visual pattern used across homepage, lesson footers, cheat sheet
  - Button patterns (`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-block`, `.btn-sm`) — reusable across all pages
  - Stat display format (`.stat-number` + `.stat-label`) — used in hero and cheat sheet
  - Header/footer navigation — consistent markup across all pages, no framework needed

### Diagram Reuse: Not Recommended at This Time

The 20 diagrams identified in TICKET-PWM-006 are all lesson-specific with different implementation types (canvas, SVG, mixed). Extracting reusable components would introduce unnecessary abstraction for visual differences in fan SVGs, circuit diagrams, oscilloscope traces, and gauge needles. All fixes are local CSS/HTML/style attribute adjustments, no framework migration required.

**Preferred approach**: Fix each diagram in place per the `docs/DIAGRAM-FIX-PLAN.md` inventory. If future needs arise for sharing, the framework-agnostic approach supports Web Components or standard JavaScript modules at that time.

---

## Content Plan

### Lesson Structure (per audit, consistent across all 8 lessons)

Each lesson file follows this organizational pattern:

1. **Lesson meta** — `lesson-meta` div with category/tag metadata
2. **Heading** — `h1` with the lesson title
3. **Content paragraphs** — theory explanation, physics context, real-world relevance
4. **Callout boxes** — key concepts, warnings, "quick tip" highlights
5. **Interactive simulator** — canvas-based or SVG-based widget with:
   - HTML element(s) for the visual ( `<canvas>` or `<svg>` )
   - Associated JavaScript for interactivity (slider events, click handlers, animation loop)
   - DOM updates for quiz feedback, circuit description text, scope trace redrawing
6. **Quiz** — 2 multiple-choice questions:
   - `<div>` with class `quiz` containing question, option buttons (`button.quiz-option` with `data-correct="true/false"`)
   - `<div>` with class `feedback` for immediate response (correct/incorrect messaging)
   - Submit `button` initially disabled; enabled after answer selection
   - Disabled state persists after submission
7. **Lesson footer** — navigation links:
   - `← Previous Lesson` / `Next Lesson →` (relative `./000X-...html` paths)
   - `📚 View Cheat Sheet` → `reference/pwm-basics.html`
   - `Home` → `/`
   - Copyright year (2026)

### Lessons Index Organization

- Ordered list (`<ols>`) of all 8 lessons
- Each `<li>` contains:
  - `h3` with link (`href="000X-*.html"` from `lessons/` directory)
  - `p` with short description (core content focus)
- Introductory heading (`h2` "All Lessons")
- Navigation section with recommended learning path text
- Footer with home link and lessons index link

### Interactive Simulator Placement

- Simulators remain **client-side JavaScript** inside otherwise static lesson pages
- No SPA routing; each lesson HTML is a standalone entry point
- Simulator JavaScript is initialized on DOMContentLoad (`document.addEventListener('DOMContentLoaded', ...)`)
- Simulator styles and canvas/SVG elements are contained within the lesson `div` — no global scope pollution
- `prefers-reduced-motion` media query should be considered for animated diagrams (identified as unresolved question in TICKET-PWM-006)

### Reference/Cheat-Sheet Content

- `reference/pwm-basics.html` standalone page with:
  - Core equations grid (Duty Cycle, Frequency, Average Voltage)
  - Short circuits & fuse physics narrative
  - Common automotive PWM frequencies table (100 Hz – 20 kHz)
  - Diagnostic measurement checklist (DMM + Oscilloscope)
  - Lesson navigation footer (back to Lesson 1, mission link)

---

## Diagram Fix Plan (from TICKET-PWM-006)

**Inventory**: 20 problematic diagrams across all 8 lessons, documented with specific problems and local CSS/HTML fixes.

**Fix strategy**: 
- All fixes are local — no reusable components
- Prefer smallest solution: `style="width: 100%; height: auto;"` CSS rules, `max-width` constraints, `preserveAspectRatio` additions
- Framework-agnostic — no React, no Web Components

**Recommended implementation order** (1→8):

1. **Lesson 0001** — Canvas sizing + SVG icon dimensions
2. **Lesson 0002** — Circuit SVG responsive sizing
3. **Lesson 0003** — Diagnostic SVG + oscilloscope canvas
4. **Lesson 0004** — Fuse/circuit SVG
5. **Lesson 0005** — ECU control scope + fan
6. **Lesson 0006** — Garden hose/circuit analogy
7. **Lesson 0007** — Fan + scope
8. **Lesson 0008** — Gauge + oscilloscope

**All fixes to be implemented in** `assets/style.css` or as inline `style` attributes on the existing SVG/canvas elements — no new CSS files, no framework changes.

---

## Deployment

**Hosting and CI/CD**: Intentionally deferred by TICKET-PWM-004, currently out of scope. No hosting platform or deployment strategy defined in this plan.

**Build command** (only documented step):

```text
npm run build
```

This runs `vite build`, which:
- Outputs to `dist/` directory
- Generates minified CSS (`assets/style-KSxls6eE.css`)
- Generates JS chunks per lesson (`assets/[name]-[hash].js`)
- Produces 10 HTML entry points (1 homepage, 1 lessons index, 8 individual lessons, 1 reference page)
- Asset naming: `[name]-[hash].[extname]` pattern (e.g., `style-KSxls6eE.css`, `index-[hash].html`)

**Production deployment**: Any static file host (Netlify, Vercel, GitHub Pages, etc.) can serve the `dist/` output. No server-side rendering or API routes required — purely static HTML deployment.

---

## Build-Readiness Checklist

- [x] Vite configuration (`vite.config.js`) — MPA mode, 10 entry points defined
- [x] CSS design system (`assets/style.css`) — dark theme, teal accent, glass-morphism, responsive grid
- [x] 8 lesson HTML files with consistent `lesson-meta → h1 → content → widget → quiz → footer` template
- [x] Landing page (`index.html`) — hero, features grid, signup CTA, featured lesson preview
- [x] Lessons index (`lessons/index.html`) — ordered list with descriptions, recommended path
- [x] Reference cheat sheet (`reference/pwm-basics.html`) — equations, frequencies, diagnostic checklist
- [x] Vite build produces correct `dist/` output (verified by `npm run build`)
- [x] CSS path pattern: root-level `index.html` uses `/assets/style.css`; lesson files use `../assets/style.css`
- [x] 20 diagram alignment fixes documented in `docs/DIAGRAM-FIX-PLAN.md` (local CSS/HTML only)
- [x] No React introduced — vanilla HTML/CSS/JS throughout
- [x] Slidev presentation excluded from website scope
- [x] Static MPA architecture — no client-side routing, filesystem-based URLs

---

## References (Wayfinder Tickets)

- **TICKET-PWM-001**: Codebase audit — lessons inventory, shared assets, presentation observations, doc cross-references, broken issues, duplicated code
- **TICKET-PWM-002**: Research build tooling & rendering model — Vite + static MPA decision, deliverable: `docs/RESEARCH-TOOLING-RENDERING.md`
- **TICKET-PWM-003**: Research React component sharing — decision: no Slidev, no React sharing, deliverable: `docs/RESEARCH-COMPONENT-SHARING.md`
- **TICKET-PWM-005**: Propose site architecture & landing page — prototype/wireframe, site map, navigation pattern, shared UI structures, deliverable: `docs/RESEARCH-SITE-ARCHITECTURE.md`
- **TICKET-PWM-006**: Plan diagram alignment fixes — 20-diagram inventory, local fix strategies, recommended order, deliverable: `docs/DIAGRAM-FIX-PLAN.md`
- **TICKET-PWM-004**: Hosting & deployment research — out of scope for this plan, deferred
- **TICKET-PWM-007**: This document — assemble BUILD-PLAN.md from all above resolutions