import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function fmt(t) {
  if(!t) return ''
  const [h,m] = t.split(':').map(Number)
  return `${h>12?h-12:h===0?12:h}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`
}

function useReveal(ref, delay=0) {
  useEffect(()=>{
    const el=ref.current; if(!el) return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{ if(e.isIntersecting){el.classList.add('visible');obs.disconnect()} },{threshold:0.04})
    obs.observe(el); return ()=>obs.disconnect()
  },[ref,delay])
}

function HoursRow({ day, h, isToday }) {
  return (
    <div style={{ display:'flex',alignItems:'baseline',padding:'11px 0',borderBottom:'1px solid var(--border)',position:'relative' }}>
      {isToday&&<div style={{ position:'absolute',left:-16,top:0,bottom:0,width:2,background:'var(--green)' }}/>}
      <span style={{ fontFamily:'DM Sans',fontSize:11,fontWeight:isToday?700:400,letterSpacing:'1.5px',textTransform:'uppercase',color:isToday?'#1C1A17':'var(--muted)',flexShrink:0 }}>
        {day}
      </span>
      <span style={{ flex:1,borderBottom:'1px dotted #C8C4BE',margin:'0 10px',position:'relative',top:'-4px',minWidth:16 }}/>
      <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:15,fontStyle:'italic',color:isToday?'var(--green)':(!h||h.closed?'#C8C4BE':'var(--muted)'),flexShrink:0 }}>
        {!h||h.closed?'Closed':`${fmt(h.open_time)} — ${fmt(h.close_time)}`}
      </span>
    </div>
  )
}

