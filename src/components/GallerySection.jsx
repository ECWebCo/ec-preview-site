import { useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

export default function GallerySection({ photos, restaurant }) {
  const ref = useRef(null); useReveal(ref)
  if (!photos?.length) return null
  const [p0, p1, p2, p3, p4, p5] = photos

  return (
    <section id="gallery-section" style={{ padding: '96px 0', background: 'var(--section)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: 14 }}>Gallery</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, fontStyle: 'italic' }}>
            See for Yourself
          </h2>
        </div>
      </div>

      {/* Full-bleed grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6 }} className="g-grid">
        {p0 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 7', gridRow: 'span 2', minHeight: 480, background: '#ddd' }}>
            <img src={p0.url} alt={restaurant.name} />
          </div>
        )}
        {p1 && <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 237, background: '#ddd' }}><img src={p1.url} alt={restaurant.name} /></div>}
        {p2 && <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 237, background: '#ddd' }}><img src={p2.url} alt={restaurant.name} /></div>}
        {p3 && <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#ddd' }}><img src={p3.url} alt={restaurant.name} /></div>}
        {p4 && <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#ddd' }}><img src={p4.url} alt={restaurant.name} /></div>}
        {p5 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#ddd', position: 'relative' }}>
            <img src={p5.url} alt={restaurant.name} />
            {photos.length > 6 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontFamily: 'DM Sans', fontSize: 36, fontWeight: 700, color: '#fff' }}>+{photos.length - 6}</span>
                <span style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans' }}>More</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-section { padding: 72px 0 !important; }
          #gallery-section > div { padding: 0 24px !important; }
          .g-grid { grid-template-columns: repeat(2,1fr) !important; }
          .g-grid > div { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 160px !important; }
        }
      `}</style>
    </section>
  )
}
