/**
 * DATA BOUNDARY.
 * Pages and components read content only through these async functions.
 * The engineering phase replaces the bodies with Supabase queries and R2 media
 * URLs without touching any page. Fields are locale-aware (`LocalizedText`).
 */
import {
  applicationAreas,
  cooperationSteps,
  faqItems,
  productCategories,
  productFamilies,
} from './source'
import type {
  ApplicationArea,
  CooperationStep,
  FaqItem,
  Locale,
  LocalizedText,
  NewsArticle,
  ProductCategory,
  ProductFamily,
} from './types'
import { getSupabaseClient, tenantId } from '@/lib/supabase'

type ProductRow = {
  id: string
  slug: string
  name: string
  name_i18n: Record<string, string> | null
  description: string | null
  description_i18n: Record<string, string> | null
  category_slug: string | null
  specs: Record<string, unknown> | null
  sort_order: number | null
  updated_at: string | null
  extra_data: Record<string, unknown> | null
}
type ProductCategoryRow = {
  slug: string
  name: string
  name_i18n: Record<string,string> | null
  description: string | null
  description_i18n: Record<string,string> | null
}

type ArticleRow = {
  id: string
  slug: string
  title: string
  title_i18n: Record<string, string> | null
  excerpt: string | null
  excerpt_i18n: Record<string, string> | null
  content: string | null
  content_i18n: Record<string, string> | null
  featured_image: string | null
  published_at: string | null
  created_at: string
  updated_at: string | null
}

function selectLocale(value: Record<string, string> | null, fallback: string, locale: Locale = 'en') {
  const valid = value && typeof value === 'object' ? value : {}
  return valid[locale] || valid.en || Object.values(valid).find(item => typeof item === 'string' && item.trim()) || fallback
}

export function text(value: LocalizedText, locale: Locale = 'en'): string {
  return value[locale] ?? value.en
}

export async function getProductCategories(locale: Locale = 'en'): Promise<ProductCategory[]> {
  const db = getSupabaseClient()
  const tenant = tenantId()
  if (!db || !tenant) return productCategories
  const {data,error}=await db.from('product_categories')
    .select('slug,name,name_i18n,description,description_i18n')
    .eq('tenant_id',tenant).eq('is_active',true).is('parent_id',null)
    .order('sort_order',{ascending:true})
  if(error) return productCategories
  return ((data??[]) as ProductCategoryRow[]).flatMap(row=>{
    if(row.slug!=='industrial-lubricants'&&row.slug!=='metalworking-fluids')return []
    return [{
      id:row.slug,
      name:{en:selectLocale(row.name_i18n,row.name,locale)},
      description:{en:selectLocale(row.description_i18n,row.description||'',locale)},
    } satisfies ProductCategory]
  })
}

const sourceMinimumOrderSlugs = new Set([
  'anti-wear-hydraulic-oil', 'slideway-oil', 'fully-synthetic-cutting-fluid',
  'semi-synthetic-cutting-fluid', 'micro-emulsion-cutting-fluid',
])

function sourceNotes(slug: string): string[] | undefined {
  return slug === 'anti-wear-hydraulic-oil' ? [
    'The source lists a cylindrical drum as 60 × 90 without stating the unit. Confirm dimensions and pack capacity before ordering.',
    'The standard oil is described as slightly yellow; the high-pressure, high-cleanness type is described as transparent.',
  ] : undefined
}

function withSourceFacts(family: ProductFamily): ProductFamily {
  return {
    ...family,
    minimumOrder: sourceMinimumOrderSlugs.has(family.slug) ? 'One metric ton or 5 drums' : undefined,
    sourceNotes: sourceNotes(family.slug),
  }
}

