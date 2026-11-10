#!/usr/bin/env node
/**
 * Product health check.
 *   npm run check:products            offline checks + image check (fast, ~1 minute)
 *   npm run check:products -- --offline   offline checks only (no network)
 *   npm run check:products -- --asins     also open each Amazon.in product page (slow, polite)
 *
 * Offline: articles that point at products missing from products.json, products without an image,
 *          malformed or duplicate ASINs, products with no link at all.
 * Images:  every product image used in an article must load and not be Amazon's tiny placeholder.
 * ASINs:   a product page that returns 404, or says "Currently unavailable", is flagged. Amazon may show a
 *          robot check to scripts: if it does, the run stops and tells you (nothing is wrong with your site).
 * Report:  printed here and saved to tools/product-report.csv
 */
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const OFFLINE = args.has('--offline')
const ASINS = args.has('--asins')
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))
const byId = new Map(products.map((p) => [p.id, p]))
const postsDir = path.join(ROOT, 'content/posts')
const used = new Map() // product id -> [slugs]
const hidden = new Set()
for (const f of fs.readdirSync(postsDir).filter((f) => f.endsWith('.md'))) {
  const slug = f.slice(0, -3)
  const text = fs.readFileSync(path.join(postsDir, f), 'utf8')
  if (/^draft:\s*true/m.test(text)) hidden.add(slug)
  for (const m of text.matchAll(/^\s*(?:-\s*)?product:\s*(\S+)\s*$/gm)) {
    const id = m[1].replace(/^['"]|['"]$/g, '')
    if (!used.has(id)) used.set(id, [])
    if (!used.get(id).includes(slug)) used.get(id).push(slug)
  }
}
const live = (id) => (used.get(id) || []).filter((s) => !hidden.has(s))

const issues = [] // {level, id, slugs, what}
const add = (level, id, what) => issues.push({level, id, slugs: (used.get(id) || []).slice(0, 3).join(' '), what})

// ---- offline
for (const id of used.keys()) if (!byId.has(id)) add('ERROR', id, 'article uses a product id that is not in products.json')
const seen = new Map()
for (const p of products) {
  if (p.status && p.status !== 'active') continue
  const inUse = live(p.id).length > 0
  if (!p.asin && !p.url) add('ERROR', p.id, 'no ASIN and no link')
  if (p.asin && !/^(B0[A-Z0-9]{8}|\d{9}[\dX])$/.test(p.asin)) add('ERROR', p.id, `ASIN looks wrong: ${p.asin}`)
  if (p.asin) {
    if (seen.has(p.asin)) add('WARN', p.id, `same ASIN as ${seen.get(p.asin)}`)
    else seen.set(p.asin, p.id)
  }
  if (inUse && !p.image) add('WARN', p.id, 'used in an article but has no image')
}

// ---- network helpers
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function pool(items, n, fn) {
  const out = []
  let i = 0
  await Promise.all(Array.from({length: n}, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]) } }))
  return out
}

// ---- images
if (!OFFLINE) {
  const targets = products.filter((p) => p.image && live(p.id).length > 0)
  console.log(`Checking ${targets.length} product images...`)
  await pool(targets, 8, async (p) => {
    try {
      const r = await fetch(p.image, {method: 'HEAD', headers: {'user-agent': UA}, signal: AbortSignal.timeout(15000)})
      const len = Number(r.headers.get('content-length') || 0)
      if (!r.ok) add('ERROR', p.id, `image returns HTTP ${r.status}`)
      else if (len && len < 1500) add('ERROR', p.id, `image is only ${len} bytes (Amazon placeholder)`)
    } catch (e) {
      add('WARN', p.id, `image could not be fetched (${e.name})`)
    }
  })
}

// ---- ASIN pages
if (!OFFLINE && ASINS) {
  const targets = products.filter((p) => p.asin && live(p.id).length > 0)
  console.log(`Checking ${targets.length} Amazon.in product pages, about 3 seconds each (${Math.round((targets.length * 3) / 60)} min)...`)
  let blocked = 0
  for (const p of targets) {
    try {
      const r = await fetch(`https://www.amazon.in/dp/${p.asin}`, {headers: {'user-agent': UA, 'accept-language': 'en-IN,en;q=0.9'}, signal: AbortSignal.timeout(20000)})
      if (r.status === 404) add('ERROR', p.id, 'product page not found (404), ASIN may be dead')
      else if (r.ok) {
        const html = await r.text()
        if (/api-services-support@amazon|Enter the characters you see below|Type the characters/i.test(html)) { if (++blocked >= 3) { console.log('Amazon is showing a robot check. Stopping the ASIN pass, try again later or from another network.'); break } }
        else if (/Currently unavailable/i.test(html)) add('WARN', p.id, 'listed as "Currently unavailable"')
      } else if (r.status === 503) { if (++blocked >= 3) { console.log('Amazon returned 503 several times. Stopping the ASIN pass.'); break } }
    } catch (e) { add('WARN', p.id, `page could not be fetched (${e.name})`) }
    await sleep(2500 + Math.random() * 1500)
  }
}

// ---- report
const rank = {ERROR: 0, WARN: 1}
issues.sort((a, b) => rank[a.level] - rank[b.level] || a.id.localeCompare(b.id))
const csv = ['level,product,used_in,issue', ...issues.map((i) => [i.level, i.id, i.slugs, i.what].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')
fs.writeFileSync(path.join(ROOT, 'tools/product-report.csv'), csv + '\n')
for (const i of issues) console.log(`${i.level.padEnd(5)} ${i.id}  ${i.what}${i.slugs ? `  [${i.slugs}]` : ''}`)
const errs = issues.filter((i) => i.level === 'ERROR').length
console.log(`\n${products.length} products, ${used.size} used in articles. ${errs} errors, ${issues.length - errs} warnings. Report: tools/product-report.csv`)
process.exit(errs ? 1 : 0)
