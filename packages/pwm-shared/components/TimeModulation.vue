<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
})

const mode = ref('auto') // 'manual' | 'auto'
const isManualPressed = ref(false)
const dutyCycle = ref(50)
const isAutoOn = ref(false)
const fanSpeedPct = ref(0) // 0..100
const fanAngle = ref(0)

// Scrolling history for live binary-pulse vs fan-inertia chart (90 samples ~ 3 seconds)
const HISTORY_LEN = 90
const signalHistory = ref(Array(HISTORY_LEN).fill(0))
const speedHistory = ref(Array(HISTORY_LEN).fill(0))

let rafId = null
let lastTime = 0
let sampleAccum = 0
let fanSpeedVal = 0 // 0..15 internal units

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        title: 'Modulación de Tiempo e Inercia del Motor',
        modeManual: 'Modo Pulso Manual',
        modeAuto: 'Modo ECU Automático (1 Hz)',
        manualHint: 'Mantén presionado y suelta el botón repetidamente para impulsar el ventilador con pulsos de 12 V.',
        tapOn: '12 V — INTERRUPTOR CERRADO',
        tapOff: '0 V — MANTÉN PRESIONADO',
        dutyLabel: 'Ciclo de Trabajo Comandado por el ECU',
        autoHint: 'Ralentizado a 1 ciclo por segundo (1 Hz) para ver el tiempo ON vs OFF.',
        timeOn: 'Tiempo ON',
        timeOff: 'Tiempo OFF',
        fanLabel: 'Ventilador + LED de Estado',
        statSpeed: 'Velocidad (Inercia)',
        statSignal: 'Señal MOSFET',
        chartTitle: 'Pulso Binario 12 V (verde) vs. Velocidad Suavizada del Motor (azul)',
        callout:
          '<strong>Concepto clave:</strong> El MOSFET solo existe en <strong>100% ON (12 V)</strong> o <strong>100% OFF (0 V)</strong>. La inercia mecánica impide que el motor se frene entre pulsos, promediando el tiempo encendido en velocidad continua.',
      }
    : {
        badge: 'INTERACTIVE',
        title: 'ECU Time-Modulation & Motor Inertia Simulator',
        modeManual: 'Manual Tap Mode',
        modeAuto: 'Auto ECU Mode (1 Hz)',
        manualHint: 'Tap and hold the switch repeatedly to push 12 V pulses and feel how the fan coasts between taps.',
        tapOn: '12 V — SWITCH CLOSED (ON)',
        tapOff: '0 V — PRESS & HOLD SWITCH',
        dutyLabel: 'Commanded ECU Duty Cycle',
        autoHint: 'Slowed to 1 cycle per second (1 Hz) so you can watch ON vs. OFF duration directly.',
        timeOn: 'ON Time',
        timeOff: 'OFF Time',
        fanLabel: 'Actuator Fan & Signal LED',
        statSpeed: 'Motor Speed (Inertia)',
        statSignal: 'MOSFET State',
        chartTitle: 'Binary 12 V Pulses (green) vs. Smoothed Motor Inertia (blue)',
        callout:
          '<strong>The power is in the timing:</strong> A MOSFET is strictly binary—<strong>100% ON (12 V)</strong> or <strong>100% OFF (0 V)</strong>. Mechanical inertia bridges the OFF gaps, averaging ON-time duration into steady rotation.',
      }
)

const timeOnMs = computed(() => dutyCycle.value * 10)
const timeOffMs = computed(() => (100 - dutyCycle.value) * 10)
const isSignalHigh = computed(() => (mode.value === 'manual' ? isManualPressed.value : isAutoOn.value))

function setMode(nextMode) {
  mode.value = nextMode
  isManualPressed.value = false
}

// SVG polyline paths for live scrolling chart (x = 8..392, y = 10..78)
const signalPath = computed(() => {
  const pts = signalHistory.value
  const stepX = 384 / (HISTORY_LEN - 1)
  let d = ''
  for (let i = 0; i < pts.length; i++) {
    const x = 8 + i * stepX
    const y = pts[i] ? 14 : 74
    if (i === 0) {
      d = `M ${x.toFixed(1)} ${y}`
    } else {
      const prevY = pts[i - 1] ? 14 : 74
      if (prevY !== y) d += ` L ${x.toFixed(1)} ${prevY}`
      d += ` L ${x.toFixed(1)} ${y}`
    }
  }
  return d
})

