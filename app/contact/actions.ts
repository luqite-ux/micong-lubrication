'use server'

import { createClient } from '@supabase/supabase-js'
import { createSupabaseCaptchaContextFromEnv, verifyCaptchaSubmission } from '@/lib/inquiry-captcha'
import { rfqFields, validateRfq, type RfqState, type RfqValues } from '@/lib/rfq'

function value(formData: FormData, name: string) {
  const raw = formData.get(name)
  return typeof raw === 'string' ? raw.trim().slice(0, 2000) : ''
}

export async function submitRfq(_previous: RfqState, formData: FormData): Promise<RfqState> {
  const values: RfqValues = {}
  for (const field of rfqFields) values[field] = value(formData, field === 'captcha' ? 'captchaAnswer' : field)
  const errors = validateRfq(values)
  const publicValues = { ...values, captcha: '' }
  const secret = process.env.CAPTCHA_SECRET?.trim()
  if (!secret) return { status: 'error', fieldErrors: {}, values: publicValues, message: 'Verification is temporarily unavailable. Please try again.' }

  let captchaOk = false
  try {
    const context = createSupabaseCaptchaContextFromEnv()
    const captcha = await verifyCaptchaSubmission({
      secret,
      tenantId: context.tenantId,
      siteScope: context.siteScope,
      scope: value(formData, 'captchaScope'),
      token: value(formData, 'captchaToken'),
      answer: values.captcha ?? '',
      store: context.store,
    })
    captchaOk = captcha.ok
  } catch {
    return { status: 'error', fieldErrors: {}, values: publicValues, message: 'Verification is temporarily unavailable. Please try again.' }
  }
  if (!captchaOk) errors.captcha = 'The image code is invalid or expired. Enter the new code shown below.'
  if (Object.keys(errors).length) return { status: 'invalid', fieldErrors: errors, values: publicValues }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !serviceKey || !tenantId) return { status: 'error', fieldErrors: {}, values: publicValues, message: 'Inquiry delivery is temporarily unavailable. Please email or call us.' }

  const subject = values.family || 'Website inquiry'
  const details = [
    ['Application / equipment', values.application],
    ['Grade', values.grade],
    ['Quantity', values.quantity],
    ['Destination', values.destination],
    ['Message', values.message],
  ].filter(([, text]) => text).map(([label, text]) => `${label}: ${text}`).join('\n')
  try {
    const db = createClient(url, serviceKey, { auth: { persistSession: false } })
    const { error } = await db.from('inquiries').insert({
      tenant_id: tenantId,
      name: values.name,
      company: values.company || null,
      email: values.email,
      phone: values.phone || null,
      subject,
      message: details,
      status: 'new',
    })
    if (error) throw error
  } catch {
    return { status: 'error', fieldErrors: {}, values: publicValues, message: 'Your request could not be saved. Please try again or email us.' }
  }
  return { status: 'success', fieldErrors: {}, values: {}, message: 'Your request was sent. We will reply using the contact details you provided.' }
}
