export default function Footer({ restaurant }) {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  const year = new Date().getFullYear()
  return (
    <footer style={{ background:'#1C1A17',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'64px 72px 44px' }}>
      <div style={{ maxWidth:1100,margin:'0 auto' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:48,paddingBottom:48,borderBottom:'1px solid rgba(255,255,255,0.07)',flexWrap:'wrap',gap:32 }}>
          <div>
            <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:28,fontStyle:'italic',fontWeight:400,color:'#fff',marginBottom:10,letterSpacing:'-0.3px' }}>
              {restaurant.name}
            </div>
            <div style={{ fontSize:13,color:'rgba(255,255,255,0.28)',fontFamily:'DM Sans',fontWeight:300,maxWidth:300,lineHeight:1.7 }}>
              {restaurant.tagline||'Authentic Italian cuisine, crafted with love.'}
            </div>
          </div>
          <nav style={{ display:'flex',gap:32,flexWrap:'wrap',alignItems:'flex-start' }}>
            {[['Menu','menu-section'],['Gallery','gallery-section'],['Location','location-section'],['Contact','contact-section']].map(([l,id])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',fontSize:10,letterSpacing:'2.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontFamily:'DM Sans',fontWeight:600,transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='rgba(255,255,255,0.8)'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.3)'}>
                {l}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.15)',fontFamily:'DM Sans' }}>© {year} {restaurant.name}. All rights reserved.</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.15)',fontFamily:'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:'var(--gold-lt)',fontWeight:600,transition:'opacity 0.2s' }} onMouseOver={e=>e.target.style.opacity='0.7'} onMouseOut={e=>e.target.style.opacity='1'}>EC Web Co</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer{padding:48px 28px 36px!important}}`}</style>
    </footer>
  )
}
