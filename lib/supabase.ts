import { createClient } from '@supabase/supabase-js'

export function tenantId() {
  return process.env.NEXT_PUBLIC_TENANT_ID?.trim() || null
}

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !key || !tenantId()) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
