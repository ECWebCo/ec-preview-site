export default function Hero({ restaurant, heroPhoto }) {
  // Header is ~112px tall (two rows)
  return (
    <div style={{ paddingTop: 112 }}>
      {/* Full-bleed photo — hero IS the photo, nothing else */}
      <div style={{
        width: '100%',
        height: 'calc(100vh - 112px)',
        minHeight: 480,
        position: 'relative',
        overflow: 'hidden',
        background: '#e8e4de',
      }}>
        {heroPhoto?.url ? (
          <img
            src={heroPhoto.url}
            alt={restaurant.name}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              animation: 'heroScale 8s ease-in-out infinite alternate'
            }}
          />
        ) : (
          /* Placeholder when no photo — tasteful neutral */
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #f0ebe3 0%, #e0d8cc 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16
          }}>
            <div style={{ fontSize: 64, opacity: 0.3 }}>🍽</div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: '#bbb', letterSpacing: 2, textTransform: 'uppercase' }}>Add a hero photo in your dashboard</p>
          </div>
        )}

        {/* Tiny restaurant name watermark bottom-left — subtle, not dominant */}
        <div style={{
          position: 'absolute', bottom: 32, left: 40,
          animation: 'fadeIn 1.5s ease 0.5s both'
        }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 13, fontStyle: 'italic',
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.5px',
            textShadow: '0 1px 8px rgba(0,0,0,0.3)'
          }}>
            {restaurant.city || ''}
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          animation: 'fadeIn 2s ease 1s both'
        }}>
          <div style={{
            width: 1, height: 48,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.6), transparent)'
          }} />
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes heroScale {
          from { transform: scale(1); }
          to   { transform: scale(1.04); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @media (max-width: 768px) {
          div[style*="paddingTop: 112"] { padding-top: 96px !important; }
        }
      `}</style>
    </div>
  )
}
