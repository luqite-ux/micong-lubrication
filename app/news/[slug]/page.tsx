import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleBody } from '@/components/news/article-body'
import { PageHero } from '@/components/page-hero'
import { getNewsArticleBySlug, getNewsArticles, text } from '@/lib/data/repository'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, organizationId } from '@/lib/schema'
import { siteUrl } from '@/lib/site-url'
import { localePath, requestLocale } from '@/lib/i18n'

type NewsArticlePageProps = { params: Promise<{ slug: string }> }

export const revalidate = 60
export const dynamicParams = true
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const articles = await getNewsArticles('en')
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticleBySlug(slug)
  if (!article) return { title: 'Article not found' }
  return pageMetadata({ path: `/news/${slug}`, title: text(article.title), description: text(article.excerpt), type: 'article', image: article.cover?.src })
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params
  const article = await getNewsArticleBySlug(slug)
  if (!article) notFound()
  const locale = await requestLocale()

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'News', path: '/news' }, { name: text(article.title), path: `/news/${slug}` }], locale),
        { '@context': 'https://schema.org', '@type': 'Article', '@id': `${siteUrl(localePath(`/news/${slug}`,locale))}#article`, headline: text(article.title), description: text(article.excerpt), datePublished: article.publishedAt, dateModified: article.updatedAt || article.publishedAt, author: { '@id': organizationId }, publisher: { '@id': organizationId }, mainEntityOfPage: siteUrl(localePath(`/news/${slug}`,locale)), ...(article.cover ? { image: article.cover.src } : {}) },
      ]} />
      <PageHero
        eyebrow="News"
        title={text(article.title)}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'News', href: '/news' },
          { label: text(article.title) },
        ]}
      />
      <ArticleBody article={article} />
    </>
  )
}
