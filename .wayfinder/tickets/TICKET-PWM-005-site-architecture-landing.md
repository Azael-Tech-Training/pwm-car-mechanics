# TICKET-PWM-005: Propose site architecture & landing page

Label: `wayfinder:prototype`
Assignee:
Status: OPEN
Blocked By: TICKET-PWM-002

## Question

What should the PWM website's structure be as a Vite-based static MPA?

The website should provide a clear entry point for visitors and an organized way to discover and navigate the educational lessons.

Propose:

- **Landing page**: what the visitor first sees, including the site title, tagline/value proposition, and a clear entry point to the lessons.
- **Lessons index**: a page listing all available lessons with enough information for a visitor to understand what each lesson covers.
- **Lesson navigation**: define the navigation pattern between individual lessons, including previous/next navigation, breadcrumb or section context, and a clear way to return to the lessons index.
- **Routing/site map**: define the complete page structure and URL scheme for the static Vite MPA.
- **Reference/cheat sheet**: determine whether a reference or cheat-sheet page is needed and where it belongs in the site structure.
- **Shared UI structure**: identify which page elements should have a consistent reusable structure across the website, such as header, navigation, lesson navigation, and footer.
- **Interactive content**: define where interactive simulator widgets fit within lesson pages without changing the static MPA architecture.

The presentation/Slidev deck is no longer part of the website scope and must not be included in the proposed site architecture.

## Expected site structure

The proposal should consider a structure similar to:

/
├── landing page
├── lessons/
│   ├── lesson-01/
│   ├── lesson-02/
│   └── ...
└── reference/

The final structure should be based on the actual repository contents and the needs identified during the codebase audit rather than this example being treated as a fixed requirement.

## Deliverable

Produce:

1. A rough wireframe/prototype of the landing page and lessons index.
2. A written site map showing all pages, URLs, and navigation relationships.
3. A description of the proposed lesson navigation pattern.
4. A list of shared UI structures that should be considered for reuse.
5. Any architectural decisions or unresolved questions that should be passed to the build plan.

The prototype should be framework-agnostic and compatible with the Vite + static MPA architecture established by TICKET-PWM-002.

## Constraints

- Do not introduce React.
- Do not include Slidev or presentation pages.
- Do not require client-side routing.
- Do not implement the final website.
- Keep the proposal simple and appropriate for a beginner-friendly educational project.