import { getPoems } from '../actions'
import { Sidebar } from '@/components/Sidebar'
import { MobileNav } from '@/components/MobileNav'
import { PaperTexture } from '@paper-design/shaders-react';

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Fetch poems with full content
  const poems = await getPoems()

  // Cast poems to ensure types match (Prisma dates might need handling if not serialized properly by Server Actions? 
  // Actually Server Actions serialize dates to strings/Dates fine usually, but Sidebar expects strings for year/content)
  // Our schema has year as String, content as String. CreatedAt is Date.
  // Sidebar interface Poem expects strings.
  // We need to map or cast.
  // Let's trust TS inference or cast if needed.
  const sidebarPoems = poems.map(p => ({
    ...p,
    // Ensure properties exist (they do from getPoems select)
    year: p.year || '', // Handle nullable if schema allows, but schema says String.
    content: p.content || ''
  }))

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      <PaperTexture 
        className="fixed inset-0 pointer-events-none z-0 mix-blend-multiply opacity-50"
        width="100%"
        height="100%"
        colorBack="#ffffff"
        colorFront="#e3d8cc"
        contrast={0.2}
        roughness={0.2}
        scale={0.5}
      />
      
      {/* Mobile Nav (Top) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
         <MobileNav poems={sidebarPoems} />
      </div>

      {/* Mobile Content Wrapper - Renders the active page content passed from routing */}
      <div className="md:hidden w-full h-screen pt-16 overflow-y-auto p-8 bg-[var(--background)] relative z-10">
        {children}
      </div>

      {/* Desktop Layout: Accordion Sidebar handles everything. Children ignored for desktop. */}
      <div className="hidden md:flex w-full h-screen relative z-10">
        <Sidebar poems={sidebarPoems} />
      </div>
    </div>
  )
}
