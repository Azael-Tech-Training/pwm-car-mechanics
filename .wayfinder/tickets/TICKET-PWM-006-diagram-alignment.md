# TICKET-PWM-006: Plan diagram alignment fixes

Label: `wayfinder:prototype`
Assignee:
Status: OPEN
Blocked By: TICKET-PWM-001, TICKET-PWM-003

## Question

The README calls out that "some diagrams are not well-aligned" in both the lessons and the presentation. Based on the audit's inventory of diagrams:

- **Enumerate** which diagrams are misaligned in the lessons and which in the deck (from the audit), and describe what "misaligned" means for each (SVG coordinates, layout overlap, responsive scaling).
- **Propose the fix approach**: fix diagrams in place in the lessons, or rebuild/migrate them into shared components as part of the React migration — whichever the component-sharing decision makes sensible.
- If migration wins, sketch how each affected diagram becomes a reusable component.

Deliverable: `docs/DIAGRAM-FIX-PLAN.md` listing each problem diagram, its fix, and who owns it — feeding the build plan's implementation section.
