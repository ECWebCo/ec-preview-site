// Routing Middleware — runs before every request.
// For the root URL on custom domains, fetches restaurant data from Supabase
// and injects per-restaurant SEO meta tags into the HTML response.

export const config = {
  runtime: 'edge',
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

// Restaurant SEO metadata (name/tagline/logo/favicon) changes rarely, but this
// middleware runs on every pageview of every custom domain. Cache the Supabase
// lookup per host in the edge instance's memory so repeat visits and crawlers
// don't trigger a DB request each time. Warm instances share this Map.
const LOOKUP_TTL_MS = 10 * 60 * 1000
const lookupCache = new Map() // host -> { expires, restaurant }

async function lookupRestaurant(host) {
  const cached = lookupCache.get(host)
  if (cached && cached.expires > Date.now()) return cached.restaurant

  let restaurant = null
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
        restaurant = Array.isArray(data) && data.length > 0 ? data[0] : null
      }
    }
  } catch (err) {
    return null // don't cache transient errors
  }

  // Cache hits AND misses (null) — a miss means "no such custom domain", which
  // is exactly the crawler noise we want to stop re-querying.
  lookupCache.set(host, { expires: Date.now() + LOOKUP_TTL_MS, restaurant })
  return restaurant
}

export default async function middleware(request) {
  const url = new URL(request.url)

  // Only process root path requests. Asset/api requests fall through.
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return fetch(request)
  }

  const host = url.hostname.replace(/^www\./, '')

  // Preview / staging / localhost hosts: serve unmodified
  if (
    host === 'preview.ecwebco.com' ||
    host.endsWith('.vercel.app') ||
    host === 'localhost'
  ) {
    return fetch(request)
  }

  // Look up restaurant by custom_domain
  let title = 'Restaurant Website'
  let description = 'A beautifully crafted restaurant website by EC Web Co.'
  let image = ''
  let faviconUrl = ''

  const restaurant = await lookupRestaurant(host)
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

  // Fetch the original index.html so we have the right bundled asset URLs
  const originalResponse = await fetch(request)
  const contentType = originalResponse.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) {
    return originalResponse
  }

  let html = await originalResponse.text()

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

  // Strip existing meta/title/icon, inject ours
  html = html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']icon["'][^>]*\/?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace('</head>', `${metaBlock}\n</head>`)

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  })
}
