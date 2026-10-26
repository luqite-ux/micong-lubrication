import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Reveal } from '@/components/reveal'
import { text } from '@/lib/data/repository'
import type { FaqItem } from '@/lib/data/types'

export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <Reveal delay={80}>
      <Accordion type="single" collapsible className="border-t border-paper-line">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-paper-line">
            <AccordionTrigger className="py-5 text-left text-base font-semibold text-ink hover:no-underline">
              {text(item.question)}
            </AccordionTrigger>
            <AccordionContent className="text-base leading-relaxed text-ink-soft">
              {text(item.answer)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Reveal>
  )
}
