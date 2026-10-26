import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/vi/home', '/en/home', '/vi/me', '/en/me', '/vi/review', '/en/review'] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
