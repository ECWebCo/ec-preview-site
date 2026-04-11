const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function getStatus(hours) {
  if (!hours?.length) return { open:false, text:'See hours below' }
  const now = new Date()
  const today = hours.find(h => h.day_of_week===now.getDay() && !h.label)
  if (!today||today.closed) return { open:false, text:'Closed today' }
  const [oh,om] = today.open_time.split(':').map(Number)
  const [ch,cm] = today.close_time.split(':').map(Number)
  const nowMins = now.getHours()*60+now.getMinutes()
  if (nowMins>=oh*60+om && nowMins<ch*60+cm) {
    const closeH = ch>12?ch-12:ch===0?12:ch
    return { open:true, text:`Open now · closes ${closeH}:${String(cm).padStart(2,'0')} ${ch>=12?'PM':'AM'}` }
  }
  const openH = oh>12?oh-12:oh===0?12:oh
  return { open:false, text:`Opens ${openH}:${String(om).padStart(2,'0')} ${oh>=12?'PM':'AM'}` }
}

function getTodayHours(hours) {
  const regular = hours.filter(h=>!h.label)
  const today = regular.find(h=>h.day_of_week===new Date().getDay())
  if (!today||today.closed) return null
  const fmt = t => { const [h,m]=t.split(':').map(Number); return `${h>12?h-12:h===0?12:h}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}` }
  return `${fmt(today.open_time)} – ${fmt(today.close_time)}`
}

const Dot = () => (
  <svg width="5" height="5" viewBox="0 0 5 5" style={{ flexShrink:0, margin:'0 24px' }}>
    <circle cx="2.5" cy="2.5" r="2.5" fill="#C9A84C" opacity="0.5"/>
  </svg>
)

export default function InfoCarousel({ hours, links, restaurant }) {
  const status = getStatus(hours)
  const todayHours = getTodayHours(hours)

  const items = [
    { type:'status', open:status.open, text:status.text },
    todayHours && { type:'text', text:`Today: ${todayHours}` },
    links?.phone && { type:'link', href:`tel:${links.phone}`, text:links.phone },
    restaurant?.address && { type:'text', text:restaurant.address },
    restaurant?.city && { type:'text', text:restaurant.city },
    restaurant?.tagline && { type:'text', text:restaurant.tagline },
    links?.order_url && { type:'link', href:links.order_url, text:'Order Online', external:true },
    links?.reservation_url && { type:'link', href:links.reservation_url, text:'Reserve a Table', external:true },
    { type:'status', open:status.open, text:status.text },
    todayHours && { type:'text', text:`Today: ${todayHours}` },
    links?.phone && { type:'link', href:`tel:${links.phone}`, text:links.phone },
    restaurant?.address && { type:'text', text:restaurant.address },
    restaurant?.city && { type:'text', text:restaurant.city },
    restaurant?.tagline && { type:'text', text:restaurant.tagline },
    links?.order_url && { type:'link', href:links.order_url, text:'Order Online', external:true },
    links?.reservation_url && { type:'link', href:links.reservation_url, text:'Reserve a Table', external:true },
  ].filter(Boolean)

  return (
    <div style={{ background:'#1A1A18', borderTop:'3px solid #C9A84C', borderBottom:'3px solid #C9A84C', height:52, overflow:'hidden', display:'flex', alignItems:'center' }}>
      <div className="ticker-outer" style={{ flex:1 }}>
        <div className="ticker-inner">
          {items.map((item, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center' }}>
              {item.type==='status' && (
                <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:7, height:7, borderRadius:'50%', background:item.open?'#5CB85C':'#D9534F', display:'inline-block', animation:'pulseDot 2.5s ease-in-out infinite' }} />
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)', fontFamily:'DM Sans', fontWeight:600, letterSpacing:'0.5px', whiteSpace:'nowrap' }}>{item.text}</span>
                </span>
              )}
              {item.type==='text' && (
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.45)', fontFamily:'DM Sans', fontWeight:400, letterSpacing:'0.5px', whiteSpace:'nowrap', fontStyle:'italic' }}>{item.text}</span>
              )}
              {item.type==='link' && (
                <a href={item.href} target={item.external?'_blank':undefined} rel={item.external?'noreferrer':undefined}
                  style={{ fontSize:11, color:'#C9A84C', fontFamily:'DM Sans', fontWeight:700, letterSpacing:'1px', textTransform:'uppercase', textDecoration:'none', whiteSpace:'nowrap', transition:'opacity 0.2s' }}
                  onMouseOver={e=>e.target.style.opacity='0.65'} onMouseOut={e=>e.target.style.opacity='1'}>
                  {item.text}
                </a>
              )}
              <Dot />
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}
