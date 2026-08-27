# PWM Car Mechanics — Codebase Audit

**Source:** `pwm-car-mechanics` repo
**Purpose:** Factual baseline inventory for all Wayfinder tickets (001–007).
**Status:** Reference document for mentor review and later ticket resolution.

---

## 1. Lessons Inventory (`lessons/`)

| # | File | Title | Core Content | Simulator / Widget Type | Quiz Questions | Prev/Next Links | Notes |
|---|------|-------|-------------|------------------------|----------------|-----------------|-------|
| — | `index.html` | **Landing Page** (redesigned) | Hero badge + headline + tagline + stats grid (8 lessons / +15k students / 4.9 rating) + feature cards + signup card + lesson preview | N/A (static landing) | N/A | Links → `/lessons/` | Enhanced beyond original prototype with glass-morphism, CSS variables, responsive grid |
| 0001 | `0001-what-is-pwm-and-why-cars.html` | PWM & The Evolution of Automotive Control | Theory: resistor vs PWM, key parameters (duty cycle, period, frequency), interactive PWM simulator, 2 quiz questions | **Canvas-based PWM simulator** with oscilloscope display, rotating fan SVG, glowing bulb, duty/frequency sliders | Q1: Average voltage calculation<br>Q2: Why PWM replaced resistors | → 0002<br>← (home) | First lesson; establishes fundamentals |
| 0002 | `0002-low-side-vs-high-side.html` | Low-Side vs. High-Side Switching | ECU MOSFETs (N-channel / P-channel), low-side vs high-side config, short-to-ground fault analysis, interactive circuit simulator | **SVG circuit simulator** with fault injection (btnShort), 2 quiz questions, config toggle (low/high side) | Q1: Low-side short-to-ground symptom<br>Q2: Why N-channel preferred for low-side | → 0003<br>← 0001 | Circuit diagnostics focus |
| 0003 | `0003-diagnostics-multimeter-oscilloscope.html` | Diagnostics with Multimeter & Oscilloscope | Interactive diagnostic lab with test points, scenario selector (DMM vs scope modes), 2 quiz questions | **Canvas oscilloscope** + test point interactions + scenario-based debugging | Q1: Multimeter measurement<br>Q2: Oscilloscope measurement | → 0004<br>← 0002 | Diagnostics focus |
| 0004 | `0004-how-shorts-blow-fuses.html` | How Shorts Blow Fuses | Joule heating physics, fuse heating simulator, 2 quiz questions | **Canvas simulator** showing current surge and fuse heating over time | Q1: Duty cycle & fuse heating<br>Q2: Why PWM more efficient than resistors | → 0005<br>← 0003 | Physics-focused |
| 0005 | `0005-ecu-control-logic.html` | ECU Control Logic and Sensor Feedback | Closed-loop simulator with coolant temperature slider, scope trace, fan animation, 2 quiz questions | **Canvas simulator** with temperature slider, fan animation, scope trace, auto/manual mode | Q1: Closed-loop control effect<br>Q2: Sensor feedback role | → 0006<br>← 0004 | ECU control focus |
| 0006 | `0006-how-low-side-switching-controls-flow.html` | How Low-Side Switching Controls Flow | Garden hose analogy, side-by-side water/electric simulator, 2 quiz questions | **Water flow analogy simulator** + side-by-side circuit visualization | Q1: Flow control mechanism<br>Q2: Analogy effectiveness | → 0007<br>← 0005 | Analogy/flow focus |
| 0007 | `0007-time-is-the-variable.html` | How the ECU Changes Duty Cycle | Time modulation: how ECU changes duty cycle by modulating ON time, manual/auto mode, time bar display, 2 quiz questions | **Canvas simulator** with time bar, manual/auto toggle, scope trace | Q1: Duty cycle modulation<br>Q2: Time base role | → 0008<br>← 0006 | Time/focus |
| 0008 | `0008-pwm-fuel-pump-control.html` | PWM Fuel Pump Control | Returnless fuel system, PCM-FPDM architecture, throttle pedal simulator, gauge needle, scope trace, droplet animation, 2 quiz questions | **Canvas simulator** with fuel pump control, gauge, droplets, PCM-FPDM diagram | Q1: Fuel pump PWM control<br>Q2: System architecture | → (end)<br>← 0007 | Final lesson; practical application |

