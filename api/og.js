// Vercel Edge Function — serves HTML for ALL requests to /, with per-restaurant
// SEO meta tags injected server-side. Bots get the right metadata. Real users
// get the metadata + React bootstrap and the SPA loads as normal.

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

export default async function handler(request) {
  const url = new URL(request.url)
  const host = url.hostname.replace(/^www\./, '')

  // Defaults
  let title = 'Restaurant Website'
  let description = 'A beautifully crafted restaurant website by EC Web Co.'
  let image = ''
  let faviconUrl = ''

  // Look up restaurant by custom_domain
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
    // Fall through to defaults
  }

  // Fetch the actual built index.html from the deployment so we get the correct
  // hashed asset URLs (e.g. /assets/index-D6FKcVpC.js)
  let indexHtml = ''
  try {
    const indexRes = await fetch(new URL('/index.html', url.origin), {
      headers: { 'x-skip-rewrite': '1' },
    })
    if (indexRes.ok) {
      indexHtml = await indexRes.text()
    }
  } catch (err) {
    // ignore
  }

  // If we got the built index.html, inject our meta tags by replacing the head section.
  // If not, fall back to a minimal HTML for bots only.
  let html

  if (indexHtml) {
    // Replace the existing meta tags with restaurant-specific ones
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
    ${faviconUrl ? `<link rel="icon" href="${escapeHtml(faviconUrl)}" />` : ''}
`

    // Strip existing title and meta tags from the head, then inject ours
    html = indexHtml
      .replace(/<title>[\s\S]*?<\/title>/i, '')
      .replace(/<meta\s+name=["']description["'][^>]*>/gi, '')
      .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '')
      .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '')
      .replace(/<link\s+rel=["']icon["'][^>]*>/gi, '')
      .replace('</head>', `${metaBlock}</head>`)
  } else {
    // Fallback: minimal HTML (bots only — humans would see no app)
    html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${faviconUrl ? `<link rel="icon" href="${escapeHtml(faviconUrl)}" />` : ''}
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url.origin)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
  </head>
  <body>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(description)}</p>
  </body>
</html>`
  }

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
