import Link from 'next/link'
import type {SiteSettings} from '@/lib/settings'
import {AFFILIATE_REL, buttonLabel, productHref} from '@/lib/affiliate'
import {BuyButton} from './BuyButton'

export function BestList({block, settings}: {block: any; settings: SiteSettings}) {
  const items: any[] = (block.items ?? []).filter((it: any) => it.product)
  if (!items.length) return null
  const hasRating = items.some((it) => it.rating != null)
  return (
    <section className="best">
      {block.heading ? <h2 id="picks">{block.heading}</h2> : null}

      {block.showSummaryTable !== false ? (
        <div className="table-wrap">
          <table className="glance">
            <caption className="sr-only">All {items.length} picks at a glance</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Product</th>
                <th scope="col">Best for</th>
                {hasRating ? <th scope="col">Rating</th> : null}
                <th scope="col">
                  <span className="sr-only">Link</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, i) => {
                const href = productHref(it.product, settings)
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <a href={`#pick-${i + 1}`} className="strong">
                        {it.product.name}
                      </a>
                    </td>
                    <td>{it.badge ?? ''}</td>
                    {hasRating ? <td>{it.rating != null ? Number(it.rating).toFixed(1) : ''}</td> : null}
                    <td>
                      {href ? (
                        <a href={href} rel={AFFILIATE_REL} target="_blank" className="link-accent">
                          {buttonLabel(it.product).replace(' on Amazon', '')}
                        </a>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {items.map((it, i) => {
        const p = it.product
        const specs: {k: string; v: string}[] = (it.specs ?? []).map((x: string) => {
          const j = x.indexOf(':')
          return j > 0 ? {k: x.slice(0, j).trim(), v: x.slice(j + 1).trim()} : {k: '', v: x}
        })
        const pros: string[] = it.pros?.length ? it.pros : (p.pros ?? [])
        const cons: string[] = it.cons?.length ? it.cons : (p.cons ?? [])
        const skip = it.skipIf || p.skipIf
        const verdict = it.verdict || p.verdict
        const brand = p.brand || String(p.name).split(' ')[0]
        const lead = i === 0
        return (
          <article key={i} id={`pick-${i + 1}`} className={`pickcard${lead ? ' pickcard-lead' : ''}`}>
            <header className="pc-head">
              <span className="pc-rank" aria-label={`Number ${i + 1}`}>
                <small>No.</small>
                {i + 1}
              </span>
              <div className="pc-title">
                <div className="pc-meta">
                  <span className="pc-brand">{brand}</span>
                  {it.badge ? <span className={`pc-badge${lead ? ' pc-badge-lead' : ''}`}>{it.badge}</span> : null}
                </div>
                <h3>{p.name}</h3>
              </div>
            </header>

            {p.image || specs.length ? (
              <div className={`pc-top${p.image ? ' has-media' : ''}`}>
                {p.image ? (
                  <div className="pc-media">
                    <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" decoding="async" />
                  </div>
                ) : null}
                {specs.length ? (
                  <dl className="pc-specs">
                    {specs.map((sp, j) => (
                      <div key={j}>
                        <dt>{sp.k || 'Spec'}</dt>
                        <dd>{sp.v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            ) : null}

            {verdict ? <p className="pc-verdict">{verdict}</p> : null}

            {pros.length || cons.length ? (
              <div className="pc-pc">
                {pros.length ? (
                  <div className="pc-pros">
                    <h4>Why we like it</h4>
                    <ul>
                      {pros.map((x, j) => (
                        <li key={j}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {cons.length ? (
                  <div className="pc-cons">
                    <h4>Keep in mind</h4>
                    <ul>
                      {cons.map((x, j) => (
                        <li key={j}>{x}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {skip ? (
              <p className="pc-skip">
                <strong>Skip it if</strong> {skip}
              </p>
            ) : null}

            <footer className="pc-foot">
              <BuyButton product={p} settings={settings} />
              {it.fullReview?.slug ? (
                <Link href={`/${it.fullReview.slug}/`} className="link-underline">
                  Read the full review
                </Link>
              ) : null}
            </footer>
          </article>
        )
      })}
    </section>
  )
}
