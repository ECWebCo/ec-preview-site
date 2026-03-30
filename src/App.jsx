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

const RESTAURANT_SLUG = window.location.pathname.replace(/^\//, '').split('/')[0] || 'ec-web-co'

const PALETTES = {
  moody:   { ink: '#0D0D0D', gold: '#C9A84C', 'gold-dk': '#9A7530', stone: '#2A2520', warm: '#F2EDE4', off: '#F7F4EF', mist: '#E8E2D9' },
  warm:    { ink: '#2C1A0E', gold: '#B8962E', 'gold-dk': '#8A6F1F', stone: '#3D2B1F', warm: '#FAF7F2', off: '#F5EDE0', mist: '#EAD9C8' },
  fresh:   { ink: '#0D2218', gold: '#4A9B6F', 'gold-dk': '#2D7A50', stone: '#1A3A2A', warm: '#F0F7F3', off: '#F5F9F6', mist: '#C8E6D8' },
  bold:    { ink: '#0D0D1A', gold: '#E94560', 'gold-dk': '#C02040', stone: '#1A1A2E', warm: '#F5F0F8', off: '#F8F5FF', mist: '#E0D0F0' },
  classic: { ink: '#1A1A1A', gold: '#8B7355', 'gold-dk': '#6B5535', stone: '#2C2C2C', warm: '#FAF8F5', off: '#F8F6F2', mist: '#E5E0D8' },
}

function applyPalette(palette) {
  const vars = PALETTES[palette] || PALETTES.moody
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(`--${k}`, v))
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
        applyPalette(d.restaurant.palette || 'moody')
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
    </>
  )
}

