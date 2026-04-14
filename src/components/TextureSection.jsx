import { useRef, useEffect } from 'react'

function useReveal(ref) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.1})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref])
}

// Beautiful Amalfi Coast / Tuscany image
const ITALY_PHOTO = 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=1920&q=80'

export default function TextureSection({ restaurant, links }) {
  const ref = useRef(null); useReveal(ref)

  return (
    <div style={{ background:'var(--warm)', paddingTop:0 }}>
    <div style={{ position:'relative', overflow:'hidden', height:'clamp(320px,45vw,560px)' }}>
      {/* Italy photo */}
      <img
        src={ITALY_PHOTO}
        alt="Italy"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 60%' }}
      />
      {/* Dark overlay so text is readable */}
      <div style={{ position:'absolute',inset:0,background:'rgba(20,18,14,0.52)' }}/>

      {/* Content */}
      <div ref={ref} className="reveal" style={{ position:'relative',zIndex:1,height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'0 64px',textAlign:'center' }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:28 }}>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.35)' }}/>
          <svg width="6" height="6" viewBox="0 0 6 6"><polygon points="3,0 6,3 3,6 0,3" fill="var(--gold)" opacity="0.8"/></svg>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.35)' }}/>
        </div>

        <p style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(22px,3.2vw,44px)',fontStyle:'italic',fontWeight:300,color:'#fff',lineHeight:1.55,margin:'0 0 28px',letterSpacing:'-0.2px',maxWidth:640,textShadow:'0 2px 24px rgba(0,0,0,0.4)' }}>
          "{restaurant.tagline || 'From our kitchen to your table — every dish made with love.'}"
        </p>

        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:20,marginBottom:32 }}>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.35)' }}/>
          <svg width="6" height="6" viewBox="0 0 6 6"><polygon points="3,0 6,3 3,6 0,3" fill="var(--gold)" opacity="0.8"/></svg>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.35)' }}/>
        </div>

        {links?.reservation_url&&(
          <a href={links.reservation_url} target="_blank" rel="noreferrer"
            style={{ display:'inline-block',padding:'13px 36px',background:'transparent',border:'1px solid rgba(255,255,255,0.5)',color:'#fff',fontFamily:'Cormorant Garamond,serif',fontSize:14,fontWeight:600,fontStyle:'italic',textDecoration:'none',transition:'all 0.25s',backdropFilter:'blur(4px)' }}
            onMouseOver={e=>{e.currentTarget.style.background='rgba(255,255,255,0.15)';e.currentTarget.style.borderColor='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='transparent';e.currentTarget.style.borderColor='rgba(255,255,255,0.5)'}}>
            Make a Reservation
          </a>
        )}
      </div>
    </div>
    </div>
  )
}
