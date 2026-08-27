# TICKET-PWM-006: Plan diagram alignment fixes

Label: `wayfinder:prototype`
Assignee:
Status: OPEN
Blocked By: TICKET-PWM-001, TICKET-PWM-002

## Question

The README identifies diagram alignment as an existing problem in the PWM website. Based on the codebase audit's inventory of diagrams, identify and plan the fixes required for the website.

## Investigation

For each affected diagram:

- Identify the lesson/page where it is used.
- Identify the diagram implementation (SVG, HTML/CSS, image, or other format).
- Describe the specific alignment problem.
- Determine whether the problem is caused by SVG coordinates, CSS/layout, sizing, overflow, or responsive behavior.
- Determine whether the diagram is duplicated or shared across multiple lessons.
- Assess whether the diagram should be fixed in place or extracted into a reusable component.

The investigation should focus exclusively on the Vite website. The presentation/Slidev deck is no longer part of the project scope.

## Fix strategy

For each affected diagram, propose the simplest appropriate fix.

Prefer fixing the existing implementation when:

- The diagram is only used once.
- The current implementation is otherwise sound.
- The issue is limited to coordinates, sizing, CSS, or responsive behavior.

Consider a reusable component when:

- The same diagram or diagram structure appears in multiple lessons.
- The diagram contains interactive behavior.
- A reusable implementation would eliminate meaningful duplication.
- Multiple diagrams share a clear structural pattern.

Do not introduce React solely to solve diagram reuse.

If reusable components are recommended, describe the proposed component boundary and inputs/outputs at a high level. The specific component architecture should remain consistent with the framework-agnostic Vite approach established by TICKET-PWM-002.

## Deliverable

Produce:

`docs/DIAGRAM-FIX-PLAN.md`

The document should contain:

1. An inventory of all diagrams identified as problematic.
2. The page/lesson where each diagram appears.
3. A description of the current problem.
4. The proposed fix for each diagram.
5. Whether the fix is local or should use a reusable component.
6. Any dependencies or prerequisites for implementation.
7. A recommended implementation order.
8. Any unresolved questions that should be addressed in the build plan.

The document should provide enough information for the later implementation tickets to turn each identified problem into a concrete task.

## Constraints

- Do not modify the diagrams.
- Do not implement the fixes.
- Do not introduce React.
- Do not include Slidev or presentation diagrams.
- Prefer the smallest solution that fixes the actual problem.
- Base the inventory on the actual repository and codebase audit rather than assumptions.