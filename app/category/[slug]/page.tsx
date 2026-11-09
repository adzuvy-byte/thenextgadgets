import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {CategoryHero} from '@/components/CategoryHero'
import {PostCard} from '@/components/PostCard'
import {getCategories, postsInCategory} from '@/lib/content'
import {buildMetadata} from '@/lib/seo'

export const dynamicParams = false

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return getCategories().map((c) => ({slug: c.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const category = getCategories().find((c) => c.slug === slug)
  if (!category) return {}
  return buildMetadata({title: `${category.title} | TheNextGadgets`, description: category.description, path: `/category/${slug}/`})
}

// One page per category: every post is listed, newest first. No pagination.
export default async function CategoryPage({params}: Props) {
  const {slug} = await params
  const category = getCategories().find((c) => c.slug === slug)
  if (!category) notFound()
  const posts = postsInCategory(slug)
  return (
    <>
      <CategoryHero category={category} slug={slug} posts={posts} />
      <div className="container listing cat-list">
      <div className="grid-cards listing-grid">
        {posts.map((p) => (
          <PostCard key={p._id} post={p} />
        ))}
      </div>
      </div>
    </>
  )
}
