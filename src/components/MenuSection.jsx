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
    el.style.transitionDelay=`${Math.min(index*0.04,0.4)}s`
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.opacity=item.available===false?'0.35':'1'; el.style.transform='translateY(0)'; obs.disconnect() }
    },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[index])

  return (
    <div ref={ref} style={{
      opacity:0, transform:'translateY(10px)',
      transition:'opacity 0.5s ease, transform 0.5s ease',
      padding:'14px 0',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{ display:'flex', alignItems:'baseline', width:'100%' }}>
        <span style={{ fontFamily:'DM Sans',fontSize:11,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',color:'#1C1A17',flexShrink:0 }}>
          {item.name}
        </span>
        <span style={{ flex:1,borderBottom:'1px dotted #C8C4BE',margin:'0 10px',position:'relative',top:'-4px',minWidth:16 }}/>
        {item.price&&(
          <span style={{ fontFamily:'DM Sans',fontSize:11,fontWeight:600,color:'var(--green)',flexShrink:0 }}>
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

function SectionColumn({ section, colIndex }) {
  const ref = useRef(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${colIndex*0.12}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[colIndex])

  if(!section) return <div/>
  const items = [...(section.items?.filter(i=>i.available!==false)||[]), ...(section.items?.filter(i=>i.available===false)||[])]

  return (
    <div ref={ref} className={colIndex===0?'reveal-left':'reveal-right'}>
      <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:22,fontWeight:400,fontStyle:'italic',color:'#1C1A17',marginBottom:4,letterSpacing:'-0.2px' }}>
        {section.name}
      </h3>
      <div style={{ width:32,height:1,background:'var(--green)',marginBottom:20 }}/>
      {items.map((item,i)=><MenuItem key={item.id||i} item={item} index={i}/>)}
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const headerRef = useRef(null); useReveal(headerRef)

  if(!sections?.length) return null

  const items = [...(sections[activeTab]?.items?.filter(i=>i.available!==false)||[]), ...(sections[activeTab]?.items?.filter(i=>i.available===false)||[])]

  // Pair sections for desktop two-column layout
  const pairs = []
  for(let i=0; i<sections.length; i+=2) {
    pairs.push([sections[i], sections[i+1]||null])
  }

  return (
    <section id="menu-section" style={{ background:'var(--cream)', padding:'80px 0' }}>

      {/* Header */}
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px 48px',textAlign:'center' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow" style={{ justifyContent:'center' }}>
            <span className="eyebrow-line"/>The Menu<span className="eyebrow-line"/>
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0 }}>
            Made with <em style={{ fontWeight:600,color:'var(--green)' }}>Passion.</em>
          </h2>
        </div>
      </div>

      {/* ── DESKTOP: full menu, all sections, two columns ── */}
      <div className="menu-desktop" style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px' }}>
        {pairs.map(([left, right], pi)=>(
          <div key={pi} style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 80px',marginBottom: pi < pairs.length-1 ? 56 : 0,paddingBottom: pi < pairs.length-1 ? 56 : 0,borderBottom: pi < pairs.length-1 ? '1px solid var(--border)' : 'none' }}>
            <SectionColumn section={left} colIndex={0}/>
            <SectionColumn section={right} colIndex={1}/>
          </div>
        ))}
      </div>

      {/* ── MOBILE: dropdown + single section ── */}
      <div className="menu-mobile" style={{ display:'none',padding:'0 24px' }}>
        {sections.length > 1 && (
          <div style={{ display:'flex',justifyContent:'center',marginBottom:32 }}>
            <div style={{ position:'relative' }}>
              <select
                value={activeTab}
                onChange={e=>setActiveTab(Number(e.target.value))}
                style={{ appearance:'none',WebkitAppearance:'none',padding:'10px 44px 10px 20px',fontFamily:'DM Sans',fontSize:11,fontWeight:600,letterSpacing:'2px',textTransform:'uppercase',color:'#1C1A17',background:'#fff',border:'1px solid var(--border)',cursor:'pointer',outline:'none',minWidth:200 }}
                onFocus={e=>e.target.style.borderColor='var(--green)'}
                onBlur={e=>e.target.style.borderColor='var(--border)'}
              >
                {sections.map((s,i)=>(
                  <option key={s.id} value={i}>{s.name}</option>
                ))}
              </select>
              <div style={{ position:'absolute',right:16,top:'50%',transform:'translateY(-50%)',pointerEvents:'none',color:'var(--green)',fontSize:9 }}>▼</div>
            </div>
          </div>
        )}
        {items.map((item,i)=><MenuItem key={item.id||i} item={item} index={i}/>)}
      </div>

      <style>{`
        @media(max-width:900px){
          .menu-desktop { display: none !important; }
          .menu-mobile  { display: block !important; }
          #menu-section > div:nth-child(2) { padding: 0 24px !important; }
        }
      `}</style>
    </section>
  )
}
