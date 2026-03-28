export default function GallerySection({ photos, restaurant }) {
  if (!photos?.length) return null

  // Layout: first photo is large, rest fill grid
  const [hero, ...rest] = photos

  return (
    <section id="gallery-section" style={{ padding: '96px 48px', background: 'var(--ink)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Gallery</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 48 }}>
          A Taste of the<br /><em style={{ fontWeight: 400 }}>Experience</em>
        </h2>

        {/* Asymmetric grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto', gap: 8 }} className="gallery-grid">
          {hero && (
            <div style={{ gridColumn: 'span 7', gridRow: 'span 2', minHeight: 400, overflow: 'hidden', background: 'var(--stone)' }}>
              <img src={hero.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'} />
            </div>
          )}
          {rest.slice(0, 5).map((photo, i) => (
            <div key={photo.id} style={{
              gridColumn: i < 2 ? 'span 5' : 'span 4',
              minHeight: i < 2 ? 195 : 220,
              overflow: 'hidden', background: 'var(--stone)'
            }}>
              <img src={photo.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
                onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
                onMouseOut={e => e.target.style.transform = 'scale(1)'} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-section { padding: 64px 24px !important; }
          .gallery-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-grid > div { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 160px !important; }
        }
      `}</style>
    </section>
  )
}
