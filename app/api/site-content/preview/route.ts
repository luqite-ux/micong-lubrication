import { NextResponse } from 'next/server'
import { adapterConfig, PREVIEW_COOKIE } from '@/lib/site-content/site-content'
import { exchangePreview } from '@/lib/site-content/transport'
import { allowsPreviewFormOrigin } from '@/lib/site-content/form-origin'

const privateHeaders = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive', 'Referrer-Policy': 'no-referrer' }

export async function POST(request: Request) {
  const config = adapterConfig()
  if (!allowsPreviewFormOrigin(request.headers, `https://${config.domain}`, new URL(config.adminUrl).origin)) return new Response('Preview origin denied', { status: 403, headers: privateHeaders })
  try {
    const form = await request.formData()
    const token = String(form.get('token') ?? '')
    const path = String(form.get('path') ?? '/')
    if (!/^[A-Za-z0-9_-]{43,128}$/.test(token) || !/^\/(?:[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*)?$/.test(path) || /^\/(?:admin|api|login)(?:\/|$)/.test(path)) throw new Error('invalid preview input')
    const session = await exchangePreview(config, token)
    const response = NextResponse.redirect(new URL(path, `https://${config.domain}`), 303)
    Object.entries(privateHeaders).forEach(([key, value]) => response.headers.set(key, value))
    response.cookies.set(PREVIEW_COOKIE, session.session, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', expires: new Date(session.expiresAt) })
    return response
  } catch { return new Response('Preview expired or unavailable. Return to the admin and prepare a new preview.', { status: 403, headers: privateHeaders }) }
}
