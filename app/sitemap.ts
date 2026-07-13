import { MetadataRoute } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'

export const revalidate = 3600 // Cache sitemap for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.engineeryasin.xyz'
  
  // Static root listing routes
  const routes = [
    '',
    '/scholarships',
    '/jobs',
    '/software',
    '/services',
    '/courses',
    '/books',
    '/track',
    '/blog',
    '/login',
    '/signup'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }))

  const adminSupabase = createAdminClient()

  // 1. Fetch dynamic catalog items (jobs, scholarships, books, software, services, courses)
  let itemsUrls: any[] = []
  try {
    const { data } = await adminSupabase.from('items').select('id, updated_at')
    if (data) {
      itemsUrls = data.map((item) => ({
        url: `${baseUrl}/items/${item.id}`,
        lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }))
    }
  } catch (err) {
    console.error('Sitemap items fetch failure:', err)
  }

  // 2. Fetch dynamic blog posts
  let blogUrls: any[] = []
  try {
    const { data } = await adminSupabase.from('blog_posts').select('slug, updated_at')
    if (data) {
      blogUrls = data.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }))
    }
  } catch (err) {
    console.error('Sitemap blog posts fetch failure:', err)
  }

  // 3. Fetch custom pages
  let customPageUrls: any[] = []
  try {
    const { data } = await adminSupabase.from('custom_pages').select('slug, created_at')
    if (data) {
      customPageUrls = data.map((page) => ({
        url: `${baseUrl}/p/${page.slug}`,
        lastModified: page.created_at ? new Date(page.created_at) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4
      }))
    }
  } catch (err) {
    console.error('Sitemap custom pages fetch failure:', err)
  }

  return [...routes, ...itemsUrls, ...blogUrls, ...customPageUrls]
}
