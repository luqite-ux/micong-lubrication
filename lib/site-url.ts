export function siteUrl(path = '') {
  const origin = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, '') || 'http://localhost:3008'
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}
