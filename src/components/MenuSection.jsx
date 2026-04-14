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
    }}>
      {/* Name + dotted leader + price */}
      <div style={{ display:'flex',alignItems:'baseline',gap:0,width:'100%' }}>
        <span style={{ fontFamily:'DM Sans',fontSize:12,fontWeight:700,letterSpacing:'1.5px',textTransform:'uppercase',color:'#1C1A17',flexShrink:0 }}>
          {item.name}
        </span>
        <span style={{ flex:1,borderBottom:'1px dotted #C8C4BE',margin:'0 8px',position:'relative',top:'-4px',minWidth:16 }}/>
        {item.price&&(
          <span style={{ fontFamily:'DM Sans',fontSize:12,fontWeight:600,color:'var(--green)',flexShrink:0 }}>
            {Number(item.price).toFixed(0)}
          </span>
        )}
      </div>
      {item.description&&(
        <p style={{ fontSize:12,color:'var(--muted)',lineHeight:1.6,margin:'4px 0 0',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic' }}>
          {item.description}
        </p>
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
    <section id="menu-section" style={{ background:'var(--cream)',paddingTop:56 }}>

      {/* Header */}
      <div style={{ maxWidth:860,margin:'0 auto',padding:'0 64px 28px' }}>
        <div ref={headerRef} className="reveal" style={{ display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:20 }}>
          <div>
            <div className="eyebrow" style={{justifyContent:'center'}}><span className="eyebrow-line"/>The Menu<span className="eyebrow-line"/></div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,4.5vw,58px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0 }}>
              Made with <em style={{ fontWeight:600,color:'var(--green)' }}>Passion.</em>
            </h2>
          </div>

          {/* Dropdown selector */}
          {sections.length > 1 && (
            <div style={{ position:'relative',flexShrink:0 }}>
              <select
                value={activeTab}
                onChange={e=>setActiveTab(Number(e.target.value))}
                style={{
                  appearance:'none',
                  WebkitAppearance:'none',
                  padding:'10px 40px 10px 16px',
                  fontFamily:'DM Sans',
                  fontSize:11,
                  fontWeight:600,
                  letterSpacing:'1.5px',
                  textTransform:'uppercase',
                  color:'#1C1A17',
                  background:'#fff',
                  border:'1px solid var(--border)',
                  cursor:'pointer',
                  outline:'none',
                  minWidth:160,
                  transition:'border-color 0.2s'
                }}
              >
                {sections.map((s,i)=>(
                  <option key={s.id} value={i}>{s.name}</option>
                ))}
              </select>
              {/* Dropdown arrow */}
              <div style={{ position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--green)',fontSize:10 }}>▼</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu card */}
      <div style={{ maxWidth:860,margin:'0 auto',padding:'0 64px 56px' }}>
        <div style={{
          border:'1px solid var(--green)',
          outline:'3px solid var(--green)',
          outlineOffset:5,
          padding:'36px 44px',
          background:'var(--cream)',
        }}>
          {items.length===0
            ? <p style={{ color:'var(--muted)',textAlign:'center',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',padding:'24px 0' }}>Coming soon.</p>
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
        }
      `}</style>
    </section>
  )
}
