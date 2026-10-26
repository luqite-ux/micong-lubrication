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
import type { Metadata } from 'next'

export const revalidate = 60
const fallbackMetadata = pageMetadata({ path: '/', title: 'MICONG industrial lubricants and metalworking fluids', description: 'Browse eleven MICONG industrial lubricant and metalworking-fluid families, then send an inquiry with equipment, grade, quantity and destination.' })
export async function generateMetadata(): Promise<Metadata> {
  const managed = await siteContentMetadata('/', 'en')
  const title = managed.title || fallbackMetadata.title
  const description = managed.description || fallbackMetadata.description
  return {
    ...fallbackMetadata, ...managed, title, description,
    openGraph: { ...fallbackMetadata.openGraph, title: typeof title === 'string' ? title : undefined, description: typeof description === 'string' ? description : undefined },
    twitter: { ...fallbackMetadata.twitter, title: typeof title === 'string' ? title : undefined, description: typeof description === 'string' ? description : undefined },
  }
}

export default async function HomePage() {
  const snapshot = await getSiteContent('en')
  const slides = homeHeroSlides(homeModule(snapshot, 'hero'))
  const faq = homeFaq(homeModule(snapshot, 'faq'))
  if (snapshot && (!slides || !faq)) throw new Error('Published homepage content is incomplete')
  return (
    <div {...(snapshot && slides && faq ? { 'data-hq-content-version': snapshot.version } : {})}>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HeroCarousel slides={slides || undefined} styles={homeModule(snapshot,'hero')?.styles} />
      <FamilySelector />
      <Pathways />
      <ApplicationPicker />
      <PackagingSection />
      <CooperationPath />
      <CompanyIntro />
      <FaqSection {...(faq || {})} styles={homeModule(snapshot,'faq')?.styles} />
      <ContactCta />
    </div>
  )
}
