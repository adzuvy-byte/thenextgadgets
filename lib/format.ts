export const TYPE_LABELS: Record<string, string> = {
  review: 'Review',
  best: 'Best Of',
  comparison: 'Comparison',
  fixit: 'Fix-It',
  guide: 'Buying Guide',
  news: 'News',
  blog: 'Blog',
}

export function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('en-IN', {day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'}).format(new Date(iso))
}
