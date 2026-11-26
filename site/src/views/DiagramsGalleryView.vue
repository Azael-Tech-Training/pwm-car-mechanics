<script setup>
import { watchEffect } from 'vue'
import { SHARED_DIAGRAMS, localize } from '@pwm/shared'
import { useI18n } from '../composables/useI18n.js'
import DiagramRenderer from '../components/DiagramRenderer.vue'

const { lang, setLang, t } = useI18n()

watchEffect(() => {
  document.title = t.value.diagrams.titleMeta
})
</script>

<template>
  <div class="diagrams-page content-grid">
    <section class="gallery-header">
      <div class="breadcrumb">
        <RouterLink to="/">{{ t.nav.hub }}</RouterLink>
        <span aria-hidden="true">/</span>
        <span>{{ t.diagrams.breadcrumbCurrent }}</span>
      </div>

      <div class="gallery-head-row">
        <div class="gallery-title-group">
          <span class="kicker">{{ t.diagrams.kicker }}</span>
          <h1>{{ t.diagrams.heading }}</h1>
          <p>{{ t.diagrams.lead }}</p>
        </div>

        <div class="lang-switch" role="group" :aria-label="t.nav.ariaLang">
          <button
            type="button"
            class="pwm-btn"
            :class="{ 'is-active': lang === 'es' }"
            @click="setLang('es')"
          >
            Español
          </button>
          <button
            type="button"
            class="pwm-btn"
            :class="{ 'is-active': lang === 'en' }"
            @click="setLang('en')"
          >
            English
          </button>
        </div>
      </div>
    </section>

    <section class="gallery-list">
      <article v-for="(item, idx) in SHARED_DIAGRAMS" :key="item.key" class="gallery-item">
        <div class="gallery-item-head">
          <div>
            <div class="item-kicker pwm-tabular">
              {{ t.diagrams.diagramPrefix }} {{ String(idx + 1).padStart(2, '0') }} · {{ localize(item.usedIn, lang).join(' · ') }}
            </div>
            <h2>{{ localize(item.title, lang) }}</h2>
            <p>{{ localize(item.subtitle, lang) }}</p>
          </div>
          <RouterLink :to="`/lessons/${item.lessonSlug}`" class="site-btn">
            {{ t.diagrams.openLesson }}
          </RouterLink>
        </div>

        <DiagramRenderer :diagram-key="item.key" :lang="lang" />
      </article>
    </section>
  </div>
</template>

<style scoped>
.diagrams-page {
  padding-block: clamp(1.75rem, 4vw, 3rem) 2rem;
  row-gap: 2.25rem;
}

.gallery-header {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
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

.gallery-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem;
}

.gallery-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-inline-size: 46rem;
}

.gallery-title-group h1 {
  font-size: var(--pwm-text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.gallery-title-group p {
  color: var(--pwm-ink-secondary);
}

.lang-switch {
  display: inline-flex;
  gap: 0.45rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  padding: 0.35rem;
  border-radius: var(--pwm-radius-md);
}

.gallery-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.gallery-item-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
}

.item-kicker {
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.06em;
  color: var(--pwm-signal);
  text-transform: uppercase;
}

.gallery-item-head h2 {
  font-size: var(--pwm-text-xl);
  margin-block-start: 0.2rem;
}

.gallery-item-head p {
  font-size: 0.92rem;
  color: var(--pwm-ink-secondary);
}
</style>
