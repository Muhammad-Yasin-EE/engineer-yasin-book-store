import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Since we'll ask the user to create the table, we'll try to insert.
    // If the table doesn't exist yet, this will throw an error, which we catch.
    const { error } = await supabase
      .from('subscribers')
      .insert({ email })

    if (error) {
      // Check for unique constraint violation (code 23505 in postgres)
      if (error.code === '23505' || error.message.includes('unique')) {
        return NextResponse.json({ error: 'This email is already subscribed!' }, { status: 400 })
      }
      console.error('Subscription error:', error)
      return NextResponse.json({ error: 'Could not subscribe at this time.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
