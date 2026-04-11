import { useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

export default function GallerySection({ photos, restaurant }) {
  const headerRef = useRef(null); useReveal(headerRef)
  if (!photos?.length) return null
  const [p0, p1, p2, p3, p4, p5] = photos

  return (
    <section id="gallery-section" style={{ background: '#0d0d0d', overflow: 'hidden' }}>
      <div ref={headerRef} className="reveal" style={{ padding: '100px 56px 56px', maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', marginBottom: 20 }}>Photos</div>
          <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(44px,6vw,72px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px' }}>
            Come see<br /><span style={{ color: 'var(--orange)' }}>for yourself.</span>
          </h2>
        </div>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.3)', maxWidth: 280, lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans' }}>
          Every visit is different. Every plate, a memory worth making.
        </p>
      </div>

      {/* Grid — full bleed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }} className="g-grid">
        {p0 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 7', gridRow: 'span 2', minHeight: 500, background: '#1a1a1a' }}>
            <img src={p0.url} alt={restaurant.name} />
            <div className="g-overlay"><span style={{ fontFamily: 'DM Sans', fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: '-0.5px' }}>{restaurant.name}</span></div>
          </div>
        )}
        {p1 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 248, background: '#1a1a1a' }}>
            <img src={p1.url} alt={restaurant.name} />
            <div className="g-overlay" />
          </div>
        )}
        {p2 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 5', minHeight: 248, background: '#1a1a1a' }}>
            <img src={p2.url} alt={restaurant.name} />
            <div className="g-overlay" />
          </div>
        )}
        {p3 && <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#1a1a1a' }}><img src={p3.url} alt={restaurant.name} /><div className="g-overlay" /></div>}
        {p4 && <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#1a1a1a' }}><img src={p4.url} alt={restaurant.name} /><div className="g-overlay" /></div>}
        {p5 && (
          <div className="gallery-cell" style={{ gridColumn: 'span 4', minHeight: 260, background: '#1a1a1a', position: 'relative' }}>
            <img src={p5.url} alt={restaurant.name} />
            <div className="g-overlay">
              {photos.length > 6 && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 40, fontWeight: 800, color: '#fff' }}>+{photos.length - 6}</span>
                  <span style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)', fontFamily: 'DM Sans', fontWeight: 700 }}>More</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-section > div:first-child { padding: 72px 24px 40px !important; }
          .g-grid { grid-template-columns: repeat(2,1fr) !important; }
          .g-grid > div { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 180px !important; }
        }
      `}</style>
    </section>
  )
}
