export default function Footer({ restaurant }) {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  const year = new Date().getFullYear()
  return (
    <footer style={{ background:'#141412',borderTop:'6px solid #C9A84C',padding:'56px 64px 40px' }}>
      <div style={{ maxWidth:1100,margin:'0 auto' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:44,paddingBottom:44,borderBottom:'1px solid rgba(255,255,255,0.08)',flexWrap:'wrap',gap:32 }}>
          <div>
            <div className="syne" style={{ fontSize:24,fontWeight:800,color:'#fff',marginBottom:10,letterSpacing:'-0.5px' }}>{restaurant.name.toUpperCase()}</div>
            <div style={{ fontSize:13,color:'rgba(255,255,255,0.28)',fontFamily:'DM Sans',fontWeight:300,maxWidth:280,lineHeight:1.65 }}>{restaurant.tagline||'Good food, made fresh daily.'}</div>
          </div>
          <nav style={{ display:'flex',gap:32,flexWrap:'wrap',alignItems:'flex-start' }}>
            {[['Menu','menu-section'],['Gallery','gallery-section'],['Location','location-section'],['Contact','contact-section']].map(([l,id])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',fontSize:10,letterSpacing:'2.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',cursor:'pointer',fontFamily:'DM Sans',fontWeight:700,transition:'color 0.2s' }} onMouseOver={e=>e.target.style.color='#C9A84C'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.3)'}>{l}</button>
            ))}
          </nav>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.15)',fontFamily:'DM Sans' }}>© {year} {restaurant.name}. All rights reserved.</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.15)',fontFamily:'DM Sans' }}>Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:'#C9A84C',fontWeight:700 }}>EC Web Co</a></div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer{padding:48px 24px 32px!important}}`}</style>
    </footer>
  )
}
