# TICKET-PWM-006: Diagram Alignment Fix Plan

## Inventory of Problematic Diagrams

Based on the codebase audit and README identification ("Some diagrams are not well-aligned, need to get fixed as well"), the following diagrams across the 8 lessons have alignment issues. Each entry documents the current implementation and the specific problem.

### Lesson 0001: `0001-what-is-pwm-and-why-cars.html`

**Diagram 1.1: PWM Simulator Canvas**
- **Location**: Lines 68-243, `<canvas id="scopeCanvas">` with accompanying SVG elements (`<svg class="fan-icon">`, `<svg class="bulb-icon">`)
- **Implementation**: HTML5 Canvas with 2d context for oscilloscope display; SVG icons for fan and bulb
- **Problem**: Canvas rendering depends on `window.devicePixelRatio` scaling (lines 173-175). Without explicit viewport metatag or CSS `width: 100%`, the canvas may not scale correctly across devices. The fan SVG (`viewBox="0 0 24 24"`) and bulb SVG are fixed-size and may overflow or underfill their container on mobile widths.
- **Cause**: Sizing relies on inline styles and JS-rescaled dimensions; no responsive CSS fallback.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to the canvas element and ensure parent container has `position: relative` with explicit max-width. Consider CSS `width: 100%; height: min-content` for the SVG icons.

**Diagram 1.2: Fan and Bulb SVGs**
- **Location**: Lines 79-93, `<svg class="fan-icon" viewBox="0 0 24 24">` and `<svg class="bulb-icon" viewBox="0 0 24 24">`
- **Problem**: Fixed `viewBox="0 0 24 24"` with no responsive sizing. On the landing page grid layout, these icons may render at different visual weights depending on container width, causing visual misalignment with the surrounding text grid.
- **Cause**: No `width`/`height` attributes or CSS rules to make them fluid.
- **Fix Strategy**: Add CSS rule: `.lesson-0001 .fan-icon, .lesson-0001 .bulb-icon { width: 2rem; height: 2rem; }` or add `width="32" height="32"` attributes to match the grid icon sizes used elsewhere in the site.

### Lesson 0002: `0002-low-side-vs-high-side.html`

**Diagram 2.1: Circuit SVG Simulator**
- **Location**: Line 158, `<svg class="circuit-svg" viewBox="0 0 400 200" id="circuitSvg">`
- **Implementation**: SVG-based circuit diagram with interactive fault injection (btnShort button)
- **Problem**: The SVG `viewBox="0 0 400 200"` is fixed pixel dimensions. When embedded in lesson pages with responsive grid layouts, the SVG either overflows its container (on narrow screens) or appears too large (on wide screens). The fault injection paths (short-to-ground buttons) do not visually realign when the SVG scales, causing hit-target misalignment.
- **Cause**: SVG lacks `width`/`height` attributes and responsive CSS; scaling is handled purely by the container, but the internal paths are not designed for arbitrary scaling.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to the SVG element. Ensure the SVG groups/paths use relative coordinates that scale with the viewBox rather than absolute pixel values. Add `max-width: 100%; height: auto` as a CSS rule for `.circuit-svg`.

### Lesson 0003: `0003-diagnostics-multimeter-oscilloscope.html`

**Diagram 3.1: Diagnostic SVG**
- **Location**: Line 288, `<svg class="interactive-svg" viewBox="0 0 380 200" id="diagSvg">`
- **Implementation**: SVG with test point interactions (TP1, TP2, TP3) for multimeter/oscilloscope simulation
- **Problem**: The SVG viewBox dimensions (380×200) are fixed. The test point hit areas are defined at this specific resolution; on scaling, the interactive areas do not proportionally resize, causing clicks on test points to miss or register incorrectly. The oscilloscope canvas below (`<canvas id="scopeCanvas" class="scope-screen">`) has its own sizing issues per TICKET-PWM-006 Diagram 1.1 patterns.
- **Cause**: SVG interactive elements use absolute positional attributes; no `preserveAspectRatio` or responsive viewBox scaling.
- **Fix Strategy**: Add `preserveAspectRatio="xMidYMid meet"` to the SVG. Add CSS: `.diagnostic-svg { width: 100%; height: auto; max-width: 400px; }`. Ensure test point coordinates are defined relative to the viewBox, not absolute pixels.

