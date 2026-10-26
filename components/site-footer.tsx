import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/brand-logo'
import { getProductFamilies, text } from '@/lib/data/repository'
import { company, mainNav } from '@/lib/site-config'
import { getSiteContent } from '@/lib/site-content/site-content'
import { homeModule, siteNavigation } from '@/lib/site-content/home'

export async function SiteFooter() {
  const [families, snapshot] = await Promise.all([getProductFamilies(), getSiteContent('en')])
  const navigation = siteNavigation(homeModule(snapshot, 'navigation')) ?? mainNav
  if (snapshot && navigation === mainNav) throw new Error('Published footer navigation content is incomplete')

  return (
    <footer className="bg-charcoal text-white/80">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.7fr_1fr_1.1fr]">
        <div>
          <div className="inline-block rounded-md bg-white px-3 py-2">
            <BrandLogo imageClassName="h-12 sm:h-12" />
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            {company.legalName} lists industrial lubricants and metalworking fluids. Send a request for quotation
            with your application and destination.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-yellow">Navigate</h2>
          <ul className="mt-4 grid gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-9 items-center text-sm hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-yellow">Product families</h2>
          <ul className="mt-4 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {families.map((family) => (
              <li key={family.slug}>
                <Link
                  href={`/products/${family.slug}`}
                  className="inline-flex min-h-9 items-center text-sm hover:text-white"
                >
                  {text(family.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-yellow">Contact</h2>
          <ul className="mt-4 grid gap-4 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-brand-yellow" aria-hidden="true" />
              <a href={company.phoneHref} className="hover:text-white">
                {company.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-brand-yellow" aria-hidden="true" />
              <a href={company.emailHref} className="break-all hover:text-white">
                {company.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-yellow" aria-hidden="true" />
              <address className="not-italic leading-relaxed">
                {company.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </li>
          </ul>
          <Link
            href="/contact#rfq"
            className="mt-6 inline-flex h-11 items-center rounded-md bg-brand-yellow px-5 text-sm font-semibold text-charcoal hover:bg-white"
          >
            Request a quote
          </Link>
        </div>
      </div>
      <div className="border-t border-charcoal-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-white/60 sm:px-6 md:flex-row md:justify-between">
          <p>{`© ${new Date().getFullYear()} ${company.legalName.replace(/[.;:!?。；：！？\s]+$/u, '')}. All rights reserved.`}</p>
          <p>Factory, equipment and packaging scenes on this site are illustrative imagery.</p>
        </div>
      </div>
    </footer>
  )
}
