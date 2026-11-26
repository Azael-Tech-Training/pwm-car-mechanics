<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { LESSONS, QuizWidget, localize } from '@pwm/shared'
import { getLessonContent } from '../data/lessonsContent.js'
import { useI18n } from '../composables/useI18n.js'
import DiagramRenderer from '../components/DiagramRenderer.vue'

const route = useRoute()
const { lang, t } = useI18n()

const currentIndex = computed(() => LESSONS.findIndex((l) => l.slug === route.params.slug))
const lesson = computed(() => LESSONS[currentIndex.value] || null)
const content = computed(() => (lesson.value ? getLessonContent(lesson.value.slug, lang.value) : null))
const prevLesson = computed(() => (currentIndex.value > 0 ? LESSONS[currentIndex.value - 1] : null))
const nextLesson = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < LESSONS.length - 1
    ? LESSONS[currentIndex.value + 1]
    : null
)

watchEffect(() => {
  if (lesson.value) {
    document.title = `${t.value.lessonView.lessonLabel} ${lesson.value.number}: ${localize(lesson.value.title, lang.value)} — ${t.value.siteName}`
  }
})
</script>

<template>
  <div v-if="lesson && content" class="lesson-page content-grid reading-grid">
    <!-- Top Breadcrumb + Quick Jump -->
    <div class="lesson-topbar">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <RouterLink to="/">{{ t.nav.hub }}</RouterLink>
        <span aria-hidden="true">/</span>
        <RouterLink to="/lessons">{{ t.lessonView.breadcrumbLessons }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span class="pwm-tabular">{{ t.lessonView.lessonLabel }} {{ lesson.number }}</span>
      </nav>

      <div class="topbar-actions">
        <RouterLink to="/reference" class="mini-link">{{ t.lessonView.cheatSheet }}</RouterLink>
        <a :href="`/presentation/${lesson.slideNumber}`" class="mini-link is-signal">
          {{ t.lessonView.slideLabel }} {{ lesson.slideNumber }} ↗
        </a>
      </div>
    </div>

    <!-- Step Progress Strip -->
    <nav class="lesson-stepper" :aria-label="t.lessonView.breadcrumbLessons">
      <RouterLink
        v-for="item in LESSONS"
        :key="item.slug"
        :to="`/lessons/${item.slug}`"
        class="step-chip pwm-tabular"
        :class="{ 'is-active': item.slug === lesson.slug }"
        :title="`${t.lessonView.lessonLabel} ${item.number}: ${localize(item.shortTitle, lang)}`"
        :aria-current="item.slug === lesson.slug ? 'page' : undefined"
      >
        {{ item.number }}
      </RouterLink>
    </nav>

    <!-- Main Lesson Card -->
    <article class="lesson-sheet">
      <header class="lesson-head">
        <div class="kicker">
          {{ t.lessonView.lessonUpper }} {{ lesson.code }} · {{ localize(lesson.category, lang) }}
        </div>
        <h1>{{ localize(lesson.title, lang) }}</h1>
      </header>

      <!-- Content before Interactive Diagram -->
      <div class="prose">
        <template v-for="(block, idx) in content.blocksBeforeDiagram" :key="'pre-' + idx">
          <h2 v-if="block.type === 'h2'">{{ block.text }}</h2>
          <p v-else-if="block.type === 'p'" v-html="block.html" />
          <div
            v-else-if="block.type === 'equation'"
            class="equation-box"
            :class="{ 'is-danger': block.tone === 'danger' }"
          >
            {{ block.text }}
          </div>
          <div
            v-else-if="block.type === 'callout'"
            class="lesson-callout"
            :class="block.tone === 'warning' ? 'is-warning' : block.tone === 'tip' ? 'is-tip' : ''"
          >
            <div class="lesson-callout-title">{{ block.title }}</div>
            <p v-html="block.html" />
          </div>
          <ul v-else-if="block.type === 'ul'">
            <li v-for="(li, i) in block.items" :key="i" v-html="li" />
          </ul>
          <ol v-else-if="block.type === 'ol'">
            <li v-for="(li, i) in block.items" :key="i" v-html="li" />
          </ol>
        </template>
      </div>

      <!-- Single Source of Truth Interactive Diagram -->
      <section class="diagram-stage" aria-label="Interactive Simulator">
        <DiagramRenderer :key="lesson.slug" :diagram-key="lesson.diagramKey" :lang="lang" />
      </section>

      <!-- Content after Interactive Diagram -->
      <div v-if="content.blocksAfterDiagram.length" class="prose">
        <template v-for="(block, idx) in content.blocksAfterDiagram" :key="'post-' + idx">
          <h2 v-if="block.type === 'h2'">{{ block.text }}</h2>
          <p v-else-if="block.type === 'p'" v-html="block.html" />
          <div
            v-else-if="block.type === 'callout'"
            class="lesson-callout"
            :class="block.tone === 'warning' ? 'is-warning' : block.tone === 'tip' ? 'is-tip' : ''"
          >
            <div class="lesson-callout-title">{{ block.title }}</div>
            <p v-html="block.html" />
          </div>
        </template>
      </div>

      <!-- Knowledge Checks -->
      <section class="quiz-section">
        <div class="quiz-section-head">
          <span class="kicker">{{ t.lessonView.quizKicker }}</span>
          <h2>{{ t.lessonView.quizHeading }}</h2>
        </div>

        <div class="quiz-stack">
          <QuizWidget
            v-for="(q, idx) in content.quizzes"
            :key="`${lesson.slug}-${lang}-q-${idx}`"
            :question-number="idx + 1"
            :question="q.question"
            :options="q.options"
            :explanation="q.explanation"
            :lang="lang"
          />
        </div>
      </section>

      <!-- Interconnected Prev / Index / Next Navigation -->
      <nav class="lesson-pagination" aria-label="Lesson pagination">
        <RouterLink v-if="prevLesson" :to="`/lessons/${prevLesson.slug}`" class="page-btn is-prev">
          <span class="page-dir">{{ t.lessonView.prevDir }}</span>
          <span class="page-name">{{ prevLesson.number }} · {{ localize(prevLesson.shortTitle, lang) }}</span>
        </RouterLink>
        <RouterLink v-else to="/lessons" class="page-btn is-prev">
          <span class="page-dir">{{ t.lessonView.backDir }}</span>
          <span class="page-name">{{ t.lessonView.indexLabel }}</span>
        </RouterLink>

        <RouterLink to="/lessons" class="page-index-link">{{ t.lessonView.allLessons }}</RouterLink>

        <RouterLink v-if="nextLesson" :to="`/lessons/${nextLesson.slug}`" class="page-btn is-next">
          <span class="page-dir">{{ t.lessonView.nextDir }}</span>
          <span class="page-name">{{ nextLesson.number }} · {{ localize(nextLesson.shortTitle, lang) }}</span>
        </RouterLink>
        <RouterLink v-else to="/reference" class="page-btn is-next">
          <span class="page-dir">{{ t.lessonView.doneDir }}</span>
          <span class="page-name">{{ t.lessonView.openCheatSheet }}</span>
        </RouterLink>
      </nav>
    </article>
  </div>

  <!-- Fallback if unknown slug -->
  <div v-else class="content-grid reading-grid not-found">
    <h1>{{ t.lessonView.notFoundTitle }}</h1>
    <p>{{ t.lessonView.notFoundDesc }}</p>
    <div>
      <RouterLink to="/lessons" class="site-btn is-primary">{{ t.lessonView.notFoundBtn }}</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.lesson-page {
  padding-block: clamp(1.25rem, 3vw, 2.25rem) 2rem;
  row-gap: 1rem;
}

.lesson-topbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.8rem;
  color: var(--pwm-ink-muted);
}

