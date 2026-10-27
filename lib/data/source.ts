/**
 * STATIC SOURCE DATA (demo phase).
 *
 * Everything here is either taken from the customer workbook or is neutral
 * navigation copy. Rules that must survive the move to Supabase / R2:
 *  - Grades appear only where the workbook lists them (hydraulic and slideway: 32 / 46 / 68).
 *  - Workbook rows H5 to H8 repeat the hydraulic specifications by mistake, so no
 *    specification numbers are attached to any other family.
 *  - No licence, capacity, certificate or quality-period content is published.
 */
import type {
  ApplicationArea,
  CooperationStep,
  FaqItem,
  NewsArticle,
  ProductCategory,
  ProductFamily,
} from './types'
import sourcedFaq from '@/data/faq-source.json'

export const productCategories: ProductCategory[] = [
  {
    id: 'industrial-lubricants',
    name: { en: 'Hydraulic & slideway oils' },
    description: {
      en: 'Anti-wear hydraulic oil and slideway oil with source-listed grades.',
    },
  },
  {
    id: 'metalworking-fluids',
    name: { en: 'Metalworking fluids' },
    description: {
      en: 'Fully synthetic, semi-synthetic and micro-emulsion cutting fluids.',
    },
  },
]

const gradesListed = ['32', '46', '68']

export const productFamilies: ProductFamily[] = [
  {
    id: 'pf-hydraulic',
    slug: 'anti-wear-hydraulic-oil',
    name: { en: 'Anti-wear Hydraulic Oil' },
    category: 'industrial-lubricants',
    summary: { en: 'Anti-wear hydraulic oil for hydraulic equipment, listed in grades 32, 46 and 68.' },
    icon: 'hydraulic',
    grades: gradesListed,
    applicationIds: ['hydraulic-equipment'],
  },
  {
    id: 'pf-slideway',
    slug: 'slideway-oil',
    name: { en: 'Slideway Oil' },
    category: 'industrial-lubricants',
    summary: { en: 'Slideway oil for machine-tool slideways, listed in grades 32, 46 and 68.' },
    icon: 'slideway',
    grades: gradesListed,
    applicationIds: ['machine-tool-slideways'],
  },
  {
    id: 'pf-fully-synthetic',
    slug: 'fully-synthetic-cutting-fluid',
    name: { en: 'Fully Synthetic Cutting Fluid' },
    category: 'metalworking-fluids',
    summary: { en: 'Fully synthetic, water-miscible cutting fluid for metalworking. Details are shared on request.' },
    icon: 'synthetic',
    grades: null,
    applicationIds: ['cnc-machining'],
  },
  {
    id: 'pf-semi-synthetic',
    slug: 'semi-synthetic-cutting-fluid',
    name: { en: 'Semi-synthetic Cutting Fluid' },
    category: 'metalworking-fluids',
    summary: { en: 'Semi-synthetic, water-miscible cutting fluid for metalworking. Details are shared on request.' },
    icon: 'semi',
    grades: null,
    applicationIds: ['cnc-machining'],
  },
  {
    id: 'pf-micro-emulsion',
    slug: 'micro-emulsion-cutting-fluid',
    name: { en: 'Micro-emulsion Cutting Fluid' },
    category: 'metalworking-fluids',
    summary: { en: 'Micro-emulsion, water-miscible cutting fluid for metalworking. Details are shared on request.' },
    icon: 'micro',
    grades: null,
    applicationIds: ['cnc-machining'],
  },
]

export const applicationAreas: ApplicationArea[] = [
  {
    id: 'hydraulic-equipment',
    name: { en: 'Hydraulic equipment' },
    summary: { en: 'Systems driven by hydraulic fluid. Share the equipment type and operating conditions to confirm the grade.' },
    icon: 'hydraulic',
    familySlugs: ['anti-wear-hydraulic-oil'],
  },
  {
    id: 'machine-tool-slideways',
    name: { en: 'Machine-tool slideways' },
    summary: { en: 'Sliding guideways on machine tools. Tell us the machine and the grade you currently use.' },
    icon: 'slideway',
    familySlugs: ['slideway-oil'],
  },
  {
    id: 'cnc-machining',
    name: { en: 'CNC machining and metal cutting' },
    summary: { en: 'Compare the listed fully synthetic, semi-synthetic and micro-emulsion cutting fluids.' },
    icon: 'cutting',
    familySlugs: [
      'fully-synthetic-cutting-fluid',
      'semi-synthetic-cutting-fluid',
      'micro-emulsion-cutting-fluid',
    ],
  },
]

export const cooperationSteps: CooperationStep[] = [
  {
    id: 'requirement',
    icon: 'requirement',
    title: { en: 'Share your requirement' },
    description: { en: 'Product family, application or equipment, grade, quantity and destination.' },
  },
  {
    id: 'document',
    icon: 'document',
    title: { en: 'Request a data sheet' },
    description: { en: 'Ask for the technical data sheet, or raise OEM and packaging needs.' },
  },
  {
    id: 'sample',
    icon: 'sample',
    title: { en: 'Evaluate a sample' },
    description: { en: 'Samples can be requested. Sample shipping is at the customer cost.' },
  },
  {
    id: 'quote',
    icon: 'quote',
    title: { en: 'Agree quote and timing' },
    description: { en: 'Lead time depends on order size and is discussed per inquiry.' },
  },
  {
    id: 'inspection',
    icon: 'inspection',
    title: { en: 'Inspection if needed' },
    description: { en: 'Third-party inspection can be discussed on request.' },
  },
]

export const faqItems: FaqItem[] = sourcedFaq

/** No real news articles were supplied. The list stays empty until the admin phase. */
export const newsArticles: NewsArticle[] = []
