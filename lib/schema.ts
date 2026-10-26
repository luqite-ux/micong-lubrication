import { company } from '@/lib/site-config'
import { siteUrl } from '@/lib/site-url'

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

export function websiteSchema() {
  return { '@context': 'https://schema.org', '@type': 'WebSite', '@id': websiteId, url: siteUrl('/'), name: company.brand, publisher: { '@id': organizationId }, inLanguage: 'en' }
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: siteUrl(item.path) })) }
}
