'use client'

import { useCallback, useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createInquiryCaptchaScope, createLatestCaptchaRequestController } from '@/lib/inquiry-captcha-scope'

type Challenge = { svg: string; token: string; expiresAt: number }
type CaptchaFieldProps = { id: string; error?: string; refreshKey?: number }

export function CaptchaField({ id, error, refreshKey = 0 }: CaptchaFieldProps) {
  const [scope] = useState(() => createInquiryCaptchaScope())
  const [requests] = useState(() => createLatestCaptchaRequestController())
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const refresh = useCallback(async () => {
    const request = requests.begin()
    setLoading(true)
    setLoadError('')
    setChallenge(null)
    try {
      const response = await fetch(`/api/captcha?scope=${encodeURIComponent(scope)}`, { cache: 'no-store', signal: request.signal })
      if (!response.ok) throw new Error('captcha unavailable')
      const body = await response.json() as Challenge
      if (!body.svg || !body.token) throw new Error('invalid captcha response')
      if (requests.isCurrent(request)) setChallenge(body)
    } catch {
      if (requests.isCurrent(request)) setLoadError('Verification image could not load. Please try a new image.')
    } finally {
      if (requests.isCurrent(request)) setLoading(false)
    }
  }, [requests, scope])

  useEffect(() => {
    void refresh()
    return () => requests.abortCurrent()
  }, [refresh, refreshKey, requests])

  const describedBy = `${id}-help${error ? ` ${id}-error` : ''}${loadError ? ` ${id}-load-error` : ''}`
  return (
    <Field data-invalid={error || loadError ? true : undefined}>
      <FieldLabel htmlFor={id}>Verification characters <span className="text-brand-red">*</span></FieldLabel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <div className="flex items-center gap-2">
          <div className="flex h-14 w-40 items-center justify-center overflow-hidden rounded-md border border-input bg-white">
            {challenge ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(challenge.svg)}`} alt="4 character verification image" width={160} height={56} />
            ) : <span className="px-2 text-center text-xs text-ink-soft">{loading ? 'Loading…' : 'Unavailable'}</span>}
          </div>
          <button type="button" onClick={() => void refresh()} disabled={loading} aria-label="Load a new verification image" className="inline-flex size-11 items-center justify-center rounded-md border border-input bg-white text-ink disabled:opacity-50">
            <RefreshCw className="size-4" aria-hidden="true" />
          </button>
        </div>
        <input type="hidden" name="captchaScope" value={scope} />
        <input type="hidden" name="captchaToken" value={challenge?.token ?? ''} />
        <Input
          key={challenge?.token ?? refreshKey}
          id={id}
          name="captchaAnswer"
          required
          disabled={!challenge}
          maxLength={4}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          placeholder="4 characters"
          className="h-14 font-mono text-lg uppercase tracking-[0.35em] sm:max-w-44"
        />
      </div>
      <FieldDescription id={`${id}-help`}>Type the 4 characters shown in the image. Load a new image if needed.</FieldDescription>
      {error ? <FieldError id={`${id}-error`}>{error}</FieldError> : null}
      {loadError ? <FieldError id={`${id}-load-error`}>{loadError}</FieldError> : null}
    </Field>
  )
}
