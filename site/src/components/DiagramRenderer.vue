<script setup>
import {
  PwmSimulator,
  CircuitSimulator,
  DiagnosticsLab,
  EcuSimulator,
  FlowComparison,
  TimeModulation,
  FuelPumpSimulator,
} from '@pwm/shared'

defineProps({
  diagramKey: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: 'en',
  },
})
</script>

<template>
  <PwmSimulator v-if="diagramKey === 'pwm-simulator'" :lang="lang" />
  <CircuitSimulator v-else-if="diagramKey === 'circuit-low-high'" variant="low-high" :lang="lang" />
  <DiagnosticsLab v-else-if="diagramKey === 'diagnostics-lab'" :lang="lang" />
  <CircuitSimulator v-else-if="diagramKey === 'circuit-short'" variant="short-circuit" :lang="lang" />
  <EcuSimulator v-else-if="diagramKey === 'ecu-simulator'" :lang="lang" />
  <FlowComparison v-else-if="diagramKey === 'flow-comparison'" :lang="lang" />
  <TimeModulation v-else-if="diagramKey === 'time-modulation'" :lang="lang" />
  <FuelPumpSimulator v-else-if="diagramKey === 'fuel-pump'" :lang="lang" />
</template>
