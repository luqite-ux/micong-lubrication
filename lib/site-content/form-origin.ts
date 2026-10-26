/** Browsers send Origin:null for native POST under no-referrer. Only accept
 * that case with browser-controlled same-origin Fetch Metadata, never cross-site. */
export function allowsPreviewFormOrigin(headers: Headers, customerOrigin: string, adminOrigin?: string): boolean {
  const origin = headers.get('origin')
  return origin === customerOrigin || (Boolean(adminOrigin) && origin === adminOrigin)
    || (origin === 'null' && headers.get('sec-fetch-site') === 'same-origin')
}
