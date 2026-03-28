import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import Nav from './components/Nav'
import Hero from './components/Hero'
import StatusBar from './components/StatusBar'
import MenuSection from './components/MenuSection'
import HoursSection from './components/HoursSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import StickyButtons from './components/StickyButtons'

// Read slug from URL path e.g. preview.ecwebco.com/la-bella-cucina
const RESTAURANT_SLUG = window.location.pathname.replace(/^\//, '').split('/')[0]
  || import.meta.env.VITE_RESTAURANT_SLUG
  || 'ec-web-co'

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

  const { restaurant, sections, hours, links, photos, heroPhoto } = data

  return (
    <>
      <Nav restaurant={restaurant} links={links} />
      <Hero restaurant={restaurant} heroPhoto={heroPhoto} links={links} />
      <StatusBar hours={hours} links={links} />
      <MenuSection sections={sections} />
      <HoursSection hours={hours} links={links} />
      <GallerySection photos={photos} restaurant={restaurant} />
      <LocationSection restaurant={restaurant} hours={hours} links={links} />
      <ContactSection restaurant={restaurant} links={links} />
      <Footer restaurant={restaurant} />
      <StickyButtons restaurant={restaurant} links={links} />
    </>
  )
}
