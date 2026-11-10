// Reads everything from the /content folder at build time. No database, no API.
import fs from 'node:fs'
import path from 'node:path'
import MarkdownIt from 'markdown-it'
import YAML from 'yaml'
import {cache} from 'react'

const DIR = path.join(process.cwd(), 'content')

export type Product = {
  id: string
  name: string
  brand?: string
  asin?: string
  url?: string
  image?: string
  imageAlt?: string
  status?: 'active' | 'out-of-stock' | 'discontinued'
  verdict?: string
  pros?: string[]
  cons?: string[]
  skipIf?: string
  specs?: {label: string; value: string}[]
}
export type Category = {slug: string; title: string; kind: 'topic' | 'format'; group?: string; description?: string; sortOrder: number; showInNav?: boolean}
export type Author = {slug: string; name: string; role?: string; bio?: string}
export type SiteSettings = {
  siteName?: string
  amazonDomain?: string
  affiliateTag?: string
  disclosureShort?: string
  disclosureLong?: string
}

const readJson = <T,>(file: string, fallback: T): T => {
  try {
    return JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8')) as T
  } catch {
    return fallback
  }
}

export const getSettings = cache((): SiteSettings => readJson<SiteSettings>('site.json', {}))
export const getCategories = cache((): Category[] => readJson<Category[]>('categories.json', []).sort((a, b) => a.sortOrder - b.sortOrder))
export const getAuthors = cache((): Author[] => readJson<Author[]>('authors.json', []))
const getProductMap = cache(() => new Map(readJson<Product[]>('products.json', []).map((p) => [p.id, p])))

// ---------- body ----------
const AMAZON = /^(https?:)?\/\/([a-z0-9-]+\.)*(amazon\.[a-z.]+|amzn\.to|amzn\.in|link\.amazon)(\/|$)/i
export const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

// Raw HTML inside a post is shown as text, never executed.
const md = new MarkdownIt({html: false, linkify: false, typographer: false})
md.renderer.rules.heading_open = (tokens, idx) => {
  const t = tokens[idx]
  if (t.tag === 'h2') return `<h2 id="${slugify(tokens[idx + 1]?.content ?? '')}">`
  return `<${t.tag}>`
}
md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  const t = tokens[idx]
  const href = t.attrGet('href') ?? ''
  if (AMAZON.test(href)) {
    t.attrSet('rel', 'sponsored nofollow noopener')
    t.attrSet('target', '_blank')
  } else if (/^https?:/.test(href)) {
    t.attrSet('rel', 'noopener')
    t.attrSet('target', '_blank')
  }
  return self.renderToken(tokens, idx, options)
}
md.renderer.rules.table_open = () => '<div class="table-wrap"><table>'
md.renderer.rules.table_close = () => '</table></div>'

export type Block =
  | {_type: 'html'; html: string}
  | {_type: 'productBox'; product: Product; badge?: string; note?: string; showSpecs?: boolean; specList?: string[]}
  | {_type: 'bestTenList'; heading?: string; showSummaryTable?: boolean; items: BestItem[]}
  | {_type: 'versus'; a: VersusSide; b: VersusSide; rows: {label: string; a: string; b: string; win?: 'a' | 'b'}[]; note?: string}
  | {_type: 'choose'; a: ChooseSide; b: ChooseSide}

export type VersusSide = {name: string; tag?: string; price?: string; product?: Product | null}
export type ChooseSide = {name: string; points: string[]; product?: Product | null}
export type BestItem = {
  product: Product
  badge?: string
  rating?: number
  verdict?: string
  pros?: string[]
  cons?: string[]
  skipIf?: string
  specs?: string[]
  fullReview?: {slug: string; title: string} | null
}

function parseBody(source: string, file: string): Block[] {
  const products = getProductMap()
  const blocks: Block[] = []
  const re = /^```(best|product|versus|choose)[ \t]*\n([\s\S]*?)\n```[ \t]*$/gm
  let last = 0
  let m: RegExpExecArray | null
  const pushMd = (s: string) => {
    if (s.trim()) blocks.push({_type: 'html', html: md.render(s)})
  }
  const need = (id: string) => {
    const p = products.get(id)
    if (!p) throw new Error(`${file}: unknown product "${id}". Add it to content/products.json`)
    return p
  }
  while ((m = re.exec(source))) {
    pushMd(source.slice(last, m.index))
    last = m.index + m[0].length
    const data = YAML.parse(m[2]) ?? {}
    if (m[1] === 'product') {
      blocks.push({_type: 'productBox', product: need(data.product), badge: data.badge, note: data.note, showSpecs: false, specList: Array.isArray(data.specs) ? data.specs.map(String) : undefined})
    } else if (m[1] === 'versus') {
      const side = (x: any): VersusSide => ({name: x.name, tag: x.tag, price: x.price, product: x.product ? need(x.product) : null})
      blocks.push({_type: 'versus', a: side(data.a ?? {}), b: side(data.b ?? {}), rows: data.rows ?? [], note: data.note})
    } else if (m[1] === 'choose') {
      const side = (x: any): ChooseSide => ({name: x.name, points: x.points ?? [], product: x.product ? need(x.product) : null})
      blocks.push({_type: 'choose', a: side(data.a ?? {}), b: side(data.b ?? {})})
    } else {
      blocks.push({
        _type: 'bestTenList',
        heading: data.heading,
        showSummaryTable: data.table !== false,
        items: (data.items ?? []).map((it: any) => ({
          product: need(it.product),
          badge: it.badge,
          rating: it.rating,
          verdict: it.verdict,
          pros: it.pros,
          cons: it.cons,
          skipIf: it.skipIf,
          specs: it.specs,
          fullReview: it.review ? {slug: it.review, title: ''} : null,
        })),
      })
    }
  }
  pushMd(source.slice(last))
  return blocks
}

