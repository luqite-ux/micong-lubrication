import type { ApplicationArea, CooperationStep, ProductFamily } from '@/lib/data/types'
import type { SiteSnapshot } from './transport'

function record(value:unknown):Record<string,unknown>|null {
  return value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:null
}
function nonempty(value:unknown):string|null { return typeof value==='string'&&value.trim()?value:null }
function rows(snapshot:SiteSnapshot|null,path:string,type:string):unknown[]|null {
  const value=snapshot?.pages.find(page=>page.path===path)?.modules.find(module=>module.type===type)?.values.items
  return Array.isArray(value)?value:null
}

export function managedTextRows(snapshot:SiteSnapshot|null,path:string,type:string):Array<{id:string;body:string}>|null {
  const values=rows(snapshot,path,type)
  if(!values)return null
  return values.flatMap(value=>{
    const row=record(value)
    if(!row||!nonempty(row.id)||!nonempty(row.body)||typeof row.is_visible!=='boolean')throw new Error(`Invalid ${type} row`)
    return row.is_visible?[{id:row.id as string,body:row.body as string}]:[]
  })
}

export function managedTitledRows(snapshot:SiteSnapshot|null,path:string,type:string):Array<{id:string;icon:string;title:string;body:string}>|null {
  const values=rows(snapshot,path,type)
  if(!values)return null
  return values.flatMap(value=>{
    const row=record(value)
    if(!row||!nonempty(row.id)||!nonempty(row.icon)||!nonempty(row.title)||!nonempty(row.body)||typeof row.is_visible!=='boolean')throw new Error(`Invalid ${type} row`)
    return row.is_visible?[{id:row.id as string,icon:row.icon as string,title:row.title as string,body:row.body as string}]:[]
  })
}

export function managedCooperationSteps(snapshot:SiteSnapshot|null):CooperationStep[]|null {
  const values=rows(snapshot,'/','process_steps')
  if(!values)return null
  const output:CooperationStep[]=[]
  for(const value of values){
    const row=record(value)
    if(!row)throw new Error('Invalid process step')
    const id=nonempty(row.id),icon=nonempty(row.icon),title=nonempty(row.title),description=nonempty(row.description)
    if(!id||!icon||!title||!description||typeof row.is_visible!=='boolean')throw new Error('Incomplete process step')
    if(row.is_visible)output.push({id,icon,title:{en:title},description:{en:description}})
  }
  return output
}

export function managedApplicationAreas(snapshot:SiteSnapshot|null,families:ProductFamily[]):ApplicationArea[]|null {
  const values=rows(snapshot,'/applications','areas')
  if(!values)return null
  const byId=new Map(families.map(family=>[family.id,family]))
  const output:ApplicationArea[]=[]
  for(const value of values){
    const row=record(value)
    if(!row)throw new Error('Invalid application area')
    const id=nonempty(row.id),icon=nonempty(row.icon),name=nonempty(row.name),summary=nonempty(row.summary)
    if(!id||!icon||!name||!summary||typeof row.is_visible!=='boolean')throw new Error('Incomplete application area')
    if(!row.is_visible)continue
    const familySlugs:string[]=[]
    for(const key of ['product_1','product_2','product_3','product_4']){
      const productId=nonempty(row[key])
      if(!productId)continue
      const product=byId.get(productId)
      if(product)familySlugs.push(product.slug)
    }
    output.push({id,icon,name:{en:name},summary:{en:summary},familySlugs})
  }
  return output
}
