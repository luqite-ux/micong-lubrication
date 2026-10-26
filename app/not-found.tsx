import Link from '@/components/localized-link'
import { PageHero } from '@/components/page-hero'

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="This page does not exist."
        description="The link may be old or mistyped. Start from the product families or send us your requirement."
      />
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-14 sm:flex-row sm:px-6">
        <Link
          href="/"
          className="inline-flex h-12 items-center justify-center rounded-md bg-charcoal px-6 text-base font-semibold text-white transition-colors hover:bg-charcoal-3"
        >
          Back to Home
        </Link>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-md border border-charcoal px-6 text-base font-semibold text-charcoal transition-colors hover:bg-charcoal hover:text-white"
        >
          Browse products
        </Link>
      </div>
    </>
  )
}
