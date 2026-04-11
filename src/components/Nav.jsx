import { useState, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function LocationPicker({ locations, type, onClose }) {
  const getUrl = (loc) => {
    const l = loc.location_links?.[0] || {}
    if (type === 'order') return l.order_url
    if (type === 'reserve') return l.reservation_url
    if (type === 'call') return `tel:${l.phone || loc.phone}`
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', minWidth: 300, boxShadow: '0 24px 64px rgba(0,0,0,0.15)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'DM Sans' }}>
            {type === 'order' ? 'Order from' : type === 'reserve' ? 'Reserve at' : 'Call'}
          </span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', borderBottom: '1px solid #f8f8f8', textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = '#fafafa'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', fontFamily: 'DM Sans' }}>{loc.name || loc.address}</span>
              {loc.address && <span style={{ fontSize: 12, color: '#999', marginTop: 3, fontFamily: 'DM Sans' }}>{loc.address}</span>}
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

  const navLinks = [
    { label: 'Menu', id: 'menu-section' },
    { label: 'Gallery', id: 'gallery-section' },
    { label: 'Hours', id: 'hours-section' },
    { label: 'Location', id: 'location-section' },
    { label: 'Contact', id: 'contact-section' },
  ]

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      {/* WHITE HEADER — fully separated, not floating */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Top row — logo centered, CTAs right */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 48px',
        }}>
          {/* Left spacer / hamburger */}
          <div style={{ minWidth: 120 }}>
            <button className="nav-ham" onClick={() => setMenuOpen(!menuOpen)} style={{
              display: 'none', background: 'none', border: 'none',
              flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 22, height: 1.5, background: '#1a1a1a', transition: '0.3s',
                  transform: i === 0 && menuOpen ? 'rotate(45deg) translate(4px,4px)' : i === 2 && menuOpen ? 'rotate(-45deg) translate(4px,-4px)' : 'none',
                  opacity: i === 1 && menuOpen ? 0 : 1
                }} />
              ))}
            </button>
          </div>

          {/* Centered logo */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            {restaurant.logo_url ? (
              <img src={restaurant.logo_url} alt={restaurant.name}
                style={{ height: 56, width: 'auto', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
            ) : (
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 24, fontStyle: 'italic', fontWeight: 700,
                color: '#1a1a1a', letterSpacing: '-0.3px'
              }}>
                {restaurant.name}
              </span>
            )}
          </div>

          {/* Right — CTAs */}
          <div className="nav-cta-d" style={{ display: 'flex', gap: 8, alignItems: 'center', minWidth: 120, justifyContent: 'flex-end' }}>
            {(links?.phone || (isMulti && locations.some(l => l.location_links?.[0]?.phone))) && (
              <button onClick={() => handleCta('call', `tel:${links?.phone}`)} style={{
                padding: '7px 14px', background: 'none', border: '1px solid #ddd',
                color: '#555', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px'
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#aaa'; e.currentTarget.style.color = '#1a1a1a' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#555' }}
              >Call</button>
            )}
            {(links?.reservation_url || (isMulti && locations.some(l => l.location_links?.[0]?.reservation_url))) && (
              <button onClick={() => handleCta('reserve', links?.reservation_url)} style={{
                padding: '7px 14px', background: 'none', border: '1px solid #ddd',
                color: '#555', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.3px'
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#aaa'; e.currentTarget.style.color = '#1a1a1a' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#ddd'; e.currentTarget.style.color = '#555' }}
              >Reserve</button>
            )}
            {(links?.order_url || (isMulti && locations.some(l => l.location_links?.[0]?.order_url))) && (
              <button onClick={() => handleCta('order', links?.order_url)} className="btn-gold" style={{ padding: '7px 18px', fontSize: 11 }}>
                Order
              </button>
            )}
          </div>
        </div>

        {/* Bottom row — nav links centered */}
        <div className="nav-links-d" style={{
          display: 'flex', justifyContent: 'center', gap: 40,
          padding: '10px 48px',
          borderTop: '1px solid var(--border)',
        }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', fontSize: 11,
              letterSpacing: '2px', textTransform: 'uppercase',
              color: '#888', cursor: 'pointer', fontFamily: 'DM Sans',
              fontWeight: 500, transition: 'color 0.2s', padding: '2px 0',
              position: 'relative'
            }}
              onMouseOver={e => e.target.style.color = '#1a1a1a'}
              onMouseOut={e => e.target.style.color = '#888'}
            >{label}</button>
          ))}
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: '#fff', zIndex: 99,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
          paddingTop: 80
        }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0',
              width: '100%', padding: '20px 0', textAlign: 'center',
              fontSize: 26, color: '#1a1a1a',
              fontFamily: "'Playfair Display', serif", fontStyle: 'italic',
              cursor: 'pointer', fontWeight: 700, transition: 'color 0.2s'
            }}
              onMouseOver={e => e.target.style.color = 'var(--accent)'}
              onMouseOut={e => e.target.style.color = '#1a1a1a'}
            >{label}</button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap', justifyContent: 'center' }}>
            {links?.order_url && <button onClick={() => { setMenuOpen(false); handleCta('order', links.order_url) }} className="btn-gold">Order Online</button>}
            {links?.reservation_url && <button onClick={() => { setMenuOpen(false); handleCta('reserve', links.reservation_url) }} className="btn-outline">Reserve</button>}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-d { display: none !important; }
          .nav-cta-d { display: none !important; }
          .nav-ham { display: flex !important; }
        }
        @media (max-width: 600px) {
          header > div:first-child { padding: 12px 20px !important; }
        }
      `}</style>
    </>
  )
}
