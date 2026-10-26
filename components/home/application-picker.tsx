import Link from '@/components/localized-link'
import { ArrowRight } from 'lucide-react'
import { Marker } from '@/components/marker'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { SectionHeading } from '@/components/section-heading'
import { getApplicationAreas, getProductFamilies, text } from '@/lib/data/repository'
import { copyValue } from '@/lib/site-content/page'
import { managedApplicationAreas } from '@/lib/site-content/collections'
import type { SiteSnapshot } from '@/lib/site-content/transport'

export async function ApplicationPicker({copy,snapshot}:{copy?:Record<string,string>|null;snapshot?:SiteSnapshot|null}) {
  const [fallbackAreas, families] = await Promise.all([getApplicationAreas(), getProductFamilies()])
  const areas=managedApplicationAreas(snapshot||null,families)??fallbackAreas
  const nameBySlug = new Map(families.map((family) => [family.slug, text(family.name)]))

  return (
    <section id="applications" aria-labelledby="applications-title" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="applications-title"
          eyebrow={copyValue(copy,'applications_eyebrow','Applications')}
          title={copyValue(copy,'applications_title','Start from the equipment')}
          description={copyValue(copy,'applications_description','Not sure which family you need? Pick the application and follow the link to the matching product family.')}
          action={
            <Link
              href="/applications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
            >
              {copyValue(copy,'applications_action','All applications')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area, index) => (
            <Reveal key={area.id} as="li" delay={stagger(index)} className="flex flex-col gap-4 bg-white p-6">
              <Marker icon={area.icon} />
              <h3 className="text-lg font-bold text-ink">{text(area.name)}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{text(area.summary)}</p>
              <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                {area.familySlugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/products/${slug}`}
                      className="inline-flex min-h-8 items-center rounded-sm bg-paper-2 px-2.5 py-1 text-xs font-semibold text-ink transition-colors hover:bg-brand-yellow"
                    >
                      {nameBySlug.get(slug) ?? slug}
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
