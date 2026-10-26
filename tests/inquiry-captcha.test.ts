import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import * as captcha from '../lib/inquiry-captcha.ts'

const secret = 'x'.repeat(32)
const tenantId = '11111111-1111-4111-8111-111111111111'
const siteScope = 'example-customer-site'
const scopeA = 'captcha_form_scope_A_123456'
const scopeB = 'captcha_form_scope_B_123456'
const mutableEnv = process.env as Record<string, string | undefined>
const originalNodeEnv = process.env.NODE_ENV

type Challenge = {
  svg: string
  token: string
  expiresAt: number
  testAnswer?: string
}

type StoreRecord = {
  tenantId: string
  siteScopeHash: string
  formScopeHash: string
  challengeHash: string
  tokenHash: string
  expiresAt?: number
  now?: number
}

type ChallengeStore = {
  issue(record: StoreRecord): Promise<void>
  consume(record: StoreRecord): Promise<boolean>
}

type IssueCaptchaChallenge = (input: {
  secret: string
  tenantId: string
  siteScope: string
  scope: string
  store: ChallengeStore
  now?: number
}) => Promise<Challenge>

type VerifyCaptchaSubmission = (input: {
  secret: string
  tenantId: string
  siteScope: string
  scope: string
  token: string
  answer: string
  store: ChallengeStore
  now?: number
}) => Promise<{ ok: true } | { ok: false; code: 'missing' | 'invalid' | 'expired' }>

type CreateSupabaseCaptchaStore = (input: {
  supabaseUrl: string
  serviceRoleKey: string
  fetch?: typeof fetch
}) => ChallengeStore

function captchaFunction<T>(name: string): T {
  const candidate = (captcha as Record<string, unknown>)[name]
  assert.equal(typeof candidate, 'function', `${name} must be exported`)
  return candidate as T
}

class MemoryChallengeStore implements ChallengeStore {
  readonly issueRecords: StoreRecord[] = []
  readonly consumeRecords: StoreRecord[] = []
  readonly rows = new Map<string, StoreRecord & { consumed: boolean }>()

  key(record: StoreRecord) {
    return `${record.tenantId}:${record.siteScopeHash}:${record.formScopeHash}`
  }

  async issue(record: StoreRecord) {
    this.issueRecords.push(structuredClone(record))
    this.rows.set(this.key(record), { ...structuredClone(record), consumed: false })
  }

  async consume(record: StoreRecord) {
    this.consumeRecords.push(structuredClone(record))
    const key = this.key(record)
    const current = this.rows.get(key)
    const now = record.now ?? Date.now()
    if (
      !current
      || current.consumed
      || current.challengeHash !== record.challengeHash
      || (record.tokenHash !== null && current.tokenHash !== record.tokenHash)
      || !current.expiresAt
      || now > current.expiresAt
    ) {
      return false
    }
    current.consumed = true
    this.rows.set(key, current)
    return true
  }
}

const issueCaptchaChallenge = () => captchaFunction<IssueCaptchaChallenge>('issueCaptchaChallenge')
const verifyCaptchaSubmission = () => captchaFunction<VerifyCaptchaSubmission>('verifyCaptchaSubmission')

async function issue(store: ChallengeStore, scope: string, now = 1_000) {
  return issueCaptchaChallenge()({ secret, tenantId, siteScope, scope, store, now })
}

async function submit(
  store: ChallengeStore,
  challenge: Challenge,
  scope: string,
  answer = challenge.testAnswer ?? '',
  now = 1_001,
) {
  return verifyCaptchaSubmission()({
    secret,
    tenantId,
    siteScope,
    scope,
    token: challenge.token,
    answer,
    store,
    now,
  })
}

before(() => {
  mutableEnv.NODE_ENV = 'test'
})

after(() => {
  if (originalNodeEnv === undefined) delete mutableEnv.NODE_ENV
  else mutableEnv.NODE_ENV = originalNodeEnv
})

