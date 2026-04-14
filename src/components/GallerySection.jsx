import { useRef, useEffect } from 'react'

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

function GalleryPhoto({ photo, style, delay }) {
  const ref = useRef(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[delay])

  return (
    <div ref={ref} className="reveal-scale" style={{ overflow:'hidden', background:'#e0dbd0', position:'relative', ...style }}>
      <img src={photo.url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', display:'block' }}/>
    </div>
  )
}

export default function GallerySection({ photos, restaurant }) {
  const headerRef = useRef(null); useReveal(headerRef)
  if(!photos?.length) return null

  const [p0,p1,p2,p3,p4,p5,p6,p7] = photos

  return (
    <section id="gallery-section" style={{ background:'var(--cream)', padding:'72px 0 0' }}>

      {/* Header */}
      <div style={{ textAlign:'center', padding:'0 64px 56px', maxWidth:960, margin:'0 auto' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow" style={{ justifyContent:'center' }}>
            <span className="eyebrow-line"/>Gallery<span className="eyebrow-line"/>
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'clamp(36px,4.5vw,58px)', fontWeight:300, fontStyle:'italic', color:'#1C1A17', lineHeight:1.0, margin:0 }}>
            The Experience
          </h2>
        </div>
      </div>

      {/* Coppa-style grid — 4 across, 2 rows, tight gaps */}
      <div style={{ padding:'0 64px', maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
          {[p0,p1,p2,p3].filter(Boolean).map((p,i)=>(
            <GalleryPhoto key={i} photo={p} delay={i*0.08} style={{ aspectRatio:'1/1' }}/>
          ))}
        </div>
        {photos.length > 4 && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginTop:6 }}>
            {[p4,p5,p6,p7].filter(Boolean).map((p,i)=>(
              <GalleryPhoto key={i+4} photo={p} delay={(i+4)*0.08} style={{ aspectRatio:'1/1' }}/>
            ))}
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
