import type { HeroSlide } from '@/lib/hero-slides'
import { heroSlides } from '@/lib/hero-slides'
import type { FaqItem } from '@/lib/data/types'
import type { SiteSnapshot } from './transport'
import { mainNav } from '@/lib/site-config'

type Module = SiteSnapshot['pages'][number]['modules'][number]
type ImageValue = { url: string; alt: string }
function object(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null
}
function string(value: unknown): string | null { return typeof value === 'string' && value.trim() ? value : null }
function image(value: unknown): ImageValue | null {
  const data = object(value)
  const url = string(data?.url), alt = string(data?.alt)
  return url && url.startsWith('https://') && alt ? { url, alt } : null
}
export function homeModule(snapshot: SiteSnapshot | null, type: string): Module | null {
  return snapshot?.pages.find(page => page.path === '/')?.modules.find(module => module.type === type) ?? null
}
export function homeHeroSlides(module: Module | null): HeroSlide[] | null {
  const rows = module?.values.slides
  if (!Array.isArray(rows) || rows.length !== heroSlides.length) return null
  const slides: HeroSlide[] = []
  for (const rowValue of rows) {
    const row = object(rowValue)
    const base = heroSlides.find(slide => slide.id === row?.id)
    const desktop = image(row?.desktop_image), mobile = image(row?.mobile_image)
    const sceneLabel = string(row?.scene_label), eyebrow = string(row?.eyebrow), title = string(row?.title), body = string(row?.body)
    const primaryLabel = string(row?.primary_label), primaryHref = string(row?.primary_href)
    const secondaryLabel = string(row?.secondary_label), secondaryHref = string(row?.secondary_href)
    if (!base || !desktop || !mobile || !sceneLabel || !eyebrow || !title || !body || !primaryLabel || !primaryHref || !secondaryLabel || !secondaryHref) return null
    // Crop and wrapper treatment stay in developer-owned design; the CMS controls image and copy.
    slides.push({ ...base, src: desktop.url, alt: desktop.alt, mobileSrc: mobile.url, mobileAlt: mobile.alt, sceneLabel, eyebrow, title, body, primary: {label: primaryLabel, href: primaryHref}, secondary: {label: secondaryLabel, href: secondaryHref} })
  }
  return slides
}
export function homeFaq(module: Module | null): {items: FaqItem[]; title: string; description: string} | null {
  const title = string(module?.values.title), description = string(module?.values.description)
  const rows = module?.values.items
  if (!title || !description || !Array.isArray(rows) || !rows.length) return null
  const items: FaqItem[] = []
  for (const rowValue of rows) {
    const row = object(rowValue), id = string(row?.id), question = string(row?.question), answer = string(row?.answer)
    if (!id || !question || !answer) return null
    items.push({id, question:{en:question}, answer:{en:answer}})
  }
  return {items,title,description}
}
export function siteNavigation(module: Module | null): Array<{href:string;label:string}> | null {
  const rows = module?.values.items
  if (!Array.isArray(rows) || rows.length !== mainNav.length) return null
  const output: Array<{href:string;label:string}> = []
  for (const [index, rowValue] of rows.entries()) {
    const row = object(rowValue)
    const href = string(row?.href), label = string(row?.label)
    if (href !== mainNav[index].href || !label) return null
    output.push({href,label})
  }
  return output
}
