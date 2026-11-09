import COVER from '@/lib/cover-data.json'

// Generated cover art: no photos needed. Colour and icon come from the article's category,
// the corner mark from its type. Same input always gives the same cover.

type Tone = {a: string; b: string; ink: string}

const TONES: Record<string, Tone> = {
  clay: {a: '#e8f0fb', b: '#9dbfee', ink: '#0d3a85'},
  sand: {a: '#eef1f5', b: '#bcc7d6', ink: '#2c3b52'},
  sage: {a: '#e4f4f1', b: '#9fd3c9', ink: '#0f5f55'},
  slate: {a: '#e9edf3', b: '#aab8cc', ink: '#25354d'},
  plum: {a: '#eceafb', b: '#b4aef0', ink: '#3b2f9e'},
  ochre: {a: '#e1f1fb', b: '#8fc8ec', ink: '#0b4f7c'},
  stone: {a: '#eef0f3', b: '#c3c9d3', ink: '#2f3744'},
  rust: {a: '#e5eefc', b: '#8aa9f0', ink: '#1a3fa0'},
}

const CATEGORY_TONE: Record<string, keyof typeof TONES> = {
  'air-conditioner': 'slate',
  refrigerator: 'slate',
  'air-purifier': 'sage',
  'smart-tv': 'plum',
  soundbar: 'plum',
  earbuds: 'rust',
  laptops: 'stone',
  dashcam: 'clay',
  automobile: 'clay',
  gaming: 'rust',
  accessories: 'ochre',
  'home-kitchen': 'sand',
  camera: 'sage',
  smartphones: 'plum',
  tablet: 'ochre',
  smartwatch: 'rust',
}

