import type { CSSProperties } from 'react'

type TypographyOverride = { fontFamily?: unknown; fontWeight?: unknown; fontSizeDesktop?: unknown; fontSizeMobile?: unknown }
type ResponsiveTypographyStyle = CSSProperties & { '--hq-font-size-desktop'?: string; '--hq-font-size-mobile'?: string }

/** Maps published tokens to developer-owned values. It never accepts CSS from website content. */
export function siteTypographyStyle(styles: unknown, path: string, fontMap: Record<string, string>): ResponsiveTypographyStyle | undefined {
  if (!styles || typeof styles !== 'object' || Array.isArray(styles)) return undefined
  const raw = (styles as Record<string, unknown>)[path]
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined
  const value = raw as TypographyOverride, output: ResponsiveTypographyStyle = {}
  if (typeof value.fontFamily === 'string' && Object.hasOwn(fontMap, value.fontFamily) && fontMap[value.fontFamily]) output.fontFamily = fontMap[value.fontFamily]
  if (typeof value.fontWeight === 'number' && Number.isInteger(value.fontWeight) && value.fontWeight >= 100 && value.fontWeight <= 900 && value.fontWeight % 100 === 0) output.fontWeight = value.fontWeight
  if (typeof value.fontSizeDesktop === 'number' && Number.isInteger(value.fontSizeDesktop) && value.fontSizeDesktop >= 1 && value.fontSizeDesktop <= 512) output['--hq-font-size-desktop'] = `${value.fontSizeDesktop}px`
  if (typeof value.fontSizeMobile === 'number' && Number.isInteger(value.fontSizeMobile) && value.fontSizeMobile >= 1 && value.fontSizeMobile <= 512) output['--hq-font-size-mobile'] = `${value.fontSizeMobile}px`
  return Object.keys(output).length ? output : undefined
}
