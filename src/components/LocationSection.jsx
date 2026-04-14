import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function fmt(t){if(!t)return'';const[h,m]=t.split(':').map(Number);return`${h>12?h-12:h===0?12:h}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`}

function useReveal(ref,delay=0){
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.05})
    obs.observe(el);return()=>obs.disconnect()
  },[ref,delay])
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const infoRef=useRef(null); useReveal(infoRef, index*0.1)
  const rightRef=useRef(null); useReveal(rightRef, index*0.1+0.15)
  const locHours = loc.location_hours?.length>0?loc.location_hours:fallbackHours
  const locLinks = loc.location_links?.[0]||fallbackLinks||{}
  const addr = loc.address

  return (
    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',borderTop:'1px solid var(--border)' }} className="loc-card">

      {/* Info */}
      <div ref={infoRef} className="reveal-left" style={{ padding:'56px 64px',borderRight:'1px solid var(--border)' }}>
        <div className="eyebrow"><span className="eyebrow-line"/>{locs.length>1?`Location ${index+1}`:'Visit Us'}</div>
        <h3 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,4.5vw,60px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:'0 0 28px',letterSpacing:'-0.3px' }}>
          {loc.name||restaurant.name}
        </h3>

        {addr&&<div style={{ fontSize:14,color:'var(--muted)',marginBottom:10,fontFamily:'DM Sans',lineHeight:1.7,display:'flex',gap:12,alignItems:'flex-start' }}>
          <span style={{ color:'var(--green)',flexShrink:0,marginTop:2 }}>→</span><span>{addr}</span>
        </div>}
        {(loc.phone||locLinks.phone)&&<div style={{ fontSize:14,color:'var(--muted)',marginBottom:36,fontFamily:'DM Sans',display:'flex',gap:12 }}>
          <span style={{ color:'var(--green)',flexShrink:0 }}>✆</span>
          <a href={`tel:${loc.phone||locLinks.phone}`} style={{ color:'var(--muted)',textDecoration:'none',transition:'color 0.2s' }}
            onMouseOver={e=>e.target.style.color='var(--green)'} onMouseOut={e=>e.target.style.color='var(--muted)'}>
            {loc.phone||locLinks.phone}
          </a>
        </div>}

        <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginBottom:40 }}>
          {locLinks.order_url&&<a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-green" style={{ padding:'11px 28px',fontSize:12 }}>Order Online</a>}
          {locLinks.reservation_url&&<a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-outline" style={{ padding:'10px 28px',fontSize:12 }}>Reserve</a>}
          {(loc.phone||locLinks.phone)&&<a href={`tel:${loc.phone||locLinks.phone}`} onClick={()=>trackEvent(restaurant.id,'phone_click')} style={{ padding:'10px 20px',background:'transparent',color:'var(--muted)',fontSize:12,fontFamily:'DM Sans',fontWeight:500,display:'inline-block',border:'1px solid var(--border)',textDecoration:'none',transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.color='var(--green)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>Call</a>}
        </div>

        {/* Hours */}
        {locHours.length>0&&(
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:600,letterSpacing:'3px',textTransform:'uppercase',color:'#C8C4BE',marginBottom:16 }}>Hours</p>
            <div style={{ border:'1px solid var(--border)',overflow:'hidden' }}>
              {DAYS.map((day,di)=>{
                const h=locHours.find(r=>r.day_of_week===di)
                const isToday=di===today
                return(
                  <div key={di} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 20px',borderBottom:di<6?'1px solid #f0ede8':'none',background:isToday?'rgba(45,80,22,0.04)':'#fff',position:'relative' }}>
                    {isToday&&<div style={{ position:'absolute',left:0,top:0,bottom:0,width:2,background:'var(--green)' }}/>}
                    <span style={{ fontSize:13,fontFamily:'DM Sans',color:isToday?'#1C1A17':'var(--muted)',fontWeight:isToday?600:400 }}>{day}</span>
                    <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:15,fontStyle:'italic',color:isToday?'var(--green)':(!h||h.closed?'#D4CFCA':'var(--muted)') }}>
                      {!h||h.closed?'Closed':`${fmt(h.open_time)} — ${fmt(h.close_time)}`}
                    </span>
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize:11,color:'#C8C4BE',marginTop:12,fontFamily:'DM Sans',fontStyle:'italic' }}>Hours may vary on holidays.</p>
          </div>
        )}
      </div>

      {/* Right: photo + map stacked */}
      <div ref={rightRef} className="reveal-right" style={{ display:'flex',flexDirection:'column' }}>

        {addr&&(
          <a href={`https://maps.google.com?q=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer"
            style={{ display:'block',textDecoration:'none',overflow:'hidden',position:'relative',minHeight:320,background:'#e8e4dc',transition:'opacity 0.2s',margin:'0 64px 64px',border:'1px solid var(--border)' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            <iframe title="map" width="100%" height="100%" style={{ border:0,display:'block',filter:'grayscale(20%) contrast(1.05)',pointerEvents:'none',minHeight:320 }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}/>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,background:'linear-gradient(to top,rgba(28,26,23,0.75),transparent)',padding:'16px 22px',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
              <span style={{ fontSize:13,color:'rgba(255,255,255,0.85)',fontFamily:'DM Sans',maxWidth:'72%',lineHeight:1.4 }}>{addr}</span>
              <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:14,fontStyle:'italic',color:'var(--gold-lt)',whiteSpace:'nowrap' }}>Get Directions →</span>
            </div>
          </a>
        )}
      </div>
    </div>
  )
}

// need locs in scope for LocationCard
let locs = []

export default function LocationSection({ restaurant, hours, links, locations }) {
  const headerRef=useRef(null); useReveal(headerRef)
  locs = locations?.length>0?locations:restaurant.locations?.length>0?restaurant.locations:[{name:restaurant.name,address:restaurant.address,phone:links?.phone,location_hours:[],location_links:[links]}]

  return (
    <section id="location-section" style={{ background:'var(--cream)' }}>


      {locs.map((loc,i)=>(
        <LocationCard key={loc.id||i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links}/>
      ))}

      <style>{`
        @media(max-width:900px){
          #location-section>div:first-child{padding:0 28px 40px!important}
          .loc-card{grid-template-columns:1fr!important}
          .loc-card>div:first-child{padding:56px 28px!important;border-right:none!important}
          .loc-card>div:last-child{border-top:1px solid var(--border)}
        }
      `}</style>
    </section>
  )
}
