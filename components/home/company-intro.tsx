import Link from '@/components/localized-link'
import { ArrowRight } from 'lucide-react'
import { Marker } from '@/components/marker'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { SectionHeading } from '@/components/section-heading'
import { company } from '@/lib/site-config'
import { copyValue } from '@/lib/site-content/page'
import { managedTitledRows } from '@/lib/site-content/collections'
import type { SiteSnapshot } from '@/lib/site-content/transport'

const services = [
  { icon: 'sample', title: 'Samples on request', body: 'Sample shipping is at the customer cost.' },
  { icon: 'document', title: 'Technical data sheets', body: 'Request the sheet for the family and grade you are considering.' },
  { icon: 'packaging', title: 'Packaging and OEM', body: 'Pack types and OEM cooperation are discussed per inquiry.' },
  { icon: 'inspection', title: 'Third-party inspection', body: 'Can be discussed on request.' },
]

export function CompanyIntro({copy,snapshot}:{copy?:Record<string,string>|null;snapshot?:SiteSnapshot|null}) {
  const visibleServices=managedTitledRows(snapshot??null,'/','buyer_services')??services
  return (
    <section id="company" aria-labelledby="company-title" className="grid-lines bg-charcoal py-20 text-white md:py-24">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHeading
            id="company-title"
            tone="dark"
            eyebrow={copyValue(copy,'company_eyebrow','About MICONG')}
            title={copyValue(copy,'company_title','Who you are writing to')}
            description={copyValue(copy,'company_description',`${company.legalName} (${company.legalNameZh}) trades as ${company.brand} / ${company.brandZh}. The company lists industrial lubricants and metalworking fluids and takes buyer inquiries by form, email and phone.`)}
          />
          <Reveal delay={90}>
            <dl className="mt-8 grid gap-4 border-l-2 border-brand-red pl-6 text-sm">
              <div>
                <dt className="text-white/60">Address</dt>
                <dd className="mt-0.5 text-base">{company.addressOneLine}</dd>
              </div>
              <div>
                <dt className="text-white/60">Product scope</dt>
                <dd className="mt-0.5 text-base">{copyValue(copy,'company_scope','11 families in industrial lubricants and metalworking fluids')}</dd>
              </div>
            </dl>
            <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/70">
              {copyValue(copy,'company_boundary','Tell us what product details or documents you need for your evaluation. Banner scenes on this site are illustrative imagery.')}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow underline-offset-4 hover:underline"
            >
              {copyValue(copy,'company_action','More about MICONG')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>

        <div>
          <Reveal>
            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">{copyValue(copy,'company_services_title','How we work with buyers')}</h3>
          </Reveal>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {visibleServices.map((service, index) => (
              <Reveal
                key={service.title}
                as="li"
                delay={stagger(index)}
                className="flex flex-col gap-4 rounded-md border border-charcoal-line bg-charcoal-2 p-6"
              >
                <Marker icon={service.icon} tone="ondark" />
                <h4 className="text-lg font-bold">{service.title}</h4>
                <p className="text-sm leading-relaxed text-white/70">{service.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
