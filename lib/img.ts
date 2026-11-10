// Amazon image URLs end in ._AC_SL500_.jpg. Ask for the size we actually display.
export function amazonImg(url: string | undefined, px: number): string | undefined {
  if (!url) return url
  return url.replace(/\._AC_SL\d+_\./, `._AC_SL${px}_.`)
}
