import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const port = Number(process.env.PORT || 4173)

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
  '.map': 'application/json',
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' })
  fs.createReadStream(filePath).pipe(res)
}

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url || '/', `http://localhost:${port}`)
  const pathname = decodeURIComponent(reqUrl.pathname)

  // Redirect bare /presentation to /presentation/ so relative assets resolve
  if (pathname === '/presentation') {
    res.writeHead(301, { Location: '/presentation/' })
    res.end()
    return
  }

  const candidate = path.resolve(distDir, '.' + pathname)
  if (!candidate.startsWith(distDir)) {
    res.writeHead(403)
    res.end('Forbidden')
    return
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    sendFile(res, candidate)
    return
  }

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const indexInDir = path.join(candidate, 'index.html')
    if (fs.existsSync(indexInDir)) {
      sendFile(res, indexInDir)
      return
    }
  }

  // SPA fallback: Slidev owns /presentation/*, Site owns everything else
  if (pathname.startsWith('/presentation/')) {
    const deckIndex = path.join(distDir, 'presentation', 'index.html')
    if (fs.existsSync(deckIndex)) {
      sendFile(res, deckIndex)
      return
    }
  }

  const rootIndex = path.join(distDir, 'index.html')
  if (fs.existsSync(rootIndex)) {
    sendFile(res, rootIndex)
    return
  }

  res.writeHead(404)
  res.end('Not Found — run `pnpm build` first.')
})

server.listen(port, '127.0.0.1', () => {
  console.log(`\n[pwm-car-mechanics] Previewing unified build at http://127.0.0.1:${port}/`)
  console.log(`  • Landing Hub:   http://127.0.0.1:${port}/`)
  console.log(`  • Learning Site: http://127.0.0.1:${port}/lessons`)
  console.log(`  • Diagrams:      http://127.0.0.1:${port}/diagrams`)
  console.log(`  • Presentation:  http://127.0.0.1:${port}/presentation/\n`)
})
