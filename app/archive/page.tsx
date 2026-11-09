import type {Metadata} from 'next'
import Link from 'next/link'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {formatDate} from '@/lib/format'
import {getAllPosts} from '@/lib/content'
import {buildMetadata} from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Archive: every article | TheNextGadgets',
  description: 'A complete list of every review, guide and fix on TheNextGadgets.',
  path: '/archive/',
})

// One plain list of every post, so crawlers and readers can reach all of them.
export default function ArchivePage() {
  const posts = getAllPosts().map((p) => ({slug: p.slug, title: p.title, publishedAt: p.publishedAt, category: p.primaryCategory?.title}))
  const byYear = new Map<number, any[]>()
  for (const p of posts) {
    const y = new Date(p.publishedAt).getFullYear()
    byYear.set(y, [...(byYear.get(y) ?? []), p])
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)
  return (
    <div className="container listing">
      <Breadcrumbs items={[{name: 'Home', href: '/'}, {name: 'Archive', href: '/archive/'}]} />
      <h1>Archive</h1>
      <div className="meta">{posts.length} articles</div>
      {years.map((y) => (
        <section key={y} className="archive-year">
          <h2>{y}</h2>
          <ul className="archive-list">
            {byYear.get(y)!.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.slug}/`}>{p.title}</Link>
                <span className="meta">
                  {p.category ? `${p.category} · ` : ''}
                  {formatDate(p.publishedAt)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
