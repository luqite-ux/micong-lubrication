'use client'

import { useActionState, useEffect, useId, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import { submitRfq } from '@/app/contact/actions'
import { CaptchaField } from '@/components/captcha-field'
import { RfqErrorSummary, RfqNotice } from '@/components/rfq-status'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { rfqInitialState } from '@/lib/rfq'
import { cn } from '@/lib/utils'

export type RfqFamilyOption = {
  slug: string
  name: string
  category: 'industrial-lubricants' | 'metalworking-fluids'
  grades: string[] | null
}

type RfqFormProps = {
  families: RfqFamilyOption[]
  defaultFamily?: string
  defaultGrade?: string
  defaultTopic?: string
}

const topicMessages: Record<string, string> = {
  oem: 'I would like to discuss OEM cooperation.',
  packaging: 'I would like to discuss packaging customization. Pack type: ',
  sample: 'I would like to request a sample.',
  datasheet: 'I would like to request the technical data sheet.',
}

const selectClass =
  'border-input bg-white text-ink h-11 w-full rounded-md border px-3 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-destructive/20 disabled:cursor-not-allowed disabled:bg-paper-2 disabled:opacity-70 md:text-sm'

function Required() {
  return (
    <span className="text-brand-red" aria-hidden="true">
      *
    </span>
  )
}

export function RfqForm({ families, defaultFamily, defaultGrade, defaultTopic }: RfqFormProps) {
  const prefix = useId().replace(/:/g, '')
  const [state, formAction, pending] = useActionState(submitRfq, rfqInitialState)
  const summaryRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)
  const [family, setFamily] = useState(state.values.family ?? defaultFamily ?? '')

  useEffect(() => {
    if (state.status === 'invalid') summaryRef.current?.focus()
    if (state.status !== 'idle') setCaptchaRefreshKey((current) => current + 1)
    if (state.status === 'success') formRef.current?.reset()
  }, [state])

  const selected = families.find((item) => item.slug === family)
  const gradeOptions = selected?.grades ?? null
  const values = state.values
  const errors = state.fieldErrors
  const id = (name: string) => `${prefix}-${name}`
  const aria = (name: keyof typeof errors) => ({
    'aria-invalid': errors[name] ? true : undefined,
    'aria-describedby': errors[name] ? `${id(name)}-error` : undefined,
  })

  const initialMessage = (defaultTopic && topicMessages[defaultTopic]) ?? ''

  return (
    <form ref={formRef} action={formAction} noValidate aria-busy={pending} className="grid gap-8">
      {state.status === 'invalid' ? <RfqErrorSummary ref={summaryRef} errors={errors} idPrefix={prefix} /> : null}
      {state.status === 'unavailable' && state.message ? <RfqNotice kind="unavailable" message={state.message} /> : null}
      {state.status === 'success' && state.message ? <RfqNotice kind="success" message={state.message} /> : null}
      {state.status === 'error' && state.message ? <RfqNotice kind="error" message={state.message} /> : null}

      <FieldSet>
        <FieldLegend>About you</FieldLegend>
        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor={id('name')}>
              Your name <Required />
            </FieldLabel>
            <Input
              id={id('name')}
              name="name"
              autoComplete="name"
              defaultValue={values.name}
              aria-required="true"
              className="h-11"
              {...aria('name')}
            />
            {errors.name ? <FieldError id={`${id('name')}-error`}>{errors.name}</FieldError> : null}
          </Field>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor={id('email')}>
              Work email <Required />
            </FieldLabel>
            <Input
              id={id('email')}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={values.email}
              aria-required="true"
              className="h-11"
              {...aria('email')}
            />
            {errors.email ? <FieldError id={`${id('email')}-error`}>{errors.email}</FieldError> : null}
          </Field>
          <Field data-invalid={errors.company ? true : undefined}>
            <FieldLabel htmlFor={id('company')}>
              Company <Required />
            </FieldLabel>
            <Input
              id={id('company')}
              name="company"
              autoComplete="organization"
              defaultValue={values.company}
              aria-required="true"
              className="h-11"
              {...aria('company')}
            />
            {errors.company ? <FieldError id={`${id('company')}-error`}>{errors.company}</FieldError> : null}
          </Field>
          <Field data-invalid={errors.phone ? true : undefined}>
            <FieldLabel htmlFor={id('phone')}>
              Phone <span className="font-normal text-ink-soft">(optional)</span>
            </FieldLabel>
            <Input
              id={id('phone')}
              name="phone"
              type="tel"
              autoComplete="tel"
              defaultValue={values.phone}
              className="h-11"
              {...aria('phone')}
            />
            {errors.phone ? <FieldError id={`${id('phone')}-error`}>{errors.phone}</FieldError> : null}
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>What you need</FieldLegend>
        <FieldGroup className="grid gap-5 sm:grid-cols-2">
          <Field data-invalid={errors.family ? true : undefined}>
            <FieldLabel htmlFor={id('family')}>
              Product family <Required />
            </FieldLabel>
            <select
              id={id('family')}
              name="family"
              value={family}
              onChange={(event) => setFamily(event.target.value)}
              aria-required="true"
              className={selectClass}
              {...aria('family')}
            >
              <option value="">Select a product family</option>
              <optgroup label="Industrial lubricants">
                {families
                  .filter((item) => item.category === 'industrial-lubricants')
                  .map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
              </optgroup>
              <optgroup label="Metalworking fluids">
                {families
                  .filter((item) => item.category === 'metalworking-fluids')
                  .map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
              </optgroup>
              <option value="not-sure">Not sure yet</option>
            </select>
            {errors.family ? <FieldError id={`${id('family')}-error`}>{errors.family}</FieldError> : null}
          </Field>

          <Field>
            <FieldLabel htmlFor={id('grade')}>
              Requested grade <span className="font-normal text-ink-soft">(optional)</span>
            </FieldLabel>
            <select
              key={family}
              id={id('grade')}
              name="grade"
              defaultValue={values.grade ?? (family === defaultFamily ? defaultGrade : undefined) ?? ''}
              disabled={!gradeOptions}
              aria-describedby={`${id('grade')}-help`}
              className={selectClass}
            >
              {gradeOptions ? (
                <>
                  <option value="">Not sure yet</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      Grade {grade}
                    </option>
                  ))}
                </>
              ) : (
                <option value="">{selected ? 'Confirmed after inquiry' : 'Choose a family first'}</option>
              )}
            </select>
            <FieldDescription id={`${id('grade')}-help`}>
              {gradeOptions
                ? 'Grades 32, 46 and 68 are listed for this family.'
                : 'Only grades listed for a family can be picked here. Others are confirmed after your inquiry.'}
            </FieldDescription>
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor={id('application')}>
              Application or equipment <span className="font-normal text-ink-soft">(optional)</span>
            </FieldLabel>
            <Input
              id={id('application')}
              name="application"
              defaultValue={values.application}
              placeholder="For example: CNC machining centre, hydraulic press"
              className="h-11"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor={id('quantity')}>
              Quantity <span className="font-normal text-ink-soft">(optional)</span>
            </FieldLabel>
            <Input
              id={id('quantity')}
              name="quantity"
              defaultValue={values.quantity}
              placeholder="For example: 2 drums, or a sample"
              className="h-11"
            />
          </Field>
          <Field data-invalid={errors.destination ? true : undefined}>
            <FieldLabel htmlFor={id('destination')}>
              Destination <Required />
            </FieldLabel>
            <Input
              id={id('destination')}
              name="destination"
              autoComplete="country-name"
              defaultValue={values.destination}
              placeholder="Country and city or port"
              aria-required="true"
              className="h-11"
              {...aria('destination')}
            />
            {errors.destination ? (
              <FieldError id={`${id('destination')}-error`}>{errors.destination}</FieldError>
            ) : null}
          </Field>

          <Field className="sm:col-span-2">
            <FieldLabel htmlFor={id('message')}>
              Message <span className="font-normal text-ink-soft">(optional)</span>
            </FieldLabel>
            <Textarea
              id={id('message')}
              name="message"
              rows={4}
              defaultValue={values.message ?? initialMessage}
              placeholder="Packaging, data sheet, sample or OEM needs"
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend>Verification</FieldLegend>
        <CaptchaField id={id('captcha')} error={errors.captcha} refreshKey={captchaRefreshKey} />
      </FieldSet>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className={cn('h-12 bg-brand-red px-8 text-white hover:bg-brand-red-deep', pending && 'opacity-90')}
        >
          {pending ? <Spinner className="size-4" /> : <Send className="size-4" aria-hidden="true" />}
          {pending ? 'Sending request' : 'Send request'}
        </Button>
        <p className="text-sm text-ink-soft">
          <Required /> Required. We use these details to reply to your request.
        </p>
      </div>
    </form>
  )
}
