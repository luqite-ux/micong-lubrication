import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ProductTile } from '@/components/product-tile'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { text } from '@/lib/data/repository'
import type { ProductFamily } from '@/lib/data/types'

type FamilyCardProps = {
  family: ProductFamily
  index?: number
}

export function FamilyCard({ family, index = 0 }: FamilyCardProps) {
  const name = text(family.name)
  return (
    <Reveal
      as="li"
      delay={stagger(index)}
      className="group relative flex flex-col overflow-hidden rounded-md border border-paper-line bg-white transition-shadow hover:shadow-lg focus-within:shadow-lg"
    >
      <ProductTile icon={family.icon} category={family.category} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug text-ink">
          <Link
            href={`/products/${family.slug}`}
            className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-brand-yellow"
          >
            {name}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{text(family.summary)}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {family.grades ? (
            <ul className="flex flex-wrap gap-1.5" aria-label={`${name} listed grades`}>
              {family.grades.map((grade) => (
                <li key={grade} className="rounded-sm bg-paper-2 px-2 py-1 text-xs font-semibold text-ink">
                  {grade}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs font-medium text-ink-soft">Grades by inquiry</span>
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red">
            View family
            <ArrowUpRight
              className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Reveal>
  )
}
