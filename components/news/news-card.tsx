import Image from 'next/image'
import Link from '@/components/localized-link'
import { ArrowUpRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { text } from '@/lib/data/repository'
import type { NewsArticle } from '@/lib/data/types'
import { formatDate } from '@/lib/format-date'

export function NewsCard({ article, index = 0 }: { article: NewsArticle; index?: number }) {
  return (
    <Reveal
      as="li"
      delay={stagger(index)}
      className="group relative flex flex-col overflow-hidden rounded-md border border-paper-line bg-white transition-shadow hover:shadow-lg focus-within:shadow-lg"
    >
      {article.cover ? (
        <div className="relative aspect-[16/9] bg-charcoal">
          <Image
            src={article.cover.src}
            alt={text(article.cover.alt)}
            fill
            sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div aria-hidden="true" className="grid-lines relative aspect-[16/9] bg-charcoal">
          <span className="absolute bottom-0 left-0 h-1 w-1/3 bg-brand-red" />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <time dateTime={article.publishedAt} className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-red">
          {formatDate(article.publishedAt)}
        </time>
        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link
            href={`/news/${article.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-brand-yellow"
          >
            {text(article.title)}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{text(article.excerpt)}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-brand-red">
          Read article
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Reveal>
  )
}
