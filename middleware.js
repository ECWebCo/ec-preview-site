// Routing Middleware — runs before every request.
// - For KP's Kitchen (bespoke multi-page site), injects per-page SEO meta
//   from a hardcoded table and serves sitemap.xml / robots.txt (no Supabase).
// - For every other custom domain, injects per-restaurant SEO on the root
//   path from Supabase (data-driven RestaurantSite).

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

// ─── KP's Kitchen: bespoke per-page SEO ───────────────────────
const KPS_HOST = 'kps-kitchen.com'
const KPS_PAGES = {
  '/': {
    title: "KP's Kitchen | Your Go-To for Comfort Classics",
    description: "Upscale American comfort food & craft cocktails in Houston's Memorial. Scratch-made classics, a $7-for-7 happy hour, brunch, private events & catering.",
  },
  '/menu': {
    title: "Menu | KP's Kitchen & Bar",
    description: "Explore KP's Kitchen's menu — smashed cheeseburgers, Mama Pauly's meatballs, shrimp & grits, brunch, and a $7-for-7 happy hour in Houston's Memorial.",
  },
  '/happy-hour': {
    title: "Happy Hour · $7 for 7 | KP's Kitchen & Bar",
    description: "KP's Kitchen happy hour: 7 drinks, 7 bites, $7 each — Tuesday through Sunday, 3–6PM in Houston's Memorial.",
  },
  '/specials': {
    title: "Weekly Specials | KP's Kitchen & Bar",
    description: "KP's Kitchen weekly specials — $12 Burger Tuesdays, Prime Rib Wednesdays, Steak Nights, Sunday family meals and more in Houston's Memorial.",
  },
  '/private-events': {
    title: "Private Events | KP's Kitchen & Bar",
    description: "Host private events at KP's Kitchen — rehearsal dinners, birthdays, corporate gatherings & holiday parties with custom menus in Houston's Memorial.",
  },
  '/catering': {
    title: "Catering | KP's Kitchen & Bar",
    description: "Catering from KP's Kitchen — drop-off and full-service comfort food for offices, meetings & celebrations across Houston.",
  },
  '/about': {
    title: "Our Story | KP's Kitchen & Bar",
    description: "KP's Kitchen & Bar — Kerry Pauly's Houston institution for scratch-made comfort food and genuine neighborhood hospitality.",
  },
  '/contact': {
    title: "Contact & Hours | KP's Kitchen & Bar",
    description: "Visit KP's Kitchen & Bar in Houston's Memorial — 8412 I-10 Frontage Rd. Hours, directions, reservations & contact.",
  },
}
const KPS_PATHS = Object.keys(KPS_PAGES)

function buildMetaBlock({ title, description, url, image, favicon }) {
  return `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    ${image ? `<meta property="og:image" content="${escapeHtml(image)}" />` : ''}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ''}
    ${favicon ? `<link rel="icon" href="${escapeHtml(favicon)}" />` : ''}`
}

function injectMeta(html, meta) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name=["']description["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']canonical["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*\/?>/gi, '')
    .replace(/<link\s+rel=["']icon["'][^>]*\/?>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace('</head>', `${buildMetaBlock(meta)}\n</head>`)
}

function htmlResponse(html) {
  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300, stale-while-revalidate=600',
    },
  })
}

function kpsSitemap(origin) {
  const urls = KPS_PATHS
    .map(p => `<url><loc>${origin}${p === '/' ? '' : p}</loc><changefreq>weekly</changefreq></url>`)
    .join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
  return new Response(xml, {
    status: 200,
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}

function kpsRobots(origin) {
  const body = `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  })
}

// ─── Data-driven restaurants: cached Supabase SEO lookup ──────
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

  lookupCache.set(host, { expires: Date.now() + LOOKUP_TTL_MS, restaurant })
  return restaurant
}

export default async function middleware(request) {
  const url = new URL(request.url)
  const host = url.hostname.replace(/^www\./, '')
  const path = url.pathname.replace(/\/+$/, '') || '/'

  // ── KP's Kitchen (bespoke, multi-page, no Supabase) ──
  if (host === KPS_HOST) {
    if (url.pathname === '/sitemap.xml') return kpsSitemap(url.origin)
    if (url.pathname === '/robots.txt') return kpsRobots(url.origin)

    if (KPS_PAGES[path]) {
      const original = await fetch(request)
      const contentType = original.headers.get('content-type') || ''
      if (!contentType.includes('text/html')) return original
      const html = await original.text()
      const p = KPS_PAGES[path]
      return htmlResponse(injectMeta(html, {
        title: p.title,
        description: p.description,
        url: `${url.origin}${path === '/' ? '' : path}`,
        image: `${url.origin}/kps/hero-patio.jpg`,
      }))
    }
    // Unknown KPS path (e.g. /bellaire handled by redirect) — pass through
    return fetch(request)
  }

  // ── All other hosts: only process the root path ──
  if (url.pathname !== '/' && url.pathname !== '/index.html') {
    return fetch(request)
  }

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

  const original = await fetch(request)
  const contentType = original.headers.get('content-type') || ''
  if (!contentType.includes('text/html')) return original

  const html = await original.text()
  return htmlResponse(injectMeta(html, { title, description, url: url.origin, image, favicon: faviconUrl }))
}
