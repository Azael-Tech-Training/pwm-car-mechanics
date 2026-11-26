<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
})

const dutyCycle = ref(50)
const frequency = ref(20)
const fanAngle = ref(0)
const bulbLevel = ref(0.5)

let animationId = null
let lastTime = 0

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        title: 'Simulador PWM',
        source: 'V fuente = 12.0 V',
        dutyLabel: 'Ciclo de Trabajo (Ancho de Pulso)',
        freqLabel: 'Frecuencia (Ciclos/seg)',
        scopeTitle: 'Osciloscopio (Ventana 50 ms)',
        avgV: 'V promedio',
        scale: '5 ms/div',
        actuatorTitle: 'Respuesta del Actuador',
        fan: 'Ventilador',
        bulb: 'Lámpara',
        motorSpeed: 'Velocidad',
        speeds: ['Apagado', 'Baja', 'Media', 'Alta'],
        flickerNote: 'Baja frecuencia (< 20 Hz): se percibe el parpadeo y pulso.',
        smoothNote: 'Alta frecuencia: el ojo y la inercia del motor promedian el pulso.',
      }
    : {
        badge: 'INTERACTIVE',
        title: 'Interactive PWM Simulator',
        source: 'V_source = 12.0 V',
        dutyLabel: 'Duty Cycle (Pulse Width)',
        freqLabel: 'Frequency (Cycles/Sec)',
        scopeTitle: 'Oscilloscope (50 ms Window)',
        avgV: 'Average V',
        scale: '5 ms/div',
        actuatorTitle: 'Actuator Response',
        fan: 'Cooling Fan',
        bulb: 'Indicator Bulb',
        motorSpeed: 'Motor',
        speeds: ['Off', 'Low', 'Medium', 'High'],
        flickerNote: 'Low frequency (< 20 Hz): flicker and uneven motor pulsing are visible.',
        smoothNote: 'Higher frequency: inertia and perception average the pulses smoothly.',
      }
)

const avgVoltage = computed(() => ((12 * dutyCycle.value) / 100).toFixed(2))

const speedLabel = computed(() => {
  const d = dutyCycle.value
  const [off, low, med, high] = copy.value.speeds
  if (d === 0) return off
  if (d > 75) return high
  if (d > 40) return med
  return low
})

// Pure SVG waveform coordinates: x from 42 to 432 (width = 390), yHigh = 24 (12V), yLow = 132 (0V)
const PLOT_X0 = 42
const PLOT_W = 390
const Y_HIGH = 24
const Y_LOW = 132
const WINDOW_SEC = 0.05 // 50 ms

const avgLineY = computed(() => {
  const ratio = dutyCycle.value / 100
  return Y_LOW - ratio * (Y_LOW - Y_HIGH)
})

const wavePath = computed(() => {
  const duty = dutyCycle.value / 100
  const freq = frequency.value
  const xEnd = PLOT_X0 + PLOT_W

  if (duty <= 0) return `M ${PLOT_X0} ${Y_LOW} L ${xEnd} ${Y_LOW}`
  if (duty >= 1) return `M ${PLOT_X0} ${Y_HIGH} L ${xEnd} ${Y_HIGH}`

  const periodSec = 1 / freq
  const totalCycles = WINDOW_SEC / periodSec
  const cyclePx = PLOT_W / totalCycles
  const onPx = cyclePx * duty

  let d = `M ${PLOT_X0} ${Y_LOW}`
  let x = PLOT_X0
  let safety = 0

  while (x < xEnd - 0.1 && safety < 250) {
    const riseX = x
    const fallX = Math.min(x + onPx, xEnd)
    const nextX = Math.min(x + cyclePx, xEnd)

    d += ` L ${riseX.toFixed(2)} ${Y_HIGH} L ${fallX.toFixed(2)} ${Y_HIGH}`
    if (fallX < xEnd) {
      d += ` L ${fallX.toFixed(2)} ${Y_LOW} L ${nextX.toFixed(2)} ${Y_LOW}`
    }
    x += cyclePx
    safety += 1
  }
  return d
})

const presets = [
  { label: '0%', duty: 0, freq: 20 },
  { label: '25%', duty: 25, freq: 20 },
  { label: '50%', duty: 50, freq: 20 },
  { label: '75%', duty: 75, freq: 40 },
  { label: '5 Hz', duty: 50, freq: 5 },
]

