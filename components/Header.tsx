import Link from 'next/link'
import {LogoMark} from './LogoMark'
import {SearchModal} from './SearchModal'

export const NAV = [
  {label: 'Reviews', href: '/category/review/'},
  {label: 'Best Of', href: '/category/best/'},
  {label: 'Compare', href: '/category/comparisons/'},
  {label: 'Fix-It', href: '/category/fix-it/'},
  {label: 'News', href: '/category/news/'},
]

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="wordmark">
          <LogoMark size={32} />
          <span className="wm-text">
            <span className="wm-1">
              The<i>Next</i>
            </span>
            <span className="wm-2">Gadgets</span>
          </span>
        </Link>
        <nav aria-label="Main" className="main-nav">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <details className="menu">
          <summary aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </summary>
          <nav aria-label="Mobile">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
            <Link href="/category/">All categories</Link>
          </nav>
        </details>
        <SearchModal />
      </div>
    </header>
  )
}
