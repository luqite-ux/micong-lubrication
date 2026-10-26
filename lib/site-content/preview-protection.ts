/** Call on the final middleware response; retain existing auth/redirect logic. */
export function protectPreviewResponse(headers: Headers, preview: boolean): void {
  if (!preview) return
  headers.set('Cache-Control', 'private, no-store, max-age=0')
  headers.set('CDN-Cache-Control', 'no-store')
  headers.set('Vercel-CDN-Cache-Control', 'no-store')
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive')
  headers.set('Referrer-Policy', 'no-referrer')
}
