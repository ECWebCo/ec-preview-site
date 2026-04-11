import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusBar from './components/StatusBar'
import MenuSection from './components/MenuSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import StickyButtons from './components/StickyButtons'

const RESTAURANT_SLUG = window.location.pathname.replace(/^\//, '').split('/')[0] || 'ec-web-co'

function applyColors(restaurant) {
  const root = document.documentElement
  if (restaurant.color_ink) root.style.setProperty('--ink', restaurant.color_ink)
  if (restaurant.color_gold) {
    root.style.setProperty('--gold', restaurant.color_gold)
    root.style.setProperty('--gold-dk', restaurant.color_gold)
  }
  if (restaurant.color_off) {
    root.style.setProperty('--off', restaurant.color_off)
    root.style.setProperty('--warm', restaurant.color_off)
  }
}

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!RESTAURANT_SLUG) { setError(true); setLoading(false); return }
    getRestaurantData(RESTAURANT_SLUG).then(d => {
      if (d) {
        setData(d)
        document.title = d.restaurant.name
        applyColors(d.restaurant)
        trackEvent(d.restaurant.id, 'page_view')
      } else {
        setError(true)
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontStyle: 'italic', color: '#C9A84C' }}>Loading...</div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B6460' }}>Restaurant not found.</p>
    </div>
  )

  const { restaurant, sections, hours, links, photos, heroPhoto, locations } = data

  // Use storefront links/hours if available, fall back to global links/hours
  const primaryStorefront = locations?.[0]
  const storefrontLinks = primaryStorefront?.location_links?.[0]
  const activeLinks = (storefrontLinks && (storefrontLinks.phone || storefrontLinks.order_url || storefrontLinks.reservation_url))
    ? storefrontLinks : links
  const activeHours = (primaryStorefront?.location_hours?.length > 0)
    ? primaryStorefront.location_hours : hours

  return (
    <>
      <Nav restaurant={restaurant} links={activeLinks} locations={locations} />
      <Hero restaurant={restaurant} heroPhoto={heroPhoto} links={activeLinks} />
      <StatusBar hours={activeHours} links={activeLinks} />
      <MenuSection sections={sections} />
      <GallerySection photos={photos} restaurant={restaurant} />
      <LocationSection restaurant={restaurant} hours={hours} links={links} locations={locations} />
      <ContactSection restaurant={restaurant} links={activeLinks} />
      <Footer restaurant={restaurant} />
      <StickyButtons restaurant={restaurant} links={activeLinks} locations={locations} />
    </>
  )
}
