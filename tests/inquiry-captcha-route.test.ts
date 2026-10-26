import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, it } from 'node:test'
import ts from 'typescript'

import * as captcha from '../lib/inquiry-captcha.ts'

const routeSource = readFileSync(
  new URL('../app/api/captcha/route.ts', import.meta.url),
  'utf8',
)
const routeModule = { exports: {} as Record<string, unknown> }
const routeJavaScript = ts.transpileModule(routeSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText
const loadRoute = new Function('require', 'exports', 'module', routeJavaScript)
loadRoute(
  (specifier: string) => {
    if (specifier.endsWith('/lib/inquiry-captcha')) return captcha
    throw new Error(`Unexpected route dependency: ${specifier}`)
  },
  routeModule.exports,
  routeModule,
)
const route = routeModule.exports

const tenantId = '11111111-1111-4111-8111-111111111111'
const scope = 'captcha_form_scope_A_123456'
const mutableEnv = process.env as Record<string, string | undefined>
let savedEnv: Record<string, string | undefined>

type StoreRecord = {
  tenantId: string
  siteScopeHash: string
  formScopeHash: string
  challengeHash: string
  tokenHash: string
  expiresAt?: number
  now?: number
}

function routeFactory() {
  const candidate = (route as Record<string, unknown>).createCaptchaGetHandler
  assert.equal(typeof candidate, 'function', 'createCaptchaGetHandler must be exported')
  return candidate as (dependencies: Record<string, unknown>) => (request: Request) => Promise<Response>
}

beforeEach(() => {
  savedEnv = {
    NODE_ENV: mutableEnv.NODE_ENV,
    CAPTCHA_SECRET: mutableEnv.CAPTCHA_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: mutableEnv.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: mutableEnv.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_TENANT_ID: mutableEnv.NEXT_PUBLIC_TENANT_ID,
    CAPTCHA_SITE_SCOPE: mutableEnv.CAPTCHA_SITE_SCOPE,
  }
  mutableEnv.NODE_ENV = 'test'
})

afterEach(() => {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) delete mutableEnv[key]
    else mutableEnv[key] = value
  }
})

describe('CAPTCHA API route', () => {
  it('issues a scoped non-cacheable challenge through the shared store without a binding cookie', async () => {
    const issued: StoreRecord[] = []
    const store = {
      async issue(record: StoreRecord) {
        issued.push(structuredClone(record))
      },
      async consume() {
        return false
      },
    }
    const handler = routeFactory()({
      secret: 'route-test-secret-that-is-at-least-32-characters',
      tenantId,
      siteScope: 'example-customer-site',
      store,
      now: () => 1_000,
    })

    const response = await handler(new Request(`https://example.com/api/captcha?scope=${scope}`))
    const body = (await response.json()) as Record<string, unknown>

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('cache-control'), 'no-store, max-age=0')
    assert.equal(response.headers.get('set-cookie'), null)
    assert.match(String(body.svg), /^<svg/)
    assert.equal(typeof body.token, 'string')
    assert.equal(body.expiresAt, 301_000)
    assert.equal('answer' in body, false)
    assert.equal('testAnswer' in body, false)
    assert.equal('binding' in body, false)
    assert.equal(issued.length, 1)
    assert.equal(JSON.stringify(issued).includes(scope), false, 'store must receive only the scope hash')
  })

  it('rejects a missing or malformed per-form scope before issuing a challenge', async () => {
    let issueCount = 0
    const handler = routeFactory()({
      secret: 'route-test-secret-that-is-at-least-32-characters',
      tenantId,
      siteScope: 'example-customer-site',
      store: {
        async issue() { issueCount += 1 },
        async consume() { return false },
      },
      now: () => 1_000,
    })

    const missing = await handler(new Request('https://example.com/api/captcha'))
    const malformed = await handler(new Request('https://example.com/api/captcha?scope=short'))

    assert.equal(missing.status, 400)
    assert.equal(malformed.status, 400)
    assert.equal(issueCount, 0)
  })

  it('fails closed when server store configuration is missing', async () => {
    const handler = routeFactory()({
      env: {
        CAPTCHA_SECRET: 'route-test-secret-that-is-at-least-32-characters',
        NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
        NEXT_PUBLIC_TENANT_ID: tenantId,
        CAPTCHA_SITE_SCOPE: 'example-customer-site',
      },
    })

    const response = await handler(new Request(`https://example.com/api/captcha?scope=${scope}`))

    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), { error: 'Verification is temporarily unavailable. Please try again.' })
  })

  it('fails closed when atomic issue fails', async () => {
    const handler = routeFactory()({
      secret: 'route-test-secret-that-is-at-least-32-characters',
      tenantId,
      siteScope: 'example-customer-site',
      store: {
        async issue() { throw new Error('store unavailable') },
        async consume() { return false },
      },
      now: () => 1_000,
    })

    const response = await handler(new Request(`https://example.com/api/captcha?scope=${scope}`))

    assert.equal(response.status, 503)
    assert.deepEqual(await response.json(), { error: 'Verification is temporarily unavailable. Please try again.' })
  })
})