// ---------- posts ----------
export type Post = {
  slug: string
  title: string
  postType: string
  excerpt: string
  coverTitle: string
  picks: number
  publishedAt: string
  lastReviewedAt: string
  freshness: string
  seo: {title?: string; description?: string; noindex?: boolean}
  primaryCategory: Category | null
  categories: Category[]
  author: Author | null
  faq: {question: string; answer: string}[]
  quickVerdict: null | {product: Product | null; rating?: number; summary?: string; pros?: string[]; cons?: string[]; skipIf?: string}
  body: Block[]
}

const catBySlug = () => new Map(getCategories().map((c) => [c.slug, c]))

function readDir(sub: string): {slug: string; data: any; content: string; file: string}[] {
  const dir = path.join(DIR, sub)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const text = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\r\n/g, '\n')
      const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
      const data = (m ? YAML.parse(m[1]) : {}) ?? {}
      return {slug: (data.slug as string) || f.replace(/\.md$/, ''), data, content: m ? m[2] : text, file: `${sub}/${f}`}
    })
}

const iso = (d: any) => (d instanceof Date ? d.toISOString() : String(d ?? ''))

const COVER = new Map<string, string>()
const readCover = (slug: string) => COVER.get(slug) ?? ''

// Short cover headline. *word* marks the italic accent word.
function coverTitleFor(p: Post, raw: string): string {
  if (raw) return raw
  let t = p.title.split(/:| — | – | \| /)[0].replace(/\s*\bin India\b/i, '').trim()
  if (p.postType === 'best') t = t.replace(/^(top\s+\d+\s+)?(\d+\s+)?best\s+/i, 'The best ')
  return t.length > 48 ? t.slice(0, 48).replace(/\s+\S*$/, '') : t
}

// Number of distinct products in an article's best-of lists.
function countPicks(body: Block[]): number {
  const ids = new Set<string>()
  for (const b of body) if (b._type === 'bestTenList') for (const it of b.items) if (it.product?.id) ids.add(it.product.id)
  return ids.size
}

export const getAllPosts = cache((): Post[] => {
  const cats = catBySlug()
  const authors = new Map(getAuthors().map((a) => [a.slug, a]))
  const products = getProductMap()
  const now = Date.now()
  const raw = readDir('posts')
  for (const r of raw) COVER.set(r.slug, typeof r.data.coverTitle === 'string' ? r.data.coverTitle : '')
  return raw
    .filter((r) => r.data.draft !== true && new Date(iso(r.data.date)).getTime() <= now)
    .map((r) => {
      const d = r.data
      const v = d.verdict
      return {
        slug: r.slug,
        title: d.title,
        postType: d.type ?? 'blog',
        excerpt: d.excerpt ?? '',
        publishedAt: iso(d.date),
        lastReviewedAt: iso(d.updated ?? d.date),
        freshness: d.freshness ?? 'fresh',
        seo: {title: d.seoTitle, description: d.description, noindex: d.noindex},
        primaryCategory: cats.get(d.category) ?? null,
        categories: (d.categories ?? []).map((s: string) => cats.get(s)).filter(Boolean) as Category[],
        author: authors.get(d.author) ?? null,
        faq: (d.faq ?? []).map((f: any) => ({question: f.q, answer: f.a})),
        quickVerdict: v ? {product: v.product ? (products.get(v.product) ?? null) : null, rating: v.rating, summary: v.summary, pros: v.pros, cons: v.cons, skipIf: v.skipIf} : null,
        body: parseBody(r.content, r.file),
      } as Post
    })
    .map((p) => ({...p, coverTitle: coverTitleFor(p, readCover(p.slug)), picks: countPicks(p.body)}))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
})

export const getPost = (slug: string) => getAllPosts().find((p) => p.slug === slug) ?? null

export type Page = {slug: string; title: string; description?: string; body: Block[]}
export const getAllPages = cache((): Page[] =>
  readDir('pages').map((r) => ({slug: r.slug, title: r.data.title, description: r.data.description, body: parseBody(r.content, r.file)})),
)
export const getPage = (slug: string) => getAllPages().find((p) => p.slug === slug) ?? null

