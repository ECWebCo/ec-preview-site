import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import RestaurantSite from './components/RestaurantSite'
import KpsLayout from './components/kps/KpsLayout'

function applyColors(r) {
  const root = document.documentElement
  if (r.color_ink) root.style.setProperty('--ink', r.color_ink)
  if (r.color_gold) {
    root.style.setProperty('--green', r.color_gold)
    root.style.setProperty('--green-lt', r.color_gold)
  }
}

// KP's Kitchen is a bespoke, self-contained layout (hardcoded menus/content,
// local images) — served without hitting Supabase for menu/photo data.
// Matched by its custom domain, or `?site=kps` for local preview.
function isKps() {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.replace(/^www\./, '')
  const site = new URLSearchParams(window.location.search).get('site')
  return host === 'kps-kitchen.com' || site === 'kps'
}

export default function App() {
  const kps = isKps()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(!kps)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (kps) {
      document.title = "KP's Kitchen | Your Go-To for Comfort Classics"
      return
    }
    getRestaurantData().then(d => {
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
  }, [kps])

  if (kps) return <KpsLayout data={{ sections: [] }} />

  if (loading)
    return <div style={{ minHeight: '100vh', background: '#FAFAF8' }} />

  if (error)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FAFAF8',
        }}
      >
        <p style={{ color: '#aaa', fontFamily: 'DM Sans' }}>
          Restaurant not found.
        </p>
      </div>
    )

  return <RestaurantSite data={data} />
}
