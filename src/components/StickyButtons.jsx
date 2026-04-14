import { useState } from 'react'
import { trackEvent } from '../lib/supabase'

function LocationPicker({ locations, type, onClose }) {
  const getUrl = loc => {
    const l=loc.location_links?.[0]||{}
    return type==='order'?l.order_url:type==='reserve'?l.reservation_url:`tel:${l.phone||loc.phone}`
  }
  return (
    <div style={{ position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.45)',display:'flex',alignItems:'flex-end',backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div style={{ width:'100%',background:'#fff',borderRadius:'12px 12px 0 0',padding:'0 0 36px',maxHeight:'60vh',overflowY:'auto',boxShadow:'0 -8px 48px rgba(0,0,0,0.15)' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'20px 24px 16px',display:'flex',justifyContent:'space-between',borderBottom:'1px solid #eee' }}>
          <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic',color:'#1C1A17' }}>
            {type==='order'?'Order from':type==='reserve'?'Reserve at':'Call'}
          </span>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#aaa' }}>✕</button>
        </div>
        {locations.map((loc,i)=>{
          const url=getUrl(loc); if(!url) return null
          return(
            <a key={i} href={url} target={type!=='call'?'_blank':'_self'} rel="noreferrer" onClick={onClose}
              style={{ display:'flex',flexDirection:'column',padding:'16px 24px',borderBottom:'1px solid #f8f6f2',textDecoration:'none',transition:'background 0.15s' }}
              onMouseOver={e=>e.currentTarget.style.background='#faf8f3'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:17,fontStyle:'italic',color:'#1C1A17' }}>{loc.name||loc.address||'Location'}</span>
              {loc.address&&<span style={{ fontSize:12,color:'#aaa',marginTop:2,fontFamily:'DM Sans' }}>{loc.address}</span>}
            </a>
          )
        })}
      </div>
    </div>
  )
}

export default function StickyButtons({ restaurant, links, locations }) {
  const [picker, setPicker] = useState(null)
  const isMulti = locations?.length > 1

  const hasOrder = isMulti?locations.some(l=>l.location_links?.[0]?.order_url):links?.order_url
  const hasReserve = isMulti?locations.some(l=>l.location_links?.[0]?.reservation_url):links?.reservation_url
  const hasCall = isMulti?locations.some(l=>l.location_links?.[0]?.phone||l.phone):links?.phone

  if(!hasOrder&&!hasReserve&&!hasCall) return null

  const singleUrl = type => {
    if(type==='order') return links?.order_url
    if(type==='reserve') return links?.reservation_url
    return `tel:${links?.phone}`
  }

  const BtnItem = ({ type, label, icon, primary }) => {
    if(type==='order'&&!hasOrder) return null
    if(type==='reserve'&&!hasReserve) return null
    if(type==='call'&&!hasCall) return null

    const style = {
      flex:1,display:'flex',flexDirection:'column',alignItems:'center',
      justifyContent:'center',gap:4,padding:'11px 8px',
      background: primary ? '#2D5016' : '#fff',
      color: primary ? '#fff' : '#1C1A17',
      textDecoration:'none',fontFamily:'Cormorant Garamond,serif',
      fontSize:14,fontWeight:400,fontStyle:'italic',cursor:'pointer',
      border:'none',borderRight:'1px solid #eee',
    }

    if(isMulti) return <button onClick={()=>setPicker(type)} style={style}>{icon}{label}</button>
    return <a href={singleUrl(type)} target={type!=='call'?'_blank':'_self'} rel="noreferrer" onClick={()=>trackEvent(restaurant.id,`${type}_click`)} style={style}>{icon}{label}</a>
  }

  return (
    <>
      {picker&&<LocationPicker locations={locations} type={picker} onClose={()=>setPicker(null)}/>}
      <div className="sticky-mobile-bar" style={{ position:'fixed',bottom:0,left:0,right:0,zIndex:200,display:'none',background:'#fff',borderTop:'1px solid #eee',paddingBottom:'env(safe-area-inset-bottom)',boxShadow:'0 -4px 24px rgba(0,0,0,0.08)' }}>
        <BtnItem type="order" label="Order" primary icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2h2l2.5 8h7l1.5-5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="13" cy="14" r="1" fill="currentColor"/></svg>}/>
        <BtnItem type="reserve" label="Reserve" icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14M6 2v2M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>}/>
        <BtnItem type="call" label="Call" icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="currentColor" strokeWidth="1.5"/></svg>}/>
      </div>
      <div className="sticky-mobile-spacer" style={{ display:'none',height:68 }}/>
    </>
  )
}
