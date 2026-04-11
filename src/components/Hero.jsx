import { useEffect, useRef } from 'react'
import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  const name = restaurant.hero_headline || restaurant.name || 'Great Food'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* Big orange circle bg glow */}
      <div style={{ position: 'absolute', top: '20%', right: '15%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,92,0,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Rotating decorative ring */}
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, border: '1px solid rgba(255,92,0,0.08)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, border: '1px solid rgba(255,92,0,0.05)', borderRadius: '50%', pointerEvents: 'none' }} />

      {/* Main content */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '100vh', position: 'relative', zIndex: 1 }} className="hero-grid">

        {/* LEFT — Text */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '140px 56px 80px 72px' }}>

          {/* Tag */}
          <div className="h-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32, width: 'fit-content' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--orange)', animation: 'pulse 2s infinite' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
              {restaurant.city || 'Houston'}{restaurant.est ? ` · Est. ${restaurant.est}` : ''}
            </span>
          </div>

          {/* Massive headline */}
          <h1 className="h-title" style={{
            fontFamily: "'Syne', 'DM Sans', sans-serif",
            fontSize: 'clamp(52px, 7vw, 110px)',
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: '-3px',
            color: 'var(--white)',
            marginBottom: 28,
          }}>
            {name.split(' ').map((word, i) => (
              <span key={i} style={{ display: 'block', color: i % 3 === 1 ? 'var(--orange)' : 'var(--white)' }}>
                {word}
              </span>
            ))}
          </h1>

          {/* Subline */}
          {(restaurant.hero_subheadline || restaurant.tagline) && (
            <p className="h-sub" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 44, maxWidth: 380, fontWeight: 300 }}>
              {restaurant.hero_subheadline || restaurant.tagline}
            </p>
          )}

          {/* CTAs */}
          <div className="h-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            {links?.order_url && (
              <a href={links.order_url} target="_blank" rel="noreferrer"
                onClick={() => trackEvent(restaurant.id, 'order_click')}
                className="btn-orange">
                Order Now →
              </a>
            )}
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer"
                onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                className="btn-outline">
                Reserve
              </a>
            )}
            <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontFamily: 'DM Sans', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 4, transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = 'var(--orange)'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}>
              See the menu
            </button>
          </div>

          {/* Stats row */}
          <div className="h-ctas" style={{ display: 'flex', gap: 40, marginTop: 64, paddingTop: 40, borderTop: '1px solid var(--border)' }}>
            {[['5★', 'Rated'], ['10+', 'Years open'], ['100%', 'Fresh daily']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--orange)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Photo */}
        <div className="h-img" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 56px 80px 0' }}>

          {/* Orange block behind photo */}
          <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '70%', height: '65%', background: 'var(--orange)', borderRadius: 4, zIndex: 0 }} />

          {/* Photo */}
          <div style={{ position: 'relative', zIndex: 1, width: '85%', aspectRatio: '4/5', overflow: 'hidden', borderRadius: 4, boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
            {heroPhoto?.url ? (
              <img src={heroPhoto.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a1a, #2a1a08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 64, color: 'rgba(255,92,0,0.3)' }}>🍽</span>
              </div>
            )}
          </div>

          {/* Floating badge */}
          <div style={{
            position: 'absolute', top: '18%', left: '8%', zIndex: 2,
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
          }}>
            <svg className="spin-badge" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 100 100">
              <path id="circle" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="none" />
              <text fontSize="9.5" fill="white" letterSpacing="3" fontFamily="DM Sans">
                <textPath href="#circle">ORDER NOW • FRESH DAILY • </textPath>
              </text>
            </svg>
            <span style={{ fontSize: 28 }}>🔥</span>
          </div>

          {/* Phone number pill */}
          {links?.phone && (
            <a href={`tel:${links.phone}`} style={{
              position: 'absolute', bottom: '18%', left: '4%', zIndex: 2,
              background: 'var(--card)', border: '1px solid var(--border)',
              padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 10,
              borderRadius: 40
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s infinite' }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'var(--cream)', fontWeight: 600 }}>{links.phone}</span>
            </a>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; min-height: auto !important; }
          .hero-grid > div:first-child { padding: 130px 28px 40px !important; }
          .hero-grid > div:last-child { padding: 0 28px 60px !important; }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,92,0,0.5); }
          70% { box-shadow: 0 0 0 8px rgba(255,92,0,0); }
        }
      `}</style>
    </div>
  )
}
