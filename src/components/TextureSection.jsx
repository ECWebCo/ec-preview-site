import { useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.1})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref])
}

export default function TextureSection({ restaurant, links }) {
  const ref = useRef(null); useReveal(ref)

  return (
    <div style={{ background:'#1C1A17', position:'relative', overflow:'hidden', padding:'80px 64px', textAlign:'center' }}>
      {/* SVG food pattern */}
      <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',opacity:0.06,pointerEvents:'none' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="fp" x="0" y="0" width="220" height="220" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="1.5"/>
            <ellipse cx="50" cy="50" rx="18" ry="8" fill="none" stroke="#fff" strokeWidth="1"/>
            <path d="M36 48 Q50 42 64 48" fill="none" stroke="#fff" strokeWidth="1"/>
            <path d="M38 54 Q50 48 62 54" fill="none" stroke="#fff" strokeWidth="1"/>
            <path d="M120 20 Q132 8 144 20 Q132 32 120 20Z" fill="none" stroke="#fff" strokeWidth="1.2"/>
            <line x1="132" y1="8" x2="132" y2="32" stroke="#fff" strokeWidth="0.8"/>
            <path d="M180 15 L168 42 Q174 48 186 48 Q198 48 192 42 L180 15Z" fill="none" stroke="#fff" strokeWidth="1.2"/>
            <line x1="180" y1="48" x2="180" y2="62" stroke="#fff" strokeWidth="1.2"/>
            <line x1="172" y1="62" x2="188" y2="62" stroke="#fff" strokeWidth="1.2"/>
            <circle cx="60" cy="160" r="32" fill="none" stroke="#fff" strokeWidth="1.2"/>
            <line x1="60" y1="128" x2="60" y2="192" stroke="#fff" strokeWidth="0.8"/>
            <line x1="28" y1="160" x2="92" y2="160" stroke="#fff" strokeWidth="0.8"/>
            <circle cx="50" cy="145" r="4" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="72" cy="152" r="3" fill="none" stroke="#fff" strokeWidth="1"/>
            <circle cx="48" cy="170" r="3.5" fill="none" stroke="#fff" strokeWidth="1"/>
            <path d="M140 110 Q155 98 170 110 Q155 122 140 110Z" fill="none" stroke="#fff" strokeWidth="1"/>
            <path d="M158 104 Q173 92 188 104 Q173 116 158 104Z" fill="none" stroke="#fff" strokeWidth="1"/>
            <line x1="135" y1="110" x2="195" y2="110" stroke="#fff" strokeWidth="0.8"/>
            <circle cx="105" cy="80" r="2" fill="#fff"/>
            <circle cx="150" cy="70" r="1.5" fill="#fff"/>
            <circle cx="185" cy="145" r="2" fill="#fff"/>
            <circle cx="95" cy="185" r="1.5" fill="#fff"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fp)"/>
      </svg>

      <div ref={ref} className="reveal" style={{ position:'relative', zIndex:1, maxWidth:640, margin:'0 auto' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:32 }}>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.2)' }}/>
          <svg width="6" height="6" viewBox="0 0 6 6"><polygon points="3,0 6,3 3,6 0,3" fill="var(--gold)" opacity="0.7"/></svg>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.2)' }}/>
        </div>

        <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(20px,2.8vw,34px)',fontStyle:'italic',fontWeight:300,color:'rgba(255,255,255,0.82)',lineHeight:1.65,margin:'0 0 32px',letterSpacing:'-0.2px' }}>
          "{restaurant.tagline || 'From our kitchen to your table — every dish made with love and care.'}"
        </p>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:36 }}>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.2)' }}/>
          <svg width="6" height="6" viewBox="0 0 6 6"><polygon points="3,0 6,3 3,6 0,3" fill="var(--gold)" opacity="0.7"/></svg>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.2)' }}/>
        </div>

        {links?.reservation_url&&(
          <a href={links.reservation_url} target="_blank" rel="noreferrer"
            style={{ display:'inline-block',padding:'13px 36px',background:'transparent',border:'1px solid rgba(255,255,255,0.35)',color:'#fff',fontFamily:'DM Sans',fontSize:11,fontWeight:600,letterSpacing:'2.5px',textTransform:'uppercase',textDecoration:'none',transition:'all 0.25s' }}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.borderColor='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(255,255,255,0.35)'}}>
            Make a Reservation
          </a>
        )}
      </div>
    </div>
  )
}
