<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
})

const scenario = ref('normal50')
const selectedTP = ref('tp2')
const activeTool = ref('scope') // 'dmm' | 'scope'
const dmmMode = ref('V') // 'V' | 'Hz' | 'Duty'
const timebase = ref(2) // ms/div
const voltsDiv = ref(5) // V/div
const triggerLevel = ref(6.0)
const fanAngle = ref(0)

let rafId = null
let lastTime = 0

const scenarios = computed(() =>
  props.lang === 'es'
    ? [
        { value: 'normal50', label: 'Operación Normal (50% Duty @ 100 Hz)' },
        { value: 'normal80', label: 'Operación Normal (80% Duty @ 100 Hz)' },
        { value: 'shortToGnd', label: 'Falla: Corto a Tierra en Cable de Control (TP2)' },
        { value: 'openCircuit', label: 'Falla: Circuito Abierto (Cable Roto en ECU)' },
        { value: 'corrodedGnd', label: 'Falla: Tierra Corroída del ECU (+2.5 V Offset)' },
      ]
    : [
        { value: 'normal50', label: 'Normal Operation (50% Duty @ 100 Hz)' },
        { value: 'normal80', label: 'Normal Operation (80% Duty @ 100 Hz)' },
        { value: 'shortToGnd', label: 'Fault: Short-to-Ground on Control Wire (TP2 pinched)' },
        { value: 'openCircuit', label: 'Fault: Open Circuit (Broken Control Wire at ECU)' },
        { value: 'corrodedGnd', label: 'Fault: Corroded ECU Ground (2.5 V Ground Offset)' },
      ]
)

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'LAB DIAGNÓSTICO',
        title: 'Diagnóstico PWM: Multímetro vs. Osciloscopio',
        selectLabel: 'Condición del Circuito',
        clickHint: 'HAZ CLIC EN TP1, TP2 O TP3 PARA CONECTAR LA PUNTA ROJA',
        btnDmm: 'Multímetro (DMM)',
        btnScope: 'Osciloscopio',
        timebase: 'Base Tiempo',
        voltsDiv: 'Volts/Div',
        trigger: 'Nivel Trigger',
        fuse: 'Fusible',
        fan: 'Ventilador',
        ecu: 'ECU (Low-Side)',
        gnd: 'Chasis',
        corroded: 'Corrosión',
        open: 'Abierto',
        short: 'Corto GND',
      }
    : {
        badge: 'DIAGNOSTIC LAB',
        title: 'PWM Diagnostics: Multimeter vs. Oscilloscope',
        selectLabel: 'Select Circuit Condition',
        clickHint: 'CLICK A TEST POINT (TP1, TP2, TP3) TO CONNECT RED PROBE',
        btnDmm: 'Digital Multimeter',
        btnScope: 'Oscilloscope',
        timebase: 'Timebase',
        voltsDiv: 'Volts/Div',
        trigger: 'Trigger Level',
        fuse: 'Fuse',
        fan: 'Fan',
        ecu: 'ECU Driver',
        gnd: 'Chassis',
        corroded: 'Corrosion',
        open: 'Open',
        short: 'Short GND',
      }
)

