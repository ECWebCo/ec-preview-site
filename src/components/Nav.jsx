import { useState } from 'react'

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
        padding: '20px 48px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', transition: 'background 0.3s',
        background: menuOpen ? 'var(--stone)' : 'transparent'
      }} className="site-nav">
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: '#fff', fontStyle: 'italic', letterSpacing: 1 }}>
          {restaurant.name}
        </div>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ display: 'flex', gap: 32 }}>
          {['menu', 'hours', 'gallery', 'location', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id + '-section')} style={{
              background: 'none', border: 'none', fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
              transition: '0.2s', fontFamily: 'DM Sans, sans-serif'
            }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
            >
              {id}
            </button>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="nav-cta-desktop" style={{ display: 'flex', gap: 10 }}>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer" style={{
              padding: '10px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)',
              color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif', transition: '0.2s'
            }}>Reserve</a>
          )}
          {links?.order_url && (
            <a href={links.order_url} target="_blank" rel="noreferrer" style={{
              padding: '10px 20px', background: 'var(--gold)', border: '1px solid var(--gold)',
              color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif', transition: '0.2s'
            }}>Order Online</a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: 'none', background: 'none', border: 'none', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{ display: 'block', width: 22, height: 1.5, background: '#fff', transition: '0.2s' }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, bottom: 0,
          background: 'var(--stone)', zIndex: 99, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 32
        }}>
          {['menu', 'hours', 'gallery', 'location', 'contact'].map(id => (
            <button key={id} onClick={() => scrollTo(id + '-section')} style={{
              background: 'none', border: 'none', fontSize: 24, color: '#fff',
              fontFamily: 'Playfair Display, serif', fontStyle: 'italic', cursor: 'pointer'
            }}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
          ))}
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer" style={{
                padding: '12px 24px', border: '1px solid rgba(255,255,255,0.3)', color: '#fff',
                fontSize: 12, letterSpacing: 1, textTransform: 'uppercase'
              }}>Reserve</a>
            )}
            {links?.order_url && (
              <a href={links.order_url} target="_blank" rel="noreferrer" style={{
                padding: '12px 24px', background: 'var(--gold)', color: '#fff',
                fontSize: 12, letterSpacing: 1, textTransform: 'uppercase'
              }}>Order</a>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .site-nav { padding: 16px 24px !important; background: rgba(0,0,0,0.4) !important; }
        }
      `}</style>
    </>
  )
}
