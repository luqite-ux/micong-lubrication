export type Locale = 'en' | 'zh'

/** Locale-aware text. `en` is required; `zh` is filled by the future bilingual phase. */
export type LocalizedText = { en: string; zh?: string }

export type ProductCategoryId = 'industrial-lubricants' | 'metalworking-fluids'

export type ProductCategory = {
  id: ProductCategoryId
  name: LocalizedText
  description: LocalizedText
}

export type ProductFamily = {
  id: string
  slug: string
  name: LocalizedText
  category: ProductCategoryId
  summary: LocalizedText
  description?: LocalizedText
  /** Marker icon key resolved by `lib/icon-map.ts`. */
  icon: string
  /**
   * Grades are listed only where the customer source lists them.
   * `null` means the source has a name only and grades are handled by inquiry.
   */
  grades: string[] | null
  applicationIds: string[]
  updatedAt?: string
}

export type ApplicationArea = {
  id: string
  name: LocalizedText
  summary: LocalizedText
  icon: string
  familySlugs: string[]
}

export type FaqItem = {
  id: string
  question: LocalizedText
  answer: LocalizedText
}

export type NewsArticle = {
  id: string
  slug: string
  title: LocalizedText
  excerpt: LocalizedText
  publishedAt: string
  updatedAt?: string
  body: LocalizedText[]
  cover?: { src: string; alt: LocalizedText }
}

export type CooperationStep = {
  id: string
  title: LocalizedText
  description: LocalizedText
  icon: string
}
