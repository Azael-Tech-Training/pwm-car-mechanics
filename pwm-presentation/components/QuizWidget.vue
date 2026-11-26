<script setup>
import { QuizWidget } from '@pwm/shared'

defineProps({
  question: String,
  options: Array,
  explanation: String,
  questionNumber: [Number, String],
})
</script>

<template>
  <QuizWidget
    :question="question"
    :options="options"
    :explanation="explanation"
    :question-number="questionNumber"
    lang="es"
    v-bind="$attrs"
  />
</template>
