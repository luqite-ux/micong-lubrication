import { renderMark } from '@/lib/favicon'

export const runtime = 'nodejs'
export const size = { width: 64, height: 64 }
export const contentType = 'image/png'

export default function Icon() {
  return renderMark(64)
}
