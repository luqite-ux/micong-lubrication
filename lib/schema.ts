import { company } from '@/lib/site-config'
import { siteUrl } from '@/lib/site-url'
import { localePath } from '@/lib/i18n'

export const organizationId = `${siteUrl('/')}#organization`
export const websiteId = `${siteUrl('/')}#website`

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: company.legalName,
    alternateName: company.brand,
    url: siteUrl('/'),
    logo: siteUrl('/images/micong-logo.jpg'),
    email: company.email,
    telephone: company.phone,
    address: { '@type': 'PostalAddress', streetAddress: 'No. 2218 Hunan Road', addressLocality: 'Shanghai', addressRegion: 'Pudong New Area', addressCountry: 'CN' },
  }
}

export function websiteSchema(locale = 'en') {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': websiteId, url: siteUrl(localePath('/', locale)), name: company.brand, publisher: { '@id': organizationId }, inLanguage: locale }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>, locale = 'en') {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: siteUrl(localePath(item.path, locale)) })) }
}
