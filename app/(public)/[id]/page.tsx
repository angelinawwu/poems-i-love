import { getPoem, getPoems } from '../../actions'
import { notFound } from 'next/navigation'
import { motion } from 'framer-motion'

export async function generateStaticParams() {
  const poems = await getPoems()
  return poems.map((poem) => ({
    id: poem.id,
  }))
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const poem = await getPoem(id)

  if (!poem) {
    notFound()
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.215, 0.61, 0.355, 1] }}
      className="py-24"
    >
      <header className="mb-16 pb-12 border-b border-[var(--muted)]">
        <h1 className="font-serif text-5xl mb-6 text-[var(--foreground)] leading-tight">
          {poem.title}
        </h1>
        <div className="flex items-center gap-6 text-sm uppercase tracking-wider opacity-60">
          {poem.author && <span>{poem.author}</span>}
          {poem.year && <span>•</span>}
          {poem.year && <span>{poem.year}</span>}
        </div>
      </header>
      
      <div className="prose prose-lg max-w-none">
        <pre className="font-serif text-xl leading-relaxed whitespace-pre-wrap text-[var(--foreground)] opacity-90 font-normal">
          {poem.content}
        </pre>
      </div>
    </motion.article>
  )
}

