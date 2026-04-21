import { useState, useEffect, useRef } from 'react'
import { trackEvent } from '../../lib/supabase'

// ─── Colors ──────────────────────────────────────────────────
const NAVY   = '#1B2B4B'
const CREAM  = '#FAFAF8'
const WARM   = '#F4F1EB'
const STONE  = '#E8E4DC'
const GOLD   = '#C9A84C'
const MUTED  = '#8A8278'
const BORDER = '#E4E0D8'
const RUST   = '#C4622D'  // warmer accent for happy hour

// ─── Logo URLs — replace with your Supabase URLs ─────────────
const LOGO_WHITE = 'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2007_06_02%20PM.png'
const LOGO_BLUE  = 'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2007_05_51%20PM.png'

// ─── Location Data ────────────────────────────────────────────
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

// Hero slideshow photos — replace with real KP's photos once available
const HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1920&q=80',
  'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80',
]

// ─── Nav ──────────────────────────────────────────────────────
function KpsNav({ activeLoc, setActiveLoc }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locOpen, setLocOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 80, display: 'flex', alignItems: 'center',
        padding: '0 48px', justifyContent: 'space-between',
        background: scrolled ? 'rgba(250,250,248,0.97)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
        transition: 'all 0.4s ease',
        backdropFilter: scrolled ? 'blur(12px)' : 'none'
      }}>

        {/* Logo — hidden until scroll, then shows blue logo */}
        <div style={{ opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s', flexShrink: 0, width: 80 }}>
          <img src={LOGO_BLUE} alt="KP's Kitchen" style={{ height: 52, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}/>
          <span style={{ display:'none', fontFamily:'Playfair Display,serif', fontSize:16, fontWeight:700, fontStyle:'italic', color:NAVY }}>KP's</span>
        </div>

        {/* Desktop nav links — only visible when scrolled */}
        <div className="kps-nav-links" style={{ display:'flex', gap:32, alignItems:'center', opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',fontSize:13,color:NAVY,cursor:'pointer',fontFamily:'DM Sans',fontWeight:500,opacity:0.8,transition:'opacity 0.2s' }}
              onMouseOver={e=>e.target.style.opacity='1'} onMouseOut={e=>e.target.style.opacity='0.8'}>
              {label}
            </button>
          ))}
        </div>

        {/* CTAs — only visible when scrolled */}
        <div className="kps-nav-cta" style={{ display:'flex', gap:10, alignItems:'center', opacity: scrolled ? 1 : 0, transition: 'opacity 0.4s' }}>
          <div style={{ position:'relative' }}>
            <button onClick={()=>setLocOpen(!locOpen)} style={{ padding:'7px 14px',background:'none',border:`1px solid ${BORDER}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,cursor:'pointer',display:'flex',alignItems:'center',gap:6 }}>
              📍 {activeLoc.name}
            </button>
            {locOpen && (
              <div style={{ position:'absolute',top:'calc(100% + 8px)',right:0,background:'#fff',border:`1px solid ${BORDER}`,boxShadow:'0 8px 32px rgba(0,0,0,0.1)',minWidth:180,zIndex:300 }}>
                {[BELLAIRE, MEMORIAL].map(loc=>(
                  <button key={loc.name} onClick={()=>{setActiveLoc(loc);setLocOpen(false)}} style={{ display:'block',width:'100%',padding:'12px 16px',background:activeLoc.name===loc.name?WARM:'#fff',border:'none',textAlign:'left',fontSize:13,fontFamily:'DM Sans',color:NAVY,cursor:'pointer',fontWeight:activeLoc.name===loc.name?600:400 }}>
                    {loc.name}
                    <div style={{ fontSize:11,color:MUTED,marginTop:2 }}>{loc.address.split(',')[0]}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a href={activeLoc.order} target="_blank" rel="noreferrer" style={{ padding:'7px 16px',background:'none',border:`1px solid ${BORDER}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none',transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor=NAVY}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY;e.currentTarget.style.borderColor=BORDER}}>
            Order
          </a>
          <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'7px 20px',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none',transition:'opacity 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Reserve
          </a>
        </div>

        {/* Hamburger */}
        <button className="kps-ham" onClick={()=>setMenuOpen(!menuOpen)} style={{ display:'none',background:'none',border:'none',flexDirection:'column',gap:5,cursor:'pointer',padding:4 }}>
          {[0,1,2].map(i=><span key={i} style={{ display:'block',width:24,height:2,background: scrolled ? NAVY : '#fff',transition:'0.3s',transform:i===0&&menuOpen?'rotate(45deg) translate(5px,5px)':i===2&&menuOpen?'rotate(-45deg) translate(5px,-5px)':'none',opacity:i===1&&menuOpen?0:1 }}/>)}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position:'fixed',inset:0,background:CREAM,zIndex:199,paddingTop:80,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none',border:'none',borderBottom:`1px solid ${BORDER}`,width:'100%',padding:'20px 0',textAlign:'center',fontSize:24,color:NAVY,fontFamily:'Playfair Display,serif',fontStyle:'italic',cursor:'pointer',fontWeight:700 }}>
              {label}
            </button>
          ))}
          <div style={{ display:'flex',gap:12,marginTop:32,padding:'0 24px',flexWrap:'wrap',justifyContent:'center' }}>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'13px 28px',background:NAVY,color:'#fff',fontSize:12,fontFamily:'DM Sans',fontWeight:600,textDecoration:'none' }}>Reserve a Table</a>
            <a href={activeLoc.order} target="_blank" rel="noreferrer" style={{ padding:'12px 28px',background:'none',border:`1px solid ${NAVY}`,color:NAVY,fontSize:12,fontFamily:'DM Sans',fontWeight:500,textDecoration:'none' }}>Order Online</a>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .kps-nav-links{display:none!important}
          .kps-nav-cta{display:none!important}
          .kps-ham{display:flex!important}
          nav{padding:0 24px!important}
        }
      `}</style>
    </>
  )
}

// ─── Hero Slideshow ───────────────────────────────────────────
function KpsHero({ activeLoc }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % HERO_PHOTOS.length)
        setFading(false)
        setPrev(null)
      }, 1000)
    }, 5000)
    return () => clearInterval(timer)
  }, [current])

  return (
    <div style={{ height:'100vh', minHeight:600, position:'relative', overflow:'hidden', background:'#1a1a1a' }}>

      {/* Slideshow images */}
      {HERO_PHOTOS.map((src, i) => (
        <img key={i} src={src} alt="" style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center',
          opacity: i === current ? (fading ? 0 : 0.65) : (i === prev && fading ? 0.65 : 0),
          transition: 'opacity 1s ease',
          filter: 'brightness(0.85)',
        }}/>
      ))}

      {/* Very subtle warm overlay — no heavy navy tint */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.45) 100%)' }}/>

      {/* Centered logo */}
      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <img src={LOGO_WHITE} alt="KP's Kitchen Food & Wine"
          style={{ width: 'clamp(180px, 25vw, 320px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 4px 24px rgba(0,0,0,0.3))' }}
          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block' }}/>
        {/* Fallback text if logo fails */}
        <div style={{ display:'none', textAlign:'center' }}>
          <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(52px,8vw,100px)', fontWeight:700, color:'#fff', lineHeight:0.95, letterSpacing:'-1px' }}>KP's Kitchen</h1>
          <p style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(18px,2.5vw,28px)', fontStyle:'italic', color:'rgba(255,255,255,0.8)', marginTop:8 }}>Food & Wine</p>
        </div>

        {/* Slideshow dots */}
        <div style={{ position:'absolute', bottom:32, display:'flex', gap:8 }}>
          {HERO_PHOTOS.map((_, i) => (
            <button key={i} onClick={()=>setCurrent(i)} style={{ width: i===current?24:8, height:8, borderRadius:4, background: i===current?'#fff':'rgba(255,255,255,0.4)', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }}/>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Intro Strip ──────────────────────────────────────────────
function KpsIntro({ activeLoc }) {
  const items = [
    { label:'Reservations', sub:'Book a table', href:activeLoc.resy, external:true },
    { label:'Order Online', sub:'Curbside & delivery', href:activeLoc.order, external:true },
    { label:'Private Dining', sub:'Events & catering', href:'#kps-private', external:false },
    { label:'Happy Hour', sub:'Mon–Fri · 4–6 PM', href:'#kps-happyhour', external:false },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', background:CREAM, borderBottom:`1px solid ${BORDER}` }} className="kps-intro-strip">
      {items.map((item,i)=>(
        <a key={i} href={item.href} target={item.external?'_blank':'_self'} rel="noreferrer"
          style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', gap:6, textDecoration:'none', background:CREAM, borderRight:i<3?`1px solid ${BORDER}`:'none', transition:'background 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.background=WARM}
          onMouseOut={e=>e.currentTarget.style.background=CREAM}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontWeight:700, fontStyle:'italic', color:NAVY }}>{item.label}</div>
          <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED }}>{item.sub}</div>
        </a>
      ))}
    </div>
  )
}

// ─── Menu Modal ───────────────────────────────────────────────
function MenuModal({ sections, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const hasData = sections && sections.length > 0

  const fallback = [
    { name:'Starters', items:[
      { name:'Spinach & Artichoke Dip', description:'House-made, served with grilled bread', price:'13' },
      { name:'Meatballs', description:'Braised in San Marzano tomato, fresh ricotta', price:'15' },
      { name:'Shrimp Cocktail', description:'Gulf shrimp, house cocktail sauce, lemon', price:'17' },
    ]},
    { name:'Mains', items:[
      { name:"KP's Burger", description:'Prime beef, aged cheddar, house sauce, brioche bun', price:'18' },
      { name:'BBQ Ribs', description:'Slow smoked, house BBQ glaze, coleslaw', price:'32' },
      { name:'Chicken Sandwich', description:'Crispy fried chicken, pickles, comeback sauce', price:'16' },
      { name:'Salmon', description:'Pan seared, seasonal vegetables, lemon butter', price:'28' },
    ]},
    { name:'Brunch', items:[
      { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
      { name:'Avocado Toast', description:'Sourdough, smashed avocado, poached egg', price:'15' },
      { name:'French Toast', description:'Brioche, fresh berries, maple syrup', price:'14' },
    ]},
    { name:'Salads', items:[
      { name:'House Salad', description:'Mixed greens, seasonal vegetables, house vinaigrette', price:'13' },
      { name:'Caesar', description:'Romaine, house Caesar, parmesan, house croutons', price:'14' },
    ]},
  ]

  const display = hasData ? sections : fallback
  const active = display[activeTab]
  const items = active?.items || []

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'stretch' }}>
      {/* Backdrop */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)' }} onClick={onClose}/>

      {/* Panel slides in from right */}
      <div style={{ position:'relative', marginLeft:'auto', width:'min(560px, 100vw)', background:CREAM, overflowY:'auto', display:'flex', flexDirection:'column', animation:'slideInRight 0.35s ease' }}>

        {/* Header */}
        <div style={{ padding:'28px 36px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start', position:'sticky', top:0, background:CREAM, zIndex:10, paddingBottom:0 }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:8 }}>Our Menu</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.1 }}>
              Made From Scratch
            </h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${BORDER}`, width:36, height:36, cursor:'pointer', fontSize:18, color:MUTED, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:4 }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:`1px solid ${BORDER}`, padding:'0 36px', marginTop:20, overflowX:'auto', flexShrink:0 }}>
          {display.map((s,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} style={{ padding:'14px 20px', fontSize:11, border:'none', background:'none', fontFamily:'DM Sans', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', whiteSpace:'nowrap', cursor:'pointer', color:activeTab===i?NAVY:MUTED, borderBottom:activeTab===i?`2px solid ${NAVY}`:'2px solid transparent', marginBottom:-1, transition:'all 0.2s' }}>
              {s.name}
            </button>
          ))}
        </div>

        {/* Items */}
        <div style={{ padding:'0 36px 48px' }}>
          {items.map((item,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:24, padding:'22px 0', borderBottom:`1px solid ${BORDER}`, alignItems:'start' }}>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:item.description?4:0 }}>{item.name}</div>
                {item.description&&<p style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, fontWeight:300, lineHeight:1.6, maxWidth:360 }}>{item.description}</p>}
              </div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:GOLD, paddingTop:2, flexShrink:0 }}>
                {item.price?`$${Number(item.price).toFixed(0)}`:''}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes slideInRight{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  )
}

