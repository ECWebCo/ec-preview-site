import { useState, useEffect } from 'react'
import { trackEvent } from '../../lib/supabase'

const NAVY   = '#1B2B4B'
const CREAM  = '#FAFAF8'
const WARM   = '#F4F1EB'
const GOLD   = '#C9A84C'
const MUTED  = '#7A7468'
const BORDER = '#E4E0D8'

const BELLAIRE = {
  name: 'Bellaire',
  address: '5427 Bissonnet St #400, Bellaire, TX 77401',
  phone: '(713) 677-0921',
  resy: 'https://resy.com/cities/houston-tx/venues/kps-kitchen-bellaire',
  order: 'https://order.toasttab.com/online/kp-kitchen-bellaire?diningOption=takeout',
  hours: [
    { day: 'Monday', closed: true },
    { day: 'Tuesday', time: '4:00 PM – 9:00 PM' },
    { day: 'Wednesday', time: '4:00 PM – 9:00 PM' },
    { day: 'Thursday', time: '4:00 PM – 9:00 PM' },
    { day: 'Friday', time: '4:00 PM – 9:00 PM' },
    { day: 'Saturday', time: '11:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 8:00 PM' },
  ]
}

const MEMORIAL = {
  name: 'Memorial',
  address: '8412 Interstate 10 Frontage Rd #350, Houston, TX 77024',
  phone: '(713) 677-0921',
  resy: 'https://resy.com/cities/houston-tx/venues/kps-kitchen',
  order: 'https://order.toasttab.com/online/kpskitchen-spring-valley?diningOption=takeout',
  hours: [
    { day: 'Monday', closed: true },
    { day: 'Tuesday', time: '11:00 AM – 9:00 PM' },
    { day: 'Wednesday', time: '11:00 AM – 9:00 PM' },
    { day: 'Thursday', time: '11:00 AM – 9:00 PM' },
    { day: 'Friday', time: '11:00 AM – 9:00 PM' },
    { day: 'Saturday', time: '11:00 AM – 9:00 PM' },
    { day: 'Sunday', time: '10:00 AM – 8:00 PM' },
  ]
}

const PRESS = [
  { source: 'Houston Eater', quote: 'One of Houston\'s best hidden gem restaurants.' },
  { source: 'Biz Journals', quote: 'KP\'s Kitchen expands with a second Houston location.' },
  { source: 'Shoutout HTX', quote: 'Heartfelt service meets culinary excellence.' },
]

