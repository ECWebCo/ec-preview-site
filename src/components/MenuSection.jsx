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
    el.style.transitionDelay=`${Math.min(index*0.055,0.4)}s`
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.opacity=item.available===false?'0.35':'1'; el.style.transform='translateY(0)'; obs.disconnect() }
    },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[index])

  return (
    <div ref={ref} className="menu-item" style={{ opacity:0, transform:'translateY(14px)', transition:'opacity 0.5s ease, transform 0.5s ease, padding-left 0.35s ease' }}>
      <div>
        <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:item.description?6:0 }}>
          <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:18, fontWeight:700, fontStyle:'italic', color:'#1A1A18', margin:0, lineHeight:1.2 }}>
            {item.name}
          </h3>
          {item.available===false && <span style={{ fontSize:9, padding:'2px 8px', background:'#f5f0ea', color:'#bbb', fontFamily:'DM Sans', fontWeight:600, letterSpacing:1.5, textTransform:'uppercase', whiteSpace:'nowrap' }}>Sold Out</span>}
        </div>
        {item.description && <p style={{ fontSize:13, color:'#8A8680', lineHeight:1.65, margin:0, fontFamily:'DM Sans', fontWeight:400, maxWidth:440 }}>{item.description}</p>}
      </div>
      {item.price && <div style={{ fontFamily:"'Playfair Display',serif", fontSize:17, fontWeight:400, fontStyle:'italic', color:'#C9A84C', flexShrink:0, paddingTop:3, whiteSpace:'nowrap' }}>${Number(item.price).toFixed(2)}</div>}
    </div>
  )
}

// Decorative SVG divider
function WaveDivider({ flip=false }) {
  return (
    <div style={{ lineHeight:0, overflow:'hidden', background: flip ? '#1A1A18' : '#fff' }}>
      <svg viewBox="0 0 1440 48" preserveAspectRatio="none" style={{ width:'100%', height:48, display:'block', transform: flip ? 'scaleY(-1)' : 'none' }}>
        <path d="M0,0 C360,48 1080,48 1440,0 L1440,48 L0,48 Z" fill={flip ? '#fff' : '#1A1A18'} />
      </svg>
    </div>
  )
}

export default function MenuSection({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef, 0.15)

  if(!sections?.length) return null
  const active = sections[activeTab]
  const items = [...(active?.items?.filter(i=>i.available!==false)||[]), ...(active?.items?.filter(i=>i.available===false)||[])]

  return (
    <section id="menu-section">

      {/* ── DARK INTRO BAND with grain texture ── */}
      <div className="grain" style={{ background:'#1A1A18', padding:'88px 0 80px', position:'relative', overflow:'hidden' }}>
        {/* Decorative large circle */}
        <div style={{ position:'absolute', right:-120, top:'50%', transform:'translateY(-50%)', width:500, height:500, border:'1px solid rgba(201,168,76,0.08)', borderRadius:'50%', pointerEvents:'none' }} />
        <div style={{ position:'absolute', right:-60, top:'50%', transform:'translateY(-50%)', width:320, height:320, border:'1px solid rgba(201,168,76,0.05)', borderRadius:'50%', pointerEvents:'none' }} />

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 64px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:96, alignItems:'center' }} className="menu-intro-grid">
          <div ref={leftRef} className="reveal-left">
            <div className="eyebrow" style={{ color:'#C9A84C' }}>
              <span className="eyebrow-line" style={{ background:'#C9A84C' }} />
              Our Menu
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(48px,6vw,80px)', fontWeight:700, fontStyle:'italic', color:'#fff', lineHeight:0.95, margin:0, letterSpacing:'-0.5px' }}>
              Made with<br /><span style={{ color:'#C9A84C' }}>Heart.</span>
            </h2>
          </div>
          <div ref={rightRef} className="reveal-right">
            <p style={{ fontSize:16, color:'rgba(255,255,255,0.45)', lineHeight:1.9, fontFamily:'DM Sans', fontWeight:300, margin:'0 0 32px' }}>
              Every dish is crafted fresh to order. Quality ingredients, real cooking — no shortcuts, ever.
            </p>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
              <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,2 13.5,8.5 20,8.5 14.5,13 16.5,20 11,15.5 5.5,20 7.5,13 2,8.5 8.5,8.5" fill="#C9A84C" opacity="0.4"/></svg>
              <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.08)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Wave from dark to white */}
      <WaveDivider />

      {/* ── WHITE MENU CONTENT ── */}
      <div style={{ background:'#fff' }}>
        {/* Tabs */}
        {sections.length>1 && (
          <div style={{ position:'sticky', top:112, background:'#fff', zIndex:10, borderBottom:'1px solid #E4E0D8' }}>
            <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 64px', display:'flex', overflowX:'auto' }}>
              {sections.map((s,i)=>(
                <button key={s.id} onClick={()=>setActiveTab(i)} style={{ padding:'16px 28px', fontSize:11, border:'none', background:'none', fontFamily:'DM Sans', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', whiteSpace:'nowrap', cursor:'pointer', color:activeTab===i?'#1A1A18':'#C8C4BE', borderBottom:`2px solid ${activeTab===i?'#C9A84C':'transparent'}`, marginBottom:-1, transition:'all 0.25s' }}
                  onMouseOver={e=>{if(activeTab!==i)e.target.style.color='#888'}} onMouseOut={e=>{if(activeTab!==i)e.target.style.color='#C8C4BE'}}
                >{s.name}</button>
              ))}
            </div>
          </div>
        )}

        {/* Items — two column */}
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'16px 64px 100px' }}>
          {items.length===0
            ? <p style={{ color:'#bbb', fontSize:14, padding:'56px 0', textAlign:'center', fontFamily:'DM Sans', fontStyle:'italic' }}>Menu coming soon.</p>
            : <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 64px' }} className="menu-items-grid">
                {items.map((item,i)=><MenuItem key={item.id} item={item} index={i} />)}
              </div>
          }
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .menu-intro-grid{grid-template-columns:1fr!important;gap:32px!important;padding:48px 24px!important}
          .menu-items-grid{grid-template-columns:1fr!important}
          #menu-section>div:last-child>div:nth-child(2)>div{padding:8px 24px 72px!important}
          #menu-section div[style*="sticky"]>div{padding:0 16px!important}
        }
      `}</style>
    </section>
  )
}
