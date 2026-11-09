import type {MetadataRoute} from 'next'
import {getAllPages, getAllPosts, getAuthors, getCategories} from '@/lib/content'
import {absUrl} from '@/lib/seo'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {url: absUrl('/'), changeFrequency: 'daily', priority: 1},
    {url: absUrl('/archive/'), changeFrequency: 'weekly', priority: 0.4},
    ...getAllPosts().map((p) => ({url: absUrl(`/${p.slug}/`), lastModified: p.lastReviewedAt, changeFrequency: 'monthly' as const, priority: 0.8})),
    ...getAllPages().map((p) => ({url: absUrl(`/${p.slug}/`), priority: 0.3})),
    ...getCategories().map((c) => ({url: absUrl(`/category/${c.slug}/`), priority: 0.6})),
    ...getAuthors().map((a) => ({url: absUrl(`/author/${a.slug}/`), priority: 0.3})),
  ]
}
