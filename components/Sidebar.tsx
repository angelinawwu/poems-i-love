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
const BG_PALETTE = [
  '#BDB297', // Beige
  '#997B5A', // Tan
  '#737437', // Sage
  '#3A1010', // Maroon
  '#757160', // Stone
  '#B76039', // Rust
  '#0B2426', // Navy
]

const TEXT_PALETTE = [
  '#332C12', // Dark Beige
  '#331700', // Dark Brown
  '#DFE5D4', // Light Green
  '#C1B6A2', // Light Red
  '#0A0E0A', // Dark Grey
  '#190606', // Dark Orange
  '#A2BBB8', // Light Blue
]

function getBgColor(id: string, index: number) {
  return BG_PALETTE[index % BG_PALETTE.length]
}

function getTextColor(id: string, index: number) {
  return TEXT_PALETTE[index % TEXT_PALETTE.length]
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
          const bgColor = getBgColor(poem.id, index)
          const textColor = getTextColor(poem.id, index)

          return (
            <motion.div
              key={poem.id}
              // Removed overflow-hidden to allow shadow to show
              className="h-full relative flex flex-row z-0 hover:z-10 transition-all"
              initial={false}
              // Removed flexGrow animation to prevent separation
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                flexBasis: 'auto', 
                flexShrink: 0, 
                minWidth: '3rem',
                // CHANGE: Remove special active z-index to maintain stack order
                // This ensures the tab to the left is always "above" the active tab, casting its shadow onto the active content
                zIndex: poems.length - index, 
              }}
            >
              {/* Content Wrapper - Mask */}
              <motion.div 
                className={`h-full relative z-20 min-w-0 overflow-hidden ${isActive && index > 0 ? '-ml-2' : ''}`}
                initial={false}
                // Animate width from 0 to auto to reveal content
                animate={{ 
                  width: isActive ? 'auto' : 0,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ backgroundColor: bgColor, color: textColor, borderColor: textColor }}
              >
                {/* Inner Fixed-Width Container */}
                <div 
                  className="h-full w-[85vw] md:w-[60vw] max-w-4xl overflow-y-auto no-scrollbar"
                  style={{ width: 'max(60vw, 600px)' }}
                >
                   <div className="p-8 md:p-16 lg:p-24 min-h-full">
                      <PoemArticle poem={poem} borderColor={textColor} />
                   </div>
                </div>

                {/* Shadow/Gradient inside the fold */}
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[rgba(0,0,0,0.05)] to-transparent pointer-events-none"></div>
              </motion.div>

              {/* The Vertical Tab Strip */}
              <Link 
                href={`/${poem.id}`} 
                className={`
                  block h-full w-14 md:w-18 border-r-[0.5px] border-[rgba(0,0,0,0.6)] relative group shrink-0 rounded-r-xl
                  ${index > 0 ? '-ml-2' : ''}
                  ${isActive ? 'cursor-default' : 'cursor-pointer hover:brightness-110 hover:w-16 md:hover:w-22 hover:-mr-2 md:hover:-mr-4'} 
                  /* Base shadow */
                  shadow-[6px_0_12px_-4px_rgba(0,0,0,0.15)]
                  /* Hover shadow with higher opacity */
                  hover:shadow-[6px_0_15px_-2px_rgba(0,0,0,0.2)]
                  transition-all duration-300 ease-out
                `}
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                 {/* Changed items-center to items-end and added padding to pin text to right */}
                 <div className="absolute inset-0 flex flex-col items-end justify-center px-2 md:px-4.5 py-4 transition-all duration-300">
                    <div className="flex-1 flex items-start justify-center w-auto overflow-hidden pt-4 pb-4">
                      <span className={`
                        vertical-text whitespace-nowrap font-serif text-lg tracking-wide transition-colors duration-300
                        
                      `}>
                        {poem.title}
                      </span>
                    </div>
                    
                    <span className="mt-auto text-[10px] font-mono opacity-70 vertical-text mb-4 uppercase tracking-wider">
                      {poem.author}
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
