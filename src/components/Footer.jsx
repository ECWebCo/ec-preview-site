export default function Footer({ restaurant }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
      {/* Giant watermark name */}
      <div style={{
        position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'Playfair Display, serif', fontWeight: 900, fontStyle: 'italic',
        fontSize: 'clamp(60px, 12vw, 180px)',
        color: 'rgba(255,255,255,0.025)', lineHeight: 1,
        whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
        letterSpacing: '-2px'
      }}>
        {restaurant.name}
      </div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '80px 56px 48px', position: 'relative', zIndex: 1 }}>
        {/* Top row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', marginBottom: 64, paddingBottom: 64, borderBottom: '1px solid rgba(255,255,255,0.07)' }} className="footer-top">

          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 36, color: '#fff', fontStyle: 'italic', marginBottom: 12, letterSpacing: '-0.5px' }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', fontWeight: 300, fontFamily: 'DM Sans', maxWidth: 320, lineHeight: 1.7 }}>
              {restaurant.tagline || 'Authentic cuisine, crafted with heart.'}
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
            {[
              ['Menu', 'menu-section'],
              ['Hours', 'hours-section'],
              ['Gallery', 'gallery-section'],
              ['Location', 'location-section'],
              ['Contact', 'contact-section'],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', fontSize: 10, letterSpacing: 2.5,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', cursor: 'none',
                fontFamily: 'DM Sans', transition: 'color 0.25s', textAlign: 'right'
              }}
                onMouseOver={e => e.target.style.color = 'var(--gold)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >{label}</button>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Sans', letterSpacing: 0.5 }}>
            © {year} {restaurant.name}. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.15)', fontFamily: 'DM Sans' }}>
            <span>Website by</span>
            <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{
              color: 'var(--gold)', letterSpacing: 0.5, transition: 'opacity 0.2s'
            }}
              onMouseOver={e => e.target.style.opacity = '0.7'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >EC Web Co</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div { padding: 56px 24px 40px !important; }
          .footer-top { grid-template-columns: 1fr !important; }
          .footer-top nav { align-items: flex-start !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 12px !important; }
        }
        @media (max-width: 768px) {
          footer button { cursor: pointer !important; }
        }
      `}</style>
    </footer>
  )
}
