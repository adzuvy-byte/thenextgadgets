import {AFFILIATE_REL, buttonLabel, productHref} from '@/lib/affiliate'
import type {SiteSettings} from '@/lib/settings'

export function BuyButton({product, settings, label}: {product: any; settings: SiteSettings; label?: string}) {
  const href = productHref(product, settings)
  if (!href) return null
  const isAffiliate = Boolean(product?.asin) || Boolean(product?.customUrl)
  return (
    <span className="buy">
      <a className="btn" href={href} rel={isAffiliate ? AFFILIATE_REL : 'noopener'} target="_blank">
        {label ?? buttonLabel(product)}
      </a>
      <span className="buy-note">{settings.disclosureShort || 'Affiliate link. We may earn a commission.'}</span>
    </span>
  )
}
