import { useState, useEffect } from 'react'
import { trackEvent } from '../../lib/supabase'

const NAVY   = '#1B2B4B'
const CREAM  = '#FAFAF8'
const WARM   = '#F4F1EB'
const STONE  = '#E8E4DC'
const GOLD   = '#C9A84C'
const MUTED  = '#8A8278'
const BORDER = '#E4E0D8'
const RUST   = '#C4622D'

const LOGO_WHITE = 'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2007_06_02%20PM.png'
const LOGO_BLUE  = 'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2007_05_51%20PM.png'

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

const HERO_PHOTOS = [
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80',
  'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=1920&q=80',
  'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1920&q=80',
]

// ─── Nav ──────────────────────────────────────────────────────
function KpsNav({ activeLoc, setActiveLoc }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [locPicker, setLocPicker] = useState(null) // 'order' | 'reserve' | null

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > window.innerHeight - 100)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  const textColor = NAVY

  const handlePick = (loc, type) => {
    setActiveLoc(loc)
    setLocPicker(null)
    const url = type === 'order' ? loc.order : loc.resy
    window.open(url, '_blank')
  }

  return (
    <>
      {/* Location picker modal */}
      {locPicker && (
        <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={()=>setLocPicker(null)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)' }}/>
          <div style={{ position:'relative', background:'#fff', width:360, overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,0.15)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:'24px 28px 16px', borderBottom:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:4 }}>
                  {locPicker === 'order' ? 'Order Online' : 'Make a Reservation'}
                </div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, fontStyle:'italic', color:NAVY }}>Choose a Location</div>
              </div>
              <button onClick={()=>setLocPicker(null)} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:MUTED, lineHeight:1 }}>✕</button>
            </div>
            {[BELLAIRE, MEMORIAL].map(loc=>(
              <button key={loc.name} onClick={()=>handlePick(loc, locPicker)}
                style={{ display:'flex', flexDirection:'column', width:'100%', padding:'20px 28px', background:'#fff', border:'none', borderBottom:`1px solid ${BORDER}`, textAlign:'left', cursor:'pointer', transition:'background 0.15s' }}
                onMouseOver={e=>e.currentTarget.style.background=WARM}
                onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                <span style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:3 }}>KP's Kitchen — {loc.name}</span>
                <span style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED }}>{loc.address.split(',')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 72, display: 'flex', alignItems: 'center',
        padding: '0 48px', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'rgba(250,250,248,0.97)' : 'transparent',
        borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>

        {/* Logo — only visible when scrolled */}
        <div style={{ flexShrink: 0, width: 64, height: 52, display:'flex', alignItems:'center', opacity: scrolled || menuOpen ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: scrolled || menuOpen ? 'auto' : 'none' }}>
          <img src={LOGO_BLUE} alt="KP's Kitchen"
            style={{ height: 52, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display='none' }}
          />
        </div>

        {/* Desktop nav */}
        <div className="kps-nav-links" style={{ display:'flex', gap:32, alignItems:'center' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', fontSize:13, color:textColor, cursor:'pointer', fontFamily:'DM Sans', fontWeight:500, transition:'color 0.3s, opacity 0.2s', opacity:0.85 }}
              onMouseOver={e=>e.target.style.opacity='1'} onMouseOut={e=>e.target.style.opacity='0.85'}>
              {label}
            </button>
          ))}
        </div>

        {/* CTAs — no location picker, just Order + Reserve which trigger modal */}
        <div className="kps-nav-cta" style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button onClick={()=>setLocPicker('order')} style={{ padding:'8px 18px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
            Order
          </button>
          <button onClick={()=>setLocPicker('reserve')} style={{ padding:'8px 20px', background:NAVY, border:`1px solid ${NAVY}`, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Reserve
          </button>
        </div>

        {/* Hamburger */}
        <button className="kps-ham" onClick={()=>setMenuOpen(!menuOpen)} style={{ display:'none', background:'none', border:'none', flexDirection:'column', gap:5, cursor:'pointer', padding:4 }}>
          {[0,1,2].map(i=><span key={i} style={{ display:'block', width:24, height:2, background:textColor, transition:'0.3s', transform:i===0&&menuOpen?'rotate(45deg) translate(5px,5px)':i===2&&menuOpen?'rotate(-45deg) translate(5px,-5px)':'none', opacity:i===1&&menuOpen?0:1 }}/>)}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, background:CREAM, zIndex:199, paddingTop:72, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
            <button key={id} onClick={()=>scrollTo(id)} style={{ background:'none', border:'none', borderBottom:`1px solid ${BORDER}`, width:'100%', padding:'20px 0', textAlign:'center', fontSize:24, color:NAVY, fontFamily:'Playfair Display,serif', fontStyle:'italic', cursor:'pointer', fontWeight:700 }}>
              {label}
            </button>
          ))}
          <div style={{ display:'flex', gap:12, marginTop:32, padding:'0 24px', flexWrap:'wrap', justifyContent:'center' }}>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'13px 28px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'none' }}>Reserve a Table</a>
            <a href={activeLoc.order} target="_blank" rel="noreferrer" style={{ padding:'12px 28px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, textDecoration:'none' }}>Order Online</a>
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
function KpsHero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % HERO_PHOTOS.length), 5000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + HERO_PHOTOS.length) % HERO_PHOTOS.length)
  const next = () => setCurrent(c => (c + 1) % HERO_PHOTOS.length)

  return (
    <div style={{ height:'100vh', minHeight:600, position:'relative', overflow:'hidden', background:CREAM }}>
      {HERO_PHOTOS.map((src, i) => (
        <img key={i} src={src} alt="" style={{
          position:'absolute', inset:0, width:'100%', height:'100%',
          objectFit:'cover', objectPosition:'center',
          opacity: i === current ? 0.9 : 0,
          transition: 'opacity 1.2s ease',
        }}/>
      ))}

      {/* White fade on top only */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:200, background:'linear-gradient(to bottom, rgba(250,250,248,0.85) 0%, rgba(250,250,248,0.3) 50%, transparent 100%)', pointerEvents:'none' }}/>

      {/* Left arrow */}
      <button onClick={prev} style={{ position:'absolute', left:24, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.25)', border:'1px solid rgba(255,255,255,0.5)', backdropFilter:'blur(4px)', width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, transition:'background 0.2s', zIndex:10 }}
        onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.45)'}
        onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}>
        ‹
      </button>

      {/* Right arrow */}
      <button onClick={next} style={{ position:'absolute', right:24, top:'50%', transform:'translateY(-50%)', background:'rgba(255,255,255,0.25)', border:'1px solid rgba(255,255,255,0.5)', backdropFilter:'blur(4px)', width:44, height:44, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:20, transition:'background 0.2s', zIndex:10 }}
        onMouseOver={e=>e.currentTarget.style.background='rgba(255,255,255,0.45)'}
        onMouseOut={e=>e.currentTarget.style.background='rgba(255,255,255,0.25)'}>
        ›
      </button>

      {/* Centered logo */}
      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
        <img src={LOGO_WHITE} alt="KP's Kitchen"
          style={{ width:'clamp(200px,28vw,340px)', height:'auto', objectFit:'contain', filter:'drop-shadow(0 4px 24px rgba(0,0,0,0.55)) drop-shadow(0 1px 6px rgba(0,0,0,0.4))' }}
          onError={e=>e.target.style.display='none'}/>
      </div>
    </div>
  )
}

