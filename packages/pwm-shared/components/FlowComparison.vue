<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  lang: {
    type: String,
    default: 'en',
  },
  showTable: {
    type: Boolean,
    default: true,
  },
})

const isFlowActive = ref(false)
const spinAngle = ref(0)
let rafId = null
let lastTime = 0

const copy = computed(() =>
  props.lang === 'es'
    ? {
        badge: 'INTERACTIVO',
        title: 'Analogía: Manguera de Jardín vs. Circuito Low-Side',
        meta: 'FLUIDO VS. ELÉCTRICO',
        waterTitle: 'Sistema de Agua',
        waterOn: 'FLUYENDO',
        waterOff: 'PRESIÓN · DETENIDO',
        elecTitle: 'Circuito Eléctrico (12 V)',
        elecOn: 'CORRIENTE ACTIVA',
        elecOff: '12 V PULL-UP · 0 A',
        spigot: 'Llave (+)',
        wheel: 'Aspersor',
        nozzle: 'Boquilla (-)',
        drain: 'Drenaje',
        battery: 'Batería 12V',
        fan: 'Ventilador',
        mosfet: 'MOSFET (-)',
        ground: 'Chasis',
        btnOpen: 'Abrir Boquilla / Cerrar MOSFET (Activar Flujo)',
        btnClose: 'Cerrar Boquilla / Abrir MOSFET (Detener Flujo)',
        tableHeaders: ['Agua (Hidráulico)', 'Eléctrico (12 V)', 'Función en el Circuito'],
        rows: [
          ['Llave de agua', 'Batería (+12 V)', 'Fuente de presión / voltaje'],
          ['Manguera', 'Cable conductor', 'Transporta el flujo'],
          ['Rueda aspersora', 'Ventilador (Carga)', 'Consume energía para girar'],
          ['Boquilla al final', 'MOSFET Low-Side', 'Controla la salida al final'],
          ['Drenaje', 'Tierra del Chasis', 'Camino de retorno (0 V)'],
        ],
        descOn:
          '<strong>Flujo Activo (Boquilla Abierta / MOSFET Cerrado):</strong> El lazo en serie está completo. El agua escapa por la boquilla al drenaje haciendo girar la rueda, y la corriente fluye de +12 V por el ventilador y el MOSFET hacia tierra.',
        descOff:
          '<strong>Flujo Detenido (Boquilla Cerrada / MOSFET Abierto):</strong> Aunque hay presión de agua y +12 V hasta justo antes del interruptor ("pull-up" a través del ventilador), al bloquear la salida se detiene <strong>todo</strong> el flujo en la serie.',
      }
    : {
        badge: 'INTERACTIVE',
        title: 'Side-by-Side Analogy: Garden Hose vs. Low-Side Circuit',
        meta: 'FLUID VS. ELECTRICAL',
        waterTitle: '1. Pressurized Garden Hose',
        waterOn: 'WATER FLOWING',
        waterOff: 'PRESSURIZED · 0 FLOW',
        elecTitle: '2. Low-Side Electric Circuit',
        elecOn: 'CURRENT FLOWING',
        elecOff: '12 V PULL-UP · 0 A',
        spigot: 'Spigot (+)',
        wheel: 'Wheel',
        nozzle: 'Nozzle (-)',
        drain: 'Drain',
        battery: '12V Battery',
        fan: 'Fan Load',
        mosfet: 'MOSFET (-)',
        ground: 'Chassis',
        btnOpen: 'Open Nozzle / Close MOSFET (Start Flow)',
        btnClose: 'Close Nozzle / Open MOSFET (Stop Flow)',
        tableHeaders: ['Water Analogy', 'Electrical Circuit', 'Role in Series Loop'],
        rows: [
          ['Water Spigot', 'Battery (+12 V)', 'Pressure / Voltage source'],
          ['Garden Hose', 'Copper Wiring', 'Carries flow / current'],
          ['Sprinkler Wheel', 'Cooling Fan (Load)', 'Converts flow into work'],
          ['End Nozzle Valve', 'Low-Side MOSFET', 'Exit gate controlling flow'],
          ['Drain', 'Chassis Ground (0 V)', 'Return exit path'],
        ],
        descOn:
          '<strong>Flow Active (Nozzle Open / MOSFET Closed):</strong> The series loop is complete! Water exits to the drain spinning the wheel, while electrical current flows from +12 V through the fan and MOSFET to chassis ground.',
        descOff:
          '<strong>Flow Stopped (Nozzle Closed / MOSFET Open):</strong> Pressure and +12 V still sit right up to the valve/MOSFET (the <em>pull-up state</em>), yet blocking the exit halts <strong>all</strong> flow everywhere in the series loop.',
      }
)

