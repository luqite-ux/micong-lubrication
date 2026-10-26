import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/admin-session'
import { PREVIEW_COOKIE } from '@/lib/site-content/preview-cookie'
import { protectPreviewResponse } from '@/lib/site-content/preview-protection'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const forwarded = new Headers(request.headers)
  forwarded.set('x-hq-pathname', pathname)
  const isPublic = pathname.startsWith('/admin/login') || pathname.startsWith('/admin/logout')
  if (!isPublic && pathname.startsWith('/admin') && !request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    url.searchParams.set('reason', 'unauthorized')
    return NextResponse.redirect(url)
  }
  const response = NextResponse.next({ request: { headers: forwarded } })
  protectPreviewResponse(response.headers, request.cookies.has(PREVIEW_COOKIE))
  return response
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] }