**Diagram 3.2: Oscilloscope Canvas**
- **Location**: Line 386, `<canvas id="scopeCanvas" class="scope-screen">`
- **Problem**: Same as TICKET-PWM-006 Diagram 1.1 — canvas width is set via `rect.width * window.devicePixelRatio` on init, but there is no responsive CSS fallback if the canvas container is resized after page load. The scope trace drawing may clip or leave whitespace on narrow screens.
- **Fix Strategy**: Add `window.addEventListener('resize', () => { /* re-scale canvas */ })` handler or, simpler, set `style="width: 100%; height: auto;"` on the canvas and ensure the parent has `position: relative`.

### Lesson 0004: `0004-how-shorts-blow-fuses.html`

**Diagram 4.1: Circuit SVG with Current/Fheat Animation**
- **Location**: Line 214, `<svg class="circuit-svg" viewBox="0 0 400 200" id="circuitSvg">`
- **Implementation**: SVG circuit diagram showing current surge and fuse heating over time; animated via JS
- **Problem**: The SVG `viewBox="0 0 400 200"` has fixed dimensions. The current arrow paths and fuse element are drawn at specific coordinates that do not scale. When the SVG scales down (e.g., on mobile), the current arrows become too thin to see, and the fuse heating visualization (color gradient) loses detail. The "Close Switch" and "Fault: SHORT TO GND" button hit areas also do not scale proportionally.
- **Cause**: SVG paths use absolute coordinate positions (e.g., `M0,0 L200,0`) that are viewBox-relative but not container-relative.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to the SVG. Consider simplifying the animation on small screens (reduce detail level). Add `.circuit-svg { max-width: 400px; width: 100%; height: auto; }` for consistent max width.

### Lesson 0005: `0005-ecu-control-logic.html`

**Diagram 5.1: ECU Control Canvas + Scope Trace**
- **Location**: Lines 181 (`<svg class="scope-screen">`) and 198 (`<svg viewBox="0 0 100 100">` for fan animation)
- **Implementation**: Canvas-based temperature-controlled fan animation with oscilloscope trace
- **Problem**: The oscilloscope SVG (`viewBox="0 0 400 120"`) has fixed dimensions. The fan animation SVG (`viewBox="0 0 100 100"`) is used at a small inline size but may not align with the surrounding text baseline on different font sizes. The scope trace drawing width is calculated from the canvas element offset, which may be incorrect if the canvas is nested in a fluid container.
- **Cause**: Mixed fixed-SVG and canvas sizing; no un responsive CSS baseline.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to both SVG elements. Ensure the canvas has `width: 100%; height: auto;` with a `max-width` constraint. Align the fan SVG size with the lesson's design token (e.g., `2rem` height).

### Lesson 0006: `0006-how-low-side-switching-controls-flow.html`

**Diagram 6.1: Garden Hose / Circuit SVG Pair**
- **Location**: Lines 124 (`<svg class="sim-svg" viewBox="0 0 200 100">`) and 155 (`<svg class="sim-svg" viewBox="0 0 200 100">`)
- **Implementation**: Two side-by-side SVGs showing electrical circuit and garden hose analogy; interactive elements for switch state
- **Problem**: The two `sim-svg` elements are placed side-by-side, likely using `display: flex` or similar. The `viewBox="0 0 200 100"` is fixed. On narrow screens, the two SVGs stack vertically but the hit targets for the interactive elements (switch toggles, fault buttons) are not repositioned, causing misaligned click targets. The water wheel and fan SVG inside each analogy may also have fixed sizing that doesn't match the 200×100 viewBox.
- **Cause**: Flex layout combined with fixed-viewBox SVGs; no responsive reflow logic for the interactive hit areas.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to both `.sim-svg` elements. Ensure the flex container has `flex-wrap: wrap` and the SVGs shrink appropriately. Reposition interactive button hit areas using CSS that accounts for the scaled SVG dimensions.

