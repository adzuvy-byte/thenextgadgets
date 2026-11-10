import type {Metadata} from 'next'
import Link from 'next/link'
import {CategoryIcon, Cover, toneFor} from '@/components/Cover'
import {PostCard} from '@/components/PostCard'
import {Section} from '@/components/Section'
import {Hero} from '@/components/Hero'
import {TypeTiles, TrustStrip} from '@/components/HomeGraphics'
import {TYPE_LABELS, formatDate} from '@/lib/format'
import {getHome, getAllPosts, getCategories, getProductCount, postsInCategory} from '@/lib/content'
import {StatsBand, WinterBand, ProcessSteps, BrandMarquee, CategoryBento, HomeFaq, CtaBand} from '@/components/HomeSections'
import {buildMetadata, siteUrl} from '@/lib/seo'
import {JsonLd} from '@/components/JsonLd'
import {LatestReviews} from '@/components/LatestReviews'

export const metadata: Metadata = buildMetadata({
  title: 'TheNextGadgets: Gadget Reviews, Comparisons & Buying Guides',
  description:
    "Expert gadget reviews, honest comparisons and fix-it guides for dashcams, ACs, TVs, earbuds and more. India's trusted tech resource.",
  path: '/',
})

export default function HomePage() {
  const data = getHome()
  const [lead, ...side] = data.hero ?? []
  const [featuredGuide, ...guideList] = data.guides ?? []
  const all = getAllPosts()
  const clip = (t?: string) => (t && t.length > 120 ? t.slice(0, 117).replace(/\s+\S*$/, '') + '…' : t)
  const winter = ['best-room-heaters-for-home-in-india', 'best-oil-filled-room-heaters-in-india', 'best-air-purifier-for-home-in-india', 'best-car-air-purifier-in-india']
    .map((slug) => all.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3)
    .map((p: any) => ({slug: p.slug, title: p.title, excerpt: clip(p.excerpt)}))
  const stats = [
    {n: all.length, label: 'Articles', note: 'Reviews, buying guides, comparisons and fixes.'},
    {n: getProductCount(), label: 'Products tracked', note: 'Each with a listing link and notes on what it suits.'},
    {n: all.filter((p) => p.postType === 'best').length, label: 'Best-of guides', note: 'Ranked picks with pros, cons and who should skip.'},
    {n: getCategories().filter((c) => c.kind === 'topic').length, label: 'Topics covered', note: 'From laptops and TVs to dashcams and home appliances.'},
  ]
  const cats = getCategories()
    .filter((c) => c.kind === 'topic')
    .map((c) => ({slug: c.slug, title: c.title, count: postsInCategory(c.slug).length}))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@graph': [
            {'@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'TheNextGadgets', inLanguage: 'en-IN', publisher: {'@id': `${siteUrl}/#org`}},
            {'@type': 'Organization', '@id': `${siteUrl}/#org`, name: 'TheNextGadgets', url: `${siteUrl}/`, logo: {'@type': 'ImageObject', url: `${siteUrl}/favicon/icon-512.png`, width: 512, height: 512}},
          ],
        }}
      />
      <div className="hero-wrap hx-wrap">
        <Hero lead={lead} side={side} />
        <TrustStrip />
      </div>

      <TypeTiles />

      {data.topics?.length ? (
        <nav aria-label="Browse by topic" className="container topics">
          {data.topics.map((t: any) => {
            const tone = toneFor(t.slug)
            return (
              <Link key={t.slug} href={`/category/${t.slug}/`} className="topic">
                <span className="topic-icon" style={{background: tone.a, color: tone.ink}}>
                  <CategoryIcon slug={t.slug} size={22} />
                </span>
                {t.title}
              </Link>
            )
          })}
        </nav>
      ) : null}

      {data.reviews?.length ? (
        <Section title="Latest reviews" href="/category/review/" linkLabel="All reviews" className="sec-reviews">
          <LatestReviews posts={data.reviews} />
        </Section>
      ) : null}

      <WinterBand items={winter} />

      {featuredGuide ? (
        <Section title="Best of: buying guides" href="/category/best/" linkLabel="All guides" className="sec-guides">
          <div className="guides">
            <article className="feature-dark reveal">
              <Cover type={featuredGuide.postType} category={featuredGuide.category?.slug} categoryTitle={featuredGuide.category?.title} seed={featuredGuide.slug} headline={featuredGuide.coverTitle} picks={featuredGuide.picks} size="md" className="feature-cover" />
              <div>
                <span className="badge badge-lead">Editor&apos;s pick</span>
                <h3>
                  <Link href={`/${featuredGuide.slug}/`}>{featuredGuide.title}</Link>
                </h3>
                {featuredGuide.excerpt ? <p>{featuredGuide.excerpt}</p> : null}
              </div>
              <Link href={`/${featuredGuide.slug}/`} className="btn btn-light">
                Read the full guide
              </Link>
            </article>
            <ol className="ranked">
              {guideList.slice(0, 5).map((g: any, i: number) => (
                <li key={g._id} className="reveal">
                  <span className="rank-num">{i + 1}</span>
                  <div>
                    <h3>
                      <Link href={`/${g.slug}/`}>{g.title}</Link>
                    </h3>
                    <div className="meta">Updated {formatDate(g.lastReviewedAt ?? g.publishedAt)}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      ) : null}

      <ProcessSteps />

      {data.comparisons?.length ? (
        <Section title="Head to head" href="/category/comparisons/" linkLabel="All comparisons">
          <div className="grid-cards grid-3">
            {data.comparisons.map((p: any) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </Section>
      ) : null}

      <BrandMarquee />
      <StatsBand stats={stats} />
      <CategoryBento cats={cats} />

      {data.fixes?.length ? (
        <section className="fixit-band">
          <div className="container fixit-row">
            <div className="fixit-intro reveal">
              <div className="kicker">Fix-It</div>
              <h2>Something not working? Start here.</h2>
              <p>Plain-language fixes for the problems readers search for most, from error codes to overheating.</p>
              <Link href="/category/fix-it/" className="btn">
                Browse all fixes
              </Link>
            </div>
            <ul className="fixit-list">
              {data.fixes.map((f: any) => (
                <li key={f.slug} className="reveal">
                  <Link href={`/${f.slug}/`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
                    </svg>
                    {f.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <HomeFaq />
      <CtaBand />
    </>
  )
}
