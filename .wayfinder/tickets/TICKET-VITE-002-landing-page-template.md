# TICKET-VITE-002: Design landing page template

Label: `wayfinder:prototype`
Assignee:
Status: CLOSED
Blocked By: None

## Question

What should the landing page template look like — its layout, navigation to the lessons index, and how it integrates with the Vite build for static deployment?

Deliverable: a rough HTML mockup or outline of the landing page prototype, linked from the ticket as an asset, showing the principal page structure with navigation to lessons index.

## Prototype

See the landing page prototype at: `public/landing-page-prototype.html`

This HTML mockup demonstrates the principal page structure:
- Header with navigation (Home, Lessons)
- Hero section with title/tagline about PWM for automotive electronics
- Introduction section explaining PWM importance for vehicle diagnostics
- Get started call-to-action linking to the lessons index
- Footer with links to principal page and lessons index

The design is static HTML (no client-side routing), matching the MPA approach configured in TICKET-VITE-001. CSS references `/assets/style.css` for future styling integration with the Vite build.