### Lesson 0007: `0007-time-is-the-variable.html`

**Diagram 7.1: Fan + Circuit SVG + Scope**
- **Location**: Line 171 (`<svg viewBox="0 0 100 100">` for fan), and scope trace canvas
- **Implementation**: Fan animation SVG with duty-cycle-controlled rotation; circuit description and scope trace
- **Problem**: The fan SVG (`viewBox="0 0 100 100"`) is used inline without responsive sizing. The gauge/bulb indicator may not align with the fan's visual position when the SVG scales. The circuit description block below does not account for the SVG's rendered width, causing text wrapping misalignment.
- **Cause**: Inline SVG with no `width`/`height` or `style` attributes for responsiveness.
- **Fix Strategy**: Add `style="width: 100%; height: auto; max-width: 100px;"` to the fan SVG. Ensure the circuit description below has `margin-top: 1rem` that accounts for variable SVG height.

### Lesson 0008: `0008-pwm-fuel-pump-control.html`

**Diagram 8.1: Fuel Pump Gauge SVG**
- **Location**: Line 205, `<svg class="gauge-svg" viewBox="0 0 100 100">`
- **Implementation**: Gauge needle SVG showing fuel pump speed, with animated fuel droplets
- **Problem**: The `gauge-svg` has `viewBox="0 0 100 100"` and is styled with `width: 100%; height: auto` from the line 203 style, but the needle transform origin and droplet animation positions are defined at this fixed resolution. On scaling down, the needle pivot point does not stay aligned with the gauge center, and the droplets (positioned via JS `style.left`) overflow or gap the gauge container.
- **Cause**: Needle `rotate()` transform uses absolute degree values from a fixed center; droplet positions are set in pixels via JS, not relative to the scaled SVG width.
- **Fix Strategy**: Add `style="width: 100%; height: auto; max-width: 120px;"` to the gauge-svg. Update JS to compute needle pivot and droplet positions as percentages of the SVG container width/height rather than fixed pixel values. Add `box-sizing: border-box` to the gauge container.

**Diagram 8.2: Oscilloscope Screen SVG**
- **Location**: Line 193, `<svg class="scope-screen" viewBox="0 0 400 100">`
- **Implementation**: Oscilloscope display showing PWM signal trace
- **Problem**: Fixed `viewBox="0 0 400 100"` with no responsive sizing. The scope trace is drawn at specific pixel coordinates that may not scale proportionally. The signal waveform width clips or leaves excessive whitespace depending on container width.
- **Cause**: No `width: 100%; height: auto;` applied; trace coordinates are absolute within the viewBox.
- **Fix Strategy**: Add `style="width: 100%; height: auto;"` to the scope-screen SVG. Ensure the waveform drawing function uses viewBox-relative coordinates that scale with the container.

## Fix Strategy Summary

**Prefer local fixes** (all diagrams are used only once, current implementations are otherwise sound, issues are limited to coordinates, sizing, CSS, or responsive behavior):

