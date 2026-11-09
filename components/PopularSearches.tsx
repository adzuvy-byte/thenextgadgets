import Link from 'next/link'

const TERMS = ['Smart TV', 'Dashcam', 'Air conditioner', 'Washing machine', 'Earbuds', 'Laptop']

export function PopularSearches() {
  return (
    <div className="popular">
      <div className="label">Popular searches</div>
      <div className="chips">
        {TERMS.map((t) => (
          <Link key={t} className="chip" href={`/search/?s=${encodeURIComponent(t)}`}>
            {t}
          </Link>
        ))}
      </div>
    </div>
  )
}
