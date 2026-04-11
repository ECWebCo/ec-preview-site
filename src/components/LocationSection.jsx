import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function fmt(t){if(!t)return'';const[h,m]=t.split(':').map(Number);return`${h>12?h-12:h===0?12:h}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}

function useReveal(ref,delay=0){
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.04})
    obs.observe(el);return()=>obs.disconnect()
  },[ref,delay])
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks, photos }) {
  const today = new Date().getDay()
  const infoRef=useRef(null);useReveal(infoRef,index*0.08)
  const mapRef=useRef(null);useReveal(mapRef,index*0.08+0.14)
  const locHours = loc.location_hours?.length>0?loc.location_hours:fallbackHours
  const locLinks = loc.location_links?.[0]||fallbackLinks||{}
  const addr = loc.address

  return (
    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:'none' }} className="loc-card">

      {/* Info column */}
      <div ref={infoRef} className="reveal-left" style={{ padding:'72px 56px',borderRight:'1px solid #E4E0D8' }}>
        <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#C9A84C',marginBottom:20,display:'flex',alignItems:'center',gap:12 }}>
          <span style={{ display:'inline-block',width:32,height:1,background:'#C9A84C' }}/>{index===0?'Location & Hours':`Location ${index+1}`}
        </p>
        <h3 className="syne" style={{ fontSize:'clamp(32px,4vw,52px)',fontWeight:800,color:'#141412',lineHeight:0.9,margin:'0 0 28px',letterSpacing:'-1.5px' }}>
          {(loc.name||restaurant.name).toUpperCase()}
        </h3>

        {addr&&<div style={{ fontSize:15,color:'#888480',marginBottom:10,fontFamily:'DM Sans',lineHeight:1.6,display:'flex',gap:10 }}><span style={{ color:'#C9A84C',flexShrink:0,fontWeight:700 }}>→</span><span>{addr}</span></div>}
        {(loc.phone||locLinks.phone)&&<div style={{ fontSize:15,color:'#888480',marginBottom:32,fontFamily:'DM Sans',display:'flex',gap:10 }}><span style={{ color:'#C9A84C',flexShrink:0,fontWeight:700 }}>✆</span><a href={`tel:${loc.phone||locLinks.phone}`} style={{ color:'#888480',textDecoration:'none' }}>{loc.phone||locLinks.phone}</a></div>}

        <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginBottom:48 }}>
          {locLinks.order_url&&<a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-gold" style={{ padding:'11px 24px',fontSize:12 }}>Order Online</a>}
          {locLinks.reservation_url&&<a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-ink" style={{ padding:'10px 24px',fontSize:12 }}>Reserve</a>}
          {(loc.phone||locLinks.phone)&&<a href={`tel:${loc.phone||locLinks.phone}`} onClick={()=>trackEvent(restaurant.id,'phone_click')} style={{ padding:'10px 20px',background:'#f8f5f0',color:'#141412',fontSize:12,fontFamily:'DM Sans',fontWeight:700,display:'inline-block',border:'1px solid #DEDAD2',textDecoration:'none',transition:'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#ede9e0'} onMouseOut={e=>e.currentTarget.style.background='#f8f5f0'}>Call</a>}
        </div>

        {/* Hours */}
        {locHours.length>0&&(
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#bbb',marginBottom:14 }}>Hours</p>
            <div style={{ border:'2px solid #141412',overflow:'hidden' }}>
              {DAYS.map((day,di)=>{
                const h=locHours.find(r=>r.day_of_week===di)
                const isToday=di===today
                return(
                  <div key={di} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 18px',borderBottom:di<6?'1px solid #DEDAD2':'none',background:isToday?'rgba(201,168,76,0.06)':'#fff',position:'relative' }}>
                    {isToday&&<div style={{ position:'absolute',left:0,top:0,bottom:0,width:3,background:'#C9A84C' }}/>}
                    <span style={{ fontSize:13,fontFamily:'DM Sans',color:isToday?'#141412':'#888480',fontWeight:isToday?700:400 }}>{day}</span>
                    <span className="syne" style={{ fontSize:13,color:isToday?'#C9A84C':(!h||h.closed?'#D8D5CF':'#888480'),fontWeight:700 }}>
                      {!h||h.closed?'CLOSED':`${fmt(h.open_time)} — ${fmt(h.close_time)}`}
                    </span>
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize:11,color:'#C8C4BE',marginTop:10,fontFamily:'DM Sans' }}>Hours may vary on holidays.</p>
          </div>
        )}
      </div>

      {/* Right — map stacked on photo */}
      <div ref={mapRef} className="reveal-right" style={{ display:'flex',flexDirection:'column' }}>
        {/* Food photo top half */}
        {photos?.length > 0 && (
          <div className="photo-card" style={{ flex:1,minHeight:280,background:'#e0dbd0',borderBottom:'1px solid #E4E0D8',overflow:'hidden' }}>
            <img src={(photos[index+2]||photos[0])?.url} alt="restaurant" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
          </div>
        )}
        {/* Map bottom half */}
        {addr&&(
          <a href={`https://maps.google.com?q=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer"
            style={{ flex:1,minHeight:240,display:'block',textDecoration:'none',overflow:'hidden',position:'relative',background:'#e8e4dc',transition:'opacity 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.88'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            <iframe title="map" width="100%" height="100%" style={{ border:0,display:'block',filter:'grayscale(30%)',pointerEvents:'none',minHeight:240 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}/>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top,rgba(20,20,18,0.75),transparent)',padding:'16px 20px',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
              <span style={{ fontSize:13,color:'rgba(255,255,255,0.85)',fontFamily:'DM Sans',maxWidth:'75%',lineHeight:1.4 }}>{addr}</span>
              <span className="syne" style={{ fontSize:11,color:'#C9A84C',fontWeight:800,letterSpacing:1,textTransform:'uppercase',whiteSpace:'nowrap' }}>DIRECTIONS →</span>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}

export default function LocationSection({ restaurant, hours, links, locations, photos }) {
  const headRef=useRef(null);useReveal(headRef)
  const locs=locations?.length>0?locations:restaurant.locations?.length>0?restaurant.locations:[{name:restaurant.name,address:restaurant.address,phone:links?.phone,location_hours:[],location_links:[links]}]

  return (
    <section id="location-section" style={{ background:'#fff', paddingTop:80 }}>
      

      {/* Header */}
      <div style={{ padding:'72px 64px 56px',maxWidth:1100,margin:'0 auto' }}>
        <div ref={headRef} className="reveal" style={{ display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:24 }}>
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#C9A84C',marginBottom:16,display:'flex',alignItems:'center',gap:12 }}>
              <span style={{ display:'inline-block',width:32,height:1,background:'#C9A84C' }}/>{locs.length>1?'Our Locations':'Location & Hours'}
            </p>
            <h2 className="syne" style={{ fontSize:'clamp(40px,5.5vw,72px)',fontWeight:800,color:'#141412',lineHeight:0.9,margin:0,letterSpacing:'-2px' }}>
              COME<br />SEE US.
            </h2>
          </div>
          <p style={{ fontSize:14,color:'#888480',maxWidth:260,lineHeight:1.85,fontFamily:'DM Sans',fontWeight:300 }}>
            Walk-ins welcome. Reservations recommended on weekends.
          </p>
        </div>
      </div>

      {locs.map((loc,i)=>(
        <LocationCard key={loc.id||i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} photos={photos}/>
      ))}

      <style>{`
        @media(max-width:900px){
          #location-section>div:nth-child(2){padding:56px 24px 40px!important}
          .loc-card{grid-template-columns:1fr!important}
          .loc-card>div:first-child{padding:48px 24px!important;border-right:none!important}
          .loc-card>div:last-child{border-top:1px solid #E4E0D8}
        }
      `}</style>
    </section>
  )
}
