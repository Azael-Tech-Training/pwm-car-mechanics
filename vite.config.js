// Vite configuration for static MPA landing page
// Configured per TICKET-VITE-001 decision: Vite as static Multi-Page Application
// HTML entry points are explicitly listed for predictability
// Markdown files (.md) are handled client-side via markdownRenderer.js
//    ?md=lessons/0001 URL parameter routes to /content/lessons/0001.md

import { defineConfig } from 'vite'

export default defineConfig({
  // MPA mode: each HTML entry point gets its own output chunk
  mode: 'production',

  // Base build configuration for static site
  build: {
    // Output directory
    outDir: 'dist',

    // Assets directory relative to outDir
    assetsDir: 'assets',

    // Minify with esbuild (feter than terser)
    minify: 'esbuild',

    // RollupOptions for MPA entry points
    rollupOptions: {
      output: {
        // Asset naming with hash for caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Chunk naming with code splitting
        chunkFileNames: 'assets/[name]-[hash].js',
        // Entry point naming
        entryFileNames: 'assets/[name]-[hash].js',
        // Manual chunks for code splitting per lesson
        manualChunks: (id) => {
          if (id.includes('lessons')) return 'lessons'
          if (id.includes('simulator')) return 'simulator'
          if (id.includes('quiz')) return 'quiz'
          if (id.includes('reference')) return 'reference'
        }
      },

      // Input entries - only HTML files, markdown handled client-side
      input: {
        // Homepage entry point
        index: 'index.html',

        // Lessons index entry point
        lessons: 'lessons/index.html',

        // Individual lesson entry points (8 lessons)
        'lessons/0001-what-is-pwm-and-why-cars.html':
          'lessons/0001-what-is-pwm-and-why-cars.html',
        'lessons/0002-low-side-vs-high-side.html':
          'lessons/0002-low-side-vs-high-side.html',
        'lessons/0003-diagnostics-multimeter-oscilloscope.html':
          'lessons/0003-diagnostics-multimeter-oscilloscope.html',
        'lessons/0004-how-shorts-blow-fuses.html':
          'lessons/0004-how-shorts-blow-fuses.html',
        'lessons/0005-ecu-control-logic.html':
          'lessons/0005-ecu-control-logic.html',
        'lessons/0006-how-low-side-switching-controls-flow.html':
          'lessons/0006-how-low-side-switching-controls-flow.html',
        'lessons/0007-time-is-the-variable.html':
          'lessons/0007-time-is-the-variable.html',
        'lessons/0008-pwm-fuel-pump-control.html':
          'lessons/0008-pwm-fuel-pump-control.html',

        // Reference/cheat-sheet entry point
        'reference/pwm-basics.html':
          'reference/pwm-basics.html',
      },
    },
  },

  // Development server configuration
  server: {
    open: 'index.html', // Open homepage by default
    port: 3000,
  },
})