import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import path from 'path'

// Source: Local dev database
const devDbPath = path.join(process.cwd(), 'dev.db')
const devUrl = `file:${devDbPath}`

console.log('Dev database path:', devUrl)

const devAdapter = new PrismaLibSql({ url: devUrl })

const devPrisma = new PrismaClient({
  adapter: devAdapter,
})

// Target: Production database (set DATABASE_URL_PROD env var)
const prodConnectionString = process.env.DATABASE_URL_PROD || process.env.DATABASE_URL

if (!prodConnectionString) {
  console.error('Please provide DATABASE_URL_PROD or DATABASE_URL environment variable for the target database.')
  process.exit(1)
}

console.log('Prod connection string:', prodConnectionString.replace(/\?authToken=[^&]+/, '?authToken=***'))

// Parse Turso connection string and create production Prisma client
let prodPrisma: PrismaClient

if (prodConnectionString.startsWith('file:')) {
  // Local file
  const prodAdapter = new PrismaLibSql({ url: prodConnectionString })
  prodPrisma = new PrismaClient({
    adapter: prodAdapter,
  })
} else {
  // Turso URL
  try {
    const urlObj = new URL(prodConnectionString)
    const prodAuthToken = urlObj.searchParams.get('authToken') || process.env.TURSO_AUTH_TOKEN || null
    const prodUrl = prodConnectionString.split('?')[0].split('&')[0] // Remove query params
    
    if (!prodAuthToken) {
      console.error('Turso auth token is required. Either include it in DATABASE_URL_PROD or set TURSO_AUTH_TOKEN')
      process.exit(1)
    }
    
    const prodAdapter = new PrismaLibSql({ 
      url: prodUrl,
      authToken: prodAuthToken
    })
    
    prodPrisma = new PrismaClient({
      adapter: prodAdapter,
    })
  } catch (e) {
    console.error('Invalid production database URL:', e)
    process.exit(1)
  }
}

async function migrate() {
  try {
    // Fetch all poems from dev
    const poems = await devPrisma.poem.findMany()
    console.log(`Found ${poems.length} poems in dev database to migrate`)

    if (poems.length === 0) {
        console.log('No poems found to migrate.')
        return
    }

    // Insert into production
    for (const poem of poems) {
      await prodPrisma.poem.upsert({
        where: { id: poem.id },
        update: {
          title: poem.title,
          author: poem.author,
          year: poem.year,
          content: poem.content,
        },
        create: {
          id: poem.id,
          title: poem.title,
          author: poem.author,
          year: poem.year,
          content: poem.content,
          createdAt: poem.createdAt,
        },
      })
      console.log(`Migrated: ${poem.title}`)
    }

    console.log('Migration complete!')
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await devPrisma.$disconnect()
    await prodPrisma.$disconnect()
  }
}

migrate()
