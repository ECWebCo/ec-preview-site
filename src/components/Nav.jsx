import { useState, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function Picker({ locations, type, onClose }) {
  const getUrl = loc => {
    const l = loc.location_links?.[0] || {}
    return type==='order'?l.order_url:type==='reserve'?l.reservation_url:`tel:${l.phone||loc.phone}`
  }
  return (
    <div style={{ position:'fixed',inset:0,zIndex:300,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div style={{ background:'#fff',minWidth:320,boxShadow:'0 24px 80px rgba(0,0,0,0.15)',overflow:'hidden' }} onClick={e=>e.stopPropagation()}>
        <div style={{ padding:'18px 28px',borderBottom:'1px solid #eee',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic',color:'#1C1A17' }}>
            {type==='order'?'Order from':type==='reserve'?'Reserve at':'Call'}
          </span>
          <button onClick={onClose} style={{ background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#aaa' }}>✕</button>
        </div>
        {locations.map((loc,i)=>{
          const url=getUrl(loc); if(!url) return null
          return (
            <a key={i} href={url} target={type!=='call'?'_blank':'_self'} rel="noreferrer" onClick={onClose}
              style={{ display:'flex',flexDirection:'column',padding:'16px 28px',borderBottom:'1px solid #f8f6f2',textDecoration:'none',transition:'background 0.15s' }}
              onMouseOver={e=>e.currentTarget.style.background='#faf8f3'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:16,fontStyle:'italic',color:'#1C1A17' }}>{loc.name||loc.address}</span>
              {loc.address&&<span style={{ fontSize:12,color:'#aaa',marginTop:2,fontFamily:'DM Sans' }}>{loc.address}</span>}
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
  const [scrolled, setScrolled] = useState(false)
  const isMulti = locations?.length > 1

  useEffect(()=>{
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  },[])

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); setOpen(false) }

  function cta(type, url) {
    if(isMulti){setPicker(type);return}
    trackEvent(restaurant.id,`${type}_click`)
    if(url) window.open(url,type==='call'?'_self':'_blank')
  }

  const navLinks = [
    {label:'Menu',id:'menu-section'},
    {label:'Gallery',id:'gallery-section'},
    {label:'Location',id:'location-section'},
    {label:'Contact',id:'contact-section'},
  ]

  return (
    <>
      {picker&&<Picker locations={locations} type={picker} onClose={()=>setPicker(null)}/>}

      <header className={scrolled?'nav-scrolled':''} style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        background:'#fff',
        borderBottom:'1px solid #E2DDD4',
        transition:'box-shadow 0.3s ease'
      }}>
        {/* Single row — logo left, nav center, CTAs right */}
        <div style={{ height:56,display:'flex',alignItems:'center',padding:'0 40px',gap:24 }}>

          {/* Logo — left */}
          <div style={{ flexShrink:0 }}>
            {restaurant.logo_url
              ? <img src={restaurant.logo_url} alt={restaurant.name} style={{ height:40,width:'auto',objectFit:'contain',display:'block' }}/>
              : <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:20,fontStyle:'italic',fontWeight:600,color:'#1C1A17',whiteSpace:'nowrap' }}>
                  {restaurant.name}
                </span>
            }
          </div>

          {/* Nav links — center */}
          <div className="nav-links-d" style={{ flex:1,display:'flex',justifyContent:'center',gap:40 }}>
            {navLinks.map(({label,id})=>(
              <button key={id} onClick={()=>scrollTo(id)}
                style={{ background:'none',border:'none',fontSize:10,letterSpacing:'3px',textTransform:'uppercase',color:'#aaa',cursor:'pointer',fontFamily:'DM Sans',fontWeight:600,transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#2D5016'}
                onMouseOut={e=>e.target.style.color='#aaa'}>
                {label}
              </button>
            ))}
          </div>

          {/* CTAs — right */}
          <div className="nav-cta-d" style={{ display:'flex',gap:8,alignItems:'center',flexShrink:0 }}>
            {(links?.phone||(isMulti&&locations.some(l=>l.location_links?.[0]?.phone)))&&(
              <button onClick={()=>cta('call',`tel:${links?.phone}`)}
                style={{ padding:'6px 16px',background:'none',border:'1px solid #ddd',color:'#7A766E',fontSize:11,fontFamily:'DM Sans',fontWeight:500,cursor:'pointer',transition:'all 0.2s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2D5016';e.currentTarget.style.color='#2D5016'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#ddd';e.currentTarget.style.color='#7A766E'}}>
                Call
              </button>
            )}
            {(links?.reservation_url||(isMulti&&locations.some(l=>l.location_links?.[0]?.reservation_url)))&&(
              <button onClick={()=>cta('reserve',links?.reservation_url)}
                style={{ padding:'6px 16px',background:'none',border:'1px solid #ddd',color:'#7A766E',fontSize:11,fontFamily:'DM Sans',fontWeight:500,cursor:'pointer',transition:'all 0.2s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#2D5016';e.currentTarget.style.color='#2D5016'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#ddd';e.currentTarget.style.color='#7A766E'}}>
                Reserve
              </button>
            )}
            {(links?.order_url||(isMulti&&locations.some(l=>l.location_links?.[0]?.order_url)))&&(
              <button onClick={()=>cta('order',links?.order_url)} className="btn-green" style={{ padding:'7px 20px',fontSize:11 }}>
                Order
              </button>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button className="nav-ham" onClick={()=>setOpen(!open)}
            style={{ display:'none',background:'none',border:'none',flexDirection:'column',gap:5,cursor:'pointer',padding:4,marginLeft:'auto' }}>
            {[0,1,2].map(i=>(
              <span key={i} style={{ display:'block',width:22,height:1.5,background:'#1C1A17',transition:'0.3s',
                transform:i===0&&open?'rotate(45deg) translate(4px,5px)':i===2&&open?'rotate(-45deg) translate(4px,-5px)':'none',
                opacity:i===1&&open?0:1 }}/>
            ))}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {open&&(
        <div style={{ position:'fixed',inset:0,background:'#fff',zIndex:99,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
          {navLinks.map(({label,id})=>(
            <button key={id} onClick={()=>scrollTo(id)}
              style={{ background:'none',border:'none',borderBottom:'1px solid #f5f2ed',width:'100%',padding:'22px 0',textAlign:'center',fontSize:30,color:'#1C1A17',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',cursor:'pointer',fontWeight:600,transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#2D5016'} onMouseOut={e=>e.target.style.color='#1C1A17'}>
              {label}
            </button>
          ))}
          <div style={{ display:'flex',gap:14,marginTop:36,flexWrap:'wrap',justifyContent:'center' }}>
            {links?.reservation_url&&<button onClick={()=>{setOpen(false);cta('reserve',links.reservation_url)}} className="btn-green">Reserve</button>}
            {links?.order_url&&<button onClick={()=>{setOpen(false);cta('order',links.order_url)}} className="btn-outline">Order</button>}
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .nav-links-d{display:none!important}
          .nav-cta-d{display:none!important}
          .nav-ham{display:flex!important}
        }
      `}</style>
    </>
  )
}
