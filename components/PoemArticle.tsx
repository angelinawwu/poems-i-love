'use client'

import { motion } from 'framer-motion'

interface PoemArticleProps {
  poem: {
    title: string
    author: string
    year: string
    content: string
  }
  borderColor?: string
}

export function PoemArticle({ poem, borderColor }: PoemArticleProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
      className="py-12 md:py-0"
    >
      <header 
        className="mb-12 pb-12 border-b" 
        style={{ borderColor: borderColor || 'var(--muted)' }}
      >
        <h1 className="font-serif text-5xl mb-6 leading-tight">
          {poem.title}
        </h1>
        <div className="flex items-center gap-6 text-sm uppercase tracking-wider opacity-70">
          {poem.author && <span>{poem.author}</span>}
          {poem.year && <span>•</span>}
          {poem.year && <span>{poem.year}</span>}
        </div>
      </header>

      <div className="prose prose-lg max-w-none">
        <pre className="font-serif text-xl leading-relaxed whitespace-pre-wrap opacity-90 font-normal">
          {poem.content}
        </pre>
      </div>
    </motion.article>
  )
}
