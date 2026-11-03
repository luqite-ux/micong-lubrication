'use client'

import Image from 'next/image'
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { dragScrollLeft, isDragGesture } from '@/lib/drag-scroll.mjs'

const packaging = [
  { src: '/images/product-packaging-jieshilong-20261102-1.jpg', alt: 'JIESHILONG black and red steel lubricant drum, front view' },
  { src: '/images/product-packaging-jieshilong-20261102-2.jpg', alt: 'JIESHILONG black and red steel lubricant drum, top view' },
  { src: '/images/product-packaging-jieshilong-20261102-3.jpg', alt: 'JIESHILONG red steel lubricant drum, front view' },
  { src: '/images/product-packaging-jieshilong-20261102-4.jpg', alt: 'JIESHILONG red steel lubricant drum, top view' },
  { src: '/images/product-packaging-jieshilong-20261102-5.jpg', alt: 'JIESHILONG red lubricant pail with carrying handle' },
  { src: '/images/product-packaging-jieshilong-20261102-6.jpg', alt: 'JIESHILONG stacked red lubricant pails' },
]

export function PackagingGallery() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, startScrollLeft: 0, distance: 0 })
  const [activePhoto, setActivePhoto] = useState<(typeof packaging)[number] | null>(null)

  const openPhoto = (photo: (typeof packaging)[number]) => {
    setActivePhoto(photo)
    dialogRef.current?.showModal()
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const scroller = scrollerRef.current
    if (!scroller) return
    dragRef.current = { startX: event.clientX, startScrollLeft: scroller.scrollLeft, distance: 0 }
    scroller.dataset.dragging = 'true'
    scroller.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller?.hasPointerCapture(event.pointerId)) return
    dragRef.current.distance = Math.max(dragRef.current.distance, Math.abs(event.clientX - dragRef.current.startX))
    scroller.scrollLeft = dragScrollLeft({
      startScrollLeft: dragRef.current.startScrollLeft,
      startX: dragRef.current.startX,
      currentX: event.clientX,
    })
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId)
    scroller.dataset.dragging = 'false'
  }

  const scrollGallery = (direction: -1 | 1) => {
    const scroller = scrollerRef.current
    if (!scroller) return
    scroller.scrollBy({ left: direction * Math.max(240, scroller.clientWidth * 0.72), behavior: 'smooth' })
  }

  return (
    <>
      <Reveal className="relative overflow-hidden rounded-md border border-paper-line bg-white">
        <div
          ref={scrollerRef}
          className="packaging-drag-scroll flex snap-x snap-mandatory overflow-x-auto"
          aria-label="MICONG packaging photographs. Drag horizontally or use the arrow buttons to browse."
          data-dragging="false"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {packaging.map((photo) => (
            <button
              key={photo.src}
              type="button"
              onClick={(event) => {
                if (isDragGesture(dragRef.current.distance)) {
                  event.preventDefault()
                  dragRef.current.distance = 0
                  return
                }
                openPhoto(photo)
              }}
              aria-label={`View photo: ${photo.alt}`}
              className="relative h-48 w-56 shrink-0 snap-start border-r border-paper-line bg-white select-none focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-brand-red sm:h-64 sm:w-72 lg:h-72 lg:w-80"
            >
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 320px, (min-width: 640px) 288px, 224px" draggable={false} className="pointer-events-none object-contain" />
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button type="button" onClick={() => scrollGallery(-1)} aria-label="Previous packaging photos" className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/92 text-charcoal shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-red"><ChevronLeft className="size-5" /></button>
          <button type="button" onClick={() => scrollGallery(1)} aria-label="Next packaging photos" className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/92 text-charcoal shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-brand-red"><ChevronRight className="size-5" /></button>
        </div>
        <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-charcoal/78 px-3 py-1 text-xs font-medium text-white shadow-sm sm:hidden">
          Swipe to explore
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
