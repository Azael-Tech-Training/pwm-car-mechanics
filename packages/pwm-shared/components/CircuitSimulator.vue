<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'low-high', // 'low-high' | 'short-circuit'
  },
  lang: {
    type: String,
    default: 'en',
  },
})

const V_SOURCE = 12.0
const R_FUSE = 0.02
const R_LOAD = 2.0
const R_SHORT = 0.03

const isLowSide = ref(true)
const isSwitchClosed = ref(false)
const isShortActive = ref(false)
const isFuseBlown = ref(false)
const showSpark = ref(false)
const peakFaultCurrent = ref(0)
const peakFaultHeat = ref(0)
const fanAngle = ref(0)

let sparkTimer = null
let blowTimer = null
let rafId = null
let lastTime = 0

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        titleLowHigh: 'Circuitos Low-Side vs High-Side',
        titleShort: 'Simulador de Cortocircuitos y Calentamiento Joule',
        modeLow: 'Low-Side (MOSFET a Tierra)',
        modeHigh: 'High-Side (MOSFET a +12V)',
        statResist: 'Resistencia Total',
        statCurrent: 'Corriente',
        statHeat: 'Calor en Fusible',
        btnGateOn: 'Desactivar Gate (Abrir)',
        btnGateOff: 'Activar Gate (Cerrar)',
        btnSwOpen: 'Abrir Interruptor',
        btnSwClose: 'Cerrar Interruptor',
        btnShortOn: 'Quitar Corto a Tierra',
        btnShortOff: 'Inyectar Corto a Tierra',
        btnReplace: 'Reemplazar Fusible',
        lblBattery: 'Batería 12V',
        lblFuse: 'Fusible 15A',
        lblFan: 'Ventilador',
        lblLowMosfet: 'MOSFET (Low)',
        lblHighMosfet: 'MOSFET (High)',
        lblSwitch: 'Interruptor',
        lblShort: 'Corto a Chasis',
        lblGnd: 'Tierra',
        descBlown: (i, p) =>
          `<strong>¡FUSIBLE FUNDIDO!</strong> El corto creó un camino de ${ (R_FUSE + R_SHORT).toFixed(2) } Ω sin pasar por la carga. La corriente se disparó a <strong>${i} A</strong> generando <strong>${p} W</strong> (P = I²R) en el filamento, fundiéndolo en milisegundos para evitar un incendio.`,
        descLowShort:
          '<strong>Corto a tierra en Low-Side:</strong> El cable de control entre el ventilador y el MOSFET toca el chasis. La corriente evita el interruptor pero sigue pasando por el ventilador (2.0 Ω), limitándose a <strong>5.9 A</strong>. <strong>Síntoma: el ventilador gira al 100% continuamente y el fusible NO se quema.</strong>',
        descHighShortOff:
          '<strong>Corto a tierra en High-Side (Gate OFF):</strong> El cable entre el MOSFET y el ventilador toca tierra, pero el interruptor del lado alto está abierto y bloquea los 12 V. <strong>Prueba activar el Gate para ver qué ocurre.</strong>',
        descShortPre:
          '<strong>Corto antes de la carga:</strong> El aislamiento rozó con el chasis entre el fusible y el ventilador. Aunque el interruptor esté abierto, el corto crea un camino directo de 0.05 Ω a tierra y dispara 240 A.',
        descNormalOn: (i, p) =>
          `<strong>Circuito cerrado (Normal):</strong> La corriente fluye por el fusible, el ventilador (${R_LOAD.toFixed(1)} Ω) y el interruptor hacia tierra. La carga limita la corriente de forma segura a <strong>${i} A</strong> (${p} W en el fusible).`,
        descLowOff:
          '<strong>Circuito abierto (Low-Side OFF):</strong> No hay ruta a tierra, así que fluyen 0 A y el ventilador está detenido. Nota: el cable entre el ventilador y el MOSFET permanece en +12 V ("pull-up") a través del bobinado del motor.',
        descHighOff:
          '<strong>Circuito abierto (High-Side OFF):</strong> El MOSFET del lado de alimentación está abierto. La línea de control y el ventilador están en 0 V sin corriente.',
      }
    : {
        badge: 'INTERACTIVE',
        titleLowHigh: 'Low-Side vs. High-Side Switching',
        titleShort: 'Short-Circuit & Joule Heating Simulator',
        modeLow: 'Low-Side (Ground Switch)',
        modeHigh: 'High-Side (Power Switch)',
        statResist: 'Total Resistance',
        statCurrent: 'Current Flow',
        statHeat: 'Fuse Heat (I²R)',
        btnGateOn: 'Gate Signal: ON',
        btnGateOff: 'Gate Signal: OFF',
        btnSwOpen: 'Open Switch',
        btnSwClose: 'Close Switch',
        btnShortOn: 'Fault: SHORT TO GND',
        btnShortOff: 'Inject Short-to-Ground',
        btnReplace: 'Replace Fuse',
        lblBattery: '12V Battery',
        lblFuse: 'Fuse (15A)',
        lblFan: 'Fan Load',
        lblLowMosfet: 'ECU N-MOSFET',
        lblHighMosfet: 'ECU P-MOSFET',
        lblSwitch: 'Switch',
        lblShort: 'Chassis Short',
        lblGnd: 'Ground',
        descBlown: (i, p) =>
          `<strong>FUSE BLOWN!</strong> Bypassing the 2.0 Ω fan dropped circuit resistance to ${(R_FUSE + R_SHORT).toFixed(2)} Ω. Current surged to <strong>${i} A</strong>, dumping <strong>${p} W</strong> (P = I²R) into the tiny metal link and melting it open to protect the wiring harness.`,
        descLowShort:
          '<strong>Low-Side Short-to-Ground:</strong> The control wire after the fan is pinched to chassis ground. Current bypasses the ECU switch, but still passes through the 2.0 Ω motor windings, capping current at <strong>5.9 A</strong>. <strong>Symptom: fan runs 100% continuously; the fuse stays intact.</strong>',
        descHighShortOff:
          '<strong>High-Side Short-to-Ground (Gate OFF):</strong> The wire between the high-side driver and fan is shorted to chassis, but the open switch blocks +12 V. <strong>Click Gate Signal to close the switch and see the fault!</strong>',
        descShortPre:
          '<strong>Short Before Load:</strong> The 12 V supply wire rubbed through to chassis ground right after the fuse, bypassing both the fan and the switch.',
        descNormalOn: (i, p) =>
          `<strong>Circuit Normal (Closed):</strong> Current flows from battery through the fuse, the ${R_LOAD.toFixed(1)} Ω fan motor, and the closed switch to ground. Load resistance limits current safely to <strong>${i} A</strong> (${p} W fuse heat).`,
        descLowOff:
          '<strong>Circuit Open (Low-Side OFF):</strong> The ground path is broken so 0.0 A flows and the fan is idle. Notice the control wire before the switch pulls up to +12 V through the motor windings.',
        descHighOff:
          '<strong>Circuit Open (High-Side OFF):</strong> The power-side driver is open, disconnecting +12 V from the control line and keeping the fan idle at 0.0 A.',
      }
)

