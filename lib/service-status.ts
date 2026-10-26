export const SERVICE_GUARD_VERSION = '1'

interface StatusPayload { available?: boolean; status?: string; version?: number }
type GuardRequest = Pick<Request, 'url' | 'headers'> & { method?: string }
type ProbeClaims = { v: number; tenant: string; host: string; path: string; run: string; sha: string; mode: 'active' | 'expired'; iat: number; exp: number }

function decodeBase64Url(value: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length > 1800) return null
  try {
    const raw = atob(value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4))
    return Uint8Array.from(raw, char => char.charCodeAt(0))
  } catch { return null }
}

async function signedProbeMode(request?: GuardRequest): Promise<ProbeClaims['mode'] | null> {
  const token = request?.headers.get('x-hq-service-guard-probe')
  if (!token || request?.method !== 'GET' || token.length > 2048) return null
  const secret = process.env.SERVICE_GUARD_PROBE_SECRET_B64URL
  const run = process.env.SERVICE_GUARD_PROBE_RUN_ID
  const host = process.env.SERVICE_GUARD_PROBE_HOST
  const sha = process.env.SERVICE_GUARD_PROBE_DEPLOYMENT_SHA
  const until = Date.parse(process.env.SERVICE_GUARD_PROBE_UNTIL ?? '')
  const now = Date.now()
  if (!secret || !run || !host || !sha || !Number.isFinite(until) || now > until || until > now + 30 * 60_000) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const keyBytes = decodeBase64Url(secret)
  const payloadBytes = decodeBase64Url(parts[0])
  const signature = decodeBase64Url(parts[1])
  if (!keyBytes || keyBytes.length < 32 || !payloadBytes || !signature || signature.length !== 32) return null
  try {
    const url = new URL(request.url)
    if (isServiceGuardExcludedPath(url.pathname)) return null
    const claims = JSON.parse(new TextDecoder().decode(payloadBytes)) as ProbeClaims
    if (claims.v !== 1 || claims.tenant !== process.env.NEXT_PUBLIC_TENANT_ID || claims.host !== host || url.hostname !== host || claims.path !== url.pathname || claims.run !== run || claims.sha !== sha || !['active', 'expired'].includes(claims.mode) || !Number.isSafeInteger(claims.iat) || !Number.isSafeInteger(claims.exp) || claims.iat > now + 30_000 || claims.iat < now - 120_000 || claims.exp < now || claims.exp > Math.min(claims.iat + 120_000, until)) return null
    const key = await crypto.subtle.importKey('raw', keyBytes as BufferSource, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    return await crypto.subtle.verify('HMAC', key, signature as BufferSource, new TextEncoder().encode(parts[0])) ? claims.mode : null
  } catch { return null }
}

export async function isWebsiteServiceAvailable(request?: GuardRequest): Promise<boolean> {
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim().replace(/\/$/, '')
  if (!tenantId || !adminUrl) return true
  const probe = await signedProbeMode(request)
  if (probe) return probe === 'active'
  try {
    const response = await fetch(`${adminUrl}/api/public/service-status/${encodeURIComponent(tenantId)}`, {
      signal: AbortSignal.timeout(2000), next: { revalidate: 60 },
    })
    if (!response.ok) return true
    const payload = await response.json() as StatusPayload
    return !(payload.version === 1 && payload.available === false && payload.status === 'expired')
  } catch { return true }
}

export function isServiceGuardExcludedPath(pathname: string): boolean {
  return pathname === '/service-expired'
    || pathname.startsWith('/admin') || pathname.startsWith('/api')
    || pathname.startsWith('/_next') || pathname === '/favicon.ico'
    || /\.[a-z0-9]+$/i.test(pathname)
}
