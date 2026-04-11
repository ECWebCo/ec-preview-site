import { useState, useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const ref = useRef(null); useReveal(ref)

  if (!sections?.length) return null

  const activeSection = sections[activeTab]
  const available = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOut = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...available, ...soldOut]

  return (
    <section id="menu-section" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>

        {/* Header */}
        <div ref={ref} className="reveal" style={{ marginBottom: 56, textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: 14 }}>Our Menu</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.1, fontStyle: 'italic' }}>
            Fresh, Made to Order
          </h2>
        </div>

        {/* Tabs */}
        {sections.length > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderBottom: '2px solid var(--border)', marginBottom: 0, overflowX: 'auto' }}>
            {sections.map((s, i) => (
              <button key={s.id} onClick={() => setActiveTab(i)} style={{
                padding: '12px 28px', fontSize: 13, border: 'none', background: 'none',
                fontFamily: 'DM Sans', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
                color: activeTab === i ? 'var(--ink)' : 'var(--muted)',
                borderBottom: activeTab === i ? '2px solid var(--ink)' : '2px solid transparent',
                marginBottom: -2, transition: 'all 0.2s', letterSpacing: '0.2px'
              }}>{s.name}</button>
            ))}
          </div>
        )}

        {/* Items */}
        <div style={{ marginTop: sections.length > 1 ? 0 : 0 }}>
          {allItems.map((item) => (
            <div key={item.id} className="menu-item" style={{ opacity: item.available === false ? 0.4 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: item.description ? 6 : 0 }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 19, fontWeight: 700, color: 'var(--ink)' }}>
                    {item.name}
                  </span>
                  {item.available === false && (
                    <span style={{ fontSize: 10, padding: '2px 8px', background: '#f0f0f0', color: '#999', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Sold Out
                    </span>
                  )}
                </div>
                {item.description && (
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 520, fontFamily: 'DM Sans', fontWeight: 400 }}>
                    {item.description}
                  </p>
                )}
              </div>
              {item.price && (
                <div style={{ fontFamily: 'DM Sans', fontSize: 18, fontWeight: 700, color: 'var(--ink)', flexShrink: 0, paddingTop: 2 }}>
                  ${Number(item.price).toFixed(2)}
                </div>
              )}
            </div>
          ))}
          {allItems.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14, padding: '48px 0', textAlign: 'center', fontFamily: 'DM Sans' }}>Menu coming soon.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-section { padding: 72px 0 !important; }
          #menu-section > div { padding: 0 24px !important; }
        }
      `}</style>
    </section>
  )
}
