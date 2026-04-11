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
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div style={{ background: 'var(--stone)', border: '1px solid rgba(201,168,76,0.2)', minWidth: 300, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>
            {type === 'order' ? 'Order from' : type === 'reserve' ? 'Reserve at' : 'Call'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc)
          if (!url) return null
          return (
            <a key={i} href={url} target={type !== 'call' ? '_blank' : '_self'} rel="noreferrer" onClick={onClose}
              style={{ display: 'flex', flexDirection: 'column', padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(201,168,76,0.06)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 15, fontFamily: 'Playfair Display, serif', color: '#fff', fontStyle: 'italic' }}>{loc.name || loc.address}</span>
              {loc.address && <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontFamily: 'DM Sans' }}>{loc.address}</span>}
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
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
    { label: 'Location', id: 'location-section' },
    { label: 'Contact', id: 'contact-section' },
  ]

  return (
    <>
      {picker && <LocationPicker locations={locations} type={picker} onClose={() => setPicker(null)} />}

      <nav className={scrolled ? 'site-nav nav-scrolled' : 'site-nav'} style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '20px 56px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)'
      }}>
        {/* Logo */}
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', fontStyle: 'italic', letterSpacing: 1, flexShrink: 0 }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height: 60, width: 'auto', objectFit: 'contain' }} />
            : restaurant.name}
        </div>

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {navLinks.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', fontSize: 10, letterSpacing: 2.5,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', cursor: 'none',
              fontFamily: 'DM Sans, sans-serif', position: 'relative', padding: '4px 0',
              transition: 'color 0.25s'
            }}
              onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.querySelector('.nav-underline').style.transform = 'scaleX(1)' }}
              onMouseOut={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.querySelector('.nav-underline').style.transform = 'scaleX(0)' }}
            >
              {label}
              <span className="nav-underline" style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                background: 'var(--gold)', transform: 'scaleX(0)', transformOrigin: 'left',
                transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1)'
              }} />
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {(links?.phone || (isMulti && locations.some(l => l.location_links?.[0]?.phone))) && (
            <button onClick={() => handleCta('call', `tel:${links?.phone}`)} style={{
              padding: '9px 18px', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              fontFamily: 'DM Sans', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.7)', transition: 'all 0.25s', cursor: 'none'
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >Call</button>
          )}
          {(links?.reservation_url || (isMulti && locations.some(l => l.location_links?.[0]?.reservation_url))) && (
            <button onClick={() => handleCta('reserve', links?.reservation_url)} style={{
              padding: '9px 18px', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              fontFamily: 'DM Sans', background: 'transparent', border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.7)', transition: 'all 0.25s', cursor: 'none'
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            >Reserve</button>
          )}
          {(links?.order_url || (isMulti && locations.some(l => l.location_links?.[0]?.order_url))) && (
            <button onClick={() => handleCta('order', links?.order_url)} className="btn-gold" style={{ padding: '9px 18px', fontSize: 10, letterSpacing: 1.5 }}>
              Order Online
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          flexDirection: 'column', gap: 6, cursor: 'pointer', padding: 4
        }}>
          <span style={{ display: 'block', width: 24, height: 1, background: '#fff', transition: '0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
          <span style={{ display: 'block', width: 24, height: 1, background: '#fff', transition: '0.3s', opacity: menuOpen ? 0 : 1 }} />
          <span style={{ display: 'block', width: 24, height: 1, background: '#fff', transition: '0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'var(--charcoal)', zIndex: 99,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0
        }}>
          {navLinks.map(({ label, id }, i) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', fontSize: 'clamp(36px, 8vw, 56px)', color: '#fff',
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic', cursor: 'pointer',
              padding: '12px 0', width: '100%', textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              transition: 'color 0.2s'
            }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseOut={e => e.currentTarget.style.color = '#fff'}
            >{label}</button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap', justifyContent: 'center', padding: '0 32px' }}>
            {(links?.phone || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('call', `tel:${links?.phone}`) }}
                style={{ padding: '13px 24px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', background: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}>
                Call
              </button>
            )}
            {(links?.reservation_url || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('reserve', links?.reservation_url) }}
                style={{ padding: '13px 24px', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', background: 'none', cursor: 'pointer', fontFamily: 'DM Sans' }}>
                Reserve
              </button>
            )}
            {(links?.order_url || isMulti) && (
              <button onClick={() => { setMenuOpen(false); handleCta('order', links?.order_url) }}
                className="btn-gold">
                Order Online
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .site-nav { padding: 16px 24px !important; }
        }
      `}</style>
    </>
  )
}
