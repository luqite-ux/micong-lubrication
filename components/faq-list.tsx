import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'
import { text } from '@/lib/data/repository'
import type { FaqItem } from '@/lib/data/types'

export function FaqList({ items }: { items: FaqItem[] }) {
  const sections = [
    { title: 'Products and cooperation', ids: ['faq-5', 'faq-6', 'faq-7', 'faq-8', 'faq-9'] },
    { title: 'Pricing and samples', ids: ['faq-13', 'faq-14', 'faq-15', 'faq-16', 'faq-17', 'faq-18', 'faq-19', 'faq-20'] },
    { title: 'Timing and delivery', ids: ['faq-21', 'faq-22', 'faq-23', 'faq-24', 'faq-25'] },
    { title: 'Inspection and reports', ids: ['faq-26', 'faq-27', 'faq-28'] },
  ]
  const assigned = new Set(sections.flatMap(section => section.ids))
  const groups = [
    ...sections.map(section => ({ title: section.title, items: section.ids.flatMap(id => items.filter(item => item.id === id)) })),
    { title: 'More questions', items: items.filter(item => !assigned.has(item.id)) },
  ].filter(group => group.items.length)

  const columns = [
    groups.filter(group => ['Products and cooperation', 'Timing and delivery'].includes(group.title)),
    groups.filter(group => !['Products and cooperation', 'Timing and delivery'].includes(group.title)),
  ]

  return (
    <Reveal delay={80} className="grid items-start gap-x-8 gap-y-10 md:grid-cols-2">
      {columns.map((column, index) => (
        <div key={index} className="grid content-start gap-10">
          {column.map(group => <div key={group.title}>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.12em] text-brand-red">{group.title}</h3>
            <Accordion type="single" collapsible className="border-t border-paper-line">
              {group.items.map((item) => (
                <AccordionItem key={item.id} value={item.id} className="border-paper-line">
                  <AccordionTrigger className="py-4 text-left text-sm font-semibold leading-snug text-ink hover:no-underline">
                    {text(item.question)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-ink-soft">
                    {text(item.answer)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>)}
        </div>
      ))}
    </Reveal>
  )
}