const measurement = computed(() => {
  const s = scenario.value
  const freq = 100
  const duty = s === 'normal80' ? 80 : 50
  const vBat = 12.0

  const map = {
    tp1: { vAvg: vBat, vMin: vBat, vMax: vBat, hz: 0, duty: 100, type: 'dc' },
    tp2: { vAvg: 0, vMin: 0, vMax: 0, hz: 0, duty: 0, type: 'dc' },
    tp3: { vAvg: 0, vMin: 0, vMax: 0, hz: 0, duty: 0, type: 'dc' },
  }

  if (s === 'normal50' || s === 'normal80') {
    const dFrac = duty / 100
    map.tp2 = {
      vAvg: vBat * (1 - dFrac),
      vMin: 0,
      vMax: vBat,
      hz: freq,
      duty: 100 - duty, // high-pulse duty measured by DMM on low-side line
      type: 'pwm',
    }
  } else if (s === 'shortToGnd') {
    map.tp2 = { vAvg: 0, vMin: 0, vMax: 0, hz: 0, duty: 0, type: 'dc' }
  } else if (s === 'openCircuit') {
    map.tp2 = { vAvg: vBat, vMin: vBat, vMax: vBat, hz: 0, duty: 100, type: 'dc' }
  } else if (s === 'corrodedGnd') {
    const dFrac = 0.5
    map.tp2 = {
      vAvg: vBat * (1 - dFrac) + 2.5 * dFrac,
      vMin: 2.5,
      vMax: vBat,
      hz: freq,
      duty: 50,
      type: 'pwm-offset',
    }
    map.tp3 = { vAvg: 2.5, vMin: 2.5, vMax: 2.5, hz: 0, duty: 100, type: 'dc' }
  }

  return map[selectedTP.value]
})

const dmmReadout = computed(() => {
  const m = measurement.value
  if (dmmMode.value === 'V') return { label: 'DC VOLTAGE', val: m.vAvg.toFixed(2), unit: 'V' }
  if (dmmMode.value === 'Hz') return { label: 'FREQUENCY', val: m.hz.toFixed(0), unit: 'Hz' }
  return { label: 'DUTY CYCLE (+)', val: m.duty.toFixed(1), unit: '%' }
})

const tpCoords = {
  tp1: { x: 146, y: 66 },
  tp2: { x: 250, y: 66 },
  tp3: { x: 368, y: 152 },
}

// Pure SVG Oscilloscope calculation: plot x = 36..356 (width 320, 10 div), y = 12..156 (height 144, 8 div)
const SCOPE_X0 = 36
const SCOPE_W = 320
const SCOPE_Y0 = 12
const SCOPE_H = 144
const ZERO_Y = SCOPE_Y0 + SCOPE_H - SCOPE_H / 8 // 1 division above bottom = 0V baseline

const pixelsPerVolt = computed(() => SCOPE_H / (8 * voltsDiv.value))

const triggerY = computed(() => {
  const raw = ZERO_Y - triggerLevel.value * pixelsPerVolt.value
  return Math.max(SCOPE_Y0, Math.min(SCOPE_Y0 + SCOPE_H, raw))
})

const scopeWavePath = computed(() => {
  const m = measurement.value
  const ppv = pixelsPerVolt.value
  const totalTimeMs = 10 * timebase.value
  const periodMs = 10.0 // 100 Hz = 10 ms period
  const clampY = (v) => Math.max(SCOPE_Y0 + 2, Math.min(SCOPE_Y0 + SCOPE_H - 2, ZERO_Y - v * ppv))

  if (m.type === 'dc') {
    const y = clampY(m.vAvg)
    return `M ${SCOPE_X0} ${y.toFixed(1)} L ${SCOPE_X0 + SCOPE_W} ${y.toFixed(1)}`
  }

  const yLow = clampY(m.vMin)
  const yHigh = clampY(m.vMax)
  const onFrac = (100 - m.duty) / 100 // low-side switch ON pulls voltage LOW
  const pxPerMs = SCOPE_W / totalTimeMs
  const cyclePx = periodMs * pxPerMs
  const lowPx = cyclePx * onFrac
  const xEnd = SCOPE_X0 + SCOPE_W

  let d = `M ${SCOPE_X0} ${yLow.toFixed(1)}`
  let x = SCOPE_X0
  let safety = 0
  while (x < xEnd - 0.1 && safety < 80) {
    const riseX = Math.min(x + lowPx, xEnd)
    const nextX = Math.min(x + cyclePx, xEnd)
    d += ` L ${riseX.toFixed(1)} ${yLow.toFixed(1)}`
    if (riseX < xEnd) {
      d += ` L ${riseX.toFixed(1)} ${yHigh.toFixed(1)} L ${nextX.toFixed(1)} ${yHigh.toFixed(1)}`
      if (nextX < xEnd) {
        d += ` L ${nextX.toFixed(1)} ${yLow.toFixed(1)}`
      }
    }
    x += cyclePx
    safety += 1
  }
  return d
})

