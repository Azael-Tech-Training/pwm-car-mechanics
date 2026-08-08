# TICKET-PWM-001: Audit the current PWM codebase

Label: `wayfinder:research`
Assignee:
Status: OPEN
Blocked By: None

## Question

What exactly is in the `pwm-car-mechanics` repo today, and in what shape? Inventory:

- **Lessons** (`lessons/`): all 8 HTML files. For each: title, what it teaches, which diagrams/widgets it contains (SVG inline? canvas? plain markup?), and how it links to other lessons (prev/next/nav) — note broken or missing links.
- **Shared assets**: `assets/style.css`, `reference/pwm-basics.html` — who uses what.
- **Presentation** (`pwm-presentation/`): the Slidev deck (`slides.md`), its 8 Vue components (which simulator each maps to, which are duplicated across the deck), and deployment configs (`netlify.toml`, `vercel.json`, `.gitignore`).
- **Docs**: README.md, MISSION.md, NOTES.md, RESOURCES.md, `learning-records/` — what each is for and whether the lessons link to them correctly.

Deliverable: a `docs/PWM-AUDIT.md` markdown inventory in the `pwm-car-mechanics` repo (one table per area above), listing what works, what's broken, and what's duplicated between lessons and the deck. This is the factual baseline every later ticket builds on.
