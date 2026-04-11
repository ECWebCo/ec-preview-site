export default function Footer({ restaurant }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--ink)', padding: '64px 48px 40px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.08)',
          flexWrap: 'wrap', gap: 32
        }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 26, fontStyle: 'italic', fontWeight: 700, color: '#fff', marginBottom: 10 }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans', fontWeight: 300, lineHeight: 1.6, maxWidth: 280 }}>
              {restaurant.tagline || 'Good food, made fresh.'}
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {[
              ['Menu', 'menu-section'],
              ['Gallery', 'gallery-section'],
              ['Hours', 'hours-section'],
              ['Location', 'location-section'],
              ['Contact', 'contact-section'],
            ].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', fontSize: 11,
                letterSpacing: '1.5px', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)', cursor: 'pointer',
                fontFamily: 'DM Sans', fontWeight: 500, transition: 'color 0.2s'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
              >{label}</button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: 'DM Sans' }}>
            © {year} {restaurant.name}. All rights reserved.
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.18)', fontFamily: 'DM Sans' }}>
            Website by{' '}
            <a href="https://ecwebco.com" target="_blank" rel="noreferrer"
              style={{ color: 'var(--accent)', fontWeight: 600 }}
              onMouseOver={e => e.target.style.opacity = '0.7'}
              onMouseOut={e => e.target.style.opacity = '1'}
            >EC Web Co</a>
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
