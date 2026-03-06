import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/maintenance', '/preview'],
    },
    sitemap: 'https://pengui.org/sitemap.xml',
  }
}
