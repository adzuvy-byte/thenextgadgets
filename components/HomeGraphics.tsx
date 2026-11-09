import Link from 'next/link'

const I = {fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round'} as const

export function TrustStrip() {
  const items = [
    {t: 'Independent picks', d: 'Our verdicts are never for sale', i: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z M8.5 12l2.5 2.5L16 9.5" />},
    {t: 'Plain-English verdicts', d: 'Who it suits, who should skip it', i: <path d="M4 5h16v11H9l-5 4z M8 9h8 M8 12h5" />},
    {t: 'Checked against specs', d: 'Brand pages and listings, not guesses', i: <path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3 M8 15h8" />},
    {t: 'Affiliate links disclosed', d: 'We may earn a commission, always stated', i: <path d="M10 14a4 4 0 0 0 6 0l3-3a4 4 0 0 0-6-6l-1 1 M14 10a4 4 0 0 0-6 0l-3 3a4 4 0 0 0 6 6l1-1" />},
  ]
  return (
    <div className="container">
      <ul className="trust">
        {items.map((x) => (
          <li key={x.t}>
            <span className="trust-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" {...I} aria-hidden="true">
                {x.i}
              </svg>
            </span>
            <span>
              <b>{x.t}</b>
              <small>{x.d}</small>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

const TILES = [
  {
    href: '/category/review/', k: 'review', t: 'Reviews', d: 'Hands-on verdicts on the gadgets worth your money.',
    art: (
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="14" y="14" width="64" height="48" rx="8" fill="#fff" opacity=".9" />
        <path d="M26 30h40M26 40h28M26 50h34" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity=".5" />
        <path d="M88 26l5.5 11.2 12.3 1.8-8.9 8.7 2.1 12.3L88 54.2 77 60l2.1-12.3-8.9-8.7 12.3-1.8z" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    href: '/category/best/', k: 'best', t: 'Best Of', d: 'Ranked top-10 lists with a clear winner for every budget.',
    art: (
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="22" y="44" width="22" height="30" rx="4" fill="#fff" opacity=".75" />
        <rect x="49" y="26" width="22" height="48" rx="4" fill="#fff" />
        <rect x="76" y="54" width="22" height="20" rx="4" fill="#fff" opacity=".6" />
        <path d="M60 10l3 6 6.5 1-4.7 4.6 1.1 6.4L60 25l-5.9 3 1.1-6.4L50.5 17l6.5-1z" fill="#F59E0B" />
      </svg>
    ),
  },
  {
    href: '/category/comparisons/', k: 'comparison', t: 'Comparisons', d: 'Head-to-head matchups so you can stop going back and forth.',
    art: (
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <rect x="14" y="20" width="36" height="52" rx="8" fill="#fff" opacity=".9" />
        <rect x="70" y="20" width="36" height="52" rx="8" fill="#fff" opacity=".9" />
        <circle cx="60" cy="46" r="13" fill="#F59E0B" />
        <path d="M54 46h12M60 40v12" stroke="#1f1300" strokeWidth="0" />
        <text x="60" y="51" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1f1300" fontFamily="Georgia, serif" fontStyle="italic">vs</text>
      </svg>
    ),
  },
  {
    href: '/category/fix-it/', k: 'fixit', t: 'Fix-It', d: 'Step-by-step fixes for error codes, leaks and everyday faults.',
    art: (
      <svg viewBox="0 0 120 90" aria-hidden="true">
        <circle cx="60" cy="45" r="30" fill="#fff" opacity=".35" />
        <path d="M74 24a14 14 0 0 0-19 17L30 66l8 8 25-25a14 14 0 0 0 17-19l-9 9-8-2-2-8z" fill="#fff" />
        <circle cx="92" cy="22" r="7" fill="#F59E0B" />
      </svg>
    ),
  },
]

export function TypeTiles() {
  return (
    <section className="container section" aria-label="Browse by type">
      <div className="type-tiles">
        {TILES.map((t) => (
          <Link key={t.k} href={t.href} className={`type-tile type-${t.k} reveal`}>
            <span className="type-art">{t.art}</span>
            <span className="type-text">
              <b>{t.t}</b>
              <small>{t.d}</small>
            </span>
            <span className="type-go" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
