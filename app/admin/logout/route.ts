import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'
import { createAdminClient } from '@/lib/supabase/server'
import { tenantId } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (token) {
    const db = createAdminClient()
    const { data: session } = await db.from('admin_user_sessions').select('id,admin_user_id').eq('token', token).maybeSingle()
    if (session) {
      const { data: user } = await db.from('admin_users').select('tenant_id').eq('id', session.admin_user_id).maybeSingle()
      if (user?.tenant_id === tenantId()) await db.from('admin_user_sessions').delete().eq('id', session.id).eq('token', token)
    }
  }
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 303)
  response.cookies.set(SESSION_COOKIE, '', { path: '/', maxAge: 0 })
  response.cookies.set(TENANT_COOKIE, '', { path: '/', maxAge: 0 })
  return response
}
