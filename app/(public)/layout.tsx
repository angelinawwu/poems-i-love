import { getPoems } from '../actions'
import { Sidebar } from '@/components/Sidebar'
import { MobileNav } from '@/components/MobileNav'

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const poems = await getPoems()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <MobileNav poems={poems} />
      <Sidebar poems={poems} />
      <main className="flex-1 p-8 md:p-16 max-w-3xl mx-auto w-full relative">
        {children}
      </main>
    </div>
  )
}