const explanationHtml = computed(() => {
  const tp = selectedTP.value
  const s = scenario.value
  if (props.lang === 'es') {
    if (tp === 'tp1') {
      return '<strong>TP1 (Alimentación +12 V tras el fusible):</strong> Lee 12.00 V constantes. Confirma que la alimentación llega limpia al ventilador.'
    }
    if (tp === 'tp3') {
      return s === 'corrodedGnd'
        ? '<strong>TP3 (Tierra del ECU) — ¡FALLA DETECTADA!:</strong> Marca 2.50 V en lugar de 0.00 V. Una resistencia por corrosión eleva toda la referencia de tierra del ECU.'
        : '<strong>TP3 (Tierra del ECU):</strong> Marca 0.00 V firmes, confirmando una conexión de masa sana al chasis.'
    }
    if (s === 'shortToGnd') {
      return '<strong>TP2 (Línea de control PWM):</strong> Lectura plana de 0.00 V. El cable está en corto a chasis: el ventilador corre al 100% sin control del ECU.'
    }
    if (s === 'openCircuit') {
      return '<strong>TP2 (Línea de control PWM):</strong> Lectura plana de 12.00 V. Con el cable roto en el ECU no fluye corriente y el voltaje sube a 12 V a través del bobinado del motor.'
    }
    if (s === 'corrodedGnd') {
      return '<strong>TP2 (Línea de control PWM):</strong> El multímetro muestra 7.25 V promedio, ocultando el problema. En el <strong>Osciloscopio</strong> verás que el nivel bajo se queda en <strong>2.5 V</strong> en vez de 0 V por tierra corroída.'
    }
    const pct = s === 'normal80' ? 80 : 50
    return `<strong>TP2 (Línea de control PWM):</strong> Con ${pct}% de trabajo low-side, el multímetro promedia ${(12 * (1 - pct / 100)).toFixed(1)} V. El osciloscopio confirma una onda cuadrada limpia entre 0 V (ON) y 12 V (OFF) a 100 Hz.`
  }

  if (tp === 'tp1') {
    return s === 'shortToGnd'
      ? '<strong>TP1 (+12 V Battery Supply):</strong> Reads a steady 12.00 V even during the TP2 control-wire short, because the cooling fan motor winding sits in series and limits current safely.'
      : '<strong>TP1 (+12 V Battery Supply):</strong> Reads a clean, steady 12.00 V right after the fuse, confirming full battery supply is reaching the actuator.'
  }
  if (tp === 'tp3') {
    return s === 'corrodedGnd'
      ? '<strong>TP3 (ECU Ground Pin) — Fault Found!</strong> Reads a constant 2.50 V relative to battery negative. Healthy ground must read 0.00 V. Corrosion in the ground eyelet is raising the entire ECU ground plane.'
      : '<strong>TP3 (ECU Ground Pin):</strong> Reads a solid 0.00 V, proving the ECU has a clean, low-resistance path to chassis ground.'
  }
  if (s === 'shortToGnd') {
    return '<strong>TP2 (PWM Control Line):</strong> Flat 0.00 V. The control wire is pinched to chassis ground, bypassing the ECU MOSFET. <strong>Symptom: fan runs 100% continuously.</strong>'
  }
  if (s === 'openCircuit') {
    return '<strong>TP2 (PWM Control Line):</strong> Flat 12.00 V. Because the wire is broken at the ECU, zero current flows and the wire pulls up to battery voltage through the fan coils. <strong>Symptom: fan is dead.</strong>'
  }
  if (s === 'corrodedGnd') {
    return '<strong>TP2 (PWM Control Line):</strong> A DMM reads 7.25 V average—hiding the real fault! Switch to the <strong>Oscilloscope</strong> to see the low state sitting at <strong>2.5 V instead of 0 V</strong> because of the corroded ECU ground.'
  }
  const pct = s === 'normal80' ? 80 : 50
  return `<strong>TP2 (PWM Control Line):</strong> At ${pct}% low-side duty cycle, a DC voltmeter integrates the pulses to ${(12 * (1 - pct / 100)).toFixed(1)} V. The oscilloscope reveals the true 100 Hz square wave switching cleanly between 0 V (ON) and 12 V (OFF).`
})

