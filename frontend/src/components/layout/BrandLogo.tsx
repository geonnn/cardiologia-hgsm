import type { SVGProps } from 'react'

/** Trazo de electrocardiograma del logo del servicio. Usa `currentColor`. */
export function BrandLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 34" fill="none" stroke="currentColor" strokeWidth={3} aria-hidden="true" {...props}>
      <path d="M2 20h9l5-17 6 28 5-11h11" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
