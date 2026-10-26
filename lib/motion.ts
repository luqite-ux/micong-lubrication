/** Stagger is capped so long grids never wait more than ~350ms. */
export function stagger(index: number, step = 70, cap = 5) {
  return Math.min(index, cap) * step
}