// ─── Menu Section ─────────────────────────────────────────────
function KpsMenuSection({ sections }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="kps-menu" style={{ background:WARM, padding:'100px 0' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 64px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }} className="kps-menu-outer">
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <div style={{ width:36, height:1, background:GOLD }}/>
              <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD }}>The Menu</span>
            </div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(40px,5vw,68px)', fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.0, marginBottom:20, letterSpacing:'-0.5px' }}>
              Made From<br/>Scratch. Daily.
            </h2>
            <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:36 }}>
              Everything on our menu is prepared fresh each day — seasonal ingredients, classic technique, and just enough creativity to keep things interesting.
            </p>
            <button onClick={()=>setOpen(true)}
              style={{ padding:'16px 36px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, border:'none', cursor:'pointer', letterSpacing:'1.5px', textTransform:'uppercase', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              View Full Menu
            </button>
          </div>

          {/* Food photo grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
            {[
              'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
              'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
              'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
            ].map((src,i)=>(
              <div key={i} style={{ overflow:'hidden', aspectRatio:'1', background:STONE, cursor:'pointer' }} onClick={()=>setOpen(true)}>
                <img src={src} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s ease' }}
                  onMouseOver={e=>e.target.style.transform='scale(1.06)'}
                  onMouseOut={e=>e.target.style.transform='scale(1)'}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {open && <MenuModal sections={sections} onClose={()=>setOpen(false)}/>}
    </>
  )
}

// ─── Happy Hour ───────────────────────────────────────────────
function KpsHappyHour({ activeLoc }) {
  return (
    <section id="kps-happyhour" style={{ background:CREAM, padding:'0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:600 }} className="kps-hh-grid">

        {/* Left — atmospheric photo */}
        <div style={{ position:'relative', overflow:'hidden', minHeight:500 }}>
          <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80"
            alt="Happy Hour at KP's Kitchen"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, rgba(196,98,45,0.15) 0%, rgba(0,0,0,0.2) 100%)' }}/>
          {/* Time badge */}
          <div style={{ position:'absolute', bottom:40, left:40, background:'rgba(250,250,248,0.92)', backdropFilter:'blur(12px)', padding:'20px 28px', borderLeft:`3px solid ${RUST}` }}>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:RUST, marginBottom:4 }}>Every Weekday</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, fontStyle:'italic', color:NAVY }}>4 – 6 PM</div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, marginTop:2 }}>Both Locations</div>
          </div>
        </div>

        {/* Right — content */}
        <div style={{ padding:'72px 64px', display:'flex', flexDirection:'column', justifyContent:'center', background:WARM }} className="kps-hh-right">
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
            <div style={{ width:36, height:1, background:RUST }}/>
            <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:RUST }}>Daily Specials</span>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,4vw,60px)', fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.05, marginBottom:16, letterSpacing:'-0.5px' }}>
            Happy Hour
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:36 }}>
            The best hour of the day. Join us for discounted drinks and bites — perfect for date night, catching up with friends, or unwinding after work.
          </p>

          {/* Specials list */}
          <div style={{ display:'flex', flexDirection:'column', gap:0, marginBottom:40 }}>
            {[
              ['$6', 'House Wine', 'Red, white & rosé'],
              ['$7', 'Draft Beer', 'Rotating local taps'],
              ['$8', 'Cocktails', 'Wells & house specials'],
              ['50% Off', 'Select Appetizers', 'Chosen daily by the kitchen'],
            ].map(([price, name, desc], i)=>(
              <div key={i} style={{ display:'grid', gridTemplateColumns:'72px 1fr', gap:16, padding:'16px 0', borderBottom:`1px solid ${BORDER}`, alignItems:'center' }}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, fontStyle:'italic', color:RUST }}>{price}</div>
                <div>
                  <div style={{ fontFamily:'DM Sans', fontSize:14, fontWeight:600, color:NAVY }}>{name}</div>
                  <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, marginTop:1 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <a href={activeLoc.resy} target="_blank" rel="noreferrer"
            style={{ display:'inline-block', padding:'14px 32px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'none', letterSpacing:'1.5px', textTransform:'uppercase', alignSelf:'flex-start', transition:'background 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.background=RUST}
            onMouseOut={e=>e.currentTarget.style.background=NAVY}>
            Reserve for Happy Hour
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Private Dining ───────────────────────────────────────────
function KpsPrivate({ activeLoc }) {
  return (
    <section id="kps-private" style={{ background:NAVY, padding:'0' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:600 }} className="kps-private-grid">

        {/* Left — content */}
        <div style={{ padding:'80px 64px', display:'flex', flexDirection:'column', justifyContent:'center' }} className="kps-private-left">
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
            <div style={{ width:36, height:1, background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD }}>Entertain</span>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,4vw,60px)', fontWeight:700, fontStyle:'italic', color:'#fff', lineHeight:1.05, marginBottom:16, letterSpacing:'-0.5px' }}>
            Private Dining<br/>&amp; Events
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.8, fontWeight:300, marginBottom:16 }}>
            Celebrate life's moments at KP's Kitchen. From intimate birthday dinners to corporate events, our private dining room sets the stage.
          </p>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:'rgba(255,255,255,0.55)', lineHeight:1.8, fontWeight:300, marginBottom:40 }}>
            Full bar service, customizable menus, and a team dedicated to making your event unforgettable. We also offer catering throughout Houston.
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:40, marginBottom:44 }}>
            {[['60+','Guests'],['2','Locations'],['Full','Bar Service']].map(([n,l],i)=>(
              <div key={i}>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:32, fontWeight:700, fontStyle:'italic', color:GOLD, lineHeight:1 }}>{n}</div>
                <div style={{ fontFamily:'DM Sans', fontSize:11, color:'rgba(255,255,255,0.4)', letterSpacing:'1.5px', textTransform:'uppercase', marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="mailto:events@kps-kitchen.com"
              style={{ padding:'14px 28px', background:'#fff', color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:700, textDecoration:'none', letterSpacing:'1px', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='#fff';e.currentTarget.style.color=NAVY}}>
              Inquire About Events
            </a>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer"
              style={{ padding:'13px 28px', background:'none', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:500, textDecoration:'none', letterSpacing:'1px', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.7)'}}
              onMouseOut={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'}}>
              Make a Reservation
            </a>
          </div>
        </div>

        {/* Right — photo */}
        <div style={{ position:'relative', overflow:'hidden', minHeight:500 }}>
          <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80"
            alt="Private dining at KP's Kitchen"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', opacity:0.7 }}/>
        </div>
      </div>
    </section>
  )
}

// ─── Press ────────────────────────────────────────────────────
function KpsPress() {
  return (
    <div style={{ background:STONE, padding:'52px 64px', display:'flex', gap:0, overflowX:'auto' }} className="kps-press-strip">
      {PRESS.map((p,i)=>(
        <div key={i} style={{ flex:'1 0 260px', padding:'0 40px', borderRight:i<PRESS.length-1?`1px solid ${BORDER}`:'none' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontStyle:'italic', color:NAVY, lineHeight:1.7, marginBottom:12, opacity:0.85 }}>"{p.quote}"</div>
          <div style={{ fontFamily:'DM Sans', fontSize:10, color:MUTED, letterSpacing:'2px', textTransform:'uppercase', fontWeight:700 }}>{p.source}</div>
        </div>
      ))}
    </div>
  )
}

// ─── Locations ────────────────────────────────────────────────
function KpsLocations() {
  const today = new Date().getDay()
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

  return (
    <section id="kps-locations" style={{ background:WARM, padding:'100px 0' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 64px' }} className="kps-loc-wrap">
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16, justifyContent:'center' }}>
            <div style={{ width:36, height:1, background:GOLD }}/>
            <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD }}>Two Locations</span>
            <div style={{ width:36, height:1, background:GOLD }}/>
          </div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.0, letterSpacing:'-0.5px' }}>
            Find Us in Houston
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }} className="kps-loc-grid">
          {[BELLAIRE, MEMORIAL].map((loc,i)=>(
            <div key={i} style={{ background:'#fff', border:`1px solid ${BORDER}`, overflow:'hidden' }}>
              <a href={`https://maps.google.com?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer"
                style={{ display:'block', height:220, position:'relative', overflow:'hidden', textDecoration:'none' }}>
                <iframe title={`map-${loc.name}`} width="100%" height="100%"
                  style={{ border:0, display:'block', filter:'grayscale(15%)', pointerEvents:'none' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'12px 16px', background:'linear-gradient(to top,rgba(27,43,75,0.85),transparent)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <span style={{ fontSize:12, color:'#fff', fontFamily:'DM Sans' }}>{loc.address.split(',')[0]}</span>
                  <span style={{ fontSize:11, color:GOLD, fontFamily:'DM Sans', fontWeight:600, whiteSpace:'nowrap' }}>Get Directions →</span>
                </div>
              </a>

              <div style={{ padding:'28px 28px 24px' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:6 }}>
                  KP's Kitchen — {loc.name}
                </h3>
                <p style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, marginBottom:4 }}>{loc.address}</p>
                <a href={`tel:${loc.phone}`} style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, textDecoration:'none', display:'block', marginBottom:20 }}
                  onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>
                  {loc.phone}
                </a>

                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:16, marginBottom:20, paddingLeft:14 }}>
                  <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:MUTED, marginBottom:10 }}>Hours</p>
                  {loc.hours.map((h,di)=>{
                    const isToday = dayNames[today] === h.day
                    return (
                      <div key={di} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${BORDER}`, position:'relative' }}>
                        {isToday&&<div style={{ position:'absolute', left:-14, top:0, bottom:0, width:2, background:NAVY }}/>}
                        <span style={{ fontFamily:'DM Sans', fontSize:12, color:isToday?NAVY:MUTED, fontWeight:isToday?700:400 }}>{h.day}</span>
                        <span style={{ fontFamily:'Playfair Display,serif', fontSize:13, fontStyle:'italic', color:isToday?NAVY:(h.closed?'#C8C4BE':MUTED) }}>
                          {h.closed?'Closed':h.time}
                        </span>
                      </div>
                    )
                  })}
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <a href={loc.resy} target="_blank" rel="noreferrer"
                    style={{ flex:1, padding:'11px 0', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'none', textAlign:'center', transition:'opacity 0.2s' }}
                    onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    Reserve
                  </a>
                  <a href={loc.order} target="_blank" rel="noreferrer"
                    style={{ flex:1, padding:'11px 0', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, textDecoration:'none', textAlign:'center', transition:'all 0.2s' }}
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

