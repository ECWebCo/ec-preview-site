// Vercel Edge Middleware — runs on every request automatically.
// Intercepts the root HTML response and injects per-restaurant SEO tags.

import { next } from '@vercel/edge'

export const config = {
  matcher: '/',
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export default async function middleware(request) {
  const url = new URL(request.url)
  const host = url.hostname.replace(/^www\./, '')

  // Skip if hitting preview domain or vercel.app or localhost — those don't have custom_domain
  if (host === 'preview.ecwebco.com' || host.endsWith('.vercel.app') || host === 'localhost') {
    return next()
  }

  // Get the original SPA HTML response
  const response = await next()
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    return response
  }

  let html = await response.text()

  // Look up restaurant
  let title = 'Restaurant Website'
  let description = 'A beautifully crafted restaurant website by EC Web Co.'
  let image = ''
  let faviconUrl = ''

  try {
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      const apiUrl = `${SUPABASE_URL}/rest/v1/restaurants?select=name,tagline,about,seo_description,logo_url,favicon_url&custom_domain=eq.${encodeURIComponent(host)}`
      const res = await fetch(apiUrl, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        const restaurant = Array.isArray(data) && data.length > 0 ? data[0] : null

        if (restaurant) {
          title = restaurant.tagline
            ? `${restaurant.name} | ${restaurant.tagline}`
            : restaurant.name

          description = restaurant.seo_description
          if (!description && restaurant.about) {
            description = restaurant.about.length > 155
              ? restaurant.about.slice(0, 155).trim() + '…'
              : restaurant.about
          }
          if (!description) description = `Visit ${restaurant.name}`

          if (restaurant.logo_url) image = restaurant.logo_url
          if (restaurant.favicon_url) faviconUrl = restaurant.favicon_url
        }
      }
    }
  } catch (err) {
    // fall through with defaults
  }

  // Build replacement meta block
  const metaBlock = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url.origin)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    ${image ? `<meta property="og:image:width" content="1200" />` : ''}
    ${image ? `<meta property="og:image:height" content="630" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
    ${faviconUrl ? `<link rel="icon" href="${escapeHtml(faviconUrl)}" />` : ''}`

  // Strip existing meta/title/icon and inject ours
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']icon["'][^>]*\/?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '') // strip HTML comments
    .replace('</head>', `${metaBlock}\n</head>`)

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
