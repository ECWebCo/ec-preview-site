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
  const headRef=useRef(null);useReveal(headRef)
  const leftRef=useRef(null);useReveal(leftRef,0.1)
  const rightRef=useRef(null);useReveal(rightRef,0.2)

  const contactPhoto = photos?.[3]?.url || photos?.[1]?.url || photos?.[0]?.url

  return (
    <section id="contact-section" style={{ background:'#fff', paddingTop:80 }}>
      

      {/* Header */}
      <div style={{ padding:'72px 64px 64px',maxWidth:1100,margin:'0 auto' }}>
        <div ref={headRef} className="reveal" style={{ textAlign:'center' }}>
          <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#C9A84C',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'center',gap:16 }}>
            <span style={{ display:'inline-block',width:40,height:1,background:'#C9A84C' }}/>Contact Us<span style={{ display:'inline-block',width:40,height:1,background:'#C9A84C' }}/>
          </p>
          <h2 className="syne" style={{ fontSize:'clamp(44px,6vw,82px)',fontWeight:800,color:'#141412',lineHeight:0.9,margin:0,letterSpacing:'-2.5px' }}>
            LET'S<br />TALK.
          </h2>
        </div>
      </div>

      {/* Full-width grid: photo | info | brand card */}
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1.1fr 0.9fr',borderTop:'none',minHeight:560 }} className="contact-grid">

        {/* Photo column */}
        <div className="photo-card" style={{ overflow:'hidden',background:'#e0dbd0',borderRight:'1px solid #E4E0D8' }}>
          {contactPhoto
            ? <img src={contactPhoto} alt="restaurant" style={{ width:'100%',height:'100%',objectFit:'cover',minHeight:560 }}/>
            : <div style={{ width:'100%',height:'100%',minHeight:560,background:'linear-gradient(135deg,#ede9e0,#d8d3c8)' }}/>
          }
        </div>

        {/* Contact info column */}
        <div ref={leftRef} className="reveal-left" style={{ padding:'64px 52px',borderRight:'1px solid #E4E0D8',display:'flex',flexDirection:'column',justifyContent:'center' }}>
          <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'4px',textTransform:'uppercase',color:'#888480',marginBottom:32 }}>Reach Out</p>

          {[
            restaurant.email&&{href:`mailto:${restaurant.email}`,icon:'✉',label:'Email',value:restaurant.email},
            links?.phone&&{href:`tel:${links.phone}`,icon:'☎',label:'Phone',value:links.phone,onClick:()=>trackEvent(restaurant.id,'phone_click')},
            links?.reservation_url&&{href:links.reservation_url,icon:'📅',label:'Reserve',value:'Book a table online →',onClick:()=>trackEvent(restaurant.id,'reserve_click'),ext:true},
          ].filter(Boolean).map(({href,icon,label,value,onClick,ext})=>(
            <a key={label} href={href} target={ext?'_blank':undefined} rel={ext?'noreferrer':undefined} onClick={onClick}
              style={{ display:'flex',alignItems:'center',gap:18,padding:'20px 0',borderBottom:'1px solid #DEDAD2',textDecoration:'none',transition:'padding-left 0.3s ease' }}
              onMouseOver={e=>{e.currentTarget.style.paddingLeft='8px';e.currentTarget.querySelector('.cv').style.color='#C9A84C'}}
              onMouseOut={e=>{e.currentTarget.style.paddingLeft='0';e.currentTarget.querySelector('.cv').style.color='#141412'}}>
              <div style={{ width:48,height:48,background:'#f8f5f0',border:'2px solid #141412',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18 }}>{icon}</div>
              <div>
                <div style={{ fontSize:9,letterSpacing:'2.5px',textTransform:'uppercase',color:'#bbb',marginBottom:3,fontFamily:'DM Sans',fontWeight:700 }}>{label}</div>
                <div className="cv syne" style={{ fontSize:14,color:'#141412',fontWeight:700,letterSpacing:'-0.2px',transition:'color 0.25s' }}>{value}</div>
              </div>
            </a>
          ))}

          <div style={{ display:'flex',gap:12,flexWrap:'wrap',marginTop:36 }}>
            {links?.reservation_url&&<a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'reserve_click')} className="btn-gold">Reserve a Table</a>}
            {links?.order_url&&<a href={links.order_url} target="_blank" rel="noreferrer" onClick={()=>trackEvent(restaurant.id,'order_click')} className="btn-ink">Order Online</a>}
          </div>
        </div>

        {/* Brand card column */}
        <div ref={rightRef} className="reveal-right" style={{ padding:'64px 48px',display:'flex',flexDirection:'column',justifyContent:'center',background:'#141412' }}>
          <div style={{ width:40,height:4,background:'#C9A84C',marginBottom:36 }}/>
          <span className="syne" style={{ fontSize:'clamp(28px,3.5vw,46px)',fontWeight:800,color:'#fff',letterSpacing:'-1.5px',lineHeight:0.9,marginBottom:16,display:'block' }}>
            {restaurant.name.toUpperCase()}
          </span>
          {restaurant.city&&<span style={{ fontSize:11,color:'rgba(255,255,255,0.35)',letterSpacing:3,textTransform:'uppercase',fontFamily:'DM Sans',fontWeight:700,marginBottom:32,display:'block' }}>{restaurant.city}</span>}
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.15)',marginBottom:32 }}/>
          {restaurant.tagline&&<p style={{ fontSize:15,color:'rgba(255,255,255,0.45)',lineHeight:1.8,fontFamily:'DM Sans',fontWeight:300,marginBottom:32 }}>"{restaurant.tagline}"</p>}
          {restaurant.est&&<span style={{ fontSize:10,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans',letterSpacing:2,textTransform:'uppercase' }}>Est. {restaurant.est}</span>}
        </div>
      </div>

      <style>{`
        @media(max-width:900px){
          #contact-section>div:nth-child(2){padding:56px 24px 48px!important}
          .contact-grid{grid-template-columns:1fr!important}
          .contact-grid>div:first-child{min-height:280px!important;border-right:none!important;border-bottom:1px solid #E4E0D8}
          .contact-grid>div:nth-child(2){padding:48px 24px!important;border-right:none!important;border-bottom:1px solid #E4E0D8}
          .contact-grid>div:nth-child(3){padding:48px 24px!important}
        }
      `}</style>
    </section>
  )
}
