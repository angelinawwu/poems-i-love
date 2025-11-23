'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PoemArticle } from './PoemArticle'

interface Poem {
  id: string
  title: string
  author: string
  year: string
  content: string
}

// Muted folder palette
const PALETTE = [
  '#e6e2d3', // Sage-ish beige
  '#dcdcdc', // Light Grey
  '#e0d6c2', // Tan
  '#d4cfc5', // Stone
  '#c7c2b6', // Taupe
  '#e6e6e6', // White-ish
]

function getFolderColor(id: string, index: number) {
  return PALETTE[index % PALETTE.length]
}

export function Sidebar({ poems }: { poems: Poem[] }) {
  const pathname = usePathname()
  
  // Determine active ID
  let activeId = ''
  if (pathname === '/' && poems.length > 0) {
    activeId = poems[0].id
  } else if (pathname) {
    activeId = pathname.substring(1) // remove leading slash
  }

  return (
    <>
      {/* Accordion Container */}
      <nav className="flex flex-row w-full h-screen overflow-x-auto overflow-y-hidden bg-[#f0ebe0] relative z-10 no-scrollbar">
        {poems.map((poem, index) => {
          const isActive = poem.id === activeId
          const color = getFolderColor(poem.id, index)
          
          return (
            <motion.div
              key={poem.id}
              // Removed overflow-hidden to allow shadow to show
              className="h-full relative flex flex-row z-0 hover:z-10 transition-all"
              initial={false}
              // Removed flexGrow animation to prevent separation
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                flexBasis: 'auto', 
                flexShrink: 0, 
                minWidth: '3rem',
                // Ensure active item is on top so its shadow/content isn't clipped by neighbor
                zIndex: isActive ? 20 : index,
              }}
            >
              {/* Content Wrapper - Mask */}
              <motion.div 
                className="h-full bg-[var(--background)] relative z-20 min-w-0 overflow-hidden"
                initial={false}
                // Animate width from 0 to auto to reveal content
                animate={{ 
                  width: isActive ? 'auto' : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Inner Fixed-Width Container */}
                <div 
                  className="h-full w-[85vw] md:w-[60vw] max-w-4xl overflow-y-auto no-scrollbar"
                  style={{ width: 'max(60vw, 600px)' }}
                >
                   <div className="p-8 md:p-16 lg:p-24 min-h-full">
                      <PoemArticle poem={poem} />
                   </div>
                </div>

                {/* Shadow/Gradient inside the fold */}
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[rgba(0,0,0,0.05)] to-transparent pointer-events-none"></div>
              </motion.div>

              {/* The Vertical Tab Strip */}
              <Link 
                href={`/${poem.id}`} 
                className={`
                  block h-full w-12 md:w-16 border-l border-[rgba(0,0,0,0.05)] relative group shrink-0
                  ${isActive ? 'cursor-default' : 'cursor-pointer hover:brightness-95 hover:w-14 md:hover:w-20'} 
                  shadow-[6px_0_12px_-4px_rgba(0,0,0,0.15)]
                  transition-all duration-300 ease-out
                `}
                style={{ backgroundColor: color }}
              >
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                 {/* Changed items-center to items-end and added padding to pin text to right */}
                 <div className="absolute inset-0 flex flex-col items-end justify-center px-2 md:px-4.5 py-4 transition-all duration-300 rounded-lg">
                    <div className="flex-1 flex items-start justify-center w-auto overflow-hidden pt-4 pb-4">
                      <span className={`
                        vertical-text whitespace-nowrap font-serif text-lg tracking-wide transition-colors duration-300
                        ${isActive ? 'text-[var(--foreground)]' : 'text-[rgba(0,0,0,0.6)]'}
                      `}>
                        {poem.title}
                      </span>
                    </div>
                    
                    <span className="mt-auto text-[10px] font-mono opacity-40 vertical-text mb-4">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                 </div>
              </Link>
            </motion.div>
          )
        })}

        {/* Floating Admin Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <Link 
            href="/admin" 
            className="w-10 h-10 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform opacity-20 hover:opacity-100"
            title="Admin Access"
          >
            <Settings size={16} />
          </Link>
        </div>
      </nav>
    </>
  )
}
