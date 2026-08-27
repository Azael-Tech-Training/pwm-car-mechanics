# SPEC: PWM Car Mechanics Website Build Plan

## Problem Statement

The PWM Car Mechanics project has completed a series of Wayfinder research tickets (002–007) that established the build tooling, rendering model, site architecture, component sharing decisions, and diagram alignment plan for a static educational website. The problem facing implementers is that while all research decisions are documented in individual deliverable files, there is no single consolidated specification that brings together the stack, architecture, content plan, component strategy, and diagram fix plan into one build-ready document. Implementers need a unified reference that captures all resolutions from tickets PWM-002 through PWM-007, with the BUILD-PLAN.md already partially addressing this, but a formal spec is needed to lock in the decisions and provide a template for implementation tickets (particularly PWM-004 hosting research and PWM-007 build plan assembly follow-ups).

## Solution

Consolidate all resolutions from Wayfinder tickets PWM-002 through PWM-007 into a single authoritative specification document. The BUILD-PLAN.md already serves as the primary build-ready spec, but this formal spec document provides the complete context, decision rationale, and implementation framework that the build plan references. The spec covers: technology stack (Vite + static MPA, vanilla HTML/CSS/JS, no React), site architecture (10 HTML entry points, navigation patterns, shared UI structures), component architecture (framework-agnostic reuse via CSS patterns, no Web Components needed), content plan (lesson structure, quiz format, simulator placement, cheat sheet), and diagram fix plan (20 problematic diagrams with local CSS/HTML fixes). Together with the existing BUILD-PLAN.md, RESEARCH-TOOLING-RENDERING.md, RESEARCH-COMPONENT-SHARING.md, RESEARCH-SITE-ARCHITECTURE.md, and DIAGRAM-FIX-PLAN.md, this spec ensures that all ticket resolutions are codified and accessible to new contributors and implementation agents.

## User Stories

1. As a new developer joining the PWM Car Mechanics project, I want a single specification document that summarizes all decisions from tickets PWM-002 through PWM-007, so that I can understand the project architecture without reading individual ticket files.
2. As a frontend implementer, I want to know the technology stack is Vite + static MPA with vanilla HTML/CSS/JS, so that I can set up my development environment correctly and avoid introducing React unnecessarily.
3. As a page builder, I want the site to have a landing page, lessons index, and 8 individual lesson pages with consistent navigation, so that I can add new content or modify existing lessons without breaking the URL structure.
4. As a content editor, I want each lesson to follow a consistent template (lesson-meta → h1 → content → widget → quiz → footer), so that I can author new lessons that match the existing format and pass validation.
5. As a UI designer, I want reusable CSS patterns (glass-card, button styles, stat display format) defined once in assets/style.css, so that I can apply consistent styling across all pages without duplicating code.
6. As a quality advocate, I want 20 diagram alignment fixes documented with specific problems and proposed CSS/HTML solutions, so that I can verify visual consistency across lessons and prioritize fixes by implementation effort.
7. As a build engineer, I want `npm run build` to produce 10 HTML entry points in dist/ with minified CSS and JS chunks, so that I can deploy the site to any static file host.
8. As a project mentor, I want all ticket resolutions to be published to the issue tracker with the `ready-for-agent` triage label, so that I can track which specs are approved and ready for agent implementation.
9. As a hosting researcher (TICKET-PWM-004), I want the build plan to document that deployment is out of scope for now, so that I can research hosting platforms without conflicting with the current static MPA architecture.
10. As a contributor looking to fix diagrams, I want the DIAGRAM-FIX-PLAN.md inventory to reference specific lessons, problem descriptions, and fix strategies, so that I can start with the highest-priority fixes (lesson 0001 canvas, lesson 0002 circuit SVG) and progress through the ordered list.

## Implementation Decisions

