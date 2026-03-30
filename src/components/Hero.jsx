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
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.15) 100%)'
      }} />

      <div style={{ position: 'relative', padding: '110px 48px 48px', width: '100%', maxWidth: 680 }} id="hero-content">

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{ width: 28, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {restaurant.city || 'Houston, Texas'}{restaurant.est ? ` · Est. ${restaurant.est}` : ''}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#fff',
          lineHeight: 1, marginBottom: 12, fontSize: 'clamp(36px, 5.5vw, 76px)'
        }}>
          {restaurant.hero_headline || restaurant.name}
        </h1>

        {(restaurant.hero_subheadline || restaurant.tagline) && (
          <p style={{
            fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400,
            color: 'var(--gold)', fontSize: 'clamp(20px, 3vw, 40px)', marginBottom: 28, lineHeight: 1.2
          }}>
            {restaurant.hero_subheadline || restaurant.tagline}
          </p>
        )}

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              style={{ padding: '13px 26px', background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textDecoration: 'none' }}>
              Reserve a Table
            </a>
          )}
          <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '13px 26px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.6)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            View Menu
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero-content { padding: 86px 24px 40px !important; max-width: 100% !important; }
          #hero-content h1 { font-size: 32px !important; margin-bottom: 8px !important; }
          #hero-content p { font-size: 18px !important; margin-bottom: 22px !important; }
        }
      `}</style>
    </div>
  )
}
