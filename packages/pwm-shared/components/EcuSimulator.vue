<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
})

const FIXED_FREQ = 150
const temp = ref(92)
const fanAngle = ref(0)
let currentSpeed = 0
let rafId = null
let lastTime = 0

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        title: 'Simulador ECU — Control en Lazo Cerrado',
        meta: 'FRECUENCIA FIJA 150 Hz',
        statTemp: 'Temp. Refrigerante',
        statTarget: 'Temp. Objetivo',
        statDuty: 'Ciclo de Trabajo',
        statFreq: 'Frecuencia',
        sensor: 'Sensor ECT',
        ecuMap: 'Mapa ECU',
        driver: 'Driver PWM',
        fan: 'Ventilador',
        scopeLabel: 'Salida PWM del ECU (12 V)',
        fanLabel: 'Ventilador Radiador',
        sliderLabel: 'Temperatura del Refrigerante (Sensor ECT)',
        cold: 'Frío (< 85°C · 0%)',
        optimal: 'Óptimo (90°C)',
        hot: 'Sobrecalentado (> 110°C · 100%)',
        dcOff: '0 Hz (DC OFF)',
        dcOn: '0 Hz (DC ON)',
        callout: (d, f) =>
          `<strong>Concepto clave:</strong> Entre 1% y 99%, el ECU mantiene la frecuencia fija en <strong>${FIXED_FREQ} Hz</strong> y solo cambia el ciclo de trabajo (<strong>${d}%</strong>). En los extremos (0% o 100%), deja de conmutar (<strong>${f}</strong>).`,
      }
    : {
        badge: 'INTERACTIVE',
        title: 'ECU Closed-Loop Feedback Simulator',
        meta: 'FIXED 150 Hz CARRIER',
        statTemp: 'Coolant Temp',
        statTarget: 'Target Setpoint',
        statDuty: 'ECU Duty Cycle',
        statFreq: 'Frequency',
        sensor: 'ECT Sensor',
        ecuMap: 'ECU Map',
        driver: 'PWM Driver',
        fan: 'Radiator Fan',
        scopeLabel: 'ECU Command Signal (12 V)',
        fanLabel: 'Radiator Cooling Fan',
        sliderLabel: 'Adjust Engine Coolant Temperature (ECT Sensor)',
        cold: 'Cold (< 85°C · 0%)',
        optimal: 'Target (90°C)',
        hot: 'Hot (> 110°C · 100%)',
        dcOff: '0 Hz (DC OFF)',
        dcOn: '0 Hz (DC ON)',
        callout: (d, f) =>
          `<strong>Key concept:</strong> Between 1% and 99%, the ECU holds a constant <strong>${FIXED_FREQ} Hz</strong> frequency and modulates only duty cycle (<strong>${d}%</strong>). At 0% or 100% extremes, switching stops completely (<strong>${f}</strong>).`,
      }
)

const dutyCycle = computed(() => {
  if (temp.value < 85) return 0
  if (temp.value > 110) return 100
  return Math.round(((temp.value - 85) / 25) * 100)
})

const freqDisplay = computed(() => {
  if (dutyCycle.value === 0) return copy.value.dcOff
  if (dutyCycle.value === 100) return copy.value.dcOn
  return `${FIXED_FREQ} Hz`
})

// Pure SVG scope: plot x = 42..422 (width 380, 4 cycles = 95px each), yHigh = 22, yLow = 104
const tracePath = computed(() => {
  const duty = dutyCycle.value / 100
  const x0 = 42
  const w = 380
  const yHigh = 22
  const yLow = 104
  const cycles = 4
  const cycleW = w / cycles

  if (duty <= 0) return `M ${x0} ${yLow} L ${x0 + w} ${yLow}`
  if (duty >= 1) return `M ${x0} ${yHigh} L ${x0 + w} ${yHigh}`

  let d = `M ${x0} ${yLow}`
  for (let i = 0; i < cycles; i++) {
    const startX = x0 + i * cycleW
    const onX = startX + cycleW * duty
    const endX = startX + cycleW
    d += ` L ${startX.toFixed(1)} ${yHigh} L ${onX.toFixed(1)} ${yHigh} L ${onX.toFixed(1)} ${yLow} L ${endX.toFixed(1)} ${yLow}`
  }
  return d
})

