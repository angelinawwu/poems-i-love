'use client'

import { useState } from 'react'
import { createPoem, checkPassword } from '../actions'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    const valid = await checkPassword(password)
    if (valid) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Incorrect password')
    }
  }

  async function handleSubmit(formData: FormData) {
    const result = await createPoem(formData)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      router.push('/')
      router.refresh()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-4">
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-6 p-8 border border-[var(--muted)]">
          <h1 className="font-serif text-2xl text-center mb-8 text-[var(--foreground)]">Admin Access</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 border-b border-[var(--muted)] bg-transparent focus:outline-none focus:border-[var(--accent)] transition-colors text-center"
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button 
            type="submit" 
            className="w-full bg-[var(--foreground)] text-[var(--background)] p-3 font-serif italic hover:opacity-90 transition-opacity"
          >
            Enter
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--background)] p-8 md:p-16 flex justify-center">
       <div className="w-full max-w-2xl">
         <h1 className="font-serif text-3xl mb-12 text-[var(--foreground)] italic">Add New Poem</h1>
         <form action={handleSubmit} className="space-y-8">
           {/* Pass password as hidden field so it's included in FormData automatically */}
           <input type="hidden" name="password" value={password} />
           
           {error && <p className="text-red-500 mb-4">{error}</p>}
           
           <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest opacity-60 block">Title</label>
             <input 
               name="title" 
               required 
               className="w-full p-3 border-b border-[var(--muted)] bg-transparent focus:outline-none focus:border-[var(--accent)] font-serif text-xl transition-colors" 
               placeholder="Poem Title"
             />
           </div>

           <div className="grid grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest opacity-60 block">Author</label>
               <input 
                 name="author" 
                 required 
                 className="w-full p-3 border-b border-[var(--muted)] bg-transparent focus:outline-none focus:border-[var(--accent)] transition-colors" 
                 placeholder="Poet Name"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs uppercase tracking-widest opacity-60 block">Year</label>
               <input 
                 name="year" 
                 className="w-full p-3 border-b border-[var(--muted)] bg-transparent focus:outline-none focus:border-[var(--accent)] transition-colors" 
                 placeholder="YYYY"
               />
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs uppercase tracking-widest opacity-60 block">Poem</label>
             <textarea 
               name="content" 
               required 
               rows={16} 
               className="w-full p-4 border border-[var(--muted)] bg-transparent focus:outline-none focus:border-[var(--accent)] font-serif leading-relaxed resize-none transition-colors text-lg" 
               placeholder="Enter the poem here..."
             />
           </div>

           <div className="flex justify-end">
             <button 
               type="submit" 
               className="px-8 py-3 bg-[var(--foreground)] text-[var(--background)] font-serif italic hover:opacity-90 transition-opacity text-lg"
             >
               Publish Poem
             </button>
           </div>
         </form>
       </div>
    </div>
  )
}