const effectiveTopology = computed(() =>
  props.variant === 'short-circuit' ? 'short-circuit' : isLowSide.value ? 'low-side' : 'high-side'
)

// Physics state
const isDirectShortNow = computed(() => {
  if (isFuseBlown.value || !isShortActive.value) return false
  if (effectiveTopology.value === 'short-circuit') return true
  if (effectiveTopology.value === 'high-side') return isSwitchClosed.value
  return false // Low-side short is AFTER load -> never direct short!
})

const isFanRunning = computed(() => {
  if (isFuseBlown.value) return false
  if (effectiveTopology.value === 'short-circuit') {
    return isSwitchClosed.value && !isShortActive.value
  }
  if (effectiveTopology.value === 'low-side') {
    return isSwitchClosed.value || isShortActive.value
  }
  // high-side
  return isSwitchClosed.value && !isShortActive.value
})

const totalResistance = computed(() => {
  if (isFuseBlown.value) return Infinity
  if (isDirectShortNow.value) return R_FUSE + R_SHORT
  if (isFanRunning.value) return R_FUSE + R_LOAD
  return R_FUSE + R_LOAD
})

const currentAmps = computed(() => {
  if (isFuseBlown.value) return 0
  if (isDirectShortNow.value) return V_SOURCE / (R_FUSE + R_SHORT)
  if (isFanRunning.value) return V_SOURCE / (R_FUSE + R_LOAD)
  return 0
})

