import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Resolve which restaurant to show based on the current URL.
 * - On preview.ecwebco.com or localhost → use first path segment as slug
 * - On any other host (custom domain) → look up by custom_domain
 */
function resolveRestaurantQuery() {
  const host = window.location.hostname
  const isPreview =
    host === 'preview.ecwebco.com' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app') // preview deployments

  if (isPreview) {
    const slug = window.location.pathname.replace(/^\//, '').split('/')[0] || ''
    return { field: 'slug', value: slug }
  }
  return { field: 'custom_domain', value: host }
}

export async function getRestaurantData() {
  const { field, value } = resolveRestaurantQuery()
  if (!value) return null

  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq(field, value)
    .single()

  if (error || !restaurant) return null
  const id = restaurant.id

  const [sectionsRes, itemsRes, photosRes, locationsRes] = await Promise.all([
    supabase.from('menu_sections').select('*').eq('restaurant_id', id).order('sort_order'),
    supabase.from('menu_items').select('*').eq('restaurant_id', id).order('sort_order'),
    supabase.from('photos').select('*').eq('restaurant_id', id).order('sort_order'),
    supabase
      .from('locations')
      .select('*, location_hours(*), location_links(*)')
      .eq('restaurant_id', id)
      .order('sort_order'),
  ])

  const allSections = sectionsRes.data || []
  const allItems = itemsRes.data || []

  // Build sections-with-items, attaching location_id so the layout can filter
  const sections = allSections.map(s => ({
    ...s,
    items: allItems.filter(i => i.section_id === s.id),
  }))

  const photos = photosRes.data || []
  const heroPhotos = photos.filter(p => p.is_hero) // ordered by sort_order from query
  const locations = locationsRes.data || []

  return {
    restaurant,
    sections,
    photos,
    heroPhotos,
    locations,
  }
}

export async function trackEvent(restaurantId, eventType) {
  try {
    await supabase
      .from('analytics_events')
      .insert({ restaurant_id: restaurantId, event_type: eventType })
  } catch (e) {
    /* swallow — analytics shouldn't break the site */
  }
}

/**
 * Submit an inquiry from the contact / events form.
 * Calls the /api/inquiry serverless function (built in step 3).
 * If the function returns { fallback: 'mailto', email }, the caller
 * should redirect to mailto: as a graceful degradation.
 */
export async function submitInquiry(payload) {
  try {
    const res = await fetch('/api/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Inquiry submission failed')
    return await res.json()
  } catch (err) {
    return { error: err.message || 'Network error' }
  }
}
