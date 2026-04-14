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

export default function ContactSection({ restaurant, links, photos }) {
  const headRef=useRef(null); useReveal(headRef)
  const leftRef=useRef(null); useReveal(leftRef,0.12)
  const rightRef=useRef(null); useReveal(rightRef,0.24)
  const contactPhoto = photos?.[4]?.url||photos?.[2]?.url||photos?.[0]?.url

  return (
    <section id="contact-section" style={{ background:'var(--green)',paddingTop:0 }}>

      {/* Full-width grid */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1.1fr 0.9fr',minHeight:640 }} className="contact-grid">

        {/* Photo left */}
        <div className="photo-hover" style={{ overflow:'hidden',background:'#1a3008',position:'relative' }}>
          {contactPhoto
            ? <img src={contactPhoto} alt="restaurant" style={{ width:'100%',height:'100%',objectFit:'cover',minHeight:640,filter:'brightness(0.85)' }}/>
            : <div style={{ width:'100%',height:'100%',minHeight:640,background:'#1a3008' }}/>
          }
          <div style={{ position:'absolute',inset:0,background:'rgba(45,80,22,0.3)' }}/>
        </div>

        {/* Contact info */}
        <div ref={leftRef} className="reveal-left" style={{ padding:'80px 56px',display:'flex',flexDirection:'column',justifyContent:'center',borderRight:'1px solid rgba(255,255,255,0.12)',borderLeft:'1px solid rgba(255,255,255,0.12)' }}>
          <div className="eyebrow" style={{ color:'var(--gold-lt)' }}>
            <span style={{ display:'inline-block',width:48,height:1,background:'var(--gold-lt)',animation:'lineGrow 0.8s ease forwards' }}/>
            Contact Us
          </div>
          <h2 style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(44px,5vw,72px)',fontWeight:300,fontStyle:'italic',color:'#fff',lineHeight:0.95,margin:'0 0 24px',letterSpacing:'-0.3px' }}>
            We'd Love to<br />See You.
          </h2>
          <p style={{ fontSize:15,color:'rgba(255,255,255,0.5)',lineHeight:1.85,fontFamily:'DM Sans',fontWeight:300,marginBottom:48,maxWidth:360 }}>
            Whether it's a reservation, a question, or a simple craving — we're always happy to hear from you.
          </p>

          {[
            restaurant.email&&{href:`mailto:${restaurant.email}`,icon:'✉',label:'Email',value:restaurant.email},
            links?.phone&&{href:`tel:${links.phone}`,icon:'☎',label:'Phone',value:links.phone,onClick:()=>trackEvent(restaurant.id,'phone_click')},
            links?.reservation_url&&{href:links.reservation_url,icon:'📅',label:'Reservations',value:'Book a table →',onClick:()=>trackEvent(restaurant.id,'reserve_click'),ext:true},
          ].filter(Boolean).map(({href,icon,label,value,onClick,ext})=>(
            <a key={label} href={href} target={ext?'_blank':undefined} rel={ext?'noreferrer':undefined} onClick={onClick}
              style={{ display:'flex',alignItems:'center',gap:18,padding:'20px 0',borderBottom:'1px solid rgba(255,255,255,0.1)',textDecoration:'none',transition:'padding-left 0.35s ease' }}
              onMouseOver={e=>{e.currentTarget.style.paddingLeft='8px';e.currentTarget.querySelector('.cv').style.color='var(--gold-lt)'}}
              onMouseOut={e=>{e.currentTarget.style.paddingLeft='0';e.currentTarget.querySelector('.cv').style.color='#fff'}}>
              <div style={{ width:48,height:48,background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18,transition:'all 0.25s' }}>{icon}</div>
              <div>
                <div style={{ fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:'rgba(255,255,255,0.3)',marginBottom:4,fontFamily:'DM Sans',fontWeight:600 }}>{label}</div>
                <div className="cv" style={{ fontFamily:'Cormorant Garamond,serif',fontSize:17,fontStyle:'italic',color:'#fff',transition:'color 0.25s' }}>{value}</div>
              </div>
            </a>
          ))}

          <div style={{ display:'flex',gap:14,flexWrap:'wrap',marginTop:40 }}>
            {links?.reservation_url&&<a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} style={{ padding:'14px 32px',background:'#fff',color:'var(--green)',fontFamily:'DM Sans',fontSize:12,fontWeight:700,letterSpacing:'2px',textTransform:'uppercase',display:'inline-block',textDecoration:'none',transition:'all 0.25s' }} onMouseOver={e=>e.currentTarget.style.background='var(--gold-lt)'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>Reserve a Table</a>}
            {links?.order_url&&<a href={links.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-outline-white">Order Online</a>}
          </div>
        </div>

        {/* Brand card */}
        <div ref={rightRef} className="reveal-right" style={{ padding:'80px 48px',display:'flex',flexDirection:'column',justifyContent:'center',background:'rgba(0,0,0,0.15)' }}>
          <div style={{ width:48,height:1,background:'var(--gold-lt)',marginBottom:36 }}/>
          <span style={{ fontFamily:'Cormorant Garamond,serif',fontSize:'clamp(32px,3.5vw,52px)',fontWeight:300,fontStyle:'italic',color:'#fff',lineHeight:1.0,marginBottom:12,display:'block',letterSpacing:'-0.3px' }}>
            {restaurant.name}
          </span>
          {restaurant.city&&<span style={{ fontSize:11,color:'rgba(255,255,255,0.3)',letterSpacing:3,textTransform:'uppercase',fontFamily:'DM Sans',marginBottom:32,display:'block' }}>{restaurant.city}</span>}
          <div style={{ width:48,height:1,background:'rgba(255,255,255,0.15)',marginBottom:32 }}/>
          {restaurant.tagline&&<p style={{ fontSize:16,color:'rgba(255,255,255,0.45)',lineHeight:1.8,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',marginBottom:32 }}>"{restaurant.tagline}"</p>}
          {restaurant.est&&<span style={{ fontSize:10,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans',letterSpacing:2,textTransform:'uppercase' }}>Est. {restaurant.est}</span>}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          .contact-grid{grid-template-columns:1fr!important}
          .contact-grid>div:first-child{min-height:280px!important}
          .contact-grid>div:nth-child(2){padding:56px 28px!important;border-left:none!important;border-right:none!important}
          .contact-grid>div:nth-child(3){padding:48px 28px!important}
        }
      `}</style>
    </section>
  )
}
