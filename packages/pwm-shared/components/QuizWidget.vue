<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Array,
    required: true,
  },
  explanation: {
    type: String,
    default: '',
  },
  questionNumber: {
    type: [Number, String],
    default: 1,
  },
  lang: {
    type: String,
    default: 'en',
  },
})

const selectedIndex = ref(null)
const submitted = ref(false)
const isCorrect = ref(false)

const letters = ['A', 'B', 'C', 'D', 'E']

const copy = computed(() =>
  props.lang === 'es'
    ? {
        heading: `Pregunta ${props.questionNumber}`,
        submit: 'Verificar respuesta',
        reset: 'Intentar de nuevo',
        correctPrefix: '¡Correcto! ',
        wrongPrefix: 'Incorrecto. ',
      }
    : {
        heading: `Question ${props.questionNumber}`,
        submit: 'Submit Answer',
        reset: 'Try Again',
        correctPrefix: 'Correct! ',
        wrongPrefix: 'Not quite. ',
      }
)

function selectOption(idx) {
  if (submitted.value) return
  selectedIndex.value = idx
}

function submit() {
  if (selectedIndex.value === null) return
  submitted.value = true
  isCorrect.value = Boolean(props.options[selectedIndex.value]?.correct)
}

function reset() {
  selectedIndex.value = null
  submitted.value = false
  isCorrect.value = false
}
</script>

<template>
  <div class="pwm-quiz-card">
    <div class="pwm-quiz-kicker">{{ copy.heading }}</div>
    <p class="pwm-quiz-question">{{ question }}</p>

    <div class="pwm-quiz-options" role="radiogroup" :aria-label="copy.heading">
      <button
        v-for="(opt, idx) in options"
        :key="idx"
        type="button"
        class="pwm-quiz-option"
        :class="{
          'is-selected': selectedIndex === idx && !submitted,
          'is-correct': submitted && opt.correct,
          'is-incorrect': submitted && selectedIndex === idx && !opt.correct,
        }"
        :disabled="submitted"
        @click="selectOption(idx)"
      >
        <span class="pwm-quiz-letter">{{ letters[idx] || idx + 1 }}</span>
        <span class="pwm-quiz-text">{{ opt.text }}</span>
      </button>
    </div>

    <div
      v-if="submitted"
      class="pwm-sim-callout"
      :class="isCorrect ? 'is-signal' : 'is-danger'"
      role="status"
    >
      <strong>{{ isCorrect ? copy.correctPrefix : copy.wrongPrefix }}</strong>{{ explanation }}
    </div>

    <div class="pwm-quiz-actions">
      <button
        v-if="!submitted"
        type="button"
        class="pwm-btn is-active"
        :disabled="selectedIndex === null"
        @click="submit"
      >
        {{ copy.submit }}
      </button>
      <button v-else type="button" class="pwm-btn" @click="reset">
        {{ copy.reset }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.pwm-quiz-card {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-md);
  padding: 1.25rem;
  text-align: start;
}

.pwm-quiz-kicker {
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--pwm-accent-hover);
}

.pwm-quiz-question {
  margin: 0;
  font-size: 1.02rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--pwm-ink);
}

.pwm-quiz-options {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.pwm-quiz-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  inline-size: 100%;
  padding-block: 0.72rem;
  padding-inline: 0.9rem;
  border-radius: var(--pwm-radius-sm);
  border: 1px solid var(--pwm-border);
  background: var(--pwm-bg);
  color: var(--pwm-ink-secondary);
  font-family: var(--pwm-font-sans);
  font-size: 0.92rem;
  text-align: start;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  transition: background-color 150ms var(--pwm-ease-out), border-color 150ms var(--pwm-ease-out), color 150ms var(--pwm-ease-out);
}

.pwm-quiz-option:focus-visible {
  outline: 2px solid var(--pwm-accent-hover);
  outline-offset: 2px;
}

.pwm-quiz-option:active:not(:disabled) {
  transform: scale(0.985);
}

@media (prefers-reduced-motion: no-preference) {
  .pwm-quiz-option {
    transition: background-color 150ms var(--pwm-ease-out), border-color 150ms var(--pwm-ease-out), color 150ms var(--pwm-ease-out), transform 130ms var(--pwm-ease-out);
  }
}

@media (hover: hover) and (pointer: fine) {
  .pwm-quiz-option:hover:not(:disabled) {
    border-color: var(--pwm-accent);
    color: var(--pwm-ink);
    background: var(--pwm-accent-soft);
  }
}

.pwm-quiz-option:disabled {
  cursor: default;
}

.pwm-quiz-option.is-selected {
  border-color: var(--pwm-accent);
  background: var(--pwm-accent-soft);
  color: var(--pwm-ink);
}

.pwm-quiz-option.is-correct {
  border-color: var(--pwm-signal);
  background: var(--pwm-signal-soft);
  color: color-mix(in oklch, var(--pwm-signal), white 65%);
}

.pwm-quiz-option.is-incorrect {
  border-color: var(--pwm-danger);
  background: var(--pwm-danger-soft);
  color: color-mix(in oklch, var(--pwm-danger), white 65%);
}

.pwm-quiz-letter {
  flex: none;
  display: inline-grid;
  place-items: center;
  inline-size: 1.55rem;
  block-size: 1.55rem;
  border-radius: 0.35rem;
  background: var(--pwm-surface-raised);
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--pwm-ink);
}

.pwm-quiz-text {
  line-height: 1.4;
}

.pwm-quiz-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
