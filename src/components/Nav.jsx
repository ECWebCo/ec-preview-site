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
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: '#141414', border: '1px solid #333', minWidth: 300, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)', fontFamily: 'DM Sans' }}>{type === 'order' ? 'Order from' : type === 'reserve' ? 'Reserve at' : 'Call'}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '16px 24px', borderBottom: '1px solid #1a1a1a', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,92,0,0.06)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontSize: 15, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600 }}>{loc.name || loc.address}</span>
              {loc.address && <span style={{ fontSize: 12, color: '#555', marginTop: 3, fontFamily: 'DM Sans' }}>{loc.address}</span>}
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
    const fn = () => setScrolled(window.scrollY > 60)
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
    { label: 'Location', id: 'location-section' },
    { label: 'Contact', id: 'contact-section' },
  ]

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <nav className={scrolled ? 'site-nav nav-scrolled' : 'site-nav'} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '18px 56px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', transition: 'all 0.4s ease'
      }}>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
            : <span>{restaurant.name}<span style={{ color: 'var(--orange)' }}>.</span></span>}
        </div>

        <div className="nav-links-d" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', fontSize: 13, color: 'rgba(255,255,255,0.55)',
              cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 500, transition: 'color 0.2s'
            }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
            >{label}</button>
          ))}
        </div>

        <div className="nav-cta-d" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {(links?.phone || (isMulti && locations.some(l => l.location_links?.[0]?.phone))) && (
            <button onClick={() => handleCta('call', `tel:${links?.phone}`)} style={{ padding: '9px 18px', background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor='#555'; e.currentTarget.style.color='#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='#333'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}>
              Call
            </button>
          )}
          {(links?.reservation_url || (isMulti && locations.some(l => l.location_links?.[0]?.reservation_url))) && (
            <button onClick={() => handleCta('reserve', links?.reservation_url)} style={{ padding: '9px 18px', background: 'none', border: '1px solid #333', color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor='#555'; e.currentTarget.style.color='#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='#333'; e.currentTarget.style.color='rgba(255,255,255,0.6)' }}>
              Reserve
            </button>
          )}
          {(links?.order_url || (isMulti && locations.some(l => l.location_links?.[0]?.order_url))) && (
            <button onClick={() => handleCta('order', links?.order_url)} className="btn-orange" style={{ padding: '9px 22px', fontSize: 12 }}>
              Order Now
            </button>
          )}
        </div>

        <button className="nav-ham" onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'none', background: 'none', border: 'none', flexDirection: 'column', gap: 6, cursor: 'pointer', padding: 4 }}>
          {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 24, height: 2, background: '#fff', transition: '0.3s', transform: i===0&&menuOpen?'rotate(45deg) translate(5px,5px)':i===2&&menuOpen?'rotate(-45deg) translate(5px,-5px)':'none', opacity: i===1&&menuOpen?0:1 }} />)}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'var(--black)', zIndex: 99, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', fontSize: 'clamp(36px,8vw,60px)', color: '#fff', fontFamily: 'DM Sans', fontWeight: 800, cursor: 'pointer', letterSpacing: '-1px', transition: 'color 0.2s', padding: '8px 0' }}
              onMouseOver={e => e.target.style.color = 'var(--orange)'}
              onMouseOut={e => e.target.style.color = '#fff'}
            >{label}</button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            {links?.order_url && <button onClick={() => { setMenuOpen(false); handleCta('order', links.order_url) }} className="btn-orange">Order Now</button>}
            {links?.reservation_url && <button onClick={() => { setMenuOpen(false); handleCta('reserve', links.reservation_url) }} className="btn-outline">Reserve</button>}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-d { display: none !important; }
          .nav-cta-d { display: none !important; }
          .nav-ham { display: flex !important; }
          .site-nav { padding: 16px 24px !important; }
        }
      `}</style>
    </>
  )
}