function applyPreset(p) {
  dutyCycle.value = p.duty
  frequency.value = p.freq
}

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now

  const duty = dutyCycle.value / 100
  const freq = frequency.value

  // Fan rotational speed with low-frequency pulsing below 15 Hz
  let pulseFactor = 1.0
  if (freq < 15 && duty > 0 && duty < 1) {
    const cyclePhase = ((now / 1000) * freq) % 1.0
    pulseFactor = cyclePhase < duty ? 1.35 : 0.35
  }
  const degPerSec = duty * 640 * pulseFactor
  fanAngle.value = (fanAngle.value + degPerSec * dt) % 360

  // Bulb intensity with visible flicker below 22 Hz
  if (duty === 0) {
    bulbLevel.value = 0
  } else if (duty === 1) {
    bulbLevel.value = 1
  } else if (freq < 22) {
    const cyclePhase = ((now / 1000) * freq) % 1.0
    bulbLevel.value = cyclePhase < duty ? 1 : 0.06
  } else {
    bulbLevel.value = duty
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  lastTime = performance.now()
  animationId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<template>
  <div class="pwm-sim-shell">
    <div class="pwm-sim-header">
      <span class="pwm-sim-badge">{{ copy.badge }}</span>
      <span class="pwm-sim-title">{{ copy.title }}</span>
      <span class="pwm-sim-meta">{{ copy.source }}</span>
    </div>

    <div class="pwm-sim-body">
      <div class="pwm-controls-grid">
        <div class="pwm-control-card">
          <div class="pwm-control-head">
            <label for="pwm-duty-range">{{ copy.dutyLabel }}</label>
            <span class="pwm-pill pwm-tabular">{{ dutyCycle }}%</span>
          </div>
          <input
            id="pwm-duty-range"
            v-model.number="dutyCycle"
            type="range"
            min="0"
            max="100"
            class="pwm-range"
          >
        </div>

        <div class="pwm-control-card">
          <div class="pwm-control-head">
            <label for="pwm-freq-range">{{ copy.freqLabel }}</label>
            <span class="pwm-pill pwm-tabular">{{ frequency }} Hz</span>
          </div>
          <input
            id="pwm-freq-range"
            v-model.number="frequency"
            type="range"
            min="1"
            max="100"
            class="pwm-range"
          >
        </div>
      </div>

      <div class="pwm-presets">
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          class="pwm-btn pwm-preset-btn"
          :class="{ 'is-active': dutyCycle === preset.duty && frequency === preset.freq }"
          @click="applyPreset(preset)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="pwm-output-grid">
        <!-- Oscilloscope SVG -->
        <div class="pwm-sim-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.scopeTitle }}</span>
            <span class="pwm-tabular">{{ copy.scale }}</span>
          </div>

          <svg class="pwm-scope-svg" viewBox="0 0 444 156" role="img" :aria-label="copy.scopeTitle">
            <defs>
              <filter id="pwm-glow" x="-10%" y="-20%" width="120%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <!-- Plot area background -->
            <rect x="42" y="12" width="390" height="132" rx="4" fill="#060c0f" stroke="#16282a" stroke-width="1" />

            <!-- Vertical graticule (10 divisions = 5 ms each) -->
            <g stroke="#112b20" stroke-width="1">
              <line
                v-for="i in 9"
                :key="'v-' + i"
                :x1="42 + i * 39"
                y1="12"
                :x2="42 + i * 39"
                y2="144"
              />
            </g>

            <!-- Horizontal graticule -->
            <g stroke="#112b20" stroke-width="1">
              <line x1="42" y1="24" x2="432" y2="24" />
              <line x1="42" y1="51" x2="432" y2="51" />
              <line x1="42" y1="78" x2="432" y2="78" stroke-dasharray="3 3" />
              <line x1="42" y1="105" x2="432" y2="105" />
              <line x1="42" y1="132" x2="432" y2="132" />
            </g>

            <!-- Dedicated voltage axis labels (zero overlap with trace) -->
            <g fill="#7c8ea3" font-family="var(--pwm-font-mono)" font-size="10" text-anchor="end">
              <text x="36" y="28">12V</text>
              <text x="36" y="82">6V</text>
              <text x="36" y="136">0V</text>
            </g>

            <!-- Average Voltage Reference Line -->
            <line
              x1="42"
              :y1="avgLineY"
              x2="432"
              :y2="avgLineY"
              stroke="#f59e0b"
              stroke-width="1.5"
              stroke-dasharray="5 4"
              opacity="0.85"
            />
            <rect
              x="366"
              :y="Math.max(15, Math.min(avgLineY - 9, 124))"
              width="62"
              height="16"
              rx="3"
              fill="#0b1218"
              stroke="#f59e0b"
              stroke-width="0.9"
              opacity="0.92"
            />
            <text
              x="397"
              :y="Math.max(26, Math.min(avgLineY + 2.5, 135.5))"
              fill="#fbbf24"
              font-family="var(--pwm-font-mono)"
              font-size="9.5"
              text-anchor="middle"
            >
              {{ avgVoltage }}V
            </text>

            <!-- PWM Square Wave -->
            <path
              :d="wavePath"
              fill="none"
              stroke="#10b981"
              stroke-width="2.8"
              stroke-linejoin="miter"
              stroke-linecap="square"
              filter="url(#pwm-glow)"
            />
          </svg>

          <div class="pwm-scope-footer pwm-tabular">
            <span class="pwm-avg-readout">{{ copy.avgV }}: <strong>{{ avgVoltage }} V</strong></span>
            <span>T = {{ (1000 / frequency).toFixed(1) }} ms</span>
          </div>
        </div>

        <!-- Actuators Panel -->
        <div class="pwm-sim-panel pwm-actuator-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.actuatorTitle }}</span>
            <span class="pwm-tabular">{{ dutyCycle }}%</span>
          </div>

          <div class="pwm-actuators-row">
            <!-- Fan -->
            <div class="pwm-actuator-item">
              <svg class="pwm-actuator-svg" viewBox="0 0 72 72" aria-hidden="true">
                <circle cx="36" cy="36" r="32" fill="#0d1522" stroke="#2d3f59" stroke-width="2" />
                <circle cx="36" cy="36" r="27" fill="none" stroke="#1e2f47" stroke-width="1" stroke-dasharray="3 3" />
                <g :transform="`rotate(${fanAngle.toFixed(1)} 36 36)`">
                  <path d="M 36 36 C 28 24 31 11 36 10 C 41 11 44 24 36 36 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#475569'" />
                  <path d="M 36 36 C 48 28 61 31 62 36 C 61 41 48 44 36 36 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#475569'" />
                  <path d="M 36 36 C 44 48 41 61 36 62 C 31 61 28 48 36 36 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#475569'" />
                  <path d="M 36 36 C 24 44 11 41 10 36 C 11 31 24 28 36 36 Z" :fill="dutyCycle > 0 ? '#3b82f6' : '#475569'" />
                </g>
                <circle cx="36" cy="36" r="6" fill="#0b1220" stroke="#93c5fd" stroke-width="1.5" />
              </svg>
              <span class="pwm-actuator-name">{{ copy.fan }}</span>
              <span class="pwm-actuator-stat">{{ copy.motorSpeed }}: {{ speedLabel }}</span>
            </div>

            <!-- Bulb -->
            <div class="pwm-actuator-item">
              <svg class="pwm-actuator-svg" viewBox="0 0 72 72" aria-hidden="true">
                <!-- Glow halo -->
                <circle
                  cx="36"
                  cy="29"
                  r="24"
                  fill="#fbbf24"
                  :opacity="(bulbLevel * 0.28).toFixed(2)"
                />
                <!-- Glass envelope -->
                <path
                  d="M 36 10 C 24 10 17 18 17 28 C 17 35 21 40 25 44 L 26 49 L 46 49 L 47 44 C 51 40 55 35 55 28 C 55 18 48 10 36 10 Z"
                  :fill="`rgba(251, 191, 36, ${(0.08 + bulbLevel * 0.85).toFixed(2)})`"
                  :stroke="bulbLevel > 0.1 ? '#fcd34d' : '#475569'"
                  stroke-width="2"
                />
                <!-- Filament -->
                <path
                  d="M 31 44 L 31 32 L 34 28 L 38 32 L 41 28 L 41 44"
                  fill="none"
                  :stroke="bulbLevel > 0.1 ? '#fffbeb' : '#64748b'"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <!-- Base screw -->
                <rect x="26" y="49" width="20" height="6" rx="1.5" fill="#64748b" />
                <rect x="28" y="55" width="16" height="5" rx="1.5" fill="#475569" />
                <path d="M 31 60 L 41 60 L 39 64 L 33 64 Z" fill="#334155" />
              </svg>
              <span class="pwm-actuator-name">{{ copy.bulb }}</span>
              <span class="pwm-actuator-stat pwm-tabular">{{ Math.round(bulbLevel * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="pwm-sim-callout" :class="frequency < 20 ? 'is-warning' : 'is-signal'">
        {{ frequency < 20 ? copy.flickerNote : copy.smoothNote }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.pwm-controls-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
}

.pwm-control-card {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  padding: 0.85rem;
}

.pwm-control-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.pwm-control-head label {
  font-size: 0.84rem;
  color: var(--pwm-ink-secondary);
  font-weight: 500;
}

.pwm-pill {
  background: var(--pwm-surface-raised);
  color: var(--pwm-accent-hover);
  font-family: var(--pwm-font-mono);
  font-size: 0.82rem;
  font-weight: 600;
  padding-block: 0.2rem;
  padding-inline: 0.55rem;
  border-radius: 0.35rem;
}

.pwm-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.pwm-preset-btn {
  padding-block: 0.35rem;
  padding-inline: 0.7rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
}

.pwm-output-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: 1fr;
}

@container (width > 34rem) {
  .pwm-output-grid {
    grid-template-columns: 1.55fr 1fr;
  }
}

.pwm-scope-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.pwm-scope-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-block-start: 0.5rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
  color: var(--pwm-ink-muted);
}

.pwm-avg-readout {
  color: var(--pwm-warning);
}

.pwm-actuator-panel {
  display: flex;
  flex-direction: column;
}

.pwm-actuators-row {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 1rem;
  padding-block: 0.4rem;
}

.pwm-actuator-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
}

.pwm-actuator-svg {
  inline-size: 4.25rem;
  block-size: 4.25rem;
}

.pwm-actuator-name {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--pwm-ink);
}

.pwm-actuator-stat {
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
  color: var(--pwm-ink-muted);
}
</style>
