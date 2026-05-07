// Vercel Edge Function — injects per-restaurant SEO meta tags for social media bots.
//
// How it works:
// 1. Vercel rewrites match social-bot user agents to this function (see vercel.json)
// 2. Function looks up restaurant by hostname (custom_domain match) in Supabase
// 3. Returns HTML with proper title, description, og:image, etc.
//
// Regular browser visitors are NOT routed here — they get the normal SPA.

export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function buildHtml({ title, description, image, url, faviconUrl }) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${faviconUrl ? `<link rel="icon" href="${escapeHtml(faviconUrl)}" />` : `<link rel="icon" type="image/png" href="/favicon.png" />`}

    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    ${image ? `<meta property="og:image:width" content="1200" />` : ''}
    ${image ? `<meta property="og:image:height" content="630" />` : ''}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`
}

export default async function handler(request) {
  const url = new URL(request.url)
  const host = url.hostname.replace(/^www\./, '')

  // Default fallback values
  let title = 'Restaurant Website'
  let description = 'A beautifully crafted restaurant website by EC Web Co.'
  let image = 'https://ecwebco.com/og-default.png'
  let faviconUrl = null

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
    // Fall through to defaults — never throw, never break the response
  }

  const html = buildHtml({
    title,
    description,
    image,
    url: request.url,
    faviconUrl,
  })

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
