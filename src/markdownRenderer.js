import * as marked from 'marked'
import DOMPurify from 'dompurify'

// Configure marked for AI-optimized output
marked.setOptions({
  gfm: true,
  breakdown: true,
  walk(state) {
    state.walk(tokens => {
      if (tokens.type === 'heading') {
        tokens.depth = tokens.depth || 1
      }
    })
  }
})

/**
 * Render markdown content with front matter to HTML
 * @param {string} mdContent - Raw markdown content (without front matter)
 * @param {object} frontMatter - Parsed front matter {title, description, difficulty, time}
 * @returns {string} Complete HTML document
 */
export function renderMarkdown(mdContent, frontMatter = {}) {
  // Convert markdown to HTML using marked
  const html = marked.parse(mdContent)

  // Generate JSON-LD structured data for SEO
  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': frontMatter.title || 'PWM Lesson',
    'description': frontMatter.description || 'PWM Car Mechanics lesson',
    'totalTime': `${frontMatter.time || 'PT30M'}`,
    'step': frontMatter.steps || []
  })

  // Sanitize the markdown-generated HTML for security
  const cleaned = DOMPurify.sanitize(html, {
    ADD_ATTR: ['rel', 'href', 'target'],
    ADD_TAGS: ['simulator-widget', 'quiz-widget'],
    RETURN_DOM: true
  })

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frontMatter.title || 'PWM Car Mechanics'}</title>
  <link rel="stylesheet" href="/assets/style.css">
  <script type="application/ld+json">${ldJson}</script>
</head>
<body>
  <div class="content">${cleaned}</div>
  <script>
    // Initialize any interactive widgets after DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      // Make simulator canvases responsive
      const simulatorCanvas = document.querySelectorAll('canvas[class*="scope"]');
      simulatorCanvas.forEach(canvas => {
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
      });
    });
  </script>
</body>
</html>`
}