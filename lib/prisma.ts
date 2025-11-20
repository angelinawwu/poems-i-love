import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Use Turso in production, local SQLite in dev
const isDev = process.env.NODE_ENV === 'development'
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

// Clean DATABASE_URL - remove any accidental "DATABASE_URL =" prefix
let rawConnectionString = process.env.DATABASE_URL || ''
if (rawConnectionString.includes('DATABASE_URL')) {
  // Strip out "DATABASE_URL =" if accidentally included
  rawConnectionString = rawConnectionString.replace(/^DATABASE_URL\s*=\s*/i, '').trim()
}

const connectionString = rawConnectionString || (isDev ? `file:${path.join(process.cwd(), 'dev.db')}` : '')

// Parse connection string to handle Turso (with auth token) or local SQLite
let adapter: PrismaLibSql

// During build phase, use a dummy local DB to allow build to complete
if (isBuild && !isDev) {
  console.warn('[Prisma] Build phase detected - using dummy adapter')
  adapter = new PrismaLibSql({ url: `file:${path.join(process.cwd(), 'build-dummy.db')}` })
} else if (isDev || (connectionString && connectionString.startsWith('file:'))) {
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
      const truncated = connectionString.length > 100 ? connectionString.substring(0, 100) + '...' : connectionString
      throw new Error(`Invalid DATABASE_URL format. The URL appears to be malformed. Make sure in Vercel you only set the VALUE (not "DATABASE_URL = ..."). Got: ${truncated}`)
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
