import { useState } from 'react'
import { trackEvent } from '../lib/supabase'

function LocationPicker({ locations, type, onClose }) {
  const getUrl = (loc) => {
    const l = loc.location_links?.[0] || {}
    if (type === 'order') return l.order_url
    if (type === 'reserve') return l.reservation_url
    if (type === 'call') return `tel:${l.phone || loc.phone}`
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 8, minWidth: 280, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E8E2D9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {type === 'order' ? 'Order from...' : type === 'reserve' ? 'Reserve at...' : 'Call...'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#999' }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '14px 20px', borderBottom: '1px solid #F5F2ED', textDecoration: 'none' }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>{loc.name || loc.address}</span>
              {loc.address && <span style={{ fontSize: 12, color: '#999', marginTop: 2 }}>{loc.address}</span>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function Nav({ restaurant, links, locations }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [picker, setPicker] = useState(null)
  const isMulti = locations?.length > 1

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  function handleCta(type, url) {
    if (isMulti) { setPicker(type); return }
    trackEvent(restaurant.id, `${type}_click`)
    if (url) window.open(url, type === 'call' ? '_self' : '_blank')
  }

  const btnStyle = (primary) => ({
    padding: '9px 16px', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
    fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', cursor: 'pointer',
    background: primary ? 'var(--gold)' : 'transparent',
    border: primary ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.3)',
    color: '#fff', transition: '0.2s'
  })

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: menuOpen ? 'var(--stone)' : 'transparent',
        transition: 'background 0.3s'
      }} className="site-nav">

        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', fontStyle: 'italic', letterSpacing: 1 }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height: 72, objectFit: 'contain' }} />
            : restaurant.name}
        </div>

        <div className="nav-links-desktop" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['menu', 'gallery', 'location', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id + '-section')} style={{
              background: 'none', border: 'none', fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
              transition: '0.2s', fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >{id}</button>
          ))}
        </div>

        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(links?.phone || (isMulti && locations.some(l => l.location_links?.[0]?.phone))) && (
            <button onClick={() => handleCta('call', `tel:${links?.phone}`)} style={btnStyle(false)}>Call</button>
          )}
          {(links?.reservation_url || (isMulti && locations.some(l => l.location_links?.[0]?.reservation_url))) && (
            <button onClick={() => handleCta('reserve', links?.reservation_url)} style={btnStyle(false)}>Reserve</button>
          )}
          {(links?.order_url || (isMulti && locations.some(l => l.location_links?.[0]?.order_url))) && (
            <button onClick={() => handleCta('order', links?.order_url)} style={btnStyle(true)}>Order Online</button>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4
        }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#fff' }} />)}
        </button>
      </nav>

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'var(--stone)', zIndex: 99, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 28
        }}>
          {['menu', 'gallery', 'location', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id + '-section')} style={{
              background: 'none', border: 'none', fontSize: 22, color: '#fff',
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic', cursor: 'pointer'
            }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px' }}>
            {(links?.phone || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('call', `tel:${links?.phone}`) }}
                style={{ padding: '11px 20px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', background: 'none', cursor: 'pointer' }}>
                Call
              </button>
            )}
            {(links?.reservation_url || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('reserve', links?.reservation_url) }}
                style={{ padding: '11px 20px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', background: 'none', cursor: 'pointer' }}>
                Reserve
              </button>
            )}
            {(links?.order_url || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('order', links?.order_url) }}
                style={{ padding: '11px 20px', background: 'var(--gold)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                Order Online
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .site-nav { padding: 16px 24px !important; background: rgba(0,0,0,0.5) !important; }
        }
      `}</style>
    </>
  )
}
