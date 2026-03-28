import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  return (
    <div style={{
      minHeight: '100vh', position: 'relative',
      display: 'flex', alignItems: 'flex-end', overflow: 'hidden',
      background: 'var(--stone)'
    }}>
      {/* Hero image */}
      {heroPhoto?.url ? (
        <img src={heroPhoto.url} alt={restaurant.name} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center'
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 60% 40%, #3D2010 0%, #1A0D05 50%, #0D0805 100%)'
        }} />
      )}

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.15) 100%)'
      }} />

      {/* Content */}
      <div style={{ position: 'relative', padding: '0 48px 80px', width: '100%' }} className="hero-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {restaurant.city || 'Houston, Texas'} · Est. {restaurant.est || new Date().getFullYear()}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Playfair Display, serif', fontWeight: 900, color: '#fff',
          lineHeight: 0.95, marginBottom: 32, fontSize: 'clamp(48px, 8vw, 96px)'
        }}>
          {restaurant.hero_headline || restaurant.name}<br />
          <em style={{ fontWeight: 400, color: 'var(--gold)', fontStyle: 'italic' }}>
            {restaurant.hero_subheadline || 'Crafted with Heart'}
          </em>
        </h1>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 400, lineHeight: 1.7, fontWeight: 300 }}>
            {restaurant.description || 'Handmade pasta, wood-fired meats, and old-world recipes passed down through generations.'}
          </p>
          <div style={{ display: 'flex', gap: 12, flexShrink: 0, flexWrap: 'wrap' }}>
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer"
                onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                style={{ padding: '16px 36px', background: 'var(--gold)', color: '#fff', border: 'none', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>
                Reserve a Table
              </a>
            )}
            <button onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '16px 36px', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
              View Menu
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-content { padding: 0 24px 56px !important; }
        }
      `}</style>
    </div>
  )
}
