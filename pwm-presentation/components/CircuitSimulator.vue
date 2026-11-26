<script setup>
import { CircuitSimulator } from '@pwm/shared'

defineProps({
  variant: {
    type: String,
    default: 'low-high',
  },
})
</script>

<template>
  <CircuitSimulator :variant="variant" lang="es" v-bind="$attrs" />
</template>
