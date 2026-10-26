import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FamilyCard } from '@/components/family-card'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { getProductCategories, getProductFamilies, text } from '@/lib/data/repository'

export async function FamilySelector() {
  const [categories, families] = await Promise.all([getProductCategories(), getProductFamilies()])

  return (
    <section id="families" aria-labelledby="families-title" className="bg-paper py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="families-title"
          eyebrow="Product families"
          title="Choose a product family"
          description="Eleven families in two groups. Anti-wear hydraulic oil and slideway oil list grades 32, 46 and 68. Every other family is handled by inquiry."
          action={
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
            >
              Full product listing
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />

        {categories.map((category) => {
          const items = families.filter((family) => family.category === category.id)
          return (
            <div key={category.id} className="mt-14">
              <Reveal className="mb-6 flex flex-col gap-1 border-b border-paper-line pb-4 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-xl font-bold text-ink">
                  {text(category.name)}
                  <span className="ml-3 text-sm font-medium text-ink-soft">{items.length} families</span>
                </h3>
                <p className="max-w-xl text-sm text-ink-soft">{text(category.description)}</p>
              </Reveal>
              <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
