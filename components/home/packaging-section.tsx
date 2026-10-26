import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { copyValue } from '@/lib/site-content/page'
import { managedTextRows } from '@/lib/site-content/collections'
import type { SiteSnapshot } from '@/lib/site-content/transport'

const toSpecify = [
  'Pack type you want to receive',
  'Quantity for the first order',
  'Destination country and port or city',
  'OEM or own-brand wishes, if any',
]

export function PackagingSection({copy,snapshot}:{copy?:Record<string,string>|null;snapshot?:SiteSnapshot|null}) {
  const items=managedTextRows(snapshot??null,'/','packaging_checklist')?.map(row=>row.body)??toSpecify
  return (
    <section id="packaging" aria-labelledby="packaging-title" className="bg-paper-2 py-20 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading
            id="packaging-title"
            eyebrow={copyValue(copy,'packaging_eyebrow','Packaging customization')}
            title={copyValue(copy,'packaging_title','Raise packaging and OEM needs in the first inquiry')}
            description={copyValue(copy,'packaging_description','Packaging customization and OEM cooperation can be discussed. What can be arranged is confirmed against your order, so say what you need up front.')}
          />
          <Reveal delay={90}>
            <h3 className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">{copyValue(copy,'packaging_list_title','What to tell us')}</h3>
            <ul className="mt-4 grid gap-3">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[3px] bg-charcoal text-brand-yellow"
                  >
                    <Check className="size-4" strokeWidth={2.4} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact?topic=packaging#rfq"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand-red px-6 text-base font-semibold text-white transition-colors hover:bg-brand-red-deep"
              >
                {copyValue(copy,'packaging_action','Ask about packaging')}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact?topic=oem#rfq"
                className="inline-flex h-12 items-center justify-center rounded-md border border-charcoal px-6 text-base font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
              >
                {copyValue(copy,'packaging_oem_action','Discuss OEM')}
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <figure>
            <div className="relative mx-auto aspect-[6/5] w-full max-w-xl">
              <div className="absolute bottom-0 left-0 w-[62%] overflow-hidden rounded-md shadow-xl">
                <Image
                  src="/images/packaging-drum-single.jpg"
                  alt="A single red and black steel drum standing on a warehouse floor, shown in full."
                  width={1932}
                  height={1932}
                  sizes="(min-width: 1024px) 28vw, 60vw"
                  className="aspect-square h-auto w-full object-cover"
                />
              </div>
              <div className="absolute right-0 top-0 w-[46%] overflow-hidden rounded-md shadow-xl">
                <Image
                  src="/images/packaging-drums-stacked.jpg"
                  alt="Stacked red and white steel drums in a storage area."
                  width={1932}
                  height={1932}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="aspect-[4/5] h-auto w-full object-cover"
                />
              </div>
            </div>
            <figcaption className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ink-soft">
              {copyValue(copy,'packaging_caption','Steel drums shown as generic packaging context. These are not MICONG-branded product photographs, and pack types, sizes and labelling are agreed per order.')}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  )
}
