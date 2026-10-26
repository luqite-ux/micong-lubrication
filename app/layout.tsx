import type { Metadata, Viewport } from 'next'
import { Archivo, IBM_Plex_Sans } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { siteUrl } from '@/lib/site-url'
import { cookies } from 'next/headers'
import { PREVIEW_COOKIE } from '@/lib/site-content/preview-cookie'
import './globals.css'

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['600', '700', '800'],
  display: 'swap',
})

const plex = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl('/')),
  title: {
    default: 'MICONG | Industrial lubricants and metalworking fluids, Shanghai',
    template: '%s | MICONG',
  },
  description:
    'MICONG (Shanghai Micong Lubrication Technology Co., Ltd.) lists industrial lubricants and metalworking fluids. Browse eleven product families and send a request for quotation.',
}

export const viewport: Viewport = {
  themeColor: '#14161a',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preview = (await cookies()).has(PREVIEW_COOKIE)
  return (
    <html lang="en" className={`${archivo.variable} ${plex.variable} bg-background`}>
      <body className="font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-brand-yellow focus:px-4 focus:py-2 focus:font-semibold focus:text-charcoal"
        >
          Skip to content
        </a>
        {preview ? <div role="status" className="flex items-center justify-center gap-4 bg-brand-yellow px-4 py-2 text-sm font-semibold text-charcoal">
          Preview draft · changes are not public
          <form method="post" action="/api/site-content/exit-preview"><button type="submit" className="underline underline-offset-2">Exit preview</button></form>
        </div> : null}
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