const fanSpeedDeg = computed(() => {
  if (scenario.value === 'openCircuit') return 0
  if (scenario.value === 'shortToGnd') return 560
  if (scenario.value === 'normal80') return 440
  if (scenario.value === 'corrodedGnd') return 180
  return 280
})

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now
  if (fanSpeedDeg.value > 0) {
    fanAngle.value = (fanAngle.value + fanSpeedDeg.value * dt) % 360
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
      <span class="pwm-sim-meta">{{ selectedTP.toUpperCase() }}</span>
    </div>

    <div class="pwm-sim-body">
      <!-- Scenario Selector -->
      <div class="diag-scenario-row">
        <label for="diag-scenario-select">{{ copy.selectLabel }}</label>
        <select id="diag-scenario-select" v-model="scenario" class="diag-select">
          <option v-for="item in scenarios" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select>
      </div>

      <div class="diag-main-grid">
        <!-- Left: Mathematically Aligned Interactive Circuit Schematic -->
        <div class="pwm-sim-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.clickHint }}</span>
          </div>

          <svg class="diag-svg" viewBox="0 0 460 218" role="img" :aria-label="copy.title">
            <!-- === WIRES (all connected precisely on y=66 top rail & y=152 ECU ground rail) === -->
            <!-- Battery (42, 100) -> (42, 66) -> Fuse left (78, 66) -->
            <path d="M 42 100 L 42 66 L 78 66" stroke="#ef4444" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
            <!-- Fuse right (122, 66) -> Fan left (170, 66) -->
            <path d="M 122 66 L 170 66" stroke="#ef4444" stroke-width="2.8" fill="none" />
            <!-- Fan right (214, 66) -> ECU MOSFET Drain (316, 66) -->
            <path
              d="M 214 66 L 316 66"
              :stroke="scenario === 'openCircuit' ? '#ef4444' : '#38bdf8'"
              stroke-width="2.8"
              fill="none"
            />
            <!-- ECU Source (316, 106) -> down (316, 152) -> right to Chassis Ground (414, 152) -> (414, 184) -->
            <path
              d="M 316 106 L 316 152 L 414 152 L 414 184"
              :stroke="scenario === 'corrodedGnd' ? '#f59e0b' : '#38bdf8'"
              stroke-width="2.8"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <!-- Battery negative (42, 142) -> (42, 184) -->
            <path d="M 42 142 L 42 184" stroke="#38bdf8" stroke-width="2.8" fill="none" />

            <!-- === FAULT VISUAL OVERLAYS === -->
            <!-- Short to Ground at TP2 -->
            <g v-if="scenario === 'shortToGnd'">
              <path d="M 250 66 L 250 156" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="5 4" />
              <g transform="translate(250, 156)" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round">
                <line x1="-11" y1="0" x2="11" y2="0" />
                <line x1="-7" y1="5" x2="7" y2="5" />
                <line x1="-3" y1="10" x2="3" y2="10" />
              </g>
              <text x="250" y="182" fill="#f87171" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
                {{ copy.short }}
              </text>
            </g>

            <!-- Open Circuit Break at ECU entry -->
            <g v-if="scenario === 'openCircuit'" transform="translate(278, 66)">
              <rect x="-8" y="-8" width="16" height="16" fill="#060c0f" />
              <path d="M -6 -6 L 6 6 M 6 -6 L -6 6" stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" />
              <text x="0" y="-14" fill="#f87171" font-family="var(--pwm-font-mono)" font-size="9" text-anchor="middle">
                {{ copy.open }}
              </text>
            </g>

            <!-- Corroded Ground Resistance -->
            <g v-if="scenario === 'corrodedGnd'" transform="translate(414, 168)">
              <rect x="-10" y="-12" width="20" height="24" fill="#060c0f" />
              <path d="M 0 -12 L -6 -8 L 6 -3 L -6 2 L 6 7 L 0 12" fill="none" stroke="#f59e0b" stroke-width="2.4" stroke-linejoin="round" />
              <text x="-14" y="4" fill="#fbbf24" font-family="var(--pwm-font-mono)" font-size="9" text-anchor="end">
                {{ copy.corroded }}
              </text>
            </g>

            <!-- === BATTERY (x = 42, y = 100..142) === -->
            <g>
              <line x1="27" y1="106" x2="57" y2="106" stroke="#ef4444" stroke-width="3.6" stroke-linecap="round" />
              <line x1="34" y1="117" x2="50" y2="117" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" />
              <line x1="27" y1="128" x2="57" y2="128" stroke="#ef4444" stroke-width="3.6" stroke-linecap="round" />
              <line x1="34" y1="139" x2="50" y2="139" stroke="#60a5fa" stroke-width="2.2" stroke-linecap="round" />
              <text x="42" y="48" fill="#f87171" font-family="var(--pwm-font-mono)" font-size="10" font-weight="600" text-anchor="middle">12V</text>
              <g transform="translate(42, 184)" stroke="#94a3b8" stroke-width="2" stroke-linecap="round">
                <line x1="-11" y1="0" x2="11" y2="0" />
                <line x1="-7" y1="5" x2="7" y2="5" />
                <line x1="-3" y1="10" x2="3" y2="10" />
              </g>
            </g>

            <!-- === FUSE (x = 78..122, y = 66) === -->
            <g>
              <rect x="78" y="54" width="44" height="24" rx="4" fill="#0f172a" stroke="#475569" stroke-width="1.8" />
              <path d="M 78 66 C 90 54, 110 78, 122 66" fill="none" stroke="#f59e0b" stroke-width="2.2" />
              <text x="100" y="44" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
                {{ copy.fuse }}
              </text>
            </g>

            <!-- === FAN (cx = 192, cy = 66, r = 22) === -->
            <g transform="translate(192, 66)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" :stroke="fanSpeedDeg > 0 ? '#10b981' : '#475569'" stroke-width="2" />
              <g :transform="`rotate(${fanAngle.toFixed(1)})`">
                <path d="M 0 0 C -4 -7 -2 -15 0 -16 C 2 -15 4 -7 0 0 Z" :fill="fanSpeedDeg > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 0 0 C 7 -4 15 -2 16 0 C 15 2 7 4 0 0 Z" :fill="fanSpeedDeg > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 0 0 C 4 7 2 15 0 16 C -2 15 -4 7 0 0 Z" :fill="fanSpeedDeg > 0 ? '#3b82f6' : '#334155'" />
                <path d="M 0 0 C -7 4 -15 2 -16 0 C -15 -2 -7 -4 0 0 Z" :fill="fanSpeedDeg > 0 ? '#3b82f6' : '#334155'" />
              </g>
              <circle cx="0" cy="0" r="4.5" fill="#0b1220" stroke="#93c5fd" stroke-width="1.2" />
              <text x="0" y="-30" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
                {{ copy.fan }}
              </text>
            </g>

            <!-- === ECU LOW-SIDE MOSFET ENCLOSURE === -->
            <g>
              <rect x="290" y="34" width="66" height="86" rx="8" fill="#0d1526" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 3" />
              <text x="323" y="26" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
                {{ copy.ecu }}
              </text>
              <!-- MOSFET Drain -> Channel -> Source -->
              <line x1="316" y1="66" x2="316" y2="75" stroke="#e2e8f0" stroke-width="2" />
              <line x1="316" y1="75" x2="332" y2="75" stroke="#e2e8f0" stroke-width="2" />
              <line x1="332" y1="69" x2="332" y2="103" stroke="#e2e8f0" stroke-width="2.2" />
              <line x1="338" y1="72" x2="338" y2="100" stroke="#60a5fa" stroke-width="2" />
              <line x1="338" y1="86" x2="349" y2="86" stroke="#60a5fa" stroke-width="2" />
              <line x1="316" y1="97" x2="332" y2="97" stroke="#e2e8f0" stroke-width="2" />
              <line x1="316" y1="97" x2="316" y2="108" stroke="#e2e8f0" stroke-width="2" />
              <text x="348" y="82" fill="#93c5fd" font-family="var(--pwm-font-mono)" font-size="8" text-anchor="middle">G</text>
              <text x="304" y="75" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="8" text-anchor="end">D</text>
              <text x="304" y="102" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="8" text-anchor="end">S</text>
            </g>

            <!-- === RIGHT CHASSIS GROUND (414, 184) === -->
            <g transform="translate(414, 184)" stroke="#94a3b8" stroke-width="2" stroke-linecap="round">
              <line x1="-11" y1="0" x2="11" y2="0" />
              <line x1="-7" y1="5" x2="7" y2="5" />
              <line x1="-3" y1="10" x2="3" y2="10" />
            </g>
            <text x="414" y="209" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.gnd }}
            </text>

            <!-- Active Probe Lead Indicator -->
            <path
              :d="`M ${tpCoords[selectedTP].x} ${tpCoords[selectedTP].y} Q ${tpCoords[selectedTP].x + 28} ${tpCoords[selectedTP].y - 36}, 442 18`"
              fill="none"
              stroke="#ef4444"
              stroke-width="1.8"
              stroke-dasharray="4 3"
              opacity="0.75"
            />

            <!-- === CLICKABLE TEST POINTS (TP1, TP2, TP3) === -->
            <g
              v-for="(coord, key) in tpCoords"
              :key="key"
              class="diag-tp"
              :class="{ 'is-active': selectedTP === key }"
              :transform="`translate(${coord.x}, ${coord.y})`"
              role="button"
              tabindex="0"
              :aria-label="`Probe ${key.toUpperCase()}`"
              @click="selectedTP = key"
              @keydown.enter.prevent="selectedTP = key"
              @keydown.space.prevent="selectedTP = key"
            >
              <circle cx="0" cy="0" r="14" fill="transparent" />
              <circle cx="0" cy="0" :r="selectedTP === key ? 8.5 : 6.5" class="tp-ring" />
              <text
                x="0"
                :y="key === 'tp3' ? 24 : -13"
                text-anchor="middle"
                font-family="var(--pwm-font-mono)"
                font-size="10.5"
                font-weight="700"
                :fill="selectedTP === key ? '#fca5a5' : '#93c5fd'"
              >
                {{ key.toUpperCase() }}
              </text>
            </g>
          </svg>

          <!-- Accessible TP Quick Buttons -->
          <div class="tp-quick-bar">
            <button
              v-for="tp in ['tp1', 'tp2', 'tp3']"
              :key="tp"
              type="button"
              class="pwm-btn tp-quick-btn"
              :class="{ 'is-danger is-active': selectedTP === tp }"
              @click="selectedTP = tp"
            >
              {{ tp.toUpperCase() }}
            </button>
          </div>
        </div>

        <!-- Right: Instrument Panel (DMM + Oscilloscope) -->
        <div class="pwm-sim-panel diag-instruments">
          <div class="diag-tool-tabs">
            <button
              type="button"
              class="pwm-btn"
              :class="{ 'is-active': activeTool === 'dmm' }"
              @click="activeTool = 'dmm'"
            >
              {{ copy.btnDmm }}
            </button>
            <button
              type="button"
              class="pwm-btn"
              :class="{ 'is-active': activeTool === 'scope' }"
              @click="activeTool = 'scope'"
            >
              {{ copy.btnScope }}
            </button>
          </div>

          <!-- Digital Multimeter -->
          <div v-if="activeTool === 'dmm'" class="dmm-body">
            <div class="dmm-lcd">
              <div class="dmm-lcd-top">
                <span>{{ dmmReadout.label }}</span>
                <span>{{ selectedTP.toUpperCase() }}</span>
              </div>
              <div class="dmm-lcd-value pwm-tabular">
                {{ dmmReadout.val }}<span class="dmm-lcd-unit">{{ dmmReadout.unit }}</span>
              </div>
            </div>
            <div class="dmm-mode-grid">
              <button
                type="button"
                class="pwm-btn dmm-mode-btn"
                :class="{ 'is-active': dmmMode === 'V' }"
                @click="dmmMode = 'V'"
              >
                V DC
              </button>
              <button
                type="button"
                class="pwm-btn dmm-mode-btn"
                :class="{ 'is-active': dmmMode === 'Hz' }"
                @click="dmmMode = 'Hz'"
              >
                Hz
              </button>
              <button
                type="button"
                class="pwm-btn dmm-mode-btn"
                :class="{ 'is-active': dmmMode === 'Duty' }"
                @click="dmmMode = 'Duty'"
              >
                % Duty
              </button>
            </div>
          </div>

          <!-- Oscilloscope -->
          <div v-else class="scope-stack">
            <svg class="diag-scope-svg" viewBox="0 0 368 170" role="img" aria-label="Diagnostic oscilloscope trace">
              <rect x="36" y="12" width="320" height="144" rx="4" fill="#060c0f" stroke="#16282a" stroke-width="1" />
              <!-- 10x8 Graticule -->
              <g stroke="#102b20" stroke-width="0.9">
                <line v-for="i in 9" :key="'sv-' + i" :x1="36 + i * 32" y1="12" :x2="36 + i * 32" y2="156" />
                <line v-for="i in 7" :key="'sh-' + i" x1="36" :y1="12 + i * 18" x2="356" :y2="12 + i * 18" />
              </g>
              <!-- 0V Ground Reference -->
              <line x1="36" :y1="ZERO_Y" x2="356" :y2="ZERO_Y" stroke="#334155" stroke-width="1.2" />
              <text x="31" :y="ZERO_Y + 3" fill="#64748b" font-family="var(--pwm-font-mono)" font-size="9" text-anchor="end">0V</text>
              <text x="31" :y="ZERO_Y - 12 * pixelsPerVolt + 3" fill="#64748b" font-family="var(--pwm-font-mono)" font-size="9" text-anchor="end">
                12V
              </text>

              <!-- Trigger Threshold Line -->
              <line
                x1="36"
                :y1="triggerY"
                x2="356"
                :y2="triggerY"
                stroke="#ef4444"
                stroke-width="1.2"
                stroke-dasharray="4 4"
                opacity="0.65"
              />

              <!-- Waveform -->
              <path
                :d="scopeWavePath"
                fill="none"
                stroke="#10b981"
                stroke-width="2.4"
                stroke-linejoin="miter"
              />
            </svg>

            <div class="scope-knobs">
              <div class="knob-field">
                <label for="diag-tb">{{ copy.timebase }}</label>
                <select id="diag-tb" v-model.number="timebase" class="diag-select-sm">
                  <option :value="1">1 ms/div</option>
                  <option :value="2">2 ms/div</option>
                  <option :value="5">5 ms/div</option>
                </select>
              </div>
              <div class="knob-field">
                <label for="diag-vd">{{ copy.voltsDiv }}</label>
                <select id="diag-vd" v-model.number="voltsDiv" class="diag-select-sm">
                  <option :value="2">2 V/div</option>
                  <option :value="5">5 V/div</option>
                  <option :value="10">10 V/div</option>
                </select>
              </div>
              <div class="knob-field knob-wide">
                <div class="knob-row">
                  <label for="diag-trig">{{ copy.trigger }}</label>
                  <span class="pwm-tabular">{{ triggerLevel.toFixed(1) }} V</span>
                </div>
                <input
                  id="diag-trig"
                  v-model.number="triggerLevel"
                  type="range"
                  min="0"
                  max="15"
                  step="0.5"
                  class="pwm-range"
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="pwm-sim-callout"
        :class="
          scenario === 'corrodedGnd' || scenario === 'shortToGnd' || scenario === 'openCircuit'
            ? 'is-warning'
            : 'is-signal'
        "
        v-html="explanationHtml"
      />
    </div>
  </div>