function SingleLocation({ loc, restaurant, hours, links }) {
  const infoRef = useRef(null); useReveal(infoRef)
  const mapRef = useRef(null); useReveal(mapRef, 0.15)

  const locHours = loc.location_hours?.length>0 ? loc.location_hours : hours||[]
  const locLinks = loc.location_links?.[0] || links || {}
  const addr = loc.address || restaurant.address
  const phone = loc.phone || locLinks.phone || links?.phone
  const today = new Date().getDay()

  return (
    <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',maxWidth:1100,margin:'0 auto',padding:'0 64px',gap:56 }} className="loc-grid">
      <div ref={infoRef} className="reveal-left">
        {addr&&(
          <div style={{ display:'flex',gap:12,marginBottom:8,fontSize:14,fontFamily:'DM Sans',color:'var(--muted)',lineHeight:1.6 }}>
            <span style={{ color:'var(--green)',flexShrink:0 }}>→</span><span>{addr}</span>
          </div>
        )}
        {phone&&(
          <div style={{ display:'flex',gap:12,marginBottom:32,fontSize:14,fontFamily:'DM Sans' }}>
            <span style={{ color:'var(--green)',flexShrink:0 }}>✆</span>
            <a href={`tel:${phone}`} style={{ color:'var(--muted)',textDecoration:'none',transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='var(--green)'}
              onMouseOut={e=>e.target.style.color='var(--muted)'}>{phone}</a>
          </div>
        )}
        <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginBottom:48 }}>
          {locLinks.order_url&&<a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-green" style={{ padding:'10px 24px',fontSize:12 }}>Order Online</a>}
          {locLinks.reservation_url&&<a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-outline" style={{ padding:'9px 24px',fontSize:12 }}>Reserve</a>}
          {phone&&<a href={`tel:${phone}`} onClick={()=>trackEvent(restaurant.id,'phone_click')} style={{ padding:'9px 20px',color:'var(--muted)',fontSize:12,fontFamily:'DM Sans',fontWeight:500,border:'1px solid var(--border)',display:'inline-block',textDecoration:'none',transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.color='var(--green)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>Call</a>}
        </div>
        {locHours.length>0&&(
          <div style={{ paddingLeft:16 }}>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#C8C4BE',marginBottom:8 }}>Hours</p>
            {DAYS.map((day,di)=>{ const h=locHours.find(r=>r.day_of_week===di); return <HoursRow key={di} day={day} h={h} isToday={di===today}/> })}
            <p style={{ fontSize:11,color:'#C8C4BE',marginTop:12,fontFamily:'DM Sans',fontStyle:'italic' }}>Hours may vary on holidays.</p>
          </div>
        )}
      </div>
      <div ref={mapRef} className="reveal-right">
        {addr ? (
          <a href={`https://maps.google.com?q=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer"
            style={{ display:'block',width:'100%',height:520,overflow:'hidden',position:'relative',border:'1px solid var(--border)',textDecoration:'none' }}>
            <iframe title="map" width="100%" height="100%"
              style={{ border:0,display:'block',filter:'grayscale(15%)',pointerEvents:'none' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}/>
            <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'14px 18px',background:'linear-gradient(to top,rgba(28,26,23,0.75),transparent)',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
              <span style={{ fontSize:13,color:'rgba(255,255,255,0.9)',fontFamily:'DM Sans',maxWidth:'72%',lineHeight:1.4 }}>{addr}</span>
              <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:13,fontStyle:'italic',color:'var(--gold)',whiteSpace:'nowrap' }}>Get Directions →</span>
            </div>
          </a>
        ) : (
          <div style={{ width:'100%',height:520,background:'#f0ede8',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <p style={{ fontFamily:'DM Sans',fontSize:13,color:'#bbb' }}>No address on file</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LocationCard({ loc, restaurant, hours, links, index }) {
  const ref = useRef(null); useReveal(ref, index * 0.1)
  const locHours = loc.location_hours?.length>0 ? loc.location_hours : hours||[]
  const locLinks = loc.location_links?.[0] || links || {}
  const addr = loc.address || restaurant.address
  const phone = loc.phone || locLinks.phone || links?.phone
  const today = new Date().getDay()

  return (
    <div ref={ref} className="reveal" style={{ background:'#fff',border:'1px solid var(--border)',padding:'36px 36px 32px' }}>
      <div style={{ fontFamily:'Cormorant Garamond,serif',fontSize:28,fontWeight:400,fontStyle:'italic',color:'#1C1A17',marginBottom:20,lineHeight:1.1 }}>
        {loc.name || restaurant.name}
      </div>
      {addr&&(
        <div style={{ display:'flex',gap:10,marginBottom:8,fontSize:14,fontFamily:'DM Sans',color:'var(--muted)',lineHeight:1.6 }}>
          <span style={{ color:'var(--green)',flexShrink:0 }}>→</span>{addr}
        </div>
      )}
      {phone&&(
        <div style={{ display:'flex',gap:10,marginBottom:24,fontSize:14,fontFamily:'DM Sans' }}>
          <span style={{ color:'var(--green)',flexShrink:0 }}>✆</span>
          <a href={`tel:${phone}`} style={{ color:'var(--muted)',textDecoration:'none' }}
            onMouseOver={e=>e.target.style.color='var(--green)'}
            onMouseOut={e=>e.target.style.color='var(--muted)'}>{phone}</a>
        </div>
      )}
      <div style={{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:28 }}>
        {locLinks.order_url&&<a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-green" style={{ padding:'9px 20px',fontSize:12 }}>Order Online</a>}
        {locLinks.reservation_url&&<a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-outline" style={{ padding:'8px 20px',fontSize:12 }}>Reserve</a>}
        {phone&&<a href={`tel:${phone}`} onClick={()=>trackEvent(restaurant.id,'phone_click')} style={{ padding:'8px 16px',color:'var(--muted)',fontSize:12,fontFamily:'DM Sans',fontWeight:500,border:'1px solid var(--border)',display:'inline-block',textDecoration:'none',transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.borderColor='var(--green)';e.currentTarget.style.color='var(--green)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--muted)'}}>Call</a>}
      </div>
      {locHours.length>0&&(
        <div style={{ paddingLeft:16,borderTop:'1px solid var(--border)',paddingTop:20 }}>
          <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:'#C8C4BE',marginBottom:8 }}>Hours</p>
          {DAYS.map((day,di)=>{ const h=locHours.find(r=>r.day_of_week===di); return <HoursRow key={di} day={day} h={h} isToday={di===today}/> })}
        </div>
      )}
      {addr&&(
        <a href={`https://maps.google.com?q=${encodeURIComponent(addr)}`} target="_blank" rel="noreferrer"
          style={{ display:'block',marginTop:24,height:200,overflow:'hidden',position:'relative',border:'1px solid var(--border)',textDecoration:'none' }}>
          <iframe title="map" width="100%" height="100%"
            style={{ border:0,display:'block',filter:'grayscale(15%)',pointerEvents:'none' }}
            loading="lazy" referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(addr)}&output=embed`}/>
          <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'10px 14px',background:'linear-gradient(to top,rgba(28,26,23,0.75),transparent)',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
            <span style={{ fontSize:12,color:'rgba(255,255,255,0.85)',fontFamily:'DM Sans',maxWidth:'75%',lineHeight:1.3 }}>{addr}</span>
            <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:12,fontStyle:'italic',color:'var(--gold)',whiteSpace:'nowrap' }}>Directions →</span>
          </div>
        </a>
      )}
    </div>
  )
}

export default function LocationSection({ restaurant, hours, links, locations }) {
  const locs = locations?.length>0 ? locations : [{
    name: restaurant.name,
    address: restaurant.address,
    phone: links?.phone,
    location_hours: [],
    location_links: [links]
  }]

  const isMulti = locs.length > 1

  return (
    <section id="location-section" style={{ background:'var(--warm)', padding:'80px 0 80px' }}>
      <div style={{ textAlign:'center', padding:'0 64px 48px' }}>
        <div className="eyebrow" style={{ justifyContent:'center' }}>
          <span className="eyebrow-line"/>{isMulti ? 'Our Locations' : 'Location & Hours'}<span className="eyebrow-line"/>
        </div>
        <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(40px,5vw,72px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:0,letterSpacing:'-0.3px' }}>
          {restaurant.name}
        </h2>
      </div>

      {isMulti ? (
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24 }} className="loc-multi-grid">
          {locs.map((loc,i)=>(
            <LocationCard key={loc.id||i} loc={loc} restaurant={restaurant} hours={hours} links={links} index={i}/>
          ))}
        </div>
      ) : (
        <SingleLocation loc={locs[0]} restaurant={restaurant} hours={hours} links={links}/>
      )}

      <style>{`
        @media(max-width:900px){
          .loc-grid{grid-template-columns:1fr!important;padding:0 24px!important;gap:36px!important}
          .loc-grid>div:last-child>a{height:300px!important}
          .loc-multi-grid{grid-template-columns:1fr!important;padding:0 24px!important}
          #location-section>div:first-child{padding:0 24px 40px!important}
        }
      `}</style>
    </section>
  )
}
