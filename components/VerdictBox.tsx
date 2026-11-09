import type {SiteSettings} from '@/lib/settings'
import {BuyButton} from './BuyButton'

export function VerdictBox({verdict, settings}: {verdict: any; settings: SiteSettings}) {
  if (!verdict || (!verdict.summary && verdict.rating == null)) return null
  const product = verdict.product
  return (
    <section aria-label="Quick verdict" className="verdict">
      <div className="verdict-head">Quick verdict</div>
      <div className="verdict-body">
        <div className="verdict-top">
          {verdict.rating != null ? (
            <div className="rating">
              <span className="rating-num">{Number(verdict.rating).toFixed(1)}</span>
              <span className="rating-of">out of 5</span>
            </div>
          ) : (
            <span />
          )}
          {product ? <BuyButton product={product} settings={settings} /> : null}
        </div>
        {verdict.summary ? <p className="verdict-summary">{verdict.summary}</p> : null}
        <div className="proscons">
          {verdict.pros?.length ? (
            <div>
              <h4>Pros</h4>
              <ul>
                {verdict.pros.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {verdict.cons?.length ? (
            <div>
              <h4>Cons</h4>
              <ul>
                {verdict.cons.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        {verdict.skipIf ? (
          <p className="skip">
            <strong>Skip it if:</strong> {verdict.skipIf}
          </p>
        ) : null}
      </div>
    </section>
  )
}
