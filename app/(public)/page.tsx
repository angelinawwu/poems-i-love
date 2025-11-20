import { getPoems } from '../actions'
import Link from 'next/link'

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

  return (
    <div className="py-24">
      <h1 className="font-serif text-4xl mb-12 text-[var(--foreground)] italic">Poems I Love</h1>
      <p className="text-lg opacity-70 leading-relaxed mb-16 max-w-2xl">
        A collection of poems that have touched my heart and mind.
      </p>
      <div className="space-y-12">
        {poems.map((poem) => (
          <Link key={poem.id} href={`/${poem.id}`} className="block group">
            <article className="border-b border-[var(--muted)] pb-12 transition-colors group-hover:opacity-70">
              <h2 className="font-serif text-3xl mb-3 text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {poem.title}
              </h2>
              <div className="flex items-center gap-4 text-sm opacity-60 uppercase tracking-wider">
                {poem.author && <span>{poem.author}</span>}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}

