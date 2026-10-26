import Link from 'next/link'
import { cn } from '@/lib/utils'

type BrandLogoProps = {
  className?: string
  imageClassName?: string
}

/** The actual supplied MICONG logo. It always links to Home and keeps its natural proportions. */
export function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label="MICONG, Shanghai Micong Lubrication Technology, go to Home"
      className={cn('inline-flex shrink-0 items-center', className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/micong-logo.jpg"
        alt="MICONG 米丛 logo"
        className={cn('h-12 w-auto object-contain sm:h-14', imageClassName)}
        style={{ aspectRatio: '1200 / 780' }}
      />
    </Link>
  )
}