### Observations: Lessons

- **Consistent structure** across all 8 lessons: `lesson-meta` div → `h1` → content paragraphs → callout boxes → interactive widget → 2 quiz questions → `lesson-footer` with nav links
- **Each lesson has a unique simulator type**: canvas (5 lessons), SVG circuit (1 lesson), water analogy (1 lesson) — no two simulators are alike
- **Navigation pattern**: Lesson pages link prev/next via `./000X-...html` relative paths; all lessons link back to `/lessons/` index
- **Quiz format**: 2 multiple-choice questions per lesson, with feedback and disabled submit button after answer
- **Footer nav**: "← Previous Lesson / Next Lesson → / 📚 View Cheat Sheet" pattern
- **Lesson 0001** serves as the de facto format template; subsequent lessons follow same structure with different content
- **No lesson has broken prev/next links** within the 0001–0008 sequence
- **All lessons reference** `../assets/style.css` for CSS (correct path from `lessons/` subdirectory)
- **One landing page** (`index.html`) at repo root — redesigned with modern landing page patterns

---

## 2. Shared Assets

| Asset | Location | Used By | Notes |
|-------|----------|---------|-------|
| `assets/style.css` | `assets/style.css` | All 8 lesson HTML files + `index.html` + `lessons/index.html` + `reference/pwm-basics.html` | Shared CSS design system: dark theme (`#0d0f1a`), teal accent (`#06d6a0`), glass-morphism, grid layouts, button styles, responsive breakpoints. All lesson files use `../assets/style.css` (from `lessons/`); `index.html` uses `/assets/style.css`; `lessons/index.html` previously had incorrect `assets/style.css` (now fixed to `../assets/style.css`); `reference/pwm-basics.html` uses `../assets/style.css` |
| `reference/pwm-basics.html` | `reference/pwm-basics.html` | Standalone reference page | Cheat sheet with equations (Duty Cycle = T_on/T, Frequency = 1/T, V_avg = V_src × D), frequency table (100 Hz–20 kHz), diagnostic measurement checklist. Standalone page (not linked from lessons index or landing page nav, but exists as reference). CSS references `../assets/style.css`. |
| `public/` | `public/` | Prototypes only | Contains HTML prototypes: `landing-page-prototype.html`, `lessons-index-prototype.html`, `lesson-prototype-0001.html`, `assets-organization-prototype.md`. These are **not** part of the source Vite build — they are static mockups. No lesson content inside `public/`. |
| `dist/` | `dist/` (build output) | Production | Vite build output from `npm run build`. Contains: `index.html`, `lessons/index.html`, 8 individual lesson HTML files, `assets/style-KSxls6eE.css` (minified), and JS chunks per lesson. CSS references `/assets/style.css` in built output. |

### Observations: Assets

- **`assets/style.css`** is the single source of truth for all visual styling. All HTML documents reference it.
- **`reference/pwm-basics.html`** is a standalone cheat sheet that could be integrated into the site navigation or kept separate — currently standalone, not linked from lessons index or landing page main nav.
- **`public/` prototypes** predate the Vite MPA configuration; they are static HTML mockups, not part of the build output.
- **No images** in `assets/` folder — all visual elements are SVG/canvas generated inline in lesson HTML.
- **CSS minification**: Vite produces `[name]-[hash].[extname]` filenames in `dist/` (e.g., `style-KSxls6eE.css`).

---

## 3. Presentation (`pwm-presentation/`)