.breadcrumb a {
  color: var(--pwm-accent-hover);
  text-decoration: none;
}

.topbar-actions {
  display: flex;
  gap: 0.5rem;
}

.mini-link {
  font-family: var(--pwm-font-mono);
  font-size: 0.76rem;
  font-weight: 600;
  text-decoration: none;
  padding-block: 0.3rem;
  padding-inline: 0.65rem;
  border-radius: 0.4rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  color: var(--pwm-ink-secondary);
}

.mini-link.is-signal {
  color: var(--pwm-signal);
  border-color: var(--pwm-signal-border);
  background: var(--pwm-signal-soft);
}

.lesson-stepper {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 0.35rem;
}

.step-chip {
  display: grid;
  place-items: center;
  padding-block: 0.38rem;
  border-radius: 0.45rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--pwm-ink-muted);
  text-decoration: none;
  transition: background-color 140ms var(--pwm-ease-out), border-color 140ms var(--pwm-ease-out), color 140ms var(--pwm-ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .step-chip:hover {
    border-color: var(--pwm-accent);
    color: var(--pwm-ink);
  }
}

.step-chip.is-active {
  background: var(--pwm-accent);
  border-color: var(--pwm-accent);
  color: oklch(0.99 0 none);
}

.lesson-sheet {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-lg);
  padding: clamp(1.25rem, 3.5vw, 2.5rem);
  box-shadow: var(--pwm-shadow-lg);
}

.lesson-head {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-block-end: 1rem;
  border-block-end: 1px solid var(--pwm-border);
}

.lesson-head h1 {
  font-size: var(--pwm-text-2xl);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.diagram-stage {
  margin-block: 0.25rem;
}

.quiz-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-block-start: 1.25rem;
  border-block-start: 1px solid var(--pwm-border);
}

.quiz-section-head {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quiz-section-head h2 {
  font-size: var(--pwm-text-xl);
}

.quiz-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-pagination {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding-block-start: 1.5rem;
  border-block-start: 1px solid var(--pwm-border);
}

@media (max-width: 600px) {
  .lesson-pagination {
    grid-template-columns: 1fr;
  }
}

.page-btn {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 1rem;
  border-radius: var(--pwm-radius-sm);
  background: var(--pwm-bg);
  border: 1px solid var(--pwm-border);
  text-decoration: none;
  transition: border-color 150ms var(--pwm-ease-out), background-color 150ms var(--pwm-ease-out);
}

.page-btn.is-next {
  text-align: end;
}

@media (hover: hover) and (pointer: fine) {
  .page-btn:hover {
    border-color: var(--pwm-accent);
    background: var(--pwm-accent-soft);
  }
}

.page-dir {
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--pwm-accent-hover);
}

.page-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--pwm-ink);
}

.page-index-link {
  font-family: var(--pwm-font-mono);
  font-size: 0.8rem;
  color: var(--pwm-ink-muted);
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  text-align: center;
}

@media (hover: hover) and (pointer: fine) {
  .page-index-link:hover {
    color: var(--pwm-ink);
  }
}

.not-found {
  padding-block: 4rem;
  row-gap: 1rem;
}
</style>
