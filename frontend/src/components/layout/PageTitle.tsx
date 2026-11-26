import type { ReactNode } from 'react'

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className="mt-1 mb-3.5 text-[26px] font-extrabold tracking-tight text-primary">{children}</h1>
}
