<script setup>
import { watchEffect } from 'vue'
import { EXTERNAL_RESOURCES, localize } from '@pwm/shared'
import { useI18n } from '../composables/useI18n.js'

const { lang, t } = useI18n()

watchEffect(() => {
  document.title = t.value.reference.titleMeta
})
</script>

<template>
  <div class="ref-page content-grid reading-grid">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <RouterLink to="/">{{ t.nav.hub }}</RouterLink>
      <span aria-hidden="true">/</span>
      <span>{{ t.reference.breadcrumbCurrent }}</span>
    </nav>

    <article class="ref-sheet">
      <header class="ref-head">
        <span class="kicker">{{ t.reference.kicker }}</span>
        <h1>{{ t.reference.heading }}</h1>
        <p>{{ t.reference.lead }}</p>
      </header>

      <section class="prose">
        <h2>{{ t.reference.hEquations }}</h2>
        <div class="formula-grid">
          <div class="formula-card">
            <div class="formula-val pwm-tabular">D = (T_on / T) × 100%</div>
            <div class="formula-label">{{ t.reference.eqDuty }}</div>
          </div>
          <div class="formula-card">
            <div class="formula-val pwm-tabular">f = 1 / T</div>
            <div class="formula-label">{{ t.reference.eqFreq }}</div>
          </div>
          <div class="formula-card">
            <div class="formula-val pwm-tabular">V_avg = V_src × D</div>
            <div class="formula-label">{{ t.reference.eqVavg }}</div>
          </div>
        </div>

        <h2>{{ t.reference.hShorts }}</h2>
        <ul>
          <li v-for="(item, i) in t.reference.shortsList" :key="i" v-html="item" />
        </ul>

        <h2>{{ t.reference.hFreqs }}</h2>
        <div class="table-wrap">
          <table class="ref-table">
            <thead>
              <tr>
                <th>{{ t.reference.thComponent }}</th>
                <th>{{ t.reference.thFreq }}</th>
                <th>{{ t.reference.thStrategy }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in t.reference.frequencies" :key="row.component">
                <td><strong>{{ row.component }}</strong></td>
                <td class="freq-col pwm-tabular">{{ row.freq }}</td>
                <td>{{ row.strategy }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{{ t.reference.hChecklist }}</h2>
        <h3>{{ t.reference.hDmm }}</h3>
        <ul>
          <li v-for="(item, i) in t.reference.dmmList" :key="i" v-html="item" />
        </ul>

        <h3>{{ t.reference.hScope }}</h3>
        <ul>
          <li v-for="(item, i) in t.reference.scopeList" :key="i" v-html="item" />
        </ul>

        <h2>{{ t.reference.hResources }}</h2>
        <div class="resources-grid">
          <article v-for="res in EXTERNAL_RESOURCES" :key="res.url" class="click-card res-card">
            <span class="kicker">{{ localize(res.category, lang) }}</span>
            <h3>
              <a :href="res.url" target="_blank" rel="noopener noreferrer" class="card-link">
                {{ localize(res.title, lang) }} ↗
              </a>
            </h3>
            <p>{{ localize(res.description, lang) }}</p>
          </article>
        </div>
      </section>

      <div class="ref-footer">
        <RouterLink to="/lessons" class="site-btn is-primary">{{ t.reference.btnBackLessons }}</RouterLink>
        <RouterLink to="/diagrams" class="site-btn">{{ t.reference.btnDiagrams }}</RouterLink>
        <a href="/presentation/" class="site-btn is-signal">{{ t.reference.btnPresentation }}</a>
      </div>
    </article>
  </div>
</template>

<style scoped>
.ref-page {
  padding-block: clamp(1.5rem, 3.5vw, 2.5rem) 2rem;
  row-gap: 1rem;
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

.ref-sheet {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-lg);
  padding: clamp(1.25rem, 3.5vw, 2.5rem);
  box-shadow: var(--pwm-shadow-lg);
}

.ref-head {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-block-end: 1.15rem;
  border-block-end: 1px solid var(--pwm-border);
}

.ref-head h1 {
  font-size: var(--pwm-text-2xl);
  font-weight: 700;
  letter-spacing: -0.02em;
}

.ref-head p {
  color: var(--pwm-ink-secondary);
}

.formula-grid {
  display: grid;
  gap: 0.85rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 13rem), 1fr));
}

.formula-card {
  background: var(--pwm-scope-bg);
  border: 1px solid var(--pwm-border-strong);
  border-radius: var(--pwm-radius-md);
  padding: 1.1rem;
  text-align: center;
}

.formula-val {
  font-family: var(--pwm-font-mono);
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--pwm-accent-hover);
  margin-block-end: 0.3rem;
}

.formula-label {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--pwm-ink-muted);
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--pwm-border);
  border-radius: var(--pwm-radius-md);
  background: var(--pwm-bg);
}

.ref-table {
  inline-size: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.ref-table th,
.ref-table td {
  text-align: start;
  padding-block: 0.7rem;
  padding-inline: 1rem;
  border-block-end: 1px solid var(--pwm-border);
}

.ref-table tbody tr:last-child td {
  border-block-end: none;
}

.ref-table th {
  background: var(--pwm-surface-raised);
  color: var(--pwm-ink);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ref-table td {
  color: var(--pwm-ink-secondary);
}

.freq-col {
  font-family: var(--pwm-font-mono);
  font-size: 0.84rem;
  color: var(--pwm-signal) !important;
  white-space: nowrap;
}

.resources-grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 17rem), 1fr));
}

.res-card {
  gap: 0.45rem;
  padding: 1.1rem;
  background: var(--pwm-bg);
}

.res-card h3 {
  font-size: 0.98rem;
  line-height: 1.35;
}

.res-card p {
  font-size: 0.86rem;
  color: var(--pwm-ink-secondary);
}

.ref-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-block-start: 1.25rem;
  border-block-start: 1px solid var(--pwm-border);
}
</style>