const ICONS: Record<string, string> = {
  // simple line drawings on a 64x64 grid
  'air-conditioner': 'M8 18h48a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4zM12 30h40M18 46c0 4-3 4-3 8M32 46c0 4-3 4-3 8M46 46c0 4-3 4-3 8',
  refrigerator: 'M18 6h28a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4zM14 26h36M22 14v6M22 32v10',
  'air-purifier': 'M20 10h24a4 4 0 0 1 4 4v38a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4zM24 20h16M24 26h16M24 32h16M32 42a4 4 0 1 0 0 .1',
  'smart-tv': 'M6 12h52a3 3 0 0 1 3 3v30a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3zM24 56h16M32 48v8',
  soundbar: 'M4 28h56a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3zM12 34h.1M20 34h.1M28 34h.1M36 34h.1M44 34h.1M52 34h.1',
  earbuds: 'M20 14a10 10 0 0 1 10 10v4a6 6 0 0 1-6 6h-2v18a4 4 0 0 1-8 0V24a10 10 0 0 1 6-10zM44 14a10 10 0 0 0-10 10v4a6 6 0 0 0 6 6h2v18a4 4 0 0 0 8 0V24a10 10 0 0 0-6-10z',
  laptops: 'M12 12h40a3 3 0 0 1 3 3v27H9V15a3 3 0 0 1 3-3zM3 42h58l-4 8H7z',
  dashcam: 'M10 20h36a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4zM28 34a7 7 0 1 0 0 .1M50 28l10-6v24l-10-6M18 14h12',
  automobile: 'M8 40l5-14a6 6 0 0 1 6-4h26a6 6 0 0 1 6 4l5 14v10H8zM8 40h48M18 50v4M46 50v4M16 45h.1M48 45h.1',
  gaming: 'M18 22h28c8 0 12 8 12 18 0 6-6 8-10 4l-6-6H22l-6 6c-4 4-10 2-10-4 0-10 4-18 12-18zM20 30v8M16 34h8M44 32h.1M48 36h.1',
  accessories: 'M24 8h16v10H24zM20 18h24v30a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6zM32 54v6',
  'home-kitchen': 'M10 28h44v18a10 10 0 0 1-10 10H20a10 10 0 0 1-10-10zM4 28h56M24 20c0-4 4-4 4-8M36 20c0-4 4-4 4-8',
  smartphones: 'M20 6h24a4 4 0 0 1 4 4v44a4 4 0 0 1-4 4H20a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4zM28 52h8M26 12h12',
  tablet: 'M10 10h44a4 4 0 0 1 4 4v36a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4zM32 47h.1',
  smartwatch: 'M22 4h20l2 10H20zM22 60h20l2-10H20zM18 14h28a4 4 0 0 1 4 4v28a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V18a4 4 0 0 1 4-4zM32 24v9l6 4',
  camera: 'M8 20h12l4-6h16l4 6h12a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4zM32 46a9 9 0 1 0 0-.1',
  default: 'M32 6l6 18h18l-14 11 5 18-15-11-15 11 5-18L8 24h18z',
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export function toneFor(category?: string | null): Tone {
  const k = category && CATEGORY_TONE[category]
  if (k) return TONES[k]
  const keys = Object.keys(TONES)
  return TONES[keys[hash(category ?? 'x') % keys.length]]
}

export function CategoryIcon({slug, size = 28, stroke}: {slug?: string | null; size?: number; stroke?: string}) {
  const d = (slug && ICONS[slug]) || ICONS.default
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={stroke ?? 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

type Pal = {paper: string; accent: string; deep: string; light: string}
const CD = COVER as unknown as {icons: Record<string, string>; keywords: [string, string][]; broad: string[]; palette: Record<string, Pal>}

export function coverPalette(category?: string | null): Pal {
  return (category && CD.palette[category]) || CD.palette.default
}

export function coverIcon(slug: string, category?: string | null): string {
  const cat = category ?? ''
  if (CD.broad.includes(cat) || !CD.icons[cat]) {
    for (const [rx, ic] of CD.keywords) if (new RegExp(rx).test(slug)) return CD.icons[ic]
  }
  return CD.icons[cat] ?? CD.icons.default
}

// "The best *dishwashers*" -> serif headline with one italic accent word
function Headline({text}: {text: string}) {
  const parts = text.split(/\*([^*]+)\*/g)
  return <>{parts.map((t, i) => (i % 2 ? <em key={i}>{t}</em> : t))}</>
}

const TYPE_WORD: Record<string, string> = {best: 'Top picks', review: 'Review', comparison: 'Comparison', fixit: 'Fix-it', guide: 'Guide', news: 'News', blog: 'Read'}

export function Cover({
  type,
  category,
  categoryTitle,
  seed,
  headline,
  picks = 0,
  size = 'md',
  className = '',
}: {
  type?: string
  category?: string | null
  categoryTitle?: string | null
  seed: string
  headline?: string
  picks?: number
  size?: 'sm' | 'md' | 'lg' | 'wide'
  className?: string
}) {
  const p = coverPalette(category)
  const d = coverIcon(seed, category)
  const text = headline || ''
  const len = text.replace(/\*/g, '').length
  const fit = len <= 16 ? 'xs' : len <= 26 ? 's' : len <= 36 ? 'm' : 'l'
  const marker = type === 'comparison' ? 'vs' : type === 'best' && picks > 1 ? String(picks).padStart(2, '0') : ''
  const vars = {'--cv-paper': p.paper, '--cv-accent': p.accent, '--cv-deep': p.deep, '--cv-light': p.light} as React.CSSProperties
  const object = (
    <svg className="cv-object" viewBox="0 0 64 64" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  )
  if (size === 'sm') {
    return (
      <div className={`cv cv-sm ${className}`} style={vars} aria-hidden="true">
        <div className="cv-field">{object}</div>
        {marker ? <span className="cv-marker">{marker}</span> : null}
      </div>
    )
  }
  return (
    <div className={`cv cv-${size} ${className}`} style={vars} aria-hidden="true">
      <div className="cv-field">{object}</div>
      <div className="cv-paper">
        <div className="cv-rule">
          <span><i />{categoryTitle || TYPE_WORD[type ?? ''] || 'Guide'}</span>
          {size === 'lg' && TYPE_WORD[type ?? ''] ? <span>{TYPE_WORD[type ?? '']}</span> : null}
        </div>
        {type === 'best' && picks > 1 ? <div className="cv-picks">{picks} picks</div> : null}
        {text ? (
          <div className={`cv-head cv-fit-${fit}`}>
            <Headline text={text} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
