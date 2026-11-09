import type {Metadata} from 'next'
import {Suspense} from 'react'
import {SearchClient} from '@/components/SearchClient'

export const metadata: Metadata = {
  title: 'Search | TheNextGadgets',
  robots: {index: false, follow: true},
}

export default function SearchPage() {
  return (
    <div className="container listing">
      <h1>Search</h1>
      <Suspense fallback={null}>
        <SearchClient />
      </Suspense>
    </div>
  )
}
