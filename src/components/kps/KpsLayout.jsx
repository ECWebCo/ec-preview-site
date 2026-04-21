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

// ─── Design system ────────────────────────────────────────────
const SECTION_MAX = 960
const SECTION_PAD = '72px 64px'
const PATTERN_URL = 'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2008_18_08%20PM.png'
const EYEBROW_STYLE = { fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:14 }
const H2_STYLE = { fontFamily:'Playfair Display,serif', fontSize:'clamp(26px,3.5vw,42px)', fontWeight:400, fontStyle:'italic', color:NAVY, lineHeight:1.15 }
const BODY_STYLE = { fontFamily:'DM Sans', fontSize:14, color:MUTED, lineHeight:1.85, fontWeight:300 }
const LINK_STYLE = { background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', textAlign:'left', transition:'opacity 0.2s', width:'100%' }

const PRESS_ITEMS = [
  { label:'EATER', quote:"One of Houston's best hidden gem restaurants.", url:'https://houston.eater.com/maps/best-hidden-gem-underrated-restaurants-houston' },
  { label:'BIZ JOURNAL', quote:"KP's Kitchen expands with a second Houston location.", url:'https://www.bizjournals.com/houston/news/2024/04/05/kps-kitchen-second-location-bellaire.html' },
  { label:'SHOUTOUT HTX', quote:'Heartfelt service meets culinary excellence.', url:'https://shoutouthtx.com/meet-kerry-pauly-owner-kps-kitchen/' },
]

// ─── Hours status (Google-style) ──────────────────────────────
function getHoursStatus(hours) {
  const now = new Date()
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const todayName = dayNames[now.getDay()]
  const h = hours.find(h => h.day === todayName)
  if (!h || h.closed) return { label:'Closed today', color:'#C0392B' }
  const parts = h.time.split(' – ')
  if (parts.length < 2) return { label:'See hours', color:MUTED }
  const parseTime = str => {
    const isPM = str.includes('PM'), isAM = str.includes('AM')
    let [hh, mm] = str.replace(' PM','').replace(' AM','').split(':').map(Number)
    if (isPM && hh !== 12) hh += 12
    if (isAM && hh === 12) hh = 0
    return hh * 60 + (mm || 0)
  }
  const openMins = parseTime(parts[0])
  const closeMins = parseTime(parts[1])
  const nowMins = now.getHours() * 60 + now.getMinutes()
  if (nowMins < openMins) return { label:`Opens ${parts[0]}`, color:MUTED }
  const remaining = closeMins - nowMins
  if (remaining <= 0) return { label:'Closed now', color:'#C0392B' }
  if (remaining <= 60) return { label:`Closes soon · ${parts[1]}`, color:'#E67E22' }
  return { label:`Open until ${parts[1]}`, color:'#27AE60' }
}

// ─── Pattern Banner ───────────────────────────────────────────
function KpsPattern() {
  return (
    <div style={{ height:100, backgroundImage:`url(${PATTERN_URL})`, backgroundRepeat:'repeat', backgroundSize:'auto 100px', borderBottom:`1px solid ${BORDER}`, opacity:0.8 }}/>
  )
}

// ─── About ────────────────────────────────────────────────────
function KpsAbout({ onMenuOpen }) {
  return (
    <section style={{
      backgroundImage:`url(${PATTERN_URL})`,
      backgroundRepeat:'repeat',
      backgroundSize:'auto 200px',
      borderBottom:`1px solid ${BORDER}`,
    }}>
      {/* Cream overlay so text is legible over pattern */}
      <div style={{ background:'rgba(250,250,248,0.92)', padding:SECTION_PAD }}>
        <div style={{ maxWidth:SECTION_MAX, margin:'0 auto', textAlign:'center' }}>
          <div style={{ ...EYEBROW_STYLE, justifyContent:'center', display:'flex', justifyContent:'center' }}>Houston, Texas</div>
          <h1 style={{ ...H2_STYLE, marginBottom:20, fontSize:'clamp(32px,4vw,52px)' }}>KP's Kitchen & Bar</h1>
          <p style={{ ...BODY_STYLE, marginBottom:40, maxWidth:480, margin:'0 auto 40px' }}>
            Upscale American comfort food served with neighborhood warmth. Two Houston locations, one kitchen philosophy.
          </p>
          <div style={{ display:'flex', gap:32, justifyContent:'center', flexWrap:'wrap' }}>
            {[
              { label:'Make a Reservation', id:'kps-locations' },
              { label:'View Menus', action: onMenuOpen },
              { label:'Private Dining', id:'kps-private' },
            ].map((item,i)=>(
              <button key={i}
                onClick={()=> item.action ? item.action() : document.getElementById(item.id)?.scrollIntoView({behavior:'smooth'})}
                style={{ background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', borderBottom:`1px solid ${NAVY}`, paddingBottom:3, transition:'opacity 0.2s' }}
                onMouseOver={e=>e.currentTarget.style.opacity='0.45'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                {item.label}
              </button>
            ))}
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
    { name:'Dinner', items:[
      { name:"KP's Burger", description:'Prime beef, aged cheddar, house sauce, brioche', price:'18' },
      { name:'BBQ Ribs', description:'Slow smoked, house BBQ glaze, coleslaw', price:'32' },
      { name:'Salmon', description:'Pan seared, seasonal vegetables, lemon butter', price:'28' },
      { name:'Meatballs', description:'Braised in San Marzano tomato, ricotta', price:'15' },
    ]},
    { name:'Brunch', items:[
      { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
      { name:'French Toast', description:'Brioche, fresh berries, maple syrup', price:'14' },
      { name:'Spinach Dip', description:'House-made, served with grilled bread', price:'13' },
    ]},
    { name:'Happy Hour', items:[
      { name:'House Wine', description:'Red, white & rosé', price:'6' },
      { name:'Draft Beer', description:'Rotating local taps', price:'7' },
      { name:'Well Cocktails', description:'House specials', price:'8' },
      { name:'Select Appetizers', description:'Chosen daily', price:'50% off' },
    ]},
  ]
  const display = sections?.length ? sections : fallback
  const items = display[activeTab]?.items || []
  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])
  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)', backdropFilter:'blur(4px)' }} onClick={onClose}/>
      <div style={{ position:'relative', marginLeft:'auto', width:'min(500px,100vw)', background:CREAM, overflowY:'auto', display:'flex', flexDirection:'column', animation:'slideIn 0.3s ease' }}>
        <div style={{ padding:'24px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:CREAM, zIndex:10, borderBottom:`1px solid ${BORDER}` }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:20, fontWeight:400, fontStyle:'italic', color:NAVY }}>Our Menus</div>
          <button onClick={onClose} style={{ background:'none', border:`1px solid ${BORDER}`, width:32, height:32, cursor:'pointer', fontSize:15, color:MUTED, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
        </div>
        <div style={{ display:'flex', borderBottom:`1px solid ${BORDER}`, padding:'0 32px', overflowX:'auto', flexShrink:0 }}>
          {display.map((s,i)=>(
            <button key={i} onClick={()=>setActiveTab(i)} style={{ padding:'12px 16px', fontSize:11, border:'none', background:'none', fontFamily:'DM Sans', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', whiteSpace:'nowrap', cursor:'pointer', color:activeTab===i?NAVY:MUTED, borderBottom:activeTab===i?`2px solid ${NAVY}`:'2px solid transparent', marginBottom:-1, transition:'all 0.2s' }}>
              {s.name}
            </button>
          ))}
        </div>
        <div style={{ padding:'0 32px 48px' }}>
          {items.map((item,i)=>(
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:20, padding:'16px 0', borderBottom:`1px solid ${BORDER}` }}>
              <div>
                <div style={{ fontFamily:'Playfair Display,serif', fontSize:16, fontStyle:'italic', color:NAVY, marginBottom:item.description?3:0 }}>{item.name}</div>
                {item.description&&<p style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, fontWeight:300, lineHeight:1.5 }}>{item.description}</p>}
              </div>
              <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, flexShrink:0, fontWeight:500 }}>
                {item.price&&(isNaN(item.price)?item.price:`$${Number(item.price).toFixed(0)}`)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
    </div>
  )
}

function KpsMenu({ sections, open, onClose }) {
  if (!open) return null
  return <MenuModal sections={sections} onClose={onClose}/>
}

// ─── Happy Hour + Private ─────────────────────────────────────
function KpsHappyHourAndPrivate({ activeLoc }) {
  return (
    <section style={{ borderBottom:`1px solid ${BORDER}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        <div id="kps-happyhour" style={{ position:'relative', overflow:'hidden', minHeight:480, cursor:'pointer' }}
          onClick={()=>window.open(activeLoc.resy,'_blank')}>
          <img src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=80" alt="Happy Hour"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.8s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.04)'}
            onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}/>
          <div style={{ position:'absolute', bottom:36, left:40, right:40 }}>
            <div style={{ ...EYEBROW_STYLE, color:'rgba(255,255,255,0.6)', marginBottom:6 }}>Mon – Fri · 4 – 6 PM</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3vw,38px)', fontWeight:400, fontStyle:'italic', color:'#fff', marginBottom:14 }}>Happy Hour</div>
            <div style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.5)', display:'inline-block', paddingBottom:3 }}>Reserve a Table →</div>
          </div>
        </div>
        <div id="kps-private" style={{ position:'relative', overflow:'hidden', minHeight:480, cursor:'pointer', borderLeft:`1px solid ${BORDER}` }}
          onClick={()=>window.location.href='mailto:events@kps-kitchen.com'}>
          <img src="https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=1200&q=80" alt="Private Dining"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.8s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.04)'}
            onMouseOut={e=>e.target.style.transform='scale(1)'}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)' }}/>
          <div style={{ position:'absolute', bottom:36, left:40, right:40 }}>
            <div style={{ ...EYEBROW_STYLE, color:'rgba(255,255,255,0.6)', marginBottom:6 }}>Up to 60 Guests</div>
            <div style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(24px,3vw,38px)', fontWeight:400, fontStyle:'italic', color:'#fff', marginBottom:14 }}>Private Dining<br/>& Events</div>
            <div style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.5)', display:'inline-block', paddingBottom:3 }}>Inquire About Events →</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Press ────────────────────────────────────────────────────
function KpsPress() {
  return (
    <section style={{ background:WARM, borderBottom:`1px solid ${BORDER}` }}>
      <div style={{ maxWidth:SECTION_MAX, margin:'0 auto', padding:SECTION_PAD }} className="kps-inner">
        <div style={EYEBROW_STYLE}>As Seen In</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:0, marginTop:28, borderTop:`1px solid ${BORDER}` }} className="kps-three-col">
          {PRESS_ITEMS.map((p,i)=>(
            <a key={i} href={p.url} target="_blank" rel="noreferrer"
              style={{ padding:'28px 28px 28px 0', paddingLeft:i===0?0:28, borderRight:i<2?`1px solid ${BORDER}`:'none', textDecoration:'none', display:'block', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.65'}
              onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:900, letterSpacing:'4px', textTransform:'uppercase', color:NAVY, opacity:0.25, marginBottom:12 }}>{p.label}</div>
              <div style={{ fontFamily:'Playfair Display,serif', fontSize:15, fontStyle:'italic', color:NAVY, lineHeight:1.7, opacity:0.75 }}>"{p.quote}"</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Locations ────────────────────────────────────────────────
function HoursDropdown({ hours }) {
  const [open, setOpen] = useState(false)
  const status = getHoursStatus(hours)
  const today = new Date().getDay()
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  return (
    <div style={{ marginBottom:28 }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${BORDER}`, width:'100%' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:status.color, display:'inline-block', flexShrink:0 }}/>
          <span style={{ fontFamily:'DM Sans', fontSize:13, color:status.color, fontWeight:500 }}>{status.label}</span>
        </div>
        <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:MUTED }}>Hours {open?'↑':'↓'}</span>
      </button>
      {open && (
        <div style={{ paddingTop:2 }}>
          {hours.map((h,i)=>{
            const isToday = dayNames[today] === h.day
            return (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:`1px solid ${BORDER}` }}>
                <span style={{ fontFamily:'DM Sans', fontSize:13, color:isToday?NAVY:MUTED, fontWeight:isToday?600:400 }}>{h.day}</span>
                <span style={{ fontFamily:'DM Sans', fontSize:13, fontStyle:'italic', color:isToday?NAVY:(h.closed?STONE:MUTED) }}>{h.closed?'Closed':h.time}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function KpsLocations() {
  return (
    <section id="kps-locations" style={{ background:CREAM, borderBottom:`1px solid ${BORDER}` }}>
      <div style={{ maxWidth:SECTION_MAX, margin:'0 auto', padding:SECTION_PAD }} className="kps-inner">
        <div style={EYEBROW_STYLE}>Visit Us</div>
        <h2 style={{ ...H2_STYLE, marginBottom:48 }}>Two Houston Locations</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64 }} className="kps-two-col">
          {[BELLAIRE, MEMORIAL].map((loc,i)=>(
            <div key={i}>
              <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>{loc.name}</div>
              <h3 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(20px,2.5vw,30px)', fontWeight:400, fontStyle:'italic', color:NAVY, marginBottom:16 }}>KP's Kitchen</h3>
              <p style={{ fontFamily:'DM Sans', fontSize:14, color:MUTED, marginBottom:2, lineHeight:1.6 }}>{loc.address}</p>
              <a href={`tel:${loc.phone}`} style={{ fontFamily:'DM Sans', fontSize:14, color:MUTED, fontStyle:'italic', textDecoration:'none', display:'block', marginBottom:24, transition:'color 0.2s' }}
                onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>{loc.phone}</a>
              <HoursDropdown hours={loc.hours}/>
              <div style={{ display:'flex', gap:24 }}>
                <a href={loc.resy} target="_blank" rel="noreferrer"
                  style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:NAVY, textDecoration:'none', borderBottom:`1px solid ${NAVY}`, paddingBottom:3, transition:'opacity 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.opacity='0.5'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                  Reserve
                </a>
                <a href={loc.order} target="_blank" rel="noreferrer"
                  style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2.5px', textTransform:'uppercase', color:MUTED, textDecoration:'none', borderBottom:`1px solid ${BORDER}`, paddingBottom:3, transition:'color 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.color=NAVY} onMouseOut={e=>e.currentTarget.style.color=MUTED}>
                  Order Online
                </a>
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
    <footer style={{ background:NAVY, padding:'56px 64px 36px' }} className="kps-footer-outer">
      <div style={{ maxWidth:SECTION_MAX, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:56, marginBottom:40, paddingBottom:40, borderBottom:'1px solid rgba(255,255,255,0.08)' }} className="kps-footer-grid">
          <div>
            <img src={LOGO_WHITE} alt="KP's Kitchen" style={{ height:52, width:'auto', objectFit:'contain', marginBottom:14, opacity:0.85 }} onError={e=>e.target.style.display='none'}/>
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
        <button onClick={()=>document.getElementById('kps-locations')?.scrollIntoView({behavior:'smooth'})}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:NAVY, color:'#fff', border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </button>
        <button onClick={()=>document.getElementById('kps-locations')?.scrollIntoView({behavior:'smooth'})}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:`1px solid ${BORDER}` }}>
          Order
        </button>
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
  const [menuOpen, setMenuOpen] = useState(false)
  const { sections } = data

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', background:CREAM, color:NAVY, overflowX:'hidden' }}>
      <KpsNav activeLoc={activeLoc} setActiveLoc={setActiveLoc} />
      <KpsHero />
      <KpsAbout onMenuOpen={()=>setMenuOpen(true)} />
      <KpsMenu sections={sections} open={menuOpen} onClose={()=>setMenuOpen(false)}/>
      <KpsHappyHourAndPrivate activeLoc={activeLoc} />
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
          .kps-split{grid-template-columns:1fr!important}
          .kps-split-left{border-right:none!important;border-bottom:1px solid #E4E0D8!important;padding:48px 24px!important}
          .kps-inner{padding:48px 24px!important}
          .kps-two-col{grid-template-columns:1fr!important;gap:40px!important}
          .kps-three-col{grid-template-columns:1fr!important}
          .kps-footer-outer{padding:48px 24px 32px!important}
          .kps-footer-grid{grid-template-columns:1fr!important;gap:32px!important}
          nav{padding:0 24px!important}
        }
      `}</style>
    </div>
  )
}
