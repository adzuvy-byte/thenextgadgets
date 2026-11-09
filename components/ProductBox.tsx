import type {SiteSettings} from '@/lib/settings'
import {BuyButton} from './BuyButton'

export function ProductBox({block, settings}: {block: any; settings: SiteSettings}) {
  const p = block.product
  if (!p) return null
  const bullets: string[] = (block.showSpecs ? (p.specs ?? []).map((s: any) => `${s.label}: ${s.value}`) : p.pros) ?? []
  return (
    <aside className={`productbox${p.image ? ' has-media' : ''}${block.specList?.length ? ' has-specs' : ''}`} aria-label={`Product: ${p.name}`}>
      {p.image ? (
        <div className="productbox-media">
          <img src={p.image} alt={p.imageAlt || p.name} loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="productbox-body">
        {block.badge ? <div className="kicker">{block.badge}</div> : null}
        <h3>{p.name}</h3>
        {block.note || p.verdict ? <p>{block.note || p.verdict}</p> : null}
        {block.specList?.length ? (
          <dl className="pb-specs">
            {block.specList.map((t: string, i: number) => {
              const k = t.indexOf(':')
              return (
                <div key={i}>
                  <dt>{k > 0 ? t.slice(0, k) : 'Spec'}</dt>
                  <dd>{k > 0 ? t.slice(k + 1).trim() : t}</dd>
                </div>
              )
            })}
          </dl>
        ) : bullets.length ? (
          <ul>
            {bullets.slice(0, 4).map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        ) : null}
        <BuyButton product={p} settings={settings} />
      </div>
    </aside>
  )
}
