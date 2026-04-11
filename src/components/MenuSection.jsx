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
  const headerRef = useRef(null); useReveal(headerRef)

  if (!sections?.length) return null

  const activeSection = sections[activeTab]
  const available = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOut = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...available, ...soldOut]

  return (
    <section id="menu-section" style={{ padding: '120px 0', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>

      {/* BG number */}
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'DM Sans', fontSize: 'clamp(160px,22vw,320px)', fontWeight: 800, color: 'rgba(255,255,255,0.02)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>MENU</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px' }}>

        {/* Header */}
        <div ref={headerRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginBottom: 72, alignItems: 'end' }} id="menu-header">
          <div>
            <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', marginBottom: 24 }}>
              What We Serve
            </div>
            <h2 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(44px,6vw,80px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px' }}>
              Made<br /><span style={{ color: 'var(--orange)' }}>Fresh.</span><br />Every Day.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, fontWeight: 300, fontFamily: 'DM Sans' }}>
              Everything on our menu is prepared fresh to order. Real ingredients, real flavor, no shortcuts.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 0, overflowX: 'auto' }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveTab(i)} style={{
              padding: '14px 28px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
              border: 'none', background: 'none', fontFamily: 'DM Sans', fontWeight: 700,
              whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 0.25s',
              color: activeTab === i ? 'var(--orange)' : 'rgba(255,255,255,0.3)',
              borderBottom: activeTab === i ? '2px solid var(--orange)' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div>
          {allItems.map((item, i) => (
            <div key={item.id} className="menu-item" style={{ opacity: item.available === false ? 0.4 : 1 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                    {item.name}
                  </span>
                  {item.available === false && (
                    <span style={{ fontSize: 9, padding: '3px 10px', background: '#333', color: '#666', fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
                      Sold Out
                    </span>
                  )}
                </div>
                {item.description && (
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', fontWeight: 300, lineHeight: 1.6, maxWidth: 540, fontFamily: 'DM Sans' }}>
                    {item.description}
                  </p>
                )}
              </div>
              {item.price && (
                <div style={{ fontFamily: 'DM Sans', fontSize: 22, fontWeight: 800, color: 'var(--orange)', letterSpacing: '-0.5px', flexShrink: 0, paddingTop: 2 }}>
                  ${Number(item.price).toFixed(0)}
                </div>
              )}
            </div>
          ))}
          {allItems.length === 0 && (
            <p style={{ color: '#444', fontSize: 14, padding: '48px 0', fontFamily: 'DM Sans' }}>Menu coming soon.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-section { padding: 80px 0 !important; }
          #menu-section > div { padding: 0 24px !important; }
          #menu-header { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 48px !important; }
        }
      `}</style>
    </section>
  )
}
