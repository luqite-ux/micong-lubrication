import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, TENANT_COOKIE } from '@/lib/admin-session'
import { createAdminClient } from '@/lib/supabase/server'
import { tenantId } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const fail = () => NextResponse.redirect(new URL('/admin/login?error=invalid', request.url), 303)
  const origin = request.headers.get('origin')
  if (!origin || origin !== new URL(request.url).origin) return fail()
  const form = await request.formData()
  const email = String(form.get('email') || '').trim().toLowerCase()
  const password = String(form.get('password') || '')
  if (!email || !password || password.length > 256) return fail()

  const currentTenantId = tenantId()
  if (!currentTenantId) return fail()
  const db = createAdminClient()
  const { data: user } = await db.from('admin_users').select('id,password_hash,is_active,tenant_id').eq('email', email).maybeSingle()
  if (!user?.is_active || user.tenant_id !== currentTenantId || !await bcrypt.compare(password, user.password_hash)) return fail()

  const token = randomUUID()
  const expires = new Date(Date.now() + 7 * 86400000)
  const { error } = await db.from('admin_user_sessions').insert({
    admin_user_id: user.id,
    token,
    expires_at: expires.toISOString(),
    user_agent: request.headers.get('user-agent'),
  })
  if (error) return fail()

  const response = NextResponse.redirect(new URL('/admin', request.url), 303)
  const cookieOptions = { httpOnly: true, secure: new URL(request.url).protocol === 'https:', sameSite: 'lax' as const, path: '/', expires }
  response.cookies.set(SESSION_COOKIE, token, cookieOptions)
  response.cookies.set(TENANT_COOKIE, currentTenantId, cookieOptions)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