function KpsNav({ activeLoc, setActiveLoc }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  const navBg = scrolled || menuOpen ? 'rgba(250,250,248,0.97)' : 'transparent'
  const textColor = scrolled || menuOpen ? NAVY : '#fff'
  const borderColor = scrolled ? BORDER : 'transparent'

  return (
    <>
      <nav style={{ position:'fixed',top:0,left:0,right:0,zIndex:200,height:72,display:'flex',alignItems:'center',padding:'0 48px',justifyContent:'space-between',background:navBg,borderBottom:`1px solid ${borderColor}`,transition:'all 0.35s ease' }}>
        <div style={{ fontFamily:'Playfair Display,serif',fontSize:20,fontWeight:700,fontStyle:'italic',color:textColor,transition:'color 0.35s',flexShrink:0 }}>
          KP's Kitchen
        </div>
        <div className="kps-nav-links" style={{ display:'flex',gap:32,alignItems:'center' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Events'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',fontSize:13,color:textColor,cursor:'pointer',fontFamily:'DM Sans',fontWeight:500,opacity:0.85,transition:'opacity 0.2s' }}
              onMouseOver={e=>e.target.style.opacity='1'} onMouseOut={e=>e.target.style.opacity='0.85'}>
              {label}
            </button>
          ))}
        </div>
        <div className="kps-nav-cta" style={{ display:'flex',gap:10,alignItems:'center' }}>
          <div style={{ position:'relative' }}>
            <button onClick={()=>setLocOpen(!locOpen)} style={{ padding:'8px 14px',background:'none',border:`1px solid ${scrolled?BORDER:'rgba(255,255,255,0.4)'}`,color:textColor,fontSize:12,fontFamily:'DM Sans',fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6,transition:'all 0.25s' }}>
              📍 {activeLoc.name}
            </button>
            {locOpen && (
              <div style={{ position:'absolute',top:'calc(100% + 8px)',right:0,background:'#fff',border:`1px solid ${BORDER}`,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',minWidth:160,zIndex:300 }}>
                {[BELLAIRE, MEMORIAL].map(loc=>(
                  <button key={loc.name} onClick={()=>{setActiveLoc(loc);setLocOpen(false)}} style={{ display:'block',width:'100%',padding:'12px 16px',background:activeLoc.name===loc.name?WARM:'#fff',border:'none',textAlign:'left',fontSize:13,fontFamily:'DM Sans',color:NAVY,cursor:'pointer',fontWeight:activeLoc.name===loc.name?600:400 }}>
                    {loc.name}
                    <div style={{ fontSize:11,color:MUTED,marginTop:2 }}>{loc.address.split(',')[0]}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a href={activeLoc.order} target="_blank" rel="noreferrer" style={{ padding:'8px 16px',background:'none',border:`1px solid ${scrolled?BORDER:'rgba(255,255,255,0.4)'}`,color:textColor,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none',transition:'all 0.25s' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor=NAVY}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=textColor;e.currentTarget.style.borderColor=scrolled?BORDER:'rgba(255,255,255,0.4)'}}>
            Order Online
          </a>
          <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'8px 20px',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none',transition:'opacity 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Reserve
          </a>
        </div>
        <button className="kps-ham" onClick={()=>setMenuOpen(!menuOpen)} style={{ display:'none',background:'none',border:'none',flexDirection:'column',gap:5,cursor:'pointer',padding:4 }}>
          {[0,1,2].map(i=><span key={i} style={{ display:'block',width:24,height:2,background:textColor,transition:'0.3s',transform:i===0&&menuOpen?'rotate(45deg) translate(5px,5px)':i===2&&menuOpen?'rotate(-45deg) translate(5px,-5px)':'none',opacity:i===1&&menuOpen?0:1 }}/>)}
        </button>
      </nav>
      {menuOpen && (
        <div style={{ position:'fixed',inset:0,background:CREAM,zIndex:199,paddingTop:72,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Events'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',borderBottom:`1px solid ${BORDER}`,width:'100%',padding:'20px 0',textAlign:'center',fontSize:24,color:NAVY,fontFamily:'Playfair Display,serif',fontStyle:'italic',cursor:'pointer',fontWeight:700 }}>
              {label}
            </button>
          ))}
          <div style={{ display:'flex',gap:12,marginTop:32,padding:'0 24px',flexWrap:'wrap',justifyContent:'center' }}>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'13px 28px',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none',letterSpacing:'0.5px' }}>Reserve a Table</a>
            <a href={activeLoc.order} target="_blank" rel="noreferrer" style={{ padding:'12px 28px',background:'none',border:`1px solid ${NAVY}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none' }}>Order Online</a>
          </div>
        </div>
      )}
      <style>{`@media(max-width:900px){.kps-nav-links{display:none!important}.kps-nav-cta{display:none!important}.kps-ham{display:flex!important}nav{padding:0 24px!important}}`}</style>
    </>
  )
}

function KpsHero({ activeLoc }) {
  return (
    <div style={{ height:'100vh',minHeight:600,position:'relative',overflow:'hidden',background:NAVY }}>
      <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80" alt="KP's Kitchen"
        style={{ position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',opacity:0.5 }}/>
      <div style={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,rgba(27,43,75,0.25) 0%,rgba(27,43,75,0.5) 60%,rgba(27,43,75,0.8) 100%)' }}/>
      <div style={{ position:'relative',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'0 48px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:16,marginBottom:24 }}>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.4)' }}/>
          <span style={{ fontFamily:'DM Sans',fontSize:11,letterSpacing:'3px',textTransform:'uppercase',color:'rgba(255,255,255,0.7)',fontWeight:500 }}>Houston, Texas · Est. 2021</span>
          <div style={{ width:40,height:1,background:'rgba(255,255,255,0.4)' }}/>
        </div>
        <h1 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(52px,8vw,110px)',fontWeight:700,color:'#fff',lineHeight:0.95,margin:'0 0 8px',letterSpacing:'-1px' }}>
          KP's Kitchen
        </h1>
        <p style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(18px,2.5vw,28px)',fontStyle:'italic',fontWeight:400,color:'rgba(255,255,255,0.7)',margin:'0 0 48px' }}>
          & Bar
        </p>
        <div style={{ display:'flex',gap:14,flexWrap:'wrap',justifyContent:'center' }}>
          <a href={activeLoc.resy} target="_blank" rel="noreferrer"
            style={{ padding:'16px 36px',background:'#fff',color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:700,textDecoration:'none',letterSpacing:'1.5px',textTransform:'uppercase',transition:'all 0.25s' }}
            onMouseOver={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=NAVY}}>
            Reserve a Table
          </a>
          <a href={activeLoc.order} target="_blank" rel="noreferrer"
            style={{ padding:'16px 36px',background:'transparent',border:'1px solid rgba(255,255,255,0.6)',color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none',letterSpacing:'1.5px',textTransform:'uppercase',transition:'all 0.25s' }}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            Order Online
          </a>
          <button onClick={()=>document.getElementById('kps-menu')?.scrollIntoView({behavior:'smooth'})}
            style={{ padding:'16px 36px',background:'transparent',border:'1px solid rgba(255,255,255,0.6)',color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:500,letterSpacing:'1.5px',textTransform:'uppercase',cursor:'pointer',transition:'all 0.25s' }}
            onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.15)'}
            onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            View Menu
          </button>
        </div>
        <div style={{ position:'absolute',bottom:36,left:'50%',transform:'translateX(-50%)',color:'rgba(255,255,255,0.5)',fontSize:13,fontFamily:'DM Sans',whiteSpace:'nowrap' }}>
          📍 {activeLoc.name} — {activeLoc.address.split(',')[0]}
        </div>
      </div>
    </div>
  )
}

function KpsCtaStrip({ activeLoc }) {
  const items = [
    { label:'Order Online', sub:'Curbside & Delivery', href:activeLoc.order },
    { label:'Reservations', sub:'Book Your Table', href:activeLoc.resy },
    { label:'Private Events', sub:'Parties & Catering', href:'#kps-private' },
    { label:'Happy Hour', sub:'Mon–Fri · 4–6 PM', href:'#kps-happyhour' },
  ]
  return (
    <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',borderBottom:`1px solid ${BORDER}` }} className="kps-cta-strip">
      {items.map((item,i)=>(
        <a key={i} href={item.href} target={item.href.startsWith('http')?'_blank':'_self'} rel="noreferrer"
          style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'28px 16px',gap:8,textDecoration:'none',background:CREAM,borderRight:i<3?`1px solid ${BORDER}`:'none',transition:'background 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.background=WARM}
          onMouseOut={e=>e.currentTarget.style.background=CREAM}>
          <div style={{ fontFamily:'Playfair Display,serif',fontSize:16,fontWeight:700,fontStyle:'italic',color:NAVY }}>{item.label}</div>
          <div style={{ fontFamily:'DM Sans',fontSize:12,color:MUTED }}>{item.sub}</div>
        </a>
      ))}
    </div>
  )
}

function KpsAbout() {
  return (
    <div style={{ background:WARM,padding:'80px 64px' }} className="kps-about-outer">
      <div style={{ maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }} className="kps-about-grid">
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
            <div style={{ width:36,height:1,background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>Our Story</span>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(32px,4vw,52px)',fontWeight:700,fontStyle:'italic',color:NAVY,lineHeight:1.1,marginBottom:20 }}>
            Neighborhood Hospitality,<br/>Elevated Experience
          </h2>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:MUTED,lineHeight:1.8,marginBottom:16,fontWeight:300 }}>
            KP's Kitchen brings upscale American cuisine to Houston's neighborhoods — without the upscale price tag. From scratch-made comfort food to thoughtfully crafted cocktails, every visit feels like coming home.
          </p>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:MUTED,lineHeight:1.8,fontWeight:300 }}>
            Two Houston locations. One kitchen philosophy: real ingredients, real care, served with genuine hospitality.
          </p>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:4 }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80" alt="KP's Kitchen dining room" style={{ width:'100%',aspectRatio:'1',objectFit:'cover' }}/>
          <img src="https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=600&q=80" alt="Private dining" style={{ width:'100%',aspectRatio:'1',objectFit:'cover',marginTop:24 }}/>
        </div>
      </div>
    </div>
  )
}

function KpsMenu({ sections }) {
  const [activeTab, setActiveTab] = useState(0)
  const hasData = sections && sections.length > 0

  const fallback = [
    { name:'Starters', items:[
      { name:'Spinach & Artichoke Dip', description:'House-made, served with grilled bread', price:'13' },
      { name:'Meatballs', description:'Braised in San Marzano tomato, fresh ricotta', price:'15' },
    ]},
    { name:'Mains', items:[
      { name:"KP's Burger", description:'Prime beef, aged cheddar, house sauce, brioche bun', price:'18' },
      { name:'BBQ Ribs', description:'Slow smoked, house BBQ glaze, coleslaw', price:'32' },
      { name:'Chicken Sandwich', description:'Crispy fried chicken, pickles, comeback sauce', price:'16' },
    ]},
    { name:'Brunch', items:[
      { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
      { name:'Salads', description:'Seasonal, made to order', price:'14' },
    ]},
  ]

  const display = hasData ? sections : fallback
  const active = display[activeTab]
  const items = active?.items || []

  return (
    <section id="kps-menu" style={{ background:CREAM,paddingBottom:100 }}>
      <div style={{ background:WARM,padding:'80px 64px 72px',borderBottom:`1px solid ${BORDER}` }} className="kps-menu-header-outer">
        <div style={{ maxWidth:1100,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'end' }} className="kps-menu-header">
          <div>
            <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
              <div style={{ width:36,height:1,background:GOLD }}/>
              <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>The Menu</span>
            </div>
            <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:700,fontStyle:'italic',color:NAVY,lineHeight:1.0,letterSpacing:'-0.5px' }}>
              Made From<br/>Scratch. Daily.
            </h2>
          </div>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:MUTED,lineHeight:1.8,fontWeight:300,paddingBottom:8 }}>
            Everything on our menu is prepared fresh each day using seasonal ingredients, classic technique, and just enough creativity to keep things interesting.
          </p>
        </div>
      </div>
      <div style={{ borderBottom:`1px solid ${BORDER}`,position:'sticky',top:72,background:CREAM,zIndex:10 }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'flex',overflowX:'auto' }} className="kps-tabs-wrap">
          {display.map((s,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} style={{ padding:'18px 28px',fontSize:11,border:'none',background:'none',fontFamily:'DM Sans',fontWeight:600,letterSpacing:'1.5px',textTransform:'uppercase',whiteSpace:'nowrap',cursor:'pointer',color:activeTab===i?NAVY:MUTED,borderBottom:activeTab===i?`2px solid ${NAVY}`:'2px solid transparent',marginBottom:-1,transition:'all 0.2s' }}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px' }} className="kps-menu-body">
        {items.map((item,i)=>(
          <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr auto',gap:32,padding:'26px 0',borderBottom:`1px solid ${BORDER}`,alignItems:'start',transition:'padding-left 0.25s' }}
            onMouseOver={e=>e.currentTarget.style.paddingLeft='14px'}
            onMouseOut={e=>e.currentTarget.style.paddingLeft='0'}>
            <div>
              <div style={{ fontFamily:'Playfair Display,serif',fontSize:20,fontWeight:700,fontStyle:'italic',color:NAVY,marginBottom:item.description?5:0 }}>{item.name}</div>
              {item.description&&<p style={{ fontFamily:'DM Sans',fontSize:14,color:MUTED,fontWeight:300,lineHeight:1.6,maxWidth:520 }}>{item.description}</p>}
            </div>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:19,color:GOLD,paddingTop:2,flexShrink:0 }}>
              {item.price?`$${Number(item.price).toFixed(0)}`:''}
            </div>
          </div>
        ))}
        {items.length===0&&<p style={{ padding:'48px 0',color:MUTED,fontFamily:'DM Sans',fontStyle:'italic' }}>Menu coming soon.</p>}
      </div>
    </section>
  )
}

function KpsHappyHour({ activeLoc }) {
  return (
    <section id="kps-happyhour" style={{ background:NAVY,padding:'100px 0',position:'relative',overflow:'hidden' }}>
      <div style={{ position:'absolute',top:-120,right:-120,width:600,height:600,borderRadius:'50%',border:'1px solid rgba(255,255,255,0.04)',pointerEvents:'none' }}/>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }} className="kps-hh-grid">
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
            <div style={{ width:36,height:1,background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>Daily Specials</span>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(40px,5vw,68px)',fontWeight:700,fontStyle:'italic',color:'#fff',lineHeight:1.0,marginBottom:24,letterSpacing:'-0.5px' }}>
            Happy Hour
          </h2>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:'rgba(255,255,255,0.55)',lineHeight:1.8,marginBottom:12,fontWeight:300 }}>
            Monday through Friday · 4 to 6 PM
          </p>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:'rgba(255,255,255,0.55)',lineHeight:1.8,marginBottom:40,fontWeight:300 }}>
            Discounted drinks, half-price select appetizers, and the best seat in the neighborhood. Both locations.
          </p>
          <a href={activeLoc.resy} target="_blank" rel="noreferrer"
            style={{ display:'inline-block',padding:'14px 32px',background:'#fff',color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:700,textDecoration:'none',letterSpacing:'1.5px',textTransform:'uppercase',transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=NAVY}}>
            Reserve for Happy Hour
          </a>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:2 }}>
          {[['$6','House Wine'],['$7','Draft Beer'],['$8','Well Cocktails'],['50% Off','Select Apps']].map(([val,label],i)=>(
            <div key={i} style={{ background:'rgba(255,255,255,0.06)',padding:'32px 24px',textAlign:'center',border:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontFamily:'Playfair Display,serif',fontSize:40,fontWeight:700,fontStyle:'italic',color:GOLD,lineHeight:1,marginBottom:8 }}>{val}</div>
              <div style={{ fontFamily:'DM Sans',fontSize:11,color:'rgba(255,255,255,0.45)',letterSpacing:'1.5px',textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function KpsGallery() {
  const photos = [
    { src:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', alt:'Burger' },
    { src:'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', alt:'Ribs' },
    { src:'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&q=80', alt:'Sandwich' },
    { src:'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80', alt:'Food' },
    { src:'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80', alt:'Salad' },
    { src:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80', alt:'Brunch' },
    { src:'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', alt:'Pizza' },
    { src:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80', alt:'Food' },
  ]
  return (
    <section style={{ background:WARM,padding:'100px 0' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px 48px' }} className="kps-gallery-header">
        <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16 }}>
          <div style={{ width:36,height:1,background:GOLD }}/>
          <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>From the Kitchen</span>
        </div>
        <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(36px,5vw,64px)',fontWeight:700,fontStyle:'italic',color:NAVY,lineHeight:1.0,letterSpacing:'-0.5px' }}>
          Food Worth Coming For
        </h2>
      </div>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4 }} className="kps-gallery-grid">
        {photos.map((p,i)=>(
          <div key={i} style={{ overflow:'hidden',background:'#ddd',aspectRatio:'1' }}>
            <img src={p.src} alt={p.alt} style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform 0.6s ease' }}
              onMouseOver={e=>e.target.style.transform='scale(1.06)'}
              onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          </div>
        ))}
      </div>
    </section>
  )
}

function KpsPrivate({ activeLoc }) {
  return (
    <section id="kps-private" style={{ background:CREAM,padding:'100px 0' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px',display:'grid',gridTemplateColumns:'1fr 1fr',gap:80,alignItems:'center' }} className="kps-private-grid">
        <div style={{ position:'relative' }}>
          <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=900&q=80" alt="Private dining"
            style={{ width:'100%',aspectRatio:'4/3',objectFit:'cover' }}/>
          <div style={{ position:'absolute',bottom:-20,right:-20,background:NAVY,padding:'20px 24px',minWidth:160 }}>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:700,fontStyle:'italic',color:'#fff',lineHeight:1 }}>Up to</div>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:52,fontWeight:700,color:GOLD,lineHeight:1 }}>60</div>
            <div style={{ fontFamily:'DM Sans',fontSize:11,color:'rgba(255,255,255,0.5)',letterSpacing:'2px',textTransform:'uppercase',marginTop:4 }}>Guests</div>
          </div>
        </div>
        <div>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:20 }}>
            <div style={{ width:36,height:1,background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>Entertain</span>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(36px,4vw,56px)',fontWeight:700,fontStyle:'italic',color:NAVY,lineHeight:1.1,marginBottom:20 }}>
            Private Events<br/>&amp; Catering
          </h2>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:MUTED,lineHeight:1.8,marginBottom:16,fontWeight:300 }}>
            Host your next corporate dinner, birthday celebration, or private party at KP's Kitchen. Our private dining room accommodates up to 60 guests with customizable menus and full bar service.
          </p>
          <p style={{ fontFamily:'DM Sans',fontSize:15,color:MUTED,lineHeight:1.8,marginBottom:36,fontWeight:300 }}>
            We also offer full-service catering for off-site events throughout the Houston area.
          </p>
          <div style={{ display:'flex',gap:12,flexWrap:'wrap' }}>
            <a href="mailto:events@kps-kitchen.com"
              style={{ padding:'14px 28px',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none',letterSpacing:'1px',textTransform:'uppercase',transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              Inquire About Events
            </a>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer"
              style={{ padding:'13px 28px',background:'none',border:`1px solid ${NAVY}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none',letterSpacing:'1px',textTransform:'uppercase',transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              Make a Reservation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function KpsPress() {
  return (
    <div style={{ background:NAVY,padding:'56px 64px',display:'flex',gap:0,overflowX:'auto' }} className="kps-press-strip">
      {PRESS.map((p,i)=>(
        <div key={i} style={{ flex:'1 0 280px',padding:'0 40px',borderRight:i<PRESS.length-1?'1px solid rgba(255,255,255,0.1)':'none' }}>
          <div style={{ fontFamily:'Playfair Display,serif',fontSize:16,fontStyle:'italic',color:'rgba(255,255,255,0.75)',lineHeight:1.7,marginBottom:14 }}>"{p.quote}"</div>
          <div style={{ fontFamily:'DM Sans',fontSize:11,color:GOLD,letterSpacing:'2px',textTransform:'uppercase',fontWeight:600 }}>{p.source}</div>
        </div>
      ))}
    </div>
  )
}

function KpsLocations() {
  const today = new Date().getDay()
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  return (
    <section id="kps-locations" style={{ background:WARM,padding:'100px 0' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 64px' }} className="kps-loc-wrap">
        <div style={{ textAlign:'center',marginBottom:64 }}>
          <div style={{ display:'flex',alignItems:'center',gap:14,marginBottom:16,justifyContent:'center' }}>
            <div style={{ width:36,height:1,background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',color:GOLD }}>Two Locations</span>
            <div style={{ width:36,height:1,background:GOLD }}/>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif',fontSize:'clamp(36px,5vw,64px)',fontWeight:700,fontStyle:'italic',color:NAVY,lineHeight:1.0,letterSpacing:'-0.5px' }}>
            Find Us in Houston
          </h2>
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:24 }} className="kps-loc-grid">
          {[BELLAIRE, MEMORIAL].map((loc,i)=>(
            <div key={i} style={{ background:'#fff',border:`1px solid ${BORDER}`,overflow:'hidden' }}>
              <a href={`https://maps.google.com?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer"
                style={{ display:'block',height:220,position:'relative',overflow:'hidden',textDecoration:'none' }}>
                <iframe title={`map-${loc.name}`} width="100%" height="100%"
                  style={{ border:0,display:'block',filter:'grayscale(20%)',pointerEvents:'none' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}/>
                <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'12px 16px',background:'linear-gradient(to top,rgba(27,43,75,0.85),transparent)',display:'flex',justifyContent:'space-between',alignItems:'flex-end' }}>
                  <span style={{ fontSize:12,color:'#fff',fontFamily:'DM Sans' }}>{loc.address.split(',')[0]}</span>
                  <span style={{ fontSize:11,color:GOLD,fontFamily:'DM Sans',fontWeight:600,whiteSpace:'nowrap' }}>Get Directions →</span>
                </div>
              </a>
              <div style={{ padding:'28px 28px 24px' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif',fontSize:22,fontWeight:700,fontStyle:'italic',color:NAVY,marginBottom:6 }}>
                  KP's Kitchen — {loc.name}
                </h3>
                <p style={{ fontFamily:'DM Sans',fontSize:13,color:MUTED,marginBottom:4 }}>{loc.address}</p>
                <a href={`tel:${loc.phone}`} style={{ fontFamily:'DM Sans',fontSize:13,color:MUTED,textDecoration:'none',display:'block',marginBottom:20,transition:'color 0.2s' }}
                  onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>
                  {loc.phone}
                </a>
                <div style={{ borderTop:`1px solid ${BORDER}`,paddingTop:16,marginBottom:20,paddingLeft:14 }}>
                  <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:MUTED,marginBottom:10 }}>Hours</p>
                  {loc.hours.map((h,di)=>{
                    const isToday = dayNames[today] === h.day
                    return (
                      <div key={di} style={{ display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:`1px solid ${BORDER}`,position:'relative' }}>
                        {isToday&&<div style={{ position:'absolute',left:-14,top:0,bottom:0,width:2,background:NAVY }}/>}
                        <span style={{ fontFamily:'DM Sans',fontSize:12,color:isToday?NAVY:MUTED,fontWeight:isToday?700:400 }}>{h.day}</span>
                        <span style={{ fontFamily:'Playfair Display,serif',fontSize:13,fontStyle:'italic',color:isToday?NAVY:(h.closed?'#C8C4BE':MUTED) }}>
                          {h.closed?'Closed':h.time}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <div style={{ display:'flex',gap:8 }}>
                  <a href={loc.resy} target="_blank" rel="noreferrer"
                    style={{ flex:1,padding:'11px 0',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none',textAlign:'center',transition:'opacity 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    Reserve
                  </a>
                  <a href={loc.order} target="_blank" rel="noreferrer"
                    style={{ flex:1,padding:'11px 0',background:'none',border:`1px solid ${NAVY}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none',textAlign:'center',transition:'all 0.2s' }}
                    onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                    onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
                    Order Online
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function KpsFooter() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
  return (
    <footer style={{ background:NAVY,padding:'64px 64px 40px' }} className="kps-footer-outer">
      <div style={{ maxWidth:1100,margin:'0 auto' }}>
        <div style={{ display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:64,marginBottom:48,paddingBottom:48,borderBottom:'1px solid rgba(255,255,255,0.08)' }} className="kps-footer-grid">
          <div>
            <div style={{ fontFamily:'Playfair Display,serif',fontSize:26,fontWeight:700,fontStyle:'italic',color:'#fff',marginBottom:12 }}>KP's Kitchen & Bar</div>
            <p style={{ fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.35)',lineHeight:1.7,maxWidth:280,fontWeight:300 }}>
              Upscale American cuisine with neighborhood hospitality. Two locations in Houston, TX.
            </p>
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:GOLD,marginBottom:16 }}>Navigate</p>
            {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Events'],['kps-locations','Locations']].map(([id,label])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ display:'block',background:'none',border:'none',fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.4)',cursor:'pointer',padding:'5px 0',textAlign:'left',transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                {label}
              </button>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans',fontSize:10,fontWeight:700,letterSpacing:'2.5px',textTransform:'uppercase',color:GOLD,marginBottom:16 }}>Reserve</p>
            <a href={BELLAIRE.resy} target="_blank" rel="noreferrer" style={{ display:'block',fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.4)',textDecoration:'none',padding:'5px 0',transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Bellaire</a>
            <a href={MEMORIAL.resy} target="_blank" rel="noreferrer" style={{ display:'block',fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.4)',textDecoration:'none',padding:'5px 0',transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Memorial</a>
            <a href="mailto:events@kps-kitchen.com" style={{ display:'block',fontFamily:'DM Sans',fontSize:13,color:'rgba(255,255,255,0.4)',textDecoration:'none',padding:'5px 0',marginTop:16,transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Private Events</a>
          </div>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans' }}>© {new Date().getFullYear()} KP's Kitchen & Bar. All rights reserved.</div>
          <div style={{ fontSize:12,color:'rgba(255,255,255,0.2)',fontFamily:'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:GOLD,textDecoration:'none' }}>EC Web Co</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function KpsStickyBar({ activeLoc }) {
  return (
    <>
      <div className="kps-sticky" style={{ position:'fixed',bottom:0,left:0,right:0,zIndex:200,display:'none',background:'#fff',borderTop:`1px solid ${BORDER}`,paddingBottom:'env(safe-area-inset-bottom)' }}>
        <a href={activeLoc.resy} target="_blank" rel="noreferrer"
          style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'12px 8px',background:NAVY,color:'#fff',textDecoration:'none',fontFamily:'DM Sans',fontSize:11,fontWeight:600,letterSpacing:'0.5px',textTransform:'uppercase',borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </a>
        <a href={activeLoc.order} target="_blank" rel="noreferrer"
          style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'12px 8px',background:'#fff',color:NAVY,textDecoration:'none',fontFamily:'DM Sans',fontSize:11,fontWeight:500,letterSpacing:'0.5px',textTransform:'uppercase',borderRight:`1px solid ${BORDER}` }}>
          Order
        </a>
        <a href={`tel:${activeLoc.phone}`}
          style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,padding:'12px 8px',background:'#fff',color:NAVY,textDecoration:'none',fontFamily:'DM Sans',fontSize:11,fontWeight:500,letterSpacing:'0.5px',textTransform:'uppercase' }}>
          Call
        </a>
      </div>
      <div className="kps-sticky-spacer" style={{ display:'none',height:68 }}/>
      <style>{`@media(max-width:768px){.kps-sticky{display:flex!important}.kps-sticky-spacer{display:block!important}}`}</style>
    </>
  )
}

export default function KpsLayout({ data }) {
  const [activeLoc, setActiveLoc] = useState(MEMORIAL)
  const { sections } = data

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif',background:CREAM,color:NAVY,overflowX:'hidden' }}>
      <KpsNav activeLoc={activeLoc} setActiveLoc={setActiveLoc} />
      <KpsHero activeLoc={activeLoc} />
      <KpsCtaStrip activeLoc={activeLoc} />
      <KpsAbout />
      <KpsMenu sections={sections} />
      <KpsHappyHour activeLoc={activeLoc} />
      <KpsGallery />
      <KpsPrivate activeLoc={activeLoc} />
      <KpsPress />
      <KpsLocations />
      <KpsFooter />
      <KpsStickyBar activeLoc={activeLoc} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        img{display:block;max-width:100%}
        @media(max-width:900px){
          .kps-cta-strip{grid-template-columns:1fr 1fr!important}
          .kps-about-outer{padding:56px 24px!important}
          .kps-about-grid{grid-template-columns:1fr!important;gap:40px!important}
          .kps-menu-header-outer{padding:56px 24px 48px!important}
          .kps-menu-header{grid-template-columns:1fr!important;gap:24px!important}
          .kps-tabs-wrap{padding:0 24px!important}
          .kps-menu-body{padding:0 24px!important}
          .kps-hh-grid{grid-template-columns:1fr!important;padding:0 24px!important;gap:48px!important}
          .kps-gallery-header{padding:0 24px 40px!important}
          .kps-gallery-grid{grid-template-columns:repeat(2,1fr)!important;padding:0 24px!important}
          .kps-private-grid{grid-template-columns:1fr!important;padding:0 24px!important;gap:48px!important}
          .kps-press-strip{padding:48px 24px!important;flex-direction:column!important}
          .kps-loc-wrap{padding:0 24px!important}
          .kps-loc-grid{grid-template-columns:1fr!important}
          .kps-footer-outer{padding:48px 24px 32px!important}
          .kps-footer-grid{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </div>
  )
}