// ─── Footer ───────────────────────────────────────────────────
function KpsFooter() {
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior:'smooth' })
  return (
    <footer style={{ background:NAVY, padding:'64px 64px 40px' }} className="kps-footer-outer">
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:64, marginBottom:48, paddingBottom:48, borderBottom:'1px solid rgba(255,255,255,0.08)' }} className="kps-footer-grid">
          <div>
            <img src={LOGO_WHITE} alt="KP's Kitchen" style={{ height:64, width:'auto', objectFit:'contain', marginBottom:16, opacity:0.9 }}
              onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='block'}}/>
            <div style={{ display:'none', fontFamily:'Playfair Display,serif', fontSize:22, fontWeight:700, fontStyle:'italic', color:'#fff', marginBottom:12 }}>KP's Kitchen & Bar</div>
            <p style={{ fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.7, maxWidth:280, fontWeight:300 }}>
              Upscale American cuisine with neighborhood hospitality. Two locations in Houston, TX.
            </p>
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Navigate</p>
            {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ display:'block', background:'none', border:'none', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:'5px 0', textAlign:'left', transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                {label}
              </button>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Visit Us</p>
            <a href={BELLAIRE.resy} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'5px 0', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Reserve — Bellaire</a>
            <a href={MEMORIAL.resy} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'5px 0', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Reserve — Memorial</a>
            <a href="mailto:events@kps-kitchen.com" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'5px 0', marginTop:16, transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Private Events</a>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans' }}>© {new Date().getFullYear()} KP's Kitchen & Bar. All rights reserved.</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans' }}>
            Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:GOLD, textDecoration:'none' }}>EC Web Co</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Sticky Bar ───────────────────────────────────────────────
