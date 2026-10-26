import Link from 'next/link'
import { Mail, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { DesktopNav, MobileNav } from '@/components/header-nav'
import { getProductFamilies, text } from '@/lib/data/repository'
import { company } from '@/lib/site-config'
import { getSiteContent } from '@/lib/site-content/site-content'
import { homeModule, siteNavigation } from '@/lib/site-content/home'

export async function SiteHeader() {
  const [families, snapshot] = await Promise.all([getProductFamilies(), getSiteContent('en')])
  const navigation = siteNavigation(homeModule(snapshot, 'navigation')) ?? undefined
  if (snapshot && !navigation) throw new Error('Published navigation content is incomplete')
  const navFamilies = families.map((family) => ({
    slug: family.slug,
    name: text(family.name),
    icon: family.icon,
    category: family.category,
  }))

  return (
    <>
      <div className="bg-charcoal text-white/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[13px] sm:px-6">
          <p className="hidden sm:block">Industrial lubricants and metalworking fluids, Shanghai</p>
          <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
            <a href={company.phoneHref} className="inline-flex items-center gap-2 hover:text-brand-yellow">
              <Phone className="size-3.5" aria-hidden="true" />
              {company.phone}
            </a>
            <a href={company.emailHref} className="hidden items-center gap-2 hover:text-brand-yellow md:inline-flex">
              <Mail className="size-3.5" aria-hidden="true" />
              {company.email}
            </a>
          </div>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-paper-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
          <BrandLogo />
          <DesktopNav families={navFamilies} navigation={navigation} />
          <div className="flex items-center gap-3">
            <Link
              href="/contact#rfq"
              className="hidden h-11 items-center rounded-md bg-brand-red px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-red-deep sm:inline-flex"
            >
              Request a quote
            </Link>
            <MobileNav families={navFamilies} navigation={navigation} />
          </div>
        </div>
      </header>
    </>
  )
}
