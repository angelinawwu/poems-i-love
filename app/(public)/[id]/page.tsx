import { getPoem, getPoems } from '../../actions'
import { notFound } from 'next/navigation'
import { PoemArticle } from '@/components/PoemArticle'

export async function generateStaticParams() {
  const poems = await getPoems()
  return poems.map((poem: { id: string }) => ({
    id: poem.id,
  }))
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const poem = await getPoem(id)

  if (!poem) {
    notFound()
  }

  return <PoemArticle poem={poem} />
}

