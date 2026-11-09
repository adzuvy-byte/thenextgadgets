import type {Metadata} from 'next'
import Link from 'next/link'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {getCategories} from '@/lib/content'
import {buildMetadata} from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'All categories | TheNextGadgets',
  description: 'Browse every topic and article type on TheNextGadgets.',
  path: '/category/',
})

const GROUPS: Record<string, string> = {
  'home-appliances': 'Home appliances',
  'tv-audio': 'TV & audio',
  'mobiles-computing': 'Mobiles & computing',
  'car-mobility': 'Car & mobility',
  'gaming-accessories': 'Gaming & accessories',
}

export default function CategoriesPage() {
  const cats = getCategories()
  const topics = cats.filter((c) => c.kind !== 'format')
  const formats = cats.filter((c) => c.kind === 'format')
  return (
    <div className="container listing">
      <Breadcrumbs items={[{name: 'Home', href: '/'}, {name: 'Categories', href: '/category/'}]} />
      <h1>All categories</h1>
      {Object.entries(GROUPS).map(([key, label]) => {
        const items = topics.filter((c) => c.group === key)
        if (!items.length) return null
        return (
          <section key={key} className="cat-group">
            <h2>{label}</h2>
            <div className="chips">
              {items.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}/`} className="chip">
                  {c.title}
                </Link>
              ))}
            </div>
          </section>
        )
      })}
      <section className="cat-group">
        <h2>Article types</h2>
        <div className="chips">
          {formats.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}/`} className="chip">
              {c.title}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
