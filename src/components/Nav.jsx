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
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', minWidth: 300, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', fontFamily: 'DM Sans' }}>{type === 'order' ? 'Order from' : type === 'reserve' ? 'Reserve at' : 'Call'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999', lineHeight: 1 }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', borderBottom: '1px solid #f5f5f5', textDecoration: 'none', transition: 'background 0.15s' }}
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
  const [scrolled, setScrolled] = useState(false)
  const isMulti = locations?.length > 1

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

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

  const linkColor = scrolled ? '#1a1a1a' : 'rgba(255,255,255,0.9)'
  const logoColor = scrolled ? '#1a1a1a' : '#fff'

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <nav
        className={scrolled ? 'site-nav nav-scrolled' : 'site-nav'}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 48px', height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.35s ease',
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent'
        }}
      >
        {/* Logo / Name */}
        <div style={{ flexShrink: 0 }}>
          {restaurant.logo_url ? (
            <img src={restaurant.logo_url} alt={restaurant.name} style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
          ) : (
            <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, fontStyle: 'italic', color: logoColor, fontWeight: 700, transition: 'color 0.35s', letterSpacing: '-0.3px' }}>
              {restaurant.name}
            </span>
          )}
        </div>

        {/* Desktop links */}
        <div className="nav-links-d" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', fontSize: 13, color: linkColor,
              cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 500,
              transition: 'opacity 0.2s', letterSpacing: '0.2px'
            }}
              onMouseOver={e => e.target.style.opacity = '0.6'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >{label}</button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-cta-d" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {(links?.phone || (isMulti && locations.some(l => l.location_links?.[0]?.phone))) && (
            <button onClick={() => handleCta('call', `tel:${links?.phone}`)} style={{
              padding: '9px 20px', background: 'none', border: `1px solid ${scrolled ? '#ddd' : 'rgba(255,255,255,0.5)'}`,
              color: linkColor, fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}>Call</button>
          )}
          {(links?.reservation_url || (isMulti && locations.some(l => l.location_links?.[0]?.reservation_url))) && (
            <button onClick={() => handleCta('reserve', links?.reservation_url)} style={{
              padding: '9px 20px', background: 'none', border: `1px solid ${scrolled ? '#ddd' : 'rgba(255,255,255,0.5)'}`,
              color: linkColor, fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s'
            }}>Reserve</button>
          )}
          {(links?.order_url || (isMulti && locations.some(l => l.location_links?.[0]?.order_url))) && (
            <button onClick={() => handleCta('order', links?.order_url)} className="btn-primary" style={{ padding: '9px 22px', fontSize: 12 }}>
              Order Online
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-ham" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{
              display: 'block', width: 24, height: 2,
              background: scrolled ? '#1a1a1a' : '#fff',
              transition: '0.3s',
              transform: i===0&&menuOpen ? 'rotate(45deg) translate(5px,5px)' : i===2&&menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none',
              opacity: i===1&&menuOpen ? 0 : 1
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: '#fff', zIndex: 99,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
          paddingTop: 72
        }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', borderBottom: '1px solid #f0f0f0',
              width: '100%', padding: '20px 0', textAlign: 'center',
              fontSize: 22, color: '#1a1a1a', fontFamily: 'Playfair Display, serif',
              fontStyle: 'italic', cursor: 'pointer', fontWeight: 700
            }}>{label}</button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px' }}>
            {links?.order_url && <button onClick={() => { setMenuOpen(false); handleCta('order', links.order_url) }} className="btn-primary">Order Online</button>}
            {links?.reservation_url && <button onClick={() => { setMenuOpen(false); handleCta('reserve', links.reservation_url) }} className="btn-secondary">Reserve</button>}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-d { display: none !important; }
          .nav-cta-d { display: none !important; }
          .nav-ham { display: flex !important; }
          .site-nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  )
}
