import type { MetadataRoute } from 'next'
import { getNewsArticles, getProductFamilies } from '@/lib/data/repository'
import { siteUrl } from '@/lib/site-url'

export const revalidate = 60

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, articles] = await Promise.all([getProductFamilies(), getNewsArticles()])
  const now = new Date()
  const staticPages = ['', '/about', '/products', '/applications', '/news', '/contact']
  return [
    ...staticPages.map(path => ({ url: path ? siteUrl(path) : siteUrl('/').replace(/\/$/, ''), lastModified: now })),
    ...products.map(product => ({ url: siteUrl(`/products/${product.slug}`), lastModified: product.updatedAt ? new Date(product.updatedAt) : now })),
    ...articles.map(article => ({ url: siteUrl(`/news/${article.slug}`), lastModified: article.updatedAt ? new Date(article.updatedAt) : new Date(article.publishedAt) })),
  ]
}
