import { useState, useRef, useEffect } from 'react'

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.05})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

function MenuItem({ item, index }) {
  const ref = useRef(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${Math.min(index*0.06,0.45)}s`
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.opacity=item.available===false?'0.35':'1'; el.style.transform='translateY(0)'; obs.disconnect() }
    },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[index])

  return (
    <div ref={ref} className="menu-item" style={{
      opacity:0, transform:'translateY(16px)',
      transition:'opacity 0.6s ease, transform 0.6s ease, padding-left 0.4s ease'
    }}>
      <div>
        <div style={{ display:'flex',alignItems:'baseline',gap:12,marginBottom:item.description?6:0 }}>
          <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:20,fontWeight:600,fontStyle:'italic',color:'#1C1A17',lineHeight:1.2 }}>
            {item.name}
          </span>
          {item.available===false&&(
            <span style={{ fontSize:9,padding:'2px 8px',background:'#f0ede6',color:'#bbb',fontFamily:'DM Sans',fontWeight:600,letterSpacing:1.5,textTransform:'uppercase',whiteSpace:'nowrap' }}>
              86'd
            </span>
          )}
        </div>
        {item.description&&(
          <p style={{ fontSize:13,color:'#7A766E',lineHeight:1.65,margin:0,fontFamily:'DM Sans',fontWeight:300,maxWidth:420 }}>
            {item.description}
          </p>
        )}
      </div>
      {item.price&&(
        <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:19,fontWeight:400,fontStyle:'italic',color:'#2D5016',flexShrink:0,paddingTop:2,whiteSpace:'nowrap' }}>
          ${Number(item.price).toFixed(2)}
        </div>
      )}
    </div>
  )
}

export default function MenuSection({ sections, photos }) {
  const [activeTab, setActiveTab] = useState(0)
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef, 0.18)

  if(!sections?.length) return null
  const active = sections[activeTab]
  const items = [...(active?.items?.filter(i=>i.available!==false)||[]), ...(active?.items?.filter(i=>i.available===false)||[])]
  const menuPhoto = photos?.[1]?.url || photos?.[0]?.url

  return (
    <section id="menu-section" style={{ background:'var(--cream)' }}>

      {/* ── Intro: split layout ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:560 }} className="menu-intro-grid">

        {/* Left — text */}
        <div ref={leftRef} className="reveal-left" style={{ padding:'96px 72px',display:'flex',flexDirection:'column',justifyContent:'center',borderRight:'1px solid var(--border)' }}>
          <div className="eyebrow"><span className="eyebrow-line"/>The Menu</div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(52px,6vw,84px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:0.92,margin:'0 0 28px',letterSpacing:'-0.5px' }}>
            Made with<br /><em style={{ fontWeight:600,color:'var(--green)' }}>Passion.</em>
          </h2>
          <p style={{ fontSize:15,color:'var(--muted)',lineHeight:1.9,fontFamily:'DM Sans',fontWeight:300,maxWidth:360,margin:'0 0 40px' }}>
            Every pasta hand-rolled, every sauce simmered for hours. Our kitchen is open — come taste the difference.
          </p>
          <div style={{ display:'flex',alignItems:'center',gap:24 }}>
            <button onClick={()=>document.getElementById('menu-items')?.scrollIntoView({behavior:'smooth'})} className="btn-green">
              See Full Menu
            </button>
            <div style={{ width:40,height:1,background:'var(--border)' }}/>
          </div>
        </div>

        {/* Right — food photo */}
        <div className="photo-hover" style={{ minHeight:480,background:'#e8e4dc',position:'relative' }}>
          {menuPhoto
            ? <img src={menuPhoto} alt="Our food" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center' }}/>
            : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,#e8e4dc,#d8d3c8)' }}/>
          }
          {/* Green overlay strip on bottom */}
          <div style={{ position:'absolute',bottom:0,left:0,right:0,height:4,background:'var(--green)' }}/>
        </div>
      </div>

      {/* ── Tabs ── */}
      {sections.length>1&&(
        <div style={{ position:'sticky',top:116,background:'var(--cream)',zIndex:10,borderBottom:'1px solid var(--border)',borderTop:'1px solid var(--border)' }}>
          <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 72px',display:'flex',overflowX:'auto' }}>
            {sections.map((s,i)=>(
              <button key={s.id} onClick={()=>setActiveTab(i)} style={{
                padding:'16px 32px',fontSize:10,border:'none',background:'none',
                fontFamily:'DM Sans',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',
                whiteSpace:'nowrap',cursor:'pointer',
                color:activeTab===i?'var(--green)':'#bbb',
                borderBottom:`2px solid ${activeTab===i?'var(--green)':'transparent'}`,
                marginBottom:-1,transition:'all 0.25s'
              }}>{s.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Items ── */}
      <div id="menu-items" style={{ maxWidth:1100,margin:'0 auto',padding:'8px 72px 100px' }}>
        {items.length===0
          ? <p style={{ color:'var(--muted)',fontSize:15,padding:'56px 0',textAlign:'center',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic' }}>Coming soon.</p>
          : <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 72px' }} className="menu-items-grid">
              {items.map((item,i)=><MenuItem key={item.id} item={item} index={i}/>)}
            </div>
        }
      </div>

      {/* ── Mid-section photo strip ── */}
      {photos?.length>=3&&(
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',height:360,borderTop:'1px solid var(--border)' }}>
          {[photos[2],photos[3],photos[4]].filter(Boolean).map((p,i)=>(
            <div key={i} className="photo-hover" style={{ borderRight:i<2?'1px solid var(--border)':'none',background:'#e8e4dc',overflow:'hidden' }}>
              <img src={p.url} alt="food" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .menu-intro-grid{grid-template-columns:1fr!important}
          .menu-intro-grid>div:last-child{min-height:320px!important;border-right:none!important}
          .menu-intro-grid>div:first-child{padding:64px 28px!important;border-right:none!important}
          .menu-items-grid{grid-template-columns:1fr!important;gap:0!important}
          #menu-items{padding:8px 28px 72px!important}
          #menu-section div[style*="sticky"]>div{padding:0 16px!important}
        }
      `}</style>
    </section>
  )
}
