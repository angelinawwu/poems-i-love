import { getPoems } from '../actions'
import { Sidebar } from '@/components/Sidebar'
import { PaperTexture } from '@paper-design/shaders-react';

export const dynamic = 'force-dynamic'

export default async function PublicLayout({
  children: _children,
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
    <div className="flex min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">
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
      
      {/* Sidebar handles both mobile (vertical accordion) and desktop (horizontal accordion) */}
      <div className="w-full relative z-10">
        <Sidebar poems={sidebarPoems} />
      </div>
    </div>
  )
}
