import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Turso in production, local SQLite in dev
const isDev = process.env.NODE_ENV === 'development'
const connectionString = process.env.DATABASE_URL || (isDev ? `file:${path.join(process.cwd(), 'dev.db')}` : '')

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required in production')
}

// Parse connection string to handle Turso (with auth token) or local SQLite
let adapter: PrismaLibSql

if (isDev || connectionString.startsWith('file:')) {
  // Local SQLite (dev)
  adapter = new PrismaLibSql({ url: connectionString })
} else {
  // Turso (production)
  try {
    const urlObj = new URL(connectionString)
    const authToken = urlObj.searchParams.get('authToken') || process.env.TURSO_AUTH_TOKEN || null
    const dbUrl = connectionString.split('?')[0].split('&')[0] // Remove query params from URL
    
    if (!authToken) {
      throw new Error('Turso auth token is required. Either include it in DATABASE_URL or set TURSO_AUTH_TOKEN')
    }
    
    adapter = new PrismaLibSql({ 
      url: dbUrl,
      authToken 
    })
  } catch (e) {
    // If URL parsing fails, assume it's a malformed connection string
    throw new Error(`Invalid DATABASE_URL format: ${e instanceof Error ? e.message : String(e)}`)
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  })

if (!isDev) globalForPrisma.prisma = prisma
