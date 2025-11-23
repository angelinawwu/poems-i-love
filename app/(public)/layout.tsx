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

  // Cast poems to ensure types match
  const sidebarPoems = poems.map(p => ({
    ...p,
    year: p.year || '', 
    content: p.content || ''
  }))

  return (
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      <PaperTexture 
        className="fixed inset-0 pointer-events-none z-[60] mix-blend-multiply"
        width="100%"
        height="100%"
        colorBack="#ffffff"
        colorFront="#e3d8cc"
        contrast={0.5}
        roughness={0.5}
        fiber={0.05}
        fiberSize={0.19}
        crumples={0.5}
        crumpleSize={0.02}
        folds={0}
        foldCount={15}
        drops={0}
        fade={0}
        seed={0}
        scale={0.5}
        fit="cover"
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
