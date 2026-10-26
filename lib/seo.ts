import type { Metadata } from 'next'
import { siteUrl } from '@/lib/site-url'

export function pageMetadata(input: { path: string; title: string; description: string; image?: string; type?: 'website' | 'article' }): Metadata {
  const url = siteUrl(input.path)
  const image = input.image || siteUrl('/images/micong-logo.jpg')
  return {
    title: { absolute: input.title },
    description: input.description,
    alternates: { canonical: url },
    openGraph: { title: input.title, description: input.description, type: input.type || 'website', url, images: [{ url: image }] },
    twitter: { card: 'summary_large_image', title: input.title, description: input.description, images: [image] },
  }
}
