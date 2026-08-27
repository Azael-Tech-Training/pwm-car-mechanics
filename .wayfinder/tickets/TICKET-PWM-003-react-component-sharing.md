# TICKET-PWM-003: Research React component sharing between site & Slidev

Label: `wayfinder:research`
Assignee:
Status: CLOSED
Blocked By: None

## Question

The README asks to "migrate components to react if needed, so we can use them in both website and presentation." The presentation is built with Slidev, which is Vue-based. How do we get the interactive simulator components usable in BOTH the (React) website and the Slidev deck?

Research the realistic options:

- Keep the deck in Slidev (Vue) and only share the website's React components via **Web Components** (custom elements).
- Use **React inside Slidev** (Slidev supports React via addons/plugins) so the same React components render in the deck.
- Rebuild the presentation in a React-based slide framework (e.g. Spectacle, react-pdf-slides, or a plain React deck).
- Any other viable sharing strategy.

Consider: how much component code is duplicated today (from the audit), how much the deck relies on Vue-specific features, and beginner-friendliness. Deliverable: `docs/RESEARCH-COMPONENT-SHARING.md` with a comparison and a clear recommendation for how components will be shared (or whether the deck itself should move to React).


## Resolution

**Decision:** Do not pursue React component sharing between the website and Slidev.

The original requirement assumed that the PWM website and the Slidev presentation needed to share interactive components. This requirement has been removed because the project will no longer use Slidev as part of the website architecture.

The PWM website will be developed and deployed entirely with **Vite** using the static MPA architecture established by TICKET-PWM-002.

### Consequences

- React will not be introduced for component sharing.
- Slidev will not be part of the website architecture.
- React-in-Slidev will not be investigated.
- Migrating the presentation to a React-based slide framework will not be investigated.
- Cross-framework component sharing is no longer required.

Reusable components should instead be researched specifically for the Vite website in a separate component-architecture ticket. That research should determine whether standard JavaScript modules, templates, Web Components, or another lightweight approach is appropriate based on actual code duplication in the repository.

### Status

**CLOSED — Superseded**

**Reason:** The original cross-framework React/Slidev requirement was removed from the project scope. Component reuse within the Vite website will be addressed separately.