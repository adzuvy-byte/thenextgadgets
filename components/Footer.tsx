import Link from 'next/link'
import {LogoMark} from './LogoMark'
import type {SiteSettings} from '@/lib/settings'

export function Footer({settings}: {settings: SiteSettings}) {
  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container footer-row">
        <div className="footer-brand">
          <div className="wordmark-sm">
            <LogoMark size={30} />
            <span className="wm-text">
              <span className="wm-1">
                The<i>Next</i>
              </span>
              <span className="wm-2">Gadgets</span>
            </span>
          </div>
          <p>
            {settings.disclosureLong ||
              'We may earn a commission on qualifying purchases made through links on this site. It never changes our verdict.'}
          </p>
        </div>
        <nav aria-label="Footer" className="footer-nav">
          <Link href="/about-us/">About</Link>
          <Link href="/category/">All categories</Link>
          <Link href="/archive/">Archive</Link>
          <Link href="/disclaimer/">Affiliate disclosure</Link>
          <Link href="/editorial-policy/">Editorial policy</Link>
          <Link href="/privacy-policy/">Privacy</Link>
          <Link href="/cookie-policy/">Cookies</Link>
          <Link href="/terms-and-conditions/">Terms</Link>
          <Link href="/contact-us/">Contact</Link>
        </nav>
      </div>
      <div className="container footer-copy">© {new Date().getFullYear()} TheNextGadgets. All rights reserved.</div>
    </footer>
  )
}
