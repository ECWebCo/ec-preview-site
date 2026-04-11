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
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ width: '100%', background: 'var(--charcoal)', borderRadius: '12px 12px 0 0', padding: '0 0 32px', maxHeight: '60vh', overflowY: 'auto', border: '1px solid rgba(201,168,76,0.15)', borderBottom: 'none' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>
            {type === 'order' ? 'Order from' : type === 'reserve' ? 'Reserve at' : 'Call'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'rgba(255,255,255,0.3)', lineHeight: 1 }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(201,168,76,0.05)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 16, fontFamily: 'Playfair Display, serif', color: '#fff', fontStyle: 'italic', marginBottom: 4 }}>{getLabel(loc)}</span>
              {loc.address && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}>{loc.address}</span>}
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
      justifyContent: 'center', gap: 5, padding: '12px 8px',
      background: primary ? 'var(--gold)' : 'var(--charcoal)',
      color: primary ? '#fff' : 'rgba(255,255,255,0.7)',
      textDecoration: 'none', fontFamily: 'DM Sans',
      fontSize: 10, fontWeight: 500, letterSpacing: 1, cursor: 'pointer',
      border: 'none', borderRight: '1px solid rgba(255,255,255,0.07)',
      textTransform: 'uppercase', transition: 'background 0.2s, color 0.2s'
    }

    if (isMulti) {
      return <button onClick={() => setPicker(type)} style={commonStyle}>{icon}{label}</button>
    }

    return (
      <a href={singleUrl(type)} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer"
        onClick={() => trackEvent(restaurant.id, `${type}_click`)} style={commonStyle}>
        {icon}{label}
      </a>
    )
  }

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <div className="sticky-mobile-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        display: 'none', background: 'var(--charcoal)',
        borderTop: '1px solid rgba(201,168,76,0.2)',
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