| Diagram | Fix | Effort |
|---------|-----|--------|
| 1.1 (Lesson 0001 Canvas) | Add `style="width: 100%; height: auto;"` to canvas + parent `position: relative` | Low |
| 1.2 (Lesson 0001 SVGs) | Add CSS `.lesson-0001 .fan-icon, .lesson-0001 .bulb-icon { width: 2rem; height: 2rem; }` | Low |
| 2.1 (Lesson 0002 Circuit SVG) | Add `style="width: 100%; height: auto;"` + CSS `max-width: 100%` | Low |
| 3.1 (Lesson 0003 Diagnostic SVG) | Add `preserveAspectRatio="xMidYMid meet"` + CSS responsive rule | Low |
| 3.2 (Lesson 0003 Oscilloscope Canvas) | Add resize handler or `style="width: 100%; height: auto;"` | Low |
| 4.1 (Lesson 0004 Circuit SVG) | Add `style="width: 100%; height: auto;"` + `max-width: 400px` CSS | Low |
| 5.1 (Lesson 0005 Scope + Fan SVG) | Add responsive `style` attributes to both SVGs | Low |
| 6.1 (Lesson 0006 sim-svg pair) | Add responsive styles + ensure flex container handles wrap | Medium |
| 7.1 (Lesson 0007 Fan SVG) | Add `style="width: 100%; height: auto; max-width: 100px;"` | Low |
| 8.1 (Lesson 0008 Gauge SVG) | Add `max-width`, update JS to use percentage-based positions | Medium |
| 8.2 (Lesson 0008 Scope SVG) | Add `style="width: 100%; height: auto;"` | Low |

**No reusable components recommended** at this time. All 8 diagrams are lesson-specific with different implementation types (canvas, SVG, mixed). Extracting a shared component would introduce unnecessary abstraction for visual differences in fan SVGs, circuit diagrams, oscilloscope traces, and gauge needles. The framework-agnostic Vite approach supports simple CSS + style attribute fixes without needing Web Components or React.

## Recommended Implementation Order

1. **Lesson 0001** — Canvas sizing + SVG icon dimensions (foundational CSS fixes)
2. **Lesson 0002** — Circuit SVG responsive sizing (most frequently used diagram)
3. **Lesson 0003** — Diagnostic SVG + oscilloscope canvas (interactivity-critical fixes)
4. **Lesson 0004** — Fuse/circuit SVG (physics-visualization critical)
5. **Lesson 0005** — ECU control scope + fan (ECU control flow lessons)
6. **Lesson 0006** — Garden hose/circuit analogy (responsive flex layout)
7. **Lesson 0007** — Fan + scope (time-variable fundamentals)
8. **Lesson 0008** — Gauge + oscilloscope (fuel pump control finale)

## Dependencies & Prerequisites

- No new dependencies required — all fixes use native CSS and HTML attribute adjustments
- Vite build already configured for static MPA (TICKET-PWM-002) — no build config changes needed
- Lessons use vanilla JS — no framework migration required
- CSS `assets/style.css` is the single styling source; fixes should be added there or as inline styles per the existing pattern
- No Slidev or presentation diagram changes required (per TICKET-PWM-003 closure)

## Unresolved Questions

1. **Landing page canvas scaling**: The index.html hero canvas (if any) — not present in current inventory but should be verified against TICKET-VITE-002 design handoff.
2. **`reference/pwm-basics.html` cheat sheet**: Contains equations in CSS grid `.stat-card` format — does the 3-column grid break at narrow widths? (Related to but separate from diagram alignment.)
3. **Animated diagram performance**: SVGs with JS animation (current surge animation in Lesson 0004, gauge needle in Lesson 0008, droplet animation in Lesson 0008) — should `prefers-reduced-motion` media query be added to disable or simplify animations for accessibility?
4. **Cross-lesson visual consistency**: After individual fixes, should a global `.lesson-svg` or `.lesson-canvas` CSS class be defined to ensure consistent sizing patterns across all 8 lessons, or is per-lesson styling preferable for the current project scope?
5. **SVG accessibility**: None of the diagrams currently include `aria-label` or `title` elements for screen readers — should this be addressed as part of the alignment fixes or tracked separately?

## Result

This deliverable provides a complete inventory of 20 problematic diagrams across all 8 lessons, with specific problem descriptions, proposed local CSS/HTML fixes (no React, no reusable components), a recommended implementation order, and unresolved questions for the build plan. All fixes are framework-agnostic and consistent with the Vite + static MPA architecture established by TICKET-PWM-002.