import { useState } from 'react'
import { trackEvent } from '../lib/supabase'

function Picker({ locations, type, onClose }) {
  const getUrl = loc => {
    const l = loc.location_links?.[0] || {}
    return type === 'order' ? l.order_url : type === 'reserve' ? l.reservation_url : `tel:${l.phone || loc.phone}`
  }
  return (
    <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ background:'#fff', minWidth:300, boxShadow:'0 24px 64px rgba(0,0,0,0.15)', overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'18px 24px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:13, fontWeight:600, fontFamily:'DM Sans' }}>{type==='order'?'Order from':type==='reserve'?'Reserve at':'Call'}</span>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:'#aaa' }}>✕</button>
        </div>
        {locations.map((loc, i) => {
          const url = getUrl(loc); if (!url) return null
          return (
            <a key={i} href={url} target={type!=='call'?'_blank':'_self'} rel="noreferrer" onClick={onClose}
              style={{ display:'flex', flexDirection:'column', padding:'16px 24px', borderBottom:'1px solid #f8f8f6', textDecoration:'none', transition:'background 0.15s' }}
              onMouseOver={e=>e.currentTarget.style.background='#fafafa'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontSize:15, fontWeight:600, color:'#1a1a1a', fontFamily:'DM Sans' }}>{loc.name||loc.address}</span>
              {loc.address&&<span style={{ fontSize:12, color:'#aaa', marginTop:3, fontFamily:'DM Sans' }}>{loc.address}</span>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function Nav({ restaurant, links, locations }) {
  const [open, setOpen] = useState(false)
  const [picker, setPicker] = useState(null)
  const isMulti = locations?.length > 1

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); setOpen(false) }

  function cta(type, url) {
    if (isMulti) { setPicker(type); return }
    trackEvent(restaurant.id, `${type}_click`)
    if (url) window.open(url, type==='call'?'_self':'_blank')
  }

  const navLinks = [
    { label:'Menu', id:'menu-section' },
    { label:'Gallery', id:'gallery-section' },
    { label:'Location', id:'location-section' },
    { label:'Contact', id:'contact-section' },
  ]

  return (
    <>
      {picker && <Picker locations={locations} type={picker} onClose={()=>setPicker(null)} />}

      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#fff', borderBottom:'1px solid #E4E0D8' }}>
        {/* Row 1 — logo centered, CTAs right */}
        <div style={{ position:'relative', height:68, display:'flex', alignItems:'center', padding:'0 32px' }}>
          {/* Hamburger left — mobile only */}
          <button className="nav-ham" onClick={()=>setOpen(!open)}
            style={{ display:'none', background:'none', border:'none', flexDirection:'column', gap:5, cursor:'pointer', padding:4, zIndex:2 }}>
            {[0,1,2].map(i=>(
              <span key={i} style={{ display:'block', width:22, height:1.5, background:'#1a1a1a', transition:'0.3s',
                transform: i===0&&open?'rotate(45deg) translate(4px,5px)':i===2&&open?'rotate(-45deg) translate(4px,-5px)':'none',
                opacity: i===1&&open?0:1 }} />
            ))}
          </button>
          {/* Logo — absolutely centered */}
          <div style={{ position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', zIndex:1, pointerEvents:'none' }}>
            {restaurant.logo_url
              ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height:52, width:'auto', objectFit:'contain', display:'block', pointerEvents:'auto' }} />
              : <span style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:22, fontStyle:'italic', fontWeight:700, color:'#1a1a1a', whiteSpace:'nowrap', pointerEvents:'auto' }}>{restaurant.name}</span>}
          </div>
          {/* CTAs right — desktop */}
          <div className="nav-cta-d" style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center', zIndex:2 }}>
            {(links?.phone||(isMulti&&locations.some(l=>l.location_links?.[0]?.phone)))&&(
              <button onClick={()=>cta('call',`tel:${links?.phone}`)} style={{ padding:'7px 16px', background:'none', border:'1px solid #ddd', color:'#666', fontSize:11, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.borderColor='#aaa';e.currentTarget.style.color='#1a1a1a'}} onMouseOut={e=>{e.currentTarget.style.borderColor='#ddd';e.currentTarget.style.color='#666'}}>Call</button>
            )}
            {(links?.reservation_url||(isMulti&&locations.some(l=>l.location_links?.[0]?.reservation_url)))&&(
              <button onClick={()=>cta('reserve',links?.reservation_url)} style={{ padding:'7px 16px', background:'none', border:'1px solid #ddd', color:'#666', fontSize:11, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.borderColor='#aaa';e.currentTarget.style.color='#1a1a1a'}} onMouseOut={e=>{e.currentTarget.style.borderColor='#ddd';e.currentTarget.style.color='#666'}}>Reserve</button>
            )}
            {(links?.order_url||(isMulti&&locations.some(l=>l.location_links?.[0]?.order_url)))&&(
              <button onClick={()=>cta('order',links?.order_url)} className="btn-gold" style={{ padding:'8px 20px', fontSize:11 }}>Order</button>
            )}
          </div>
        </div>
        {/* Row 2 — nav links centered, desktop only */}
        <div className="nav-links-d" style={{ borderTop:'1px solid #f0ede8', display:'flex', justifyContent:'center', gap:44, padding:'9px 32px' }}>
          {navLinks.map(({label,id})=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', fontSize:10, letterSpacing:'2.5px', textTransform:'uppercase', color:'#999', cursor:'pointer', fontFamily:'DM Sans', fontWeight:600, transition:'color 0.2s' }} onMouseOver={e=>e.target.style.color='#1a1a1a'} onMouseOut={e=>e.target.style.color='#999'}>{label}</button>
          ))}
        </div>
      </header>

      {/* Mobile menu */}
      {open && (
        <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:99, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          {navLinks.map(({label,id})=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', borderBottom:'1px solid #f5f5f5', width:'100%', padding:'22px 0', textAlign:'center', fontSize:28, color:'#1a1a1a', fontFamily:"'Playfair Display',serif", fontStyle:'italic', cursor:'pointer', fontWeight:700, transition:'color 0.2s' }} onMouseOver={e=>e.target.style.color='#C9A84C'} onMouseOut={e=>e.target.style.color='#1a1a1a'}>{label}</button>
          ))}
          <div style={{ display:'flex', gap:12, marginTop:36, flexWrap:'wrap', justifyContent:'center' }}>
            {links?.order_url&&<button onClick={()=>{setOpen(false);cta('order',links.order_url)}} className="btn-gold">Order Online</button>}
            {links?.reservation_url&&<button onClick={()=>{setOpen(false);cta('reserve',links.reservation_url)}} className="btn-outline-dark">Reserve</button>}
          </div>
        </div>
      )}
      <style>{`
        @media(max-width:900px){.nav-links-d{display:none!important}.nav-cta-d{display:none!important}.nav-ham{display:flex!important}}
      `}</style>
    </>
  )
}
