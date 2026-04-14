import { useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.1})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref])
}

// SVG food illustration pattern elements
function FoodPattern() {
  return (
    <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.08,pointerEvents:'none' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="food-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          {/* Pasta bowl */}
          <circle cx="40" cy="40" r="28" fill="none" stroke="#fff" strokeWidth="1.5"/>
          <ellipse cx="40" cy="40" rx="18" ry="8" fill="none" stroke="#fff" strokeWidth="1"/>
          <path d="M28 38 Q40 32 52 38" fill="none" stroke="#fff" strokeWidth="1"/>
          <path d="M30 43 Q40 37 50 43" fill="none" stroke="#fff" strokeWidth="1"/>
          {/* Leaf/herb */}
          <path d="M110 20 Q120 10 130 20 Q120 30 110 20Z" fill="none" stroke="#fff" strokeWidth="1.2"/>
          <line x1="120" y1="10" x2="120" y2="30" stroke="#fff" strokeWidth="0.8"/>
          {/* Wine glass */}
          <path d="M170 10 L160 35 Q165 40 175 40 Q185 40 180 35 L170 10Z" fill="none" stroke="#fff" strokeWidth="1.2"/>
          <line x1="170" y1="40" x2="170" y2="55" stroke="#fff" strokeWidth="1.2"/>
          <line x1="162" y1="55" x2="178" y2="55" stroke="#fff" strokeWidth="1.2"/>
          {/* Pizza */}
          <circle cx="50" cy="150" r="30" fill="none" stroke="#fff" strokeWidth="1.2"/>
          <line x1="50" y1="120" x2="50" y2="180" stroke="#fff" strokeWidth="0.8"/>
          <line x1="20" y1="150" x2="80" y2="150" stroke="#fff" strokeWidth="0.8"/>
          <circle cx="42" cy="138" r="4" fill="none" stroke="#fff" strokeWidth="1"/>
          <circle cx="60" cy="145" r="3" fill="none" stroke="#fff" strokeWidth="1"/>
          <circle cx="40" cy="158" r="3.5" fill="none" stroke="#fff" strokeWidth="1"/>
          {/* Olive branch */}
          <path d="M130 100 Q145 90 160 100 Q145 110 130 100Z" fill="none" stroke="#fff" strokeWidth="1"/>
          <path d="M150 95 Q165 85 180 95 Q165 105 150 95Z" fill="none" stroke="#fff" strokeWidth="1"/>
          <path d="M125 100 L185 100" fill="none" stroke="#fff" strokeWidth="0.8"/>
          {/* Small dots scattered */}
          <circle cx="95" cy="70" r="2" fill="#fff"/>
          <circle cx="140" cy="60" r="1.5" fill="#fff"/>
          <circle cx="170" cy="130" r="2" fill="#fff"/>
          <circle cx="85" cy="170" r="1.5" fill="#fff"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#food-pattern)"/>
    </svg>
  )
}

export default function TextureSection({ restaurant, links }) {
  const ref = useRef(null); useReveal(ref)

  return (
    <div style={{ background:'#1C1A17',position:'relative',overflow:'hidden',padding:'96px 64px',textAlign:'center' }}>
      <FoodPattern/>

      <div ref={ref} className="reveal" style={{ position:'relative',zIndex:1,maxWidth:680,margin:'0 auto' }}>
        {/* Decorative line */}
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:36 }}>
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.2)' }}/>
          <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill="var(--gold)" opacity="0.6"/></svg>
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.2)' }}/>
        </div>

        <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(22px,3vw,36px)',fontStyle:'italic',fontWeight:300,color:'rgba(255,255,255,0.85)',lineHeight:1.6,margin:'0 0 36px',letterSpacing:'-0.2px' }}>
          "{restaurant.tagline || 'From our kitchen to your table — every dish made with love.'}"
        </p>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:40 }}>
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.2)' }}/>
          <svg width="8" height="8" viewBox="0 0 8 8"><polygon points="4,0 8,4 4,8 0,4" fill="var(--gold)" opacity="0.6"/></svg>
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.2)' }}/>
        </div>

        {links?.reservation_url && (
          <a href={links.reservation_url} target="_blank" rel="noreferrer"
            style={{ display:'inline-block',padding:'14px 40px',background:'transparent',border:'1px solid rgba(255,255,255,0.4)',color:'#fff',fontFamily:'DM Sans',fontSize:11,fontWeight:600,letterSpacing:'2.5px',textTransform:'uppercase',textDecoration:'none',transition:'all 0.25s' }}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(255,255,255,0.4)'}}>
            Make a Reservation
          </a>
        )}
      </div>
    </div>
  )
}