const fuseHeatWatts = computed(() => currentAmps.value * currentAmps.value * R_FUSE)

function triggerFuseBlow() {
  if (isFuseBlown.value || blowTimer) return
  peakFaultCurrent.value = V_SOURCE / (R_FUSE + R_SHORT)
  peakFaultHeat.value = peakFaultCurrent.value * peakFaultCurrent.value * R_FUSE
  showSpark.value = true
  blowTimer = setTimeout(() => {
    isFuseBlown.value = true
    blowTimer = null
  }, 260)
  sparkTimer = setTimeout(() => {
    showSpark.value = false
    sparkTimer = null
  }, 550)
}

function clearTimers() {
  if (blowTimer) {
    clearTimeout(blowTimer)
    blowTimer = null
  }
  if (sparkTimer) {
    clearTimeout(sparkTimer)
    sparkTimer = null
  }
}

function setTopology(low) {
  clearTimers()
  isLowSide.value = low
  isSwitchClosed.value = false
  isShortActive.value = false
  isFuseBlown.value = false
  showSpark.value = false
}

function toggleSwitch() {
  if (isFuseBlown.value) return
  isSwitchClosed.value = !isSwitchClosed.value
  if (isDirectShortNow.value) {
    triggerFuseBlow()
  }
}

function toggleShort() {
  if (isFuseBlown.value) return
  isShortActive.value = !isShortActive.value
  if (isDirectShortNow.value) {
    triggerFuseBlow()
  }
}

function replaceFuse() {
  clearTimers()
  isFuseBlown.value = false
  showSpark.value = false
  isSwitchClosed.value = false
  isShortActive.value = false
}

// Wire voltage colors: 'hot' (#ef4444 +12V), 'gnd' (#38bdf8 0V), 'dead' (#475569)
const wireColors = computed(() => {
  const topo = effectiveTopology.value
  if (isFuseBlown.value) {
    return {
      w1: 'hot',
      w2: 'dead',
      w3: 'gnd',
      w4: 'gnd',
      fault: 'gnd',
    }
  }
  if (topo === 'short-circuit') {
    if (isShortActive.value) {
      return { w1: 'hot', w2: 'hot', w3: 'gnd', w4: 'gnd', fault: 'fault' }
    }
    return {
      w1: 'hot',
      w2: 'hot',
      w3: isSwitchClosed.value ? 'gnd' : 'hot',
      w4: 'gnd',
      fault: 'dead',
    }
  }
  if (topo === 'low-side') {
    return {
      w1: 'hot',
      w2: 'hot',
      w3: isShortActive.value || isSwitchClosed.value ? 'gnd' : 'hot',
      w4: 'gnd',
      fault: isShortActive.value ? 'fault' : 'dead',
    }
  }
  // high-side: Slot A = Switch, Slot B = Fan
  return {
    w1: 'hot',
    w2: 'hot',
    w3: isSwitchClosed.value && !isShortActive.value ? 'hot' : 'gnd',
    w4: 'gnd',
    fault: isShortActive.value ? 'fault' : 'dead',
  }
})

// Active current flow path (exact terminal-to-terminal SVG path)
const activeFlowPath = computed(() => {
  if (isFuseBlown.value) return ''
  const topo = effectiveTopology.value
  if (isDirectShortNow.value) {
    if (topo === 'short-circuit') {
      return 'M 58 102 L 58 68 L 184 68 L 184 182'
    }
    // high-side short when gate ON
    return 'M 58 102 L 58 68 L 310 68 L 310 182'
  }
  if (!isFanRunning.value) return ''
  if (topo === 'low-side' && isShortActive.value) {
    // Flows through fuse -> fan -> down into chassis short at x=310
    return 'M 58 102 L 58 68 L 310 68 L 310 182'
  }
  // Normal complete loop to right chassis ground
  return 'M 58 102 L 58 68 L 496 68 L 496 194'
})

