import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Marker } from '@/components/marker'
import { Reveal } from '@/components/reveal'
import { stagger } from '@/lib/motion'
import { SectionHeading } from '@/components/section-heading'
import { getCooperationSteps, text } from '@/lib/data/repository'
import { cn } from '@/lib/utils'

export async function CooperationPath() {
  const steps = await getCooperationSteps()

  return (
    <section id="process" aria-labelledby="process-title" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="process-title"
          eyebrow="Samples and RFQ"
          title="From first request to agreed order"
          description="Five steps. Sample shipping is at the customer cost, and lead time depends on order size."
        />
        <ol className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-6">
          {steps.map((step, index) => (
            <Reveal
              key={step.id}
              as="li"
              delay={stagger(index, 80)}
              className={cn(
                'relative flex gap-5 lg:flex-col lg:gap-5',
                index < steps.length - 1 &&
                  'max-lg:before:absolute max-lg:before:bottom-[-2.5rem] max-lg:before:left-6 max-lg:before:top-14 max-lg:before:w-px max-lg:before:bg-paper-line lg:after:absolute lg:after:left-16 lg:after:right-[-0.75rem] lg:after:top-6 lg:after:h-px lg:after:bg-paper-line',
              )}
            >
              <div className="relative z-10 flex items-center gap-3 lg:flex-col lg:items-start">
                <Marker icon={step.icon} />
                <span aria-hidden="true" className="hidden text-xs font-bold tracking-[0.18em] text-brand-red lg:block">
                  STEP {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-brand-red lg:hidden">
                  STEP {String(index + 1).padStart(2, '0')}
                </p>
                <h3 className="text-lg font-bold text-ink">{text(step.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text(step.description)}</p>
              </div>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-14 flex flex-col gap-4 rounded-md bg-paper p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-base text-ink">
            The request form covers every step above: family, application, grade, quantity and destination.
          </p>
          <Link
            href="/contact#rfq"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-charcoal px-6 text-base font-semibold text-white transition-colors hover:bg-black"
          >
            Open the request form
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
