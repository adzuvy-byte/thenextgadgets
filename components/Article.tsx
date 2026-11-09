import {integrations} from '@/integrations'
import Link from 'next/link'
import type {SiteSettings} from '@/lib/settings'
import {TYPE_LABELS, formatDate} from '@/lib/format'
import {continueFor, headingsNav, picksNav, readingMinutes, relatedFor} from '@/lib/content'
import {absUrl} from '@/lib/seo'
import {AdSlot} from './AdSlot'
import {Breadcrumbs} from './Breadcrumbs'
import {JsonLd} from './JsonLd'
import {JumpNav} from './JumpNav'
import {Body} from './Body'
import {toneFor} from './Cover'
import {PostCard} from './PostCard'
import {ReadingProgress} from './ReadingProgress'
import {VerdictBox} from './VerdictBox'

export function Article({post, settings}: {post: any; settings: SiteSettings}) {
  const isBest = post.postType === 'best'
  const jump = isBest ? picksNav(post.body) : headingsNav(post.body)
  const firstBest = (post.body ?? []).find((b: any) => b._type === 'bestTenList')
  const topPicks: any[] = isBest ? (firstBest?.items ?? []).slice(0, 3) : []
  const url = absUrl(`/${post.slug}/`)
  const modified = post.lastReviewedAt
  const more = relatedFor(post)
  const next = continueFor(post, 3)
  const tone = toneFor(post.primaryCategory?.slug)
  const initials = (post.author?.name ?? 'TN').split(/\s+/).map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  const crumbs = [
    {name: 'Home', href: '/'},
    ...(post.primaryCategory ? [{name: post.primaryCategory.title, href: `/category/${post.primaryCategory.slug}/`}] : []),
    {name: post.title, href: `/${post.slug}/`},
  ]

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: [absUrl(`/covers/${post.slug}.png`)],
    description: post.excerpt,
    mainEntityOfPage: url,
    datePublished: post.publishedAt,
    dateModified: modified,
    author: post.author ? {'@type': 'Person', name: post.author.name, url: absUrl(`/author/${post.author.slug}/`)} : undefined,
    publisher: {'@type': 'Organization', name: 'TheNextGadgets', url: absUrl('/')},
  }
  const faqLd = post.faq?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((f: any) => ({'@type': 'Question', name: f.question, acceptedAnswer: {'@type': 'Answer', text: f.answer}})),
      }
    : null
  const listLd = firstBest
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: (firstBest.items ?? []).map((it: any, i: number) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.product?.name,
          url: `${url}#pick-${i + 1}`,
        })),
      }
    : null

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleLd} />
      {faqLd ? <JsonLd data={faqLd} /> : null}
      {listLd ? <JsonLd data={listLd} /> : null}

      <header className="article-hero fade-in" style={{'--ta': tone.a, '--tb': tone.b, '--ti': tone.ink} as React.CSSProperties}>
        <div className="container article-hero-row">
          <div className="article-head">
            <Breadcrumbs items={crumbs} />
            <div className="kicker pill" data-type={post.postType}>
              {TYPE_LABELS[post.postType]}
              {post.primaryCategory ? ` · ${post.primaryCategory.title}` : ''}
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="dek">{post.excerpt}</p> : null}
            <div className="byline">
              {post.author ? (
                <Link href={`/author/${post.author.slug}/`} className="by-author">
                  <span className="avatar" aria-hidden="true">{initials}</span>
                  <span>
                    <small>Written by</small>
                    <b>{post.author.name}</b>
                  </span>
                </Link>
              ) : null}
              <span className="by-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5" /></svg>
                Updated {formatDate(post.lastReviewedAt ?? post.publishedAt)}
              </span>
              <span className="by-chip">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                {readingMinutes(post.body)} min read
              </span>
              <Link href="/disclaimer/" className="by-chip by-link">Affiliate disclosure</Link>
            </div>
          </div>
          <div className="article-hero-art" aria-hidden="true">
            <img src={`/covers/${post.slug}.png`} alt="" width={1200} height={630} className="article-hero-img" fetchPriority="high" />
          </div>
        </div>
      </header>

      <div className="container article-grid">
        <main className="article-main">
          <VerdictBox verdict={post.quickVerdict} settings={settings} />

          {topPicks.length ? (
            <section aria-label="Top picks" className="toppicks">
              {topPicks.map((it, i) => (
                <a key={i} href={`#pick-${i + 1}`} className={`toppick${i === 0 ? ' toppick-lead' : ''}`}>
                  <span className="kicker">{it.badge ?? `Pick ${i + 1}`}</span>
                  <span className="toppick-name">{it.product?.name}</span>
                </a>
              ))}
            </section>
          ) : null}

          <Body value={post.body} settings={settings} />

          <AdSlot slot={integrations.adSlots.end} />

          {post.faq?.length ? (
            <section className="afaq" aria-label="Frequently asked questions">
              <div className="afaq-head">
                <span className="afaq-eyebrow">Quick answers</span>
                <h2>Frequently asked questions</h2>
              </div>
              {post.faq.map((f: any, i: number) => (
                <details key={i} className="afaq-item" open={i === 0}>
                  <summary>
                    <span>{f.question}</span>
                    <span className="faq-plus" aria-hidden="true" />
                  </summary>
                  <p>{f.answer}</p>
                </details>
              ))}
            </section>
          ) : null}

          {post.author ? (
            <section aria-label="About the author" className="author-box">
              <div>
                <div className="strong">{post.author.name}</div>
                {post.author.bio ? <p>{post.author.bio}</p> : null}
                <Link href={`/author/${post.author.slug}/`} className="link-accent">
                  More from {post.author.name}
                </Link>
              </div>
            </section>
          ) : null}

        </main>

        <aside className="article-aside">
          <div className="aside-sticky">
          <JumpNav title={isBest ? 'Jump to a pick' : 'On this page'} items={jump} />
          <AdSlot slot={integrations.adSlots.sidebar} />
          {more.length ? (
            <section aria-label="More in this category">
              <div className="label">More in {post.primaryCategory?.title}</div>
              <ul className="plainlist">
                {more.map((m: any) => (
                  <li key={m.slug}>
                    <Link href={`/${m.slug}/`}>{m.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          </div>
        </aside>
      </div>

      {next.length ? (
        <section className="continue" aria-label="Continue reading">
          <div className="container">
            <div className="continue-head">
              <div>
                <div className="kicker">Keep going</div>
                <h2>Continue reading</h2>
              </div>
              <Link href="/archive/" className="link-accent">
                Browse the archive
              </Link>
            </div>
            <div className="grid-cards grid-3">
              {next.map((c: any) => (
                <PostCard key={c._id} post={c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}
