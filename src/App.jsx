import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import Nav from './components/Nav'
import Hero from './components/Hero'
import MenuSection from './components/MenuSection'
import GallerySection from './components/GallerySection'
import LocationSection from './components/LocationSection'
import TextureSection from './components/TextureSection'
import Footer from './components/Footer'
import StickyButtons from './components/StickyButtons'

const RESTAURANT_SLUG = window.location.pathname.replace(/^\//, '').split('/')[0] || 'ec-web-co'

function applyColors(r) {
  const root = document.documentElement
  if (r.color_ink) root.style.setProperty('--ink', r.color_ink)
  if (r.color_gold) {
    root.style.setProperty('--green', r.color_gold)
    root.style.setProperty('--green-lt', r.color_gold)
  }
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function AppContent({ data }) {
  useScrollReveal()
  const { restaurant, sections, hours, links, photos, heroPhoto, locations } = data
  const primaryStorefront = locations?.[0]
  const storefrontLinks = primaryStorefront?.location_links?.[0]
  const activeLinks = (storefrontLinks && (storefrontLinks.phone || storefrontLinks.order_url || storefrontLinks.reservation_url))
    ? storefrontLinks : links
  const activeHours = primaryStorefront?.location_hours?.length > 0
    ? primaryStorefront.location_hours : hours

  return (
    <>
      <Nav restaurant={restaurant} links={activeLinks} locations={locations} />
      <Hero restaurant={restaurant} heroPhoto={heroPhoto} />
      <MenuSection sections={sections} />
      <GallerySection photos={photos} restaurant={restaurant} />
      <TextureSection restaurant={restaurant} links={activeLinks} />
      <LocationSection restaurant={restaurant} hours={hours} links={links} locations={locations} />
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
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FAF8F3' }}>
      <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:24,fontStyle:'italic',color:'#2D5016' }}>Loading…</span>
    </div>
  )

  if (error) return (
    <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#FAF8F3' }}>
      <p style={{ color:'#aaa',fontFamily:'DM Sans' }}>Restaurant not found.</p>
    </div>
  )

  return <AppContent data={data} />
}
