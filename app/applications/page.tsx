import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContactCta } from '@/components/contact-cta'
import { Marker } from '@/components/marker'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { getApplicationAreas, getProductFamilies, text } from '@/lib/data/repository'

export const metadata: Metadata = pageMetadata({ path: '/applications', title: 'MICONG applications', description: 'Start from the equipment or process: hydraulic systems, machine-tool slideways, CNC machining, gearboxes, vacuum pumps, engines and grease points.' })

export default async function ApplicationsPage() {
  const [areas, families] = await Promise.all([getApplicationAreas(), getProductFamilies()])

  return (
    <>
      <PageHero
        eyebrow="Applications"
        title="Start from what you need to lubricate or cut."
        description="Pick the equipment or process and see which MICONG families are listed for it. Then send the details and we confirm the right grade."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }]}
      />

      <nav aria-label="Application areas" className="border-b border-paper-line bg-white">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {areas.map((area) => (
            <li key={area.id} className="shrink-0">
              <a
                href={`#${area.id}`}
                className="inline-flex h-14 items-center border-b-[3px] border-transparent px-4 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-red hover:text-ink"
              >
                {text(area.name)}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-16">
        <ol className="grid">
          {areas.map((area, index) => {
            const matched = area.familySlugs
              .map((slug) => families.find((family) => family.slug === slug))
              .filter((family) => family !== undefined)
            const first = matched[0]
            return (
              <Reveal
                as="li"
                key={area.id}
                id={area.id}
                className="grid gap-6 border-t border-paper-line py-10 first:border-t-0 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-12"
              >
                <div className="flex gap-5">
                  <Marker icon={area.icon} size="lg" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">
                      {`Application ${String(index + 1).padStart(2, '0')}`}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-ink">{text(area.name)}</h2>
                    <p className="mt-3 max-w-md text-base leading-relaxed text-ink-soft">{text(area.summary)}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">Listed families</h3>
                  <ul className="mt-3 grid gap-2">
                    {matched.map((family) => (
                      <li key={family.id}>
                        <Link
                          href={`/products/${family.slug}`}
                          className="group flex items-center justify-between gap-4 rounded-md border border-paper-line bg-white px-4 py-3 transition-colors hover:border-ink"
                        >
                          <span>
                            <span className="block text-base font-bold text-ink">{text(family.name)}</span>
                            <span className="block text-xs text-ink-soft">
                              {family.grades ? `Grades ${family.grades.join(', ')}` : 'Grades by inquiry'}
                            </span>
                          </span>
                          <ArrowRight
                            className="size-4 shrink-0 text-brand-red transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {first ? (
                    <Link
                      href={`/contact?family=${first.slug}#rfq`}
                      className="mt-4 inline-flex text-sm font-semibold text-brand-red underline underline-offset-4 hover:text-brand-red-deep"
                    >
                      {`Send a request for ${text(area.name).toLowerCase()}`}
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            )
          })}
        </ol>
      </div>

      <ContactCta
        title="Your equipment is not listed here?"
        description="Describe the machine, the process and the fluid you use now. We will tell you which family we can discuss."
      />
    </>
  )
}
