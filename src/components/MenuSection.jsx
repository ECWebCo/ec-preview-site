import { useState, useEffect, useRef } from 'react'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

function RevealEl({ className = 'reveal', delay = '', children, tag: Tag = 'div', style = {} }) {
  const ref = useRef(null)
  useReveal(ref)
  return <Tag ref={ref} className={`${className} ${delay}`} style={style}>{children}</Tag>
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!sections?.length) return null

  const activeSection = sections[activeTab]
  const availableItems = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOutItems = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...availableItems, ...soldOutItems]

  return (
    <section id="menu-section" style={{ padding: '120px 0', background: 'var(--off)', position: 'relative', overflow: 'hidden' }}>
      {/* Massive background number */}
      <div style={{
        position: 'absolute', right: -40, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'Playfair Display, serif', fontSize: 'clamp(200px, 25vw, 380px)',
        fontWeight: 900, color: 'rgba(0,0,0,0.025)', lineHeight: 1,
        userSelect: 'none', pointerEvents: 'none'
      }}>01</div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 56px' }}>
        {/* Header split layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 80, alignItems: 'end' }} className="menu-header-grid">
          <div>
            <RevealEl className="reveal-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
                <span style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>The Menu</span>
              </div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 0.9, letterSpacing: '-1px' }}>
                Crafted<br />
                <em style={{ fontWeight: 400, WebkitTextStroke: '1.5px var(--ink)', color: 'transparent' }}>
                  with Soul
                </em>
              </h2>
            </RevealEl>
          </div>
          <div>
            <RevealEl delay="delay-2">
              <p style={{ fontSize: 16, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.8, marginBottom: 0 }}>
                Every dish begins with the finest ingredients — sourced with care, prepared daily, and inspired by generations of tradition.
              </p>
            </RevealEl>
          </div>
        </div>

        {/* Tab bar — minimal, architectural */}
        <RevealEl delay="delay-1">
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--mist)', marginBottom: 0, overflowX: 'auto' }}>
            {sections.map((s, i) => (
              <button key={s.id} onClick={() => setActiveTab(i)} style={{
                padding: '16px 32px', fontSize: 10, letterSpacing: 3,
                textTransform: 'uppercase', border: 'none', background: 'none',
                fontFamily: 'DM Sans', whiteSpace: 'nowrap', cursor: 'none',
                color: activeTab === i ? 'var(--ink)' : 'var(--muted)',
                borderBottom: activeTab === i ? '2px solid var(--gold)' : '2px solid transparent',
                marginBottom: -1, fontWeight: activeTab === i ? 600 : 400,
                transition: 'all 0.25s',
                position: 'relative'
              }}
                onMouseOver={e => { if (activeTab !== i) e.currentTarget.style.color = 'var(--ink)' }}
                onMouseOut={e => { if (activeTab !== i) e.currentTarget.style.color = 'var(--muted)' }}
              >
                {s.name}
              </button>
            ))}
          </div>
        </RevealEl>

        {/* Items */}
        <div>
          {allItems.map((item, i) => (
            <div key={item.id} className="menu-item" style={{ opacity: item.available === false ? 0.45 : 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.3px' }}>
                    {item.name}
                  </span>
                  {item.available === false && (
                    <span style={{ fontSize: 9, padding: '3px 10px', background: 'var(--rust)', color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                      86'd
                    </span>
                  )}
                </div>
                {item.description && (
                  <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.7, maxWidth: 540 }}>
                    {item.description}
                  </p>
                )}
              </div>
              <div style={{ textAlign: 'right', paddingTop: 4, flexShrink: 0 }}>
                {item.price && (
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 400, color: 'var(--gold)', letterSpacing: '-0.5px' }}>
                    ${Number(item.price).toFixed(0)}
                  </div>
                )}
              </div>
            </div>
          ))}
          {allItems.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14, padding: '48px 20px', fontStyle: 'italic' }}>Menu coming soon.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-section { padding: 80px 0 !important; }
          #menu-section > div { padding: 0 24px !important; }
          .menu-header-grid { grid-template-columns: 1fr !important; gap: 24px !important; margin-bottom: 48px !important; }
        }
      `}</style>
    </section>
  )
}