function KpsStickyBar({ activeLoc }) {
  return (
    <>
      <div className="kps-sticky" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, display:'none', background:'#fff', borderTop:`1px solid ${BORDER}`, paddingBottom:'env(safe-area-inset-bottom)' }}>
        <a href={activeLoc.resy} target="_blank" rel="noreferrer"
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'12px 8px', background:NAVY, color:'#fff', textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </a>
        <a href={activeLoc.order} target="_blank" rel="noreferrer"
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'12px 8px', background:'#fff', color:NAVY, textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:`1px solid ${BORDER}` }}>
          Order
        </a>
        <a href={`tel:${activeLoc.phone}`}
          style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'12px 8px', background:'#fff', color:NAVY, textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' }}>
          Call
        </a>
      </div>
      <div className="kps-sticky-spacer" style={{ display:'none', height:68 }}/>
      <style>{`@media(max-width:768px){.kps-sticky{display:flex!important}.kps-sticky-spacer{display:block!important}}`}</style>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────
export default function KpsLayout({ data }) {
  const [activeLoc, setActiveLoc] = useState(MEMORIAL)
  const { sections } = data

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', background:CREAM, color:NAVY, overflowX:'hidden' }}>
      <KpsNav activeLoc={activeLoc} setActiveLoc={setActiveLoc} />
      <KpsHero activeLoc={activeLoc} />
      <KpsIntro activeLoc={activeLoc} />
      <KpsMenuSection sections={sections} />
      <KpsHappyHour activeLoc={activeLoc} />
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
          .kps-intro-strip{grid-template-columns:1fr 1fr!important}
          .kps-menu-outer{grid-template-columns:1fr!important;gap:40px!important;padding:0 24px!important}
          .kps-hh-grid{grid-template-columns:1fr!important}
          .kps-hh-right{padding:48px 24px!important}
          .kps-private-grid{grid-template-columns:1fr!important}
          .kps-private-left{padding:56px 24px!important}
          .kps-press-strip{padding:40px 24px!important;flex-direction:column!important}
          .kps-loc-wrap{padding:0 24px!important}
          .kps-loc-grid{grid-template-columns:1fr!important}
          .kps-footer-outer{padding:48px 24px 32px!important}
          .kps-footer-grid{grid-template-columns:1fr!important;gap:32px!important}
        }
      `}</style>
    </div>
  )
}
