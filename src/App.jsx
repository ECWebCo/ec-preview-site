import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusBar from './components/StatusBar'
import MenuSection from './components/MenuSection'
import GallerySection from './components/GallerySection'
import HoursSection from './components/HoursSection'
import LocationSection from './components/LocationSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import StickyButtons from './components/StickyButtons'

const RESTAURANT_SLUG = window.location.pathname.replace(/^\//, '').split('/')[0] || 'ec-web-co'

function applyColors(restaurant) {
  const root = document.documentElement
  if (restaurant.color_ink) root.style.setProperty('--ink', restaurant.color_ink)
  if (restaurant.color_gold) root.style.setProperty('--accent', restaurant.color_gold)
  if (restaurant.color_off) {
    root.style.setProperty('--bg', restaurant.color_off)
    root.style.setProperty('--section', restaurant.color_off)
  }
}

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

function AppContent({ data }) {
  useScrollReveal()
  const { restaurant, sections, hours, links, photos, heroPhoto, locations } = data
  const primaryStorefront = locations?.[0]
  const storefrontLinks = primaryStorefront?.location_links?.[0]
  const activeLinks = (storefrontLinks && (storefrontLinks.phone || storefrontLinks.order_url || storefrontLinks.reservation_url))
    ? storefrontLinks : links
  const activeHours = (primaryStorefront?.location_hours?.length > 0) ? primaryStorefront.location_hours : hours

  return (
    <>
      <Nav restaurant={restaurant} links={activeLinks} locations={locations} />
      <Hero restaurant={restaurant} heroPhoto={heroPhoto} links={activeLinks} />
      <StatusBar hours={activeHours} links={activeLinks} />
      <MenuSection sections={sections} />
      <GallerySection photos={photos} restaurant={restaurant} />
      <HoursSection hours={activeHours} links={activeLinks} />
      <LocationSection restaurant={restaurant} hours={hours} links={links} locations={locations} />
      <ContactSection restaurant={restaurant} links={activeLinks} />
      <Footer restaurant={restaurant} />
      <StickyButtons restaurant={restaurant} links={activeLinks} locations={locations} />
    </>
  )
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAF8' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontStyle: 'italic', color: '#C9A84C' }}>Loading…</div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#aaa', fontFamily: 'DM Sans' }}>Restaurant not found.</p>
    </div>
  )

  return <AppContent data={data} />
}
