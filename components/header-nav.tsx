'use client'

import { useEffect, useRef, useState } from 'react'
import Link from '@/components/localized-link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Marker } from '@/components/marker'
import { cn } from '@/lib/utils'
import { company, mainNav } from '@/lib/site-config'
import { siteTypographyStyle } from '@/lib/site-content/typography'
import type { SiteSnapshot } from '@/lib/site-content/transport'

export type NavFamily = { slug: string; name: string; icon: string; category: string }
type NavStyles = SiteSnapshot['pages'][number]['modules'][number]['styles']
const fontMap = {'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'}

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DesktopNav({ families, navigation = mainNav, styles }: { families: NavFamily[]; navigation?: ReadonlyArray<{href:string;label:string}>; styles?: NavStyles }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const keepOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
    setOpen(true)
  }
  const closeAfterPointerLeaves = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), 220)
  }

  useEffect(() => {
    setOpen(false)
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  }, [pathname])

  const industrial = families.filter((f) => f.category === 'industrial-lubricants')
  const metalworking = families.filter((f) => f.category === 'metalworking-fluids')

  return (
    <nav aria-label="Primary" className="hidden self-stretch lg:block">
      <ul className="flex h-full items-center gap-1">
        {navigation.map((item, index) => {
          const active = isActive(pathname, item.href)
          const linkClass = cn(
            'hq-typography relative inline-flex h-11 items-center px-3 text-[15px] font-medium text-ink transition-colors hover:text-brand-red',
            active &&
              'text-brand-red after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:bg-brand-red',
          )
          if (item.href !== '/products') {
            return (
              <li key={item.href}>
                <Link href={item.href} aria-current={active ? 'page' : undefined} className={linkClass} style={siteTypographyStyle(styles,`items.nav-${index}.label`,fontMap)}>
                  {item.label}
                </Link>
              </li>
            )
          }
          return (
            <li
              key={item.href}
              onMouseEnter={keepOpen}
              onMouseLeave={closeAfterPointerLeaves}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && open) {
                  setOpen(false)
                  toggleRef.current?.focus()
                }
              }}
              className="flex h-full items-center"
            >
              <Link href={item.href} aria-current={active ? 'page' : undefined} className={cn(linkClass, 'pr-1')} style={siteTypographyStyle(styles,`items.nav-${index}.label`,fontMap)}>
                {item.label}
              </Link>
              <button
                ref={toggleRef}
                type="button"
                aria-expanded={open}
                aria-controls="products-menu"
                aria-label="Show product families"
                onClick={keepOpen}
                className="inline-flex size-8 items-center justify-center text-ink hover:text-brand-red"
              >
                <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
              </button>
              <div
                id="products-menu"
                hidden={!open}
                onMouseEnter={keepOpen}
                onMouseLeave={closeAfterPointerLeaves}
                className="absolute inset-x-0 top-full border-b border-paper-line bg-white shadow-xl"
              >
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_1.4fr_1fr] gap-10 px-6 py-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-red">Products</p>
                    <p className="mt-3 text-xl font-bold text-ink">Five documented product lines</p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                      Pick a family, then ask for a grade, data sheet or sample in one request.
                    </p>
                    <Link
                      href="/products"
                      className="mt-5 inline-flex items-center text-sm font-semibold text-brand-red underline-offset-4 hover:underline"
                    >
                      View all products
                    </Link>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      Hydraulic & slideway oils
                    </p>
                    <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {industrial.map((family) => (
                        <li key={family.slug}>
                          <Link
                            href={`/products/${family.slug}`}
                            className="flex items-center gap-3 rounded-md p-2 text-sm font-medium text-ink hover:bg-paper"
                          >
                            {family.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                      Metalworking fluids
                    </p>
                    <ul className="grid gap-1">
                      {metalworking.map((family) => (
                        <li key={family.slug}>
                          <Link
                            href={`/products/${family.slug}`}
                            className="flex items-center gap-3 rounded-md p-2 text-sm font-medium text-ink hover:bg-paper"
                          >
                            {family.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export function MobileNav({ families, navigation = mainNav, styles }: { families: NavFamily[]; navigation?: ReadonlyArray<{href:string;label:string}>; styles?: NavStyles }) {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="size-11 lg:hidden" aria-label="Open menu">
          <Menu className="size-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] max-w-sm overflow-y-auto bg-white p-0">
        <SheetHeader className="border-b border-paper-line p-5">
          <SheetTitle className="font-display text-lg">Menu</SheetTitle>
          <SheetDescription className="sr-only">Site navigation and product families</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-5 py-4">
          <ul className="grid">
            {navigation.map((item, index) => {
              const active = isActive(pathname, item.href)
              return (
                <li key={item.href} className="border-b border-paper-line last:border-0">
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      style={siteTypographyStyle(styles,`items.nav-${index}.label`,fontMap)}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'hq-typography flex min-h-12 items-center text-lg font-semibold text-ink',
                        active && 'text-brand-red',
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="border-t border-paper-line bg-paper px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-soft">Product families</p>
          <ul className="mt-3 grid grid-cols-1 gap-1">
            {families.map((family) => (
              <li key={family.slug}>
                <SheetClose asChild>
                  <Link
                    href={`/products/${family.slug}`}
                    className="flex min-h-11 items-center gap-3 text-[15px] font-medium text-ink"
                  >
                    <Marker icon={family.icon} size="sm" />
                    {family.name}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 border-t border-paper-line p-5">
          <SheetClose asChild>
            <Button asChild size="lg" className="bg-brand-red text-white hover:bg-brand-red-deep">
              <Link href="/contact#rfq">Request a quote</Link>
            </Button>
          </SheetClose>
          <a href={company.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-ink">
            <Phone className="size-4" aria-hidden="true" />
            {company.phone}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  )
}
