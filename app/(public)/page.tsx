import { getPoems, getPoem } from '../actions'
import Link from 'next/link'
import { PoemArticle } from '@/components/PoemArticle'

export default async function HomePage() {
  const poems = await getPoems()

  if (poems.length === 0) {
    return (
      <div className="py-24">
        <h1 className="font-serif text-4xl mb-8 text-[var(--foreground)] italic">Welcome</h1>
        <p className="text-lg opacity-70 leading-relaxed mb-12">
          Your collection is empty. Add your first poem through the admin panel.
        </p>
        <Link 
          href="/admin" 
          className="inline-block px-6 py-3 border border-[var(--foreground)] text-[var(--foreground)] font-serif italic hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-colors"
        >
          Add a Poem
        </Link>
      </div>
    )
  }

  // Get the latest poem (first in list since we sort by createdAt desc)
  const latestPoem = await getPoem(poems[0].id)

  if (!latestPoem) {
    return null // Should handle better, but this is an edge case
  }

  return <PoemArticle poem={latestPoem} />
}
