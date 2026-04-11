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
    el.style.transitionDelay=`${Math.min(index*0.05,0.35)}s`
    const obs=new IntersectionObserver(([e])=>{
      if(e.isIntersecting){ el.style.opacity=item.available===false?'0.35':'1'; el.style.transform='translateY(0)'; obs.disconnect() }
    },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[index])

  return (
    <div ref={ref} className="menu-item" style={{ opacity:0,transform:'translateY(14px)',transition:'opacity 0.5s ease,transform 0.5s ease,padding-left 0.3s ease' }}>
      <div>
        <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:item.description?5:0 }}>
          <span className="syne" style={{ fontSize:16,fontWeight:700,color:'#141412',letterSpacing:'-0.2px' }}>{item.name}</span>
          {item.available===false&&<span style={{ fontSize:9,padding:'2px 8px',background:'#f0ede6',color:'#bbb',fontFamily:'DM Sans',fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',whiteSpace:'nowrap' }}>Sold Out</span>}
        </div>
        {item.description&&<p style={{ fontSize:13,color:'#888480',lineHeight:1.6,margin:0,fontFamily:'DM Sans',fontWeight:400,maxWidth:420 }}>{item.description}</p>}
      </div>
      {item.price&&<div className="syne" style={{ fontSize:16,fontWeight:700,color:'#C0392B',flexShrink:0,paddingTop:1,whiteSpace:'nowrap' }}>${Number(item.price).toFixed(2)}</div>}
    </div>
  )
}

export default function MenuSection({ sections, photos }) {
  const [activeTab, setActiveTab] = useState(0)
  const introRef = useRef(null); useReveal(introRef)
  const textRef = useRef(null); useReveal(textRef, 0.12)

  if(!sections?.length) return null
  const active = sections[activeTab]
  const items = [...(active?.items?.filter(i=>i.available!==false)||[]),...(active?.items?.filter(i=>i.available===false)||[])]

  // Pick a food photo for the menu intro (2nd photo avoids hero repeat)
  const menuPhoto = photos?.[1]?.url || photos?.[0]?.url

  return (
    <section id="menu-section" style={{ background:'#fff', paddingTop:80 }}>

      {/* ── Section rule ── */}
      

      {/* ── Intro: split — headline left, photo right ── */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:480 }} className="menu-intro-grid">
        {/* Text left */}
        <div ref={introRef} className="reveal-left" style={{ padding:'72px 64px',display:'flex',flexDirection:'column',justifyContent:'center',borderRight:'1px solid #E4E0D8' }}>
          <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#C0392B',marginBottom:20,display:'flex',alignItems:'center',gap:12 }}>
            <span style={{ display:'inline-block',width:32,height:1,background:'#C0392B' }}/>The Menu
          </p>
          <h2 className="syne" style={{ fontSize:'clamp(44px,5.5vw,76px)',fontWeight:800,color:'#141412',lineHeight:0.92,margin:'0 0 28px',letterSpacing:'-2px' }}>
            MADE<br />FRESH<br /><span style={{ color:'#C0392B' }}>DAILY.</span>
          </h2>
          <p ref={textRef} className="reveal" style={{ fontSize:15,color:'#888480',lineHeight:1.85,fontFamily:'DM Sans',fontWeight:300,maxWidth:340,margin:'0 0 36px' }}>
            Everything is prepared fresh to order using quality ingredients. Real cooking, no shortcuts.
          </p>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            <button onClick={()=>document.getElementById('menu-items')?.scrollIntoView({behavior:'smooth'})} className="btn-ink">See Full Menu</button>
          </div>
        </div>
        {/* Photo right */}
        <div style={{ position:'relative',minHeight:480,background:'#e8e4dc',overflow:'hidden' }}>
          {menuPhoto
            ? <img src={menuPhoto} alt="Menu" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',transition:'transform 0.6s ease' }} onMouseOver={e=>e.target.style.transform='scale(1.03)'} onMouseOut={e=>e.target.style.transform='scale(1)'}/>
            : <div style={{ width:'100%',height:'100%',background:'linear-gradient(135deg,#ede9e0,#d8d3c8)' }}/>
          }
        </div>
      </div>

      {/* ── Section rule ── */}
      

      {/* ── Tabs ── */}
      {sections.length>1&&(
        <div style={{ position:'sticky',top:116,background:'#fff',zIndex:10,borderBottom:'1px solid #DEDAD2' }}>
          <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'flex',overflowX:'auto' }}>
            {sections.map((s,i)=>(
              <button key={s.id} onClick={()=>setActiveTab(i)} style={{ padding:'16px 28px',fontSize:10,border:'none',background:'none',fontFamily:'DM Sans',fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',whiteSpace:'nowrap',cursor:'pointer',color:activeTab===i?'#141412':'#bbb',borderBottom:`3px solid ${activeTab===i?'#C0392B':'transparent'}`,marginBottom:-1,transition:'all 0.25s' }}
                onMouseOver={e=>{if(activeTab!==i)e.target.style.color='#888'}} onMouseOut={e=>{if(activeTab!==i)e.target.style.color='#bbb'}}
              >{s.name}</button>
            ))}
          </div>
        </div>
      )}

      {/* ── Items ── */}
      <div id="menu-items" style={{ maxWidth:1100,margin:'0 auto',padding:'8px 64px 96px' }}>
        {items.length===0
          ? <p style={{ color:'#bbb',fontSize:14,padding:'56px 0',textAlign:'center',fontFamily:'DM Sans' }}>Menu coming soon.</p>
          : <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0 64px' }} className="menu-items-grid">
              {items.map((item,i)=><MenuItem key={item.id} item={item} index={i}/>)}
            </div>
        }
      </div>

      {/* ── Photo strip at bottom of menu ── */}
      {photos?.length >= 3 && (
        <>
          <div className="section-rule"/>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',height:320 }}>
            {[photos[2],photos[3],photos[4]].filter(Boolean).map((p,i)=>(
              <div key={i} className="g-cell" style={{ borderRight:i<2?'4px solid #141412':'none',background:'#e8e4dc' }}>
                <img src={p.url} alt="food" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @media(max-width:900px){
          .menu-intro-grid{grid-template-columns:1fr!important}
          .menu-intro-grid>div:last-child{min-height:300px!important;border-right:none!important;border-top:1px solid #E4E0D8}
          .menu-intro-grid>div:first-child{padding:56px 24px!important;border-right:none!important}
          .menu-items-grid{grid-template-columns:1fr!important}
          #menu-section>div[style*="sticky"]>div{padding:0 16px!important}
          #menu-items{padding:8px 24px 72px!important}
        }
      `}</style>
    </section>
  )
}
