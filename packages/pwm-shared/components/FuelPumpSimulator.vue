<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
})

const TARGET_PSI = 40.0
const pedal = ref(20)
const railPressure = ref(TARGET_PSI)

// Fuel droplets strictly bounded inside pipe x = 70..226
const droplets = ref([78, 118, 158, 198])

let rafId = null
let lastTime = 0
let pressureVel = 0

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        title: 'Bomba de Combustible PWM (Sistema Sin Retorno)',
        meta: 'PCM 80 Hz → FPDM 20 kHz',
        statPedal: 'Pedal Acelerador',
        statPressure: 'Presión del Riel',
        statDuty: 'Ciclo FPDM',
        statFlow: 'Consumo',
        flowLabel: 'Flujo de Combustible (Tanque → Riel)',
        pump: 'BOMBA',
        rail: 'RIEL',
        scopeLabel: 'Salida FPDM a la Bomba (12 V · 20 kHz)',
        gaugeLabel: 'Manómetro de Presión (FRP)',
        targetNote: 'Objetivo 40 psi',
        sliderLabel: 'Posición del Pedal del Acelerador (Carga del Motor)',
        callout: (d, psi) =>
          `<strong>Control en lazo cerrado:</strong> El PCM ordena al FPDM a <strong>80 Hz</strong>, y el FPDM impulsa la bomba a <strong>20 kHz</strong> con <strong>${d}%</strong> de ciclo de trabajo para sostener la presión cerca de <strong>${psi} psi</strong> sin línea de retorno.`,
      }
    : {
        badge: 'INTERACTIVE',
        title: 'Returnless PWM Fuel Pump Control (PCM → FPDM)',
        meta: 'PCM 80 Hz → FPDM 20 kHz',
        statPedal: 'Throttle Pedal',
        statPressure: 'Fuel Rail Pressure',
        statDuty: 'FPDM Duty Cycle',
        statFlow: 'Fuel Flow',
        flowLabel: 'Fuel Line Delivery (Tank Pump → Injector Rail)',
        pump: 'PUMP',
        rail: 'RAIL',
        scopeLabel: 'FPDM Drive Output (12 V · 20 kHz)',
        gaugeLabel: 'Fuel Rail Pressure (FRP)',
        targetNote: 'Target 40 psi',
        sliderLabel: 'Press Accelerator Pedal (Simulate Engine Load)',
        callout: (d, psi) =>
          `<strong>Closed-loop returnless delivery:</strong> The PCM sends an <strong>80 Hz</strong> command to the FPDM, which drives the pump at <strong>20 kHz</strong> (<strong>${d}%</strong> duty) to hold rail pressure steady near <strong>${psi} psi</strong>—cutting EVAP vapor heat and electrical drain.`,
      }
)

const flowGph = computed(() => 0.5 + (pedal.value / 100) * 14.5)
const dutyCycle = computed(() => 25 + Math.round((pedal.value / 100) * 60))

// Realistic transient pressure dip/surge when pedal moves quickly, followed by PID recovery to 40 psi
watch(pedal, (newVal, oldVal) => {
  const delta = newVal - oldVal
  // More throttle -> injectors open wider -> momentary dip; letting off -> momentary spike
  railPressure.value = Math.max(26, Math.min(54, railPressure.value - delta * 0.12))
})

// Geometrically exact gauge helper: center (80, 86), radius 54, angle -125 deg (0 psi) to +125 deg (80 psi)
const CX = 80
const CY = 86
const R = 54
const MIN_DEG = -125
const MAX_DEG = 125

function polarPoint(radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  }
}