- **Build tool**: Vite in production mode, configured as a static Multi-Page Application with 10 explicitly defined input entries (index, lessons/index, 8 individual lessons, reference/pwm-basics.html). Source: TICKET-PWM-002.
- **Rendering model**: Static pre-rendered MPA — each HTML entry point generates an independent file in dist/ with no client-side routing. Source: TICKET-PWM-002.
- **Framework**: No React introduced. The website uses vanilla HTML5, CSS, and JavaScript. Component sharing within the website is achieved through shared CSS design tokens and reusable HTML template patterns, not framework components. Source: TICKET-PWM-003 (decision: do not pursue React/Slidev sharing).
- **Site architecture**: 10-page static MPA structure — homepage (/), lessons index (/lessons/), 8 individual lessons (/lessons/000X-*.html), and reference cheat sheet (/reference/pwm-basics.html). Navigation patterns are consistent across all pages (header nav, lesson footer with prev/next/cheat sheet/home links). Source: TICKET-PWM-005.
- **Component architecture**: Reuse is framework-agnostic and CSS-declared. Shared UI elements include: glass-morphism cards (.glass-card), button patterns (.btn-primary, .btn-secondary, .btn-outline, .btn-block, .btn-sm), stat display format (.stat-number + .stat-label), header and footer navigation markup. No Web Components or React components are introduced at this time. Source: TICKET-PWM-003 and TICKET-PWM-006.
- **Lesson structure**: Each lesson follows a 7-part consistent template: (1) lesson-meta div, (2) h1 heading, (3) content paragraphs, (4) callout boxes, (5) interactive simulator widget (canvas or SVG with vanilla JS), (6) 2 multiple-choice quiz questions with feedback and disabled submit, (7) lesson-footer with navigation links. Source: audit observations across all 8 lessons, codified in BUILD-PLAN.md.
- **Quiz format**: 2 questions per lesson, multiple-choice with button elements (data-correct="true/false"), feedback div, submit button initially disabled, disabled state persists after answer selection. Source: lesson file inventory.
- **Interactive simulator placement**: Simulators remain client-side JavaScript inside static lesson pages. No SPA routing; each lesson HTML is a standalone entry point. Simulator JS is initialized on DOMContentLoad. prefers-reduced-motion media query should be considered for animated diagrams. Source: TICKET-PWM-002 and TICKET-PWM-006 unresolved questions.
- **CSS path pattern**: Intentional dual-path pattern — index.html (root) uses /assets/style.css; lesson files in lessons/ use ../assets/style.css; reference/pwm-basics.html uses ../assets/style.css. This resolves from their respective directory contexts. Source: PWM-AUDIT.md observations.
- **Diagram fix strategy**: All 20 problematic diagrams across 8 lessons are fixed with local CSS/HTML adjustments only. No reusable components recommended — all diagrams are lesson-specific with different implementation types (canvas, SVG, mixed). Fixes prefer smallest solution: style="width: 100%; height: auto;" attributes, max-width constraints, preserveAspectRatio additions, and CSS rules in assets/style.css. Implementation order: lessons 1→8, starting with foundational canvas/SVG sizing. Source: TICKET-PWM-006.
- **Deployment**: Hosting and CI/CD deferred by TICKET-PWM-004, out of scope for BUILD-PLAN.md. Only `npm run build` is documented as the production build step, outputting to dist/ for static file host deployment. Source: TICKET-PWM-007.
- **Slidev presentation**: Excluded from website scope per TICKET-PWM-003. The pwm-presentation/ directory remains independent with its own CI/CD (netlify.toml, vercel.json). Source: TICKET-PWM-003 resolution.

## Testing Decisions

- **Good test criteria**: Only test external behavior — rendered HTML output, CSS class presence, navigation link href values, build output correctness. Do not test implementation details like canvas pixel data, JS event handler internals, or CSS rule order.
- **Modules to test**: 
  - Vite build output correctness (`npm run build` produces expected 10 HTML files in dist/ + minified CSS)
  - CSS path resolution (lesson HTML files correctly reference ../assets/style.css from their subdirectory)
  - Navigation link consistency (all lesson footers contain prev/next/cheat sheet/home links with correct relative paths)
  - Lesson template consistency (each lesson HTML contains the 7-part structure: lesson-meta, h1, content, simulator, quiz, footer)
  - Diagram fix CSS rules (verify that style="width: 100%; height: auto;" is applied to all canvas and SVG elements identified in DIAGRAM-FIX-PLAN.md)
- **Prior art**: The existing Vite config (vite.config.js) already defines 10 input entries and the build output was verified in TICKET-PWM-007. The CSS path pattern (root vs subdirectory) is validated by the PWM-AUDIT.md CSS path observations. The lesson template pattern is documented across all 8 lesson HTML files.

## Out of Scope

- Hosting platform selection or CI/CD pipeline configuration (deferred to TICKET-PWM-004, currently out of scope)
- Actual implementation of diagram fixes (documented in DIAGRAM-FIX-PLAN.md but not executed in this spec cycle)
- Migration of lessons to Markdown/MDX format (lessons remain as standalone HTML files)
- Introduction of React or any other framework for component sharing or interactivity
- Conversion of the Slidev presentation to the website build pipeline
- Client-side routing or single-page application architecture
- Server-side rendering or API routes
- Accessibility audits beyond prefers-reduced-motion consideration (tracked as separate concern)
- Diagram accessibility (ARIA labels, screen reader text — identified as unresolved question in TICKET-PWM-006, not addressed in this spec)

## Further Notes

- All deliverables from tickets PWM-002 through PWM-007 are published as markdown files in the docs/ directory, providing a complete audit trail of decision-making.
- The BUILD-PLAN.md is the primary implementation-facing document, but this spec preserves the rationale and user-story framing that justified the build plan decisions.
- Ticket PWM-004 (hosting & deployment research) remains open and not blocked by any other ticket — it can be executed independently once a mentor is available to define the hosting platform evaluation criteria.
- The wayfinder map (MAP-PWM-WEBSITE.md) shows the frontier is now clear from TICKET-PWM-007 onward, with only PWM-004 as an independent open ticket.
- All CSS fixes for diagram alignment should be added to assets/style.css following the existing design token conventions (dark theme #0d0f1a, teal accent #06d6a0, glass-morphism variables, responsive breakpoints at 600px media query).
- The project's domain vocabulary includes: MPA (Multi-Page Application), SPA (Single-Page Application), SSG (Static Site Generator), SSR (Server-Side Rendering), Vite, SWR not applicable, canvas SVG interactivity, glass-morphism, duty cycle, frequency, average voltage, low-side switching, high-side switching, fuse heating, Joule heating, FPDM (Fuel Pump Driver Module), Web Components, React, Rendering model.