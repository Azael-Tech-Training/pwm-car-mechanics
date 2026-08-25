# SPEC: Vite Landing Page Build Plan

**Label**: `ready-for-agent`
**Triage**: `ready-for-agent`

## Problem Statement

The PWM car mechanics course needs a static Vite landing page consisting of a principal landing page, an index for the 8 existing lessons, and one page for every lesson. The page structure must be static (no client-side routing), built with Vite as a Multi-Page Application (MPA), and designed as a foundation for future modifications. The destination is a `BUILD-PLAN.md` committed to the `pwm-car-mechanics` repo — a build-ready spec, not the actual build.

The problem from the user's perspective: There is no static landing page infrastructure for the PWM course content. Learners need a way to discover and navigate the 8 existing lessons, and the course needs a professional entry point. The existing 8 HTML lessons in `lessons/` exist but have no organizing index or consistent page structure.

From the developer's perspective: The repo has Vite tooling under consideration, existing assets (`assets/style.css`), and 8 static HTML lessons. What's missing is a coherent build plan that specifies how Vite should be configured, how pages should be structured, and how the build output should look.

## Solution

A static Vite MPA with HTML entry points for the homepage, lessons index, and individual lesson pages. Vite configured to produce a `dist/` directory with the deployable output. Each lesson gets a stable URL at `/lessons/<slug>.html` without client-side routing. The build plan is documented in `BUILD-PLAN.md` and the wayfinder map (`MAP-VITE-LANDING.md`) records all decisions.

## User Stories

1. As a course learner, I want a principal landing page with navigation to the lessons, so I can start exploring PWM concepts for automotive electronics.
2. As a course learner, I want a lessons index page listing all 8 lessons with descriptions, so I can browse available content.
3. As a course learner, I want individual lesson pages with title, content, and navigation to neighboring lessons, so I can study each topic sequentially.
4. As a developer, I want Vite configured as a static MPA with HTML entry points, so the build produces a deployable `dist/` directory.
5. As a developer, I want static assets (CSS) organized under `assets/` with clear referencing, so the styling integrates consistently across pages.
6. As a developer, I want the lessons index to list all 8 existing lessons (`lessons/0001` through `lessons/0008`) with descriptions, so learners can browse the full curriculum.
7. As a developer, I want each individual lesson page to include header navigation (Home, Lessons Index, prev/next links), article content, and footer navigation, so the page structure is consistent and SEO-friendly.
8. As a developer, I want the Vite build to produce proper HTML output with correct asset paths (`/assets/style.css`), so the deployed site renders correctly.
9. As a course designer, I want the landing page to include a tagline about PWM for automotive diagnostics, so visitors immediately understand the course purpose.
10. As a course designer, I want the lessons to follow a recommended learning path (lessons 1-3 fundamentals, 4-6 diagnostics, 7-8 applications), so learners can study systematically.

## Implementation Decisions

- **Vite configured as static MPA**: Each publicly addressable page is an HTML entry point. Homepage at `/`, lessons index at `/lessons/`, individual lessons under `/lessons/<slug>/`.
- **Shared JavaScript lives under `src/`**: Ready for future interactivity, currently empty since the site is static HTML-first.
- **Non-imported/static assets live under `public/`**: Per Vite conventions, assets here are served as-is without transformation.
- **CSS under `assets/style.css`**: Already exists in the repo; referenced as `/assets/style.css` in all HTML pages.
- **MPA approach over SPA**: Matches the static nature of the site and gives each lesson a real HTML document and stable URL without introducing client-side routing.
- **Build: `npm run build` produces `dist/` directory**: `npm run dev` for local development and `npm run preview` for validating the production build locally.
- **Lesson HTML entry points**: Explicitly listed in `vite.config.js` `input` option for the 8 lessons plus homepage and lessons index.
- **Navigation pattern**: Each page includes header with (Home, Lessons Index) and footer with links; lesson pages include prev/next navigation for sequential learning.
- **8 lessons preserved from existing `lessons/` directory**: Each lesson HTML file kept as-is and linked from the index.

## Testing Decisions

- **Test external behavior, not implementation details**: Verify the built `dist/` output produces correct HTML files with correct asset paths, not internal Vite configuration.
- **Test at the highest seam possible**: The build output (`dist/`) is the seam — verify that `npm run build` produces the expected file structure and that each HTML file contains the correct navigation and references.
- **Vertical slices, one at a time**: 
  1. First test: Verify `npm run build` produces `dist/index.html` with correct homepage structure.
  2. Second test: Verify `dist/lessons/index.html` exists with the 8-lesson index and descriptions.
  3. Third test: Verify `dist/lessons/0001-what-is-pwm-and-why-cars.html` exists with lesson content and nav links.
  4. Fourth test: Verify all HTML files reference `/assets/style.css` correctly.
  5. Fifth test: Verify navigation links (prev/next) connect the lesson sequence correctly.
- **Anti-patterns avoided**: No implementation-coupled tests (mocking Vite internals), no tautological tests (expected values derived the same way as code), no horizontal slicing (all tests before all implementation).
- **Prior art**: No existing tests in the codebase — these are new tests for the static site build output.

## Out of Scope

- Actually building and deploying the website — this spec produces the plan (the wayfinder map already completed this work).
- PWM content authoring (new lessons, physics theory) — the site reorganizes existing content only.
- Client-side routing or SPA features — the MPA approach is intentional.
- JavaScript interactivity or component frameworks — the site is static HTML-first; JS can be added later.
- CI/CD specifics (preview deploys per PR, branch strategy) — graduates from the planning phase.
- Bilingual strategy or i18n — the lessons are English; single language confirmed.

## Further Notes

- The wayfinder map (`MAP-VITE-LANDING.md`) already captures all decisions from the 5 tickets (TICKET-VITE-001 through TICKET-VITE-005) — this spec serves as the implementation guide following those decisions.
- The `Not yet specified` items from the map (exact page content details, styling specifics, CI/CD, bilingual strategy) can be addressed in a future effort when the destination shifts from "plan" to "build."
- The Vite config decision (TICKET-VITE-001) documents the MPA approach with an open implementation detail: whether lesson HTML entry points are explicitly listed or discovered automatically as the catalog grows. This spec assumes explicit listing for predictability.
- All prototype artifacts are linked from their respective tickets, not pasted into the spec (per wayfinder resolution rules).
- This spec is the natural next step after the wayfinder map completion — it translates the planning decisions into an implementation roadmap.