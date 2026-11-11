import type {SiteSettings} from '@/lib/settings'
import {BuyButton} from './BuyButton'
import {amazonImg} from '@/lib/img'

// "TheNextGadgets recommendation": the editorial pick(s) at the end of an article.
export function Recommend({block, settings}: {block: any; settings: SiteSettings}) {
  const picks = (block.picks ?? []).filter((x: any) => x.product)
  if (!picks.length) return null
  return (
    <section className="recommend" aria-label={block.heading}>
      <header className="recommend-head">
        <span className="recommend-kicker">{block.heading}</span>
        {block.intro ? <p>{block.intro}</p> : null}
      </header>
      <div className="recommend-picks">
        {picks.map((x: any, i: number) => (
          <article className="recommend-pick" key={x.product.id + i}>
            {x.product.image ? (
              <img src={amazonImg(x.product.image, 300)} alt={x.product.imageAlt || x.product.name} width={120} height={120} loading="lazy" decoding="async" />
            ) : null}
            <div>
              {x.label ? <div className="kicker">{x.label}</div> : null}
              <h3>{x.product.name}</h3>
              {x.why ? <p>{x.why}</p> : null}
              {x.chooseIf ? <p className="recommend-if"><strong>Choose this if:</strong> {x.chooseIf}</p> : null}
              <BuyButton product={x.product} settings={settings} />
            </div>
          </article>
        ))}
      </div>
      {block.checked ? <p className="recommend-note">{block.checked}</p> : null}
    </section>
  )
}
