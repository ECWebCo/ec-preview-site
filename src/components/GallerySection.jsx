import { useRef, useEffect } from 'react'

function useReveal(ref,delay=0){
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04})
    obs.observe(el);return()=>obs.disconnect()
  },[ref,delay])
}

function Rev({children,cls='reveal',delay=0,style={}}){
  const ref=useRef(null)
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04})
    obs.observe(el);return()=>obs.disconnect()
  },[])
  return <div ref={ref} className={cls} style={style}>{children}</div>
}

export default function GallerySection({ photos, restaurant }) {
  const headerRef=useRef(null);useReveal(headerRef)
  if(!photos?.length) return null
  const [p0,p1,p2,p3,p4,p5]=photos

  return (
    <section id="gallery-section" style={{ background:'#fff' }}>

      {/* Header band — white with gold accent */}
      <div style={{ padding:'88px 64px 64px', maxWidth:1100, margin:'0 auto' }}>
        <div ref={headerRef} className="reveal" style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24 }}>
          <div>
            <div className="eyebrow"><span className="eyebrow-line"/>Gallery</div>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(40px,5vw,64px)', fontWeight:700, fontStyle:'italic', color:'#1A1A18', lineHeight:1.0, margin:0, letterSpacing:'-0.3px' }}>
              See for<br />Yourself
            </h2>
          </div>
          <p style={{ fontSize:14, color:'#8A8680', maxWidth:260, lineHeight:1.85, fontFamily:'DM Sans', fontWeight:300 }}>
            Every visit is a fresh experience. Every plate, a memory.
          </p>
        </div>
      </div>

      {/* Full-bleed photo masonry */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:4 }} className="g-grid">
        {p0&&<Rev cls="reveal-left" style={{ gridColumn:'span 7', gridRow:'span 2', minHeight:520, background:'#ddd', overflow:'hidden' }}>
          <img src={p0.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.7s ease' }} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'}/>
        </Rev>}
        {[p1,p2].filter(Boolean).map((p,i)=>(
          <Rev key={i} delay={i*0.08} style={{ gridColumn:'span 5', minHeight:258, background:'#ddd', overflow:'hidden' }}>
            <img src={p.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.7s ease' }} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          </Rev>
        ))}
        {[p3,p4].filter(Boolean).map((p,i)=>(
          <Rev key={i+2} delay={(i+2)*0.08} style={{ gridColumn:'span 4', minHeight:260, background:'#ddd', overflow:'hidden' }}>
            <img src={p.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.7s ease' }} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          </Rev>
        ))}
        {p5&&(
          <Rev delay={0.4} style={{ gridColumn:'span 4', minHeight:260, background:'#ddd', overflow:'hidden', position:'relative' }}>
            <img src={p5.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.7s ease' }} onMouseOver={e=>e.target.style.transform='scale(1.05)'} onMouseOut={e=>e.target.style.transform='scale(1)'}/>
            {photos.length>6&&<div style={{ position:'absolute',inset:0,background:'rgba(255,255,255,0.78)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:6 }}>
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,fontStyle:'italic',color:'#1A1A18' }}>+{photos.length-6}</span>
              <span style={{ fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'#8A8680',fontFamily:'DM Sans' }}>more photos</span>
            </div>}
          </Rev>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          #gallery-section>div:first-child{padding:64px 24px 40px!important}
          .g-grid{grid-template-columns:repeat(2,1fr)!important}
          .g-grid>div{grid-column:span 1!important;grid-row:span 1!important;min-height:180px!important}
        }
      `}</style>
    </section>
  )
}
