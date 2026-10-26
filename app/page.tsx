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

export const revalidate = 60
export const metadata = pageMetadata({ path: '/', title: 'MICONG industrial lubricants and metalworking fluids', description: 'Browse eleven MICONG industrial lubricant and metalworking-fluid families, then send an inquiry with equipment, grade, quantity and destination.' })

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HeroCarousel />
      <FamilySelector />
      <Pathways />
      <ApplicationPicker />
      <PackagingSection />
      <CooperationPath />
      <CompanyIntro />
      <FaqSection />
      <ContactCta />
    </>
  )
}
