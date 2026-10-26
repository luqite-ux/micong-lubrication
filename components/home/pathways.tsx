import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Marker } from '@/components/marker'
import { Reveal } from '@/components/reveal'
import { SectionHeading } from '@/components/section-heading'
import { cn } from '@/lib/utils'
import { copyValue } from '@/lib/site-content/page'

const pathways = [
  {
    id: 'industrial',
    icon: 'hydraulic',
    accent: 'bg-brand-yellow',
    title: 'Industrial lubricants',
    lead: 'For machines, drives and systems that run on an oil or a grease.',
    steps: [
      {
        title: 'Pick the family',
        body: 'Hydraulic, slideway, engine, gear, vacuum pump, grease or industrial white oil.',
      },
      {
        title: 'Choose a grade where one is listed',
        body: 'Anti-wear hydraulic oil and slideway oil are listed in 32, 46 and 68.',
      },
      {
        title: 'Ask for a data sheet or sample',
        body: 'Name the equipment and quantity in the request.',
      },
    ],
    links: [
      { label: 'Browse industrial lubricants', href: '/products?category=industrial-lubricants#listing' },
      { label: 'Quote hydraulic oil', href: '/contact?family=anti-wear-hydraulic-oil#rfq' },
    ],
  },
  {
    id: 'metalworking',
    icon: 'cutting',
    accent: 'bg-brand-red',
    title: 'Metalworking fluids',
    lead: 'For machining and metal cutting, where the fluid type is the first decision.',
    steps: [
      {
        title: 'Choose the fluid type',
        body: 'Fully synthetic, semi-synthetic or micro-emulsion cutting fluid, or cutting oil.',
      },
      {
        title: 'Describe the machining',
        body: 'Machine, material and the fluid you use today help the discussion.',
      },
      {
        title: 'Request details',
        body: 'No specification is listed online for these families, so details are shared on request.',
      },
    ],
    links: [
      { label: 'Browse metalworking fluids', href: '/products?category=metalworking-fluids#listing' },
      { label: 'Ask about CNC fluids', href: '/contact?family=fully-synthetic-cutting-fluid#rfq' },
    ],
  },
]

export function Pathways({copy}:{copy?:Record<string,string>|null}) {
  return (
    <section id="pathways" aria-labelledby="pathways-title" className="grid-lines bg-charcoal py-20 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="pathways-title"
          tone="dark"
          eyebrow={copyValue(copy,'pathways_eyebrow','Two pathways')}
          title={copyValue(copy,'pathways_title','Lubricants or cutting fluids: start from what you run')}
          description={copyValue(copy,'pathways_description','The two groups are chosen differently. Use the route that matches your equipment.')}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {pathways.map((pathway, index) => (
            <Reveal
              key={pathway.id}
              delay={index * 90}
              className="relative flex flex-col rounded-md border border-charcoal-line bg-charcoal-2 p-6 sm:p-8"
            >
              <span aria-hidden="true" className={cn('absolute inset-x-0 top-0 h-1', pathway.accent)} />
              <div className="flex items-center gap-4">
                <Marker icon={pathway.icon} size="lg" tone="ondark" />
                <h3 className="text-2xl font-bold">{pathway.title}</h3>
              </div>
              <p className="mt-4 text-base text-white/75">{pathway.lead}</p>
              <ol className="mt-8 grid gap-6">
                {pathway.steps.map((step, stepIndex) => (
                  <li key={step.title} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border border-brand-yellow text-sm font-bold text-brand-yellow"
                    >
                      {stepIndex + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold">{step.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-white/70">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-col gap-3 border-t border-charcoal-line pt-6 sm:flex-row sm:flex-wrap">
                {pathway.links.map((link, linkIndex) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors',
                      linkIndex === 0
                        ? 'bg-brand-yellow text-charcoal hover:bg-yellow-300'
                        : 'border border-white/30 text-white hover:bg-white/10',
                    )}
                  >
                    {link.label}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
