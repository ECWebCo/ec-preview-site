import { useState } from 'react'
import { trackEvent } from '../lib/supabase'

function LocationPicker({ locations, type, onClose }) {
  const getUrl = (loc) => {
    const links = loc.location_links?.[0] || {}
    if (type === 'order') return links.order_url
    if (type === 'reserve') return links.reservation_url
    if (type === 'call') return `tel:${links.phone || loc.phone}`
  }

  const getLabel = (loc) => loc.name || loc.address || 'Location'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end'
    }} onClick={onClose}>
      <div style={{
        width: '100%', background: '#fff', borderRadius: '16px 16px 0 0',
        padding: '20px 0 32px', maxHeight: '60vh', overflowY: 'auto'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '0 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E2D9' }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#1A1A1A' }}>
            {type === 'order' ? 'Order from which location?' : type === 'reserve' ? 'Reserve at which location?' : 'Call which location?'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url}
              target={type !== 'call' ? '_blank' : '_self'}
              rel="noreferrer"
              onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '16px 20px', borderBottom: '1px solid #F5F2ED', textDecoration: 'none' }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: '#1A1A1A', marginBottom: 4 }}>{getLabel(loc)}</span>
              {loc.address && <span style={{ fontSize: 13, color: '#999' }}>{loc.address}</span>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function StickyButtons({ restaurant, links, locations }) {
  const [picker, setPicker] = useState(null)
  const isMulti = locations?.length > 1

  function handleClick(type, url, event) {
    if (isMulti) {
      setPicker(type)
    } else {
      trackEvent(restaurant.id, `${type}_click`)
    }
  }

  const hasOrder = isMulti ? locations.some(l => l.location_links?.[0]?.order_url) : links?.order_url
  const hasReserve = isMulti ? locations.some(l => l.location_links?.[0]?.reservation_url) : links?.reservation_url
  const hasCall = isMulti ? locations.some(l => l.location_links?.[0]?.phone || l.phone) : links?.phone

  if (!hasOrder && !hasReserve && !hasCall) return null

  const singleUrl = (type) => {
    if (type === 'order') return links?.order_url
    if (type === 'reserve') return links?.reservation_url
    if (type === 'call') return `tel:${links?.phone}`
  }

  const BtnItem = ({ type, label, icon, primary }) => {
    if (type === 'order' && !hasOrder) return null
    if (type === 'reserve' && !hasReserve) return null
    if (type === 'call' && !hasCall) return null

    const commonStyle = {
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 4, padding: '10px 8px',
      background: primary ? 'var(--gold)' : '#fff',
      color: primary ? '#fff' : 'var(--stone)',
      textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
      fontSize: 11, fontWeight: 500, letterSpacing: 0.3, cursor: 'pointer',
      border: 'none', borderRight: '1px solid #E8E2D9'
    }

    if (isMulti) {
      return (
        <button onClick={() => setPicker(type)} style={commonStyle}>
          {icon}{label}
        </button>
      )
    }

    return (
      <a href={singleUrl(type)}
        target={type !== 'call' ? '_blank' : '_self'}
        rel="noreferrer"
        onClick={() => trackEvent(restaurant.id, `${type}_click`)}
        style={commonStyle}
      >
        {icon}{label}
      </a>
    )
  }

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <div className="sticky-mobile-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        display: 'none', background: '#fff',
        borderTop: '1px solid #E8E2D9',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        <BtnItem type="order" label="Order" primary
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2h2l2.5 8h7l1.5-5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="13" cy="14" r="1" fill="currentColor"/></svg>}
        />
        <BtnItem type="reserve" label="Reserve"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14M6 2v2M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}
        />
        <BtnItem type="call" label="Call"
          icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="currentColor" strokeWidth="1.5"/></svg>}
        />
      </div>

      <div className="sticky-mobile-spacer" style={{ display: 'none', height: 68 }} />

      <style>{`
        @media (max-width: 768px) {
          .sticky-mobile-bar { display: flex !important; }
          .sticky-mobile-spacer { display: block !important; }
        }
      `}</style>
    </>
  )
}