// ─── About ────────────────────────────────────────────────────
function KpsAbout({ activeLoc }) {
  return (
    <section style={{ background:CREAM, padding:'80px 0' }}>

      {/* City label + name — Tiny Boxwoods style */}
      <div style={{ textAlign:'center', padding:'0 48px', marginBottom:64 }}>
        <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:20 }}>Houston, Texas</div>
        <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(36px,5vw,64px)', fontWeight:400, fontStyle:'italic', color:NAVY, lineHeight:1.0, marginBottom:24, letterSpacing:'-0.5px' }}>
          KP's Kitchen & Bar
        </h1>
        <p style={{ fontFamily:'DM Sans', fontSize:16, color:MUTED, lineHeight:1.9, fontWeight:300, maxWidth:560, margin:'0 auto 36px' }}>
          Upscale American comfort food served with neighborhood warmth. From scratch-made classics to thoughtfully crafted cocktails — two Houston locations, one kitchen philosophy.
        </p>
        <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
          <button style={{ background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', padding:'4px 0', borderBottom:`1px solid ${NAVY}`, transition:'opacity 0.2s' }}
            onClick={()=>document.getElementById('kps-locations')?.scrollIntoView({behavior:'smooth'})}
            onMouseOver={e=>e.currentTarget.style.opacity='0.6'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Make a Reservation
          </button>
          <span style={{ color:BORDER, fontFamily:'DM Sans' }}>·</span>
          <button style={{ background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', padding:'4px 0', borderBottom:`1px solid ${NAVY}`, transition:'opacity 0.2s' }}
            onClick={()=>document.getElementById('kps-menu')?.scrollIntoView({behavior:'smooth'})}
            onMouseOver={e=>e.currentTarget.style.opacity='0.6'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            View Menus
          </button>
          <span style={{ color:BORDER, fontFamily:'DM Sans' }}>·</span>
          <button style={{ background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', padding:'4px 0', borderBottom:`1px solid ${NAVY}`, transition:'opacity 0.2s' }}
            onClick={()=>document.getElementById('kps-private')?.scrollIntoView({behavior:'smooth'})}
            onMouseOver={e=>e.currentTarget.style.opacity='0.6'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Private Dining
          </button>
        </div>
      </div>

      {/* Editorial photo layout — not a grid, asymmetric */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 48px', display:'grid', gridTemplateColumns:'3fr 2fr', gap:4, alignItems:'stretch' }} className="kps-about-photos">
        {/* Large left photo — tall */}
        <div style={{ overflow:'hidden', position:'relative' }}>
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80" alt=""
            style={{ width:'100%', height:'100%', minHeight:480, objectFit:'cover', objectPosition:'center', transition:'transform 0.7s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.03)'}
            onMouseOut={e=>e.target.style.transform='scale(1)'}/>
        </div>
        {/* Right column — two stacked */}
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <div style={{ overflow:'hidden', flex:1 }}>
            <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80" alt=""
              style={{ width:'100%', height:'100%', minHeight:232, objectFit:'cover', transition:'transform 0.7s ease' }}
              onMouseOver={e=>e.target.style.transform='scale(1.03)'}
              onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          </div>
          <div style={{ overflow:'hidden', flex:1 }}>
            <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80" alt=""
              style={{ width:'100%', height:'100%', minHeight:232, objectFit:'cover', transition:'transform 0.7s ease' }}
              onMouseOver={e=>e.target.style.transform='scale(1.03)'}
              onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          </div>
        </div>
      </div>

    </section>
  )
}

// ─── Menu ─────────────────────────────────────────────────────
function MenuModal({ sections, onClose }) {
  const [activeTab, setActiveTab] = useState(0)
  const fallback = [
    { name:'Starters', items:[
      { name:'Spinach & Artichoke Dip', description:'House-made, served with grilled bread', price:'13' },
      { name:'Meatballs', description:'Braised in San Marzano tomato, fresh ricotta', price:'15' },
      { name:'Shrimp Cocktail', description:'Gulf shrimp, house cocktail sauce, lemon', price:'17' },
    ]},
    { name:'Mains', items:[
      { name:"KP's Burger", description:'Prime beef, aged cheddar, house sauce, brioche', price:'18' },
      { name:'BBQ Ribs', description:'Slow smoked, house BBQ glaze, coleslaw', price:'32' },
      { name:'Chicken Sandwich', description:'Crispy fried chicken, pickles, comeback sauce', price:'16' },
      { name:'Salmon', description:'Pan seared, seasonal vegetables, lemon butter', price:'28' },
    ]},
    { name:'Brunch', items:[
      { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
      { name:'French Toast', description:'Brioche, fresh berries, maple syrup', price:'14' },
    ]},
    { name:'Salads', items:[
      { name:'House Salad', description:'Mixed greens, seasonal vegetables, vinaigrette', price:'13' },
      { name:'Caesar', description:'Romaine, house Caesar, parmesan, croutons', price:'14' },
    ]},
  ]
  const display = sections?.length ? sections : fallback
  const items = display[activeTab]?.items || []

  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }} onClick={onClose}/>
      <div style={{ position:'relative', marginLeft:'auto', width:'min(540px,100vw)', background:CREAM, overflowY:'auto', display:'flex', flexDirection:'column', animation:'slideIn 0.3s ease' }}>
        <div style={{ padding:'32px 36px 0', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:CREAM, zIndex:10, paddingBottom:20, borderBottom:`1px solid ${BORDER}` }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:6 }}>Our Menu</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:28, fontWeight:700, fontStyle:'italic', color:NAVY }}>Made From Scratch</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${BORDER}`, width:36, height:36, cursor:'pointer', fontSize:16, color:MUTED, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ display:'flex', borderBottom:`1px solid ${BORDER}`, padding:'0 36px', overflowX:'auto', flexShrink:0 }}>
          {display.map((s,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} style={{ padding:'14px 20px', fontSize:11, border:'none', background:'none', fontFamily:'DM Sans', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', whiteSpace:'nowrap', cursor:'pointer', color:activeTab===i?NAVY:MUTED, borderBottom:activeTab===i?`2px solid ${NAVY}`:'2px solid transparent', marginBottom:-1, transition:'all 0.2s' }}>
              {s.name}
            </button>
          ))}
        </div>
        <div style={{ padding:'0 36px 48px' }}>
          {items.map((item,i)=>(
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:24, padding:'20px 0', borderBottom:`1px solid ${BORDER}`, alignItems:'start' }}>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:18, fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:item.description?4:0 }}>{item.name}</div>
                {item.description&&<p style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, fontWeight:300, lineHeight:1.6, maxWidth:340 }}>{item.description}</p>}
              </div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:17, color:GOLD, paddingTop:2, flexShrink:0 }}>
                {item.price?`$${Number(item.price).toFixed(0)}`:''}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  )
}

function KpsMenu({ sections }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <section id="kps-menu" style={{ background:WARM, padding:'80px 0', borderTop:`1px solid ${BORDER}` }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 48px', textAlign:'center' }}>
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Menus</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,4vw,52px)', fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:16 }}>
            Something for Everyone
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, maxWidth:520, margin:'0 auto 40px' }}>
            Lunch, dinner, brunch, and happy hour — everything made fresh daily with seasonal ingredients.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button onClick={()=>setOpen(true)} style={{ padding:'14px 32px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, border:'none', cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.8'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              Dinner Menu
            </button>
            <button onClick={()=>setOpen(true)} style={{ padding:'13px 32px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              Brunch Menu
            </button>
            <button onClick={()=>setOpen(true)} style={{ padding:'13px 32px', background:'none', border:`1px solid ${BORDER}`, color:MUTED, fontSize:12, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', letterSpacing:'1px', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.borderColor=NAVY;e.currentTarget.style.color=NAVY}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=BORDER;e.currentTarget.style.color=MUTED}}>
              Happy Hour Menu
            </button>
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
    <section id="kps-happyhour" style={{ background:CREAM, padding:'0', borderTop:`1px solid ${BORDER}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:560 }} className="kps-hh-grid">
        <div style={{ position:'relative', overflow:'hidden', minHeight:400 }}>
          <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80"
            alt="Happy Hour" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.12)' }}/>
          <div style={{ position:'absolute', bottom:36, left:36, background:'rgba(250,250,248,0.95)', backdropFilter:'blur(8px)', padding:'16px 22px', borderLeft:`3px solid ${RUST}` }}>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:RUST, marginBottom:3 }}>Every Weekday</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, fontWeight:700, fontStyle:'italic', color:NAVY }}>4 – 6 PM</div>
          </div>
        </div>

        <div style={{ padding:'64px 56px', display:'flex', flexDirection:'column', justifyContent:'center', background:WARM }} className="kps-hh-right">
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:RUST, marginBottom:16 }}>Daily Specials</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,3.5vw,52px)', fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.05, marginBottom:12 }}>
            Happy Hour
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:32 }}>
            The best seat in the neighborhood. Join us Monday through Friday, 4 to 6 PM at both locations.
          </p>
          {[['$6','House Wine'],['$7','Draft Beer'],['$8','Well Cocktails'],['50% Off','Select Apps']].map(([price,name],i)=>(
            <div key={i} style={{ display:'flex', alignItems:'baseline', gap:16, padding:'12px 0', borderBottom:`1px solid ${BORDER}` }}>
              <span style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, fontStyle:'italic', color:RUST, width:68, flexShrink:0 }}>{price}</span>
              <span style={{ fontFamily:'DM Sans', fontSize:14, color:NAVY, fontWeight:500 }}>{name}</span>
            </div>
          ))}
          <a href={activeLoc.resy} target="_blank" rel="noreferrer"
            style={{ display:'inline-block', marginTop:32, padding:'13px 28px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'none', letterSpacing:'1px', textTransform:'uppercase', alignSelf:'flex-start', transition:'background 0.2s' }}
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
    <section id="kps-private" style={{ background:CREAM, padding:'0', borderTop:`1px solid ${BORDER}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', minHeight:520 }} className="kps-private-grid">
        <div style={{ padding:'64px 56px', display:'flex', flexDirection:'column', justifyContent:'center' }} className="kps-private-left">
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Entertain</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,3.5vw,52px)', fontWeight:700, fontStyle:'italic', color:NAVY, lineHeight:1.05, marginBottom:16 }}>
            Private Dining<br/>& Events
          </h2>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:16 }}>
            Host your next celebration, corporate dinner, or private party at KP's Kitchen. Accommodates up to 60 guests with customizable menus and full bar service.
          </p>
          <p style={{ fontFamily:'DM Sans', fontSize:15, color:MUTED, lineHeight:1.8, fontWeight:300, marginBottom:36 }}>
            Full-service catering available throughout Houston.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            <a href="mailto:events@kps-kitchen.com" style={{ padding:'13px 28px', background:NAVY, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, textDecoration:'none', letterSpacing:'1px', textTransform:'uppercase', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.8'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              Inquire About Events
            </a>
            <a href={activeLoc.resy} target="_blank" rel="noreferrer" style={{ padding:'12px 28px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, textDecoration:'none', letterSpacing:'1px', textTransform:'uppercase', transition:'all 0.2s' }}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              Reserve
            </a>
          </div>
        </div>
        <div style={{ position:'relative', overflow:'hidden', minHeight:400 }}>
          <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80"
            alt="Private dining" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}/>
        </div>
      </div>
    </section>
  )
}

// ─── Press ────────────────────────────────────────────────────
function KpsPress() {
  const PRESS = [
    { source: 'Houston Eater', quote: 'One of Houston\'s best hidden gem restaurants.' },
    { source: 'Biz Journals', quote: 'KP\'s Kitchen expands with a second Houston location.' },
    { source: 'Shoutout HTX', quote: 'Heartfelt service meets culinary excellence.' },
  ]
  return (
    <div style={{ background:STONE, padding:'48px 64px', display:'flex', gap:0, borderTop:`1px solid ${BORDER}` }} className="kps-press-strip">
      {PRESS.map((p,i)=>(
        <div key={i} style={{ flex:'1 0 240px', padding:'0 36px', borderRight:i<PRESS.length-1?`1px solid ${BORDER}`:'none' }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontStyle:'italic', color:NAVY, lineHeight:1.7, marginBottom:10, opacity:0.8 }}>"{p.quote}"</div>
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
    <section id="kps-locations" style={{ background:WARM, padding:'80px 0', borderTop:`1px solid ${BORDER}` }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 64px' }} className="kps-loc-wrap">
        <div style={{ textAlign:'center', marginBottom:56 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:12 }}>Visit Us</div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(32px,4vw,52px)', fontWeight:700, fontStyle:'italic', color:NAVY }}>Two Houston Locations</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }} className="kps-loc-grid">
          {[BELLAIRE, MEMORIAL].map((loc,i)=>(
            <div key={i} style={{ background:'#fff', border:`1px solid ${BORDER}`, overflow:'hidden' }}>
              <a href={`https://maps.google.com?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer"
                style={{ display:'block', height:200, position:'relative', overflow:'hidden', textDecoration:'none' }}>
                <iframe title={`map-${loc.name}`} width="100%" height="100%"
                  style={{ border:0, display:'block', filter:'grayscale(15%)', pointerEvents:'none' }}
                  loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`}/>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'10px 14px', background:'linear-gradient(to top,rgba(27,43,75,0.8),transparent)', display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                  <span style={{ fontSize:12, color:'#fff', fontFamily:'DM Sans' }}>{loc.address.split(',')[0]}</span>
                  <span style={{ fontSize:11, color:GOLD, fontFamily:'DM Sans', fontWeight:600 }}>Directions →</span>
                </div>
              </a>
              <div style={{ padding:'24px 24px 20px' }}>
                <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:700, fontStyle:'italic', color:NAVY, marginBottom:4 }}>KP's Kitchen — {loc.name}</h3>
                <p style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, marginBottom:3 }}>{loc.address}</p>
                <a href={`tel:${loc.phone}`} style={{ fontFamily:'DM Sans', fontSize:13, color:MUTED, textDecoration:'none', display:'block', marginBottom:20 }}
                  onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>{loc.phone}</a>
                <div style={{ borderTop:`1px solid ${BORDER}`, paddingTop:14, paddingLeft:12, marginBottom:18 }}>
                  <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Hours</p>
                  {loc.hours.map((h,di)=>{
                    const isToday = dayNames[today] === h.day
                    return (
                      <div key={di} style={{ display:'flex', justifyContent:'space-between', padding:'5px 0', borderBottom:`1px solid ${BORDER}`, position:'relative' }}>
                        {isToday&&<div style={{ position:'absolute', left:-12, top:0, bottom:0, width:2, background:NAVY }}/>}
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
                    onMouseOver={e=>e.currentTarget.style.opacity='0.8'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                    Reserve
                  </a>
                  <a href={loc.order} target="_blank" rel="noreferrer"
                    style={{ flex:1, padding:'11px 0', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, textDecoration:'none', textAlign:'center', transition:'all 0.2s' }}
                    onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                    onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
                    Order
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
    <footer style={{ background:NAVY, padding:'56px 64px 36px', borderTop:`1px solid ${BORDER}` }} className="kps-footer-outer">
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:56, marginBottom:40, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,0.08)' }} className="kps-footer-grid">
          <div>
            <img src={LOGO_WHITE} alt="KP's Kitchen" style={{ height:56, width:'auto', objectFit:'contain', marginBottom:14, opacity:0.85 }} onError={e=>e.target.style.display='none'}/>
            <p style={{ fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.35)', lineHeight:1.7, maxWidth:260, fontWeight:300 }}>
              Upscale American cuisine with neighborhood hospitality. Two Houston locations.
            </p>
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:GOLD, marginBottom:14 }}>Navigate</p>
            {[['kps-menu','Menu'],['kps-happyhour','Happy Hour'],['kps-private','Private Dining'],['kps-locations','Locations']].map(([id,label])=>(
              <button key={id} onClick={()=>scrollTo(id)} style={{ display:'block', background:'none', border:'none', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', cursor:'pointer', padding:'4px 0', textAlign:'left', transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>
                {label}
              </button>
            ))}
          </div>
          <div>
            <p style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:GOLD, marginBottom:14 }}>Reserve</p>
            <a href={BELLAIRE.resy} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 0', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Bellaire</a>
            <a href={MEMORIAL.resy} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 0', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Memorial</a>
            <a href="mailto:events@kps-kitchen.com" style={{ display:'block', fontFamily:'DM Sans', fontSize:13, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 0', marginTop:12, transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.4)'}>Private Events</a>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans' }}>© {new Date().getFullYear()} KP's Kitchen & Bar. All rights reserved.</div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.2)', fontFamily:'DM Sans' }}>Website by <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:GOLD, textDecoration:'none' }}>EC Web Co</a></div>
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
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:NAVY, color:'#fff', textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </a>
        <a href={activeLoc.order} target="_blank" rel="noreferrer"
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:`1px solid ${BORDER}` }}>
          Order
        </a>
        <a href={`tel:${activeLoc.phone}`}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, textDecoration:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' }}>
          Call
        </a>
      </div>
      <div className="kps-sticky-spacer" style={{ display:'none', height:56 }}/>
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
      <KpsHero />
      <KpsAbout activeLoc={activeLoc} />
      <KpsMenu sections={sections} />
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
          .kps-about-photos{grid-template-columns:1fr!important;padding:0!important}
          .kps-hh-grid{grid-template-columns:1fr!important}
          .kps-hh-right{padding:48px 24px!important}
          .kps-private-grid{grid-template-columns:1fr!important}
          .kps-private-left{padding:48px 24px!important;order:2}
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
