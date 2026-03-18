'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import { useState } from 'react'
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
  
  // Desktop: determine active ID from URL
  let activeId = ''
  if (pathname === '/' && poems.length > 0) {
    activeId = poems[0].id
  } else if (pathname) {
    activeId = pathname.substring(1)
  }

  // Mobile: independent toggle state, all closed on mount
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null)

  function toggleMobile(id: string) {
    setMobileOpenId(prev => (prev === id ? null : id))
  }

  return (
    <>
      {/* Desktop: horizontal accordion with vertical tab strips */}
      <nav className="hidden lg:flex flex-row w-full h-screen overflow-x-auto overflow-y-hidden bg-[#f0ebe0] relative z-10 no-scrollbar">
        {poems.map((poem, index) => {
          const isActive = poem.id === activeId
          const bgColor = getBgColor(poem.id, index)
          const textColor = getTextColor(poem.id, index)

          return (
            <motion.div
              key={poem.id}
              className="h-full relative flex flex-row z-0 hover:z-10 transition-all"
              initial={false}
              transition={{ duration: 0.5, ease: "easeOut" }}
              style={{
                flexBasis: 'auto', 
                flexShrink: 0, 
                minWidth: '3rem',
                zIndex: poems.length - index, 
              }}
            >
              {/* Content Wrapper - Mask */}
              <motion.div 
                className={`h-full relative z-20 min-w-0 overflow-hidden ${isActive && index > 0 ? '-ml-2' : ''}`}
                initial={false}
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
                  shadow-[6px_0_12px_-4px_rgba(0,0,0,0.15)]
                  hover:shadow-[6px_0_15px_-2px_rgba(0,0,0,0.2)]
                  transition-all duration-300 ease-out
                `}
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                 <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                 <div className="absolute inset-0 flex flex-col items-end justify-center px-2 md:px-4.5 py-4 transition-all duration-300">
                    <div className="flex-1 flex items-start justify-center w-auto overflow-hidden pt-4 pb-4">
                      <span className="vertical-text whitespace-nowrap font-serif text-lg tracking-wide transition-colors duration-300">
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

      {/* Mobile: bottom-anchored accordion — tabs at bottom, content expands upward */}
      <nav className="flex lg:hidden fixed inset-0 flex-col z-10 overflow-y-auto no-scrollbar bg-[#f0ebe0]">
        {/* Header — sits behind tabs, visible when all are closed */}
        <div className="absolute inset-x-0 top-0 pt-10 text-center z-0 pointer-events-none">
          <div className="font-serif text-2xl text-[var(--foreground)]">poems i love</div>
          <div className="text-[10px] font-mono opacity-70 uppercase tracking-wider leading-snug pt-[3px]">an ongoing compendium</div>
        </div>

        {/* Spacer pushes tabs to the bottom */}
        <div className="flex-1" />

        {poems.map((poem, index) => {
          const isOpen = mobileOpenId === poem.id
          const bgColor = getBgColor(poem.id, index)
          const textColor = getTextColor(poem.id, index)

          return (
            <div
              key={poem.id}
              className="relative flex flex-col"
              style={{
                zIndex: index + 1,
                marginTop: index > 0 ? '-0.5rem' : 0,
              }}
            >
              {/* Tab */}
              <button
                onClick={() => toggleMobile(poem.id)}
                className="relative flex flex-row items-start justify-between w-full px-6 py-5 min-h-14 text-left border-t-[0.5px] border-[rgba(0,0,0,0.6)] rounded-t-xl shadow-[0_6px_12px_-4px_rgba(0,0,0,0.12)] -mb-px"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none rounded-t-xl" />
                <span className="font-serif text-lg tracking-wide relative z-10 flex-1 pr-4 leading-snug">{poem.title}</span>
                <span className="text-[10px] font-mono opacity-70 uppercase tracking-wider relative z-10 text-right shrink-0 leading-snug pt-[3px]">{poem.author}</span>
              </button>

              {/* Content — expands below the tab */}
              <motion.div
                className="overflow-hidden relative"
                initial={false}
                animate={{ height: isOpen ? 'auto' : 0 }}
                transition={{ duration: 0.8, ease: [0.455, 0.03, 0.515, 0.955] }}
                style={{ backgroundColor: bgColor, color: textColor, borderColor: textColor }}
              >
                <div className="absolute inset-0 opacity-40 mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none" />
                <div className="relative pt-2 px-6 pb-8">
                  <PoemArticle poem={poem} borderColor={textColor} />
                </div>
              </motion.div>
            </div>
          )
        })}

        {/* Admin button */}
        <div className="fixed bottom-6 right-6 z-[200]">
          <Link
            href="/admin"
            className="w-10 h-10 bg-[var(--foreground)] text-[var(--background)] rounded-full flex items-center justify-center shadow-lg opacity-20"
            title="Admin Access"
          >
            <Settings size={16} />
          </Link>
        </div>
      </nav>
    </>
  )
}
