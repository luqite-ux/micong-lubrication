/**
 * Public company facts supplied by the customer. Nothing else (WhatsApp,
 * social accounts, domain, certificates) was provided, so nothing else is listed.
 */
export const company = {
  brand: 'MICONG',
  brandZh: '米丛',
  legalName: 'Shanghai Micong Lubrication Technology Co., Ltd.',
  legalNameZh: '上海米丛润滑技术有限公司',
  phone: '+86 138 5896 2788',
  phoneHref: 'tel:+8613858962788',
  email: '13858962788@139.com',
  emailHref: 'mailto:13858962788@139.com',
  addressLines: ['No. 2218 Hunan Road', 'Pudong New Area', 'Shanghai, China'],
  addressOneLine: 'No. 2218 Hunan Road, Pudong New Area, Shanghai, China',
} as const

export const mainNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/products', label: 'Products' },
  { href: '/applications', label: 'Applications' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
] as const

/** Banner captions: the scenes are thematic imagery, never MICONG-owned or on-site photos. */
export const illustrativeNote = 'Illustrative scene, not a photograph of a MICONG site.'