const tempTone = computed(() => {
  if (temp.value < 85) return 'is-accent'
  if (temp.value <= 98) return 'is-signal'
  if (temp.value <= 108) return 'is-warning'
  return 'is-danger'
})

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now

  const targetDegPerSec = (dutyCycle.value / 100) * 620
  currentSpeed += (targetDegPerSec - currentSpeed) * Math.min(1, dt * 6)
  fanAngle.value = (fanAngle.value + currentSpeed * dt) % 360

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
      <!-- Closed-Loop Pipeline Diagram -->
      <div class="ecu-pipeline">
        <div class="ecu-node">
          <span class="ecu-node-k">{{ copy.sensor }}</span>
          <span class="ecu-node-v pwm-tabular">{{ temp }}°C</span>
        </div>
        <span class="ecu-arrow" aria-hidden="true">→</span>
        <div class="ecu-node">
          <span class="ecu-node-k">{{ copy.ecuMap }}</span>
          <span class="ecu-node-v pwm-tabular">Δ {{ temp - 90 >= 0 ? '+' : '' }}{{ temp - 90 }}°C</span>
        </div>
        <span class="ecu-arrow" aria-hidden="true">→</span>
        <div class="ecu-node is-highlight">
          <span class="ecu-node-k">{{ copy.driver }}</span>
          <span class="ecu-node-v pwm-tabular">{{ dutyCycle }}%</span>
        </div>
        <span class="ecu-arrow" aria-hidden="true">→</span>
        <div class="ecu-node">
          <span class="ecu-node-k">{{ copy.fan }}</span>
          <span class="ecu-node-v pwm-tabular">{{ Math.round((currentSpeed / 620) * 100) }}%</span>
        </div>
      </div>

      <!-- Telemetry Cards -->
      <div class="pwm-stat-grid">
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statTemp }}</div>
          <div class="pwm-stat-value" :class="tempTone">{{ temp }}°C</div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statTarget }}</div>
          <div class="pwm-stat-value is-signal">90°C</div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statDuty }}</div>
          <div class="pwm-stat-value is-accent">{{ dutyCycle }}%</div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statFreq }}</div>
          <div class="pwm-stat-value">{{ freqDisplay }}</div>
        </div>
      </div>

      <!-- Scope + Fan -->
      <div class="ecu-display-grid">
        <div class="pwm-sim-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.scopeLabel }}</span>
            <span class="pwm-tabular">{{ freqDisplay }}</span>
          </div>
          <svg class="ecu-scope-svg" viewBox="0 0 434 126" role="img" :aria-label="copy.scopeLabel">
            <rect x="42" y="10" width="380" height="106" rx="4" fill="#060c0f" stroke="#16282a" stroke-width="1" />
            <g stroke="#102b20" stroke-width="0.9">
              <line v-for="i in 7" :key="'ev-' + i" :x1="42 + i * 47.5" y1="10" :x2="42 + i * 47.5" y2="116" />
              <line x1="42" y1="22" x2="422" y2="22" />
              <line x1="42" y1="63" x2="422" y2="63" stroke-dasharray="3 3" />
              <line x1="42" y1="104" x2="422" y2="104" />
            </g>
            <!-- Non-overlapping axis labels -->
            <g fill="#7c8ea3" font-family="var(--pwm-font-mono)" font-size="10" text-anchor="end">
              <text x="36" y="26">12V</text>
              <text x="36" y="67">6V</text>
              <text x="36" y="108">0V</text>
            </g>
            <path
              :d="tracePath"
              fill="none"
              stroke="#10b981"
              stroke-width="2.6"
              stroke-linejoin="miter"
            />
          </svg>
        </div>

        <div class="pwm-sim-panel ecu-fan-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.fanLabel }}</span>
            <span class="pwm-tabular">{{ dutyCycle }}%</span>
          </div>
          <div class="ecu-fan-center">
            <svg class="ecu-fan-svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="#0d1522" stroke="#2d3f59" stroke-width="2.5" />
              <g :transform="`rotate(${fanAngle.toFixed(1)} 50 50)`">
                <path d="M 50 50 C 40 31 44 13 50 12 C 56 13 60 31 50 50 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 69 40 87 44 88 50 C 87 56 69 60 50 50 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 60 69 56 87 50 88 C 44 87 40 69 50 50 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 31 60 13 56 12 50 C 13 44 31 40 50 50 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#334155'" />
              </g>
              <circle cx="50" cy="50" r="9" fill="#0b1220" stroke="#93c5fd" stroke-width="2" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Temperature Slider -->
      <div class="ecu-slider-box">
        <div class="ecu-slider-head">
          <label for="ecu-temp-slider">{{ copy.sliderLabel }}</label>
          <span class="pwm-tabular ecu-temp-badge">{{ temp }}°C</span>
        </div>
        <div class="ecu-slider-row">
          <span class="ecu-bound is-cold pwm-tabular">75°C</span>
          <input
            id="ecu-temp-slider"
            v-model.number="temp"
            type="range"
            min="75"
            max="115"
            class="pwm-range ecu-temp-range"
          >
          <span class="ecu-bound is-hot pwm-tabular">115°C</span>
        </div>
        <div class="ecu-zones">
          <span class="is-cold">{{ copy.cold }}</span>
          <span class="is-opt">{{ copy.optimal }}</span>
          <span class="is-hot">{{ copy.hot }}</span>
        </div>
      </div>

      <div class="pwm-sim-callout" v-html="copy.callout(dutyCycle, freqDisplay)" />
    </div>
  </div>
