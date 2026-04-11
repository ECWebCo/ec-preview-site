import { useState, useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.06 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

function MenuItem({ item, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = item.available === false ? '0.4' : '1'
          el.style.transform = 'translateY(0)'
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="menu-item"
      style={{
        opacity: 0,
        transform: 'translateY(18px)',
        transition: `opacity 0.55s ease ${Math.min(index * 0.055, 0.4)}s, transform 0.55s ease ${Math.min(index * 0.055, 0.4)}s, padding-left 0.35s ease, background 0.2s ease`
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: item.description ? 5 : 0 }}>
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: 'var(--ink)', fontStyle: 'italic' }}>
            {item.name}
          </span>
          {item.available === false && (
            <span style={{ fontSize: 9, padding: '2px 8px', background: '#f0f0f0', color: '#aaa', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
              86'd
            </span>
          )}
        </div>
        {item.description && (
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 500, fontFamily: 'DM Sans', fontWeight: 400 }}>
            {item.description}
          </p>
        )}
      </div>
      {item.price && (
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 400, color: 'var(--accent)', flexShrink: 0, paddingTop: 2, letterSpacing: '-0.3px' }}>
          ${Number(item.price).toFixed(2)}
        </div>
      )}
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const headerRef = useRef(null); useReveal(headerRef)

  if (!sections?.length) return null
  const activeSection = sections[activeTab]
  const available = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOut = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...available, ...soldOut]

  return (
    <section id="menu-section" style={{ background: '#fff', paddingBottom: 120 }}>

      {/* Editorial intro — alternating color strip */}
      <div style={{ background: 'var(--section)', padding: '88px 0 80px', borderBottom: '1px solid var(--border)' }}>
        <div ref={headerRef} className="reveal" style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }} id="menu-intro-wrap">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} id="menu-intro">
            <div>
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'inline-block', width: 36, height: 1, background: 'var(--accent)' }} />
                Our Menu
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(40px, 5.5vw, 70px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.0, letterSpacing: '-0.5px' }}>
                Fresh Made,<br />Every Day.
              </h2>
            </div>
            <div style={{ paddingTop: 8 }}>
              <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.85, fontFamily: 'DM Sans', fontWeight: 300, marginBottom: 28 }}>
                Everything on our menu is prepared fresh to order using quality ingredients. No shortcuts, no freezer food — just real cooking made with care.
              </p>
              <div style={{ width: 40, height: 1, background: 'var(--border)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — sticky below the nav header */}
      {sections.length > 1 && (
        <div style={{ borderBottom: '1px solid var(--border)', position: 'sticky', top: 112, background: '#fff', zIndex: 10 }}>
          <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px', display: 'flex', overflowX: 'auto' }}>
            {sections.map((s, i) => (
              <button key={s.id} onClick={() => setActiveTab(i)} style={{
                padding: '16px 28px', fontSize: 11, border: 'none', background: 'none',
                fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase',
                whiteSpace: 'nowrap', cursor: 'pointer',
                color: activeTab === i ? 'var(--ink)' : '#bbb',
                borderBottom: activeTab === i ? '2px solid var(--ink)' : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.25s'
              }}>
                {s.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Items list */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>
        <div style={{ paddingTop: 8 }}>
          {allItems.map((item, i) => <MenuItem key={item.id} item={item} index={i} />)}
          {allItems.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14, padding: '56px 0', textAlign: 'center', fontFamily: 'DM Sans', fontStyle: 'italic' }}>Menu coming soon.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-intro-wrap { padding: 0 24px !important; }
          #menu-intro { grid-template-columns: 1fr !important; gap: 24px !important; }
          #menu-section > div:last-child > div { padding: 0 24px !important; }
          #menu-section > div[style*="sticky"] > div { padding: 0 16px !important; }
        }
      `}</style>
    </section>
  )
}
