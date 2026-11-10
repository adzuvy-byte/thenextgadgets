import Link from 'next/link'
import {formatDate} from '@/lib/format'
import {Cover} from './Cover'

// Minimal editorial layout: one lead review, then a quiet numbered list.
export function LatestReviews({posts}: {posts: any[]}) {
  const [lead, ...rest] = posts
  if (!lead) return null
  const coverOf = (p: any) => (
    <Cover type={p.postType} category={p.category?.slug} categoryTitle={p.category?.title} seed={p.slug} headline={p.coverTitle} picks={p.picks} />
  )
  return (
    <div className="rv">
      <article className="rv-lead reveal">
        <Link href={`/${lead.slug}/`} className="rv-lead-cover" aria-hidden="true" tabIndex={-1}>
          {coverOf(lead)}
        </Link>
        <div className="rv-lead-body">
          <span className="rv-tag">{lead.category?.title ?? 'Review'}</span>
          <h3>
            <Link href={`/${lead.slug}/`} className="rv-link">{lead.title}</Link>
          </h3>
          {lead.excerpt ? <p>{lead.excerpt}</p> : null}
          <span className="rv-date">{formatDate(lead.lastReviewedAt ?? lead.publishedAt)}</span>
        </div>
      </article>
      <ol className="rv-list">
        {rest.map((p: any, i: number) => (
          <li key={p._id ?? p.slug} className="rv-item reveal">
            <span className="rv-n">{String(i + 2).padStart(2, '0')}</span>
            <div className="rv-item-body">
              <span className="rv-tag">{p.category?.title ?? 'Review'}</span>
              <h3>
                <Link href={`/${p.slug}/`} className="rv-link">{p.title}</Link>
              </h3>
              <span className="rv-date">{formatDate(p.lastReviewedAt ?? p.publishedAt)}</span>
            </div>
            <span className="rv-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 17L17 7M9 7h8v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
