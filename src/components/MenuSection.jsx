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
      padding:'16px 0',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{ display:'flex', alignItems:'baseline', width:'100%' }}>
        <span style={{ fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#1C1A17',flexShrink:0 }}>
          {item.name}
        </span>
        <span style={{ flex:1,borderBottom:'1px dotted #C8C4BE',margin:'0 10px',position:'relative',top:'-4px',minWidth:16 }}/>
        {item.price&&(
          <span style={{ fontFamily:'DM Sans',fontSize:12,fontWeight:600,color:'var(--green)',flexShrink:0 }}>
            {Number(item.price).toFixed(0)}
          </span>
        )}
      </div>
      {item.description&&(
        <p style={{ fontSize:12,color:'var(--muted)',lineHeight:1.6,margin:'5px 0 0',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic' }}>
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
    <section id="menu-section" style={{ background:'var(--cream)', padding:'80px 0 80px' }}>

      {/* Header */}
      <div style={{ maxWidth:900,margin:'0 auto',padding:'0 64px 40px',textAlign:'center' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow" style={{ justifyContent:'center' }}>
            <span className="eyebrow-line"/>The Menu<span className="eyebrow-line"/>
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:'0 0 28px' }}>
            Made with <em style={{ fontWeight:600,color:'var(--green)' }}>Passion.</em>
          </h2>

          {/* Dropdown */}
          {sections.length > 1 && (
            <div style={{ display:'inline-block',position:'relative' }}>
              <select
                value={activeTab}
                onChange={e=>setActiveTab(Number(e.target.value))}
                style={{
                  appearance:'none',WebkitAppearance:'none',
                  padding:'10px 44px 10px 20px',
                  fontFamily:'DM Sans',fontSize:11,fontWeight:600,
                  letterSpacing:'2px',textTransform:'uppercase',
                  color:'#1C1A17',background:'#fff',
                  border:'1px solid var(--border)',
                  cursor:'pointer',outline:'none',minWidth:180,
                  transition:'border-color 0.2s'
                }}
                onFocus={e=>e.target.style.borderColor='var(--green)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'}
              >
                {sections.map((s,i)=>(
                  <option key={s.id} value={i}>{s.name}</option>
                ))}
              </select>
              <div style={{ position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--green)',fontSize:9 }}>▼</div>
            </div>
          )}
        </div>
      </div>

      {/* Menu items — no card border, just clean list */}
      <div style={{ maxWidth:900,margin:'0 auto',padding:'0 64px' }}>
        {items.length===0
          ? <p style={{ color:'var(--muted)',textAlign:'center',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',padding:'24px 0' }}>Coming soon.</p>
          : <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 64px' }} className="menu-items-grid">
              {items.map((item,i)=><MenuItem key={item.id||i} item={item} index={i}/>)}
            </div>
        }
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
