// Server-only transport: import through site-content.ts in customer applications.
export type AdapterConfig = { adminUrl: string; tenantId: string; domain: string; integrationKey: string }
export type SiteSnapshot = { version: string; definitionVersion: number; locale: string; pages: Array<{ key: string; path: string; modules: Array<{ key: string; type: string; values: Record<string, unknown>; styles?: Record<string, { fontFamily?: string; fontWeight?: number; fontSizeDesktop?: number; fontSizeMobile?: number }> }> }> }
type Fetcher = (input: string | URL | Request, init?: RequestInit & { next?: { revalidate: number } }) => Promise<Response>
export async function loadEntryRedirect(config: AdapterConfig, kind: 'product' | 'article', slug: string, fetcher: Fetcher = fetch): Promise<string | null> {
  const response = await fetcher(`${endpoint(config, '/redirect')}?kind=${kind}&slug=${encodeURIComponent(slug)}`, { cache: 'no-store', redirect: 'error' })
  if (!response.ok) throw new Error('Entry redirect unavailable')
  const result = await response.json()
  if (result.slug === null) return null
  if (typeof result.slug !== 'string' || result.slug.length > 250 || !/^[\p{L}\p{N}_-]+$/u.test(result.slug)) throw new Error('Invalid entry redirect')
  return result.slug
}
function endpoint(config: AdapterConfig, suffix = '') {
  const base = new URL(config.adminUrl)
  if (base.protocol !== 'https:' || base.username || base.password || base.pathname !== '/') throw new Error('invalid admin origin')
  return `${base.origin}/api/site-content/${encodeURIComponent(config.tenantId)}${suffix}`
}
export async function loadSiteSnapshot(config: AdapterConfig, locale: string, previewSession: string | null, fetcher: Fetcher = fetch): Promise<SiteSnapshot | null> {
  const response = previewSession
    ? await fetcher(endpoint(config, '/preview-session'), { method: 'POST', cache: 'no-store', redirect: 'error', headers: { 'Content-Type': 'application/json', 'X-Site-Content-Key': config.integrationKey }, body: JSON.stringify({ domain: config.domain, session: previewSession, locale }) })
    : await fetcher(`${endpoint(config)}?locale=${encodeURIComponent(locale)}`, { cache: 'force-cache', next: { revalidate: 60 }, redirect: 'error' })
  if (!previewSession && response.status === 404) return null
  if (!response.ok) throw new Error(previewSession ? 'Site preview denied or expired; exit preview to view the public site.' : 'Site content unavailable')
  const payload = await response.json()
  if (!payload || typeof payload.version !== 'string' || !Array.isArray(payload.pages)) throw new Error('Invalid site content response')
  return payload as SiteSnapshot
}
export async function exchangePreview(config: AdapterConfig, token: string, fetcher: Fetcher = fetch): Promise<{ session: string; expiresAt: string }> {
  const response = await fetcher(endpoint(config, '/preview'), { method: 'POST', cache: 'no-store', redirect: 'error', headers: { 'Content-Type': 'application/json', 'X-Site-Content-Key': config.integrationKey }, body: JSON.stringify({ domain: config.domain, token }) })
  if (!response.ok) throw new Error('Preview denied or expired')
  const result = await response.json()
  if (typeof result.session !== 'string' || !/^[A-Za-z0-9_-]{43,128}$/.test(result.session) || !Number.isFinite(Date.parse(result.expiresAt))) throw new Error('Invalid preview session')
  return result
}
