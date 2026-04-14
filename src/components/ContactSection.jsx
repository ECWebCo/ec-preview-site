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

export default function ContactSection({ restaurant, links }) {
  const leftRef=useRef(null); useReveal(leftRef,0.08)
  const rightRef=useRef(null); useReveal(rightRef,0.2)

  return (
    <section id="contact-section">
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',minHeight:480 }} className="contact-grid">

        {/* LEFT — cream, contact info */}
        <div ref={leftRef} className="reveal-left" style={{ background:'var(--warm)',padding:'80px 72px',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div className="eyebrow"><span className="eyebrow-line"/>Contact Us</div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(36px,4.5vw,60px)',fontWeight:300,fontStyle:'italic',color:'#1C1A17',lineHeight:1.0,margin:'0 0 20px',letterSpacing:'-0.3px' }}>
            We'd Love to<br />See You.
          </h2>
          <p style={{ fontSize:14,color:'var(--muted)',lineHeight:1.85,fontFamily:'DM Sans',fontWeight:300,marginBottom:40,maxWidth:380 }}>
            Whether it's a reservation, a question, or a simple craving — we're always happy to hear from you.
          </p>

          {[
            restaurant.email&&{href:`mailto:${restaurant.email}`,label:'Email',value:restaurant.email},
            links?.phone&&{href:`tel:${links.phone}`,label:'Phone',value:links.phone,onClick:()=>trackEvent(restaurant.id,'phone_click')},
            links?.reservation_url&&{href:links.reservation_url,label:'Reservations',value:'Book a table →',onClick:()=>trackEvent(restaurant.id,'reserve_click'),ext:true},
          ].filter(Boolean).map(({href,label,value,onClick,ext})=>(
            <a key={label} href={href} target={ext?'_blank':undefined} rel={ext?'noreferrer':undefined} onClick={onClick}
              style={{ display:'flex',flexDirection:'column',padding:'16px 0',borderBottom:'1px solid var(--border)',textDecoration:'none',transition:'padding-left 0.3s ease' }}
              onMouseOver={e=>{e.currentTarget.style.paddingLeft='8px'}}
              onMouseOut={e=>{e.currentTarget.style.paddingLeft='0'}}>
              <span style={{ fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:'#C8C4BE',marginBottom:4,fontFamily:'DM Sans',fontWeight:600 }}>{label}</span>
              <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:18,fontStyle:'italic',color:'#1C1A17' }}>{value}</span>
            </a>
          ))}

          <div style={{ display:'flex',gap:14,flexWrap:'wrap',marginTop:36 }}>
            {links?.reservation_url&&<a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-green">Reserve a Table</a>}
            {links?.order_url&&<a href={links.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-outline">Order Online</a>}
          </div>
        </div>

        {/* RIGHT — dark green, brand info */}
        <div ref={rightRef} className="reveal-right" style={{ background:'var(--green)',padding:'80px 72px',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.25)',marginBottom:40 }}/>
          <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,4vw,52px)',fontWeight:300,fontStyle:'italic',color:'#fff',lineHeight:1.0,marginBottom:12,display:'block',letterSpacing:'-0.3px' }}>
            {restaurant.name}
          </span>
          {restaurant.city&&<span style={{ fontSize:11,color:'rgba(255,255,255,0.35)',letterSpacing:3,textTransform:'uppercase',fontFamily:'DM Sans',marginBottom:32,display:'block' }}>
            {restaurant.city}
          </span>}
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.15)',marginBottom:32 }}/>
          {restaurant.tagline&&<p style={{ fontSize:18,color:'rgba(255,255,255,0.5)',lineHeight:1.8,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',marginBottom:32 }}>
            "{restaurant.tagline}"
          </p>}
          {restaurant.est&&<span style={{ fontSize:10,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans',letterSpacing:2,textTransform:'uppercase' }}>
            Est. {restaurant.est}
          </span>}
        </div>

      </div>

      <style>{`
        @media(max-width:900px){
          .contact-grid{grid-template-columns:1fr!important}
          .contact-grid>div{padding:56px 28px!important}
        }
      `}</style>
    </section>
  )
}
