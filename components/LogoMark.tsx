export function LogoMark({size = 30}: {size?: number}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="logo-mark">
      <rect width="64" height="64" rx="14" fill="#0D47A1" />
      <path d="M14 20h24M26 20v26" stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M34 46V28l16 18V26" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}
