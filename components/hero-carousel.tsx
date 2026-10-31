'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import Image from 'next/image'
import Link from '@/components/localized-link'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'
import { heroSlides as defaultHeroSlides, type HeroSlide } from '@/lib/hero-slides'
import { siteTypographyStyle } from '@/lib/site-content/typography'
import type { SiteSnapshot } from '@/lib/site-content/transport'

const INTERVAL = 8000
const SWIPE_DISTANCE = 48

export function HeroCarousel({ slides = defaultHeroSlides, styles }: { slides?: HeroSlide[]; styles?: SiteSnapshot['pages'][number]['modules'][number]['styles'] }) {
  const [index, setIndex] = useState(0)
  const [userPlaying, setUserPlaying] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [focusWithin, setFocusWithin] = useState(false)
  const [inView, setInView] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const rootRef = useRef<HTMLElement>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const heroSlides = slides.length ? slides : defaultHeroSlides
  const count = heroSlides.length
  const go = useCallback((next: number) => setIndex((next + count) % count), [count])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setReducedMotion(query.matches)
      if (query.matches) setUserPlaying(false)
    }
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === 'visible')
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const running = userPlaying && !reducedMotion && !hovering && !focusWithin && inView && pageVisible

  useEffect(() => {
    if (!running) return
    const timer = window.setTimeout(() => go(index + 1), INTERVAL)
    return () => window.clearTimeout(timer)
  }, [running, index, go])

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      go(index - 1)
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      go(index + 1)
    }
  }

  const onTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const touch = event.changedTouches[0]
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.4) {
      go(dx < 0 ? index + 1 : index - 1)
    }
  }

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="MICONG highlights"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusWithin(false)
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className="relative bg-[#06070a] text-white"
    >
      <h1 className="sr-only">MICONG industrial lubricants and metalworking fluids, Shanghai</h1>

      <div className="hero-stage-lg grid">
        {heroSlides.map((slide, i) => {
          const active = i === index
          const Heading = 'p'
          const copyRight = slide.copySide === 'right'
          return (
            <div
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.sceneLabel}`}
              data-active={active}
              aria-hidden={!active}
              inert={!active}
              className="hero-slide relative col-start-1 row-start-1 flex flex-col xl:block xl:h-full"
              style={
                {
                  '--pos-m': slide.position.mobile,
                  '--pos-t': slide.position.tablet,
                  '--pos-d': slide.position.desktop,
                } as CSSProperties
              }
            >
              <div
                className={cn(
                  'relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[2.2/1]',
                  '[mask-image:linear-gradient(to_bottom,black_72%,transparent)] xl:[mask-image:none]',
                  slide.desktopWrapClass,
                )}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  sizes="100vw"
                  className={cn('hero-img object-cover', slide.desktopFit === 'contain' && 'xl:object-contain', slide.mobileSrc && 'hidden xl:block')}
                />
                {slide.mobileSrc ? <Image
                  src={slide.mobileSrc}
                  alt={slide.mobileAlt || slide.alt}
                  fill
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : undefined}
                  sizes="100vw"
                  className="hero-img object-cover xl:hidden"
                /> : null}
              </div>

              <div
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-y-0 hidden w-[55%] xl:block',
                  copyRight
                    ? 'right-0 bg-gradient-to-l from-[#06070a]/85 via-[#06070a]/45 to-transparent'
                    : 'left-0 bg-gradient-to-r from-[#06070a]/85 via-[#06070a]/45 to-transparent',
                )}
              />

              <div className={cn('relative z-10 -mt-6 px-4 pb-6 sm:px-6 xl:absolute xl:inset-0 xl:mt-0 xl:flex xl:items-center xl:pb-0', copyRight && 'xl:justify-end')}>
                <div className="hero-copy mx-auto w-full max-w-7xl xl:px-6">
                  <div className="max-w-[30rem] xl:max-w-[29rem]">
                    <p
                      style={{ '--i': 0, ...siteTypographyStyle(styles,`slides.${slide.id}.eyebrow`,{'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'}) } as CSSProperties}
                      className="hq-typography flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow"
                    >
                      <span aria-hidden="true" className="h-0.5 w-8 shrink-0 bg-brand-yellow" />
                      {slide.eyebrow}
                    </p>
                    <Heading
                      style={{ '--i': 1, ...siteTypographyStyle(styles,`slides.${slide.id}.title`,{'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'}) } as CSSProperties}
                      className="hq-typography mt-4 font-display text-[1.75rem] font-extrabold leading-[1.12] text-white sm:text-4xl xl:text-[42px]"
                    >
                      {slide.title}
                    </Heading>
                    <p
                      style={{ '--i': 2, ...siteTypographyStyle(styles,`slides.${slide.id}.body`,{'site-sans':'var(--font-plex)','site-display':'var(--font-archivo)'}) } as CSSProperties}
                      className="hq-typography mt-4 text-[15px] leading-relaxed text-white/85 sm:text-base"
                    >
                      {slide.body}
                    </p>
                    <div style={{ '--i': 3 } as CSSProperties} className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={slide.primary.href}
                        className="inline-flex h-12 items-center rounded-md bg-brand-red px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-red-deep"
                      >
                        {slide.primary.label}
                      </Link>
                      <Link
                        href={slide.secondary.href}
                        className="inline-flex h-12 items-center rounded-md border border-white/45 px-6 text-sm font-semibold text-white transition-colors hover:border-brand-yellow hover:text-brand-yellow"
                      >
                        {slide.secondary.label}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#06070a] xl:absolute xl:inset-x-0 xl:bottom-0 xl:border-0 xl:bg-transparent">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between xl:py-6">
          <div role="group" aria-label="Choose scene" className="grid grid-cols-3 gap-3 md:w-[34rem]">
            {heroSlides.map((slide, i) => {
              const active = i === index
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Show scene ${i + 1}: ${slide.sceneLabel}`}
                  aria-current={active}
                  className="group flex min-h-11 flex-col justify-end gap-2 text-left"
                >
                  <span
                    className={cn(
                      'text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors sm:text-xs',
                      active ? 'text-white' : 'text-white/60 group-hover:text-white',
                    )}
                  >
                    <span className="mr-1.5 text-brand-yellow">{String(i + 1).padStart(2, '0')}</span>
                    {slide.sceneLabel}
                  </span>
                  <span className="relative block h-[3px] w-full overflow-hidden bg-white/25">
                    {active ? (
                      running ? (
                        <span
                          key={`${index}-run`}
                          className="hero-progress-fill absolute inset-0 bg-brand-yellow"
                          style={{ '--hero-interval': `${INTERVAL}ms` } as CSSProperties}
                        />
                      ) : (
                        <span className="absolute inset-0 bg-brand-yellow" />
                      )
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between gap-4 md:justify-end">
            <p className="text-xs text-white/60">Illustrative imagery, not a MICONG site photo.</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => go(index - 1)}
                aria-label="Previous scene"
                className="inline-flex size-11 items-center justify-center rounded-md border border-white/30 text-white hover:border-brand-yellow hover:text-brand-yellow"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
              {reducedMotion ? null : (
                <button
                  type="button"
                  onClick={() => setUserPlaying((value) => !value)}
                  aria-label={userPlaying ? 'Pause autoplay' : 'Start autoplay'}
                  className="inline-flex size-11 items-center justify-center rounded-md border border-white/30 text-white hover:border-brand-yellow hover:text-brand-yellow"
                >
                  {userPlaying ? (
                    <Pause className="size-4" aria-hidden="true" />
                  ) : (
                    <Play className="size-4" aria-hidden="true" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={() => go(index + 1)}
                aria-label="Next scene"
                className="inline-flex size-11 items-center justify-center rounded-md border border-white/30 text-white hover:border-brand-yellow hover:text-brand-yellow"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live={running ? 'off' : 'polite'}>
        {`Scene ${index + 1} of ${count}: ${heroSlides[index].sceneLabel}`}
      </p>
    </section>
  )
}
