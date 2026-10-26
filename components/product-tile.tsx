import { Marker } from '@/components/marker'
import { getIcon } from '@/lib/icon-map'
import { cn } from '@/lib/utils'

type ProductTileProps = {
  icon: string
  category: 'industrial-lubricants' | 'metalworking-fluids'
  className?: string
  size?: 'card' | 'feature'
}

/**
 * Neutral family illustration. No customer photo exists for these families, so
 * the tile uses a distinct semantic family icon instead of invented
 * packaging or product shots.
 */
export function ProductTile({ icon, category, className, size = 'card' }: ProductTileProps) {
  const industrial = category === 'industrial-lubricants'
  const FamilyIcon = getIcon(icon)
  return (
    <div
      aria-hidden="true"
      className={cn(
        'grid-lines relative isolate overflow-hidden bg-charcoal',
        size === 'card' ? 'aspect-[16/10]' : 'aspect-[4/3] md:aspect-[5/4]',
        className,
      )}
    >
      <span
        className={cn(
          'absolute bottom-0 left-0 h-1 w-1/3',
          industrial ? 'bg-brand-yellow' : 'bg-brand-red',
        )}
      />
      <div className="absolute left-5 top-5">
        <Marker icon={icon} size={size === 'card' ? 'md' : 'lg'} tone="ondark" />
      </div>
      <div className="absolute inset-y-0 right-0 flex w-1/2 items-center justify-center">
        <span className={cn('absolute rounded-full border border-white/10',size === 'card' ? 'size-28' : 'size-48')} />
        <FamilyIcon
          strokeWidth={1.35}
          className={cn('relative drop-shadow-[0_0_18px_rgba(255,184,0,0.28)]',industrial?'text-brand-yellow':'text-brand-red',size === 'card' ? 'size-20' : 'size-36')}
        />
      </div>
      <p className="absolute bottom-3 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {industrial ? 'Industrial lubricants' : 'Metalworking fluids'}
      </p>
    </div>
  )
}
