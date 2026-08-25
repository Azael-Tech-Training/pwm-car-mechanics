/**
 * TDD: Vertical slice tests at the dist/ seam
 * Run with: node tests/static-site-tests.test.cjs
 * 
 * Testing decisions from SPEC-VITE-LANDING-PAGE.md:
 * - Test external behavior, not implementation details
 - Test at the highest seam possible (dist/ build output)
 * One seam, one test, one minimal implementation per cycle
 * 
 * Anti-patterns avoided:
 * - Implementation-coupled: testing through file system, not Vite internals
 * - Tautological: expected values from independent source (hardcoded specs)
 * - Horizontal slicing: one test → one implementation step → repeat
 */

const fs = require('fs')
const path = require('path')

const DIST_DIR = path.resolve(__dirname, '..', 'dist')
const CSS_REF = '/assets/'

/**
 * Helper: test function that passes/fails with description
 * Uses .includes() for simple string checks
 */
function testIncludes(desc, needle, haystack) {
  if (!haystack.includes(needle)) {
    throw new Error(`${desc} — "${needle}" not found in output`)
  }
  console.log(`  ✓ PASS: ${desc}`)
}

/**
 * Test 1: Verify dist/index.html has correct homepage structure
 */
console.log('\nTDD Vertical Slice 1: Homepage structure')

const indexHtml = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf-8')
testIncludes('has DOCTYPE', '<!DOCTYPE html>', indexHtml)
testIncludes('has html lang=en', '<html lang="en"', indexHtml)
testIncludes('has Home navigation link', 'Home', indexHtml)
testIncludes('has Lessons Index navigation link', 'Lessons Index', indexHtml)
testIncludes('has tagline', 'Pulse Width Modulation for Automotive Electronics', indexHtml)
testIncludes('has CSS stylesheet reference', CSS_REF, indexHtml)

/**
 * Test 2: Verify dist/lessons/index.html has the 8-lesson index with descriptions
 */
console.log('\nTDD Vertical Slice 2: Lessons index structure')

const lessonsIndexHtml = fs.readFileSync(path.join(DIST_DIR, 'lessons', 'index.html'), 'utf-8')
testIncludes('has <ol> element', '<ol>', lessonsIndexHtml)
const lessonRefs = [
  '0001-what-is-pwm-and-why-cars.html',
  '0002-low-side-vs-high-side.html',
  '0003-diagnostics-multimeter-oscilloscope.html',
  '0004-how-shorts-blow-fuses.html',
  '0005-ecu-control-logic.html',
  '0006-how-low-side-switching-controls-flow.html',
  '0007-time-is-the-variable.html',
  '0008-pwm-fuel-pump-control.html',
]
for (const ref of lessonRefs) {
  testIncludes(`has ${ref} href`, ref, lessonsIndexHtml)
}
testIncludes('has lesson descriptions', 'Introduction to PWM fundamentals', lessonsIndexHtml)

/**
 * Test 3: Verify dist/lessons/0001-what-is-pwm-and-why-cars.html has lesson content and nav links
 */
console.log('\nTDD Vertical Slice 3: Individual lesson page 0001')

const lesson1Html = fs.readFileSync(path.join(DIST_DIR, 'lessons', '0001-what-is-pwm-and-why-cars.html'), 'utf-8')
testIncludes('has proper HTML structure', '<!DOCTYPE html>', lesson1Html)
testIncludes('has html lang=en', '<html lang="en"', lesson1Html)
testIncludes('has lesson content present', 'PWM', lesson1Html)
testIncludes('has lesson metadata', 'Lesson 0001', lesson1Html)
testIncludes('has CSS stylesheet reference', CSS_REF, lesson1Html)
testIncludes('has footer navigation links', 'View Mission', lesson1Html)

/**
 * Test 4: Verify all HTML files reference /assets/ correctly
 */
console.log('\nTDD Vertical Slice 4: CSS asset references')

const htmlFiles = fs.readdirSync(DIST_DIR).filter(
  (file) => fs.statSync(path.join(DIST_DIR, file)).isFile() && file.endsWith('.html')
)
for (const file of htmlFiles) {
  const fileHtml = fs.readFileSync(path.join(DIST_DIR, file), 'utf-8')
  testIncludes(` ${file} references ${CSS_REF}`, CSS_REF, fileHtml)
}

/**
 * Test 5: Verify navigation links connect the lesson sequence
 */
console.log('\nTDD Vertical Slice 5: Lesson navigation sequence')

testIncludes('lesson 0001 has navigation links', 'footer-nav', lesson1Html)
testIncludes('lesson 0008 has navigation links', 'footer-nav', fs.readFileSync(path.join(DIST_DIR, 'lessons', '0008-pwm-fuel-pump-control.html'), 'utf-8'))

console.log('\n=== TDD Test Suite Complete ===')