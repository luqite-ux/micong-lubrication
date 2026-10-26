#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const root = path.resolve(import.meta.dirname, '..')
const content = JSON.parse(readFileSync(path.join(root, 'data/seed-products.json'), 'utf8'))
const settings = JSON.parse(readFileSync(path.join(root, 'data/seed-site-settings.json'), 'utf8'))
const assets = JSON.parse(readFileSync(path.join(root, 'data/seed-assets.json'), 'utf8'))
const need = (key) => {
  const value = process.env[key]?.trim()
  if (!value) throw new Error(`Missing ${key}`)
  return value
}
const db = createClient(need('NEXT_PUBLIC_SUPABASE_URL'), need('SUPABASE_SERVICE_ROLE_KEY'), { auth: { persistSession: false } })
const companyName = settings.tenant.display_name
const temporaryDomain = 'micong-lubrication.vercel.app'
const adminEmail = settings.tenant.contact_email

async function expect(query, label) {
  const { data, error } = await query
  if (error) throw new Error(`${label}: ${error.message}`)
  return data
}

async function preflight() {
  const tenants = await expect(db.from('tenants').select('id,domain,display_name').or(`display_name.eq.${companyName},domain.eq.${temporaryDomain}`), 'tenant preflight')
  const admins = await expect(db.from('admin_users').select('id,tenant_id,email').eq('email', adminEmail), 'admin preflight')
  const uniqueTenants = [...new Map(tenants.map(item => [item.id, item])).values()]
  if (uniqueTenants.length > 1) throw new Error('Tenant identity conflict')
  if (admins.some(item => uniqueTenants[0] && item.tenant_id !== uniqueTenants[0].id)) throw new Error('Admin email belongs to another tenant')
  if (admins.length && !uniqueTenants.length) throw new Error('Admin email already exists without matching tenant')
  return { tenant: uniqueTenants[0] ?? null, admin: admins[0] ?? null }
}

const categoryRows = [
  { slug: 'industrial-lubricants', name: { en: 'Industrial Lubricants', zh: '工业润滑油脂' } },
  { slug: 'metalworking-fluids', name: { en: 'Metalworking Fluids', zh: '金属加工液' } },
]
const categorySlug = (category) => category === 'Metalworking Fluids' ? 'metalworking-fluids' : 'industrial-lubricants'

async function readInitialPassword() {
  if (!process.stdin.isTTY || !process.stdin.setRawMode) throw new Error('Interactive hidden password input required')
  process.stdout.write('Initial password (hidden): ')
  process.stdin.setRawMode(true)
  process.stdin.resume()
  const password = await new Promise(resolve => {
    let result = ''
    const onData = bytes => {
      for (const byte of bytes) {
        if (byte === 3) process.exit(130)
        if (byte === 13 || byte === 10) { process.stdin.off('data', onData); resolve(result); return }
        if (byte === 8 || byte === 127) result = result.slice(0, -1)
        else result += String.fromCharCode(byte)
      }
    }
    process.stdin.on('data', onData)
  })
  process.stdin.setRawMode(false)
  process.stdin.pause()
  process.stdout.write('\n')
  if (!password) throw new Error('Initial password missing')
  return password
}

