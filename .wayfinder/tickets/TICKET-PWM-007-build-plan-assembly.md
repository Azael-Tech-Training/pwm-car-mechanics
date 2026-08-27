# TICKET-PWM-007: Assemble BUILD-PLAN.md

Label: `wayfinder:task`
Assignee:
Status: OPEN
Blocked By: TICKET-PWM-001, TICKET-PWM-002, TICKET-PWM-005, TICKET-PWM-006

## Question

Consolidate the resolutions from the completed Wayfinder research and prototype tickets into the final implementation plan for the PWM website.

The plan must be build-ready and beginner-readable, while remaining consistent with the decisions already made.

## Required content

### Stack

Document the selected technology stack based on the tooling research:

- Vite as the build tool.
- Static pre-rendered Multi-Page Application (MPA).
- Vanilla HTML, CSS, and JavaScript.
- Client-side JavaScript for interactive simulator widgets.
- No React requirement.

### Site architecture

Document the agreed website structure from the site architecture ticket:

- Landing page.
- Lessons index.
- Individual lesson pages.
- Lesson navigation.
- URL/routing structure.
- Reference/cheat-sheet page if recommended.
- Shared page structure and reusable UI elements.
- Agreed landing-page and lessons-index wireframes.

The presentation/Slidev deck is no longer part of the website scope and must not be included as a website dependency.

### Component architecture

Document the conclusions regarding reusable components within the Vite website.

Do not introduce React unless a later decision explicitly requires it.

Where appropriate, identify reusable UI or interactive components and describe their responsibility at a high level. The implementation approach should remain as simple and framework-agnostic as possible.

### Content plan

Document:

- The lesson structure.
- How lessons are organized and linked.
- The lessons index structure.
- Previous/next navigation.
- Breadcrumb or contextual navigation if recommended.
- Reference/cheat-sheet content if recommended.
- Interactive simulator placement.
- The diagram problems and proposed fixes identified by the diagram research.

Include the diagram fix list from:

`docs/DIAGRAM-FIX-PLAN.md`

### Deployment

Do not define a hosting platform or CI/CD strategy.

Hosting and production deployment were intentionally deferred by TICKET-PWM-004 and are currently out of scope.

The plan should only document that:

```text
npm run build