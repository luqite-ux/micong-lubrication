import 'server-only'
import { cache } from 'react'
import { headers } from 'next/headers'
import { getSupabaseClient, tenantId } from '@/lib/supabase'

const languageCode = /^[a-z]{2}(?:-[A-Za-z]{2,4})?$/

/** Enabled languages come from this tenant, never from a URL supplied by a visitor. */
export const activeSiteLocales = cache(async (): Promise<string[]> => {
  const db = getSupabaseClient()
  const id = tenantId()
  if (!db || !id) return ['en']
  const { data, error } = await db.from('tenants')
    .select('default_language,supported_languages').eq('id', id).single()
  if (error || !data) return ['en']
  const configured = Array.isArray(data.supported_languages)
    ? data.supported_languages.filter((value): value is string => typeof value === 'string' && languageCode.test(value))
    : []
  const fallback = typeof data.default_language === 'string' && languageCode.test(data.default_language)
    ? data.default_language : 'en'
  return [...new Set(configured.length ? configured : [fallback])]
})

export const requestLocale = cache(async (): Promise<string> => {
  const path = (await headers()).get('x-hq-pathname') || '/'
  const candidate = path.split('/')[1]
  return (await activeSiteLocales()).includes(candidate) ? candidate : 'en'
})

export function localePath(path: string, locale = 'en'): string {
  return locale === 'en' ? path : `/${locale}${path === '/' ? '' : path}`
}

export function localizedInternalHref(path: string, locale = 'en'): string {
  if (locale === 'en' || !path.startsWith('/') || path.startsWith('//') ||
      /^\/(?:admin|api|_next)(?:\/|[?#]|$)/.test(path) ||
      path === `/${locale}` || path.startsWith(`/${locale}/`)) return path
  return localePath(path, locale)
}
