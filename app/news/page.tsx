import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { NewsCard } from '@/components/news/news-card'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { getNewsArticles } from '@/lib/data/repository'

export const revalidate = 60
export const metadata: Metadata = pageMetadata({ path: '/news', title: 'MICONG news', description: 'Company and product news from MICONG.' })

export default async function NewsPage() {
  const articles = (await getNewsArticles()).toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  return (
    <>
      <PageHero
        eyebrow="News"
        title="Company and product news."
        description="Announcements from MICONG will be published here."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'News' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        {articles.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <NewsCard key={article.id} article={article} index={index} />
            ))}
          </ul>
        ) : (
          <Empty className="rounded-md border border-dashed border-input bg-white py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Newspaper aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>No news published yet</EmptyTitle>
              <EmptyDescription>
                MICONG has not released any articles. In the meantime, the product families and the quote request are the fastest way to reach us.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/products"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-charcoal px-6 text-sm font-semibold text-white transition-colors hover:bg-charcoal-3"
                >
                  Browse products
                </Link>
                <Link
                  href="/contact#rfq"
                  className="inline-flex h-11 items-center justify-center rounded-md bg-brand-red px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-red-deep"
                >
                  Request a quote
                </Link>
              </div>
            </EmptyContent>
          </Empty>
        )}
      </div>
    </>
  )
}
