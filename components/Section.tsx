import Link from 'next/link'
import type {ReactNode} from 'react'

export function Section({title, href, linkLabel, children, className}: {className?: string; title: string; href?: string; linkLabel?: string; children: ReactNode}) {
  return (
    <section className={`container section${className ? " " + className : ""}`}>
      <div className="section-head">
        <h2>{title}</h2>
        {href ? (
          <Link href={href} className="link-accent">
            {linkLabel ?? 'View all'}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  )
}
