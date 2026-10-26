import type { SiteSnapshot } from './transport'

export function pageHero(snapshot: SiteSnapshot | null, path: string) {
  const page = snapshot?.pages.find(item => item.path === path)
  const values = page?.modules.find(module => module.type === 'page_hero')?.values
  if (!values) return null
  const eyebrow = values.eyebrow, title = values.title, description = values.description
  if (typeof eyebrow !== 'string' || !eyebrow.trim() || typeof title !== 'string' || !title.trim() || typeof description !== 'string' || !description.trim()) {
    throw new Error(`Published content is incomplete for ${path}`)
  }
  return { eyebrow, title, description }
}

export function pageVersion(snapshot: SiteSnapshot | null, path: string) {
  return snapshot?.pages.some(page => page.path === path) ? { 'data-hq-content-version': snapshot.version } : {}
}

export function pageCopy(snapshot: SiteSnapshot | null, path: string): Record<string,string> | null {
  const page=snapshot?.pages.find(item=>item.path===path)
  const values=page?.modules.find(module=>module.type==='copy')?.values
  if(!values) return null
  const copy:Record<string,string>={}
  for(const [key,value] of Object.entries(values)) if(typeof value==='string' && value.trim()) copy[key]=value
  return copy
}

export function copyValue(copy:Record<string,string>|null|undefined,key:string,fallback:string):string {
  return copy?.[key] || fallback
}
