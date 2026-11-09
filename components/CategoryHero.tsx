import Link from 'next/link'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {CategoryIcon, toneFor} from '@/components/Cover'
import {TYPE_LABELS, formatDate} from '@/lib/format'

const PLURAL: Record<string, [string, string]> = {review: ['Review', 'Reviews'], best: ['Best-of guide', 'Best-of guides'], comparison: ['Comparison', 'Comparisons'], fixit: ['Fix', 'Fixes'], guide: ['Buying guide', 'Buying guides'], news: ['News post', 'News posts'], blog: ['Blog post', 'Blog posts']}

export function CategoryHero({category, slug, posts}: {category: {title: string; description?: string}; slug: string; posts: any[]}) {
  const tone = toneFor(slug)
  const counts: Record<string, number> = {}
  posts.forEach((p) => (counts[p.postType] = (counts[p.postType] ?? 0) + 1))
  const chips = Object.entries(counts).sort((a, b) => b[1] - a[1])
  const latest = posts[0]
  return (
    <section className="ch" style={{['--a' as any]: tone.a, ['--b' as any]: tone.b, ['--t' as any]: tone.ink}}>
      <div className="ch-bg" aria-hidden="true">
        <i /><i /><i />
        <span className="ch-mark"><CategoryIcon slug={slug} size={420} /></span>
      </div>
      <div className="container ch-in">
        <Breadcrumbs
          items={[
            {name: 'Home', href: '/'},
            {name: 'Categories', href: '/category/'},
            {name: category.title, href: `/category/${slug}/`},
          ]}
        />
        <div className="ch-grid">
          <div className="ch-main">
            <span className="ch-eyebrow fade-in"><b />Category</span>
            <div className="ch-title fade-in" style={{animationDelay: '90ms'}}>
              <span className="ch-icon"><CategoryIcon slug={slug} size={40} /></span>
              <h1>{category.title}</h1>
            </div>
            {category.description ? <p className="ch-dek fade-in" style={{animationDelay: '170ms'}}>{category.description}</p> : null}
            <div className="ch-chips fade-in" style={{animationDelay: '250ms'}}>
              <span className="ch-chip ch-chip-main"><b>{posts.length}</b> {posts.length === 1 ? 'article' : 'articles'}</span>
              {chips.map(([t, n]) => (
                <span key={t} className="ch-chip"><b>{n}</b> {(PLURAL[t] ?? [t, t])[n === 1 ? 0 : 1]}</span>
              ))}
            </div>
          </div>
          {latest ? (
            <Link href={`/${latest.slug}/`} className="ch-latest fade-in" style={{animationDelay: '300ms'}}>
              <span className="ch-latest-k">Newest in {category.title}</span>
              <b>{latest.title}</b>
              <small>{TYPE_LABELS[latest.postType]} · Updated {formatDate(latest.lastReviewedAt ?? latest.publishedAt)}</small>
              <span className="ch-latest-go">Read now <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  )
}