async function main() {
  const existing = await preflight()
  if (process.argv[2] === 'preflight') {
    console.log(JSON.stringify({ result: 'PASS', existingTenantId: existing.tenant?.id ?? null, existingDomain: existing.tenant?.domain ?? null, adminEmailAvailable: !existing.admin || existing.admin.tenant_id === existing.tenant?.id, productCount: content.items.length }))
    return
  }
  if (process.argv[2] !== 'seed') throw new Error('Use preflight or seed')
  const initialPassword = await readInitialPassword()
  const tenantId = existing.tenant?.id ?? randomUUID()
  const now = new Date().toISOString()
  const logoUrl = assets.find(item => item.role === 'official-logo')?.url
  if (!logoUrl) throw new Error('Verified customer logo R2 URL missing')
  const passwordHash = await bcrypt.hash(initialPassword, 12)
  const tenant = {
    id: tenantId,
    name: 'micong-lubrication',
    display_name: companyName,
    domain: temporaryDomain,
    email: adminEmail,
    password_hash: passwordHash,
    admin_group: 2,
    brand_color: '#c91522',
    logo_url: logoUrl,
    favicon_url: logoUrl,
    default_language: 'en',
    supported_languages: ['en'],
    ...Object.fromEntries(Object.entries(settings.tenant).filter(([key]) => !['display_name', 'admin_group', 'default_language', 'supported_languages', 'domain', 'logo_url', 'favicon_url', 'extra_settings'].includes(key))),
    public_contact_email: adminEmail,
    inquiry_notification_email: adminEmail,
    contact_whatsapp: '',
    social_links: {},
    google_analytics_id: '',
    google_tag_manager_id: '',
    extra_settings: {
      ...settings.tenant.extra_settings,
      legal_name_zh: companyName,
      legal_name_en: settings.legal_name.display_normalized_en,
      legal_name_en_status: settings.legal_name.status,
      site_settings_source: settings.source.workbook,
      site_settings_initialized_at: now,
      site_settings_manual_fields: [],
      site_assets: { banners: assets.filter(item => item.role === 'customer-designated-banner').map(item => item.url) },
    },
  }
  await expect(db.from('tenants').upsert(tenant, { onConflict: 'domain' }), 'tenant upsert')
  for (const [index, category] of categoryRows.entries()) {
    const row = { tenant_id: tenantId, slug: category.slug, name: category.name.en, name_en: category.name.en, name_i18n: category.name, description: category.name.en, description_en: category.name.en, description_i18n: category.name, sort_order: index + 1, is_active: true }
    const old = await expect(db.from('product_categories').select('id').eq('tenant_id', tenantId).eq('slug', category.slug).maybeSingle(), 'category lookup')
    await expect(old ? db.from('product_categories').update(row).eq('tenant_id', tenantId).eq('id', old.id) : db.from('product_categories').insert(row), 'category write')
  }
  for (const [index, product] of content.items.entries()) {
    const description = product.description_i18n?.en || `${product.name_i18n.en} is in the MICONG product range. Grades and specifications are confirmed by inquiry.`
    const row = {
      tenant_id: tenantId,
      slug: product.slug,
      category: product.category,
      category_slug: categorySlug(product.category),
      name: product.name_i18n.en,
      name_en: product.name_i18n.en,
      name_i18n: product.name_i18n,
      description,
      description_en: description,
      description_i18n: product.description_i18n || { en: description, zh: product.name_i18n.zh },
      overview: description,
      overview_en: description,
      overview_i18n: product.description_i18n || { en: description, zh: product.name_i18n.zh },
      features: [], features_i18n: { en: [] },
      applications: [], applications_i18n: { en: [] },
      advantages: [], advantages_i18n: { en: [] },
      image_url: null,
      specs: product.grades?.length ? { listed_grades: product.grades } : {},
      model: '',
      extra_data: { source_cells: product.source?.cells ?? [], source_workbook: product.source?.workbook ?? '', image_status: product.image_status, minimum_order: product.minimum_order ?? null, grade_discrepancy: product.company_overview_variant_pending_review ?? null },
      sort_order: index + 1,
      is_active: true,
    }
    const old = await expect(db.from('products').select('id').eq('tenant_id', tenantId).eq('slug', product.slug).maybeSingle(), 'product lookup')
    await expect(old ? db.from('products').update(row).eq('tenant_id', tenantId).eq('id', old.id) : db.from('products').insert(row), 'product write')
  }
  const admin = { email: adminEmail, password_hash: passwordHash, name: companyName, role: 'admin', is_active: true, tenant_id: tenantId, admin_group: 2, must_change_password: false }
  await expect(existing.admin ? db.from('admin_users').update(admin).eq('tenant_id', tenantId).eq('id', existing.admin.id) : db.from('admin_users').insert(admin), 'admin write')
  const seo = await expect(db.from('seo_tenant_config').select('enabled').eq('tenant_id', tenantId).maybeSingle(), 'SEO read')
  if (seo?.enabled) await expect(db.from('seo_tenant_config').update({ enabled: false }).eq('tenant_id', tenantId), 'SEO disable')
  const tenantCheck = await expect(db.from('tenants').select('id,domain,display_name,admin_group,logo_url,favicon_url,default_language,supported_languages,contact_email,extra_settings').eq('id', tenantId).single(), 'tenant readback')
  const products = await expect(db.from('products').select('slug,image_url').eq('tenant_id', tenantId).eq('is_active', true), 'product readback')
  const adminCheck = await expect(db.from('admin_users').select('email,tenant_id,admin_group,must_change_password').eq('tenant_id', tenantId).eq('email', adminEmail).single(), 'admin readback')
  if (tenantCheck.admin_group !== 2 || products.length !== content.items.length || adminCheck.must_change_password !== false) throw new Error('Readback mismatch')
  console.log(JSON.stringify({ result: 'PASS', tenantId, domain: tenantCheck.domain, adminGroup: tenantCheck.admin_group, productCount: products.length, adminEmail: adminCheck.email, logoUrlConfigured: !!tenantCheck.logo_url, faviconUrlConfigured: !!tenantCheck.favicon_url, seoEnabled: false }))
}

main().catch(error => { console.error(error.message); process.exitCode = 1 })
