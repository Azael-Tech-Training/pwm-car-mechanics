<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from './composables/useI18n.js'

const route = useRoute()
const { lang, setLang, t } = useI18n()

const navLinks = computed(() => [
  { label: t.value.nav.hub, to: '/' },
  { label: t.value.nav.lessons, to: '/lessons' },
  { label: t.value.nav.diagrams, to: '/diagrams' },
  { label: t.value.nav.reference, to: '/reference' },
])

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <div class="app-shell">
    <header class="site-header content-grid">
      <div class="header-inner">
        <RouterLink to="/" class="brand-link">
          <svg class="brand-mark" viewBox="0 0 36 24" aria-hidden="true">
            <rect x="1" y="1" width="34" height="22" rx="5" fill="#0a1320" stroke="#3b82f6" stroke-width="1.5" />
            <path
              d="M 5 17 L 9 17 L 9 7 L 17 7 L 17 17 L 23 17 L 23 7 L 28 7 L 28 17 L 31 17"
              fill="none"
              stroke="#10b981"
              stroke-width="2"
              stroke-linecap="square"
              stroke-linejoin="miter"
            />
          </svg>
          <span class="brand-text">{{ t.siteName }}</span>
        </RouterLink>

        <nav class="main-nav" :aria-label="t.nav.ariaPrimary">
          <RouterLink
            v-for="item in navLinks"
            :key="item.to"
            :to="item.to"
            class="nav-item"
            :class="{ 'is-current': isActive(item.to) }"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
          </RouterLink>

          <a href="/presentation/" class="nav-item nav-presentation">
            {{ t.nav.presentation }} <span aria-hidden="true">↗</span>
          </a>

          <div class="lang-toggle" role="group" :aria-label="t.nav.ariaLang">
            <button
              type="button"
              class="lang-btn"
              :class="{ 'is-active': lang === 'es' }"
              :aria-pressed="lang === 'es'"
              @click="setLang('es')"
            >
              ES
            </button>
            <button
              type="button"
              class="lang-btn"
              :class="{ 'is-active': lang === 'en' }"
              :aria-pressed="lang === 'en'"
              @click="setLang('en')"
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <RouterView />
    </main>

    <footer class="site-footer content-grid">
      <div class="footer-inner">
        <div class="footer-brand">
          <strong>{{ t.siteName }}</strong> — {{ t.footer.tagline }}
        </div>
        <div class="footer-links">
          <RouterLink to="/">{{ t.footer.hub }}</RouterLink>
          <RouterLink to="/lessons">{{ t.footer.lessons }}</RouterLink>
          <RouterLink to="/diagrams">{{ t.footer.diagrams }}</RouterLink>
          <RouterLink to="/reference">{{ t.footer.reference }}</RouterLink>
          <a href="/presentation/">{{ t.footer.presentation }}</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-shell {
  min-block-size: 100svh;
  display: flex;
  flex-direction: column;
}

.site-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  background: color-mix(in oklch, var(--pwm-bg) 86%, transparent);
  backdrop-filter: blur(12px);
  border-block-end: 1px solid var(--pwm-border);
}

.header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
  padding-block: 0.8rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  text-decoration: none;
  color: var(--pwm-ink);
  font-weight: 700;
  font-size: 1.02rem;
  letter-spacing: -0.01em;
}

.brand-mark {
  flex: none;
  inline-size: 2.15rem;
  block-size: 1.45rem;
}

.main-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding-block: 0.42rem;
  padding-inline: 0.78rem;
  border-radius: var(--pwm-radius-sm);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--pwm-ink-secondary);
  transition: background-color 150ms var(--pwm-ease-out), color 150ms var(--pwm-ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .nav-item:hover {
    color: var(--pwm-ink);
    background: var(--pwm-surface);
  }
}

.nav-item:active {
  transform: scale(0.97);
}

.nav-item.is-current {
  color: var(--pwm-ink);
  background: var(--pwm-surface-raised);
  box-shadow: inset 0 -2px 0 var(--pwm-accent);
}

.nav-presentation {
  margin-inline-start: 0.25rem;
  background: var(--pwm-accent-soft);
  border: 1px solid var(--pwm-accent-border);
  color: var(--pwm-accent-hover);
  font-weight: 600;
}

@media (hover: hover) and (pointer: fine) {
  .nav-presentation:hover {
    background: var(--pwm-accent);
    color: oklch(0.99 0 none);
  }
}

.lang-toggle {
  display: inline-flex;
  align-items: center;
  margin-inline-start: 0.35rem;
  padding: 0.18rem;
  border-radius: var(--pwm-radius-sm);
  background: var(--pwm-surface);
  border: 1px solid var(--pwm-border);
}

.lang-btn {
  padding-block: 0.26rem;
  padding-inline: 0.52rem;
  border: none;
  border-radius: 0.35rem;
  background: transparent;
  color: var(--pwm-ink-muted);
  font-family: var(--pwm-font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background-color 140ms var(--pwm-ease-out), color 140ms var(--pwm-ease-out);
}

.lang-btn:active {
  transform: scale(0.96);
}

.lang-btn.is-active {
  background: var(--pwm-accent);
  color: oklch(0.99 0 none);
}

@media (hover: hover) and (pointer: fine) {
  .lang-btn:not(.is-active):hover {
    color: var(--pwm-ink);
  }
}

.site-main {
  flex: 1;
}

.site-footer {
  margin-block-start: clamp(3rem, 6vw, 5rem);
  border-block-start: 1px solid var(--pwm-border);
  background: color-mix(in oklch, var(--pwm-surface) 45%, transparent);
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 2rem;
  padding-block: 1.75rem;
  font-size: 0.86rem;
  color: var(--pwm-ink-muted);
}

.footer-brand strong {
  color: var(--pwm-ink-secondary);
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-links a {
  color: var(--pwm-ink-secondary);
  text-decoration: none;
}

@media (hover: hover) and (pointer: fine) {
  .footer-links a:hover {
    color: var(--pwm-accent-hover);
    text-decoration: underline;
  }
}
</style>
