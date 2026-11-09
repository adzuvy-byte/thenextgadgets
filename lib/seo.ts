import type {Metadata} from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://thenextgadgets.com').replace(/\/$/, '')

export function absUrl(path: string): string {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

type MetaInput = {title: string; description?: string; path: string; noindex?: boolean; canonical?: string; type?: 'website' | 'article'; image?: string}

export function buildMetadata({title, description, path, noindex, canonical, type = 'website', image = '/covers/default.png'}: MetaInput): Metadata {
  const url = canonical || absUrl(path)
  const img = absUrl(image)
  return {
    title,
    description,
    alternates: {canonical: url},
    robots: noindex ? {index: false, follow: true} : undefined,
    openGraph: {title, description, url, type, siteName: 'TheNextGadgets', locale: 'en_IN', images: [{url: img, width: 1200, height: 630, alt: title}]},
    twitter: {card: 'summary_large_image', title, description, images: [img]},
  }
}
