import Link from '@/components/localized-link'
import { ArrowRight } from 'lucide-react'
import { FamilyCard } from '@/components/family-card'
import { PackagingGallery } from '@/components/products/packaging-gallery'
import { ApplicationImage } from '@/components/products/application-image'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { getProductCategories, getProductFamilies, text } from '@/lib/data/repository'
import { copyValue } from '@/lib/site-content/page'

export async function FamilySelector({copy}:{copy?:Record<string,string>|null}) {
  const [categories, families] = await Promise.all([getProductCategories(), getProductFamilies()])

  return (
    <section id="families" aria-labelledby="families-title" className="bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="families-title"
          eyebrow={copyValue(copy,'family_eyebrow','Product families')}
          title={copyValue(copy,'family_title','Choose a product family')}
          description={copyValue(copy,'family_description','Explore eleven product families across industrial lubricants and metalworking fluids. Five have detailed introductions; ask MICONG for technical details on the others.')}
          action={
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
            >
              {copyValue(copy,'family_action','Full product listing')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-soft sm:text-base">
          The containers have no visible product labels; please confirm the family, grade and pack with MICONG for your order.
        </p>

        <div className="mt-8"><PackagingGallery /></div>

        {categories.map((category) => {
          const items = families.filter((family) => family.category === category.id)
          return (
            <div key={category.id} className="mt-14">
              <Reveal className="mb-6 flex flex-col gap-5 border-b border-paper-line pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-ink">
                    {text(category.name)}
                    <span className="ml-3 text-sm font-medium text-ink-soft">{items.length} families</span>
                  </h3>
                  <p className="mt-2 max-w-xl text-sm text-ink-soft">{text(category.description)}</p>
                </div>
                <ApplicationImage
                  slug={category.id === 'industrial-lubricants' ? 'anti-wear-hydraulic-oil' : 'fully-synthetic-cutting-fluid'}
                  name={text(category.name)}
                  className="aspect-[4/3] w-32 shrink-0 rounded-sm sm:w-40"
                />
              </Reveal>
              <ul className="grid border-t border-paper-line bg-white sm:grid-cols-2 sm:[&>li:nth-child(odd)]:border-r sm:[&>li:nth-child(odd)]:border-paper-line">
                {items.map((family, index) => (
                  <FamilyCard key={family.id} family={family} index={index} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
