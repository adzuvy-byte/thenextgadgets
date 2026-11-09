#!/usr/bin/env python3
"""Generates the 1200x630 share card (Open Graph image) for every article, in the
editorial cover style used on the site (paper panel + category colour field).
The article page also shows this card as its cover.

Needs: Python 3, PyYAML, Pillow, and Playwright for Python with Chromium
  (pip3 install pyyaml pillow playwright && python3 -m playwright install chromium)
Run:   python3 tools/og.py                 (all articles; unchanged cards are skipped)
       python3 tools/og.py <slug> <slug>   (only these)
Colours, icons and keyword rules come from lib/cover-data.json (shared with the site).
The cover headline is the article's `coverTitle` frontmatter; *word* is set in italics."""
import hashlib, html, json, os, re, sys
import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'covers')
CACHE = os.path.join(ROOT, 'tools', '.og-cache')
FONTS = os.path.join(ROOT, 'tools', 'fonts')
DATA = json.load(open(os.path.join(ROOT, 'lib', 'cover-data.json'), encoding='utf8'))
W, H = 1200, 630
TYPE_WORD = {'best': 'Top picks', 'review': 'Review', 'comparison': 'Comparison', 'fixit': 'Fix-it guide', 'guide': 'Buying guide', 'news': 'News', 'blog': 'Read'}
LATIN = 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'
EXT = 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'

def ff(fam, file, rng, style='normal', weight='100 900'):
    return f"@font-face{{font-family:'{fam}';src:url('file://{os.path.join(FONTS, file)}') format('woff2');font-style:{style};font-weight:{weight};unicode-range:{rng}}}"
FONT_CSS = ''.join([
    ff('Inter', 'inter-latin.woff2', LATIN), ff('Inter', 'inter-latin-ext.woff2', EXT),
    ff('NR', 'newsreader-latin.woff2', LATIN, weight='200 800'), ff('NR', 'newsreader-latin-ext.woff2', EXT, weight='200 800'),
    ff('NR', 'newsreader-italic-latin.woff2', LATIN, 'italic', '200 800'), ff('NR', 'newsreader-italic-latin-ext.woff2', EXT, 'italic', '200 800'),
])

CSS = FONT_CSS + '''
*{box-sizing:border-box;margin:0}html,body{width:1200px;height:630px;overflow:hidden}
.c{position:relative;width:1200px;height:630px;background:var(--paper);color:#0b1f44;font-family:Inter,sans-serif}
.f{position:absolute;right:0;top:0;bottom:0;width:430px;background:var(--deep);overflow:hidden}
.f svg{position:absolute;left:-70px;top:50%;width:540px;height:540px;transform:translateY(-50%);fill:none;stroke:var(--light);stroke-opacity:.7;stroke-width:1.05;stroke-linecap:round;stroke-linejoin:round}
.p{position:absolute;left:0;top:0;bottom:0;width:770px;padding:58px 64px 52px;display:flex;flex-direction:column}
.r{display:flex;justify-content:space-between;font:600 17px/1 Inter;letter-spacing:.17em;text-transform:uppercase;padding-bottom:18px;border-bottom:1.5px solid rgba(13,71,161,.25)}
.r i{display:inline-block;width:12px;height:12px;background:#f59e0b;margin-right:12px}
.k{margin-top:22px;font:700 18px/1 ui-monospace,Menlo,'DejaVu Sans Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--accent)}
.h{margin-top:auto;font-family:NR,serif;font-weight:500;line-height:1.03;letter-spacing:-.02em}
.h em{font-style:italic;color:var(--accent)}
.b{margin-top:30px;display:flex;align-items:center;gap:18px}.b svg{width:62px;height:62px;border-radius:14px;box-shadow:0 6px 16px -6px rgba(13,71,161,.55)}
.w{display:flex;flex-direction:column;line-height:1}.w1{font:700 40px/1 NR,serif;letter-spacing:-.02em;color:#0f172a}.w1 i{font-style:italic;font-weight:500;color:#0d47a1}.w2{margin-top:7px;font:600 13px/1 Inter;letter-spacing:.42em;text-transform:uppercase;color:#f59e0b;padding-left:2px}
'''

LOGO = '<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0D47A1"/><path d="M14 20h24M26 20v26" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/><path d="M34 46V28l16 18V26" stroke="#F59E0B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'

