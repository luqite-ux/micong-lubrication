#!/usr/bin/env node
/**
 * One-time, tenant-scoped adoption of the customer workbook's five detailed
 * product descriptions into editable overview/features/applications fields.
 * The 2026-10-27 peer catalogue screenshots informed section order only;
 * their brand, photos, grades, specifications and claims are not imported.
 * Dry-run by default. Run with --apply after reviewing the selected rows.
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const expectedTenant = '2cbb206f-5be6-4434-a148-3ddf0b285159'
const tenant = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
if (tenant !== expectedTenant) throw new Error('MICONG tenant ID mismatch')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
if (!url || !key) throw new Error('Supabase service credentials missing')
const db = createClient(url, key, { auth: { persistSession: false } })
const sections = JSON.parse(readFileSync(new URL('../data/product-sections.json', import.meta.url), 'utf8'))
const slugs = Object.keys(sections)
const previousFeatures = {
  'fully-synthetic-cutting-fluid': ["Cooling and cleaning action helps carry away cutting heat and metal chips.", "The supplied description lists rust protection and a low-foam formula for high-pressure fluid systems.", "Used after dilution with water."],
  'semi-synthetic-cutting-fluid': ["Helps reduce tool wear while removing heat and chips from the cutting area.", "The supplied description lists inter-process rust protection, hard-water resistance and low foaming.", "Used after dilution with water."],
  'micro-emulsion-cutting-fluid': ["The supplied description compares its lubrication with fully synthetic fluid and lists cooling and cleaning performance.", "It lists rust protection, hard-water stability and low foaming for high-pressure fluid systems.", "Used after dilution with water."],
}

const { data, error } = await db.from('products')
  .select('id,slug,overview_i18n,features_i18n,applications_i18n')
  .eq('tenant_id', tenant).in('slug', slugs)
if (error) throw error
if (data.length !== slugs.length || data.some(row => !sections[row.slug])) throw new Error('Product selection mismatch')
const changes = data.map(row => ({
  slug: row.slug,
  existingFeatureCount: Array.isArray(row.features_i18n?.en) ? row.features_i18n.en.length : 0,
  existingApplicationCount: Array.isArray(row.applications_i18n?.en) ? row.applications_i18n.en.length : 0,
}))
for (const row of data) {
  const hasContent = changes.find(item => item.slug === row.slug).existingFeatureCount > 0
  if (!hasContent) continue
  const expected = sections[row.slug]
  const matchesCurrent = JSON.stringify(row.features_i18n?.en) === JSON.stringify(expected.features)
  const matchesPrevious = JSON.stringify(row.features_i18n?.en) === JSON.stringify(previousFeatures[row.slug])
  if (row.overview_i18n?.en !== expected.overview ||
      JSON.stringify(row.applications_i18n?.en) !== JSON.stringify(expected.applications) ||
      (!matchesCurrent && !matchesPrevious)) {
    throw new Error(`Structured product content changed after initial adoption: ${row.slug}`)
  }
}
console.log(JSON.stringify({ mode: process.argv.includes('--apply') ? 'apply' : 'dry-run', tenant, changes }))
if (!process.argv.includes('--apply')) process.exit(0)

for (const row of data) {
  const section = sections[row.slug]
  if (JSON.stringify(row.features_i18n?.en) === JSON.stringify(section.features)) continue
  const { error: updateError } = await db.from('products').update({
    overview: section.overview,
    overview_en: section.overview,
    overview_i18n: { ...(row.overview_i18n || {}), en: section.overview },
    features: section.features,
    features_i18n: { ...(row.features_i18n || {}), en: section.features },
    applications: section.applications,
    applications_i18n: { ...(row.applications_i18n || {}), en: section.applications },
  }).eq('tenant_id', tenant).eq('id', row.id)
  if (updateError) throw updateError
}
const { data: written, error: readError } = await db.from('products')
  .select('slug,overview_i18n,features_i18n,applications_i18n')
  .eq('tenant_id', tenant).in('slug', slugs)
if (readError) throw readError
for (const row of written) {
  const expected = sections[row.slug]
  if (row.overview_i18n?.en !== expected.overview ||
      JSON.stringify(row.features_i18n?.en) !== JSON.stringify(expected.features) ||
      JSON.stringify(row.applications_i18n?.en) !== JSON.stringify(expected.applications)) {
    throw new Error(`Readback mismatch: ${row.slug}`)
  }
}
console.log(JSON.stringify({ result: 'PASS', tenant, updatedProducts: written.length }))
