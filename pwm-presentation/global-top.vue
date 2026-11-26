<template>
  <nav class="pwm-deck-nav" aria-label="Navegación del sitio">
    <a href="/" class="pwm-deck-nav-link">← Inicio</a>
    <span class="pwm-deck-nav-sep" aria-hidden="true">·</span>
    <a href="/lessons" class="pwm-deck-nav-link">Lecciones</a>
    <span class="pwm-deck-nav-sep" aria-hidden="true">·</span>
    <a href="/diagrams" class="pwm-deck-nav-link">Diagramas</a>
  </nav>
</template>

<style scoped>
.pwm-deck-nav {
  position: fixed;
  inset-block-start: 0.75rem;
  inset-inline-end: 0.9rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding-block: 0.3rem;
  padding-inline: 0.7rem;
  border-radius: 999px;
  background: color-mix(in oklch, var(--pwm-surface, oklch(0.195 0.022 260)) 85%, transparent);
  border: 1px solid var(--pwm-border, oklch(1 0 none / 0.12));
  backdrop-filter: blur(8px);
  font-family: var(--pwm-font-mono, monospace);
  font-size: 0.72rem;
}

.pwm-deck-nav-link {
  color: var(--pwm-ink-secondary, oklch(0.76 0.016 260)) !important;
  text-decoration: none;
  font-weight: 500;
}

@media (hover: hover) and (pointer: fine) {
  .pwm-deck-nav-link:hover {
    color: var(--pwm-ink, oklch(0.96 0.005 260)) !important;
  }
}

.pwm-deck-nav-link:focus-visible {
  outline: 2px solid var(--pwm-accent-hover, oklch(0.75 0.16 258));
  outline-offset: 2px;
  border-radius: 3px;
}

.pwm-deck-nav-sep {
  color: var(--pwm-ink-muted, oklch(0.58 0.018 260));
}
</style>
