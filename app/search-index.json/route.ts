import {getAllPosts} from '@/lib/content'

export const dynamic = 'force-static'

// Small list of every article, used by the search page in the browser.
export function GET() {
  const rows = getAllPosts().map((p) => ({slug: p.slug, title: p.title, excerpt: p.excerpt, type: p.postType, category: p.primaryCategory?.title ?? '', categorySlug: p.primaryCategory?.slug ?? '', date: p.lastReviewedAt}))
  return Response.json(rows)
}
