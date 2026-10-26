export const rfqFields = [
  'name',
  'email',
  'company',
  'phone',
  'family',
  'application',
  'grade',
  'quantity',
  'destination',
  'message',
  'captcha',
] as const

export type RfqFieldName = (typeof rfqFields)[number]

export type RfqValues = Partial<Record<RfqFieldName, string>>
export type RfqFieldErrors = Partial<Record<RfqFieldName, string>>

/**
 * `unavailable`: the form validated, but delivery and CAPTCHA verification are
 * connected in the engineering phase, so nothing is sent and no success is faked.
 */
export type RfqStatus = 'idle' | 'invalid' | 'unavailable' | 'success' | 'error'

export type RfqState = {
  status: RfqStatus
  fieldErrors: RfqFieldErrors
  values: RfqValues
  message?: string
}

export const rfqInitialState: RfqState = { status: 'idle', fieldErrors: {}, values: {} }

export const rfqFieldLabels: Record<RfqFieldName, string> = {
  name: 'Your name',
  email: 'Work email',
  company: 'Company',
  phone: 'Phone',
  family: 'Product family',
  application: 'Application or equipment',
  grade: 'Requested grade',
  quantity: 'Quantity',
  destination: 'Destination',
  message: 'Message',
  captcha: 'Verification characters',
}

export const requiredFields: RfqFieldName[] = ['name', 'email', 'company', 'family', 'destination', 'captcha']

export function validateRfq(values: RfqValues): RfqFieldErrors {
  const errors: RfqFieldErrors = {}
  for (const field of requiredFields) {
    if (!values[field]?.trim()) errors[field] = `${rfqFieldLabels[field]} is required.`
  }
  const email = values.email?.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid work email, for example name@company.com.'
  }
  const captcha = values.captcha?.trim()
  if (captcha && !/^[A-Za-z0-9]{4}$/.test(captcha)) {
    errors.captcha = 'Enter the 4 characters shown in the image.'
  }
  const phone = values.phone?.trim()
  if (phone && !/^[+()\d\s-]{6,24}$/.test(phone)) {
    errors.phone = 'Use digits, spaces, + ( ) or - only.'
  }
  return errors
}
