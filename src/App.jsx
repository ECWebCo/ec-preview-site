import { useEffect, useState, useRef } from 'react'
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
  if (restaurant.color_gold) {
    root.style.setProperty('--gold', restaurant.color_gold)
    root.style.setProperty('--gold-dk', restaurant.color_gold)
  }
  if (restaurant.color_off) {
    root.style.setProperty('--off', restaurant.color_off)
    root.style.setProperty('--warm', restaurant.color_off)
  }
}

// Global scroll reveal observer
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale')
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// Custom cursor
function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ringEl = ringRef.current
    if (!dot || !ringEl) return

    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      dot.style.left = e.clientX + 'px'
      dot.style.top = e.clientY + 'px'
    }

    const onEnter = () => document.body.classList.add('cursor-hover')
    const onLeave = () => document.body.classList.remove('cursor-hover')

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12
      ringEl.style.left = ring.current.x + 'px'
      ringEl.style.top = ring.current.y + 'px'
      raf.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, .gallery-cell').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    raf.current = requestAnimationFrame(animate)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return (
    <>
      <div id="cursor-dot" ref={dotRef} style={{ position: 'fixed', top: 0, left: 0 }} />
      <div id="cursor-ring" ref={ringRef} style={{ position: 'fixed', top: 0, left: 0 }} />
    </>
  )
}

function AppContent({ data }) {
  useScrollReveal()

  const { restaurant, sections, hours, links, photos, heroPhoto, locations } = data

  const primaryStorefront = locations?.[0]
  const storefrontLinks = primaryStorefront?.location_links?.[0]
  const activeLinks = (storefrontLinks && (storefrontLinks.phone || storefrontLinks.order_url || storefrontLinks.reservation_url))
    ? storefrontLinks : links
  const activeHours = (primaryStorefront?.location_hours?.length > 0)
    ? primaryStorefront.location_hours : hours

  return (
    <>
      <CustomCursor />
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontStyle: 'italic', color: '#C9A84C', letterSpacing: 1 }}>
        Loading…
      </div>
    </div>
  )

  if (error) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D0D' }}>
      <p style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans' }}>Restaurant not found.</p>
    </div>
  )

  return <AppContent data={data} />
}
