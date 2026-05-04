import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

function resolveRestaurantQuery() {
  const host = window.location.hostname
  const isPreview =
    host === 'preview.ecwebco.com' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('.vercel.app')

  if (isPreview) {
    const slug = window.location.pathname.replace(/^\//, '').split('/')[0] || ''
    return { field: 'slug', value: slug }
  }
  return { field: 'custom_domain', value: host.replace(/^www\./, '') }
}

export async function getRestaurantData() {
  const { field, value } = resolveRestaurantQuery()
  if (!value) return null

  // Single nested query — restaurant + all related data in one round-trip
  const { data: restaurant, error } = await supabase
    .from('restaurants')
    .select(`
      *,
      menu_sections(*, menu_items(*)),
      photos(*),
      locations(*, location_hours(*), location_links(*))
    `)
    .eq(field, value)
    .single()

  if (error || !restaurant) return null

  // Sort and structure
  const allSections = (restaurant.menu_sections || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const sections = allSections.map(s => ({
    ...s,
    items: (s.menu_items || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
  }))

  const photos = (restaurant.photos || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  const locations = (restaurant.locations || [])
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  // Group photos by section
  const heroPhotos = photos.filter(p => p.section === 'hero' || (p.is_hero && !p.section))
  const collage1 = photos.filter(p => p.section === 'collage_1')
  const collage2 = photos.filter(p => p.section === 'collage_2')
  const collage3 = photos.filter(p => p.section === 'collage_3')
  const collage4 = photos.filter(p => p.section === 'collage_4')

  return {
    restaurant,
    sections,
    photos,
    heroPhotos,
    collages: {
      collage_1: collage1,
      collage_2: collage2,
      collage_3: collage3,
      collage_4: collage4,
    },
    locations,
  }
}

export async function trackEvent(restaurantId, eventType) {
  try {
    await supabase
      .from('analytics_events')
      .insert({ restaurant_id: restaurantId, event_type: eventType })
  } catch (e) {}
}

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
    // No API endpoint configured — fall back to mailto
    return { fallback: 'mailto' }
  }
}
