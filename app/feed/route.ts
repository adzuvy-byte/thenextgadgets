import {getAllPosts} from '@/lib/content'
import {absUrl} from '@/lib/seo'

export const dynamic = 'force-static'

const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export function GET() {
  const posts = getAllPosts().slice(0, 30).map((p) => ({title: p.title, slug: p.slug, publishedAt: p.publishedAt, category: p.primaryCategory?.title, excerpt: p.excerpt}))
  const items = posts
    .map(
      (p) => `<item>
<title>${esc(p.title)}</title>
<link>${absUrl(`/${p.slug}/`)}</link>
<guid isPermaLink="true">${absUrl(`/${p.slug}/`)}</guid>
<pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
${p.category ? `<category>${esc(p.category)}</category>` : ''}
<description>${esc(p.excerpt)}</description>
</item>`,
    )
    .join('\n')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>TheNextGadgets</title>
<link>${absUrl('/')}</link>
<description>Gadget reviews, comparisons and buying guides for India.</description>
<language>en-IN</language>
${items}
</channel></rss>`
  return new Response(xml, {headers: {'Content-Type': 'application/rss+xml; charset=utf-8'}})
}
