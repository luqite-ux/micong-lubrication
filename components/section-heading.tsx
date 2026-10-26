import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  tone?: 'light' | 'dark'
  action?: ReactNode
  id?: string
  className?: string
  titleStyle?: CSSProperties
  descriptionStyle?: CSSProperties
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = 'light',
  action,
  id,
  className,
  titleStyle,
  descriptionStyle,
}: SectionHeadingProps) {
  const dark = tone === 'dark'
  return (
    <Reveal className={cn('flex flex-col gap-6 md:flex-row md:items-end md:justify-between', className)}>
      <div className="max-w-2xl">
        <p
          className={cn(
            'flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]',
            dark ? 'text-brand-yellow' : 'text-brand-red',
          )}
        >
          <span aria-hidden="true" className={cn('h-0.5 w-8', dark ? 'bg-brand-yellow' : 'bg-brand-red')} />
          {eyebrow}
        </p>
        <h2
          id={id}
          style={titleStyle}
          className={cn(
            'hq-typography mt-4 text-3xl font-bold leading-tight sm:text-4xl',
            dark ? 'text-white' : 'text-ink',
          )}
        >
          {title}
        </h2>
        {description ? (
          <p style={descriptionStyle} className={cn('hq-typography mt-4 text-base leading-relaxed', dark ? 'text-white/75' : 'text-ink-soft')}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </Reveal>
  )
}
