# PWM Car Mechanics

Unified single-source-of-truth web platform for learning and presenting **Pulse Width Modulation (PWM) in Automotive Electronics**.

## Architecture (Single Source of Truth)

This pnpm workspace unifies the **Landing Hub**, the **Learning Site**, the **Slidev Presentation**, and all **shared interactive diagrams & design tokens**:

```text
pwm-car-mechanics/
├── packages/pwm-shared/     # SINGLE SOURCE OF TRUTH
│   ├── styles/tokens.css    # Unified OKLCH design tokens & shared simulator UI
│   ├── data/curriculum.js   # Shared lesson metadata, diagram mapping & resources
│   └── components/          # 8 calibrated bilingual (EN/ES) interactive components:
│       ├── PwmSimulator.vue
│       ├── CircuitSimulator.vue   (low-high & short-circuit modes)
│       ├── DiagnosticsLab.vue     (TP1/TP2/TP3, DMM & Oscilloscope)
│       ├── EcuSimulator.vue       (closed-loop ECT → 150 Hz PWM → fan)
│       ├── FlowComparison.vue     (garden hose vs. low-side electric loop)
│       ├── TimeModulation.vue     (binary 12V pulse vs. inertia graph)
│       ├── FuelPumpSimulator.vue  (PCM 80Hz → FPDM 20kHz + radial gauge)
│       └── QuizWidget.vue
├── site/                    # Unified Landing Hub + Learning Site (Vite + Vue 3)
│   ├── /                    # Landing Page Hub (navigates to Lessons, Presentation, Diagrams, Cheat Sheet)
│   ├── /lessons             # Curriculum Index (8 interconnected lessons)
│   ├── /lessons/:slug       # Lesson 01 → Lesson 08 with Prev/Next/Stepper navigation
│   ├── /diagrams            # Interactive Diagram Sandbox (live EN/ES toggle)
│   └── /reference           # PWM Basics & Diagnostics Cheat Sheet
├── pwm-presentation/        # Slidev Presentation (Spanish deck, consumes @pwm/shared)
│   └── /presentation/       # Mounted under /presentation/ in dev & production builds
└── dist/                    # Combined static production build (Site + Slidev deck)
```

## Quick Start

```bash
# Install workspace dependencies
pnpm install

# Run unified dev server (Hub + Learning Site on :5173, Slidev proxied at /presentation/)
pnpm dev

# Build both the site and Slidev presentation into ./dist
pnpm build

# Preview the combined production build locally
pnpm preview
```

## Key Improvements

- **Unified Landing Hub (`/`)**: Clear entry point to navigate to the Learning Site, the Slidev Presentation, the Shared Diagrams Sandbox, and the Diagnostic Cheat Sheet—with navigation links back to the hub from inside both experiences.
- **Single Source of Truth (`@pwm/shared`)**: Both the English Learning Site and the Spanish Slidev deck import the exact same Vue 3 components and OKLCH design tokens—eliminating duplicated simulator code and visual drift.
- **Polished & Calibrated Diagrams**:
  - **Circuit & Short-Circuit Simulators**: Rebuilt on an exact schematic coordinate grid (no floating wires), true Low-Side ↔ High-Side MOSFET/load topology swap, accurate short-to-ground current & Joule heating physics (`P = I² × R`), and animated current flow along the active fault path.
  - **Diagnostic Lab**: Aligned schematic with clickable `TP1`/`TP2`/`TP3` probes, live fault overlays (pinched ground short, open break, corroded ground resistor), DMM LCD (`V DC / Hz / % Duty`), and SVG oscilloscope (`Timebase / V/div / Trigger`).
  - **Garden Hose vs. Low-Side Circuit**: Connected pressurized hose with downstream nozzle valve and synchronized spinning wheel/fan + pull-up `12V` state indicator.
  - **Time Modulation**: Fixed auto-mode toggle bug, added deterministic 1 Hz clock and live scrolling binary `12V/0V` vs. motor inertia curve.
  - **Fuel Pump Simulator**: Geometrically exact radial pressure gauge centered on needle pivot with transient PID pressure dip/recovery, clipped fuel droplets, and FPDM 12V scope trace.
  - **PWM & ECU Simulators**: Pure crisp SVG oscilloscopes with dedicated axis gutters (zero label overlap) and live average-voltage / closed-loop telemetry.
