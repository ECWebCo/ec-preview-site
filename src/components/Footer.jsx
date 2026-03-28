export default function Footer({ restaurant }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--ink)', padding: '64px 48px 40px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: '#fff', fontStyle: 'italic', marginBottom: 8 }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 300 }}>
              {restaurant.tagline || 'Authentic cuisine, crafted with heart'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {['menu-section', 'hours-section', 'gallery-section', 'location-section', 'contact-section'].map((id, i) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', fontSize: 11, letterSpacing: 1.5,
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', transition: '0.2s'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
              >
                {['Menu', 'Hours', 'Gallery', 'Location', 'Contact'][i]}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            © {year} {restaurant.name}. All rights reserved.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>EC Web Co</a>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer { padding: 48px 24px 32px !important; }
        }
      `}</style>
    </footer>
  )
}