const shortTapX = computed(() => (effectiveTopology.value === 'short-circuit' ? 184 : 310))
const fanCenterX = computed(() => (effectiveTopology.value === 'high-side' ? 382 : 238))
const switchCenterX = computed(() => (effectiveTopology.value === 'high-side' ? 238 : 382))

const switchLabel = computed(() => {
  if (props.variant === 'short-circuit') return copy.value.lblSwitch
  return isLowSide.value ? copy.value.lblLowMosfet : copy.value.lblHighMosfet
})

const descriptionHtml = computed(() => {
  const c = copy.value
  if (isFuseBlown.value) {
    return c.descBlown(peakFaultCurrent.value.toFixed(0), peakFaultHeat.value.toFixed(0))
  }
  if (isShortActive.value) {
    if (effectiveTopology.value === 'low-side') return c.descLowShort
    if (effectiveTopology.value === 'high-side') return c.descHighShortOff
    return c.descShortPre
  }
  if (isSwitchClosed.value) {
    return c.descNormalOn(currentAmps.value.toFixed(1), fuseHeatWatts.value.toFixed(2))
  }
  return effectiveTopology.value === 'high-side' ? c.descHighOff : c.descLowOff
})

const calloutTone = computed(() => {
  if (isFuseBlown.value || isDirectShortNow.value) return 'is-danger'
  if (isShortActive.value) return 'is-warning'
  if (isFanRunning.value) return 'is-signal'
  return ''
})

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now
  if (isFanRunning.value) {
    fanAngle.value = (fanAngle.value + 420 * dt) % 360
  }
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  lastTime = performance.now()
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  clearTimers()
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="pwm-sim-shell">
    <div class="pwm-sim-header">
      <span class="pwm-sim-badge">{{ copy.badge }}</span>
      <span class="pwm-sim-title">
        {{ variant === 'short-circuit' ? copy.titleShort : copy.titleLowHigh }}
      </span>
      <span class="pwm-sim-meta">
        {{ effectiveTopology === 'high-side' ? 'HIGH-SIDE' : 'LOW-SIDE' }}
      </span>
    </div>

    <div class="pwm-sim-body">
      <!-- Topology Toggle for Low-Side vs High-Side -->
      <div v-if="variant !== 'short-circuit'" class="pwm-mode-row">
        <button
          type="button"
          class="pwm-btn"
          :class="{ 'is-active': isLowSide }"
          @click="setTopology(true)"
        >
          {{ copy.modeLow }}
        </button>
        <button
          type="button"
          class="pwm-btn"
          :class="{ 'is-active': !isLowSide }"
          @click="setTopology(false)"
        >
          {{ copy.modeHigh }}
        </button>
      </div>

      <!-- Live Telemetry Cards -->
      <div class="pwm-stat-grid">
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statResist }}</div>
          <div class="pwm-stat-value">
            {{ isFuseBlown ? '∞ Ω' : totalResistance.toFixed(2) + ' Ω' }}
          </div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statCurrent }}</div>
          <div
            class="pwm-stat-value"
            :class="{
              'is-danger': currentAmps > 15 || isFuseBlown,
              'is-signal': currentAmps > 0 && currentAmps <= 15,
            }"
          >
            {{ currentAmps.toFixed(1) }} A
          </div>
        </div>
        <div class="pwm-stat-card">
          <div class="pwm-stat-label">{{ copy.statHeat }}</div>
          <div
            class="pwm-stat-value"
            :class="{ 'is-danger': fuseHeatWatts > 20 }"
          >
            {{ fuseHeatWatts.toFixed(fuseHeatWatts >= 100 ? 0 : 2) }} W
          </div>
        </div>
      </div>

      <!-- Mathematically Aligned Schematic SVG -->
      <div class="pwm-sim-panel">
        <svg class="pwm-circuit-svg" viewBox="0 0 560 228" role="img" :aria-label="copy.titleLowHigh">
          <!-- Subtle schematic grid dots -->
          <defs>
            <pattern id="circ-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#182436" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="560" height="228" fill="url(#circ-grid)" rx="6" />

          <!-- === WIRES (all aligned precisely on y = 68 top rail) === -->
          <!-- W1: Battery top (58, 102) -> (58, 68) -> Fuse left (106, 68) -->
          <path d="M 58 102 L 58 68 L 106 68" class="circ-wire" :class="'wire-' + wireColors.w1" />

          <!-- W2: Fuse right (158, 68) -> Slot A left (210, 68) -->
          <path d="M 158 68 L 210 68" class="circ-wire" :class="'wire-' + wireColors.w2" />

          <!-- W3: Slot A right (266, 68) -> Slot B left (354, 68) -->
          <path d="M 266 68 L 354 68" class="circ-wire" :class="'wire-' + wireColors.w3" />

          <!-- W4: Slot B right (410, 68) -> (496, 68) -> Ground (496, 194) -->
          <path d="M 410 68 L 496 68 L 496 194" class="circ-wire" :class="'wire-' + wireColors.w4" />

          <!-- Battery negative to ground (58, 148) -> (58, 194) -->
          <path d="M 58 148 L 58 194" class="circ-wire wire-gnd" />

          <!-- Short-to-Ground Fault Path (when injected) -->
          <g v-if="isShortActive">
            <circle :cx="shortTapX" cy="68" r="4.5" fill="#ef4444" />
            <path
              :d="`M ${shortTapX} 68 L ${shortTapX} 182`"
              stroke="#ef4444"
              stroke-width="3"
              stroke-dasharray="6 4"
              fill="none"
            />
            <!-- Fault Ground Symbol -->
            <g :transform="`translate(${shortTapX}, 182)`" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round">
              <line x1="-13" y1="0" x2="13" y2="0" />
              <line x1="-8" y1="6" x2="8" y2="6" />
              <line x1="-3.5" y1="12" x2="3.5" y2="12" />
            </g>
            <text
              :x="shortTapX"
              y="212"
              fill="#f87171"
              font-family="var(--pwm-font-mono)"
              font-size="10.5"
              font-weight="600"
              text-anchor="middle"
            >
              {{ copy.lblShort }}
            </text>
          </g>

          <!-- Animated Current Flow Overlay (exact path) -->
          <path
            v-if="activeFlowPath"
            :d="activeFlowPath"
            class="circ-flow"
            :class="{ 'is-surge': isDirectShortNow }"
          />

          <!-- === BATTERY (centered x = 58, y = 102..148) === -->
          <g>
            <line x1="40" y1="108" x2="76" y2="108" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
            <line x1="48" y1="120" x2="68" y2="120" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" />
            <line x1="40" y1="132" x2="76" y2="132" stroke="#ef4444" stroke-width="4" stroke-linecap="round" />
            <line x1="48" y1="144" x2="68" y2="144" stroke="#60a5fa" stroke-width="2.5" stroke-linecap="round" />
            <text x="82" y="112" fill="#f87171" font-family="var(--pwm-font-mono)" font-size="11" font-weight="700">+</text>
            <text x="82" y="148" fill="#60a5fa" font-family="var(--pwm-font-mono)" font-size="11" font-weight="700">−</text>
            <text x="58" y="48" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="10.5" text-anchor="middle">
              {{ copy.lblBattery }}
            </text>
            <!-- Left Chassis Ground -->
            <g transform="translate(58, 194)" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round">
              <line x1="-13" y1="0" x2="13" y2="0" />
              <line x1="-8" y1="6" x2="8" y2="6" />
              <line x1="-3.5" y1="12" x2="3.5" y2="12" />
            </g>
          </g>

          <!-- === FUSE (x = 106..158, centered y = 68) === -->
          <g>
            <rect
              x="106"
              y="53"
              width="52"
              height="30"
              rx="6"
              fill="#0f172a"
              :stroke="isFuseBlown ? '#ef4444' : '#475569'"
              stroke-width="2"
            />
            <!-- Intact S-link -->
            <path
              v-if="!isFuseBlown"
              d="M 106 68 C 122 54, 142 82, 158 68"
              fill="none"
              :stroke="isDirectShortNow ? '#ef4444' : '#f59e0b'"
              stroke-width="2.8"
              stroke-linecap="round"
            />
            <!-- Blown melted link -->
            <g v-else stroke="#ef4444" stroke-width="2.6" stroke-linecap="round" fill="none">
              <path d="M 106 68 C 114 60, 118 62, 123 59" />
              <path d="M 142 76 C 148 73, 152 70, 158 68" />
            </g>
            <!-- Terminal caps -->
            <circle cx="106" cy="68" r="3" fill="#cbd5e1" />
            <circle cx="158" cy="68" r="3" fill="#cbd5e1" />
            <!-- Spark burst -->
            <polygon
              v-if="showSpark"
              points="132,44 136,59 150,55 140,68 152,79 136,76 132,91 127,76 112,79 124,68 114,55 128,59"
              fill="#fbbf24"
              stroke="#ef4444"
              stroke-width="1.2"
              class="circ-spark"
            />
            <text x="132" y="38" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="10.5" text-anchor="middle">
              {{ copy.lblFuse }}
            </text>
          </g>

          <!-- === COOLING FAN LOAD (centered fanCenterX, 68; r = 26) === -->
          <g :transform="`translate(${fanCenterX}, 68)`">
            <circle
              cx="0"
              cy="0"
              r="26"
              fill="#0f172a"
              :stroke="isFanRunning ? '#10b981' : '#475569'"
              stroke-width="2.2"
            />
            <!-- Rotating blades inside fan -->
            <g :transform="`rotate(${fanAngle.toFixed(1)})`" opacity="0.85">
              <path d="M 0 0 C -5 -9 -3 -19 0 -20 C 3 -19 5 -9 0 0 Z" :fill="isFanRunning ? '#3b82f6' : '#334155'" />
              <path d="M 0 0 C 9 -5 19 -3 20 0 C 19 3 9 5 0 0 Z" :fill="isFanRunning ? '#3b82f6' : '#334155'" />
              <path d="M 0 0 C 5 9 3 19 0 20 C -3 19 -5 9 0 0 Z" :fill="isFanRunning ? '#3b82f6' : '#334155'" />
              <path d="M 0 0 C -9 5 -19 3 -20 0 C -19 -3 -9 -5 0 0 Z" :fill="isFanRunning ? '#3b82f6' : '#334155'" />
            </g>
            <circle cx="0" cy="0" r="10.5" fill="#0b1220" stroke="#334155" stroke-width="1" />
            <text x="0" y="3.5" fill="#f8fafc" font-family="var(--pwm-font-mono)" font-size="8.5" font-weight="700" text-anchor="middle">
              2Ω
            </text>
            <circle cx="-26" cy="0" r="3" fill="#cbd5e1" />
            <circle cx="26" cy="0" r="3" fill="#cbd5e1" />
            <text x="0" y="-36" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="10.5" text-anchor="middle">
              {{ copy.lblFan }}
            </text>
          </g>

          <!-- === MOSFET / ECU SWITCH (centered switchCenterX, 68; width 56) === -->
          <g :transform="`translate(${switchCenterX}, 68)`">
            <rect
              x="-28"
              y="-22"
              width="56"
              height="44"
              rx="10"
              fill="#0d1526"
              :stroke="isSwitchClosed && !isFuseBlown ? '#10b981' : '#475569'"
              stroke-width="1.8"
              stroke-dasharray="4 3"
            />
            <!-- Contact terminals at (-20, 0) and (20, 0) connected to outer (-28, 0) and (28, 0) -->
            <line x1="-28" y1="0" x2="-18" y2="0" stroke="#94a3b8" stroke-width="2.5" />
            <line x1="18" y1="0" x2="28" y2="0" stroke="#94a3b8" stroke-width="2.5" />
            <!-- Hinged switch blade: exact contact (-18, 0) -> (18, 0) when closed -->
            <line
              x1="-18"
              y1="0"
              :x2="isSwitchClosed ? 18 : 14"
              :y2="isSwitchClosed ? 0 : -15"
              :stroke="isSwitchClosed && !isFuseBlown ? '#10b981' : '#f8fafc'"
              stroke-width="3.2"
              stroke-linecap="round"
            />
            <circle cx="-18" cy="0" r="3.5" fill="#ef4444" />
            <circle cx="18" cy="0" r="3.5" fill="#38bdf8" />
            <text x="0" y="-32" fill="#cbd5e1" font-family="var(--pwm-font-mono)" font-size="10.5" text-anchor="middle">
              {{ switchLabel }}
            </text>
            <text
              x="0"
              y="36"
              :fill="isSwitchClosed ? '#10b981' : '#64748b'"
              font-family="var(--pwm-font-mono)"
              font-size="9.5"
              font-weight="600"
              text-anchor="middle"
            >
              {{ isSwitchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)' }}
            </text>
          </g>

          <!-- === RIGHT CHASSIS GROUND (496, 194) === -->
          <g transform="translate(496, 194)" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round">
            <line x1="-13" y1="0" x2="13" y2="0" />
            <line x1="-8" y1="6" x2="8" y2="6" />
            <line x1="-3.5" y1="12" x2="3.5" y2="12" />
          </g>
          <text x="496" y="220" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="10" text-anchor="middle">
            {{ copy.lblGnd }}
          </text>

          <!-- Voltage Legend -->
          <g transform="translate(106, 212)" font-family="var(--pwm-font-mono)" font-size="9.5">
            <line x1="0" y1="-3" x2="16" y2="-3" stroke="#ef4444" stroke-width="3" />
            <text x="22" y="0" fill="#94a3b8">+12V</text>
            <line x1="72" y1="-3" x2="88" y2="-3" stroke="#38bdf8" stroke-width="3" />
            <text x="94" y="0" fill="#94a3b8">0V GND</text>
            <line x1="158" y1="-3" x2="174" y2="-3" stroke="#10b981" stroke-width="3" stroke-dasharray="4 3" />
            <text x="180" y="0" fill="#94a3b8">Flow (I)</text>
          </g>
        </svg>
      </div>

      <!-- Action Buttons -->
      <div class="pwm-actions-row">
        <button
          type="button"
          class="pwm-btn"
          :class="{ 'is-active': isSwitchClosed }"
          :disabled="isFuseBlown"
          @click="toggleSwitch"
        >
          {{
            variant === 'short-circuit'
              ? isSwitchClosed
                ? copy.btnSwOpen
                : copy.btnSwClose
              : isSwitchClosed
                ? copy.btnGateOn
                : copy.btnGateOff
          }}
        </button>

        <button
          type="button"
          class="pwm-btn is-danger"
          :class="{ 'is-active': isShortActive }"
          :disabled="isFuseBlown"
          @click="toggleShort"
        >
          {{ isShortActive ? copy.btnShortOn : copy.btnShortOff }}
        </button>

        <button
          v-if="isFuseBlown"
          type="button"
          class="pwm-btn is-success"
          @click="replaceFuse"
        >
          {{ copy.btnReplace }}
        </button>
      </div>

      <!-- Diagnostic Status Callout -->
      <div class="pwm-sim-callout" :class="calloutTone" v-html="descriptionHtml" />
    </div>
  </div>
</template>

<style scoped>
.pwm-mode-row,
.pwm-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.pwm-mode-row > .pwm-btn,
.pwm-actions-row > .pwm-btn {
  flex: 1 1 11rem;
}

.pwm-circuit-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.circ-wire {
  fill: none;
  stroke-width: 3.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: stroke 180ms var(--pwm-ease-out);
}

.wire-hot { stroke: #ef4444; }
.wire-gnd { stroke: #38bdf8; }
.wire-dead { stroke: #475569; }
.wire-fault { stroke: #f59e0b; }

.circ-flow {
  fill: none;
  stroke: #10b981;
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 8 10;
  opacity: 0.88;
  animation: pwm-flow-dash 0.75s linear infinite;
}

.circ-flow.is-surge {
  stroke: #fbbf24;
  stroke-width: 5.5;
  animation-duration: 0.22s;
}

@keyframes pwm-flow-dash {
  to {
    stroke-dashoffset: -18;
  }
}

.circ-spark {
  transform-box: fill-box;
  transform-origin: center;
  animation: pwm-spark-pop 0.45s var(--pwm-ease-out);
}

@keyframes pwm-spark-pop {
  0% { opacity: 0; transform: scale(0.4); }
  45% { opacity: 1; transform: scale(1.25); }
  100% { opacity: 0; transform: scale(0.8); }
}
</style>
