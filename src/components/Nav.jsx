import { useState } from 'react'
import { trackEvent } from '../lib/supabase'

export default function Nav({ restaurant, links }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '16px 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', background: menuOpen ? 'var(--stone)' : 'transparent',
        transition: 'background 0.3s'
      }} className="site-nav">

        {/* Logo / Name */}
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', fontStyle: 'italic', letterSpacing: 1 }}>
          {restaurant.logo_url
            ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height: 36, objectFit: 'contain' }} />
            : restaurant.name
          }
        </div>

        {/* Desktop nav links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['menu', 'hours', 'gallery', 'location', 'contact'].map(id => (
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

        {/* Desktop CTAs — Order, Reserve, Call */}
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {links?.phone && (
            <a href={`tel:${links.phone}`}
              onClick={() => trackEvent(restaurant.id, 'phone_click')}
              style={{ padding: '9px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >Call</a>
          )}
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              style={{ padding: '9px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >Reserve</a>
          )}
          {links?.order_url && (
            <a href={links.order_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'order_click')}
              style={{ padding: '9px 16px', background: 'var(--gold)', border: '1px solid var(--gold)', color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--gold-dk)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--gold)'}
            >Order Online</a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none',
          flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#fff' }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'var(--stone)', zIndex: 99, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 28
        }}>
          {['menu', 'hours', 'gallery', 'location', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id + '-section')} style={{
              background: 'none', border: 'none', fontSize: 22, color: '#fff',
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic', cursor: 'pointer'
            }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center', padding: '0 24px' }}>
            {links?.phone && (
              <a href={`tel:${links.phone}`} onClick={() => trackEvent(restaurant.id, 'phone_click')}
                style={{ padding: '11px 20px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none' }}>
                Call
              </a>
            )}
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                style={{ padding: '11px 20px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none' }}>
                Reserve
              </a>
            )}
            {links?.order_url && (
              <a href={links.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'order_click')}
                style={{ padding: '11px 20px', background: 'var(--gold)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', textDecoration: 'none', border: 'none' }}>
                Order Online
              </a>
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

