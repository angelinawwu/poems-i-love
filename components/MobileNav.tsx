'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PoemSummary {
  id: string
  title: string
  author: string
}

export function MobileNav({ poems }: { poems: PoemSummary[] }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="md:hidden p-6 flex justify-between items-center sticky top-0 bg-[var(--background)] z-40 border-b border-[var(--muted)]">
        <Link href="/" className="font-serif italic text-xl text-[var(--foreground)]">
          poems i love
        </Link>
        <button onClick={() => setIsOpen(true)} aria-label="Open menu">
          <Menu className="w-6 h-6 text-[var(--foreground)] opacity-70" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[var(--background)] z-50 flex flex-col p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-serif italic text-xl text-[var(--muted)]">menu</span>
              <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                <X className="w-6 h-6 text-[var(--foreground)] opacity-70" />
              </button>
            </div>
            
            <nav className="space-y-8">
               {poems.map(p => (
                 <Link 
                   key={p.id} 
                   href={`/${p.id}`} 
                   onClick={() => setIsOpen(false)} 
                   className="block group"
                 >
                   <span className="font-serif text-3xl block mb-2 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                     {p.title}
                   </span>
                   <span className="text-sm opacity-60 uppercase tracking-wider text-[var(--foreground)]">
                     {p.author}
                   </span>
                 </Link>
               ))}
            </nav>
            
            <div className="mt-auto pt-12 pb-8">
               <Link href="/admin" className="text-xs opacity-40 uppercase tracking-widest text-[var(--foreground)]">
                 Admin Access
               </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

