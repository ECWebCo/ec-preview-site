import { useRef, useEffect } from 'react'

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

function GalleryPhoto({ photo, delay, tall }) {
  const ref = useRef(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[delay])

  return (
    <div ref={ref} className="reveal-scale" style={{
      overflow:'hidden', background:'#e0dbd0', position:'relative',
      aspectRatio: tall ? '3/4' : '4/3',
      cursor:'pointer'
    }}
      onMouseOver={e=>{
        e.currentTarget.querySelector('img').style.transform='scale(1.06)'
        e.currentTarget.querySelector('img').style.filter='brightness(1.08)'
        e.currentTarget.querySelector('.hover-overlay').style.opacity='1'
      }}
      onMouseOut={e=>{
        e.currentTarget.querySelector('img').style.transform='scale(1)'
        e.currentTarget.querySelector('img').style.filter='brightness(1)'
        e.currentTarget.querySelector('.hover-overlay').style.opacity='0'
      }}
    >
      <img src={photo.url} alt="" style={{ width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',display:'block',transition:'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94),filter 0.6s ease' }}/>
      <div className="hover-overlay" style={{ position:'absolute',inset:0,background:'rgba(45,80,22,0.15)',opacity:0,transition:'opacity 0.4s ease',pointerEvents:'none' }}/>
    </div>
  )
}

export default function GallerySection({ photos, restaurant }) {
  const headerRef = useRef(null); useReveal(headerRef)
  if(!photos?.length) return null

  const [p0,p1,p2,p3,p4,p5,p6,p7] = photos

  return (
    <section id="gallery-section" style={{ background:'var(--warm)', padding:'80px 0 0' }}>

      {/* Header */}
      <div style={{ textAlign:'center', padding:'0 64px 48px' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow" style={{ justifyContent:'center' }}>
            <span className="eyebrow-line"/>From Our Kitchen<span className="eyebrow-line"/>
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0 }}>
            From Our Kitchen
          </h2>
        </div>
      </div>

      {/* 3-column grid with varied heights for visual interest */}
      <div style={{ padding:'0 64px', maxWidth:1200, margin:'0 auto 80px' }}>
        {/* Row 1 — 3 photos, middle one taller */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:8, alignItems:'start' }}>
          {p0&&<GalleryPhoto photo={p0} delay={0} tall={false}/>}
          {p1&&<GalleryPhoto photo={p1} delay={0.08} tall={true}/>}
          {p2&&<GalleryPhoto photo={p2} delay={0.16} tall={false}/>}
        </div>
        {/* Row 2 — 3 photos, first and last taller */}
        {photos.length > 3 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, alignItems:'start' }}>
            {p3&&<GalleryPhoto photo={p3} delay={0.24} tall={true}/>}
            {p4&&<GalleryPhoto photo={p4} delay={0.32} tall={false}/>}
            {p5&&<GalleryPhoto photo={p5} delay={0.4} tall={true}/>}
          </div>
        )}
        {/* Row 3 — remaining photos */}
        {photos.length > 6 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8 }}>
            {p6&&<GalleryPhoto photo={p6} delay={0.48} tall={false}/>}
            {p7&&<GalleryPhoto photo={p7} delay={0.56} tall={false}/>}
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          #gallery-section>div:nth-child(2){padding:0 24px!important}
          #gallery-section>div:nth-child(2)>div{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </section>
  )
}
