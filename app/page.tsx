import { ApplicationPicker } from '@/components/home/application-picker'
import { CompanyIntro } from '@/components/home/company-intro'
import { CooperationPath } from '@/components/home/cooperation-path'
import { FamilySelector } from '@/components/home/family-selector'
import { FaqSection } from '@/components/home/faq-section'
import { PackagingSection } from '@/components/home/packaging-section'
import { Pathways } from '@/components/home/pathways'
import { ContactCta } from '@/components/contact-cta'
import { HeroCarousel } from '@/components/hero-carousel'
import { pageMetadata } from '@/lib/seo'
import { JsonLd } from '@/components/json-ld'
import { organizationSchema, websiteSchema } from '@/lib/schema'
import { getSiteContent, siteContentMetadata } from '@/lib/site-content/site-content'
import { homeFaq, homeHeroSlides, homeModule } from '@/lib/site-content/home'
import { pageCopy } from '@/lib/site-content/page'
import type { Metadata } from 'next'
import { requestLocale } from '@/lib/i18n'

export const revalidate = 60
const fallbackMetadata = pageMetadata({ path: '/', title: 'MICONG industrial lubricants and metalworking fluids', description: 'Browse five MICONG product lines documented in customer materials, then ask about grades, data sheets and availability.' })
export async function generateMetadata(): Promise<Metadata> {
  const managed = await siteContentMetadata('/', await requestLocale())
  const title = managed.title || fallbackMetadata.title
  const description = managed.description || fallbackMetadata.description
  return {
    ...fallbackMetadata, ...managed, title, description,
    openGraph: { ...fallbackMetadata.openGraph, title: typeof title === 'string' ? title : undefined, description: typeof description === 'string' ? description : undefined },
    twitter: { ...fallbackMetadata.twitter, title: typeof title === 'string' ? title : undefined, description: typeof description === 'string' ? description : undefined },
  }
}

export default async function HomePage() {
  const locale = await requestLocale()
  const snapshot = await getSiteContent(locale)
  const slides = homeHeroSlides(homeModule(snapshot, 'hero'))
  const faq = homeFaq(homeModule(snapshot, 'faq'))
  const copy=pageCopy(snapshot,'/')
  if (snapshot && (!slides || !faq)) throw new Error('Published homepage content is incomplete')
  return (
    // Blueprint IDs: hero=HeroCarousel; product-families=FamilySelector; product-pathways=Pathways;
    // applications=ApplicationPicker; packaging-options=PackagingSection; sample-cooperation=CooperationPath;
    // company-context=CompanyIntro; faq=FaqSection; contact=ContactCta.
    <div {...(snapshot && slides && faq ? { 'data-hq-content-version': snapshot.version } : {})}>
      <JsonLd data={[organizationSchema(), websiteSchema(locale)]} />
      <HeroCarousel slides={slides || undefined} styles={homeModule(snapshot,'hero')?.styles} />
      <FamilySelector copy={copy} />
      <Pathways copy={copy} />
      <ApplicationPicker copy={copy} snapshot={snapshot} />
      <PackagingSection copy={copy} snapshot={snapshot} />
      <CooperationPath copy={copy} snapshot={snapshot} />
      <CompanyIntro copy={copy} snapshot={snapshot} />
      <FaqSection {...(faq || {})} styles={homeModule(snapshot,'faq')?.styles} />
      <ContactCta copy={copy} />
    </div>
  )
}
