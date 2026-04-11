import { useRef, useEffect } from 'react'

function useReveal(ref,delay=0){
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04})
    obs.observe(el);return()=>obs.disconnect()
  },[ref,delay])
}

export default function GallerySection({ photos, restaurant }) {
  const headRef=useRef(null);useReveal(headRef)
  if(!photos?.length) return null
  const [p0,p1,p2,p3,p4,p5]=photos

  return (
    <section id="gallery-section" style={{ background:'#fff', paddingTop:80 }}>
      

      {/* Header */}
      <div style={{ padding:'72px 64px 64px',maxWidth:1100,margin:'0 auto' }}>
        <div ref={headRef} className="reveal" style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24 }}>
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#C0392B',marginBottom:16,display:'flex',alignItems:'center',gap:12 }}>
              <span style={{ display:'inline-block',width:32,height:1,background:'#C0392B' }}/>Gallery
            </p>
            <h2 className="syne" style={{ fontSize:'clamp(40px,5.5vw,72px)',fontWeight:800,color:'#141412',lineHeight:0.9,margin:0,letterSpacing:'-2px' }}>
              SEE FOR<br />YOURSELF.
            </h2>
          </div>
          <p style={{ fontSize:14,color:'#888480',maxWidth:240,lineHeight:1.85,fontFamily:'DM Sans',fontWeight:300 }}>
            Every visit is a fresh experience. Every plate, a memory.
          </p>
        </div>
      </div>

      {/* Full-bleed photo masonry */}
      <div style={{ display:'grid',gridTemplateColumns:'repeat(12,1fr)',gap:5,borderTop:'none' }}>
        {p0&&(
          <div className="g-cell reveal-left" style={{ gridColumn:'span 7',gridRow:'span 2',minHeight:520,background:'#e0dbd0' }}
            ref={el=>{if(el){const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04});obs.observe(el)}}}>
            <img src={p0.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
          </div>
        )}
        {[p1,p2].filter(Boolean).map((p,i)=>(
          <div key={i} className="g-cell reveal" style={{ gridColumn:'span 5',minHeight:257,background:'#e0dbd0',borderLeft:'1px solid #E4E0D8' }}
            ref={el=>{if(el){el.style.transitionDelay=`${i*0.1}s`;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04});obs.observe(el)}}}>
            <img src={p.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
          </div>
        ))}
        {[p3,p4].filter(Boolean).map((p,i)=>(
          <div key={i+2} className="g-cell reveal" style={{ gridColumn:'span 4',minHeight:260,background:'#e0dbd0',borderTop:'1px solid #E4E0D8',borderLeft:i>0?'1px solid #E4E0D8':'none' }}
            ref={el=>{if(el){el.style.transitionDelay=`${(i+2)*0.08}s`;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04});obs.observe(el)}}}>
            <img src={p.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
          </div>
        ))}
        {p5&&(
          <div className="g-cell reveal" style={{ gridColumn:'span 4',minHeight:260,background:'#e0dbd0',borderTop:'1px solid #E4E0D8',borderLeft:'1px solid #E4E0D8',position:'relative' }}
            ref={el=>{if(el){el.style.transitionDelay='0.4s';const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04});obs.observe(el)}}}>
            <img src={p5.url} alt={restaurant.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
            {photos.length>6&&(
              <div style={{ position:'absolute',inset:0,background:'rgba(255,255,255,0.82)',display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:8 }}>
                <span className="syne" style={{ fontSize:48,fontWeight:800,color:'#141412',letterSpacing:'-2px' }}>+{photos.length-6}</span>
                <span style={{ fontSize:10,letterSpacing:3,textTransform:'uppercase',color:'#888480',fontFamily:'DM Sans',fontWeight:700 }}>more photos</span>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:768px){
          #gallery-section>div:nth-child(2){padding:56px 24px 40px!important}
          #gallery-section>div:last-child{grid-template-columns:repeat(2,1fr)!important}
          #gallery-section>div:last-child>div{grid-column:span 1!important;grid-row:span 1!important;min-height:180px!important;border-left:none!important}
        }
      `}</style>
    </section>
  )
}
