import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'pwm-car-mechanics-static-tests',
    // Use commonjs for test files that use require()
    // Disable import analysis for static file system tests
    resolver: 'vitest/resolver-commonjs',
    include: ['tests/**/*.test.cjs'],
  },
})