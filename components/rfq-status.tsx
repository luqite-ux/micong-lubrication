import { forwardRef } from 'react'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { company } from '@/lib/site-config'
import { rfqFieldLabels, type RfqFieldErrors, type RfqFieldName } from '@/lib/rfq'
import { cn } from '@/lib/utils'

type NoticeKind = 'success' | 'error' | 'unavailable'

const noticeStyles: Record<NoticeKind, { box: string; icon: string; title: string; Icon: typeof Info }> = {
  success: {
    box: 'border-charcoal bg-charcoal text-white',
    icon: 'text-brand-yellow',
    title: 'Request received',
    Icon: CheckCircle2,
  },
  error: {
    box: 'border-brand-red bg-red-50 text-ink',
    icon: 'text-brand-red',
    title: 'The request could not be sent',
    Icon: XCircle,
  },
  unavailable: {
    box: 'border-brand-yellow bg-amber-50 text-ink',
    icon: 'text-amber-700',
    title: 'Online delivery is not connected yet',
    Icon: Info,
  },
}

export function RfqNotice({
  kind,
  message,
  className,
}: {
  kind: NoticeKind
  message: string
  className?: string
}) {
  const style = noticeStyles[kind]
  const Icon = style.Icon
  return (
    <div
      role={kind === 'success' ? 'status' : 'alert'}
      className={cn('flex gap-4 rounded-md border-l-4 p-5', style.box, className)}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', style.icon)} aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        <p className="text-base font-semibold">{style.title}</p>
        <p className={cn('mt-1', kind === 'success' && 'text-white/85')}>{message}</p>
        {kind !== 'success' ? (
          <p className="mt-3 font-medium">
            <a className="underline underline-offset-4" href={company.emailHref}>
              {company.email}
            </a>
            <span aria-hidden="true"> · </span>
            <a className="underline underline-offset-4" href={company.phoneHref}>
              {company.phone}
            </a>
          </p>
        ) : null}
      </div>
    </div>
  )
}

export const RfqErrorSummary = forwardRef<HTMLDivElement, { errors: RfqFieldErrors; idPrefix: string }>(
  function RfqErrorSummary({ errors, idPrefix }, ref) {
    const entries = Object.entries(errors) as [RfqFieldName, string][]
    if (entries.length === 0) return null
    return (
      <div
        ref={ref}
        tabIndex={-1}
        role="alert"
        className="rounded-md border-l-4 border-brand-red bg-red-50 p-5 text-ink outline-none"
      >
        <p className="flex items-center gap-2 text-base font-semibold">
          <AlertTriangle className="size-5 text-brand-red" aria-hidden="true" />
          {entries.length === 1 ? 'One field needs attention' : `${entries.length} fields need attention`}
        </p>
        <ul className="mt-3 grid gap-1 text-sm">
          {entries.map(([field, message]) => (
            <li key={field}>
              <a className="underline underline-offset-4" href={`#${idPrefix}-${field}`}>
                {rfqFieldLabels[field]}
              </a>
              : {message}
            </li>
          ))}
        </ul>
      </div>
    )
  },
)
