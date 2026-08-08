# TICKET-PWM-003: Research React component sharing between site & Slidev

Label: `wayfinder:research`
Assignee:
Status: OPEN
Blocked By: None

## Question

The README asks to "migrate components to react if needed, so we can use them in both website and presentation." The presentation is built with Slidev, which is Vue-based. How do we get the interactive simulator components usable in BOTH the (React) website and the Slidev deck?

Research the realistic options:

- Keep the deck in Slidev (Vue) and only share the website's React components via **Web Components** (custom elements).
- Use **React inside Slidev** (Slidev supports React via addons/plugins) so the same React components render in the deck.
- Rebuild the presentation in a React-based slide framework (e.g. Spectacle, react-pdf-slides, or a plain React deck).
- Any other viable sharing strategy.

Consider: how much component code is duplicated today (from the audit), how much the deck relies on Vue-specific features, and beginner-friendliness. Deliverable: `docs/RESEARCH-COMPONENT-SHARING.md` with a comparison and a clear recommendation for how components will be shared (or whether the deck itself should move to React).
