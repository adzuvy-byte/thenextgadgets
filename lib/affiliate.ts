// Builds every Amazon link from the ASIN plus the one tag in Site settings.

export type AffiliateSettings = {
  affiliateTag?: string
  amazonDomain?: string
}

export type LinkableProduct = {
  asin?: string | null
  url?: string | null
  status?: 'active' | 'out-of-stock' | 'discontinued' | null
}

export const AFFILIATE_REL = 'sponsored nofollow noopener'

export function amazonUrl(asin: string, settings: AffiliateSettings): string {
  const domain = settings?.amazonDomain || 'www.amazon.in'
  const base = `https://${domain}/dp/${asin.toUpperCase()}`
  return settings?.affiliateTag ? `${base}?tag=${encodeURIComponent(settings.affiliateTag)}` : base
}

// URL for a product button, or null when it should not be linked.
export function productHref(product: LinkableProduct | null | undefined, settings: AffiliateSettings): string | null {
  if (!product || product.status === 'discontinued') return null
  if (product.asin) return amazonUrl(product.asin, settings)
  return product.url ?? null
}

// Label that stays true when prices change.
export function buttonLabel(product: LinkableProduct | null | undefined): string {
  if (product?.status === 'out-of-stock') return 'Check availability on Amazon'
  if (product?.url && !product?.asin && !isAmazonHref(product.url)) return 'Visit store'
  return 'Check price on Amazon'
}

// Hand-pasted links inside articles: treat Amazon links as sponsored automatically.
export function isAmazonHref(href?: string): boolean {
  if (!href) return false
  try {
    const host = new URL(href).hostname
    return /(^|\.)amazon\.[a-z.]+$/.test(host) || host === 'amzn.to' || host === 'link.amazon' || host === 'amzn.in'
  } catch {
    return false
  }
}
