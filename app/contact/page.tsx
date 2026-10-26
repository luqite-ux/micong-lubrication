import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Reveal } from '@/components/reveal'
import { RfqForm, type RfqFamilyOption } from '@/components/rfq-form'
import { getProductFamilies, text } from '@/lib/data/repository'
import { company } from '@/lib/site-config'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { copyValue, pageCopy, pageHero, pageVersion } from '@/lib/site-content/page'
import { managedTextRows } from '@/lib/site-content/collections'
import { requestLocale } from '@/lib/i18n'

const fallbackMetadata: Metadata = pageMetadata({ path: '/contact', title: 'Contact MICONG', description: 'Send MICONG your product family, equipment, grade, quantity and destination, or contact the team by phone and email.' })
export async function generateMetadata(): Promise<Metadata> { const managed = await siteContentMetadata('/contact',await requestLocale()); return {...fallbackMetadata,...managed,openGraph:{...fallbackMetadata.openGraph,...(typeof managed.title==='string'?{title:managed.title}:{}),...(typeof managed.description==='string'?{description:managed.description}:{})}} }

type ContactPageProps = {
  searchParams: Promise<{ family?: string; grade?: string; topic?: string }>
}

const nextSteps = [
  'We read the family, application and destination you send.',
  'We reply by email or phone to confirm grade, pack type and what can be offered.',
  'Samples and data sheets are arranged on request. Sample shipping is at the customer cost.',
]

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { family, grade, topic } = await searchParams
  const [families,snapshot] = await Promise.all([getProductFamilies(),getSiteContent(await requestLocale())])
  const hero = pageHero(snapshot, '/contact')
  const copy=pageCopy(snapshot,'/contact')
  const visibleSteps=managedTextRows(snapshot,'/contact','next_steps')?.map(row=>row.body)??nextSteps
  const options: RfqFamilyOption[] = families.map((item) => ({
    slug: item.slug,
    name: text(item.name),
    category: item.category,
    grades: item.grades,
  }))

  return (
    <div {...pageVersion(snapshot, '/contact')}>
      <PageHero
        eyebrow={hero?.eyebrow || 'Contact'}
        title={hero?.title || 'Send your requirement. We reply with next steps.'}
        description={hero?.description || 'Use the form for a quote, a sample or a technical data sheet, or contact MICONG directly.'}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
      />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:py-20">
        <aside aria-label="Contact details" className="grid content-start gap-8 lg:sticky lg:top-28 lg:self-start">
          <Reveal className="rounded-md bg-charcoal p-6 text-white">
            <h2 className="text-lg font-bold">{company.legalName}</h2>
            <p className="mt-1 text-sm text-white/60">{`${company.brand} / ${company.brandZh}`}</p>
            <ul className="mt-6 grid gap-5 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-brand-yellow" aria-hidden="true" />
                <div>
                  <p className="text-white/60">Phone</p>
                  <a className="text-base font-semibold underline-offset-4 hover:underline" href={company.phoneHref}>
                    {company.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand-yellow" aria-hidden="true" />
                <div>
                  <p className="text-white/60">Email</p>
                  <a className="break-all text-base font-semibold underline-offset-4 hover:underline" href={company.emailHref}>
                    {company.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand-yellow" aria-hidden="true" />
                <div>
                  <p className="text-white/60">Address</p>
                  <address className="text-base not-italic leading-relaxed">
                    {company.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <Clock className="size-5 text-brand-red" aria-hidden="true" />
              {copyValue(copy,'steps_title','What happens next')}
            </h2>
            <ol className="mt-4 grid gap-4">
              {visibleSteps.map((step, index) => (
                <li key={step} className="flex gap-4 text-sm leading-relaxed text-ink-soft">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-[3px] bg-brand-yellow text-sm font-bold text-ink">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </Reveal>
        </aside>

        <section id="rfq" aria-labelledby="rfq-title" className="scroll-mt-28">
          <Reveal className="rounded-md border border-paper-line bg-white p-5 shadow-sm sm:p-8">
            <h2 id="rfq-title" className="text-2xl font-bold text-ink">
              {copyValue(copy,'form_title','Request a quote')}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {copyValue(copy,'form_description','Fields marked with an asterisk are required. Prices, grades and lead time are confirmed by MICONG after reviewing your request.')}
            </p>
            <div className="mt-8">
              <RfqForm families={options} defaultFamily={family} defaultGrade={grade} defaultTopic={topic} />
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  )
}
