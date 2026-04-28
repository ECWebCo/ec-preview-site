import { useEffect, useState } from 'react'
import { getRestaurantData, trackEvent } from './lib/supabase'
import RestaurantSite from './components/RestaurantSite'

function applyColors(r) {
  const root = document.documentElement
  if (r.color_ink) root.style.setProperty('--ink', r.color_ink)
  if (r.color_gold) {
    root.style.setProperty('--green', r.color_gold)
    root.style.setProperty('--green-lt', r.color_gold)
  }
}

export default function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
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
  }, [])

  if (loading)
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
        <span
          style={{
            fontFamily: 'Playfair Display,serif',
            fontSize: 24,
            fontStyle: 'italic',
            color: '#1B2B4B',
          }}
        >
          Loading…
        </span>
      </div>
    )

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
