import Link from 'next/link'
import {PopularSearches} from '@/components/PopularSearches'

export default function NotFound() {
  return (
    <div className="container listing">
      <div className="kicker">404</div>
      <h1>We could not find that page</h1>
      <p className="dek">It may have moved or been removed. Search for it, or start from one of the sections below.</p>
      <form action="/search/" method="get" role="search" className="search-page-form">
        <label htmlFor="q404" className="sr-only">
          Search reviews and guides
        </label>
        <input id="q404" name="s" type="search" placeholder="Search reviews and guides" />
        <button type="submit" className="btn">
          Search
        </button>
      </form>
      <PopularSearches />
      <p className="not-found-links">
        <Link href="/" className="btn">
          Go to the homepage
        </Link>{' '}
        <Link href="/archive/" className="link-underline">
          Browse the archive
        </Link>
      </p>
    </div>
  )
}
