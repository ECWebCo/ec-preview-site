import { trackEvent } from '../lib/supabase'

export default function Hero({ restaurant, heroPhoto, links }) {
  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1a'
    }}>
      {/* Full bleed photo — this IS the hero */}
      {heroPhoto?.url ? (
        <img
          src={heroPhoto.url}
          alt={restaurant.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center'
          }}
        />
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #2a1a08 0%, #1a1208 50%, #0d0805 100%)'
        }} />
      )}

      {/* Subtle dark gradient so text is readable — bottom-heavy like Burger Joint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.15) 100%)'
      }} />

      {/* Content — centered, clean */}
      <div style={{
        position: 'relative',
        textAlign: 'center',
        padding: '0 24px',
        width: '100%',
        maxWidth: 900,
        zIndex: 1
      }}>
        {/* Restaurant name — big, script-style if logo, else big serif */}
        {restaurant.logo_url ? (
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              height: 180, width: 'auto', objectFit: 'contain',
              margin: '0 auto 32px',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.5))'
            }}
          />
        ) : (
          <h1 style={{
            fontFamily: "'Playfair Display', 'Georgia', serif",
            fontSize: 'clamp(52px, 9vw, 120px)',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#fff',
            lineHeight: 1,
            marginBottom: 24,
            textShadow: '0 4px 32px rgba(0,0,0,0.5)',
            letterSpacing: '-1px'
          }}>
            {restaurant.name}
          </h1>
        )}

        {/* Tagline */}
        {(restaurant.hero_subheadline || restaurant.tagline) && (
          <p style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(15px, 2vw, 20px)',
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 40,
            fontWeight: 400,
            letterSpacing: '0.3px',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)'
          }}>
            {restaurant.hero_subheadline || restaurant.tagline}
          </p>
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          {links?.order_url && (
            <a
              href={links.order_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'order_click')}
              className="btn-primary"
              style={{ fontSize: 15, padding: '18px 48px' }}
            >
              Order Online
            </a>
          )}
          {links?.reservation_url && (
            <a
              href={links.reservation_url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent(restaurant.id, 'reserve_click')}
              style={{
                display: 'inline-block',
                padding: '17px 48px',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '2px solid rgba(255,255,255,0.7)',
                color: '#fff',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)' }}
            >
              Reserve a Table
            </a>
          )}
          {!links?.order_url && !links?.reservation_url && (
            <button
              onClick={() => document.getElementById('menu-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary"
              style={{ fontSize: 15, padding: '18px 48px' }}
            >
              View Menu
            </button>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8
      }}>
        <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)' }} />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
    </div>
  )
}
