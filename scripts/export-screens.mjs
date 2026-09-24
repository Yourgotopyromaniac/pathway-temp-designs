/**
 * Export every board entry as PNGs for hand-off.
 *
 *   npm run export                 # everything, mobile + desktop
 *   npm run export -- fr02         # only ids starting with "fr02"
 *   npm run export -- --mobile     # one device only (--mobile | --desktop)
 *   npm run export -- --viewport   # viewport-sized shots instead of full page
 *
 * Output: exports/<FR>/<id>--<device>.png
 * First run: `npx playwright install chromium`
 */
import { mkdir, rm } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { BOARD, DEVICES, framedUrl } from '../src/board/registry.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
const filters = args.filter((a) => !a.startsWith('--'))
const onlyDevice = args.includes('--mobile') ? 'mobile' : args.includes('--desktop') ? 'desktop' : null
const fullPage = !args.includes('--viewport')

const entries = BOARD.filter((e) => filters.length === 0 || filters.some((f) => e.id.startsWith(f)))
const devices = Object.entries(DEVICES).filter(([id]) => !onlyDevice || id === onlyDevice)

const server = await createServer({ root, server: { port: 5179, strictPort: false }, logLevel: 'error' })
await server.listen()
const base = server.resolvedUrls.local[0].replace(/\/$/, '')

const browser = await chromium.launch()
if (filters.length === 0 && !onlyDevice) await rm(new URL('../exports', import.meta.url), { recursive: true, force: true })

let n = 0
for (const [deviceId, d] of devices) {
  const context = await browser.newContext({
    viewport: { width: d.width, height: d.height },
    deviceScaleFactor: 2,
    isMobile: deviceId === 'mobile',
    hasTouch: deviceId === 'mobile',
  })
  const page = await context.newPage()
  for (const e of entries) {
    await page.goto(base + framedUrl(e.path), { waitUntil: 'networkidle' })
    // Mock API latency is ~450ms; loading scenarios never resolve, so a fixed settle is fine.
    await page.waitForTimeout(700)
    const dir = new URL(`../exports/${e.fr}/`, import.meta.url)
    await mkdir(dir, { recursive: true })
    await page.screenshot({ path: fileURLToPath(new URL(`${e.id}--${deviceId}.png`, dir)), fullPage })
    n++
    process.stdout.write(`\r${n}/${entries.length * devices.length} ${e.id} (${deviceId})`.padEnd(70))
  }
  await context.close()
}

await browser.close()
await server.close()
console.log(`\nExported ${n} screens → exports/`)
