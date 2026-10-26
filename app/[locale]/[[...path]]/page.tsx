import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { activeSiteLocales, localePath } from '@/lib/i18n'
import { siteUrl } from '@/lib/site-url'
import Home, { generateMetadata as homeMetadata } from '@/app/page'
import About, { generateMetadata as aboutMetadata } from '@/app/about/page'
import Applications, { generateMetadata as applicationsMetadata } from '@/app/applications/page'
import Products, { generateMetadata as productsMetadata } from '@/app/products/page'
import Product, { generateMetadata as productMetadata } from '@/app/products/[slug]/page'
import News, { generateMetadata as newsMetadata } from '@/app/news/page'
import Article, { generateMetadata as articleMetadata } from '@/app/news/[slug]/page'
import Contact, { generateMetadata as contactMetadata } from '@/app/contact/page'

export const dynamicParams = true

type Props = {
  params: Promise<{ locale: string; path?: string[] }>
  searchParams: Promise<{ grade?: string; family?: string; topic?: string; category?: string }>
}

const pages = {
  '': { page: Home, metadata: homeMetadata },
  about: { page: About, metadata: aboutMetadata },
  applications: { page: Applications, metadata: applicationsMetadata },
  news: { page: News, metadata: newsMetadata },
}

async function route(props: Props) {
  const { locale, path = [] } = await props.params
  if (locale === 'en' || !(await activeSiteLocales()).includes(locale)) notFound()
  return path
}

export async function generateMetadata(props: Props) {
  const path = await route(props)
  const locale = (await props.params).locale
  const publicPath = `/${path.join('/')}`
  let metadata: Metadata
  if (path.length === 2 && path[0] === 'products')
    metadata = await productMetadata({ params: Promise.resolve({ slug: path[1] }) })
  else if (path.length === 2 && path[0] === 'news')
    metadata = await articleMetadata({ params: Promise.resolve({ slug: path[1] }) })
  else if (path.length === 1 && path[0] === 'products') metadata = await productsMetadata()
  else if (path.length === 1 && path[0] === 'contact') metadata = await contactMetadata()
  else {
    const entry = pages[path.join('/') as keyof typeof pages]
    if (!entry) notFound()
    metadata = await entry.metadata()
  }
  const locales = await activeSiteLocales()
  const languages = Object.fromEntries(locales.map(language => [language, siteUrl(localePath(publicPath, language))]))
  languages['x-default'] = siteUrl(publicPath)
  const url = siteUrl(localePath(publicPath, locale))
  return {
    ...metadata,
    alternates: { canonical: url, languages },
    openGraph: { ...metadata.openGraph, url },
  } satisfies Metadata
}

export default async function LocalePage(props: Props) {
  const path = await route(props)
  if (path.length === 2 && path[0] === 'products')
    return <Product params={Promise.resolve({ slug: path[1] })} searchParams={props.searchParams} />
  if (path.length === 2 && path[0] === 'news')
    return <Article params={Promise.resolve({ slug: path[1] })} />
  if (path.length === 1 && path[0] === 'products')
    return <Products searchParams={props.searchParams} />
  if (path.length === 1 && path[0] === 'contact')
    return <Contact searchParams={props.searchParams} />
  const entry = pages[path.join('/') as keyof typeof pages]
  if (!entry) notFound()
  const Page = entry.page
  return <Page />
}
