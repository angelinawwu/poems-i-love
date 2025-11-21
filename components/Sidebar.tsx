'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PoemSummary {
  id: string
  title: string
  author: string
}

export function Sidebar({ poems }: { poems: PoemSummary[] }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen sticky top-0 border-r border-[var(--muted)] bg-[var(--background)] p-8 flex flex-col overflow-y-auto hidden md:flex">
      <Link href="/" className="mb-12 block">
        <h1 className="text-3xl font-serif hover:opacity-80 transition-opacity text-[var(--foreground)]">
          poems i love
        </h1>
      </Link>
      
      <nav className="space-y-6">
        {poems.map(poem => {
          const isActive = pathname === `/${poem.id}`
          return (
            <Link key={poem.id} href={`/${poem.id}`} className="block group">
              <motion.div 
                className={`transition-colors ${isActive ? 'text-[var(--accent)]' : 'text-[var(--foreground)] opacity-70 hover:opacity-100'}`}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className="font-serif text-lg block leading-tight mb-1">{poem.title}</span>
                <span className="text-xs uppercase tracking-wider opacity-60">{poem.author}</span>
              </motion.div>
            </Link>
          )
        })}
      </nav>
      
      <div className="fixed bottom-0 left-0 bg-[var(--background)] flex justify-left w-64 p-8 border-t border-[var(--muted)]">
        <Link href="/admin" className="text-xs opacity-40 hover:opacity-100 transition-opacity font-sans tracking-widest uppercase">
          Admin Access
        </Link>
      </div>
    </aside>
  )
}

