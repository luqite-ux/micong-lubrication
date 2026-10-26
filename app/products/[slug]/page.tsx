import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, FileText, Mail, PackageCheck, Phone } from 'lucide-react'
import { Marker } from '@/components/marker'
import { PageHero } from '@/components/page-hero'
import { ProductTile } from '@/components/product-tile'
import { Reveal } from '@/components/reveal'
import {
  getApplicationAreas,
  getProductCategories,
  getProductFamilies,
  getProductFamilyBySlug,
  text,
} from '@/lib/data/repository'
import { company } from '@/lib/site-config'
import { cn } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { breadcrumbSchema, organizationId } from '@/lib/schema'
import { siteUrl } from '@/lib/site-url'

type ProductPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ grade?: string }>
}

export const revalidate = 60
export const dynamicParams = true
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const families = await getProductFamilies()
  return families.map((family) => ({ slug: family.slug }))
}

export async function generateMetadata({ params }: Pick<ProductPageProps, 'params'>): Promise<Metadata> {
  const { slug } = await params
  const family = await getProductFamilyBySlug(slug)
  if (!family) return { title: 'Product not found' }
  return pageMetadata({ path: `/products/${slug}`, title: family.seoTitle ? text(family.seoTitle) : `${text(family.name)} | MICONG`, description: family.seoDescription ? text(family.seoDescription) : text(family.summary) })
}

const requestChecklist = [
  'Application or equipment',
  'Grade, if one is listed',
  'Quantity and pack type',
  'Destination',
]

