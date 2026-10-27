'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const packaging = [
  { src: '/images/product-packaging-1.jpg', alt: 'Red and white steel drums' },
  { src: '/images/product-packaging-2.jpg', alt: 'Black and red steel drum' },
  { src: '/images/product-packaging-3.jpg', alt: 'Yellow pail' },
  { src: '/images/product-packaging-4.jpg', alt: 'Black and yellow steel drums' },
  { src: '/images/product-packaging-5.jpg', alt: 'Rows of red steel drums' },
  { src: '/images/product-packaging-6.jpg', alt: 'Blue pails' },
  { src: '/images/product-packaging-7.jpg', alt: 'Red pail' },
  { src: '/images/product-packaging-8.jpg', alt: 'Red steel drums' },
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
        <div className="packaging-marquee overflow-hidden" aria-label="MICONG packaging photographs">
          <div className="packaging-marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="packaging-marquee-group flex shrink-0" aria-hidden={copy === 1 ? true : undefined}>
                {packaging.map((photo) => (
                  <button key={`${copy}-${photo.src}`} type="button" tabIndex={copy === 1 ? -1 : undefined} onClick={() => openPhoto(photo)} aria-label={`View photo: ${photo.alt}`} className="relative h-48 w-56 shrink-0 border-r border-paper-line bg-white focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-red sm:h-64 sm:w-72 lg:h-72 lg:w-80">
                    <Image src={photo.src} alt={copy === 1 ? '' : photo.alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px" className="object-contain" />
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <dialog ref={dialogRef} onClose={() => setActivePhoto(null)} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close() }} aria-label="Packaging photo enlarged" className="m-auto w-[min(92vw,1000px)] max-w-none rounded-md border-0 bg-white p-3 shadow-2xl backdrop:bg-charcoal/85 sm:p-5">
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close enlarged photo" className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white text-ink shadow-md focus-visible:outline-2 focus-visible:outline-brand-red"><X className="size-5" /></button>
        {activePhoto ? <div className="relative h-[min(75vh,760px)] w-full bg-white"><Image src={activePhoto.src} alt={activePhoto.alt} fill sizes="(min-width: 1024px) 1000px, 92vw" className="object-contain" /></div> : null}
        <p className="mt-3 pr-12 text-sm leading-relaxed text-ink-soft">Packaging photo; product family and grade should be confirmed before ordering.</p>
      </dialog>
    </>
  )
}
