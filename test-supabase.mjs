import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = 'https://unutkfhctinqflsmmyuv.supabase.co'
const supabaseKey = 'sb_publishable_iOoUAfYU0W4O9dupbVuWNg_tmOV80s4'
const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Testing connection to chat_sessions...')
  const sessionId = crypto.randomUUID()
  
  const { data, error } = await supabase.from('chat_sessions').insert({
    id: sessionId,
    user_identifier: 'Test Visitor'
  }).select()
  
  if (error) {
    console.error('Error inserting session:', error)
  } else {
    console.log('Successfully inserted session:', data)
  }
}

test()
