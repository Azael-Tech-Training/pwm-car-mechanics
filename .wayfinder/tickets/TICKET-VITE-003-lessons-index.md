# TICKET-VITE-003: Create lessons index structure

Label: `wayfinder:prototype`
Assignee:
Status: CLOSED
Blocked By: None

## Prototype

See the lessons index prototype at: `public/lessons-index-prototype.html`

This HTML prototype demonstrates the lessons index structure:
- Ordered list of all 8 lessons with titles and descriptions
- Navigation section with recommended learning path
- Header with links back to home and landing page
- Each lesson links to its individual HTML page (e.g., `/lessons/0001-what-is-pwm-and-why-cars.html`)

The index provides stable URLs for each lesson without client-side routing, matching the MPA approach configured in TICKET-VITE-001. Lesson references follow the pattern `/lessons/<original-filename>.html`.