import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { loadSiteSnapshot, type AdapterConfig } from './transport'
import { PREVIEW_COOKIE } from './preview-cookie'

export { PREVIEW_COOKIE }
export function adapterConfig(): AdapterConfig {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim() || 'https://admin.globle-trade.com'
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  const domain = process.env.SITE_CONTENT_DOMAIN?.trim()
  const integrationKey = process.env.SITE_CONTENT_INTEGRATION_KEY?.trim()
  if (!tenantId || !domain || !integrationKey) throw new Error('Site content adapter is not configured')
  return { adminUrl, tenantId, domain, integrationKey }
}
export const getSiteContent = cache(async (locale: string) => {
  const session = (await cookies()).get(PREVIEW_COOKIE)?.value ?? null
  return loadSiteSnapshot(adapterConfig(), locale, session)
})
export async function siteContentMetadata(path: string, locale: string) {
  const snapshot = await getSiteContent(locale)
  const page = snapshot?.pages.find(page => page.path === path)
  const seo = page?.modules.find(module => module.type === 'seo')?.values
  const preview = Boolean((await cookies()).get(PREVIEW_COOKIE)?.value)
  return {
    ...(typeof seo?.title === 'string' && seo.title ? { title: seo.title } : {}),
    ...(typeof seo?.description === 'string' && seo.description ? { description: seo.description } : {}),
    ...(preview ? { robots: { index: false, follow: false } } : {}),
  }
}
