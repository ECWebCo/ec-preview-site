export default function Footer({ restaurant }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--black)', borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -60, left: '50%', transform: 'translateX(-50%)', fontFamily: 'DM Sans', fontWeight: 800, fontSize: 'clamp(60px,12vw,180px)', color: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none', letterSpacing: '-4px' }}>
        {restaurant.name}
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 56px 48px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'start', marginBottom: 56, paddingBottom: 56, borderBottom: '1px solid var(--border)' }} className="footer-top">
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 10, letterSpacing: '-1px' }}>
              {restaurant.name}<span style={{ color: 'var(--orange)' }}>.</span>
            </div>
            <div style={{ fontSize: 14, color: '#444', fontWeight: 300, fontFamily: 'DM Sans', maxWidth: 320, lineHeight: 1.7 }}>
              {restaurant.tagline || 'Fresh food, real flavors, every day.'}
            </div>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-end' }}>
            {[['Menu','menu-section'],['Hours','hours-section'],['Gallery','gallery-section'],['Location','location-section'],['Contact','contact-section']].map(([label,id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{ background: 'none', border: 'none', fontSize: 12, color: '#444', cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 0.5, transition: 'color 0.2s' }}
                onMouseOver={e => e.target.style.color = 'var(--orange)'}
                onMouseOut={e => e.target.style.color = '#444'}>
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#333', fontFamily: 'DM Sans' }}>© {year} {restaurant.name}. All rights reserved.</div>
          <div style={{ fontSize: 12, color: '#333', fontFamily: 'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color: 'var(--orange)', fontWeight: 700 }}
              onMouseOver={e => e.target.style.opacity='0.7'}
              onMouseOut={e => e.target.style.opacity='1'}>EC Web Co</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div { padding: 56px 24px 40px !important; }
          .footer-top { grid-template-columns: 1fr !important; }
          .footer-top nav { align-items: flex-start !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 12px !important; }
        }
      `}</style>
    </footer>
  )
}
