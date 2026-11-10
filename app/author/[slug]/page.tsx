import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {JsonLd} from '@/components/JsonLd'
import {PostCard} from '@/components/PostCard'
import {getAuthors, postsByAuthor} from '@/lib/content'
import {absUrl, buildMetadata} from '@/lib/seo'

export const dynamicParams = false

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return getAuthors().map((a) => ({slug: a.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const author = getAuthors().find((a) => a.slug === slug)
  if (!author) return {}
  return buildMetadata({title: `${author.name}, ${author.role || 'Writer'} | TheNextGadgets`, description: author.bio, path: `/author/${slug}/`})
}

export default async function AuthorPage({params}: Props) {
  const {slug} = await params
  const author = getAuthors().find((a) => a.slug === slug)
  if (!author) notFound()
  const posts = postsByAuthor(slug)
  const counts = new Map<string, {title: string; slug: string; n: number}>()
  for (const p of posts) {
    if (!p.category) continue
    const c = counts.get(p.category.slug) ?? {title: p.category.title, slug: p.category.slug, n: 0}
    c.n += 1
    counts.set(p.category.slug, c)
  }
  const topics = [...counts.values()].sort((a, b) => b.n - a.n).slice(0, 8)
  const isTeam = slug === 'editorial-team'
  const url = absUrl(`/author/${slug}/`)
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': isTeam ? 'Organization' : 'Person',
      name: author.name,
      url,
      description: author.bio,
      ...(isTeam ? {} : {jobTitle: author.role, worksFor: {'@type': 'Organization', name: 'TheNextGadgets', url: absUrl('/')}}),
      ...(author.focus?.length ? {knowsAbout: author.focus} : {}),
    },
  }
  return (
    <div className="container listing">
      <JsonLd data={ld} />
      <Breadcrumbs items={[{name: 'Home', href: '/'}, {name: author.name, href: `/author/${slug}/`}]} />
      <h1>{author.name}</h1>
      {author.role ? <div className="meta">{author.role}</div> : null}
      {author.bio ? <p className="dek">{author.bio}</p> : null}
      <div className="author-about">
        {(author.about || []).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
        {topics.length ? (
          <p className="author-topics">
            <strong>{posts.length} articles.</strong> Most written about:{' '}
            {topics.map((t, i) => (
              <span key={t.slug}>
                {i ? ', ' : ''}
                <Link href={`/category/${t.slug}/`}>{t.title}</Link> ({t.n})
              </span>
            ))}
            .
          </p>
        ) : null}
        <p className="author-how">
          How we research and update articles: <Link href="/editorial-policy/">editorial policy</Link> and <Link href="/about-us/">about us</Link>.
        </p>
      </div>
      <h2 className="author-articles-h">Articles by {author.name}</h2>
      <div className="grid-cards listing-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  )
}