</template>

<style scoped>
.ecu-pipeline {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.45rem;
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  padding-block: 0.6rem;
  padding-inline: 0.8rem;
}

.ecu-node {
  flex: 1 1 5.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-radius: 0.4rem;
  padding-block: 0.35rem;
  padding-inline: 0.5rem;
}

.ecu-node.is-highlight {
  border-color: var(--pwm-accent-border);
  background: var(--pwm-accent-soft);
}

.ecu-node-k {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pwm-ink-muted);
}

.ecu-node-v {
  font-family: var(--pwm-font-mono);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--pwm-ink);
}

.ecu-arrow {
  color: var(--pwm-ink-muted);
  font-family: var(--pwm-font-mono);
  font-size: 0.9rem;
}

.ecu-display-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: 1fr;
}

@container (width > 34rem) {
  .ecu-display-grid {
    grid-template-columns: 1.65fr 1fr;
  }
}

.ecu-scope-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.ecu-fan-panel {
  display: flex;
  flex-direction: column;
}

.ecu-fan-center {
  flex: 1;
  display: grid;
  place-items: center;
  padding-block: 0.25rem;
}

.ecu-fan-svg {
  inline-size: 6.25rem;
  block-size: 6.25rem;
}

.ecu-slider-box {
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.ecu-slider-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.ecu-slider-head label {
  font-size: 0.84rem;
  color: var(--pwm-ink-secondary);
}

.ecu-temp-badge {
  font-family: var(--pwm-font-mono);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--pwm-ink);
}

.ecu-slider-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ecu-bound {
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  flex: none;
}

.ecu-temp-range {
  background: linear-gradient(
    to right,
    oklch(0.64 0.19 258),
    oklch(0.74 0.17 160) 40%,
    oklch(0.79 0.16 76) 72%,
    oklch(0.64 0.22 24)
  );
}

.ecu-zones {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  font-size: 0.72rem;
  font-family: var(--pwm-font-mono);
}

.is-cold { color: var(--pwm-accent-hover); }
.is-opt { color: var(--pwm-signal); }
.is-hot { color: var(--pwm-danger); }
</style>
