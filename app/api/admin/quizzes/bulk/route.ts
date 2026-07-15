import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const { title, description, category, questions } = payload

    if (!title || !description || !category || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid JSON format. Please use the template provided.' }, { status: 400 })
    }

    if (questions.length === 0) {
      return NextResponse.json({ error: 'The quiz must have at least one question.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // 1. Insert the Quiz
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title: title.trim(),
        description: description.trim(),
        category: category.trim()
      })
      .select()
      .single()

    if (quizError || !quizData) {
      console.error('Quiz creation error:', quizError)
      return NextResponse.json({ error: 'Failed to create quiz record.' }, { status: 500 })
    }

    const quizId = quizData.id

    // 2. Format Questions
    const formattedQuestions = questions.map((q: any) => {
      if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct_option_index !== 'number') {
        throw new Error(`Invalid question format for question: "${q.question_text || 'Unknown'}"`)
      }
      return {
        quiz_id: quizId,
        question_text: q.question_text.trim(),
        options: q.options.map((opt: string) => String(opt).trim()),
        correct_option_index: q.correct_option_index
      }
    })

    // 3. Insert Questions in Bulk
    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(formattedQuestions)

    if (questionsError) {
      console.error('Questions insertion error:', questionsError)
      // Attempt to clean up the empty quiz if questions fail
      await supabase.from('quizzes').delete().eq('id', quizId)
      return NextResponse.json({ error: 'Failed to insert questions. Quiz creation was aborted.' }, { status: 500 })
    }

    // 4. Send notification
    await supabase.from('notifications').insert({
      title: `New ${category} Quiz Available!`,
      message: `Practice questions on "${title}" now.`,
      link: `/prep/${quizId}`
    })

    return NextResponse.json({ success: true, quizId, questionsCount: formattedQuestions.length })
  } catch (error: any) {
    console.error('Bulk upload Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
