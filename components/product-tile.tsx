import { Marker } from '@/components/marker'
import { cn } from '@/lib/utils'

type ProductTileProps = {
  icon: string
  category: 'industrial-lubricants' | 'metalworking-fluids'
  className?: string
  size?: 'card' | 'feature'
}

/**
 * Neutral family illustration. No customer photo exists for these families, so
 * the tile uses the logo droplet and the family marker instead of invented
 * packaging or product shots.
 */
export function ProductTile({ icon, category, className, size = 'card' }: ProductTileProps) {
  const industrial = category === 'industrial-lubricants'
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
        <span
          className={cn(
            'block rotate-45 rounded-[0_50%_50%_50%] bg-gradient-to-br from-brand-yellow to-brand-red',
            size === 'card' ? 'size-16' : 'size-28',
          )}
        />
        <span
          className={cn(
            'absolute rotate-45 rounded-[0_50%_50%_50%] border border-white/15',
            size === 'card' ? 'size-24' : 'size-44',
          )}
        />
      </div>
      <p className="absolute bottom-3 left-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">
        {industrial ? 'Industrial lubricants' : 'Metalworking fluids'}
      </p>
    </div>
  )
}
