export type HeroSlide = {
  id: string
  sceneLabel: string
  src: string
  alt: string
  mobileSrc?: string
  mobileAlt?: string
  eyebrow: string
  title: string
  body: string
  primary: { label: string; href: string }
  secondary: { label: string; href: string }
  /** Safe crops: mobile (390), tablet, desktop. Subjects stay recognisable at each size. */
  position: { mobile: string; tablet: string; desktop: string }
  /** Desktop-only wrapper placement for the image (slide 2 is moved right to free the copy side). */
  desktopWrapClass: string
  /** Which side the copy column sits on at xl. Defaults to left. */
  copySide?: 'left' | 'right'
  /** Desktop fit: 'contain' keeps the supplied image's full composition visible. */
  desktopFit?: 'cover' | 'contain'
}

/**
 * The three customer banners. They are thematic imagery, not photographs of a
 * MICONG site, and the copy never claims ownership, certification or capacity.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'range',
    sceneLabel: 'Product range',
    src: '/images/banner-1.jpg',
    alt: 'Illustrative scene: red and orange drums, clear jugs, black canisters and small pails in a dark industrial hall beside filtration equipment.',
    eyebrow: 'Industrial lubricants and metalworking fluids',
    title: 'Find the lubricant or cutting fluid you need.',
    body: 'Explore eleven product families from the customer category list. Share your equipment, grade needs and quantity for a quote or data sheet.',
    primary: { label: 'Browse products', href: '/products' },
    secondary: { label: 'Request a quote', href: '/contact#rfq' },
    position: { mobile: '100% 50%', tablet: '100% 50%', desktop: '100% 50%' },
    desktopWrapClass: 'xl:absolute xl:inset-0 xl:aspect-auto',
  },
  {
    id: 'packaging',
    sceneLabel: 'Packaging and OEM',
    src: '/images/banner-2.jpg',
    alt: 'Illustrative scene: stainless steel process tanks, a bottle filling line and a robotic arm, with red pails, bottles and small tubs in the foreground.',
    eyebrow: 'Packaging and OEM',
    title: 'Raise packaging and OEM needs in your first inquiry.',
    body: 'Packaging customization and OEM cooperation can be discussed. Tell us the pack type, quantity and destination.',
    primary: { label: 'See packaging options', href: '/#packaging' },
    secondary: { label: 'Ask about OEM', href: '/contact?topic=oem#rfq' },
    position: { mobile: '22% 60%', tablet: '20% 50%', desktop: '50% 50%' },
    desktopWrapClass: 'xl:absolute xl:inset-0 xl:aspect-auto',
    copySide: 'right',
    desktopFit: 'contain',
  },
  {
    id: 'inquiry',
    sceneLabel: 'Technical inquiry',
    src: '/images/banner-3.jpg',
    alt: 'Illustrative dusk scene: a modern glass office building with red and amber edge lighting and a long industrial building with storage tanks.',
    eyebrow: 'Technical inquiry from Shanghai',
    title: 'Send the equipment and grade. We reply with next steps.',
    body: 'MICONG is based in Pudong New Area, Shanghai. Share your application, quantity and destination, and ask for a technical data sheet.',
    primary: { label: 'Send an inquiry', href: '/contact#rfq' },
    secondary: { label: 'View applications', href: '/applications' },
    position: { mobile: '94% 50%', tablet: '100% 50%', desktop: '100% 50%' },
    desktopWrapClass: 'xl:absolute xl:inset-0 xl:aspect-auto',
  },
]
