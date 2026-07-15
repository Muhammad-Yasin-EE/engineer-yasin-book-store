import { NextResponse } from 'next/server'
import Parser from 'rss-parser'
import slugify from 'slugify'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 300; 

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  }
})

const TARGET_FEEDS = [
  {
    url: 'https://scholarshipscorner.website/feed/', 
    type: 'scholarship',
    category: "Graduate (Master's)"
  },
  {
    url: 'https://remoteok.com/rss',
    type: 'job',
    category: "Private Jobs"
  },
  {
    url: 'https://weworkremotely.com/categories/remote-programming-jobs.rss',
    type: 'job',
    category: "Private Jobs"
  }
]

function extractDomain(url: string) {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return 'engineeryasin.com'
  }
}

function getUniqueImage(url: string, content: string, title: string) {
  // First try to find real image in HTML
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch && imgMatch[1] && !imgMatch[1].includes('pixel.wp.com')) {
    return imgMatch[1]
  }
  
  // Generate a completely UNIQUE and highly RELEVANT AI photograph based on the job/scholarship title!
  // This uses Pollinations.ai (Free AI Image Generator) to create a beautiful, relevant cover.
  const prompt = `Professional high quality realistic cover photo representing: ${title.substring(0, 50)}`
  const seed = Math.floor(Math.random() * 1000000)
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=600&height=800&nologo=true&seed=${seed}`
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.NODE_ENV === 'production') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = await createClient()
  let addedCount = 0
  const errors = []

  for (const feed of TARGET_FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url)
      // Process more items since we will filter many out
      const items = feedData.items.slice(0, 15)

      for (const item of items) {
        if (!item.title || !item.link) continue

        let buyLinkUrl = item.link
        let cleanTitle = item.title.replace(/<[^>]*>?/gm, '').trim()
        cleanTitle = cleanTitle.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
        if (cleanTitle.length > 100) cleanTitle = cleanTitle.substring(0, 100) + '...'
        
        const fullText = (cleanTitle + ' ' + (item.contentSnippet || item.content || '')).toLowerCase()

        // --- FILTERING LOGIC ---
        if (feed.type === 'job') {
          const isRemote = fullText.includes('remote') || fullText.includes('anywhere') || fullText.includes('worldwide')
          const isPak = fullText.includes('pakistan') || fullText.includes('pk') || fullText.includes('islamabad') || fullText.includes('lahore') || fullText.includes('karachi')
          
          // Only allow Jobs if they are Remote or in Pakistan
          if (!isRemote && !isPak) continue

          // Check if it's an internship
          if (fullText.includes('intern') || fullText.includes('internship')) {
            feed.category = "Internships"
          }
        } else if (feed.type === 'scholarship') {
          // Exclude highly restrictive scholarships not for Pakistanis
          const isRestricted = fullText.includes('us citizens only') || fullText.includes('uk citizens only') || fullText.includes('european union only')
          if (isRestricted) continue
        }
        // -----------------------

        const { data: existing } = await supabase
          .from('items')
          .select('id')
          .eq('file_path', buyLinkUrl)
          .single()

        if (existing) continue

        const coverImage = getUniqueImage(buyLinkUrl, item.content || item.contentSnippet || '', cleanTitle)

        const { error } = await supabase.from('items').insert({
          title: cleanTitle,
          description: item.contentSnippet || item.content || cleanTitle,
          resource_type: feed.type,
          category: feed.category,
          type: 'free',
          file_path: buyLinkUrl, 
          price: 0,
          author: extractDomain(buyLinkUrl).toUpperCase(),
          cover_url: coverImage
        })

        if (error) {
          errors.push({ title: cleanTitle, error: error.message })
        } else {
          addedCount++
        }
      }
    } catch (err: any) {
      errors.push({ feed: feed.url, error: err.message })
    }
  }

  return NextResponse.json({ success: true, added: addedCount, errors })
}
