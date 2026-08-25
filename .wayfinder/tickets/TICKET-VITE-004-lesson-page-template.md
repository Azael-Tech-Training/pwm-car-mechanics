# TICKET-VITE-004: Design individual lesson page template

Label: `wayfinder:prototype`
Assignee:
Status: CLOSED
Blocked By: None

## Prototype

See the lesson page prototype at: `public/lesson-prototype-0001.html`

This HTML template demonstrates the individual lesson page structure:
- Header with navigation (Home, Lessons Index, Nav links to prev/next lesson)
- Article with lesson title and content
- Sections covering PWM fundamentals, analog vs. PWM comparison, and diagnostic techniques
- Footer with navigation links to home, lessons index, and neighboring lessons
- The first lesson (0001) serves as the template format; subsequent lessons follow the same structure with different content

Each lesson page links to its neighbors (prev/next) for sequential learning, and all pages reference `/assets/style.css` for consistent styling across the static MPA.

The design follows the MPA approach from TICKET-VITE-001, with each lesson having a stable URL at `/lessons/0001-what-is-pwm-and-why-cars.html` etc.