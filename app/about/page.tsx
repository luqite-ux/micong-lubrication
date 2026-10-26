import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ContactCta } from '@/components/contact-cta'
import { FaqSection } from '@/components/home/faq-section'
import { Marker } from '@/components/marker'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { SectionHeading } from '@/components/section-heading'
import { getProductCategories, getProductFamilies, text } from '@/lib/data/repository'
import { company, illustrativeNote } from '@/lib/site-config'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { copyValue, pageCopy, pageHero, pageVersion } from '@/lib/site-content/page'
import { homeFaq, homeModule } from '@/lib/site-content/home'
import { managedImage, managedTextRows, managedTitledRows } from '@/lib/site-content/collections'

const fallbackMetadata: Metadata = pageMetadata({ path: '/about', title: 'About MICONG', description: 'Learn about Shanghai Micong Lubrication Technology Co., Ltd., its listed lubricant families and how to send a technical inquiry.' })
export async function generateMetadata(): Promise<Metadata> { const managed = await siteContentMetadata('/about','en'); return {...fallbackMetadata,...managed,openGraph:{...fallbackMetadata.openGraph,...(typeof managed.title==='string'?{title:managed.title}:{}),...(typeof managed.description==='string'?{description:managed.description}:{})}} }

const ways = [
  { icon: 'sample', title: 'Samples', body: 'Samples can be requested. Sample shipping is at the customer cost.' },
  { icon: 'document', title: 'Data sheets', body: 'Ask for the technical data sheet for the family and grade you are considering.' },
  { icon: 'packaging', title: 'Packaging', body: 'Packaging customization is discussed per inquiry.' },
  { icon: 'quote', title: 'OEM', body: 'OEM cooperation can be discussed. Details are agreed per project.' },
  { icon: 'shipping', title: 'Lead time', body: 'Lead time depends on order size and is discussed per inquiry.' },
  { icon: 'inspection', title: 'Inspection', body: 'Third-party inspection can be discussed on request.' },
]

const inquiryChecklist = [
  'Product family and listed grade, where available',
  'Equipment, material and operating conditions',
  'Quantity, preferred pack type and destination',
  'Any data sheet, sample or inspection request',
]

export default async function AboutPage() {
  const [categories, families, snapshot] = await Promise.all([getProductCategories(), getProductFamilies(), getSiteContent('en')])
  const hero = pageHero(snapshot, '/about')
  const copy=pageCopy(snapshot,'/about'), sharedCopy=pageCopy(snapshot,'/')
  const faq=homeFaq(homeModule(snapshot,'faq'))
  const visibleWays=managedTitledRows(snapshot,'/about','buyer_ways')??ways
  const visibleBoundaries=managedTextRows(snapshot,'/about','unpublished_facts')?.map(row=>row.body)??inquiryChecklist
  const boundaryImage=managedImage(snapshot,'/about','boundary_image','image')

  return (
    <div {...pageVersion(snapshot, '/about')}>
      <PageHero
        eyebrow={hero?.eyebrow || 'About MICONG'}
        title={hero?.title || 'Industrial lubricants and metalworking fluids, handled by inquiry.'}
        description={hero?.description || `${company.legalName} (${company.legalNameZh}) trades as ${company.brand} / ${company.brandZh}.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About' }]}
      />

      <section aria-labelledby="scope-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <SectionHeading
          id="scope-title"
          eyebrow={copyValue(copy,'scope_eyebrow','What MICONG lists')}
          title={copyValue(copy,'scope_title','Two product groups, eleven families.')}
          description={copyValue(copy,'scope_description','Different grades inside a family are variants of that family, not separate products.')}
        />
        <ul className="mt-10 grid gap-5 md:grid-cols-2">
          {categories.map((category, index) => {
            const members = families.filter((family) => family.category === category.id)
            return (
              <Reveal
                as="li"
                key={category.id}
                delay={stagger(index)}
                className="rounded-md border border-paper-line bg-white p-6"
              >
                <h3 className="text-xl font-bold text-ink">{text(category.name)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text(category.description)}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {members.map((family) => (
                    <li key={family.id}>
                      <Link
                        href={`/products/${family.slug}`}
                        className="inline-flex h-10 items-center rounded-md bg-paper-2 px-3 text-sm font-semibold text-ink transition-colors hover:bg-brand-yellow"
                      >
                        {text(family.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="ways-title" className="grid-lines bg-charcoal py-14 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="ways-title"
            tone="dark"
            eyebrow={copyValue(copy,'ways_eyebrow','Working with MICONG')}
            title={copyValue(copy,'ways_title','What a buyer can ask for.')}
            description={copyValue(copy,'ways_description','Each of these is raised in the inquiry. We confirm what applies to your order.')}
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleWays.map((way, index) => (
              <Reveal
                as="li"
                key={way.title}
                delay={stagger(index)}
                className="flex flex-col gap-4 rounded-md border border-charcoal-line bg-charcoal-2 p-6"
              >
                <Marker icon={way.icon} tone="ondark" />
                <h3 className="text-lg font-bold">{way.title}</h3>
                <p className="text-sm leading-relaxed text-white/70">{way.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="boundary-title" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <figure className="overflow-hidden rounded-md bg-charcoal">
              <Image
                src={boundaryImage?.url||"/images/banner-3.jpg"}
                alt={boundaryImage?.alt||"Illustrated industrial campus at dusk with a glass office building and a warehouse."}
                width={2560}
                height={1060}
                sizes="(min-width: 1024px) 560px, 100vw"
                className="aspect-[4/3] h-auto w-full object-cover object-[72%_50%]"
              />
              <figcaption className="px-5 py-4 text-sm leading-relaxed text-white/80">{illustrativeNote}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={90}>
            <h2 id="boundary-title" className="text-3xl font-bold leading-tight text-ink">
              {copyValue(copy,'boundary_title','Prepare a useful technical inquiry.')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              {copyValue(copy,'boundary_description','Share these details so MICONG can discuss a suitable product family, documents, packaging and next steps for your order:')}
            </p>
            <ul className="mt-5 grid gap-3">
              {visibleBoundaries.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base text-ink">
                  <span aria-hidden="true" className="mt-2 size-2 shrink-0 rotate-45 bg-brand-red" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/contact#rfq"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-red underline underline-offset-4"
            >
              {copyValue(copy,'boundary_action','Ask us what you need to know')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <FaqSection {...(faq||{})} styles={homeModule(snapshot,'faq')?.styles} />
      <ContactCta copy={sharedCopy} />
    </div>
  )
}
