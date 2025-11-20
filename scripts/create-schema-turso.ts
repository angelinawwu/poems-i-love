import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('Please provide DATABASE_URL environment variable')
  process.exit(1)
}

// Parse Turso connection string
const urlObj = new URL(connectionString)
const authToken = urlObj.searchParams.get('authToken') || process.env.TURSO_AUTH_TOKEN || null
const dbUrl = connectionString.split('?')[0].split('&')[0]

if (!authToken) {
  console.error('Turso auth token is required')
  process.exit(1)
}

const adapter = new PrismaLibSql({ 
  url: dbUrl,
  authToken 
})

const prisma = new PrismaClient({ adapter })

async function createSchema() {
  try {
    console.log('Creating schema on Turso...')
    
    // Execute the migration SQL (matching the actual schema)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Poem" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "author" TEXT NOT NULL,
        "year" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)
    
    console.log('Schema created successfully!')
  } catch (error) {
    console.error('Failed to create schema:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

createSchema()
