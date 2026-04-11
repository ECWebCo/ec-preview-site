export default function Footer({ restaurant }) {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#1a1a1a', padding: '64px 48px 40px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: 32 }}>
          <div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontStyle: 'italic', color: '#fff', marginBottom: 8, fontWeight: 700 }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans', lineHeight: 1.6 }}>
              {restaurant.tagline || 'Good food, made fresh.'}
            </div>
          </div>
          <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {[['Menu','menu-section'],['Hours','hours-section'],['Gallery','gallery-section'],['Location','location-section'],['Contact','contact-section']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                background: 'none', border: 'none', fontSize: 12, color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontFamily: 'DM Sans', fontWeight: 500, transition: 'color 0.2s', letterSpacing: '0.3px'
              }}
                onMouseOver={e => e.target.style.color = '#fff'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
              >{label}</button>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans' }}>© {year} {restaurant.name}. All rights reserved.</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>EC Web Co</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer{padding:48px 24px 32px!important}}`}</style>
    </footer>
  )
}