function arcPath(radius, startDeg, endDeg) {
  const start = polarPoint(radius, startDeg)
  const end = polarPoint(radius, endDeg)
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`
}

const bgArcPath = arcPath(R, MIN_DEG, MAX_DEG)
// Target green zone: 36..44 psi
const targetZonePath = arcPath(
  R,
  MIN_DEG + (36 / 80) * (MAX_DEG - MIN_DEG),
  MIN_DEG + (44 / 80) * (MAX_DEG - MIN_DEG)
)

const gaugeTicks = [0, 20, 40, 60, 80].map((val) => {
  const deg = MIN_DEG + (val / 80) * (MAX_DEG - MIN_DEG)
  const outer = polarPoint(R + 3, deg)
  const inner = polarPoint(R - 6, deg)
  const label = polarPoint(R - 16, deg)
  return { val, outer, inner, label }
})

const needleAngle = computed(() => {
  const clamped = Math.max(0, Math.min(80, railPressure.value))
  return MIN_DEG + (clamped / 80) * (MAX_DEG - MIN_DEG)
})

const fillArcPath = computed(() => {
  const clamped = Math.max(0.5, Math.min(80, railPressure.value))
  const endDeg = MIN_DEG + (clamped / 80) * (MAX_DEG - MIN_DEG)
  return arcPath(R, MIN_DEG, endDeg)
})

// Pure SVG scope trace (x = 40..390, width 350, 5 cycles = 70px each)
const scopePath = computed(() => {
  const duty = dutyCycle.value / 100
  const x0 = 40
  const w = 350
  const cycles = 5
  const cycleW = w / cycles
  const yHigh = 16
  const yLow = 84

  let d = `M ${x0} ${yLow}`
  for (let i = 0; i < cycles; i++) {
    const startX = x0 + i * cycleW
    const onX = startX + cycleW * duty
    const endX = startX + cycleW
    d += ` L ${startX.toFixed(1)} ${yHigh} L ${onX.toFixed(1)} ${yHigh} L ${onX.toFixed(1)} ${yLow} L ${endX.toFixed(1)} ${yLow}`
  }
  return d
})

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now

  // Spring-damped closed-loop PID recovery back to 40.0 psi
  const err = TARGET_PSI - railPressure.value
  pressureVel += err * 28 * dt
  pressureVel *= Math.exp(-7.5 * dt)
  railPressure.value += pressureVel * dt
  if (Math.abs(err) < 0.03 && Math.abs(pressureVel) < 0.05) {
    railPressure.value = TARGET_PSI
    pressureVel = 0
  }

  // Advance fuel droplets strictly inside x = 68..228
  const pxPerSec = 32 + (pedal.value / 100) * 165
  droplets.value = droplets.value.map((x) => {
    const nx = x + pxPerSec * dt
    return nx > 228 ? 68 + (nx - 228) : nx
  })

  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  lastTime = performance.now()
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="pwm-sim-shell">
    <div class="pwm-sim-header">
      <span class="pwm-sim-badge">{{ copy.badge }}</span>
      <span class="pwm-sim-title">{{ copy.title }}</span>
      <span class="pwm-sim-meta">{{ copy.meta }}</span>
    </div>

    <div class="pwm-sim-body">
      <!-- Telemetry Cards -->
      <div class="pwm-stat-grid">
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statPedal }}</div>
          <div class="pwm-stat-value">{{ pedal }}%</div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statPressure }}</div>
          <div
            class="pwm-stat-value"
            :class="Math.abs(railPressure - TARGET_PSI) > 2 ? 'is-warning' : 'is-signal'"
          >
            {{ railPressure.toFixed(1) }} psi
          </div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statDuty }}</div>
          <div class="pwm-stat-value is-accent">{{ dutyCycle }}%</div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statFlow }}</div>
          <div class="pwm-stat-value is-warning">{{ flowGph.toFixed(1) }} GPH</div>
        </div>
      </div>

      <div class="fuel-main-grid">
        <!-- Left: Fuel Line Animation + FPDM Oscilloscope -->
        <div class="fuel-left-col">
          <div class="pwm-sim-panel">
            <div class="pwm-sim-panel-label">
              <span>{{ copy.flowLabel }}</span>
              <span class="pwm-tabular">{{ flowGph.toFixed(1) }} GPH</span>
            </div>
            <svg class="fuel-pipe-svg" viewBox="0 0 300 66" role="img" :aria-label="copy.flowLabel">
              <defs>
                <clipPath id="fuel-pipe-clip">
                  <rect x="64" y="25" width="170" height="16" rx="4" />
                </clipPath>
              </defs>

              <!-- Pipe housing -->
              <rect x="62" y="25" width="174" height="16" rx="6" fill="#0d1522" stroke="#334155" stroke-width="1.8" />
              <!-- Subtle fuel fluid fill -->
              <rect x="64" y="27" width="170" height="12" rx="4" fill="#eab308" opacity="0.16" />

              <!-- Properly clipped animated fuel droplets -->
              <g clip-path="url(#fuel-pipe-clip)">
                <circle
                  v-for="(dx, idx) in droplets"
                  :key="idx"
                  :cx="dx.toFixed(1)"
                  cy="33"
                  r="4.2"
                  fill="#fbbf24"
                />
              </g>

              <!-- Pump block (x = 8..64) -->
              <rect x="8" y="13" width="56" height="40" rx="7" fill="#131e33" stroke="#475569" stroke-width="2" />
              <text x="36" y="36" fill="#e2e8f0" font-family="var(--pwm-font-mono)" font-size="10" font-weight="700" text-anchor="middle">
                {{ copy.pump }}
              </text>

              <!-- Fuel Rail block (x = 234..292) -->
              <rect x="234" y="13" width="58" height="40" rx="7" fill="#131e33" stroke="#eab308" stroke-width="2" />
              <text x="263" y="36" fill="#fde047" font-family="var(--pwm-font-mono)" font-size="10" font-weight="700" text-anchor="middle">
                {{ copy.rail }}
              </text>
            </svg>
          </div>

          <div class="pwm-sim-panel">
            <div class="pwm-sim-panel-label">
              <span>{{ copy.scopeLabel }}</span>
              <span class="pwm-tabular">{{ dutyCycle }}%</span>
            </div>
            <svg class="fuel-scope-svg" viewBox="0 0 400 100" role="img" :aria-label="copy.scopeLabel">
              <rect x="40" y="8" width="350" height="84" rx="4" fill="#060c0f" stroke="#16282a" stroke-width="1" />
              <g stroke="#1e2920" stroke-width="0.9">
                <line v-for="i in 9" :key="'fv-' + i" :x1="40 + i * 35" y1="8" :x2="40 + i * 35" y2="92" />
                <line x1="40" y1="16" x2="390" y2="16" />
                <line x1="40" y1="50" x2="390" y2="50" stroke-dasharray="3 3" />
                <line x1="40" y1="84" x2="390" y2="84" />
              </g>
              <g fill="#7c8ea3" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="end">
                <text x="34" y="20">12V</text>
                <text x="34" y="88">0V</text>
              </g>
              <path :d="scopePath" fill="none" stroke="#f59e0b" stroke-width="2.6" stroke-linejoin="miter" />
            </svg>
          </div>
        </div>

        <!-- Right: Geometrically Exact Radial Pressure Gauge -->
        <div class="pwm-sim-panel fuel-gauge-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.gaugeLabel }}</span>
            <span class="fuel-target-tag">{{ copy.targetNote }}</span>
          </div>

          <div class="fuel-gauge-wrap">
            <svg class="fuel-gauge-svg" viewBox="0 0 160 144" role="img" :aria-label="copy.gaugeLabel">
              <!-- Outer dial bezel -->
              <circle cx="80" cy="86" r="64" fill="#0b121e" stroke="#24344d" stroke-width="2" />

              <!-- Background arc (-125° to +125°) -->
              <path :d="bgArcPath" fill="none" stroke="#1e293b" stroke-width="9" stroke-linecap="round" />

              <!-- Active pressure fill arc -->
              <path :d="fillArcPath" fill="none" stroke="#3b82f6" stroke-width="9" stroke-linecap="round" opacity="0.45" />

              <!-- Green target regulation band (36-44 psi) -->
              <path :d="targetZonePath" fill="none" stroke="#10b981" stroke-width="9" stroke-linecap="butt" />

              <!-- Ticks & numbers -->
              <g v-for="t in gaugeTicks" :key="t.val">
                <line
                  :x1="t.outer.x.toFixed(1)"
                  :y1="t.outer.y.toFixed(1)"
                  :x2="t.inner.x.toFixed(1)"
                  :y2="t.inner.y.toFixed(1)"
                  :stroke="t.val === 40 ? '#10b981' : '#64748b'"
                  :stroke-width="t.val === 40 ? 2.4 : 1.5"
                />
                <text
                  :x="t.label.x.toFixed(1)"
                  :y="(t.label.y + 3).toFixed(1)"
                  fill="#94a3b8"
                  font-family="var(--pwm-font-mono)"
                  font-size="8.5"
                  text-anchor="middle"
                >
                  {{ t.val }}
                </text>
              </g>

              <!-- Needle centered mathematically at (80, 86) -->
              <g :transform="`rotate(${needleAngle.toFixed(1)} 80 86)`">
                <line x1="80" y1="92" x2="80" y2="39" stroke="#ef4444" stroke-width="3" stroke-linecap="round" />
              </g>
              <circle cx="80" cy="86" r="6" fill="#0f172a" stroke="#e2e8f0" stroke-width="2" />

              <!-- Clean digital readout strictly below pivot (zero overlap!) -->
              <rect x="46" y="106" width="68" height="22" rx="5" fill="#060c0f" stroke="#24344d" stroke-width="1" />
              <text
                x="80"
                y="121"
                fill="#10b981"
                font-family="var(--pwm-font-mono)"
                font-size="11"
                font-weight="700"
                text-anchor="middle"
              >
                {{ railPressure.toFixed(1) }} psi
              </text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Accelerator Pedal Control -->
      <div class="fuel-slider-box">
        <div class="fuel-slider-head">
          <label for="fuel-pedal-slider">{{ copy.sliderLabel }}</label>
          <span class="fuel-pedal-pill pwm-tabular">{{ pedal }}%</span>
        </div>
        <div class="fuel-slider-row">
          <span class="fuel-bound pwm-tabular">0%</span>
          <input
            id="fuel-pedal-slider"
            v-model.number="pedal"
            type="range"
            min="0"
            max="100"
            class="pwm-range fuel-pedal-range"
          >
          <span class="fuel-bound pwm-tabular">100%</span>
        </div>
      </div>

      <div class="pwm-sim-callout is-signal" v-html="copy.callout(dutyCycle, railPressure.toFixed(1))" />
    </div>
  </div>
</template>

<style scoped>
.fuel-main-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: 1fr;
}

@container (width > 36rem) {
  .fuel-main-grid {
    grid-template-columns: 1.35fr 1fr;
  }
}

.fuel-left-col {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.fuel-pipe-svg,
.fuel-scope-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.fuel-gauge-panel {
  display: flex;
  flex-direction: column;
}

.fuel-target-tag {
  color: var(--pwm-signal);
}

.fuel-gauge-wrap {
  flex: 1;
  display: grid;
  place-items: center;
  padding-block: 0.2rem;
}

.fuel-gauge-svg {
  inline-size: min(100%, 11.5rem);
  block-size: auto;
}

.fuel-slider-box {
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.fuel-slider-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.fuel-slider-head label {
  font-size: 0.84rem;
  color: var(--pwm-ink-secondary);
}

.fuel-pedal-pill {
  background: var(--pwm-surface-raised);
  color: var(--pwm-warning);
  font-family: var(--pwm-font-mono);
  font-size: 0.84rem;
  font-weight: 600;
  padding-block: 0.2rem;
  padding-inline: 0.55rem;
  border-radius: 0.35rem;
}

.fuel-slider-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fuel-bound {
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  color: var(--pwm-ink-muted);
  flex: none;
}

.fuel-pedal-range {
  background: linear-gradient(
    to right,
    oklch(0.32 0.06 250),
    oklch(0.74 0.17 160) 50%,
    oklch(0.79 0.16 76)
  );
}
</style>
