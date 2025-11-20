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

if (isDev || (connectionString && connectionString.startsWith('file:'))) {
  // Local SQLite (dev)
  const url = connectionString || `file:${path.join(process.cwd(), 'dev.db')}`
  adapter = new PrismaLibSql({ url })
} else if (!connectionString) {
  // No DATABASE_URL - at runtime this is always an error
  throw new Error('DATABASE_URL environment variable is required in production but is not set. Please set it in Vercel environment variables.')
} else {
  // Turso (production) - connectionString should be the libsql:// URL
  try {
    const urlObj = new URL(connectionString)
    const authToken = urlObj.searchParams.get('authToken') || process.env.TURSO_AUTH_TOKEN || null
    const dbUrl = connectionString.split('?')[0].split('&')[0] // Remove query params from URL
    
    if (!authToken) {
      throw new Error('Turso auth token is required. Include it in DATABASE_URL as ?authToken=... or set TURSO_AUTH_TOKEN environment variable')
    }
    
    adapter = new PrismaLibSql({ 
      url: dbUrl,
      authToken 
    })
  } catch (e) {
    if (e instanceof TypeError && e.message.includes('Invalid URL')) {
      throw new Error(`Invalid DATABASE_URL format. Expected libsql:// URL but got: ${connectionString?.substring(0, 100)}. Current value: ${connectionString ? 'Set but invalid' : 'Not set'}`)
    }
    throw e
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  })

if (!isDev) globalForPrisma.prisma = prisma
