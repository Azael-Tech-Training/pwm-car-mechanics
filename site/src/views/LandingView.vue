<script setup>
import { watchEffect } from 'vue'
import { LESSONS, PwmSimulator, localize } from '@pwm/shared'
import { useI18n } from '../composables/useI18n.js'

const { lang, t } = useI18n()

watchEffect(() => {
  document.title = t.value.landing.titleMeta
})
</script>

<template>
  <div class="landing-page content-grid">
    <!-- Hero -->
    <section class="hero-section">
      <div class="kicker">
        <span class="pulse-dot" aria-hidden="true" />
        {{ t.landing.kicker }}
      </div>

      <h1 class="hero-title">
        {{ t.landing.heroPrefix }}<span class="hero-accent">{{ t.landing.heroAccent }}</span>{{ t.landing.heroSuffix }}
      </h1>

      <p class="hero-lead" v-html="t.landing.heroLead" />

      <div class="hero-actions">
        <RouterLink to="/lessons" class="site-btn is-primary">
          {{ t.landing.ctaLessons }}
        </RouterLink>
        <a href="/presentation/" class="site-btn is-signal">
          {{ t.landing.ctaPresentation }}
        </a>
        <RouterLink to="/diagrams" class="site-btn">
          {{ t.landing.ctaDiagrams }}
        </RouterLink>
      </div>
    </section>

    <!-- Primary Destinations Grid -->
    <section class="destinations-section">
      <div class="section-head">
        <span class="kicker">{{ t.landing.pathsKicker }}</span>
        <h2>{{ t.landing.pathsHeading }}</h2>
      </div>

      <div class="primary-cards-grid">
        <!-- Card 1: Learning Site -->
        <article class="click-card dest-card is-blue">
          <div class="dest-top">
            <span class="dest-badge">{{ t.landing.cardSiteBadge }}</span>
            <span class="dest-count pwm-tabular">{{ t.landing.cardSiteCount }}</span>
          </div>
          <h3>
            <RouterLink to="/lessons" class="card-link">
              {{ t.landing.cardSiteTitle }}
            </RouterLink>
          </h3>
          <p>{{ t.landing.cardSiteDesc }}</p>
          <ul class="dest-features">
            <li v-for="item in t.landing.cardSiteBullets" :key="item">{{ item }}</li>
          </ul>
          <div class="dest-cta">{{ t.landing.cardSiteCta }}</div>
        </article>

        <!-- Card 2: Slidev Presentation -->
        <article class="click-card dest-card is-emerald">
          <div class="dest-top">
            <span class="dest-badge is-signal">{{ t.landing.cardDeckBadge }}</span>
            <span class="dest-count pwm-tabular">{{ t.landing.cardDeckCount }}</span>
          </div>
          <h3>
            <a href="/presentation/" class="card-link">
              {{ t.landing.cardDeckTitle }}
            </a>
          </h3>
          <p>{{ t.landing.cardDeckDesc }}</p>
          <ul class="dest-features">
            <li v-for="item in t.landing.cardDeckBullets" :key="item">{{ item }}</li>
          </ul>
          <div class="dest-cta is-signal">{{ t.landing.cardDeckCta }}</div>
        </article>
      </div>

      <!-- Secondary Utilities Row -->
      <div class="secondary-cards-grid">
        <article class="click-card compact-card">
          <span class="dest-badge">{{ t.landing.cardDiagBadge }}</span>
          <h3>
            <RouterLink to="/diagrams" class="card-link">
              {{ t.landing.cardDiagTitle }}
            </RouterLink>
          </h3>
          <p>{{ t.landing.cardDiagDesc }}</p>
        </article>

        <article class="click-card compact-card">
          <span class="dest-badge is-amber">{{ t.landing.cardRefBadge }}</span>
          <h3>
            <RouterLink to="/reference" class="card-link">
              {{ t.landing.cardRefTitle }}
            </RouterLink>
          </h3>
          <p>{{ t.landing.cardRefDesc }}</p>
        </article>
      </div>
    </section>

    <!-- Live Interactive Teaser from @pwm/shared -->
    <section class="teaser-section">
      <div class="section-head">
        <span class="kicker">{{ t.landing.teaserKicker }}</span>
        <h2>{{ t.landing.teaserHeading }}</h2>
        <p class="section-sub">{{ t.landing.teaserSub }}</p>
      </div>
      <PwmSimulator :lang="lang" />
    </section>

    <!-- Curriculum Map -->
    <section class="roadmap-section">
      <div class="section-head roadmap-head">
        <div>
          <span class="kicker">{{ t.landing.roadmapKicker }}</span>
          <h2>{{ t.landing.roadmapHeading }}</h2>
        </div>
        <RouterLink to="/lessons" class="site-btn">{{ t.landing.roadmapBtn }}</RouterLink>
      </div>

      <div class="lessons-grid">
        <article v-for="lesson in LESSONS" :key="lesson.slug" class="click-card lesson-tile">
          <div class="tile-meta">
            <span class="tile-num pwm-tabular">{{ lesson.number }}</span>
            <span class="tile-cat">{{ localize(lesson.category, lang) }}</span>
          </div>
          <h3>
            <RouterLink :to="`/lessons/${lesson.slug}`" class="card-link">
              {{ localize(lesson.shortTitle, lang) }}
            </RouterLink>
          </h3>
          <p class="tile-summary">{{ localize(lesson.summary, lang) }}</p>
          <div class="tile-footer">
            <span class="tile-diagram-tag">{{ localize(lesson.diagramName, lang) }}</span>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  padding-block-end: 2rem;
}

