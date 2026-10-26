'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LanguageSwitch({ locales }: { locales: string[] }) {
  const pathname = usePathname() || '/'
  if (locales.length < 2) return null
  const first = pathname.split('/')[1]
  const active = locales.includes(first) && first !== 'en' ? first : 'en'
  const path = active === 'en' ? pathname : pathname.slice(active.length + 1) || '/'
  return (
    <nav aria-label="Language" className="flex items-center gap-1 text-xs font-bold">
      {locales.map(locale => (
        <Link key={locale} href={locale === 'en' ? path : `/${locale}${path === '/' ? '' : path}`}
          hrefLang={locale} lang={locale} aria-current={locale === active ? 'page' : undefined}
          className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded px-1 uppercase ${locale === active ? 'bg-charcoal text-white' : 'text-ink hover:bg-paper'}`}>
          {locale}
        </Link>
      ))}
    </nav>
  )
}
