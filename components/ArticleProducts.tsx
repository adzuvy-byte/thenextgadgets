import {AFFILIATE_REL, productHref} from '@/lib/affiliate'
import {articleProducts} from '@/lib/content'
import {amazonImg} from '@/lib/img'
import type {SiteSettings} from '@/lib/settings'

const short = (n: string) => {
  const s = n.split(/[,|(]/)[0].trim()
  return s.length > 46 ? s.slice(0, 45).trimEnd() + '…' : s
}

// Very small cards for the products an article mentions. Not shown on best-of lists.
export function ArticleProducts({post, settings}: {post: any; settings: SiteSettings}) {
  const items = articleProducts(post)
  if (!items.length) return null
  return (
    <section className="ap" aria-label="Products in this article">
      <h2 className="ap-title">Products in this article</h2>
      <ul className="ap-list">
        {items.map((m: any) => {
          const href = productHref(m, settings)
          const inner = (
            <>
              {m.image ? (
                <span className="ap-thumb" aria-hidden="true"><img src={amazonImg(m.image, 150)} alt="" width={36} height={36} loading="lazy" decoding="async" /></span>
              ) : (
                <span className="ap-dot" aria-hidden="true">{m.name.trim().charAt(0).toUpperCase()}</span>
              )}
              <span className="ap-name">{short(m.name)}</span>
              {href ? <span className="ap-cta">View on Amazon.in</span> : null}
            </>
          )
          return (
            <li key={m.id}>
              {href ? (
                <a className="ap-card" href={href} rel={AFFILIATE_REL} target="_blank">{inner}</a>
              ) : (
                <span className="ap-card">{inner}</span>
              )}
            </li>
          )
        })}
      </ul>
      <p className="ap-note">{settings.disclosureShort || 'Affiliate links. We may earn a commission.'}</p>
    </section>
  )
}