| Component | Maps To (Lesson) | Vue Framework Features Used | Duplicated Across Deck |
|-----------|------------------|----------------------------|------------------------|
| `Slide 1` | 0001 (PWM fundamentals) | Slidev directives, markdown formatting | Yes — each of 8 slides maps to one lesson |
| `Slide 2` | 0002 (Low-side/high-side) | Slidev components, SVG circuit diagrams | Yes |
| `Slide 3` | 0003 (Multimeter & oscilloscope) | Slidev components, test point diagrams | Yes |
| `Slide 4` | 0004 (How shorts blow fuses) | Slidev components, physics diagrams | Yes |
| `Slide 5` | 0005 (ECU control logic) | Slidev components, closed-loop diagrams | Yes |
| `Slide 6` | 0006 (Low-side switching flow) | Slidev components, water analogy diagrams | Yes |
| `Slide 7` | 0007 (Time is the variable) | Slidev components, time-bar diagrams | Yes |
| `Slide 8` | 0008 (PWM fuel pump control) | Slidev components, PCM-FPDM diagrams | Yes |

### Presentation Observations

- **8 Vue components** in the Slidev deck, one per lesson — each maps 1:1 to a lesson file
- **Vue-specific features** used: Slidev slide backgrounds, component imports, markdown rendering, embedded SVG diagrams
- **Diagram duplication**: The interactive simulators in the lessons (canvas/SVG/javascript) are **duplicated** in the presentation as static SVG diagrams within Vue components — no code sharing between the website simulators and the presentation diagrams
- **No shared components** between the website (vanilla HTML/JS) and the presentation (Vue). Each has its own simulator implementation.
- **Deployment configs** in `pwm-presentation/`: `netlify.toml`, `vercel.json`, `.gitignore` — the deck has its own CI/CD setup independent of the website Vite build.
- **The README** mentions: "migrate components to react if needed, so we can use them in both website and presentation" — this is the directive that TICKET-PWM-003 will research.

### Observations: Presentation

- **Slidev deck is Vue-based** — the website is vanilla HTML/JS. No framework sharing exists today.
- **Interactivity gap**: The website lessons have fully interactive simulators (canvas/SVG with JS event handlers). The presentation has static diagrams only — no interactivity.
- **Content parity**: Each slide covers the same topic as its corresponding lesson, but the presentation is a summarized overview while the lessons are detailed with quizzes and simulators.

---

## 4. Documentation Cross-References

| Doc | Location | Purpose | Lessons Link? | Notes |
|-----|----------|---------|---------------|-------|
| `README.md` | repo root | Overview of the project, learning path, how to use the site | Yes — mentions "8 structured lessons" and "PWM for automotive electronics" | Does not link to individual lesson files directly |
| `MISSION.md` | repo root | Mission statement, success constraints, out of scope | No | Standalone doc; not linked from lesson footers |
| `NOTES.md` | repo root | Project notes, conventions | No | Rarely referenced |
| `RESOURCES.md` | repo root | External resources: PicoScope guides, textbook recommendations, community forums | Yes — referenced in learning-records and implied in lesson footers (callout "ask me to explain...") | Provides diagnostic guides and community links |
| `learning-records/` | `learning-records/` | 6 markdown files tracking progress | No | Individual progress files; not part of website nav |

### Observations: Docs

