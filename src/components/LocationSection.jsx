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

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const infoRef=useRef(null);useReveal(infoRef,index*0.1)
  const mapRef=useRef(null);useReveal(mapRef,index*0.1+0.15)
  const locHours = loc.location_hours?.length>0?loc.location_hours:fallbackHours
  const locLinks = loc.location_links?.[0]||fallbackLinks||{}
  const addr = loc.address

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:72, alignItems:'start', padding:'80px 64px', borderBottom:'1px solid #E4E0D8' }} className="loc-card">

      {/* Info */}
      <div ref={infoRef} className="reveal-left">
        <div className="eyebrow"><span className="eyebrow-line"/>{index===0?'Find Us':`Location ${index+1}`}</div>
        <h3 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(32px,4vw,52px)', fontWeight:700, fontStyle:'italic', color:'#1A1A18', lineHeight:1.05, margin:'0 0 24px', letterSpacing:'-0.3px' }}>
          {loc.name||restaurant.name}
        </h3>
        {addr&&<div style={{ fontSize:15, color:'#8A8680', marginBottom:10, fontFamily:'DM Sans', lineHeight:1.6, display:'flex', gap:10 }}><span style={{ color:'#C9A84C', flexShrink:0 }}>→</span><span>{addr}</span></div>}
        {(loc.phone||locLinks.phone)&&<div style={{ fontSize:15, color:'#8A8680', marginBottom:32, fontFamily:'DM Sans', display:'flex', gap:10 }}><span style={{ color:'#C9A84C', flexShrink:0 }}>✆</span><a href={`tel:${loc.phone||locLinks.phone}`} style={{ color:'#8A8680', textDecoration:'none' }}>{loc.phone||locLinks.phone}</a></div>}

        <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:40 }}>
          {locLinks.order_url&&<a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-gold" style={{ padding:'11px 24px', fontSize:12 }}>Order Online</a>}
          {locLinks.reservation_url&&<a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-outline-dark" style={{ padding:'10px 24px', fontSize:12 }}>Reserve</a>}
          {(loc.phone||locLinks.phone)&&<a href={`tel:${loc.phone||locLinks.phone}`} onClick={()=>trackEvent(restaurant.id,'phone_click')} style={{ padding:'10px 20px', background:'#f5f2ec', color:'#1A1A18', fontSize:12, fontFamily:'DM Sans', fontWeight:600, display:'inline-block', border:'1px solid #E4E0D8', textDecoration:'none', transition:'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#ede9e0'} onMouseOut={e=>e.currentTarget.style.background='#f5f2ec'}>Call</a>}
        </div>

        {/* Hours table in location card */}
        {locHours.length>0&&(
          <div>
            <p style={{ fontSize:10, letterSpacing:3, textTransform:'uppercase', color:'#C8C4BE', marginBottom:12, fontFamily:'DM Sans', fontWeight:600 }}>Hours</p>
            <div style={{ border:'1px solid #E4E0D8', overflow:'hidden', background:'#fafafa' }}>
              {DAYS.map((day,di)=>{
                const h=locHours.find(r=>r.day_of_week===di)
                const isToday=di===today
                return(
                  <div key={di} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 18px', borderBottom:di<6?'1px solid #EDEAE4':'none', background:isToday?'rgba(201,168,76,0.05)':'transparent', position:'relative' }}>
                    {isToday&&<div style={{ position:'absolute', left:0, top:0, bottom:0, width:2, background:'#C9A84C' }}/>}
                    <span style={{ fontSize:13, fontFamily:'DM Sans', color:isToday?'#1A1A18':'#8A8680', fontWeight:isToday?700:400 }}>{day}</span>
                    <span style={{ fontSize:13, fontFamily:"'Playfair Display',serif", fontStyle:'italic', color:isToday?'#C9A84C':(!h||h.closed?'#D8D5CF':'#8A8680') }}>
                      {!h||h.closed?'Closed':`${fmt(h.open_time)} — ${fmt(h.close_time)}`}
                    </span>
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize:11, color:'#C8C4BE', marginTop:10, fontFamily:'DM Sans', fontStyle:'italic' }}>Hours may vary on holidays.</p>
          </div>
        )}
      </div>

      {/* Map — large, prominent */}
      <div ref={mapRef} className="reveal-right">
        {addr?(
          <a href={`https://maps.google.com?q=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer"
            style={{ display:'block', textDecoration:'none', overflow:'hidden', position:'relative', aspectRatio:'4/3', background:'#E8E4DE', boxShadow:'0 20px 72px rgba(0,0,0,0.1)', transition:'transform 0.4s ease,box-shadow 0.4s ease' }}
            onMouseOver={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 28px 90px rgba(0,0,0,0.15)'}}
            onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 20px 72px rgba(0,0,0,0.1)'}}>
            <iframe title="map" width="100%" height="100%" style={{ border:0, display:'block', filter:'grayscale(20%) contrast(1.05)', pointerEvents:'none' }} loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}/>
            <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top,rgba(26,26,24,0.8),transparent)', padding:'20px 22px', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.85)', fontFamily:'DM Sans', maxWidth:'75%', lineHeight:1.4 }}>{addr}</span>
              <span style={{ fontSize:11, color:'#C9A84C', fontFamily:'DM Sans', fontWeight:700, letterSpacing:1, textTransform:'uppercase', whiteSpace:'nowrap' }}>Directions →</span>
            </div>
          </a>
        ):(
          <div style={{ aspectRatio:'4/3', background:'#f5f2ec', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontFamily:'DM Sans', fontSize:13, color:'#bbb' }}>No address on file</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Decorative SVG for section header
function GridPattern() {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  )
}

export default function LocationSection({ restaurant, hours, links, locations }) {
  const headerRef=useRef(null);useReveal(headerRef)
  const locs=locations?.length>0?locations:restaurant.locations?.length>0?restaurant.locations:[{name:restaurant.name,address:restaurant.address,phone:links?.phone,location_hours:[],location_links:[links]}]

  return (
    <section id="location-section" style={{ background:'#fff' }}>

      {/* Dark header band with grid pattern graphic */}
      <div className="grain" style={{ background:'#1A1A18', padding:'72px 64px 64px', position:'relative', overflow:'hidden' }}>
        <GridPattern />
        <div ref={headerRef} className="reveal" style={{ maxWidth:1100, margin:'0 auto', display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:24, position:'relative' }}>
          <div>
            <div className="eyebrow" style={{ color:'#C9A84C' }}><span className="eyebrow-line" style={{ background:'#C9A84C' }}/>{locs.length>1?'Our Locations':'Location & Hours'}</div>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(40px,5vw,66px)', fontWeight:700, fontStyle:'italic', color:'#fff', lineHeight:1.0, margin:0, letterSpacing:'-0.3px' }}>
              Come See Us
            </h2>
          </div>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', maxWidth:280, lineHeight:1.85, fontFamily:'DM Sans', fontWeight:300 }}>
            Walk-ins always welcome.{'\n'}Reservations recommended on weekends.
          </p>
        </div>
      </div>

      {/* White location cards */}
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        {locs.map((loc,i)=>(
          <LocationCard key={loc.id||i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links}/>
        ))}
      </div>

      <style>{`
        @media(max-width:900px){
          #location-section>div:first-child{padding:56px 24px 48px!important}
          .loc-card{grid-template-columns:1fr!important;gap:40px!important;padding:56px 24px!important}
        }
      `}</style>
    </section>
  )
}
