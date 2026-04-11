import { useEffect, useRef } from 'react'
import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  const imgRef = useRef(null)

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const name = restaurant.hero_headline || restaurant.name || 'The Restaurant'
  const words = name.split(' ')

  return (
    <div style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
      overflow: 'hidden', background: 'var(--charcoal)'
    }}>
      {/* Parallax background */}
      <div ref={imgRef} style={{
        position: 'absolute', inset: '-15% 0',
        willChange: 'transform'
      }}>
        {heroPhoto?.url ? (
          <img src={heroPhoto.url} alt={restaurant.name} style={{
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center'
          }} />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'radial-gradient(ellipse at 65% 40%, #3D2010 0%, #1A0D05 50%, #0D0805 100%)' }} />
        )}
      </div>

      {/* Multi-layer overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 60%, rgba(0,0,0,0.5) 100%)' }} />

      {/* Decorative vertical line */}
      <div style={{
        position: 'absolute', left: 48, top: 0, bottom: 0, width: 1,
        background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.4) 30%, rgba(201,168,76,0.4) 70%, transparent)',
      }} className="hero-line-left" />

      {/* Corner decoration */}
      <svg style={{ position: 'absolute', top: 80, right: 60, opacity: 0.12 }} width="180" height="180" viewBox="0 0 180 180" fill="none">
        <circle cx="90" cy="90" r="88" stroke="#C9A84C" strokeWidth="1"/>
        <circle cx="90" cy="90" r="68" stroke="#C9A84C" strokeWidth="0.5"/>
        <circle cx="90" cy="90" r="48" stroke="#C9A84C" strokeWidth="0.5"/>
        <line x1="90" y1="2" x2="90" y2="178" stroke="#C9A84C" strokeWidth="0.5"/>
        <line x1="2" y1="90" x2="178" y2="90" stroke="#C9A84C" strokeWidth="0.5"/>
      </svg>

      {/* Content — left-aligned */}
      <div style={{ position: 'relative', padding: '140px 80px 100px', width: '100%', maxWidth: 900 }} id="hero-content">

        {/* Eyebrow */}
        <div className="hero-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div style={{ width: 40, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', fontWeight: 400 }}>
            {restaurant.city || 'Houston, Texas'}{restaurant.est ? `\u2002·\u2002Est. ${restaurant.est}` : ''}
          </span>
        </div>

        {/* Title — massive, stacked words */}
        <h1 className="hero-title" style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#fff',
          lineHeight: 0.92, marginBottom: 32, fontSize: 'clamp(56px, 9vw, 130px)',
          letterSpacing: '-1px'
        }}>
          {words.map((word, i) => (
            <span key={i} style={{
              display: 'block',
              fontStyle: i % 2 === 1 ? 'italic' : 'normal',
              color: i === words.length - 1 ? 'transparent' : '#fff',
              WebkitTextStroke: i === words.length - 1 ? '1px rgba(255,255,255,0.5)' : '0',
            }}>
              {word}
            </span>
          ))}
        </h1>

        {/* Divider with diamond */}
        <div className="hero-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, maxWidth: 80, height: 1, background: 'var(--gold)' }} />
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 10,5 5,10 0,5" fill="#C9A84C"/></svg>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', flex: 1, maxWidth: 300 }} />
        </div>

        {(restaurant.hero_subheadline || restaurant.tagline) && (
          <p className="hero-subtitle" style={{
            fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400,
            color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(17px, 2vw, 26px)',
            marginBottom: 48, lineHeight: 1.5, maxWidth: 500
          }}>
            {restaurant.hero_subheadline || restaurant.tagline}
          </p>
        )}

        {/* CTAs */}
        <div className="hero-ctas" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              className="btn-gold">
              Reserve a Table
            </a>
          )}
          <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-ghost" style={{ cursor: 'none' }}>
            Explore Menu
          </button>
          {links?.order_url && (
            <a href={links.order_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'order_click')}
              style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 2, transition: 'color 0.3s' }}
              onMouseOver={e => e.target.style.color = 'var(--gold)'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
              Order Online →
            </a>
          )}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="hero-scroll-hint" style={{
        position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10
      }}>
        <span style={{ fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans' }}>Scroll</span>
        <div style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
            background: 'var(--gold)',
            animation: 'float 2s ease-in-out infinite'
          }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero-content { padding: 140px 28px 80px !important; }
          .hero-line-left { display: none !important; }
        }
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(48px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
