import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  return (
    <div id="hero-wrap" style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', background: 'var(--stone)'
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
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)'
      }} />

      <div style={{ position: 'relative', textAlign: 'center', padding: '120px 48px 80px', width: '100%', maxWidth: 800, margin: '0 auto' }} id="hero-content">

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {restaurant.city || 'Houston, Texas'}{restaurant.est ? ` · Est. ${restaurant.est}` : ''}
          </span>
          <div style={{ width: 28, height: 1, background: 'var(--gold)' }} />
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#fff',
          lineHeight: 1.0, marginBottom: 16, fontSize: 'clamp(42px, 7vw, 96px)'
        }}>
          {restaurant.hero_headline || restaurant.name}
        </h1>

        {(restaurant.hero_subheadline || restaurant.tagline) && (
          <p style={{
            fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--gold)', fontSize: 'clamp(18px, 2.5vw, 36px)', marginBottom: 36, lineHeight: 1.3
          }}>
            {restaurant.hero_subheadline || restaurant.tagline}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              style={{ padding: '14px 28px', background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textDecoration: 'none' }}>
              Reserve a Table
            </a>
          )}
          <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.6)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer' }}>
            View Menu
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero-wrap { min-height: calc(100vh - 68px) !important; }
          #hero-content { padding: 72px 24px 40px !important; }
          #hero-content h1 { font-size: 36px !important; }
          #hero-content p { font-size: 20px !important; margin-bottom: 28px !important; }
        }
      `}</style>
    </div>
  )
}
