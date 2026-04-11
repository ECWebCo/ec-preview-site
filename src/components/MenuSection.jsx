import { useState, useRef, useEffect } from 'react'

function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

function MenuItem({ item, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const delay = Math.min(index * 0.06, 0.45)
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = item.available === false ? '0.38' : '1'; el.style.transform = 'translateY(0)'; obs.disconnect() } },
      { threshold: 0.04 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div ref={ref} style={{
      opacity: 0, transform: 'translateY(16px)',
      transition: 'opacity 0.55s ease, transform 0.55s ease',
      padding: '24px 0',
      borderBottom: '1px solid #EDEAE4',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: 32,
      alignItems: 'start',
      position: 'relative',
    }}>
      {/* Left gold accent line on hover */}
      <div className="menu-item-inner" style={{ display: 'contents' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: item.description ? 7 : 0 }}>
            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 19, fontWeight: 700, fontStyle: 'italic',
              color: '#1C1C1A', margin: 0, lineHeight: 1.2
            }}>
              {item.name}
            </h3>
            {item.available === false && (
              <span style={{ fontSize: 9, padding: '2px 8px', background: '#f5f0ea', color: '#bbb', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Sold Out
              </span>
            )}
          </div>
          {item.description && (
            <p style={{ fontSize: 13, color: '#9A958E', lineHeight: 1.65, margin: 0, fontFamily: 'DM Sans', fontWeight: 400, maxWidth: 480 }}>
              {item.description}
            </p>
          )}
        </div>
        {item.price && (
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 17, fontWeight: 400, fontStyle: 'italic',
            color: '#C9A84C', flexShrink: 0, paddingTop: 3,
            whiteSpace: 'nowrap'
          }}>
            ${Number(item.price).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const heroRef = useRef(null); useReveal(heroRef)
  const descRef = useRef(null); useReveal(descRef, 0.15)

  if (!sections?.length) return null
  const activeSection = sections[activeTab]
  const available = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOut = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...available, ...soldOut]

  return (
    <section id="menu-section" style={{ background: '#fff' }}>

      {/* ── FULL-WIDTH HERO BANNER ── */}
      <div style={{ background: '#F5F2EC', borderBottom: '1px solid #E8E4DE' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 64px 72px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="menu-hero-grid">
          <div ref={heroRef} className="reveal-left">
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 40, height: 1, background: '#C9A84C' }} />
              <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C' }}>
                Our Menu
              </span>
            </div>
            {/* Big italic headline */}
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(48px, 6vw, 80px)',
              fontWeight: 700, fontStyle: 'italic',
              color: '#1C1C1A', lineHeight: 0.95,
              margin: 0, letterSpacing: '-0.5px'
            }}>
              Made with<br />
              <span style={{ color: '#C9A84C' }}>Heart.</span>
            </h2>
          </div>
          <div ref={descRef} className="reveal-right">
            <p style={{ fontSize: 16, color: '#9A958E', lineHeight: 1.9, fontFamily: 'DM Sans', fontWeight: 300, margin: '0 0 28px' }}>
              Every dish on our menu is crafted fresh to order. We source quality ingredients and cook everything with care — no shortcuts, ever.
            </p>
            {/* Decorative divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="#C9A84C" opacity="0.5" />
              </svg>
              <div style={{ flex: 1, height: 1, background: '#E8E4DE' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION TABS ── */}
      {sections.length > 1 && (
        <div style={{ position: 'sticky', top: 112, background: '#fff', zIndex: 10, borderBottom: '1px solid #EDEAE4' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 64px', display: 'flex', overflowX: 'auto', gap: 0 }}>
            {sections.map((s, i) => (
              <button key={s.id} onClick={() => setActiveTab(i)} style={{
                padding: '16px 32px', fontSize: 11, border: 'none', background: 'none',
                fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', whiteSpace: 'nowrap', cursor: 'pointer',
                color: activeTab === i ? '#1C1C1A' : '#C8C4BE',
                borderBottom: `2px solid ${activeTab === i ? '#C9A84C' : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.25s'
              }}
                onMouseOver={e => { if (activeTab !== i) e.target.style.color = '#888' }}
                onMouseOut={e => { if (activeTab !== i) e.target.style.color = '#C8C4BE' }}
              >{s.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── MENU ITEMS — two column on desktop ── */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 64px 100px' }}>
        {allItems.length === 0 ? (
          <p style={{ color: '#bbb', fontSize: 14, padding: '64px 0', textAlign: 'center', fontFamily: 'DM Sans', fontStyle: 'italic' }}>
            Menu coming soon.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 64px' }} className="menu-items-grid">
            {allItems.map((item, i) => <MenuItem key={item.id} item={item} index={i} />)}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .menu-hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; padding: 56px 24px 48px !important; }
          .menu-items-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
          #menu-section > div:nth-child(3) > div { padding: 0 24px 72px !important; }
          #menu-section > div[style*="sticky"] > div { padding: 0 16px !important; }
        }
      `}</style>
    </section>
  )
}