function animate(timestamp) {
  const now = timestamp || performance.now()
  const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0.016
  lastTime = now
  if (isFlowActive.value) {
    spinAngle.value = (spinAngle.value + 360 * dt) % 360
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
      <span class="pwm-sim-meta">{{ copy.meta }}</span>
    </div>

    <div class="pwm-sim-body">
      <div class="flow-panels-grid">
        <!-- Panel 1: Water System (viewBox 0 0 320 128, main axis y = 64) -->
        <div class="pwm-sim-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.waterTitle }}</span>
            <span class="flow-badge" :class="{ 'is-on': isFlowActive }">
              {{ isFlowActive ? copy.waterOn : copy.waterOff }}
            </span>
          </div>

          <svg class="flow-svg" viewBox="0 0 320 124" role="img" :aria-label="copy.waterTitle">
            <!-- Outer hose casing -->
            <line x1="48" y1="64" x2="268" y2="64" stroke="#1e293b" stroke-width="14" stroke-linecap="round" />

            <!-- Pressurized water before nozzle (always filled under pressure!) -->
            <line x1="48" y1="64" x2="206" y2="64" stroke="#0284c7" stroke-width="8" opacity="0.55" />

            <!-- Animated flow dashes when nozzle is open -->
            <line
              v-if="isFlowActive"
              x1="48"
              y1="64"
              x2="268"
              y2="64"
              stroke="#38bdf8"
              stroke-width="6.5"
              stroke-dasharray="9 9"
              stroke-linecap="round"
              class="flow-dash"
            />
            <!-- Dry section after closed nozzle -->
            <line
              v-else
              x1="230"
              y1="64"
              x2="268"
              y2="64"
              stroke="#334155"
              stroke-width="6"
            />

            <!-- Spigot (x = 12..48, y = 44..84) -->
            <rect x="12" y="44" width="36" height="40" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2" />
            <rect x="20" y="34" width="20" height="6" rx="2" fill="#38bdf8" />
            <line x1="30" y1="40" x2="30" y2="44" stroke="#94a3b8" stroke-width="3" />
            <text x="30" y="68" fill="#e2e8f0" font-family="var(--pwm-font-mono)" font-size="9" font-weight="700" text-anchor="middle">
              H₂O
            </text>
            <text x="30" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.spigot }}
            </text>

            <!-- Sprinkler Wheel (cx = 124, cy = 64, r = 22) -->
            <g transform="translate(124, 64)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" :stroke="isFlowActive ? '#38bdf8' : '#475569'" stroke-width="2.2" />
              <g :transform="`rotate(${spinAngle.toFixed(1)})`">
                <line x1="0" y1="-16" x2="0" y2="16" :stroke="isFlowActive ? '#38bdf8' : '#64748b'" stroke-width="3" stroke-linecap="round" />
                <line x1="-16" y1="0" x2="16" y2="0" :stroke="isFlowActive ? '#38bdf8' : '#64748b'" stroke-width="3" stroke-linecap="round" />
                <line x1="-11" y1="-11" x2="11" y2="11" :stroke="isFlowActive ? '#7dd3fc' : '#475569'" stroke-width="2" stroke-linecap="round" />
                <line x1="11" y1="-11" x2="-11" y2="11" :stroke="isFlowActive ? '#7dd3fc' : '#475569'" stroke-width="2" stroke-linecap="round" />
              </g>
              <circle cx="0" cy="0" r="5" fill="#0b1220" stroke="#94a3b8" stroke-width="1.5" />
            </g>
            <text x="124" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.wheel }}
            </text>

            <!-- Pressure indicator badge between wheel & nozzle -->
            <text x="176" y="42" fill="#38bdf8" font-family="var(--pwm-font-mono)" font-size="8.5" text-anchor="middle">
              {{ isFlowActive ? 'FLOW' : 'PRESSURE' }}
            </text>

            <!-- Low-Side Nozzle Valve (x = 204..232, y = 46..82) -->
            <g transform="translate(218, 64)">
              <rect
                x="-14"
                y="-18"
                width="28"
                height="36"
                rx="6"
                fill="#0f172a"
                :stroke="isFlowActive ? '#10b981' : '#f59e0b'"
                stroke-width="2"
              />
              <!-- Gate bar: vertical = blocked, horizontal = open -->
              <line
                v-if="!isFlowActive"
                x1="0"
                y1="-11"
                x2="0"
                y2="11"
                stroke="#f59e0b"
                stroke-width="4"
                stroke-linecap="round"
              />
              <line
                v-else
                x1="-10"
                y1="0"
                x2="10"
                y2="0"
                stroke="#10b981"
                stroke-width="4"
                stroke-linecap="round"
              />
            </g>
            <text x="218" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.nozzle }}
            </text>

            <!-- Drain (x = 268..306, y = 46..82) -->
            <g>
              <rect x="268" y="46" width="38" height="36" rx="6" fill="#0d1526" stroke="#334155" stroke-width="2" />
              <line x1="278" y1="54" x2="278" y2="74" stroke="#475569" stroke-width="2" />
              <line x1="287" y1="54" x2="287" y2="74" stroke="#475569" stroke-width="2" />
              <line x1="296" y1="54" x2="296" y2="74" stroke="#475569" stroke-width="2" />
              <text x="287" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
                {{ copy.drain }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Panel 2: Electric Circuit (viewBox 0 0 320 124, main axis y = 64) -->
        <div class="pwm-sim-panel">
          <div class="pwm-sim-panel-label">
            <span>{{ copy.elecTitle }}</span>
            <span class="flow-badge" :class="{ 'is-on': isFlowActive }">
              {{ isFlowActive ? copy.elecOn : copy.elecOff }}
            </span>
          </div>

          <svg class="flow-svg" viewBox="0 0 320 124" role="img" :aria-label="copy.elecTitle">
            <!-- Wire 1: Battery (48, 64) -> Fan (102, 64) ALWAYS +12V -->
            <line x1="48" y1="64" x2="102" y2="64" stroke="#ef4444" stroke-width="3.5" />

            <!-- Wire 2: Fan (146, 64) -> MOSFET (202, 64): +12V pull-up when OFF, 0V when ON -->
            <line
              x1="146"
              y1="64"
              x2="202"
              y2="64"
              :stroke="isFlowActive ? '#38bdf8' : '#ef4444'"
              stroke-width="3.5"
            />

            <!-- Wire 3: MOSFET (234, 64) -> Ground drop (286, 64) -> (286, 84) -->
            <path d="M 234 64 L 286 64 L 286 84" stroke="#38bdf8" stroke-width="3.5" fill="none" stroke-linejoin="round" />

            <!-- Animated current flow dashes -->
            <path
              v-if="isFlowActive"
              d="M 48 64 L 286 64 L 286 84"
              fill="none"
              stroke="#10b981"
              stroke-width="5"
              stroke-dasharray="8 9"
              stroke-linecap="round"
              class="flow-dash"
            />

            <!-- 12V Battery (x = 12..48, y = 44..84) -->
            <rect x="12" y="44" width="36" height="40" rx="6" fill="#1f1218" stroke="#ef4444" stroke-width="2" />
            <text x="30" y="68" fill="#fca5a5" font-family="var(--pwm-font-mono)" font-size="10.5" font-weight="700" text-anchor="middle">
              12V
            </text>
            <text x="30" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.battery }}
            </text>

            <!-- Cooling Fan Load (cx = 124, cy = 64, r = 22) -->
            <g transform="translate(124, 64)">
              <circle cx="0" cy="0" r="22" fill="#0f172a" :stroke="isFlowActive ? '#10b981' : '#475569'" stroke-width="2.2" />
              <g :transform="`rotate(${spinAngle.toFixed(1)})`">
                <path d="M 0 0 C -4 -7 -2 -15 0 -16 C 2 -15 4 -7 0 0 Z" :fill="isFlowActive ? '#3b82f6' : '#475569'" />
                <path d="M 0 0 C 7 -4 15 -2 16 0 C 15 2 7 4 0 0 Z" :fill="isFlowActive ? '#3b82f6' : '#475569'" />
                <path d="M 0 0 C 4 7 2 15 0 16 C -2 15 -4 7 0 0 Z" :fill="isFlowActive ? '#3b82f6' : '#475569'" />
                <path d="M 0 0 C -7 4 -15 2 -16 0 C -15 -2 -7 -4 0 0 Z" :fill="isFlowActive ? '#3b82f6' : '#475569'" />
              </g>
              <circle cx="0" cy="0" r="4.5" fill="#0b1220" stroke="#93c5fd" stroke-width="1.2" />
            </g>
            <text x="124" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.fan }}
            </text>

            <!-- Pull-up voltage badge between Fan and MOSFET -->
            <text
              x="174"
              y="42"
              :fill="isFlowActive ? '#10b981' : '#f87171'"
              font-family="var(--pwm-font-mono)"
              font-size="9"
              font-weight="700"
              text-anchor="middle"
            >
              {{ isFlowActive ? '0V (ON)' : '12V PULL-UP' }}
            </text>

            <!-- Low-Side MOSFET Switch (x = 202..234, centered 218, 64) -->
            <g transform="translate(218, 64)">
              <rect
                x="-16"
                y="-18"
                width="32"
                height="36"
                rx="6"
                fill="#0d1526"
                :stroke="isFlowActive ? '#10b981' : '#475569'"
                stroke-width="2"
              />
              <!-- Exact hinged blade from (-10, 0) to (10, 0) when closed -->
              <line
                x1="-10"
                y1="0"
                :x2="isFlowActive ? 10 : 7"
                :y2="isFlowActive ? 0 : -11"
                :stroke="isFlowActive ? '#10b981' : '#f8fafc'"
                stroke-width="2.8"
                stroke-linecap="round"
              />
              <circle cx="-10" cy="0" r="2.8" fill="#ef4444" />
              <circle cx="10" cy="0" r="2.8" fill="#38bdf8" />
            </g>
            <text x="218" y="106" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.mosfet }}
            </text>

            <!-- Proper Vertical Chassis Ground Symbol at (286, 84) -->
            <g transform="translate(286, 84)" stroke="#94a3b8" stroke-width="2.2" stroke-linecap="round">
              <line x1="-13" y1="0" x2="13" y2="0" />
              <line x1="-8" y1="5.5" x2="8" y2="5.5" />
              <line x1="-3.5" y1="11" x2="3.5" y2="11" />
            </g>
            <text x="286" y="110" fill="#94a3b8" font-family="var(--pwm-font-mono)" font-size="9.5" text-anchor="middle">
              {{ copy.ground }}
            </text>
          </svg>
        </div>
      </div>

      <button
        type="button"
        class="pwm-btn flow-toggle-btn"
        :class="{ 'is-active': isFlowActive }"
        @click="isFlowActive = !isFlowActive"
      >
        {{ isFlowActive ? copy.btnClose : copy.btnOpen }}
      </button>

      <!-- Analogy Table -->
      <div v-if="showTable" class="flow-table-wrap">
        <table class="flow-table">
          <thead>
            <tr>
              <th v-for="h in copy.tableHeaders" :key="h">{{ h }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in copy.rows" :key="idx">
              <td class="is-water">{{ row[0] }}</td>
              <td class="is-elec">{{ row[1] }}</td>
              <td>{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="pwm-sim-callout"
        :class="isFlowActive ? 'is-signal' : 'is-warning'"
        v-html="isFlowActive ? copy.descOn : copy.descOff"
      />
    </div>
  </div>
</template>

<style scoped>
.flow-panels-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
}

.flow-badge {
  font-family: var(--pwm-font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  padding-block: 0.15rem;
  padding-inline: 0.45rem;
  border-radius: 0.3rem;
  background: var(--pwm-surface-raised);
  color: var(--pwm-ink-secondary);
}

.flow-badge.is-on {
  background: var(--pwm-signal-soft);
  color: var(--pwm-signal);
}

.flow-svg {
  inline-size: 100%;
  block-size: auto;
  display: block;
}

.flow-dash {
  animation: flow-slide 0.7s linear infinite;
}

@keyframes flow-slide {
  to {
    stroke-dashoffset: -18;
  }
}

.flow-toggle-btn {
  inline-size: 100%;
  padding-block: 0.72rem;
  font-weight: 600;
}

.flow-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-sm);
  background: var(--pwm-bg);
}

.flow-table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}

.flow-table th,
.flow-table td {
  text-align: start;
  padding-block: 0.48rem;
  padding-inline: 0.75rem;
  border-block-end: 1px solid var(--pwm-border);
}

.flow-table tbody tr:last-child td {
  border-block-end: none;
}

.flow-table th {
  background: var(--pwm-surface-raised);
  color: var(--pwm-ink);
  font-weight: 600;
  font-size: 0.76rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.flow-table td {
  color: var(--pwm-ink-secondary);
}

.flow-table td.is-water {
  color: var(--pwm-fluid);
  font-weight: 500;
}

.flow-table td.is-elec {
  color: var(--pwm-accent-hover);
  font-weight: 500;
}
</style>
