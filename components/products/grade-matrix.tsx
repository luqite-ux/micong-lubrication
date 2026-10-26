import Link from 'next/link'
import { Reveal } from '@/components/reveal'
import { Marker } from '@/components/marker'
import { text } from '@/lib/data/repository'
import type { ProductFamily } from '@/lib/data/types'

/**
 * Grade navigation. Only families whose grades are listed in the customer
 * source appear as rows; every other family is routed to inquiry.
 */
export function GradeMatrix({ families }: { families: ProductFamily[] }) {
  const graded = families.filter((family) => family.grades && family.grades.length > 0)
  const columns = Array.from(new Set(graded.flatMap((family) => family.grades ?? [])))
  const byInquiry = families.filter((family) => !family.grades)

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
      <Reveal className="overflow-x-auto rounded-md border border-paper-line bg-white">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <caption className="sr-only">Listed grades by product family. Each grade opens the family page with that grade selected.</caption>
          <thead>
            <tr className="bg-charcoal text-white">
              <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em]">
                Family
              </th>
              {columns.map((grade) => (
                <th key={grade} scope="col" className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-[0.14em]">
                  Grade {grade}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {graded.map((family) => (
              <tr key={family.id} className="border-t border-paper-line">
                <th scope="row" className="px-5 py-4 text-sm font-bold text-ink">
                  <span className="flex items-center gap-3">
                    <Marker icon={family.icon} size="sm" />
                    {text(family.name)}
                  </span>
                </th>
                {columns.map((grade) => (
                  <td key={grade} className="px-3 py-4 text-center">
                    {family.grades?.includes(grade) ? (
                      <Link
                        href={`/products/${family.slug}?grade=${grade}`}
                        aria-label={`${text(family.name)}, grade ${grade}`}
                        className="inline-flex h-10 min-w-14 items-center justify-center rounded-sm bg-paper-2 px-3 text-sm font-bold text-ink transition-colors hover:bg-brand-yellow focus-visible:bg-brand-yellow"
                      >
                        {grade}
                      </Link>
                    ) : (
                      <span aria-label="Not listed" className="text-ink-soft">
                        {'\u2013'}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>

      <Reveal delay={90} className="rounded-md border border-paper-line bg-paper-2 p-6">
        <h3 className="text-lg font-bold text-ink">Grades by inquiry</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          These families are listed by name. Specifications are not published here; ask for the grade and data sheet that fit your use.
        </p>
        <ul className="mt-4 grid gap-2">
          {byInquiry.map((family) => (
            <li key={family.id}>
              <Link
                href={`/products/${family.slug}`}
                className="text-sm font-semibold text-ink underline decoration-brand-red decoration-2 underline-offset-4 hover:text-brand-red"
              >
                {text(family.name)}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}
