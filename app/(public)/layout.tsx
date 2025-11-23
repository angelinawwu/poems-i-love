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
  const poems = await getPoems()

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[var(--background)] text-[var(--foreground)] relative">
      <PaperTexture 
        className="fixed inset-0 pointer-events-none z-11 mix-blend-multiply"
        width="100%"
        height="100%"
        colorBack="#ffffff"
        colorFront="#e3d8cc"
        contrast={0.3}
        roughness={0.24}
        fiber={0.19}
        fiberSize={0.19}
        crumples={0.5}
        crumpleSize={0.03}
        folds={0}
        foldCount={15}
        drops={0}
        fade={0}
        seed={0}
        scale={0.5}
        fit="cover"
      />
      <div className="relative z-10 flex flex-col md:flex-row w-full">
        <MobileNav poems={poems} />
        <Sidebar poems={poems} />
        <main className="flex-1 p-8 md:p-16 lg:p-24 max-w-3xl mx-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  )
}

