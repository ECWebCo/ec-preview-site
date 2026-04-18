export default function SocialSection({ restaurant }) {
  const instagram = restaurant?.instagram
  const facebook  = restaurant?.facebook

  if (!instagram && !facebook) return null

  const igHandle  = instagram?.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace('@', '').replace(/\/$/, '')
  const fbHandle  = facebook?.replace('https://facebook.com/', '').replace('https://www.facebook.com/', '').replace('@', '').replace(/\/$/, '')

  return (
    <section id="social-section" style={{ background:'#1C1A17', padding:'80px 0' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:'0 64px', textAlign:'center' }}>

        {/* Eyebrow */}
        <div className="eyebrow" style={{ justifyContent:'center', marginBottom:16 }}>
          <span className="eyebrow-line"/>Follow Along<span className="eyebrow-line"/>
        </div>

        {/* Heading */}
        <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:300, fontStyle:'italic', color:'#FAF8F3', lineHeight:1.0, margin:'0 0 12px', letterSpacing:'-0.3px' }}>
          Stay Connected
        </h2>
        <p style={{ fontFamily:'DM Sans', fontSize:14, color:'rgba(255,255,255,0.4)', marginBottom:48, lineHeight:1.7 }}>
          Follow us for daily specials, behind the scenes, and updates from our kitchen.
        </p>

        {/* Social buttons */}
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom: igHandle ? 56 : 0 }}>
          {igHandle && (
            <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', border:'1px solid rgba(255,255,255,0.15)', color:'#FAF8F3', textDecoration:'none', fontFamily:'DM Sans', fontSize:13, fontWeight:500, letterSpacing:'0.5px', transition:'all 0.25s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.background='transparent' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              @{igHandle}
            </a>
          )}
          {fbHandle && (
            <a href={`https://facebook.com/${fbHandle}`} target="_blank" rel="noreferrer"
              style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', border:'1px solid rgba(255,255,255,0.15)', color:'#FAF8F3', textDecoration:'none', fontFamily:'DM Sans', fontSize:13, fontWeight:500, letterSpacing:'0.5px', transition:'all 0.25s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; e.currentTarget.style.background='transparent' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
              </svg>
              {fbHandle}
            </a>
          )}
        </div>

        {/* Instagram embed preview */}
        {igHandle && (
          <div style={{ marginTop:0 }}>
            <p style={{ fontFamily:'Cormorant Garamond,serif', fontSize:13, fontStyle:'italic', color:'rgba(255,255,255,0.25)', marginBottom:20, letterSpacing:'0.5px' }}>
              Latest from Instagram
            </p>
            <a href={`https://instagram.com/${igHandle}`} target="_blank" rel="noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'11px 22px', background:'var(--green)', color:'#fff', textDecoration:'none', fontFamily:'DM Sans', fontSize:12, fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', transition:'opacity 0.2s' }}
              onMouseOver={e => e.currentTarget.style.opacity='0.85'}
              onMouseOut={e => e.currentTarget.style.opacity='1'}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              View our Feed
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          #social-section { padding: 60px 0 !important; }
          #social-section > div { padding: 0 24px !important; }
        }
      `}</style>
    </section>
  )
}
