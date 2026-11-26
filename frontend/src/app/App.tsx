import { Toaster } from '@/components/ui/sonner'
import { CamasPage } from '@/features/camas'

export function App() {
  return (
    <>
      <CamasPage />
      <Toaster position="bottom-center" offset={92} />
    </>
  )
}
