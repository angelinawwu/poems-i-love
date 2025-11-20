import { getPoem } from '../../actions'
import { notFound } from 'next/navigation'
import { PoemArticle } from '@/components/PoemArticle'

export const dynamic = 'force-dynamic'

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

