import { useRef, useEffect } from 'react'

function Rev({ children, cls = 'reveal', delay = 0, style = {} }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return <div ref={ref} className={cls} style={{ transitionDelay: `${delay}s`, ...style }}>{children}</div>
}

export default function GallerySection({ photos, restaurant }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (!photos?.length) return null
  const [p0, p1, p2, p3, p4, p5] = photos

  return (
    <section id="gallery-section" style={{ background: 'var(--section)', overflow: 'hidden' }}>
      <div style={{ padding: '88px 48px 56px', maxWidth: 960, margin: '0 auto' }}>
        <div ref={ref} className="reveal" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ display: 'inline-block', width: 36, height: 1, background: 'var(--accent)' }} />Gallery
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.05 }}>
              See for Yourself
            </h2>
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 260, lineHeight: 1.8, fontFamily: 'DM Sans', fontWeight: 300 }}>
            Every visit is a fresh experience. Come hungry.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
        {p0 && (
          <Rev cls="reveal-scale" style={{ gridColumn: 'span 7', gridRow: 'span 2', minHeight: 520, background: '#ddd', overflow: 'hidden', position: 'relative' }}>
            <img src={p0.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'} />
          </Rev>
        )}
        {[p1, p2, p3, p4].filter(Boolean).map((p, i) => (
          <Rev key={i} delay={i * 0.08} style={{ gridColumn: i < 2 ? 'span 5' : 'span 4', minHeight: i < 2 ? 258 : 260, background: '#ddd', overflow: 'hidden', position: 'relative' }}>
            <img src={p.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'} />
          </Rev>
        ))}
        {p5 && (
          <Rev delay={0.32} style={{ gridColumn: 'span 4', minHeight: 260, background: '#ddd', overflow: 'hidden', position: 'relative' }}>
            <img src={p5.url} alt={restaurant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease', display: 'block' }}
              onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.target.style.transform = 'scale(1)'} />
            {photos.length > 6 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 44, fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)' }}>+{photos.length - 6}</span>
                <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'DM Sans' }}>more photos</span>
              </div>
            )}
          </Rev>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #gallery-section > div:first-child { padding: 64px 24px 40px !important; }
          #gallery-section > div:last-child { grid-template-columns: repeat(2,1fr) !important; }
          #gallery-section > div:last-child > div { grid-column: span 1 !important; grid-row: span 1 !important; min-height: 180px !important; }
        }
      `}</style>
    </section>
  )
}
