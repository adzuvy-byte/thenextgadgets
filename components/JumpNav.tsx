import type {NavItem} from '@/lib/content'

export function JumpNav({title, items}: {title: string; items: NavItem[]}) {
  if (!items.length) return null
  return (
    <nav aria-label={title} className="jumpnav">
      <div className="label">{title}</div>
      <ol>
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`}>{i.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
