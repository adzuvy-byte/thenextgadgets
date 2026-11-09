import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Breadcrumbs} from '@/components/Breadcrumbs'
import {PostCard} from '@/components/PostCard'
import {getAuthors, postsByAuthor} from '@/lib/content'
import {buildMetadata} from '@/lib/seo'

export const dynamicParams = false

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return getAuthors().map((a) => ({slug: a.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const author = getAuthors().find((a) => a.slug === slug)
  if (!author) return {}
  return buildMetadata({title: `${author.name} | TheNextGadgets`, description: author.bio, path: `/author/${slug}/`})
}

export default async function AuthorPage({params}: Props) {
  const {slug} = await params
  const author = getAuthors().find((a) => a.slug === slug)
  if (!author) notFound()
  const posts = postsByAuthor(slug)
  return (
    <div className="container listing">
      <Breadcrumbs items={[{name: 'Home', href: '/'}, {name: author.name, href: `/author/${slug}/`}]} />
      <h1>{author.name}</h1>
      {author.role ? <div className="meta">{author.role}</div> : null}
      {author.bio ? <p className="dek">{author.bio}</p> : null}
      <div className="grid-cards listing-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
    </div>
  )
}
