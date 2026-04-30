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

  const sections = allSections.map(s => ({
    ...s,
    items: allItems.filter(i => i.section_id === s.id),
  }))

  const photos = photosRes.data || []

  // Group photos by section
  const heroPhotos = photos.filter(p => p.section === 'hero' || (p.is_hero && !p.section))
  const collage1 = photos.filter(p => p.section === 'collage_1')
  const collage2 = photos.filter(p => p.section === 'collage_2')
  const collage3 = photos.filter(p => p.section === 'collage_3')
  const collage4 = photos.filter(p => p.section === 'collage_4')

  const locations = locationsRes.data || []

  return {
    restaurant,
    sections,
    photos,
    heroPhotos,
    collages: { collage_1: collage1, collage_2: collage2, collage_3: collage3, collage_4: collage4 },3 },
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
    return { error: err.message || 'Network error' }
  }
}
