# 08 — Build Verification and Frontier Check

**What to build:** `npm run build` produces all 11 HTML files in `dist/` with minified CSS and JS chunks. CSS path resolution verified correct across all pages (root and subdirectory references). Navigation link consistency verified (all footer links have correct relative paths). Lesson template consistency verified (each HTML contains the 7-part structure). Diagram fix CSS rules presence verified (`style="width: 100%; height: auto;"` on all canvas/SVG elements from DIAGRAM-FIX-PLAN.md).

**Blocked by:** 04, 05, 06, 07 (all preceding implementation tickets)

**Status:** ready-for-agent

- [ ] `npm run build` produces all 11 HTML files in dist/
- [ ] Minified CSS and JS chunks generated
- [ ] CSS path resolution verified: root references (index.html /assets/style.css) and subdirectory references (lessons/* /../assets/style.css), reference file
- [ ] Navigation link consistency: all footer links have correct relative paths (prev/next/cheat sheet/home)
- [ ] Lesson template consistency: each HTML contains the 7-part structure
- [ ] Diagram fix CSS rules: style="width: 100%; height: auto;" present on all canvas/SVG elements from DIAGRAM-FIX-PLAN.md