export const clamp = (min: number, num: number, max: number): number =>
  Math.min(Math.max(num, min), max);