import { spawn } from 'node:child_process'

const children = [
  spawn('pnpm', ['--filter', '@pwm/site', 'dev'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }),
  spawn('pnpm', ['--filter', 'pwm-presentation', 'dev:integrated'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  }),
]

console.log('\n[pwm-car-mechanics] Starting unified Hub + Learning Site (http://localhost:5173) and Slidev Presentation (/presentation/)\n')

function shutdown(signal) {
  for (const child of children) {
    if (!child.killed) {
      child.kill(signal)
    }
  }
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

for (const child of children) {
  child.on('exit', (code) => {
    if (code && code !== 0) {
      shutdown('SIGTERM')
    }
  })
}
