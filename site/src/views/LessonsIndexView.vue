<script setup>
import { watchEffect } from 'vue'
import { LESSONS, localize } from '@pwm/shared'
import { useI18n } from '../composables/useI18n.js'

const { lang, t } = useI18n()

watchEffect(() => {
  document.title = t.value.lessonsIndex.titleMeta
})
</script>

<template>
  <div class="lessons-index content-grid">
    <section class="index-header">
      <div class="breadcrumb">
        <RouterLink to="/">{{ t.nav.hub }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ t.lessonsIndex.breadcrumbCurrent }}</span>
      </div>

      <span class="kicker">{{ t.lessonsIndex.kicker }}</span>
      <h1>{{ t.lessonsIndex.heading }}</h1>
      <p class="index-lead">{{ t.lessonsIndex.lead }}</p>

      <div class="index-actions">
        <RouterLink :to="`/lessons/${LESSONS[0].slug}`" class="site-btn is-primary">
          {{ t.lessonsIndex.btnStart }}
        </RouterLink>
        <RouterLink to="/reference" class="site-btn">
          {{ t.lessonsIndex.btnRef }}
        </RouterLink>
        <a href="/presentation/" class="site-btn is-signal">
          {{ t.lessonsIndex.btnDeck }}
        </a>
      </div>
    </section>

    <section class="mission-box">
      <div class="kicker">{{ t.lessonsIndex.missionKicker }}</div>
      <ul class="mission-list">
        <li v-for="goal in t.lessonsIndex.missionGoals" :key="goal">{{ goal }}</li>
      </ul>
    </section>

    <section class="curriculum-list">
      <article v-for="lesson in LESSONS" :key="lesson.slug" class="click-card lesson-row">
        <div class="row-num pwm-tabular">{{ lesson.number }}</div>
        <div class="row-body">
          <div class="row-meta">
            <span class="row-cat">{{ localize(lesson.category, lang) }}</span>
            <span class="row-sim">{{ t.lessonsIndex.simPrefix }} {{ localize(lesson.diagramName, lang) }}</span>
          </div>
          <h2>
            <RouterLink :to="`/lessons/${lesson.slug}`" class="card-link">
              {{ localize(lesson.title, lang) }}
            </RouterLink>
          </h2>
          <p>{{ localize(lesson.summary, lang) }}</p>
        </div>
        <div class="row-arrow" aria-hidden="true">→</div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.lessons-index {
  padding-block: clamp(1.75rem, 4vw, 3rem) 2rem;
  row-gap: 2rem;
}

.index-header {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.8rem;
  color: var(--pwm-ink-muted);
}

.breadcrumb a {
  color: var(--pwm-accent-hover);
  text-decoration: none;
}

.index-header h1 {
  font-size: var(--pwm-text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.index-lead {
  color: var(--pwm-ink-secondary);
  max-inline-size: 46rem;
}

.index-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-block-start: 0.3rem;
}

.mission-box {
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-inline-start: 4px solid var(--pwm-signal);
  border-radius: var(--pwm-radius-md);
  padding: 1.25rem 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.mission-list {
  margin: 0;
  padding-inline-start: 1.25rem;
  display: grid;
  gap: 0.45rem;
  color: var(--pwm-ink-secondary);
  font-size: 0.94rem;
}

.curriculum-list {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.lesson-row {
  flex-direction: row;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.4rem;
}

.row-num {
  flex: none;
  display: inline-grid;
  place-items: center;
  inline-size: 2.75rem;
  block-size: 2.75rem;
  border-radius: 0.65rem;
  background: var(--pwm-accent-soft);
  border: 1px solid var(--pwm-accent-border);
  font-family: var(--pwm-font-mono);
  font-size: 1rem;
  font-weight: 700;
  color: var(--pwm-accent-hover);
}

.row-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.row-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 1rem;
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
}

.row-cat {
  color: var(--pwm-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.row-sim {
  color: var(--pwm-signal);
}

.row-body h2 {
  font-size: var(--pwm-text-lg);
  font-weight: 600;
}

.row-body p {
  font-size: 0.92rem;
  color: var(--pwm-ink-secondary);
}

.row-arrow {
  flex: none;
  font-family: var(--pwm-font-mono);
  font-size: 1.25rem;
  color: var(--pwm-ink-muted);
}
</style>
