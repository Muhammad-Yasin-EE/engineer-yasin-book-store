import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.engineeryasin.xyz'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        '/checkout',
        '/cart',
        '/auth/'
      ]
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}
