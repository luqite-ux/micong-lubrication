import type { MetadataRoute } from 'next'
import { getNewsArticles, getProductFamilies } from '@/lib/data/repository'
import { siteUrl } from '@/lib/site-url'
import { activeSiteLocales, localePath } from '@/lib/i18n'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles, locales] = await Promise.all([getProductFamilies('en'), getNewsArticles('en'), activeSiteLocales()])
  const now = new Date()
  const staticPages = ['', '/about', '/products', '/applications', '/news', '/contact']
  return locales.flatMap(locale => [
    ...staticPages.map(path => ({ url: siteUrl(localePath(path || '/', locale)).replace(/\/$/, ''), lastModified: now })),
    ...products.map(product => ({ url: siteUrl(localePath(`/products/${product.slug}`, locale)), lastModified: product.updatedAt ? new Date(product.updatedAt) : now })),
    ...articles.map(article => ({ url: siteUrl(localePath(`/news/${article.slug}`, locale)), lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(article.publishedAt) })),
  ])
}