export async function getProductFamilies(locale: Locale = 'en'): Promise<ProductFamily[]> {
  const db = getSupabaseClient()
  const tenant = tenantId()
  if (!db || !tenant) return productFamilies.map(withSourceFacts)
  const { data, error } = await db.from('products')
    .select('id,slug,name,name_i18n,description,description_i18n,category_slug,specs,sort_order,updated_at,extra_data')
    .eq('tenant_id', tenant).eq('is_active', true).order('sort_order', { ascending: true })
  if (error) return productFamilies.map(withSourceFacts)
  return ((data ?? []) as ProductRow[]).map(row => {
    const original = productFamilies.find(item => item.slug === row.slug)
    const grades = Array.isArray(row.specs?.listed_grades) ? row.specs.listed_grades.filter((item): item is string => typeof item === 'string') : null
    return {
      id: row.id,
      slug: row.slug,
      name: { en: selectLocale(row.name_i18n, row.name, locale), zh: row.name_i18n?.zh },
      category: row.category_slug === 'metalworking-fluids' ? 'metalworking-fluids' : 'industrial-lubricants',
      summary: { en: selectLocale(row.description_i18n, row.description || '', locale).slice(0, 180) },
      description: { en: selectLocale(row.description_i18n, row.description || '', locale), zh: row.description_i18n?.zh },
      icon: original?.icon || 'hydraulic',
      grades: grades?.length ? grades : null,
      minimumOrder: typeof row.extra_data?.minimum_order === 'string' ? row.extra_data.minimum_order : undefined,
      sourceNotes: Array.isArray(row.extra_data?.source_notes)
        ? row.extra_data.source_notes.filter((note): note is string => typeof note === 'string')
        : undefined,
      applicationIds: original?.applicationIds || [],
      updatedAt: row.updated_at || undefined,
      seoTitle: typeof (row.extra_data?.seo_title_i18n as Record<string, unknown> | undefined)?.en === 'string'
        ? { en: (row.extra_data!.seo_title_i18n as Record<string, string>).en } : undefined,
      seoDescription: typeof (row.extra_data?.seo_description_i18n as Record<string, unknown> | undefined)?.en === 'string'
        ? { en: (row.extra_data!.seo_description_i18n as Record<string, string>).en } : undefined,
    } satisfies ProductFamily
  })
}

export async function getProductFamilyBySlug(slug: string, locale: Locale = 'en'): Promise<ProductFamily | null> {
  return (await getProductFamilies(locale)).find((family) => family.slug === slug) ?? null
}

export async function getApplicationAreas(): Promise<ApplicationArea[]> {
  return applicationAreas
}

export async function getCooperationSteps(): Promise<CooperationStep[]> {
  return cooperationSteps
}

export async function getFaqItems(): Promise<FaqItem[]> {
  return faqItems
}

export async function getNewsArticles(locale: Locale = 'en'): Promise<NewsArticle[]> {
  const db = getSupabaseClient()
  const tenant = tenantId()
  if (!db || !tenant) return []
  const { data, error } = await db.from('articles')
    .select('id,slug,title,title_i18n,excerpt,excerpt_i18n,content,content_i18n,featured_image,published_at,created_at,updated_at')
    .eq('tenant_id', tenant).eq('is_published', true).order('published_at', { ascending: false })
  if (error) return []
  return ((data ?? []) as ArticleRow[]).map(row => {
    const title = selectLocale(row.title_i18n, row.title, locale)
    const excerpt = selectLocale(row.excerpt_i18n, row.excerpt || '', locale)
    const content = selectLocale(row.content_i18n, row.content || '', locale)
    return {
      id: row.id,
      slug: row.slug,
      title: { en: title },
      excerpt: { en: excerpt },
      publishedAt: row.published_at || row.created_at,
      updatedAt: row.updated_at || undefined,
      body: content.replace(/<[^>]*>/g, ' ').split(/\n\s*\n/).map(item => item.trim()).filter(Boolean).map(en => ({ en })),
      cover: row.featured_image ? { src: row.featured_image, alt: { en: title } } : undefined,
    }
  })
}

export async function getNewsArticleBySlug(slug: string, locale: Locale = 'en'): Promise<NewsArticle | null> {
  return (await getNewsArticles(locale)).find((article) => article.slug === slug) ?? null
}
