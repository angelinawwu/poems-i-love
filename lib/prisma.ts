import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Turso in production, local SQLite in dev
const isDev = process.env.NODE_ENV === 'development'
const connectionString = process.env.DATABASE_URL || (isDev ? `file:${path.join(process.cwd(), 'dev.db')}` : '')

// Parse connection string to handle Turso (with auth token) or local SQLite
let adapter: PrismaLibSql

if (isDev || connectionString.startsWith('file:') || !connectionString) {
  // Local SQLite (dev) or fallback during build
  const url = connectionString || `file:${path.join(process.cwd(), 'placeholder.db')}`
  adapter = new PrismaLibSql({ url })
} else {
  // Turso (production)
  try {
    const urlObj = new URL(connectionString)
    const authToken = urlObj.searchParams.get('authToken') || process.env.TURSO_AUTH_TOKEN || null
    const dbUrl = connectionString.split('?')[0].split('&')[0] // Remove query params from URL
    
    if (!authToken) {
      // During build, if no auth token, use placeholder to avoid breaking build
      if (process.env.VERCEL_ENV) {
        adapter = new PrismaLibSql({ url: `file:${path.join(process.cwd(), 'placeholder.db')}` }) as any
      } else {
        throw new Error('Turso auth token is required. Either include it in DATABASE_URL or set TURSO_AUTH_TOKEN')
      }
    } else {
      adapter = new PrismaLibSql({ 
        url: dbUrl,
        authToken 
      })
    }
  } catch (e) {
    // If URL parsing fails, use placeholder during build
    if (process.env.VERCEL_ENV || process.env.VERCEL) {
      adapter = new PrismaLibSql({ url: `file:${path.join(process.cwd(), 'placeholder.db')}` }) as any
    } else {
      throw new Error(`Invalid DATABASE_URL format: ${e instanceof Error ? e.message : String(e)}`)
    }
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  })

if (!isDev) globalForPrisma.prisma = prisma