</template>

<style scoped>
.diag-scenario-row {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.diag-scenario-row label {
  font-size: 0.84rem;
  font-weight: 500;
  color: var(--pwm-ink-secondary);
}

.diag-select,
.diag-select-sm {
  inline-size: 100%;
  background: var(--pwm-bg);
  color: var(--pwm-ink);
  border: 1px solid var(--pwm-border-strong);
  border-radius: var(--pwm-radius-sm);
  padding-block: 0.55rem;
  padding-inline: 0.75rem;
  font-family: var(--pwm-font-sans);
  font-size: max(16px, 0.9rem);
  cursor: pointer;
}

.diag-select-sm {
  padding-block: 0.35rem;
  padding-inline: 0.5rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.82rem;
}

.diag-select:focus-visible,
.diag-select-sm:focus-visible {
  outline: 2px solid var(--pwm-accent-hover);
  outline-offset: 2px;
}

.diag-main-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: 1fr;
}

@container (width > 42rem) {
  .diag-main-grid {
    grid-template-columns: 1.25fr 1fr;
  }
}

.diag-svg,
.diag-scope-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.diag-tp {
  cursor: pointer;
  outline: none;
}

.diag-tp .tp-ring {
  fill: #0f172a;
  stroke: #3b82f6;
  stroke-width: 2.2;
  transition: fill 150ms var(--pwm-ease-out), stroke 150ms var(--pwm-ease-out);
}

