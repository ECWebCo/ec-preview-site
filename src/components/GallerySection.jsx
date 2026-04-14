import { useState, useEffect, useRef } from 'react'

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.05})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

export default function GallerySection({ photos, restaurant }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const timerRef = useRef(null)
  const headerRef = useRef(null); useReveal(headerRef)

  if(!photos?.length) return null

  const total = photos.length

  const goTo = (idx) => {
    setPrev(current)
    setCurrent(idx)
  }

  const next = () => goTo((current+1)%total)
  const back = () => goTo((current-1+total)%total)

  // Auto-advance every 5 seconds
  useEffect(()=>{
    timerRef.current = setInterval(()=>{ setCurrent(c=>(c+1)%total) }, 5000)
    return ()=>clearInterval(timerRef.current)
  },[total])

  // Pause on hover
  const pause = () => clearInterval(timerRef.current)
  const resume = () => { timerRef.current = setInterval(()=>setCurrent(c=>(c+1)%total),5000) }

  return (
    <section id="gallery-section" style={{ background:'var(--cream)' }}>

      {/* Header */}
      <div style={{ padding:'88px 72px 64px',maxWidth:1100,margin:'0 auto' }}>
        <div ref={headerRef} className="reveal" style={{ textAlign:'center' }}>
          <div>
            <div className="eyebrow" style={{justifyContent:'center'}}><span className="eyebrow-line"/>Gallery<span className="eyebrow-line"/></div>
            <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(44px,5.5vw,72px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0,letterSpacing:'-0.3px' }}>
              The Experience
            </h2>
          </div>

        </div>
      </div>

      {/* ── Full-width carousel ── */}
      <div
        style={{ position:'relative',width:'100%',height:'clamp(420px,60vh,720px)',overflow:'hidden',background:'#1C1A17',cursor:'pointer',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',margin:'0 64px',width:'calc(100% - 128px)' }}
        onMouseEnter={pause} onMouseLeave={resume}
      >
        {/* Slides */}
        {photos.map((photo,i)=>(
          <div key={photo.id||i} style={{
            position:'absolute',inset:0,
            opacity: i===current ? 1 : 0,
            transition:'opacity 1.2s ease',
            zIndex: i===current ? 1 : 0
          }}>
            <img
              src={photo.url} alt={restaurant.name}
              style={{
                width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',
                animation: i===current ? 'carouselKenBurns 8s ease-in-out infinite alternate' : 'none'
              }}
            />
          </div>
        ))}

        {/* Dark gradient overlays for readability */}
        <div style={{ position:'absolute',inset:0,background:'linear-gradient(to right,rgba(0,0,0,0.25),transparent 40%,transparent 60%,rgba(0,0,0,0.25))',zIndex:2,pointerEvents:'none' }}/>
        <div style={{ position:'absolute',bottom:0,left:0,right:0,height:160,background:'linear-gradient(to top,rgba(0,0,0,0.4),transparent)',zIndex:2,pointerEvents:'none' }}/>

        {/* Prev / Next arrows */}
        {['prev','next'].map(dir=>(
          <button key={dir} onClick={dir==='prev'?back:next}
            style={{
              position:'absolute',top:'50%',transform:'translateY(-50%)',
              [dir==='prev'?'left':'right']:32,
              zIndex:3,background:'rgba(255,255,255,0.12)',
              border:'1px solid rgba(255,255,255,0.3)',
              color:'#fff',width:48,height:48,display:'flex',alignItems:'center',justifyContent:'center',
              cursor:'pointer',transition:'background 0.2s',backdropFilter:'blur(8px)',fontSize:20
            }}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}
            onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.12)'}
          >
            {dir==='prev'?'←':'→'}
          </button>
        ))}

        {/* Dots */}
        <div style={{ position:'absolute',bottom:28,left:'50%',transform:'translateX(-50%)',display:'flex',gap:10,zIndex:3 }}>
          {photos.map((_,i)=>(
            <button key={i} onClick={()=>goTo(i)}
              style={{
                width: i===current ? 28 : 8,
                height:8,border:'none',
                background: i===current ? '#fff' : 'rgba(255,255,255,0.35)',
                cursor:'pointer',transition:'all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
                padding:0
              }}
            />
          ))}
        </div>

        {/* Photo count */}
        <div style={{ position:'absolute',top:24,right:32,zIndex:3,fontFamily:'DM Sans',fontSize:11,color:'rgba(255,255,255,0.5)',letterSpacing:2 }}>
          {String(current+1).padStart(2,'0')} / {String(total).padStart(2,'0')}
        </div>
      </div>

      {/* ── Thumbnail strip ── */}
      {photos.length>1&&(
        <div style={{ display:'flex',gap:4,padding:'4px 64px 0',background:'var(--cream)' }}>
          {photos.slice(0,8).map((photo,i)=>(
            <div key={i} onClick={()=>goTo(i)}
              style={{
                flex:1,height:80,overflow:'hidden',cursor:'pointer',
                opacity: i===current ? 1 : 0.5,
                transition:'opacity 0.3s ease',
                outline: i===current ? '2px solid var(--green)' : 'none',
                outlineOffset:0
              }}
              onMouseOver={e=>{ if(i!==current) e.currentTarget.style.opacity='0.8' }}
              onMouseOut={e=>{ if(i!==current) e.currentTarget.style.opacity='0.5' }}
            >
              <img src={photo.url} alt="" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:768px){
          #gallery-section>div:first-child{padding:64px 28px 40px!important}
          #gallery-section>div:nth-child(2){height:320px!important}
        }
      `}</style>
    </section>
  )
}