describe('inquiry CAPTCHA atomic challenge store', () => {
  it('allows exactly one of two concurrent submissions for the same challenge', async () => {
    const store = new MemoryChallengeStore()
    const challenge = await issue(store, scopeA)
    assert.ok(challenge.testAnswer)

    const results = await Promise.all([
      submit(store, challenge, scopeA),
      submit(store, challenge, scopeA),
    ])

    assert.equal(results.filter(({ ok }) => ok).length, 1)
    assert.equal(results.filter(({ ok }) => !ok).length, 1)
    assert.equal(store.consumeRecords.length, 2)
  })

  it('rejects a saved request replay after the first accepted submission', async () => {
    const store = new MemoryChallengeStore()
    const challenge = await issue(store, scopeA)
    assert.ok(challenge.testAnswer)
    const savedRequest = {
      secret,
      tenantId,
      siteScope,
      scope: scopeA,
      token: challenge.token,
      answer: challenge.testAnswer,
      store,
      now: 1_001,
    }

    assert.deepEqual(await verifyCaptchaSubmission()(savedRequest), { ok: true })
    assert.deepEqual(await verifyCaptchaSubmission()(savedRequest), { ok: false, code: 'invalid' })
  })

  it('refreshing one scope invalidates its old token without affecting a separate scope', async () => {
    const store = new MemoryChallengeStore()
    const firstA = await issue(store, scopeA, 1_000)
    const firstB = await issue(store, scopeB, 1_000)
    const refreshedA = await issue(store, scopeA, 1_001)
    assert.ok(firstA.testAnswer)
    assert.ok(firstB.testAnswer)
    assert.ok(refreshedA.testAnswer)

    assert.deepEqual(await submit(store, firstA, scopeA, firstA.testAnswer, 1_002), { ok: false, code: 'invalid' })
    assert.deepEqual(await submit(store, firstB, scopeB, firstB.testAnswer, 1_002), { ok: true })
    assert.deepEqual(await submit(store, refreshedA, scopeA, refreshedA.testAnswer, 1_002), { ok: true })
  })

  it('keeps two mounted form scopes valid independently', async () => {
    const store = new MemoryChallengeStore()
    const formA = await issue(store, scopeA)
    const formB = await issue(store, scopeB)
    assert.ok(formA.testAnswer)
    assert.ok(formB.testAnswer)

    const results = await Promise.all([
      submit(store, formA, scopeA),
      submit(store, formB, scopeB),
    ])

    assert.deepEqual(results, [{ ok: true }, { ok: true }])
  })

  it('a wrong answer consumes only its own challenge', async () => {
    const store = new MemoryChallengeStore()
    const formA = await issue(store, scopeA)
    const formB = await issue(store, scopeB)
    assert.ok(formA.testAnswer)
    assert.ok(formB.testAnswer)

    assert.deepEqual(await submit(store, formA, scopeA, 'ZZZZ'), { ok: false, code: 'invalid' })
    assert.deepEqual(await submit(store, formA, scopeA, formA.testAnswer, 1_002), { ok: false, code: 'invalid' })
    assert.deepEqual(await submit(store, formB, scopeB, formB.testAnswer, 1_002), { ok: true })
  })

  it('rejects expired and tampered tokens and consumes an identifiable tampered challenge', async () => {
    const expiredStore = new MemoryChallengeStore()
    const expired = await issue(expiredStore, scopeA, 1_000)
    assert.ok(expired.testAnswer)
    assert.deepEqual(await submit(expiredStore, expired, scopeA, expired.testAnswer, 301_001), {
      ok: false,
      code: 'expired',
    })

    const tamperedStore = new MemoryChallengeStore()
    const challenge = await issue(tamperedStore, scopeA, 2_000)
    assert.ok(challenge.testAnswer)
    const [payload, signature] = challenge.token.split('.')
    const tampered = { ...challenge, token: `${payload}.${signature}x` }
    assert.deepEqual(await submit(tamperedStore, tampered, scopeA, challenge.testAnswer, 2_001), {
      ok: false,
      code: 'invalid',
    })
    assert.deepEqual(await submit(tamperedStore, challenge, scopeA, challenge.testAnswer, 2_002), {
      ok: false,
      code: 'invalid',
    })
  })

  it('consumes the current challenge when a parseable payload is tampered but retains cid and scope', async () => {
    const store = new MemoryChallengeStore()
    const challenge = await issue(store, scopeA, 2_000)
    assert.ok(challenge.testAnswer)
    const [encodedPayload, signature] = challenge.token.split('.')
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'))
    payload.n = `${payload.n}tampered`
    const tamperedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const tampered = { ...challenge, token: `${tamperedPayload}.${signature}` }

    assert.deepEqual(await submit(store, tampered, scopeA, challenge.testAnswer, 2_001), {
      ok: false,
      code: 'invalid',
    })
    assert.equal(store.consumeRecords.at(-1)?.tokenHash, null)
    assert.deepEqual(await submit(store, challenge, scopeA, challenge.testAnswer, 2_002), {
      ok: false,
      code: 'invalid',
    })
  })

  it('binds scope into the signed token and exposes no plaintext answer to the browser or store', async () => {
    const store = new MemoryChallengeStore()
    const challenge = await issue(store, scopeA)
    assert.ok(challenge.testAnswer)

    for (const value of [challenge.svg, challenge.token, String(challenge.expiresAt)]) {
      assert.equal(value.includes(challenge.testAnswer), false)
    }
    assert.doesNotMatch(challenge.svg, /<text\b/i)
    assert.match(challenge.svg, /<path\b/i)
    const payload = JSON.parse(Buffer.from(challenge.token.split('.')[0], 'base64url').toString('utf8'))
    assert.equal(payload.scope, scopeA)
    assert.equal(JSON.stringify(payload).includes(challenge.testAnswer), false)
    assert.equal(JSON.stringify(store.issueRecords).includes(challenge.testAnswer), false)
    assert.doesNotMatch(JSON.stringify(store.issueRecords), /answer|secret/i)
  })

  it('normalizes answer case and whitespace before the one atomic consume', async () => {
    const store = new MemoryChallengeStore()
    const challenge = await issue(store, scopeA)
    assert.ok(challenge.testAnswer)

    assert.deepEqual(
      await submit(store, challenge, scopeA, ` ${challenge.testAnswer.toLowerCase()} `),
      { ok: true },
    )
    assert.equal(store.consumeRecords.length, 1)
  })

  it('uses the service role only inside the Supabase RPC store adapter', async () => {
    const calls: Array<{ url: string; headers: Headers; body: Record<string, unknown> }> = []
    const fakeFetch: typeof fetch = async (input, init) => {
      calls.push({
        url: String(input),
        headers: new Headers(init?.headers),
        body: JSON.parse(String(init?.body)),
      })
      return Response.json(true)
    }
    const createSupabaseCaptchaStore = captchaFunction<CreateSupabaseCaptchaStore>('createSupabaseCaptchaStore')
    const store = createSupabaseCaptchaStore({
      supabaseUrl: 'https://example.supabase.co',
      serviceRoleKey: 'server-only-service-role-key',
      fetch: fakeFetch,
    })
    const record: StoreRecord = {
      tenantId,
      siteScopeHash: 'site-hash',
      formScopeHash: 'scope-hash',
      challengeHash: 'challenge-hash',
      tokenHash: 'token-hash',
      expiresAt: 301_000,
      now: 1_000,
    }

    await store.issue(record)
    assert.equal(await store.consume(record), true)

    assert.match(calls[0].url, /\/rest\/v1\/rpc\/issue_inquiry_captcha_challenge$/)
    assert.match(calls[1].url, /\/rest\/v1\/rpc\/consume_inquiry_captcha_challenge$/)
    assert.equal(calls[0].headers.get('authorization'), 'Bearer server-only-service-role-key')
    assert.equal(calls[0].headers.get('apikey'), 'server-only-service-role-key')
    assert.doesNotMatch(JSON.stringify(calls.map(({ body }) => body)), /answer|secret/i)
  })

  it('requires a secret with at least 32 characters', async () => {
    const store = new MemoryChallengeStore()
    await assert.rejects(
      issueCaptchaChallenge()({ secret: 'short', tenantId, siteScope, scope: scopeA, store, now: 1_000 }),
      /CAPTCHA_SECRET/,
    )
  })
})
