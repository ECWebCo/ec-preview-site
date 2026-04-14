export default function Footer({ restaurant }) {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  const year = new Date().getFullYear()
  return (
    <footer style={{ background:'#1C1A17',padding:'56px 64px 40px' }}>
      <div style={{ maxWidth:960,margin:'0 auto' }}>
        <div style={{ textAlign:'center',marginBottom:40,paddingBottom:40,borderBottom:'1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:32,fontStyle:'italic',fontWeight:400,color:'#fff',marginBottom:8 }}>
            {restaurant.name}
          </div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.4)',fontFamily:'DM Sans',fontWeight:300,marginBottom:28 }}>
            {restaurant.tagline||'Authentic Italian cuisine, crafted with love.'}
          </div>
          <nav style={{ display:'flex',justifyContent:'center',gap:36,flexWrap:'wrap' }}>
            {[['Menu','menu-section'],['Kitchen','gallery-section'],['Location','location-section']].map(([l,id])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',fontSize:10,letterSpacing:'2.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontFamily:'DM Sans',fontWeight:600,transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                {l}
              </button>
            ))}
          </nav>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans' }}>© {year} {restaurant.name}. All rights reserved.</div>
          <div style={{ fontSize:11,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.5)',fontWeight:600 }}>EC Web Co</a>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){footer{padding:48px 28px 36px!important}}`}</style>
    </footer>
  )
}
