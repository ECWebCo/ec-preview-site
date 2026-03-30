import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  return (
    <div style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'flex-start', overflow: 'hidden',
      background: 'var(--stone)'
    }}>
      {heroPhoto?.url ? (
        <img src={heroPhoto.url} alt={restaurant.name} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center'
        }} />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 60% 40%, #3D2010 0%, #1A0D05 50%, #0D0805 100%)' }} />
      )}

      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.2) 100%)'
      }} />

      <div style={{ position: 'relative', padding: '110px 48px 48px', width: '100%' }} id="hero-content">

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 28, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {restaurant.city || 'Houston, Texas'}{restaurant.est ? ` · Est. ${restaurant.est}` : ''}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#fff',
          lineHeight: 0.95, marginBottom: 24, fontSize: 'clamp(42px, 7vw, 96px)'
        }}>
          {restaurant.hero_headline || restaurant.name}<br />
          <em style={{ fontWeight: 400, color: 'var(--gold)', fontStyle: 'italic' }}>
            {restaurant.hero_subheadline || restaurant.tagline || 'Crafted with Heart'}
          </em>
        </h1>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              style={{ padding: '14px 28px', background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textDecoration: 'none' }}>
              Reserve a Table
            </a>
          )}
          <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
            View Menu
          </button>
        </div>

        {restaurant.description && (
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', maxWidth: 420, lineHeight: 1.7, fontWeight: 300 }}>
            {restaurant.description}
          </p>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero-content { padding: 90px 24px 40px !important; }
          #hero-content h1 { font-size: 36px !important; line-height: 1.05 !important; margin-bottom: 20px !important; }
          #hero-content p { font-size: 14px !important; }
        }
      `}</style>
    </div>
  )
}
