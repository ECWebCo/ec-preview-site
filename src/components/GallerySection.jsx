import { useRef, useEffect } from 'react'

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

function GalleryPhoto({ photo, delay }) {
  const ref = useRef(null)
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[delay])

  return (
    <div ref={ref} className="reveal-scale" style={{ overflow:'hidden', background:'#e0dbd0', aspectRatio:'1/1', cursor:'pointer' }}
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

  return (
    <section id="gallery-section" style={{ background:'var(--warm)', padding:'80px 0 0' }}>

      {/* Header */}
      <div style={{ textAlign:'center', padding:'0 64px 48px' }}>
        <div ref={headerRef} className="reveal">
          <div className="eyebrow" style={{ justifyContent:'center' }}>
            <span className="eyebrow-line"/>From Our Kitchen<span className="eyebrow-line"/>
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0 }}>
            The Experience
          </h2>
        </div>
      </div>

      {/* Grid — 4 col desktop, 2 col mobile */}
      <div className="gallery-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, padding:'0 64px', maxWidth:1200, margin:'0 auto 64px' }}>
        {photos.slice(0,8).map((photo,i)=>(
          <GalleryPhoto key={photo.id||i} photo={photo} delay={i*0.07}/>
        ))}
      </div>

      <style>{`
        @media(max-width:768px){
          .gallery-grid {
            grid-template-columns: repeat(2,1fr) !important;
            padding: 0 16px !important;
            gap: 6px !important;
          }
          #gallery-section > div:first-child {
            padding: 0 24px 36px !important;
          }
        }
      `}</style>
    </section>
  )
}
