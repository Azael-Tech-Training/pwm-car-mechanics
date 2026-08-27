# Research: React Component Sharing Between Site & Slidev

## Decision

**Do not pursue React component sharing between the website and Slidev.**

The original requirement assumed that the PWM website and the Slidev presentation needed to share interactive components. This requirement has been removed because the project will no longer use Slidev as part of the website architecture.

## Consequences

- React will not be introduced for component sharing.
- Slidev will not be part of the website architecture.
- React-in-Slidev will not be investigated.
- Migrating the presentation to a React-based slide framework will not be investigated.
- Cross-framework component sharing is no longer required.

Reusable components should instead be researched specifically for the Vite website in a separate component-architecture ticket. That research should determine whether standard JavaScript modules, templates, Web Components, or another lightweight approach is appropriate based on actual code duplication in the repository.

## Status

**CLOSED — Superseded**

**Reason:** The original cross-framework React/Slidev requirement was removed from the project scope. Component reuse within the Vite website will be addressed separately.