import {integrations} from '@/integrations'
import type {Block} from '@/lib/content'
import type {SiteSettings} from '@/lib/settings'
import {AdSlot} from './AdSlot'
import {BestList} from './BestList'
import {ProductBox} from './ProductBox'
import {Choose, Versus} from './Versus'
import {Recommend} from './Recommend'

// Renders the parts of a post body: markdown text, product boxes and ranked lists.
export function Body({value, settings, adAfterIntro = true}: {value: Block[]; settings: SiteSettings; adAfterIntro?: boolean}) {
  if (!value?.length) return null
  // Place one ad after the intro (before the first H2).
  const first = value.findIndex((b) => b._type === 'html' && b.html.includes('<h2'))
  const parts: {key: string; node: React.ReactNode}[] = []
  let pickOffset = 0
  value.forEach((b, i) => {
    if (b._type === 'html') {
      const cut = adAfterIntro && i === first ? b.html.indexOf('<h2') : -1
      if (cut > 0) {
        parts.push({key: `${i}a`, node: <div dangerouslySetInnerHTML={{__html: b.html.slice(0, cut)}} />})
        parts.push({key: `${i}ad`, node: <AdSlot slot={integrations.adSlots.intro} />})
        parts.push({key: `${i}b`, node: <div dangerouslySetInnerHTML={{__html: b.html.slice(cut)}} />})
      } else {
        parts.push({key: String(i), node: <div dangerouslySetInnerHTML={{__html: b.html}} />})
      }
    } else if (b._type === 'productBox') {
      parts.push({key: String(i), node: <ProductBox block={b} settings={settings} />})
    } else if (b._type === 'versus') {
      parts.push({key: String(i), node: <Versus block={b} settings={settings} />})
    } else if (b._type === 'choose') {
      parts.push({key: String(i), node: <Choose block={b} settings={settings} />})
    } else if (b._type === 'recommend') {
      parts.push({key: String(i), node: <Recommend block={b} settings={settings} />})
    } else if (b._type === 'bestTenList') {
      parts.push({key: String(i), node: <BestList block={b} settings={settings} offset={pickOffset} />})
      pickOffset += (b.items ?? []).filter((it: any) => it.product).length
    }
  })
  return (
    <div className="prose">
      {parts.map((p) => (
        <div key={p.key} className="prose-part">
          {p.node}
        </div>
      ))}
    </div>
  )
}
