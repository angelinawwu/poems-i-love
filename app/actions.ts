'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'

export async function checkPassword(password: string) {
  return password === process.env.ADMIN_PASSWORD
}

export async function getPoems() {
  try {
    return await prisma.poem.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, author: true }
    })
  } catch (e) {
    console.error("Error fetching poems:", e)
    return []
  }
}

export async function getPoem(id: string) {
  try {
    return await prisma.poem.findUnique({
      where: { id }
    })
  } catch (e) {
    console.error(`Error fetching poem ${id}:`, e)
    return null
  }
}

export async function createPoem(formData: FormData) {
  console.log("Creating poem...")
  const password = formData.get('password') as string
  
  if (!process.env.ADMIN_PASSWORD) {
    console.error("ADMIN_PASSWORD env var is missing!")
    return { error: 'Server configuration error' }
  }

  // Verify password
  if (password !== process.env.ADMIN_PASSWORD) {
    console.error("Incorrect password provided")
    return { error: 'Incorrect password' }
  }

  const title = formData.get('title') as string
  const author = formData.get('author') as string
  const year = formData.get('year') as string
  const content = formData.get('content') as string

  if (!title || !content) {
    return { error: 'Title and Content are required' }
  }

  try {
    const newPoem = await prisma.poem.create({
      data: {
        title,
        author,
        year,
        content,
      }
    })
    console.log("Poem created:", newPoem.id)
    revalidatePath('/')
    return { success: true }
  } catch (e) {
    console.error("Failed to create poem:", e)
    return { error: 'Failed to create poem' }
  }
}