// ---------- list helpers (shapes the components expect) ----------
export type Card = {
  _id: string
  slug: string
  title: string
  postType: string
  excerpt: string
  coverTitle: string
  picks: number
  publishedAt: string
  lastReviewedAt: string
  category: {title: string; slug: string} | null
}

// Products mentioned in an article. Best-of lists already show theirs in full, so they get none.
export function articleProducts(p: Post) {
  if (p.postType === 'best') return []
  const seen = new Map<string, any>()
  const add = (x?: any | null) => { if (x?.id && !seen.has(x.id)) seen.set(x.id, {id: x.id, name: x.name, asin: x.asin ?? null, url: x.url ?? null, status: x.status ?? null}) }
  add(p.quickVerdict?.product)
  for (const b of p.body) {
    if (b._type === 'productBox') add(b.product)
    else if (b._type === 'versus' || b._type === 'choose') { add(b.a.product); add(b.b.product) }
    else if (b._type === 'bestTenList') b.items.forEach((i) => add(i.product))
  }
  return [...seen.values()]
}

export const toCard = (p: Post): Card => ({
  _id: p.slug,
  slug: p.slug,
  title: p.title,
  postType: p.postType,
  excerpt: p.excerpt,
  coverTitle: p.coverTitle,
  picks: p.picks,
  publishedAt: p.publishedAt,
  lastReviewedAt: p.lastReviewedAt,
  category: p.primaryCategory ? {title: p.primaryCategory.title, slug: p.primaryCategory.slug} : null,
})

export function getHome() {
  const posts = getAllPosts()
  const of = (types: string[], n: number) => posts.filter((p) => types.includes(p.postType)).slice(0, n).map(toCard)
  return {
    hero: posts.slice(0, 4).map(toCard),
    reviews: of(['review'], 4),
    guides: of(['best', 'guide'], 6),
    comparisons: of(['comparison'], 3),
    fixes: posts.filter((p) => p.postType === 'fixit').slice(0, 6).map((p) => ({slug: p.slug, title: p.title})),
    topics: getCategories().filter((c) => c.kind === 'topic' && c.showInNav),
  }
}

export const postsInCategory = (slug: string) => getAllPosts().filter((p) => p.categories.some((c) => c.slug === slug) || p.primaryCategory?.slug === slug).map(toCard)
export const postsByAuthor = (slug: string) => getAllPosts().filter((p) => p.author?.slug === slug).map(toCard)

export function relatedFor(post: Post) {
  const more = getAllPosts().filter((p) => p.slug !== post.slug && p.primaryCategory?.slug === post.primaryCategory?.slug).slice(0, 3).map((p) => ({slug: p.slug, title: p.title}))
  return more
}

export function continueFor(post: Post, n = 3) {
  const all = getAllPosts().filter((p) => p.slug !== post.slug)
  const score = (p: Post) => (p.primaryCategory?.slug && p.primaryCategory.slug === post.primaryCategory?.slug ? 2 : 0) + (p.postType === post.postType ? 1 : 0)
  return all
    .map((p, i) => ({p, s: score(p), i}))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, n)
    .map((x) => toCard(x.p))
}

// ---------- body helpers ----------
const stripTags = (h: string) => h.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
export function readingMinutes(body: Block[]): number {
  const words = body.reduce((n, b) => n + (b._type === 'html' ? stripTags(b.html).split(/\s+/).filter(Boolean).length : 0), 0)
  return Math.max(1, Math.round(words / 220))
}
export type NavItem = {id: string; text: string; sub?: boolean}
export function headingsNav(body: Block[]): NavItem[] {
  const out: NavItem[] = []
  for (const b of body) {
    if (b._type !== 'html') continue
    for (const m of b.html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)) out.push({id: m[1], text: stripTags(m[2]).trim()})
  }
  return out
}
export function picksNav(body: Block[]): NavItem[] {
  const list = body.find((b) => b._type === 'bestTenList') as Extract<Block, {_type: 'bestTenList'}> | undefined
  return (list?.items ?? []).map((it, i) => ({id: `pick-${i + 1}`, text: it.product.name}))
}

export const getProductCount = cache((): number => {
  const d: any = readJson<any>('products.json', [])
  return Array.isArray(d) ? d.length : Object.keys(d?.products ?? d ?? {}).length
})

// Sidebar outline: the title (H1), every H2, and for best-of lists each pick nested under its section.
// Pick ids are numbered across the whole article so two lists never share an id.
export function articleNav(body: Block[], title: string): NavItem[] {
  const out: NavItem[] = [{id: 'top', text: title}]
  let n = 0
  for (const b of body) {
    if (b._type === 'html') {
      for (const m of b.html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)) out.push({id: m[1], text: stripTags(m[2]).trim()})
    } else if (b._type === 'bestTenList') {
      for (const it of b.items) {
        if (!it.product) continue
        n += 1
        out.push({id: `pick-${n}`, text: it.product.name, sub: true})
      }
    }
  }
  return out
}
