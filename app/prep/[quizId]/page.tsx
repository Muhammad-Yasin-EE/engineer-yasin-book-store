import { createClient } from '@/lib/supabase/server'
import { Metadata, ResolvingMetadata } from 'next'
import QuizClient from './QuizClient'

export async function generateMetadata(
  { params }: { params: Promise<{ quizId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { quizId } = await params
  const supabase = await createClient()
  
  const { data } = await supabase.from('quizzes').select('*').eq('id', quizId).single()
  
  if (!data) return {}

  const title = `${data.title} - Free Online Quiz | Engineer Yasin`
  const description = data.description || `Attempt this ${data.category || 'exam'} quiz with 30 MCQs and 15 minutes time limit. Instant results and anti-cheat protection enabled.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website'
    }
  }
}

export default async function QuizPage({ params }: { params: Promise<{ quizId: string }> }) {
  return <QuizClient params={params} />
}
