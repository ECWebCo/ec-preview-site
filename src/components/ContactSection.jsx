import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function useReveal(ref,delay=0){
  useEffect(()=>{
    const el=ref.current;if(!el)return
    el.style.transitionDelay=`${delay}s`
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add('visible');obs.disconnect()}},{threshold:0.05})
    obs.observe(el);return()=>obs.disconnect()
  },[ref,delay])
}

function DiamondDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20, margin:'36px 0' }}>
      <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
      <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,0 14,7 7,14 0,7" fill="#C9A84C" opacity="0.6"/></svg>
      <div style={{ flex:1, height:1, background:'rgba(255,255,255,0.1)' }}/>
    </div>
  )
}

// Decorative rings SVG
function Rings() {
  return (
    <svg style={{ position:'absolute', right:-80, top:'50%', transform:'translateY(-50%)', opacity:0.06, pointerEvents:'none' }} width="480" height="480" viewBox="0 0 480 480" fill="none">
      <circle cx="240" cy="240" r="238" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="240" cy="240" r="190" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="240" cy="240" r="140" stroke="#C9A84C" strokeWidth="1"/>
      <circle cx="240" cy="240" r="90" stroke="#C9A84C" strokeWidth="1"/>
      <line x1="240" y1="2" x2="240" y2="478" stroke="#C9A84C" strokeWidth="0.5"/>
      <line x1="2" y1="240" x2="478" y2="240" stroke="#C9A84C" strokeWidth="0.5"/>
    </svg>
  )
}

export default function ContactSection({ restaurant, links }) {
  const headRef=useRef(null);useReveal(headRef)
  const leftRef=useRef(null);useReveal(leftRef,0.12)
  const rightRef=useRef(null);useReveal(rightRef,0.24)

  return (
    <section id="contact-section" className="grain" style={{ background:'#1A1A18', position:'relative', overflow:'hidden' }}>
      <Rings/>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'96px 64px', position:'relative' }}>

        {/* Centered headline */}
        <div ref={headRef} className="reveal" style={{ textAlign:'center', marginBottom:80 }}>
          <div className="eyebrow" style={{ justifyContent:'center', color:'#C9A84C' }}>
            <span style={{ flex:1, maxWidth:64, height:1, background:'#C9A84C', display:'inline-block' }}/>
            Contact Us
            <span style={{ flex:1, maxWidth:64, height:1, background:'#C9A84C', display:'inline-block' }}/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'clamp(44px,6vw,82px)', fontWeight:700, fontStyle:'italic', color:'#fff', lineHeight:0.95, margin:0, letterSpacing:'-0.5px' }}>
            We'd Love to<br />Hear From You
          </h2>
        </div>

        {/* Two columns */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'start' }} className="contact-cols">

          {/* Left — contact items */}
          <div ref={leftRef} className="reveal-left">
            {[
              restaurant.email&&{ href:`mailto:${restaurant.email}`, icon:'✉', label:'Email us', value:restaurant.email },
              links?.phone&&{ href:`tel:${links.phone}`, icon:'☎', label:'Call us', value:links.phone, onClick:()=>trackEvent(restaurant.id,'phone_click') },
              links?.reservation_url&&{ href:links.reservation_url, icon:'📅', label:'Make a reservation', value:'Book online →', onClick:()=>trackEvent(restaurant.id,'reserve_click'), ext:true },
            ].filter(Boolean).map(({href,icon,label,value,onClick,ext})=>(
              <a key={label} href={href} target={ext?'_blank':undefined} rel={ext?'noreferrer':undefined} onClick={onClick}
                style={{ display:'flex', alignItems:'center', gap:20, padding:'22px 0', borderBottom:'1px solid rgba(255,255,255,0.07)', textDecoration:'none', transition:'padding-left 0.35s ease' }}
                onMouseOver={e=>{e.currentTarget.style.paddingLeft='8px';e.currentTarget.querySelector('.cv').style.color='#C9A84C'}}
                onMouseOut={e=>{e.currentTarget.style.paddingLeft='0';e.currentTarget.querySelector('.cv').style.color='#fff'}}>
                <div style={{ width:52, height:52, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20, transition:'border-color 0.25s' }}>{icon}</div>
                <div>
                  <div style={{ fontSize:10, letterSpacing:'2.5px', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:4, fontFamily:'DM Sans', fontWeight:600 }}>{label}</div>
                  <div className="cv" style={{ fontSize:15, color:'#fff', fontFamily:'DM Sans', fontWeight:600, transition:'color 0.25s' }}>{value}</div>
                </div>
              </a>
            ))}

            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginTop:40 }}>
              {links?.reservation_url&&<a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-gold">Reserve a Table</a>}
              {links?.order_url&&<a href={links.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-outline-light">Order Online</a>}
            </div>
          </div>

          {/* Right — brand card */}
          <div ref={rightRef} className="reveal-right">
            <div style={{ border:'1px solid rgba(255,255,255,0.1)', padding:'52px 48px', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(to right,#C9A84C,#E8D080,#C9A84C)' }}/>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontStyle:'italic', fontWeight:700, color:'#fff', marginBottom:6, letterSpacing:'-0.3px' }}>{restaurant.name}</div>
              {restaurant.city&&<div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', fontFamily:'DM Sans', marginBottom:0 }}>{restaurant.city}</div>}
              <DiamondDivider/>
              {restaurant.tagline&&<div style={{ fontSize:16, color:'rgba(255,255,255,0.45)', lineHeight:1.8, fontFamily:"'Playfair Display',serif", fontStyle:'italic', marginBottom:32 }}>"{restaurant.tagline}"</div>}
              {restaurant.est&&<div style={{ fontSize:10, color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans', letterSpacing:2, textTransform:'uppercase' }}>Est. {restaurant.est}</div>}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          #contact-section>div{padding:72px 24px!important}
          .contact-cols{grid-template-columns:1fr!important;gap:48px!important}
        }
      `}</style>
    </section>
  )
}
