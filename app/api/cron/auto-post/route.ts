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
  // Examples of Google Alert RSS Feeds
  {
    url: 'https://www.google.com/alerts/feeds/14418386377196621217/14603943926868285521', 
    type: 'scholarship',
    category: "Undergraduate"
  },
  {
    url: 'https://www.google.com/alerts/feeds/14418386377196621217/637841398867375685',
    type: 'job',
    category: "Government Jobs"
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

function getOfficialImage(url: string, content: string) {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  if (imgMatch && imgMatch[1]) {
    return imgMatch[1]
  }
  const domain = extractDomain(url)
  return `https://icon.horse/icon/${domain}`
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
      const items = feedData.items.slice(0, 5)

      for (const item of items) {
        if (!item.title || !item.link) continue

        let buyLinkUrl = item.link
        if (buyLinkUrl.includes('google.com/url?q=')) {
          const match = buyLinkUrl.match(/url\?q=([^&]+)/)
          if (match && match[1]) {
            buyLinkUrl = decodeURIComponent(match[1])
          }
        }

        const { data: existing } = await supabase
          .from('items')
          .select('id')
          .eq('buy_link', buyLinkUrl)
          .single()

        if (existing) continue

        let cleanTitle = item.title.replace(/<[^>]*>?/gm, '').trim()
        cleanTitle = cleanTitle.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')
        if (cleanTitle.length > 100) cleanTitle = cleanTitle.substring(0, 100) + '...'

        const baseSlug = slugify(cleanTitle, { lower: true, strict: true })
        const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`

        const coverImage = getOfficialImage(buyLinkUrl, item.content || item.contentSnippet || '')

        const { error } = await supabase.from('items').insert({
          title: cleanTitle,
          slug: uniqueSlug,
          description: item.contentSnippet || item.content || cleanTitle,
          resource_type: feed.type,
          category: feed.category,
          buy_link: buyLinkUrl, 
          file_url: null,
          price: 0,
          author: extractDomain(buyLinkUrl).toUpperCase(),
          cover_image: coverImage,
          features: ['Official Source', 'Auto Verified', 'Apply Online']
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
