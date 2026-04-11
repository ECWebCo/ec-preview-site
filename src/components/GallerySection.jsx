import { useRef, useEffect } from 'react'

function useReveal(ref, threshold = 0.1) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
}

export default function GallerySection({ photos, restaurant }) {
  const headerRef = useRef(null)
  useReveal(headerRef)

  if (!photos?.length) return null

  const [p0, p1, p2, p3, p4, p5] = photos

  return (
    <section id="gallery-section" style={{ background: 'var(--charcoal)', overflow: 'hidden' }}>
      {/* Header */}
      <div ref={headerRef} className="reveal" style={{ padding: '100px 56px 60px', maxWidth: 1080, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>Gallery</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-1px' }}>
              The{' '}
              <em style={{ fontWeight: 400, color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}>Experience</em>
            </h2>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', maxWidth: 280, lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans' }}>
            Every visit tells a story. Every plate, a memory.
          </p>
        </div>
      </div>

      {/* Full-bleed grid — no padding */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'auto', gap: 4 }} className="gallery-grid-main">

        {/* Big feature left */}
        {p0 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 7', gridRow: 'span 2', minHeight: 520, background: 'var(--stone)' }}>
            <img src={p0.url} alt={restaurant.name} />
            <div className="overlay">
              <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: 18, color: '#fff' }}>{restaurant.name}</span>
            </div>
          </div>
        )}

        {/* Top right */}
        {p1 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 256, background: 'var(--stone)' }}>
            <img src={p1.url} alt={restaurant.name} />
            <div className="overlay" />
          </div>
        )}

        {/* Bottom right top */}
        {p2 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 256, background: 'var(--stone)' }}>
            <img src={p2.url} alt={restaurant.name} />
            <div className="overlay" />
          </div>
        )}

        {/* Bottom row */}
        {p3 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: 'var(--stone)' }}>
            <img src={p3.url} alt={restaurant.name} />
            <div className="overlay" />
          </div>
        )}
        {p4 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: 'var(--stone)' }}>
            <img src={p4.url} alt={restaurant.name} />
            <div className="overlay" />
          </div>
        )}
        {p5 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: 'var(--stone)', position: 'relative' }}>
            <img src={p5.url} alt={restaurant.name} />
            <div className="overlay">
              {photos.length > 6 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1 }}>+{photos.length - 6}</span>
                  <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>More Photos</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-section > div:first-child { padding: 72px 24px 40px !important; }
          .gallery-grid-main { grid-template-columns: repeat(2, 1fr) !important; }
          .gallery-grid-main > div {
            grid-column: span 1 !important;
            grid-row: span 1 !important;
            min-height: 180px !important;
          }
        }
      `}</style>
    </section>
  )
}
