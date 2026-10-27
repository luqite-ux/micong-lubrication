import Image from 'next/image'
import { Reveal } from '@/components/reveal'

const packaging = [
  { src: '/images/product-packaging-1.jpg', alt: 'Red and white steel drums from the supplied packaging photographs' },
  { src: '/images/product-packaging-2.jpg', alt: 'Black and red steel drum from the supplied packaging photographs' },
  { src: '/images/product-packaging-3.jpg', alt: 'Yellow pail from the supplied packaging photographs' },
  { src: '/images/product-packaging-6.jpg', alt: 'Blue pails from the supplied packaging photographs' },
]

export function PackagingGallery() {
  return (
    <Reveal className="overflow-hidden rounded-md border border-paper-line bg-white">
      <div className="grid grid-cols-2 gap-0.5 bg-paper-line lg:grid-cols-4">
        {packaging.map((photo) => (
          <div key={photo.src} className="relative aspect-[5/4] overflow-hidden bg-white">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain" />
          </div>
        ))}
      </div>
      <p className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
        Customer-supplied packaging photographs. The containers are unlabelled; ask us to confirm the product family, grade and pack for your order.
      </p>
    </Reveal>
  )
}
