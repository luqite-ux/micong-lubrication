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

export const productCategories: ProductCategory[] = [
  {
    id: 'industrial-lubricants',
    name: { en: 'Industrial lubricants' },
    description: {
      en: 'Hydraulic, slideway, engine, gear and vacuum pump oils, and grease.',
    },
  },
  {
    id: 'metalworking-fluids',
    name: { en: 'Metalworking fluids' },
    description: {
      en: 'Fully synthetic, semi-synthetic and micro-emulsion cutting fluids, industrial white oil, and cutting oil.',
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
    id: 'pf-engine',
    slug: 'automotive-engine-oil',
    name: { en: 'Automotive Engine Oil' },
    category: 'industrial-lubricants',
    summary: { en: 'Automotive engine oil family. Grades and specifications are confirmed by inquiry.' },
    icon: 'engine',
    grades: null,
    applicationIds: ['engines'],
  },
  {
    id: 'pf-gear',
    slug: 'gear-oil',
    name: { en: 'Gear Oil' },
    category: 'industrial-lubricants',
    summary: { en: 'Gear oil family for gearboxes and geared drives. Grades are confirmed by inquiry.' },
    icon: 'gear',
    grades: null,
    applicationIds: ['gearboxes'],
  },
  {
    id: 'pf-vacuum',
    slug: 'vacuum-pump-oil',
    name: { en: 'Vacuum Pump Oil' },
    category: 'industrial-lubricants',
    summary: { en: 'Vacuum pump oil family for vacuum pump lubrication. Grades are confirmed by inquiry.' },
    icon: 'vacuum',
    grades: null,
    applicationIds: ['vacuum-pumps'],
  },
  {
    id: 'pf-grease',
    slug: 'lubricating-grease',
    name: { en: 'Lubricating Grease' },
    category: 'industrial-lubricants',
    summary: { en: 'Lubricating grease family for grease-lubricated points. Types are confirmed by inquiry.' },
    icon: 'grease',
    grades: null,
    applicationIds: ['grease-points'],
  },
  {
    id: 'pf-white-oil',
    slug: 'industrial-white-oil',
    name: { en: 'Industrial White Oil' },
    category: 'metalworking-fluids',
    summary: { en: 'Industrial white oil family. Describe your use in the inquiry to discuss the right grade.' },
    icon: 'white',
    grades: null,
    applicationIds: ['other-industrial'],
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
  {
    id: 'pf-cutting-oil',
    slug: 'cutting-oil',
    name: { en: 'Cutting Oil' },
    category: 'metalworking-fluids',
    summary: { en: 'Cutting oil for metal cutting, supplied as an oil rather than a water-mixed fluid.' },
    icon: 'cutting',
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
    summary: { en: 'Choose between water-miscible fluids (fully synthetic, semi-synthetic, micro-emulsion) and cutting oil.' },
    icon: 'cutting',
    familySlugs: [
      'fully-synthetic-cutting-fluid',
      'semi-synthetic-cutting-fluid',
      'micro-emulsion-cutting-fluid',
      'cutting-oil',
    ],
  },
  {
    id: 'gearboxes',
    name: { en: 'Gearboxes' },
    summary: { en: 'Geared drives and gearboxes. Include the gearbox type and current oil in your inquiry.' },
    icon: 'gear',
    familySlugs: ['gear-oil'],
  },
  {
    id: 'vacuum-pumps',
    name: { en: 'Vacuum pumps' },
    summary: { en: 'Vacuum pump lubrication. Name the pump model so the right oil can be discussed.' },
    icon: 'vacuum',
    familySlugs: ['vacuum-pump-oil'],
  },
  {
    id: 'engines',
    name: { en: 'Engines' },
    summary: { en: 'Automotive engines. Send the engine details and the oil specification you need.' },
    icon: 'engine',
    familySlugs: ['automotive-engine-oil'],
  },
  {
    id: 'grease-points',
    name: { en: 'Grease-lubricated points' },
    summary: { en: 'Bearings and other points lubricated with grease. Describe the point and operating conditions.' },
    icon: 'grease',
    familySlugs: ['lubricating-grease'],
  },
  {
    id: 'other-industrial',
    name: { en: 'Other industrial uses' },
    summary: { en: 'Industrial white oil and uses not listed here. Describe your process and we will point to a family.' },
    icon: 'white',
    familySlugs: ['industrial-white-oil'],
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

export const faqItems: FaqItem[] = [
  {
    id: 'packaging',
    question: { en: 'Can packaging be customized?' },
    answer: {
      en: 'Packaging customization can be discussed. State the pack type you need and your destination in the request form, and we will reply with what can be arranged for your order.',
    },
  },
  {
    id: 'samples',
    question: { en: 'Can I request a sample?' },
    answer: {
      en: 'Samples can be requested through the quote form. Name the product family, the grade if one is listed, and your destination.',
    },
  },
  {
    id: 'tds',
    question: { en: 'Can I get a technical data sheet?' },
    answer: {
      en: 'Yes, technical data sheets can be requested. Tell us the family and grade you are considering, using the form or by email.',
    },
  },
  {
    id: 'applications',
    question: { en: 'Do you supply for hydraulic and CNC applications?' },
    answer: {
      en: 'MICONG lists Anti-wear Hydraulic Oil for hydraulic equipment and cutting fluids for CNC and metal cutting work. Send the equipment and operating details so the right family and grade can be discussed.',
    },
  },
  {
    id: 'oem',
    question: { en: 'Is OEM cooperation possible?' },
    answer: {
      en: 'OEM cooperation can be discussed. Describe your brand, the product family and your pack requirements in the message field.',
    },
  },
  {
    id: 'sample-shipping',
    question: { en: 'Who pays for sample shipping?' },
    answer: {
      en: 'Sample shipping is at the customer cost. Include your destination in the request so shipping can be discussed.',
    },
  },
  {
    id: 'lead-time',
    question: { en: 'How long does delivery take?' },
    answer: {
      en: 'Lead time depends on order size and is discussed for each inquiry. Include quantity and destination so timing can be discussed.',
    },
  },
  {
    id: 'inspection',
    question: { en: 'Can a third party inspect the goods?' },
    answer: {
      en: 'Third-party inspection can be discussed on request. Mention it in your inquiry together with what you want checked.',
    },
  },
]

/** No real news articles were supplied. The list stays empty until the admin phase. */
export const newsArticles: NewsArticle[] = []