export default async function ProductFamilyPage({ params, searchParams }: ProductPageProps) {
  const { slug } = await params
  const { grade } = await searchParams
  const family = await getProductFamilyBySlug(slug)
  if (!family) notFound()

  const [families, categories, applications] = await Promise.all([
    getProductFamilies(),
    getProductCategories(),
    getApplicationAreas(),
  ])

  const name = text(family.name)
  const category = categories.find((item) => item.id === family.category)
  const selectedGrade = family.grades?.includes(grade ?? '') ? grade : undefined
  const siblings = families.filter((item) => item.category === family.category && item.id !== family.id)
  const usedFor = applications.filter((area) => family.applicationIds.includes(area.id))
  const index = families.findIndex((item) => item.id === family.id)
  const previous = families[(index - 1 + families.length) % families.length]
  const next = families[(index + 1) % families.length]

  const quoteQuery = (topic?: string) => {
    const query = new URLSearchParams({ family: family.slug })
    if (selectedGrade) query.set('grade', selectedGrade)
    if (topic) query.set('topic', topic)
    return `/contact?${query.toString()}#rfq`
  }

  return (
    <>
      <JsonLd data={[
        breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Products', path: '/products' }, { name, path: `/products/${slug}` }]),
        { '@context': 'https://schema.org', '@type': 'Product', '@id': `${siteUrl(`/products/${slug}`)}#product`, name, description: text(family.description || family.summary), url: siteUrl(`/products/${slug}`), brand: { '@id': organizationId } },
      ]} />
      <PageHero
        eyebrow={category ? text(category.name) : 'Products'}
        title={name}
        description={text(family.summary)}
        crumbs={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: name },
        ]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-20">
        <div className="grid gap-14">
          <Reveal>
            <ProductTile icon={family.icon} category={family.category} size="feature" className="rounded-md" />
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">
              Neutral family illustration. No product photograph is published for this family, so nothing here shows a pack or label.
            </p>
          </Reveal>

          {family.description && text(family.description) !== text(family.summary) ? (
            <section aria-labelledby="product-description-title">
              <Reveal>
                <h2 id="product-description-title" className="text-2xl font-bold text-ink">Product information</h2>
                <p className="mt-5 max-w-[74ch] whitespace-pre-line text-base leading-relaxed text-ink-soft">
                  {text(family.description)}
                </p>
              </Reveal>
            </section>
          ) : null}

          {(family.minimumOrder || family.sourceNotes?.length) ? (
            <section aria-labelledby="source-details-title">
              <Reveal>
                <h2 id="source-details-title" className="text-2xl font-bold text-ink">Order and product details</h2>
                {family.minimumOrder ? <p className="mt-5 text-base leading-relaxed text-ink-soft"><strong className="text-ink">Listed minimum order:</strong> {family.minimumOrder}. Confirm pack size and order terms with MICONG.</p> : null}
                {family.sourceNotes?.map((note) => <p key={note} className="mt-3 max-w-[74ch] text-sm leading-relaxed text-ink-soft">{note}</p>)}
              </Reveal>
            </section>
          ) : null}

          <section aria-labelledby="grades-title">
            <Reveal>
              <h2 id="grades-title" className="text-2xl font-bold text-ink">
                Grades
              </h2>
            </Reveal>
            {family.grades ? (
              <Reveal delay={70} className="mt-5">
                <p className="max-w-xl text-sm leading-relaxed text-ink-soft">
                  {`${name} is listed in grades ${family.grades.join(', ')}. Choose a grade to carry it into your quote request.`}
                </p>
                <nav aria-label={`${name} grades`} className="mt-5">
                  <ul className="flex flex-wrap gap-2">
                    <li>
                      <Link
                        href={`/products/${family.slug}`}
                        aria-current={!selectedGrade ? 'true' : undefined}
                        className={cn(
                          'inline-flex h-12 items-center rounded-md border px-5 text-sm font-semibold transition-colors',
                          !selectedGrade
                            ? 'border-charcoal bg-charcoal text-white'
                            : 'border-paper-line bg-white text-ink hover:border-ink',
                        )}
                      >
                        All grades
                      </Link>
                    </li>
                    {family.grades.map((item) => (
                      <li key={item}>
                        <Link
                          href={`/products/${family.slug}?grade=${item}`}
                          aria-current={selectedGrade === item ? 'true' : undefined}
                          className={cn(
                            'inline-flex h-12 min-w-20 items-center justify-center rounded-md border px-5 text-sm font-bold transition-colors',
                            selectedGrade === item
                              ? 'border-brand-red bg-brand-red text-white'
                              : 'border-paper-line bg-white text-ink hover:border-ink',
                          )}
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div
                  aria-live="polite"
                  className="mt-5 rounded-md border-l-4 border-brand-yellow bg-white p-5 text-sm leading-relaxed text-ink"
                >
                  {selectedGrade ? (
                    <p>
                      <strong>Grade {selectedGrade} selected.</strong> Ask for the technical data sheet to receive the values for this grade.
                    </p>
                  ) : (
                    <p>Select a grade, or request the technical data sheet to compare all listed grades.</p>
                  )}
                </div>
              </Reveal>
            ) : (
              <Reveal delay={70} className="mt-5 rounded-md border border-dashed border-input bg-white p-6">
                <p className="text-base font-semibold text-ink">Listed by name</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                  {`${name} is part of the MICONG range. Grades and specifications are not published here; tell us your use in the quote request and we will confirm what can be offered.`}
                </p>
              </Reveal>
            )}
          </section>

          {usedFor.length > 0 ? (
            <section aria-labelledby="used-for-title">
              <Reveal>
                <h2 id="used-for-title" className="text-2xl font-bold text-ink">
                  Where it is used
                </h2>
              </Reveal>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {usedFor.map((area, i) => (
                  <Reveal
                    as="li"
                    key={area.id}
                    delay={i * 70}
                    className="flex gap-4 rounded-md border border-paper-line bg-white p-5"
                  >
                    <Marker icon={area.icon} />
                    <div>
                      <h3 className="text-base font-bold text-ink">
                        <Link href={`/applications#${area.id}`} className="underline-offset-4 hover:underline">
                          {text(area.name)}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{text(area.summary)}</p>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="checklist-title">
            <Reveal className="rounded-md bg-charcoal p-6 text-white sm:p-8">
              <h2 id="checklist-title" className="text-xl font-bold">
                What to include in your request
              </h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {requestChecklist.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span aria-hidden="true" className="size-2 shrink-0 rotate-45 bg-brand-yellow" />
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </section>
        </div>

        <aside aria-labelledby="quote-panel-title" className="lg:sticky lg:top-28 lg:self-start">
          <Reveal className="rounded-md border border-paper-line bg-white p-6 shadow-sm">
            <h2 id="quote-panel-title" className="text-xl font-bold text-ink">
              Request a quote
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {selectedGrade ? `${name}, grade ${selectedGrade}.` : `${name}.`} The form opens with this selection filled in.
            </p>
            <Link
              href={quoteQuery()}
              className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-brand-red px-5 text-base font-semibold text-white transition-colors hover:bg-brand-red-deep"
            >
              Request a quote
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <ul className="mt-3 grid gap-2">
              <li>
                <Link
                  href={quoteQuery('datasheet')}
                  className="flex h-11 items-center gap-3 rounded-md border border-paper-line px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
                >
                  <FileText className="size-4 text-brand-red" aria-hidden="true" />
                  Request the data sheet
                </Link>
              </li>
              <li>
                <Link
                  href={quoteQuery('sample')}
                  className="flex h-11 items-center gap-3 rounded-md border border-paper-line px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
                >
                  <PackageCheck className="size-4 text-brand-red" aria-hidden="true" />
                  Request a sample
                </Link>
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-ink-soft">Sample shipping is at the customer cost.</p>
            <div className="mt-6 grid gap-3 border-t border-paper-line pt-5 text-sm">
              <a className="flex items-center gap-3 font-semibold text-ink hover:text-brand-red" href={company.phoneHref}>
                <Phone className="size-4" aria-hidden="true" />
                {company.phone}
              </a>
              <a className="flex items-center gap-3 break-all font-semibold text-ink hover:text-brand-red" href={company.emailHref}>
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {company.email}
              </a>
            </div>
          </Reveal>
        </aside>
      </div>

      {siblings.length > 0 ? (
        <section aria-labelledby="siblings-title" className="border-t border-paper-line bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <h2 id="siblings-title" className="text-xl font-bold text-ink">
              {`More ${category ? text(category.name).toLowerCase() : 'families'}`}
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {siblings.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/products/${item.slug}`}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-paper-line bg-paper px-4 text-sm font-semibold text-ink transition-colors hover:border-ink"
                  >
                    {text(item.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <nav aria-label="Adjacent product families" className="bg-charcoal text-white">
        <div className="mx-auto grid max-w-7xl sm:grid-cols-2">
          <Link
            href={`/products/${previous.slug}`}
            className="group flex items-center gap-4 border-b border-charcoal-line px-4 py-8 transition-colors hover:bg-charcoal-2 sm:border-b-0 sm:border-r sm:px-6"
          >
            <ArrowLeft className="size-5 shrink-0 text-brand-yellow transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span>
              <span className="block text-xs uppercase tracking-[0.14em] text-white/60">Previous family</span>
              <span className="mt-1 block text-lg font-bold">{text(previous.name)}</span>
            </span>
          </Link>
          <Link
            href={`/products/${next.slug}`}
            className="group flex items-center justify-between gap-4 px-4 py-8 text-right transition-colors hover:bg-charcoal-2 sm:px-6"
          >
            <span className="sm:ml-auto">
              <span className="block text-xs uppercase tracking-[0.14em] text-white/60">Next family</span>
              <span className="mt-1 block text-lg font-bold">{text(next.name)}</span>
            </span>
            <ArrowRight className="size-5 shrink-0 text-brand-yellow transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </nav>
    </>
  )
}
