import Link from 'next/link'
import {TYPE_LABELS, formatDate} from '@/lib/format'
import {Cover} from './Cover'

export function PostCard({post, showExcerpt = true}: {post: any; showExcerpt?: boolean}) {
  const href = `/${post.slug}/`
  return (
    <article className="card reveal">
      <Link href={href} className="card-cover" aria-hidden="true" tabIndex={-1}>
        <Cover type={post.postType} category={post.category?.slug} categoryTitle={post.category?.title} seed={post.slug} headline={post.coverTitle} picks={post.picks} />
      </Link>
      <div className="card-body">
        <div className="kicker" data-type={post.postType}>
          {TYPE_LABELS[post.postType] ?? ''}
          {post.category ? <span className="kicker-sep"> · {post.category.title}</span> : null}
        </div>
        <h3>
          <Link href={href} className="card-link">
            {post.title}
          </Link>
        </h3>
        {showExcerpt && post.excerpt ? <p className="card-excerpt">{post.excerpt}</p> : null}
        <div className="meta">Updated {formatDate(post.lastReviewedAt ?? post.publishedAt)}</div>
      </div>
    </article>
  )
}
