'use client'

import Link from 'next/link'
import {useSearchParams} from 'next/navigation'
import {useEffect, useState} from 'react'
import {PopularSearches} from './PopularSearches'

type Row = {slug: string; title: string; excerpt: string; type: string; category: string}
const LABEL: Record<string, string> = {review: 'Review', best: 'Best Of', comparison: 'Comparison', fixit: 'Fix-It', guide: 'Buying Guide', news: 'News', blog: 'Blog'}

export function SearchClient() {
  const term = (useSearchParams().get('s') ?? '').trim().slice(0, 80)
  const [rows, setRows] = useState<Row[] | null>(null)
  useEffect(() => {
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(setRows)
      .catch(() => setRows([]))
  }, [])

  const words = term.toLowerCase().split(/\s+/).filter(Boolean)
  const results = (rows ?? [])
    .map((r) => {
      const title = r.title.toLowerCase()
      const rest = `${r.excerpt} ${r.category}`.toLowerCase()
      let score = 0
      for (const w of words) {
        if (title.includes(w)) score += 3
        else if (rest.includes(w)) score += 1
        else return null
      }
      return {r, score}
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((x) => x!.r)

  return (
    <>
      <form action="/search/" method="get" role="search" className="search-page-form">
        <label htmlFor="q" className="sr-only">
          Search reviews and guides
        </label>
        <input id="q" name="s" type="search" defaultValue={term} placeholder="Search reviews and guides" />
        <button type="submit" className="btn">
          Search
        </button>
      </form>
      {!term ? <PopularSearches /> : null}
      {term && rows ? (
        <div className="meta" style={{marginTop: 16}}>
          {results.length} results for "{term}"
        </div>
      ) : null}
      {term && rows && results.length === 0 ? (
        <div className="empty">
          <h2>Nothing found for "{term}"</h2>
          <p>Check the spelling, try a broader word, or start from one of these.</p>
          <PopularSearches />
        </div>
      ) : null}
      <ul className="archive-list" style={{marginTop: 16}}>
        {results.map((r) => (
          <li key={r.slug}>
            <Link href={`/${r.slug}/`}>{r.title}</Link>
            <span className="meta">{[LABEL[r.type], r.category].filter(Boolean).join(' · ')}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