const speedPath = computed(() => {
  const pts = speedHistory.value
  const stepX = 384 / (HISTORY_LEN - 1)
  return pts
    .map((val, i) => {
      const x = 8 + i * stepX
      const y = 74 - (val / 100) * 60
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')
})

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now

  // Deterministic 1 Hz phase clock for Auto mode (updates immediately when slider changes!)
  if (mode.value === 'auto') {
    const phaseMs = now % 1000
    isAutoOn.value = phaseMs < dutyCycle.value * 10
  } else {
    isAutoOn.value = false
  }

  const high = mode.value === 'manual' ? isManualPressed.value : isAutoOn.value

  // Mechanical inertia model: fast acceleration when powered, gentle friction coasting when OFF
  if (high) {
    fanSpeedVal = Math.min(15, fanSpeedVal + 14 * dt)
  } else {
    fanSpeedVal = Math.max(0, fanSpeedVal - 3.6 * dt)
  }

  fanSpeedPct.value = Math.round((fanSpeedVal / 15) * 100)
  fanAngle.value = (fanAngle.value + fanSpeedVal * 46 * dt) % 360

  // Push chart samples at ~30 Hz
  sampleAccum += dt
  if (sampleAccum >= 0.033) {
    sampleAccum = 0
    const nextSig = signalHistory.value.slice(1)
    nextSig.push(high ? 1 : 0)
    signalHistory.value = nextSig

    const nextSpd = speedHistory.value.slice(1)
    nextSpd.push((fanSpeedVal / 15) * 100)
    speedHistory.value = nextSpd
  }

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
      <span class="pwm-sim-meta">{{ mode === 'manual' ? 'MANUAL' : '1 Hz AUTO' }}</span>
    </div>

    <div class="pwm-sim-body">
      <div class="tm-mode-row">
        <button
          type="button"
          class="pwm-btn"
          :class="{ 'is-active': mode === 'manual' }"
          @click="setMode('manual')"
        >
          {{ copy.modeManual }}
        </button>
        <button
          type="button"
          class="pwm-btn"
          :class="{ 'is-active': mode === 'auto' }"
          @click="setMode('auto')"
        >
          {{ copy.modeAuto }}
        </button>
      </div>

      <div class="tm-main-grid">
        <!-- Left Controls -->
        <div class="pwm-sim-panel tm-controls">
          <template v-if="mode === 'manual'">
            <p class="tm-hint">{{ copy.manualHint }}</p>
            <button
              type="button"
              class="pwm-btn tm-tap-btn"
              :class="{ 'is-success': isManualPressed }"
              @pointerdown.prevent="isManualPressed = true"
              @pointerup="isManualPressed = false"
              @pointerleave="isManualPressed = false"
              @pointercancel="isManualPressed = false"
              @keydown.space.prevent="isManualPressed = true"
              @keyup.space="isManualPressed = false"
              @keydown.enter.prevent="isManualPressed = true"
              @keyup.enter="isManualPressed = false"
            >
              {{ isManualPressed ? copy.tapOn : copy.tapOff }}
            </button>
          </template>

          <template v-else>
            <p class="tm-hint">{{ copy.autoHint }}</p>
            <div class="tm-slider-head">
              <label for="tm-duty-slider">{{ copy.dutyLabel }}</label>
              <span class="tm-duty-pill pwm-tabular">{{ dutyCycle }}%</span>
            </div>
            <input
              id="tm-duty-slider"
              v-model.number="dutyCycle"
              type="range"
              min="10"
              max="90"
              step="5"
              class="pwm-range"
            >

            <div class="tm-bar-block">
              <div class="tm-bar-labels pwm-tabular">
                <span class="is-on">{{ copy.timeOn }}: {{ timeOnMs }} ms</span>
                <span class="is-off">{{ copy.timeOff }}: {{ timeOffMs }} ms</span>
              </div>
              <div class="tm-bar-track">
                <div class="tm-bar-on" :style="{ inlineSize: dutyCycle + '%' }" />
                <div class="tm-bar-off" :style="{ inlineSize: 100 - dutyCycle + '%' }" />
              </div>
            </div>
          </template>

          <div class="pwm-stat-grid">
            <div class="pwm-stat-card">
              <div class="pwm-stat-label">{{ copy.statSignal }}</div>
              <div class="pwm-stat-value" :class="isSignalHigh ? 'is-signal' : 'is-danger'">
                {{ isSignalHigh ? '12 V (ON)' : '0 V (OFF)' }}
              </div>
            </div>
            <div class="pwm-stat-card">
              <div class="pwm-stat-label">{{ copy.statSpeed }}</div>
              <div class="pwm-stat-value is-accent">{{ fanSpeedPct }}%</div>
            </div>
          </div>
        </div>

        <!-- Right Fan & LED -->
        <div class="pwm-sim-panel tm-visual">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.fanLabel }}</span>
          </div>
          <div class="tm-visual-body">
            <svg class="tm-fan-svg" viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="45" fill="#0d1522" stroke="#2d3f59" stroke-width="2.5" />
              <g :transform="`rotate(${fanAngle.toFixed(1)} 50 50)`">
                <path d="M 50 50 C 40 31 44 13 50 12 C 56 13 60 31 50 50 Z" :fill="fanSpeedPct > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 69 40 87 44 88 50 C 87 56 69 60 50 50 Z" :fill="fanSpeedPct > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 60 69 56 87 50 88 C 44 87 40 69 50 50 Z" :fill="fanSpeedPct > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 50 50 C 31 60 13 56 12 50 C 13 44 31 40 50 50 Z" :fill="fanSpeedPct > 0 ? '#3b82f6' : '#334155'" />
              </g>
              <circle cx="50" cy="50" r="9" fill="#0b1220" stroke="#93c5fd" stroke-width="2" />
            </svg>

            <div class="tm-led-row">
              <span class="tm-led" :class="{ 'is-lit': isSignalHigh }" />
              <span class="tm-led-text pwm-tabular" :class="{ 'is-lit': isSignalHigh }">
                {{ isSignalHigh ? 'MOSFET ON · 12V' : 'MOSFET OFF · 0V' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Scrolling Binary Pulse vs Inertia Graph -->
      <div class="pwm-sim-panel">
        <div class="pwm-sim-panel-label">
          <span>{{ copy.chartTitle }}</span>
        </div>
        <svg class="tm-chart-svg" viewBox="0 0 400 86" role="img" :aria-label="copy.chartTitle">
          <rect x="4" y="6" width="392" height="74" rx="4" fill="#060c0f" stroke="#16282a" stroke-width="1" />
          <line x1="8" y1="14" x2="392" y2="14" stroke="#112b20" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="8" y1="44" x2="392" y2="44" stroke="#112b20" stroke-width="1" stroke-dasharray="3 3" />
          <line x1="8" y1="74" x2="392" y2="74" stroke="#112b20" stroke-width="1" />
          <!-- Binary 12V pulse trace -->
          <path :d="signalPath" fill="none" stroke="#10b981" stroke-width="2" opacity="0.82" />
          <!-- Smoothed mechanical inertia trace -->
          <path :d="speedPath" fill="none" stroke="#60a5fa" stroke-width="2.6" stroke-linecap="round" />
        </svg>
      </div>

      <div class="pwm-sim-callout is-warning" v-html="copy.callout" />
    </div>
  </div>
</template>

<style scoped>
.tm-mode-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}

.tm-main-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: 1fr;
}

