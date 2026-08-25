// Vite configuration for static MPA landing page
// Configured per TICKET-VITE-001 decision: Vite as static Multi-Page Application
// HTML entry points are explicitly listed for predictability

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

    // RollupOptions for MPA entry points
    rollupOptions: {
      input: {
        // Homepage entry point
        index: 'index.html',

        // Lessons index entry point
        lessons: 'lessons/index.html',

        // Individual lesson entry points (8 lessons)
        'lessons/0001-what-is-pwm-and-why-cars':
          'lessons/0001-what-is-pwm-and-why-cars.html',
        'lessons/0002-low-side-vs-high-side':
          'lessons/0002-low-side-vs-high-side.html',
        'lessons/0003-diagnostics-multimeter-oscilloscope':
          'lessons/0003-diagnostics-multimeter-oscilloscope.html',
        'lessons/0004-how-shorts-blow-fuses':
          'lessons/0004-how-shorts-blow-fuses.html',
        'lessons/0005-ecu-control-logic':
          'lessons/0005-ecu-control-logic.html',
        'lessons/0006-how-low-side-switching-controls-flow':
          'lessons/0006-how-low-side-switching-controls-flow.html',
        'lessons/0007-time-is-the-variable':
          'lessons/0007-time-is-the-variable.html',
        'lessons/0008-pwm-fuel-pump-control':
          'lessons/0008-pwm-fuel-pump-control.html',
      },

      // Output configuration
      output: {
        // Asset naming with hash for caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Chunk naming
        chunkFileNames: 'assets/[name]-[hash].js',
        // Entry point naming
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // Development server configuration
  server: {
    open: 'index.html', // Open homepage by default
    port: 3000,
  },
})