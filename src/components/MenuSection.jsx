import { useState } from 'react'

function SectionTag() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
      <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>The Menu</span>
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)

  if (!sections?.length) return null

  const activeSection = sections[activeTab]
  const availableItems = activeSection?.items?.filter(i => i.available !== false) || []
  const soldOutItems = activeSection?.items?.filter(i => i.available === false) || []
  const allItems = [...availableItems, ...soldOutItems]

  return (
    <section id="menu-section" style={{ padding: '96px 48px', background: 'var(--off)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <SectionTag />
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 12 }}>
          Fresh, Seasonal<br /><em style={{ fontWeight: 400 }}>&amp; Handmade</em>
        </h2>
        <p style={{ fontSize: 15, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.7, marginBottom: 56, maxWidth: 480 }}>
          Every dish begins with the finest ingredients — sourced with care, prepared daily, inspired by tradition.
        </p>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--mist)', marginBottom: 48, overflowX: 'auto', gap: 0 }}>
          {sections.map((s, i) => (
            <button key={s.id} onClick={() => setActiveTab(i)} style={{
              padding: '14px 28px', fontSize: 11, letterSpacing: 2,
              textTransform: 'uppercase', cursor: 'pointer', border: 'none',
              background: 'none', fontFamily: 'DM Sans, sans-serif', whiteSpace: 'nowrap',
              color: activeTab === i ? 'var(--ink)' : 'var(--muted)',
              borderBottom: activeTab === i ? '2px solid var(--gold)' : '2px solid transparent',
              marginBottom: -1, fontWeight: activeTab === i ? 500 : 400, transition: '0.2s'
            }}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div>
          {allItems.map(item => (
            <div key={item.id} style={{
              display: 'grid', gridTemplateColumns: '1fr auto',
              gap: 24, padding: '28px 0', borderBottom: '1px solid var(--mist)',
              opacity: item.available === false ? 0.5 : 1
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>
                    {item.name}
                  </span>
                  {item.available === false && (
                    <span style={{ fontSize: 9, padding: '3px 9px', background: 'var(--rust)', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                      Sold Out
                    </span>
                  )}
                </div>
                {item.description && (
                  <p style={{ fontSize: 14, color: 'var(--muted)', fontWeight: 300, lineHeight: 1.6, maxWidth: 520 }}>
                    {item.description}
                  </p>
                )}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'var(--gold)', paddingTop: 2 }}>
                {item.price ? `$${Number(item.price).toFixed(0)}` : ''}
              </div>
            </div>
          ))}
          {allItems.length === 0 && (
            <p style={{ color: 'var(--muted)', fontSize: 14, padding: '32px 0' }}>No items in this section yet.</p>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #menu-section { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  )
}