- **`RESOURCES.md`** is the most actively referenced doc from the lessons — the "callout" at the end of each lesson says "ask me to explain how the ECU's internal transistors switch these loads, or request the next lesson" — this flows to RESOURCES.md community links.
- **`MISSION.md`** defines the learning objectives but is **not** linked from lesson footers or the landing page — it exists as a standalone doc.
- **`NOTES.md`** is sparsely populated and not referenced from any lesson or page.
- **`README.md** gives the high-level overview but doesn't provide direct links to lesson files.

---

## 5. What's Broken / Issues

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| **CSS path in `lessons/index.html`** | `lessons/index.html:7` | High | ✅ **Fixed**: Changed `href="assets/style.css"` → `href="../assets/style.css"` (resolves from `lessons/` subdirectory) |
| **`MISSION.md` not linked** | repo root, not in any nav | Medium | Consider adding to footer nav or lesson footer links |
| **`NOTES.md` sparsely populated** | repo root | Low | Either populate or remove |
| **`reference/pwm-basics.html` not in nav** | Not linked from lessons index or landing page | Medium | Decide: integrate into navigation or keep standalone |
| **No sharing between website simulators and Slidev presentation** | `pwm-presentation/` vs `lessons/` | High | This is the TICKET-PWM-003 research question — Web Components vs React migration |
| **`public/` prototypes not part of Vite build** | `public/` | Low | Document: prototypes are mockups, not build output; or integrate if desired |
| **Landing page (`index.html`) is enhanced beyond original prototype** | `index.html` | Medium | Evaluate against TICKET-VITE-002: does new design still fit "static HTML mockup" category? |
| **Inconsistent CSS path pattern**: `index.html` uses `/assets/style.css`, lessons use `../assets/style.css` | All lesson HTML files | Low | Document as intentional (root vs subdirectory) or standardize |

---

## 6. What's Duplicated

| Duplication Type | Location | Description |
|------------------|----------|-------------|
| **Simulator code duplication** | `lessons/0001–0008` vs `pwm-presentation/` | Each lesson's interactive simulator (canvas/SVG/JS) is duplicated in the Slidev deck as a static diagram. No shared code between website and presentation. |
| **Lesson structure pattern** | All 8 lesson HTML files | Consistent template: `lesson-meta` → `h1` → content → widget → quiz → footer nav. This is intentional/design-system consistency, not "bad" duplication. |
| **Quiz format** | All 8 lessons | Identical quiz structure: 2 multiple-choice questions, feedback div, submit button, disabled state. Consistent UI pattern. |
| **Footer navigation** | All pages (index, lessons/index, individual lessons) | Same footer pattern: ©2026 + Home + Lessons Index + prev/next/cheat sheet links. Consistent across the MPA. |
| **CSS variables and design tokens** | `assets/style.css` | Single source — not duplication, but the design system is shared across all pages. |

### Non-Issue Duplications (Intentional Design Consistency)

- Lesson structure pattern, quiz format, and footer navigation are **deliberate** design choices for a cohesive learning experience. These are not "bugs" to fix but "features" of the project's architecture.

---

## 7. Summary & Fog Items

| Category | Status |
|----------|--------|
| **Codebase inventory** | Complete (this document) |
| **What works** | All 8 lessons functional with simulators and quizzes; CSS design system consistent; navigation patterns consistent; Vite MPA build produces correct `dist/` output |
| **What's broken** | CSS path in `lessons/index.html` (fixed); `MISSION.md` not linked; `reference/pwm-basics.html` not in nav |
| **What's duplicated** | Simulator code between website and Slidev presentation (research question for TICKET-PWM-003); intentional lesson structure consistency (not a problem) |
| **Fog items (not yet decided)** | — React vs Web Components for component sharing (TICKET-PWM-003)<br>— Landing page design evaluation vs TICKET-VITE-002 (TICKET-PWM-005)<br>— Whether `reference/pwm-basics.html` integrates into navigation (TICKET-PWM-005)<br>— Hosting platform choice (TICKET-PWM-004)<br>— Diagram fix priorities (TICKET-PWM-006) |

---

## Audit Deliverable

`docs/PWM-AUDIT.md` — completed. This document serves as the **factual baseline** for all subsequent Wayfinder tickets (002–007). Every later ticket should reference this audit when making decisions.

**Next ticket:** TICKET-PWM-002 (Tooling & Rendering Research) — depends on audit results above.

**Following ticket:** TICKET-PWM-003 (React Component Sharing) — critical bottleneck, blocks 005 and 006.

---
*End of PWM-AUDIT.md*