.diag-tp.is-active .tp-ring {
  fill: #ef4444;
  stroke: #ffffff;
}

.diag-tp:focus-visible .tp-ring {
  stroke: #fbbf24;
  stroke-width: 3;
}

.tp-quick-bar {
  display: flex;
  gap: 0.45rem;
  margin-block-start: 0.65rem;
}

.tp-quick-btn {
  flex: 1;
  font-family: var(--pwm-font-mono);
  font-size: 0.8rem;
  padding-block: 0.4rem;
}

.diag-instruments {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.diag-tool-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.dmm-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--pwm-surface);
  border: 2px solid var(--pwm-border-strong);
  border-radius: var(--pwm-radius-md);
  padding: 0.9rem;
}

.dmm-lcd {
  background: oklch(0.68 0.05 148);
  color: oklch(0.16 0.02 150);
  border-radius: 0.4rem;
  padding-block: 0.65rem;
  padding-inline: 0.8rem;
  border: 2px solid oklch(0.32 0.03 150);
  font-family: var(--pwm-font-mono);
}

.dmm-lcd-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  font-weight: 700;
  opacity: 0.82;
}

.dmm-lcd-value {
  font-size: 2rem;
  font-weight: 700;
  text-align: end;
  line-height: 1.15;
  margin-block-start: 0.25rem;
}

.dmm-lcd-unit {
  font-size: 0.95rem;
  margin-inline-start: 0.3rem;
}

.dmm-mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.45rem;
}

.dmm-mode-btn {
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  padding-block: 0.4rem;
  padding-inline: 0.4rem;
}

.scope-stack {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.scope-knobs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  padding: 0.65rem;
}

.knob-field {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.knob-field label,
.knob-row {
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
  color: var(--pwm-ink-secondary);
}

.knob-wide {
  grid-column: 1 / -1;
}

.knob-row {
  display: flex;
  justify-content: space-between;
}
</style>
