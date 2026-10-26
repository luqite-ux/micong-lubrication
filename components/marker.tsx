import { cn } from '@/lib/utils'
import { getIcon } from '@/lib/icon-map'

type MarkerProps = {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  tone?: 'dark' | 'ondark' | 'red'
  className?: string
}

const sizeClass = {
  sm: 'size-9',
  md: 'size-12',
  lg: 'size-16',
}

const toneClass = {
  dark: 'bg-charcoal text-brand-yellow',
  ondark: 'bg-white/10 text-brand-yellow ring-1 ring-inset ring-white/20',
  red: 'bg-brand-red text-white',
}

/** Unified graphic marker: square tile, yellow glyph, red corner notch. */
export function Marker({ icon, size = 'md', tone = 'dark', className }: MarkerProps) {
  const Icon = getIcon(icon)
  return (
    <span
      aria-hidden="true"
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-[3px]',
        sizeClass[size],
        toneClass[tone],
        className,
      )}
    >
      <Icon className="size-[48%]" strokeWidth={1.6} />
      <span className="absolute right-0 top-0 size-3 bg-brand-red [clip-path:polygon(0_0,100%_0,100%_100%)]" />
    </span>
  )
}
