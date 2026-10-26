'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

type RevealProps = {
  as?: ElementType
  delay?: number
  className?: string
  children: ReactNode
  id?: string
}

/**
 * Content is visible in the server HTML. After hydration, only elements that
 * start below the fold are hidden, and each one is revealed by its own
 * IntersectionObserver entry, so a section first seen after a long idle still
 * animates when it actually enters the viewport.
 */
export function Reveal({ as: Tag = 'div', delay = 0, className, children, id }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)

  useIsomorphicLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof IntersectionObserver === 'undefined') return

    const rect = el.getBoundingClientRect()
    const startsBelowFold = rect.top >= window.innerHeight * 0.92
    if (!startsBelowFold) return

    el.dataset.state = 'hidden'
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.state = 'shown'
            observer.disconnect()
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties
  return (
    <Tag ref={ref} id={id} data-reveal="" className={className} style={style}>
      {children}
    </Tag>
  )
}
