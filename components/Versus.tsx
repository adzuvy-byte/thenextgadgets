import type {Block} from '@/lib/content'
import type {SiteSettings} from '@/lib/settings'
import {BuyButton} from './BuyButton'

type V = Extract<Block, {_type: 'versus'}>
type C = Extract<Block, {_type: 'choose'}>

export function Versus({block, settings}: {block: V; settings: SiteSettings}) {
  const {a, b, rows} = block
  return (
    <section className="vs" aria-label={`${a.name} versus ${b.name}`}>
      <div className="vs-head">
        <div className="vs-side vs-a">
          {a.tag ? <span className="vs-tag">{a.tag}</span> : null}
          <h3>{a.name}</h3>
          {a.price ? <span className="vs-price">{a.price}</span> : null}
        </div>
        <div className="vs-badge" aria-hidden="true">
          <span>VS</span>
        </div>
        <div className="vs-side vs-b">
          {b.tag ? <span className="vs-tag">{b.tag}</span> : null}
          <h3>{b.name}</h3>
          {b.price ? <span className="vs-price">{b.price}</span> : null}
        </div>
      </div>
      <div className="vs-rows" role="table">
        {rows.map((r, i) => (
          <div key={i} className="vs-row" role="row">
            <div className={`vs-cell vs-cell-a${r.win === 'a' ? ' is-win' : ''}`} role="cell">
              {r.win === 'a' ? <i className="vs-win" aria-label="Advantage" /> : null}
              {r.a}
            </div>
            <div className="vs-label" role="rowheader">
              {r.label}
            </div>
            <div className={`vs-cell vs-cell-b${r.win === 'b' ? ' is-win' : ''}`} role="cell">
              {r.win === 'b' ? <i className="vs-win" aria-label="Advantage" /> : null}
              {r.b}
            </div>
          </div>
        ))}
      </div>
      <div className="vs-foot">
        <div>{a.product ? <BuyButton product={a.product} settings={settings} /> : null}</div>
        <div>{b.product ? <BuyButton product={b.product} settings={settings} /> : null}</div>
      </div>
      {block.note ? <p className="vs-note">{block.note}</p> : null}
    </section>
  )
}

export function Choose({block, settings}: {block: C; settings: SiteSettings}) {
  return (
    <section className="choose" aria-label="Which should you choose">
      {[block.a, block.b].map((s, i) => (
        <div key={i} className={`choose-card ${i === 0 ? 'choose-a' : 'choose-b'}`}>
          <div className="choose-kicker">Choose</div>
          <h3>{s.name}</h3>
          <ul>
            {s.points.map((p, j) => (
              <li key={j}>{p}</li>
            ))}
          </ul>
          {s.product ? <BuyButton product={s.product} settings={settings} /> : null}
        </div>
      ))}
    </section>
  )
}
