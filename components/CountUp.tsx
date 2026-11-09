'use client'
import {useEffect, useRef, useState} from 'react'

export function CountUp({to, suffix = ''}: {to: number; suffix?: string}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [n, setN] = useState(to)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setN(0)
    const io = new IntersectionObserver(
      (es) => {
        if (!es[0].isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const dur = 1400
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / dur)
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      {threshold: 0.4},
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  )
}
