import Link from 'next/link'
import {absUrl} from '@/lib/seo'
import {JsonLd} from './JsonLd'

export type Crumb = {name: string; href: string}

export function Breadcrumbs({items}: {items: Crumb[]}) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absUrl(c.href),
    })),
  }
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <JsonLd data={ld} />
      {items.map((c, i) => (
        <span key={c.href}>
          {i > 0 ? ' / ' : ''}
          {i < items.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
        </span>
      ))}
    </nav>
  )
}
