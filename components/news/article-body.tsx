import Image from 'next/image'
import Link from '@/components/localized-link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { text } from '@/lib/data/repository'
import type { NewsArticle } from '@/lib/data/types'
import { formatDate } from '@/lib/format-date'

type ArticleBodyProps = {
  article: NewsArticle
  /** Marks the layout sample so it can never be mistaken for a real article. */
  layoutSample?: boolean
}

export function ArticleBody({ article, layoutSample = false }: ArticleBodyProps) {
  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-20">
      <article>
        {layoutSample ? (
          <p
            role="note"
            className="mb-8 rounded-md border-l-4 border-brand-yellow bg-amber-50 p-4 text-sm font-medium text-ink"
          >
            Layout sample with placeholder text. This is not a MICONG article.
          </p>
        ) : null}
        <p className="text-sm text-ink-soft">
          Published <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
        </p>
        {article.cover ? (
          <Reveal className="relative mt-6 aspect-[16/9] overflow-hidden rounded-md bg-charcoal">
            <Image
              src={article.cover.src}
              alt={text(article.cover.alt)}
              fill
              sizes="(min-width: 1024px) 760px, 100vw"
              className="object-cover"
            />
          </Reveal>
        ) : null}
        <Reveal className="mt-8 grid max-w-[68ch] gap-5 text-base leading-[1.75] text-ink">
          <p className="text-lg font-medium leading-relaxed text-ink-soft">{text(article.excerpt)}</p>
          {article.body.map((paragraph, index) => (
            <p key={index}>{text(paragraph)}</p>
          ))}
        </Reveal>
        <div className="mt-12 border-t border-paper-line pt-6">
          <Link href="/news" className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-brand-red">
            <ArrowLeft className="size-4" aria-hidden="true" />
            All news
          </Link>
        </div>
      </article>

      <aside aria-label="Related links" className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-md bg-charcoal p-6 text-white">
          <h2 className="text-lg font-bold">Have a product question?</h2>
          <p className="mt-2 text-sm leading-relaxed text-white/75">
            Send the family, grade, quantity and destination and we will reply by email or phone.
          </p>
          <Link
            href="/contact#rfq"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-brand-red px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-deep"
          >
            Request a quote
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-4 grid gap-2 text-sm font-semibold text-ink">
          <li>
            <Link href="/products" className="underline decoration-brand-red decoration-2 underline-offset-4">
              Browse product families
            </Link>
          </li>
          <li>
            <Link href="/applications" className="underline decoration-brand-red decoration-2 underline-offset-4">
              Find by application
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  )
}
