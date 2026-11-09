import Link from 'next/link'
import {Cover} from '@/components/Cover'
import {TYPE_LABELS, formatDate} from '@/lib/format'

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export function Hero({lead, side}: {lead: any; side: any[]}) {
  if (!lead) return null
  return (
    <section className="hx" aria-label="Top stories">
      <div className="hx-mesh" aria-hidden="true"><i /><i /><i /></div>
      <div className="container">
        <div className="hx-top fade-in">
          <span className="hx-live"><b />Fresh this week</span>
          <span className="hx-top-date">Latest update · {formatDate(lead.lastReviewedAt ?? lead.publishedAt)}</span>
          <span className="hx-top-rule" />
          <Link href="/search/" className="hx-top-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
            Search guides
          </Link>
        </div>

        <div className="hx-grid">
          <article className="hx-lead">
            <Link href={`/${lead.slug}/`} className="hx-art fade-in" aria-hidden="true" tabIndex={-1}>
              <Cover type={lead.postType} category={lead.category?.slug} categoryTitle={lead.category?.title} seed={lead.slug} headline={lead.coverTitle} picks={lead.picks} size="lg" />
            </Link>
            <div className="hx-body">
              <div className="hx-kick fade-in" style={{animationDelay: '120ms'}}>
                <span>{TYPE_LABELS[lead.postType]}</span>
                {lead.category ? <em>{lead.category.title}</em> : null}
              </div>
              <h1 className="fade-in" style={{animationDelay: '200ms'}}>
                <Link href={`/${lead.slug}/`}>{lead.title}</Link>
              </h1>
              {lead.excerpt ? <p className="hx-dek fade-in" style={{animationDelay: '280ms'}}>{lead.excerpt}</p> : null}
              <div className="hx-actions fade-in" style={{animationDelay: '360ms'}}>
                <Link href={`/${lead.slug}/`} className="hx-cta">Read the story <Arrow /></Link>
                <Link href="/category/best/" className="hx-ghost-btn">All best-of guides</Link>
              </div>
            </div>
          </article>

          <aside className="hx-rail">
            <div className="hx-rail-h fade-in"><span>Top stories</span><i /></div>
            {side.map((p: any, i: number) => (
              <article key={p._id} className="hx-item fade-in" style={{animationDelay: `${220 + i * 110}ms`}}>
                <span className="hx-num" aria-hidden="true">{String(i + 2).padStart(2, '0')}</span>
                <div className="hx-item-t">
                  <div className="hx-ikick">{TYPE_LABELS[p.postType]}{p.category ? ` · ${p.category.title}` : ''}</div>
                  <h3><Link href={`/${p.slug}/`}>{p.title}</Link></h3>
                  <div className="hx-imeta">Updated {formatDate(p.lastReviewedAt ?? p.publishedAt)}</div>
                </div>
                <Link href={`/${p.slug}/`} className="hx-thumb" aria-hidden="true" tabIndex={-1}>
                  <Cover type={p.postType} category={p.category?.slug} seed={p.slug} picks={p.picks} size="sm" />
                </Link>
              </article>
            ))}
            <Link href="/category/best/" className="hx-note fade-in" style={{animationDelay: '600ms'}}>
              <span className="hx-note-ico">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></svg>
              </span>
              <span><b>New here?</b><small>Start with our ranked best-of guides.</small></span>
              <span className="hx-note-go"><Arrow /></span>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
