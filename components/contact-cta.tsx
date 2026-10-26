import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { company } from '@/lib/site-config'

type ContactCtaProps = {
  title?: string
  description?: string
}

export function ContactCta({
  title = 'Tell us what you need to lubricate or cut.',
  description = 'Send the product family, equipment, grade, quantity and destination. We reply by email or phone with next steps.',
}: ContactCtaProps) {
  return (
    <section aria-labelledby="contact-cta-title" className="bg-brand-red text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-20">
        <Reveal>
          <h2 id="contact-cta-title" className="text-3xl font-bold leading-tight sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90">{description}</p>
          <Link
            href="/contact#rfq"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-charcoal px-7 text-base font-semibold text-white transition-colors hover:bg-black"
          >
            Request a quote
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <Reveal delay={90}>
          <ul className="grid gap-4 border-l-2 border-white/40 pl-6 text-base">
            <li className="flex items-start gap-3">
              <Phone className="mt-1 size-5 shrink-0" aria-hidden="true" />
              <a className="font-semibold underline-offset-4 hover:underline" href={company.phoneHref}>
                {company.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-1 size-5 shrink-0" aria-hidden="true" />
              <a className="break-all font-semibold underline-offset-4 hover:underline" href={company.emailHref}>
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-1 size-5 shrink-0" aria-hidden="true" />
              <span>{company.addressOneLine}</span>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
