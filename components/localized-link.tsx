'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

type Props = React.ComponentProps<typeof NextLink>

/** Keep internal navigation on the selected language route. */
export default function LocalizedLink({ href, ...props }: Props) {
  const pathname = usePathname() || '/'
  const segment = pathname.split('/')[1]
  const locale = /^[a-z]{2}(?:-[A-Za-z]{2,4})?$/.test(segment) && segment !== 'en' ? segment : 'en'
  const localized = typeof href === 'string' && locale !== 'en' && href.startsWith('/') &&
    !href.startsWith('//') && !/^\/(?:admin|api|_next)(?:\/|[?#]|$)/.test(href) &&
    href !== `/${locale}` && !href.startsWith(`/${locale}/`)
    ? `/${locale}${href === '/' ? '' : href}` : href
  return <NextLink href={localized} {...props} />
}