.hero-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-block: clamp(2.5rem, 6vw, 4.75rem) clamp(2rem, 4vw, 3rem);
  max-inline-size: 56rem;
}

.pulse-dot {
  inline-size: 0.55rem;
  block-size: 0.55rem;
  border-radius: 50%;
  background: var(--pwm-signal);
  box-shadow: 0 0 10px var(--pwm-signal);
}

.hero-title {
  font-size: var(--pwm-text-hero);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.025em;
}

.hero-accent {
  background: linear-gradient(125deg, var(--pwm-accent-hover) 0%, var(--pwm-signal) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-lead {
  font-size: var(--pwm-text-lg);
  color: var(--pwm-ink-secondary);
  max-inline-size: 46rem;
}

.hero-lead :deep(strong) {
  color: var(--pwm-ink);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-block-start: 0.4rem;
}

.destinations-section,
.teaser-section,
.roadmap-section {
  padding-block: clamp(1.75rem, 4vw, 2.75rem);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.section-head {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.section-head h2 {
  font-size: var(--pwm-text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.section-sub {
  color: var(--pwm-ink-secondary);
  max-inline-size: 46rem;
}

.roadmap-head {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.primary-cards-grid {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 21rem), 1fr));
}

.dest-card {
  gap: 0.9rem;
  padding: 1.65rem;
}

.dest-card.is-blue {
  border-color: var(--pwm-accent-border);
  background: linear-gradient(
    155deg,
    color-mix(in oklch, var(--pwm-accent) 9%, var(--pwm-surface)) 0%,
    var(--pwm-surface) 60%
  );
}

.dest-card.is-emerald {
  border-color: var(--pwm-signal-border);
  background: linear-gradient(
    155deg,
    color-mix(in oklch, var(--pwm-signal) 9%, var(--pwm-surface)) 0%,
    var(--pwm-surface) 60%
  );
}

.dest-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.dest-badge {
  font-family: var(--pwm-font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding-block: 0.22rem;
  padding-inline: 0.55rem;
  border-radius: 0.35rem;
  background: var(--pwm-accent-soft);
  color: var(--pwm-accent-hover);
  align-self: flex-start;
}

.dest-badge.is-signal {
  background: var(--pwm-signal-soft);
  color: var(--pwm-signal);
}

.dest-badge.is-amber {
  background: var(--pwm-warning-soft);
  color: var(--pwm-warning);
}

.dest-count {
  font-family: var(--pwm-font-mono);
  font-size: 0.78rem;
  color: var(--pwm-ink-muted);
}

.dest-card h3 {
  font-size: var(--pwm-text-xl);
  font-weight: 700;
  line-height: 1.25;
}

.dest-card p {
  color: var(--pwm-ink-secondary);
  font-size: 0.95rem;
}

.dest-features {
  margin: 0;
  padding-inline-start: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.88rem;
  color: var(--pwm-ink-secondary);
}

.dest-cta {
  margin-block-start: auto;
  padding-block-start: 0.6rem;
  font-weight: 600;
  font-size: 0.94rem;
  color: var(--pwm-accent-hover);
}

.dest-cta.is-signal {
  color: var(--pwm-signal);
}

.secondary-cards-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 19rem), 1fr));
}

.compact-card {
  gap: 0.55rem;
}

.compact-card h3 {
  font-size: var(--pwm-text-lg);
  font-weight: 600;
}

.compact-card p {
  font-size: 0.9rem;
  color: var(--pwm-ink-secondary);
}

.lessons-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}

.lesson-tile {
  display: grid;
  grid-row: span 4;
  grid-template-rows: subgrid;
  row-gap: 0.55rem;
  padding: 1.25rem;
}

.tile-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.tile-num {
  display: inline-grid;
  place-items: center;
  inline-size: 1.85rem;
  block-size: 1.85rem;
  border-radius: 0.45rem;
  background: var(--pwm-accent-soft);
  border: 1px solid var(--pwm-accent-border);
  font-family: var(--pwm-font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--pwm-accent-hover);
}

.tile-cat {
  font-family: var(--pwm-font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--pwm-ink-muted);
}

.lesson-tile h3 {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
}

.tile-summary {
  font-size: 0.88rem;
  color: var(--pwm-ink-secondary);
  line-height: 1.5;
}

.tile-footer {
  padding-block-start: 0.4rem;
  border-block-start: 1px solid var(--pwm-border);
}

.tile-diagram-tag {
  font-family: var(--pwm-font-mono);
  font-size: 0.72rem;
  color: var(--pwm-signal);
}
</style>
