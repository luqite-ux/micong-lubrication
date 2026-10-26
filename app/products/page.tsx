import type { Metadata } from 'next'
import Link from '@/components/localized-link'
import { ContactCta } from '@/components/contact-cta'
import { FamilyCard } from '@/components/family-card'
import { PageHero } from '@/components/page-hero'
import { GradeMatrix } from '@/components/products/grade-matrix'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { getProductCategories, getProductFamilies, text } from '@/lib/data/repository'
import { cn } from '@/lib/utils'
import { pageMetadata } from '@/lib/seo'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { copyValue, pageCopy, pageHero, pageVersion } from '@/lib/site-content/page'
import { requestLocale } from '@/lib/i18n'

const fallbackMetadata: Metadata = pageMetadata({ path: '/products', title: 'MICONG products', description: 'Eleven MICONG product families across industrial lubricants and metalworking fluids, with grade navigation and a quote request for each.' })
export async function generateMetadata(): Promise<Metadata> { const managed = await siteContentMetadata('/products',await requestLocale()); return {...fallbackMetadata,...managed,openGraph:{...fallbackMetadata.openGraph,...(typeof managed.title==='string'?{title:managed.title}:{}),...(typeof managed.description==='string'?{description:managed.description}:{})}} }

type ProductsPageProps = {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = await searchParams
  const [categories, families, snapshot] = await Promise.all([getProductCategories(), getProductFamilies(), getSiteContent(await requestLocale())])
  const hero = pageHero(snapshot, '/products')
  const copy=pageCopy(snapshot,'/products'), sharedCopy=pageCopy(snapshot,'/')
  const active = categories.find((item) => item.id === category)
  const visible = active ? categories.filter((item) => item.id === active.id) : categories

  const tabs = [
    { href: '/products', label: 'All families', count: families.length, current: !active },
    ...categories.map((item) => ({
      href: `/products?category=${item.id}`,
      label: text(item.name),
      count: families.filter((family) => family.category === item.id).length,
      current: active?.id === item.id,
    })),
  ]

  return (
    <div {...pageVersion(snapshot, '/products')}>
      <PageHero
        eyebrow={hero?.eyebrow || 'Products'}
        title={hero?.title || 'Eleven product families, two ways to choose.'}
        description={hero?.description || 'MICONG lists industrial lubricants and metalworking fluids. Open a family to see its grades and send a quote request.'}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
      />

      <nav aria-label="Product categories" className="border-b border-paper-line bg-white">
        <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {tabs.map((tab) => (
            <li key={tab.href} className="shrink-0">
              <Link
                href={tab.href}
                aria-current={tab.current ? 'page' : undefined}
                className={cn(
                  'inline-flex h-14 items-center gap-2 border-b-[3px] px-4 text-sm font-semibold transition-colors',
                  tab.current
                    ? 'border-brand-red text-ink'
                    : 'border-transparent text-ink-soft hover:border-paper-line hover:text-ink',
                )}
              >
                {tab.label}
                <span className="rounded-sm bg-paper-2 px-1.5 py-0.5 text-xs text-ink">{tab.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {visible.map((group) => {
        const groupFamilies = families.filter((family) => family.category === group.id)
        return (
          <section
            key={group.id}
            aria-labelledby={`group-${group.id}`}
            className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20"
          >
            <SectionHeading
              id={`group-${group.id}`}
              eyebrow={`${groupFamilies.length} families`}
              title={text(group.name)}
              description={text(group.description)}
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {groupFamilies.map((family, index) => (
                <FamilyCard key={family.id} family={family} index={index} />
              ))}
            </ul>
          </section>
        )
      })}

      <section aria-labelledby="grade-nav-title" className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            id="grade-nav-title"
            eyebrow={copyValue(copy,'grades_eyebrow','Grade navigation')}
            title={copyValue(copy,'grades_title','Go straight to a listed grade.')}
            description={copyValue(copy,'grades_description','Anti-wear Hydraulic Oil and Slideway Oil are listed in grades 32, 46 and 68. Other families do not list grades.')}
          />
          <div className="mt-10">
            <GradeMatrix families={families} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <Reveal className="flex flex-col gap-4 rounded-md border border-paper-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-ink">{copyValue(copy,'guide_title','Not sure which family fits?')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {copyValue(copy,'guide_description','Start from the equipment or process instead. The application guide points each use to the families that match it.')}
            </p>
          </div>
          <Link
            href="/applications"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-charcoal px-6 text-sm font-semibold text-white transition-colors hover:bg-charcoal-3"
          >
            {copyValue(copy,'guide_action','Browse by application')}
          </Link>
        </Reveal>
      </section>

      <ContactCta copy={sharedCopy} />
    </div>
  )
}
