'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const packaging = [
  { src: '/images/product-packaging-1.jpg', alt: 'Red and white steel drums from the supplied packaging photographs' },
  { src: '/images/product-packaging-2.jpg', alt: 'Black and red steel drum from the supplied packaging photographs' },
  { src: '/images/product-packaging-3.jpg', alt: 'Yellow pail from the supplied packaging photographs' },
  { src: '/images/product-packaging-6.jpg', alt: 'Blue pails from the supplied packaging photographs' },
]

export function PackagingGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [activePhoto, setActivePhoto] = useState<(typeof packaging)[number] | null>(null)

  const openPhoto = (photo: (typeof packaging)[number]) => {
    setActivePhoto(photo)
    dialogRef.current?.showModal()
  }

  return (
    <>
      <Reveal className="overflow-hidden rounded-md border border-paper-line bg-white">
        <div className="grid grid-cols-2 gap-0.5 bg-paper-line lg:grid-cols-4">
          {packaging.map((photo) => (
            <button key={photo.src} type="button" onClick={() => openPhoto(photo)} aria-label={`Enlarge photo: ${photo.alt}`} className="group relative aspect-[5/4] overflow-hidden bg-white focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-red">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
              <span aria-hidden="true" className="absolute bottom-3 right-3 grid size-8 place-items-center rounded-sm bg-white/90 text-ink shadow-sm"><ZoomIn className="size-4" /></span>
            </button>
          ))}
        </div>
        <p className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
          Select a photo to enlarge it. The containers have no visible product labels; please confirm the family, grade and pack with MICONG for your order.
        </p>
      </Reveal>
      <dialog ref={dialogRef} onClose={() => setActivePhoto(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close() }} aria-label="Packaging photo enlarged" className="m-auto w-[min(92vw,1000px)] max-w-none rounded-md border-0 bg-white p-3 shadow-2xl backdrop:bg-charcoal/85 sm:p-5">
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close enlarged photo" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-md focus-visible:outline-2 focus-visible:outline-brand-red"><X className="size-5" /></button>
        {activePhoto ? <div className="relative h-[min(75vh,760px)] w-full bg-white"><Image src={activePhoto.src} alt={activePhoto.alt} fill sizes="(min-width: 1024px) 1000px, 92vw" className="object-contain" /></div> : null}
        <p className="mt-3 pr-12 text-sm leading-relaxed text-ink-soft">Packaging photo; product family and grade should be confirmed before ordering.</p>
      </dialog>
    </>
  )
}
