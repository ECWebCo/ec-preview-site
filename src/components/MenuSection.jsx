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
    el.style.transitionDelay=`${Math.min(index*0.05,0.4)}s`
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.opacity=item.available===false?'0.35':'1'; el.style.transform='translateY(0)'; obs.disconnect() }
    },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[index])

  return (
    <div ref={ref} style={{
      opacity:0, transform:'translateY(12px)',
      transition:'opacity 0.55s ease, transform 0.55s ease',
      padding:'18px 0',
      borderBottom:'1px solid var(--border)',
      display:'grid',
      gridTemplateColumns:'1fr auto',
      gap:16,
      alignItems:'start'
    }}>
      <div style={{ display:'flex',alignItems:'baseline',gap:0,minWidth:0 }}>
        {/* Item name — uppercase small caps style */}
        <span style={{ fontFamily:'DM Sans',fontSize:13,fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',color:'#1C1A17',flexShrink:0 }}>
          {item.name}
        </span>
        {/* Dotted leader */}
        <span style={{ flex:1,borderBottom:'1px dotted #C8C4BE',margin:'0 10px',position:'relative',top:'-5px',minWidth:20 }}/>
        {/* Price */}
        {item.price&&(
          <span style={{ fontFamily:'DM Sans',fontSize:13,fontWeight:500,color:'#2D5016',flexShrink:0 }}>
            {Number(item.price).toFixed(0)}
          </span>
        )}
      </div>
      {item.description&&(
        <div style={{ gridColumn:'1 / -1',paddingTop:0 }}>
          <p style={{ fontSize:12,color:'var(--muted)',lineHeight:1.6,margin:0,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontWeight:400 }}>
            {item.description}
          </p>
        </div>
      )}
      {item.available===false&&(
        <span style={{ fontSize:9,padding:'2px 8px',background:'#f0ede6',color:'#bbb',fontFamily:'DM Sans',fontWeight:600,letterSpacing:1.5,textTransform:'uppercase' }}>
          86'd
        </span>
      )}
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const headerRef = useRef(null); useReveal(headerRef)

  if(!sections?.length) return null
  const active = sections[activeTab]
  const items = [...(active?.items?.filter(i=>i.available!==false)||[]), ...(active?.items?.filter(i=>i.available===false)||[])]

  return (
    <section id="menu-section" style={{ background:'var(--cream)',paddingTop:72 }}>

      {/* Header */}
      <div style={{ maxWidth:960,margin:'0 auto',padding:'0 64px 48px' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow"><span className="eyebrow-line"/>The Menu</div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,64px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0,letterSpacing:'-0.3px' }}>
            Made with <em style={{ fontWeight:600,color:'var(--green)' }}>Passion.</em>
          </h2>
        </div>
      </div>

      {/* Tabs */}
      {sections.length>1&&(
        <div style={{ position:'sticky',top:56,background:'var(--cream)',zIndex:10,borderBottom:'1px solid var(--border)',borderTop:'1px solid var(--border)' }}>
          <div style={{ maxWidth:960,margin:'0 auto',padding:'0 64px',display:'flex',overflowX:'auto' }}>
            {sections.map((s,i)=>(
              <button key={s.id} onClick={()=>setActiveTab(i)} style={{
                padding:'14px 28px',fontSize:10,border:'none',background:'none',
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

      {/* Menu card — elegant bordered box like image 4 */}
      <div style={{ maxWidth:960,margin:'0 auto',padding:'48px 64px 80px' }}>
        <div style={{
          border:'1px solid var(--green)',
          outline:'3px solid var(--green)',
          outlineOffset:6,
          padding:'48px 56px',
          background:'var(--cream)',
          position:'relative'
        }}>
          {/* Section name as card title */}
          <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:32,fontWeight:300,fontStyle:'italic',color:'#1C1A17',textAlign:'center',marginBottom:40,letterSpacing:'-0.2px' }}>
            {active?.name}
          </h3>

          {items.length===0
            ? <p style={{ color:'var(--muted)',fontSize:15,padding:'24px 0',textAlign:'center',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic' }}>Coming soon.</p>
            : <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 56px' }} className="menu-items-grid">
                {items.map((item,i)=><MenuItem key={item.id} item={item} index={i}/>)}
              </div>
          }
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          #menu-section>div{padding-left:24px!important;padding-right:24px!important}
          .menu-items-grid{grid-template-columns:1fr!important;gap:0!important}
          #menu-section div[style*="sticky"]>div{padding:0 16px!important}
        }
      `}</style>
    </section>
  )
}
