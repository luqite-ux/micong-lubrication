import Link from 'next/link'
import { FaqList } from '@/components/faq-list'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { getFaqItems } from '@/lib/data/repository'
import type { FaqItem } from '@/lib/data/types'
import { siteTypographyStyle } from '@/lib/site-content/typography'
import type { SiteSnapshot } from '@/lib/site-content/transport'

export async function FaqSection({ items: suppliedItems, title = 'Questions buyers ask first', description = 'Source-checked answers on product fit, packaging, samples, pricing, timing and inspection.', styles }: { items?: FaqItem[]; title?: string; description?: string; styles?: SiteSnapshot['pages'][number]['modules'][number]['styles'] }) {
  const items = suppliedItems ?? await getFaqItems()

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-paper py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.55fr_1.45fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="faq-title"
            eyebrow="FAQ"
            title={title}
            description={description}
            titleStyle={siteTypographyStyle(styles,'title',{'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'})}
            descriptionStyle={siteTypographyStyle(styles,'description',{'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'})}
          />
          <Reveal delay={90}>
            <p className="mt-6 text-sm text-ink-soft">
              Something else?{' '}
              <Link href="/contact#rfq" className="font-semibold text-brand-red underline underline-offset-4">
                Send your question with the request form
              </Link>
              .
            </p>
          </Reveal>
        </div>
        <FaqList items={items} />
      </div>
    </section>
  )
}
