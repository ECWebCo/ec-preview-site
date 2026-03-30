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

// ── SET THIS TO THE RESTAURANT'S SLUG ──
const RESTAURANT_SLUG = import.meta.env.VITE_RESTAURANT_SLUG || 'la-bella-cucina'

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
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
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 32, fontStyle: 'italic', color: '#C9A84C', marginBottom: 16 }}>
          Loading...
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#6B6460' }}>Restaurant not found.</p>
    </div>
  )

  const { restaurant, sections, hours, links, photos, heroPhoto, locations } = data

  return (
    <>
      <Nav restaurant={restaurant} links={links} />
      <Hero restaurant={restaurant} heroPhoto={heroPhoto} links={links} />
      <StatusBar hours={hours} links={links} />
      <MenuSection sections={sections} />
      <HoursSection hours={hours} links={links} />
      <GallerySection photos={photos} restaurant={restaurant} />
      <LocationSection restaurant={restaurant} hours={hours} links={links} locations={locations} />
      <ContactSection restaurant={restaurant} links={links} />
      <Footer restaurant={restaurant} />
      <StickyButtons restaurant={restaurant} links={links} />
    </>
  )
}
