import Link from 'next/link'
import {CategoryIcon, toneFor} from '@/components/Cover'
import {CountUp} from '@/components/CountUp'

const I = {fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'} as const

/* 1. Numbers band */
export function StatsBand({stats}: {stats: {n: number; suffix?: string; label: string; note: string}[]}) {
  return (
    <section className="stats-band" aria-label="TheNextGadgets in numbers">
      <div className="stats-glow" aria-hidden="true" />
      <div className="container stats-row">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-n">
              <CountUp to={s.n} suffix={s.suffix} />
            </div>
            <div className="stat-l">{s.label}</div>
            <p>{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* 2. Seasonal band */
export function WinterBand({items}: {items: {slug: string; title: string; excerpt?: string}[]}) {
  if (!items.length) return null
  return (
    <section className="winter" aria-label="Winter buying guides">
      <div className="winter-sky" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="container winter-in">
        <div className="winter-intro reveal">
          <span className="winter-chip">Seasonal · Winter</span>
          <h2>Get ready for the cold months</h2>
          <p>
            Heaters, geysers and air purifiers sell out first when the temperature drops. Our winter shortlist is built from listed specs, wattage and safety features, so you can pick before the rush.
          </p>
          <Link href="/category/home-kitchen/" className="btn btn-light">
            Browse home &amp; kitchen
          </Link>
        </div>
        <div className="winter-cards">
          {items.map((g, i) => (
            <Link key={g.slug} href={`/${g.slug}/`} className="winter-card reveal" style={{['--i' as any]: i}}>
              <span className="winter-ico">
                <svg width="26" height="26" viewBox="0 0 24 24" {...I} aria-hidden="true">
                  <path d="M12 2c1 3.5 4.5 5 4.5 9a4.5 4.5 0 0 1-9 0c0-1.7.6-2.8 1.6-3.9C9.8 8.6 10 10 11 10c0-3-1-5 1-8z" />
                  <path d="M6 21h12" />
                </svg>
              </span>
              <b>{g.title}</b>
              {g.excerpt ? <small>{g.excerpt}</small> : null}
              <span className="winter-go" aria-hidden="true">Read the guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 3. How we pick */
const STEPS = [
  {t: 'Start with the need', d: 'We begin with how people really use the product: room size, daily commute, budget or course, not a spec sheet.', i: <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z M12 7v6 M9 10h6" />},
  {t: 'Read the real specs', d: 'We check manufacturer pages, listings and published reviews, and note where sources disagree instead of picking one.', i: <path d="M6 3h9l4 4v14H6z M14 3v5h5 M9 13h6 M9 17h4" />},
  {t: 'Rank on trade-offs', d: 'Every pick lists pros, cons and who should skip it. A budget winner and a premium winner are named separately.', i: <path d="M4 19V9 M10 19V5 M16 19v-7 M22 19H2" />},
  {t: 'Keep it current', d: 'Models and prices change. Each guide carries an update date and a note when something needs rechecking.', i: <path d="M20 12a8 8 0 1 1-2.3-5.7 M20 4v5h-5" />},
]

const PkArt = [
  /* 1 need: pulsing target with pin */
  <svg key="a1" viewBox="0 0 240 120" className="pk-svg" aria-hidden="true">
    <circle className="pk-ring r1" cx="120" cy="64" r="26" />
    <circle className="pk-ring r2" cx="120" cy="64" r="26" />
    <circle className="pk-ring r3" cx="120" cy="64" r="26" />
    <circle cx="120" cy="64" r="26" fill="#fff" />
    <circle cx="120" cy="64" r="14" className="pk-fill" opacity=".22" />
    <g className="pk-bob"><path d="M120 34c-9 0-16 7-16 16 0 12 16 30 16 30s16-18 16-30c0-9-7-16-16-16z" className="pk-fill" /><circle cx="120" cy="50" r="6" fill="#fff" /></g>
    <circle cx="38" cy="30" r="6" fill="#fff" className="pk-float f1" /><circle cx="204" cy="86" r="9" fill="#fff" opacity=".8" className="pk-float f2" /><rect x="190" y="20" width="14" height="14" rx="4" fill="#fff" opacity=".7" className="pk-float f3" />
  </svg>,
  /* 2 specs: document with lines + magnifier */
  <svg key="a2" viewBox="0 0 240 120" className="pk-svg" aria-hidden="true">
    <rect x="70" y="14" width="100" height="94" rx="14" fill="#fff" />
    <rect className="pk-line l1" x="86" y="34" width="68" height="8" rx="4" />
    <rect className="pk-line l2" x="86" y="52" width="52" height="8" rx="4" />
    <rect className="pk-line l3" x="86" y="70" width="60" height="8" rx="4" />
    <rect className="pk-line l4" x="86" y="88" width="38" height="8" rx="4" />
    <g className="pk-scan"><circle cx="156" cy="70" r="20" fill="none" className="pk-stroke" strokeWidth="7" /><path d="M171 85l16 16" className="pk-stroke" strokeWidth="8" strokeLinecap="round" /></g>
    <circle cx="36" cy="40" r="7" fill="#fff" className="pk-float f1" /><rect x="198" y="22" width="16" height="16" rx="5" fill="#fff" opacity=".75" className="pk-float f2" />
  </svg>,
  /* 3 rank: growing bars with star */
  <svg key="a3" viewBox="0 0 240 120" className="pk-svg" aria-hidden="true">
    <rect className="pk-bar b1" x="66" y="64" width="30" height="46" rx="9" fill="#fff" opacity=".7" />
    <rect x="105" y="34" width="30" height="76" rx="9" className="pk-bar b2 pk-fill" />
    <rect className="pk-bar b3" x="144" y="50" width="30" height="60" rx="9" fill="#fff" />
    <g className="pk-bob"><path d="M120 6l5 10 11 1.6-8 7.7 1.9 11L120 31l-9.9 5.3 1.9-11-8-7.7 11-1.6z" fill="#fff" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></g>
    <circle cx="36" cy="76" r="8" fill="#fff" className="pk-float f2" /><circle cx="206" cy="34" r="6" fill="#fff" opacity=".8" className="pk-float f1" />
  </svg>,
  /* 4 current: rotating refresh ring with clock */
  <svg key="a4" viewBox="0 0 240 120" className="pk-svg" aria-hidden="true">
    <circle cx="120" cy="62" r="38" fill="#fff" />
    <g className="pk-spin"><circle cx="120" cy="62" r="48" fill="none" className="pk-stroke" strokeWidth="6" strokeDasharray="70 50" strokeLinecap="round" /></g>
    <line x1="120" y1="62" x2="120" y2="40" className="pk-stroke pk-hand-m" strokeWidth="5" strokeLinecap="round" />
    <line x1="120" y1="62" x2="136" y2="62" className="pk-stroke pk-hand-h" strokeWidth="5" strokeLinecap="round" />
    <circle cx="120" cy="62" r="5" className="pk-fill" />
    <circle cx="40" cy="30" r="7" fill="#fff" className="pk-float f2" /><rect x="198" y="84" width="16" height="16" rx="5" fill="#fff" opacity=".75" className="pk-float f1" />
  </svg>,
]

export function ProcessSteps() {
  return (
    <section className="container section process pk" aria-label="How we pick">
      <div className="pk-head">
        <div>
          <span className="pk-eyebrow">Our method</span>
          <h2>How we pick</h2>
          <p>Four steps behind every recommendation on this site.</p>
        </div>
        <Link href="/about-us/" className="pk-link">About our process</Link>
      </div>
      <ol className="pk-grid">
        {STEPS.map((s, i) => (
          <li key={s.t} className={`pk-card pk-${i + 1} reveal`} style={{['--i' as any]: i}}>
            <div className="pk-art">
              {PkArt[i]}
              <span className="pk-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/* 4. Brand marquee */
const BRANDS = ['Apple', 'Samsung', 'Sony', 'Lenovo', 'HP', 'Dell', 'ASUS', 'Philips', 'Havells', 'Crompton', 'Bosch', 'Black+Decker', 'LG', 'Qubo', 'DDPAI', '70mai', 'DJI', 'UGREEN', 'Belkin', 'Spigen', 'boAt', 'Anker']
export function BrandMarquee() {
  const row = BRANDS.map((b) => <span key={b}>{b}</span>)
  return (
    <section className="marquee" aria-label="Brands we cover">
      <div className="marquee-label container">Brands we cover</div>
      <div className="marquee-track" aria-hidden="true">
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </section>
  )
}

/* 5. Category bento */
export function CategoryBento({cats}: {cats: {slug: string; title: string; count: number}[]}) {
  if (!cats.length) return null
  return (
    <section className="container section" aria-label="Explore categories">
      <div className="section-head">
        <h2>Explore every corner</h2>
        <Link href="/search/" className="link-accent">Search the site</Link>
      </div>
      <div className="bento">
        {cats.map((c, i) => {
          const tone = toneFor(c.slug)
          return (
            <Link key={c.slug} href={`/category/${c.slug}/`} className={`bento-tile bento-${i % 7} reveal`} style={{['--a' as any]: tone.a, ['--b' as any]: tone.b, ['--ink-t' as any]: tone.ink}}>
              <span className="bento-orb" aria-hidden="true" />
              <span className="bento-ico"><CategoryIcon slug={c.slug} size={28} /></span>
              <b>{c.title}</b>
              <small>{c.count} {c.count === 1 ? 'article' : 'articles'}</small>
              <span className="bento-go" aria-hidden="true">→</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

/* 6. FAQ accordion */
const FAQ = [
  {q: 'How does TheNextGadgets make money?', a: 'Some links to Amazon are affiliate links, and we may earn a commission if you buy through them at no extra cost to you. We may also show ads. Neither changes what we write or how we rank products.'},
  {q: 'Do you test every product yourselves?', a: 'Not always. Many buying guides are built from manufacturer specifications, listings and published reviews, and we say so in each article. Where we lack hands-on testing, we do not claim it.'},
  {q: 'How often are guides updated?', a: 'Each article shows an updated date. Guides marked as needing an update still list older models, and we flag that on the page until they are refreshed.'},
  {q: 'Why do specs sometimes differ from the Amazon listing?', a: 'Sellers list different configurations under similar names. Always confirm the exact model code, RAM, storage or wattage on the page you buy from.'},
  {q: 'Can I suggest a product or correction?', a: 'Yes. Use the contact page to tell us about a wrong spec, a missing model or a topic you want covered.'},
]
export function HomeFaq() {
  return (
    <section className="container section faq-home" aria-label="Frequently asked questions">
      <div className="faq-grid">
        <div className="faq-intro reveal">
          <div className="kicker">Good to know</div>
          <h2>Questions readers ask us</h2>
          <p>Straight answers on how we work, how we earn and how to read our guides.</p>
        </div>
        <div className="faq-list">
          {FAQ.map((f) => (
            <details key={f.q} className="faq-item reveal">
              <summary>
                {f.q}
                <span className="faq-plus" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

/* 7. CTA */
export function CtaBand() {
  return (
    <section className="cta-band" aria-label="Find your next gadget">
      <div className="cta-aurora" aria-hidden="true"><i /><i /><i /></div>
      <div className="container cta-in reveal">
        <h2>Find your next gadget, without the guesswork</h2>
        <p>Search guides, reviews and fixes, or jump straight to the buying guides.</p>
        <div className="cta-btns">
          <Link href="/search/" className="btn btn-light">Search the site</Link>
          <Link href="/category/best/" className="btn btn-ghost">See best-of guides</Link>
        </div>
      </div>
    </section>
  )
}
