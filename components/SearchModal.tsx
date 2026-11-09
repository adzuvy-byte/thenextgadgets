'use client'

import {useRouter} from 'next/navigation'
import {useCallback, useEffect, useMemo, useRef, useState} from 'react'

type Row = {slug: string; title: string; excerpt: string; type: string; category: string; categorySlug?: string}

const FILTERS = [
  {key: '', label: 'All'},
  {key: 'best', label: 'Best Of'},
  {key: 'review', label: 'Reviews'},
  {key: 'comparison', label: 'Compare'},
  {key: 'fixit', label: 'Fix-It'},
  {key: 'guide', label: 'Guides'},
]
const LABEL: Record<string, string> = {review: 'Review', best: 'Best Of', comparison: 'Comparison', fixit: 'Fix-It', guide: 'Buying Guide', news: 'News', blog: 'Blog'}
const POPULAR = ['Split AC', 'Dashcam', 'Smart TV', 'Dishwasher', 'Kitchen chimney', 'Earbuds']

let cache: Row[] | null = null

function score(r: Row, words: string[]) {
  const title = r.title.toLowerCase()
  const rest = `${r.excerpt} ${r.category}`.toLowerCase()
  let s = 0
  for (const w of words) {
    if (title.startsWith(w)) s += 5
    else if (title.includes(w)) s += 3
    else if (rest.includes(w)) s += 1
    else return 0
  }
  return s
}

function Highlight({text, words}: {text: string; words: string[]}) {
  if (!words.length) return <>{text}</>
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  return (
    <>
      {text.split(re).map((part, i) => (words.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </>
  )
}

export function SearchModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('')
  const [rows, setRows] = useState<Row[] | null>(cache)
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const show = useCallback(() => {
    setOpen(true)
    if (!cache)
      fetch('/search-index.json')
        .then((r) => r.json())
        .then((d) => {
          cache = d
          setRows(d)
        })
        .catch(() => setRows([]))
  }, [])

  // Cmd/Ctrl+K or "/" opens search anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /input|textarea|select/i.test((e.target as HTMLElement)?.tagName ?? '')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show])

  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('modal-open')
    const t = setTimeout(() => input.current?.focus(), 30)
    return () => {
      clearTimeout(t)
      document.documentElement.classList.remove('modal-open')
    }
  }, [open])

  const words = useMemo(() => q.toLowerCase().trim().split(/\s+/).filter(Boolean), [q])
  const results = useMemo(() => {
    const base = (rows ?? []).filter((r) => !filter || r.type === filter)
    if (!words.length) return filter ? base.slice(0, 8) : []
    return base
      .map((r) => ({r, s: score(r, words)}))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.r)
  }, [rows, words, filter])

  useEffect(() => setActive(0), [q, filter])

  const go = (slug: string) => {
    setOpen(false)
    router.push(`/${slug}/`)
  }
  const submitAll = () => {
    if (!q.trim()) return
    setOpen(false)
    router.push(`/search/?s=${encodeURIComponent(q.trim())}`)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(false)
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active].slug)
      else submitAll()
    }
  }

  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({block: 'nearest'})
  }, [active])

  return (
    <>
      <button type="button" className="search-trigger" onClick={show} aria-label="Search">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-4-4" />
        </svg>
        <span className="search-trigger-text">Search guides</span>
        <kbd className="search-trigger-kbd">⌘K</kbd>
      </button>

      {open ? (
        <div className="sm-backdrop" onMouseDown={() => setOpen(false)}>
          <div className="sm-panel" role="dialog" aria-modal="true" aria-label="Search" onMouseDown={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
            <div className="sm-input-row">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search reviews, best lists, fixes…"
                aria-label="Search"
                aria-controls="sm-results"
                aria-activedescendant={results[active] ? `sm-r-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <button type="button" className="sm-esc" onClick={() => setOpen(false)}>
                Esc
              </button>
            </div>

            <div className="sm-filters" role="group" aria-label="Filter by type">
              {FILTERS.map((f) => (
                <button key={f.key} type="button" className={`sm-chip${filter === f.key ? ' is-on' : ''}`} onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}>
                  {f.label}
                </button>
              ))}
            </div>

            <div className="sm-body">
              {!words.length && !filter ? (
                <div className="sm-empty">
                  <div className="sm-label">Popular searches</div>
                  <div className="sm-popular">
                    {POPULAR.map((p) => (
                      <button key={p} type="button" className="sm-pop" onClick={() => setQ(p)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
                        </svg>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              ) : rows === null ? (
                <div className="sm-note">Loading…</div>
              ) : results.length ? (
                <ul id="sm-results" ref={list} role="listbox" className="sm-results">
                  {results.map((r, i) => (
                    <li
                      key={r.slug}
                      id={`sm-r-${i}`}
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active}
                      className="sm-result"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.slug)}
                    >
                      <span className={`sm-type sm-type-${r.type}`}>{(LABEL[r.type] ?? '').slice(0, 1)}</span>
                      <span className="sm-text">
                        <span className="sm-title">
                          <Highlight text={r.title} words={words} />
                        </span>
                        <span className="sm-meta">{[LABEL[r.type], r.category].filter(Boolean).join(' · ')}</span>
                      </span>
                      <span className="sm-go" aria-hidden="true">
                        ↵
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="sm-note">
                  No matches for “{q}”. Try a broader word, like a product type or brand.
                </div>
              )}
            </div>

            <div className="sm-foot">
              <span>
                <kbd>↑</kbd>
                <kbd>↓</kbd> to move
              </span>
              <span>
                <kbd>↵</kbd> to open
              </span>
              {q.trim() ? (
                <button type="button" className="sm-all" onClick={submitAll}>
                  See all results for “{q.trim()}” →
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
