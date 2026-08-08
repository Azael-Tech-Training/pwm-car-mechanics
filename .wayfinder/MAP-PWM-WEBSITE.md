# [MAP] PWM Website Build Plan

Label: `wayfinder:map`
Status: OPEN

## Destination

A `BUILD-PLAN.md` committed to the `pwm-car-mechanics` repo — a build-ready spec for the website (landing page, interconnected lessons + index, aligned diagrams, React components shared between the website and the Slidev presentation, and deployment), researched and proposed by the learners and reviewed by Arturo. The map ends at the plan, not the build.

## Notes

- Domain: Static-content website engineering, HTML/CSS/JS fundamentals, component sharing across a React website and a Vue (Slidev) deck, diagram SVG quality, static hosting.
- Capacitation Project 1 (Weeks 1–3) — learners (Joel, Diego, Hector) drive the research tickets; Arturo (Mentor) reviews and approves each resolution.
- Skills for resolving sessions: `/wayfinder`, `/research`, `/prototype`, `/domain-modeling`, `frontend-design`.
- Learners follow the workspace conventions: [GIT-WORKFLOW.md](file:///Users/galfan/Developer/alacranium-project/docs/GIT-WORKFLOW.md), [PROJECT-SETUP.md](file:///Users/galfan/Developer/alacranium-project/docs/PROJECT-SETUP.md), [TESTING-GUIDELINES.md](file:///Users/galfan/Developer/alacranium-project/docs/TESTING-GUIDELINES.md).
- Repo: [pwm-car-mechanics](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics) — 8 static HTML lessons (`lessons/`), `assets/style.css`, `reference/pwm-basics.html`, Slidev deck (`pwm-presentation/`) with 8 Vue components.
- Ticket resolution records the learner's proposal + Arturo's approval; deliverables are linked from the ticket, not pasted in.

## Decisions so far

*None yet — frontier open.*

## Frontier Tickets

- [Audit the current PWM codebase](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-001-codebase-audit.md) *(research)*
- [Research build tooling & rendering model](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-002-tooling-rendering-research.md) *(research)*
- [Research React component sharing between site & Slidev](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-003-react-component-sharing.md) *(research)*
- [Research hosting & deployment](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-004-hosting-deployment.md) *(research)*

## Blocked Tickets

- [Propose site architecture & landing page](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-005-site-architecture-landing.md) *(prototype)* — blocked by tooling & rendering research, and React component sharing research.
- [Plan diagram alignment fixes](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-006-diagram-alignment.md) *(prototype)* — blocked by codebase audit, and React component sharing research.
- [Assemble BUILD-PLAN.md](file:///Users/galfan/Developer/alacranium-project/pwm-car-mechanics/.wayfinder/tickets/TICKET-PWM-007-build-plan-assembly.md) *(task)* — blocked by all six tickets above.

## Not yet specified

- Lesson content format: keep the raw HTML lessons as-is vs. convert to MD/MDX in the new pipeline — sharpens once tooling & rendering is chosen.
- Bilingual strategy: lessons are English, the Slidev deck is Spanish — single language vs. i18n.
- Whether `reference/pwm-basics.html` (cheat sheet) becomes part of the site's navigation or stays separate.
- CI/CD specifics (preview deploys per PR, branch strategy) — graduates from the hosting research.

## Out of scope

- Actually building and deploying the website — this map produces the plan; implementation is the next effort.
- PWM content authoring (new lessons, physics theory) — the site reorganizes existing content only.
