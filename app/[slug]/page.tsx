import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {Article} from '@/components/Article'
import {StaticPage} from '@/components/StaticPage'
import {getAllPages, getAllPosts, getPage, getPost, getSettings} from '@/lib/content'
import {buildMetadata} from '@/lib/seo'

export const dynamicParams = false

type Props = {params: Promise<{slug: string}>}

export function generateStaticParams() {
  return [...getAllPosts().map((p) => ({slug: p.slug})), ...getAllPages().map((p) => ({slug: p.slug}))]
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const post = getPost(slug)
  if (post) {
    return buildMetadata({
      title: post.seo.title || post.title,
      description: post.seo.description || post.excerpt,
      path: `/${slug}/`,
      noindex: post.seo.noindex,
      type: 'article',
      image: `/covers/${slug}.png`,
    })
  }
  const page = getPage(slug)
  if (page) return buildMetadata({title: page.title, description: page.description, path: `/${slug}/`})
  return {}
}

// A slug is either a post or a static page (About, Privacy, ...).
export default async function SlugPage({params}: Props) {
  const {slug} = await params
  const settings = getSettings()
  const post = getPost(slug)
  if (post) return <Article post={post} settings={settings} />
  const page = getPage(slug)
  if (page) return <StaticPage page={page} settings={settings} />
  notFound()
}