def icon_for(slug, cat):
    if cat in DATA['broad'] or cat not in DATA['icons']:
        for rx, ic in DATA['keywords']:
            if re.search(rx, slug):
                return DATA['icons'][ic]
    return DATA['icons'].get(cat, DATA['icons']['default'])

def headline_html(t):
    return re.sub(r'\*([^*]+)\*', r'<em>\1</em>', html.escape(t))

def size_for(t):
    n = len(t.replace('*', ''))
    return 118 if n <= 12 else 104 if n <= 18 else 92 if n <= 26 else 80 if n <= 34 else 68

def card(slug, headline, ptype, cat, cat_title, picks):
    p = DATA['palette'].get(cat, DATA['palette']['default'])
    v = f"--paper:{p['paper']};--accent:{p['accent']};--deep:{p['deep']};--light:{p['light']}"
    k = f'<div class="k">{picks} picks compared</div>' if ptype == 'best' and picks > 1 else ''
    return (f'<!doctype html><meta charset="utf-8"><style>{CSS}</style>'
            f'<div class="c" style="{v}"><div class="f"><svg viewBox="0 0 64 64"><path d="{icon_for(slug, cat)}"/></svg></div>'
            f'<div class="p"><div class="r"><span><i></i>{html.escape(cat_title or "TheNextGadgets")}</span><span>{TYPE_WORD.get(ptype, "Guide")}</span></div>{k}'
            f'<div class="h" style="font-size:{size_for(headline)}px">{headline_html(headline)}</div>'
            f'<div class="b">{LOGO}<div class="w"><div class="w1">The<i>Next</i></div><div class="w2">Gadgets</div></div></div></div></div>')

def cover_title(fm):
    t = fm.get('coverTitle')
    if t: return str(t)
    t = re.split(r':| — | – | \| ', fm.get('title', ''))[0]
    t = re.sub(r'\s*\bin India\b', '', t, flags=re.I).strip()
    if fm.get('type') == 'best': t = re.sub(r'^(top\s+\d+\s+)?(\d+\s+)?best\s+', 'The best ', t, flags=re.I)
    return t[:48]

def posts():
    cats = {c['slug']: c for c in json.load(open(os.path.join(ROOT, 'content', 'categories.json'), encoding='utf8'))}
    pd = os.path.join(ROOT, 'content', 'posts')
    for f in sorted(os.listdir(pd)):
        if not f.endswith('.md'): continue
        t = open(os.path.join(pd, f), encoding='utf8').read()
        fm = yaml.safe_load(t.split('---\n', 2)[1])
        picks = len(set(re.findall(r"^\s*-?\s*product:\s*['\"]?([\w.-]+)", t, re.M))) if fm.get('type') == 'best' else 0
        cat = fm.get('category', '')
        yield fm.get('slug') or f[:-3], cover_title(fm), fm.get('type', 'guide'), cat, cats.get(cat, {}).get('title', ''), picks

def shrink(path):
    from PIL import Image  # ~4x smaller: 192-colour dithered PNG
    im = Image.open(path).convert('RGB')
    im.quantize(colors=192, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.FLOYDSTEINBERG).save(path, 'PNG', optimize=True)

def main(only=None):
    from playwright.sync_api import sync_playwright
    os.makedirs(OUT, exist_ok=True); os.makedirs(CACHE, exist_ok=True)
    jobs = []
    for slug, head, ptype, cat, ct, picks in posts():
        if only and slug not in only: continue
        jobs.append((slug, card(slug, head, ptype, cat, ct, picks)))
    jobs.append(('default', card('default', 'Honest guides to the *gadgets* you use', 'guide', 'default', 'Reviews · Best lists · Fixes', 0)))
    n = 0
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={'width': W, 'height': H}, device_scale_factor=1)
        for slug, doc in jobs:
            h = hashlib.md5(doc.encode()).hexdigest()
            out = os.path.join(OUT, slug + '.png'); stamp = os.path.join(CACHE, slug + '.h')
            if os.path.exists(out) and os.path.exists(stamp) and open(stamp).read() == h: continue
            pg.set_content(doc); pg.evaluate('document.fonts.ready')
            pg.screenshot(path=out, clip={'x': 0, 'y': 0, 'width': W, 'height': H})
            shrink(out); open(stamp, 'w').write(h); n += 1
        b.close()
    print(f'{n} cards written')

if __name__ == '__main__':
    main(set(sys.argv[1:]) or None)
