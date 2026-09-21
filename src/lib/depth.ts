/**
 * Where each page sits in the descent. 0 is the surface (interface), 1 is the
 * bottom (silicon). Projects are placed at the layer they were actually built
 * at, which is why http.c and rust-http-server sit near the floor and the
 * agent work sits near the top.
 */

export interface Depth {
  base: number;
  range: number;
  /**
   * How loud the field is on this page, 0..1. Opacity only -- the render
   * budget is decided separately, so a page can be visible and still cheap.
   */
  strength: number;
}

/**
 * The flat single-plane surface belongs to the home page; it is the whole
 * "looks flat until you look underneath" idea. Every other page sits inside
 * the open part of the range, where the lattice reads as a volume.
 */
export const projectDepth: Record<string, number> = {
  localmate: 0.36,
  sentracker: 0.43,
  'ngx-blogdown': 0.47,
  'text-to-sql': 0.54,
  'cognitive-variance': 0.6,
  mnist: 0.64,
  'mini-retrieve': 0.72,
  'hm2-scripts': 0.76,
  'rust-http-server': 0.85,
  'http-c': 0.92,
};

/**
 * `range` is the scroll-speed control. It is how far `descent` travels across
 * a page's full scroll, and `descent` drives the camera pitch, its distance,
 * the lens, the lattice's own travel and how many layers are lit -- all at
 * once. Halve a range and the whole effect moves half as much per pixel
 * scrolled, without changing its character.
 */
export const pageDepth = {
  home: { base: 0.3, range: 0.4, strength: 1 },
  projects: { base: 0.44, range: 0.24, strength: 0.72 },
  cv: { base: 0.3, range: 0.2, strength: 0 },
  contact: { base: 0.86, range: 0.06, strength: 0.78 },
  notFound: { base: 0.58, range: 0.08, strength: 0.72 },
} satisfies Record<string, Depth>;

export function depthForProject(slug: string): Depth {
  return { base: projectDepth[slug] ?? 0.6, range: 0.1, strength: 0.66 };
}