@container (width > 34rem) {
  .tm-main-grid {
    grid-template-columns: 1.35fr 1fr;
  }
}

.tm-controls {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.tm-hint {
  margin: 0;
  font-size: 0.84rem;
  color: var(--pwm-ink-secondary);
  line-height: 1.45;
}

.tm-tap-btn {
  inline-size: 100%;
  padding-block: 1.25rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.tm-slider-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.tm-slider-head label {
  font-size: 0.84rem;
  color: var(--pwm-ink-secondary);
}

.tm-duty-pill {
  background: var(--pwm-surface-raised);
  color: var(--pwm-accent-hover);
  font-family: var(--pwm-font-mono);
  font-size: 0.84rem;
  font-weight: 600;
  padding-block: 0.2rem;
  padding-inline: 0.55rem;
  border-radius: 0.35rem;
}

.tm-bar-block {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tm-bar-labels {
  display: flex;
  justify-content: space-between;
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
}

.tm-bar-labels .is-on { color: var(--pwm-signal); }
.tm-bar-labels .is-off { color: var(--pwm-danger); }

.tm-bar-track {
  display: flex;
  block-size: 1.25rem;
  border-radius: 0.4rem;
  overflow: clip;
  border: 1px solid var(--pwm-border);
}

.tm-bar-on {
  background: var(--pwm-signal);
  transition: inline-size 120ms var(--pwm-ease-out);
}

.tm-bar-off {
  background: color-mix(in oklch, var(--pwm-danger) 70%, black);
  transition: inline-size 120ms var(--pwm-ease-out);
}

.tm-visual {
  display: flex;
  flex-direction: column;
}

.tm-visual-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  padding-block: 0.35rem;
}

.tm-fan-svg {
  inline-size: 6.5rem;
  block-size: 6.5rem;
}

.tm-led-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding-block: 0.35rem;
  padding-inline: 0.75rem;
  border-radius: 999px;
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
}

.tm-led {
  inline-size: 0.7rem;
  block-size: 0.7rem;
  border-radius: 50%;
  background: var(--pwm-ink-muted);
  transition: background-color 80ms var(--pwm-ease-out), box-shadow 80ms var(--pwm-ease-out);
}

.tm-led.is-lit {
  background: var(--pwm-signal);
  box-shadow: 0 0 10px var(--pwm-signal);
}

.tm-led-text {
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
  color: var(--pwm-ink-muted);
}

.tm-led-text.is-lit {
  color: var(--pwm-signal);
}

.tm-chart-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}
</style>
