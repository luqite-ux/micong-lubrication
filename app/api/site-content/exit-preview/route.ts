import { NextResponse } from 'next/server'
import { adapterConfig, PREVIEW_COOKIE } from '@/lib/site-content/site-content'
import { allowsPreviewFormOrigin } from '@/lib/site-content/form-origin'

export async function POST(request: Request) {
  const config = adapterConfig()
  if (!allowsPreviewFormOrigin(request.headers, `https://${config.domain}`)) return new Response('Forbidden', { status: 403 })
  const response = NextResponse.redirect(`https://${config.domain}/`, 303)
  response.cookies.set(PREVIEW_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
