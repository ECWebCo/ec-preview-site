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
  phone: '(346) 240-2678',
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


// ─── Nav ──────────────────────────────────────────────────────
function KpsNav({ activeLoc, setActiveLoc, onMenuOpen, onPick }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > window.innerHeight - 100)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }
  const textColor = NAVY

  return (
    <>
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
          <button onClick={()=>onPick('order')} style={{ padding:'8px 18px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
            Order
          </button>
          <button onClick={()=>onPick('reserve')} style={{ padding:'8px 20px', background:NAVY, border:`1px solid ${NAVY}`, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
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
        <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:199, paddingTop:72, display:'flex', flexDirection:'column' }}>
          {[
            { label:'Menu', action: () => { setMenuOpen(false); onMenuOpen() } },
            { label:'Happy Hour', id:'kps-happyhour' },
            { label:'Private Dining', id:'kps-private' },
            { label:'Locations', id:'kps-locations' },
          ].map((item,i)=>(
            <button key={i}
              onClick={()=> item.action ? item.action() : scrollTo(item.id)}
              style={{ background:'none', border:'none', borderBottom:`1px solid ${BORDER}`, padding:'22px 32px', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.5'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              <span style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:NAVY }}>{item.label}</span>
              <span style={{ color:MUTED, fontSize:16, opacity:0.4 }}>→</span>
            </button>
          ))}
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
const HERO_PHOTOS = [
  'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2021,%202026,%2003_20_26%20PM.png',
  'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2021,%202026,%2003_20_31%20PM.png',
  'https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2021,%202026,%2003_20_36%20PM.png',
]

function KpsHero() {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c+1) % HERO_PHOTOS.length), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="kps-hero" style={{ height:'100vh', minHeight:600, position:'relative', overflow:'hidden', background:CREAM, paddingTop:72 }}>
      {HERO_PHOTOS.map((src,i) => (
        <img key={i} src={src} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'top center', opacity:i===current?1:0, transition:'opacity 1.2s ease' }}/>
      ))}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:160, background:'linear-gradient(to bottom, rgba(250,250,248,1) 0%, rgba(250,250,248,0.6) 50%, transparent 100%)', pointerEvents:'none' }}/>
      <div style={{ position:'relative', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none' }}>
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
const PILL_BTN = { background:'none', border:`1px solid ${NAVY}`, borderRadius:999, fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', padding:'11px 24px', transition:'all 0.2s' }

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


// ─── Shared slide photo ───────────────────────────────────────
const SLIDE_PHOTOS = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=85',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=85',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=900&q=85',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=85',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=85',
]

function PhotoSlide() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1) % SLIDE_PHOTOS.length), 4000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ padding:'0 48px', marginBottom:64 }}>
      <div style={{ position:'relative', maxWidth:640, margin:'0 auto' }}>
        {SLIDE_PHOTOS.map((src,i) => (
          <img key={i} src={src} alt="" style={{
            display: i===idx ? 'block' : 'none',
            width:'100%', height:420, objectFit:'cover', objectPosition:'center',
          }}/>
        ))}
      </div>
    </div>
  )
}

// ─── Menu data ────────────────────────────────────────────────
const SPECIALS = { name:'Specials', items:[
  { name:'Tuesday', description:'$12 Burger Day + Kids Eat Free (with adult purchase)' },
  { name:'Wednesday', description:'All Day Happy Hour + Prime Rib Night + $1 Red Wine' },
  { name:'Thursday', description:'Steak Night + $1 Red Wine + $15 Caymus / Veuve Clicquot' },
  { name:'Friday', description:'Fish & Chips Night + $1 Champagne' },
  { name:'Saturday', description:'Brunch + All Day Happy Hour' },
  { name:'Sunday', description:'Brunch + Fried Chicken Family Meal' },
]}

const BELLAIRE_MENU = [
  { name:'Dinner', link:'https://www.kps-kitchen.com/bellaire#our-menu', items:[
    { name:"KP's Double Cheeseburger", description:'Two smashed patties, American cheese, house sauce, brioche bun', price:'12' },
    { name:'Salmon', description:'Pan seared, seasonal vegetables, lemon butter', price:'28' },
    { name:'Mama Pauly\'s Meatballs', description:'Braised in San Marzano tomato, fresh ricotta, grilled bread', price:'15' },
    { name:'Chipotle Pimento Cheese Dip', description:'Served with grilled pita', price:'13' },
    { name:'White Truffle Devil Eggs', description:'House deviled eggs, truffle oil, paprika', price:'12' },
    { name:'Chicken Fried Artichoke Hearts', description:'Buttermilk battered, house ranch', price:'14' },
    { name:'Parmesan Truffle Fries', description:'Shoestring fries, truffle oil, parmesan', price:'10' },
  ]},
  { name:'Brunch', link:'https://www.kps-kitchen.com/bellaire#our-menu', items:[
    { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
    { name:'French Toast', description:'Brioche, fresh berries, maple syrup', price:'14' },
    { name:'Single Cheeseburger', description:'Classic cheeseburger, lettuce, tomato, pickles', price:'13' },
    { name:'Buttermilk Popcorn Chicken Bites', description:'Served with honey sriracha dipping sauce', price:'13' },
  ]},
  { name:'Happy Hour', link:'https://www.kps-kitchen.com/bellaire#our-menu', note:'Tue – Fri 3–6PM · 7 Drinks · 7 Bites · $7 each', items:[
    { name:'Gossip Girl Espresso Martini', description:'Katz espresso, sake-based vodka with a twist', price:'7' },
    { name:'Sour Cherry Lemon Drop', description:'House made cherry-vanilla', price:'7' },
    { name:'Moscow Mule', description:'Ginger laced, sake-based vodka', price:'7' },
    { name:'Les Allies Brut, FR', description:'Dry, crispy, mineral', price:'7' },
    { name:'Yealands Sauvignon Blanc', description:'Dry, lime zest, mango, dill', price:'7' },
    { name:'Man Family Chardonnay', description:'Pineapple, peaches, light oak', price:'7' },
    { name:'Padrillos Malbec, AR', description:'Ripe plum, leather, pepper', price:'7' },
    { name:'Mama Pauly\'s Meatballs', description:'Bar snack', price:'7' },
    { name:'Chipotle Pimento Cheese Dip', description:'Bar snack', price:'7' },
    { name:'Single Cheeseburger', description:'Bar snack', price:'7' },
    { name:'Parmesan Truffle Fries', description:'Bar snack', price:'7' },
  ]},
  SPECIALS,
]

const MEMORIAL_MENU = [
  { name:'Dinner', link:'https://www.kps-kitchen.com/spring-valley#our-menu', items:[
    { name:"KP's Double Cheeseburger", description:'Two smashed patties, American cheese, house sauce, brioche bun', price:'12' },
    { name:'Salmon', description:'Pan seared, seasonal vegetables, lemon butter', price:'28' },
    { name:'Mama Pauly\'s Meatballs', description:'Braised in San Marzano tomato, fresh ricotta, grilled bread', price:'15' },
    { name:'Chipotle Pimento Cheese Dip', description:'Served with grilled pita', price:'13' },
    { name:'White Truffle Devil Eggs', description:'House deviled eggs, truffle oil, paprika', price:'12' },
    { name:'Chicken Fried Artichoke Hearts', description:'Buttermilk battered, house ranch', price:'14' },
    { name:'Parmesan Truffle Fries', description:'Shoestring fries, truffle oil, parmesan', price:'10' },
  ]},
  { name:'Brunch', link:'https://www.kps-kitchen.com/spring-valley#our-menu', items:[
    { name:'Shrimp & Grits', description:'Stone-ground grits, Gulf shrimp, tasso gravy', price:'22' },
    { name:'French Toast', description:'Brioche, fresh berries, maple syrup', price:'14' },
    { name:'Single Cheeseburger', description:'Classic cheeseburger, lettuce, tomato, pickles', price:'13' },
    { name:'Buttermilk Popcorn Chicken Bites', description:'Served with honey sriracha dipping sauce', price:'13' },
  ]},
  { name:'Happy Hour', link:'https://www.kps-kitchen.com/spring-valley#our-menu', note:'Tue – Sun 3–6PM · 7 Drinks · 7 Bites · $7 each', items:[
    { name:'Grey Goose Martini', description:'You call it · +$2', price:'7' },
    { name:'Woodford Reserve Old Fashion', description:'+$2', price:'7' },
    { name:'Gossip Girl Espresso Martini', description:'Katz espresso, vodka, Baileys', price:'7' },
    { name:'Les Allies Brut, FR', description:'Dry, crispy, mineral', price:'7' },
    { name:'Yealands Sauvignon Blanc', description:'Dry, lime zest, mango, dill', price:'7' },
    { name:'Man Family Chardonnay', description:'Pineapple, peaches, light oak', price:'7' },
    { name:'Padrillos Malbec, AR', description:'Ripe plum, leather, pepper', price:'7' },
    { name:'Bonanza by Caymus Cabernet', description:'California', price:'7' },
    { name:'Mama Pauly\'s Meatballs', description:'Bar snack', price:'7' },
    { name:'Chipotle Pimento Cheese Dip', description:'Bar snack', price:'7' },
    { name:'Single Cheeseburger', description:'Bar snack', price:'7' },
    { name:'Parmesan Truffle Fries', description:'Bar snack', price:'7' },
  ]},
  SPECIALS,
]

// ─── Menu Modal — centered popup, vertical tabs ───────────────
function MenuModal({ sections, activeLoc, initialTab, onClose }) {
  const display = sections?.length ? sections
    : activeLoc?.name === 'Bellaire' ? BELLAIRE_MENU : MEMORIAL_MENU
  const initIdx = Math.max(0, display.findIndex(s => s.name === initialTab))
  const [activeTab, setActiveTab] = useState(initIdx)
  const [openTab, setOpenTab] = useState(initIdx) // mobile accordion
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])

  const active = display[activeTab] || display[0]

  const ItemList = ({ items, note, link }) => (
    <div>
      {note && <div style={{ padding:'10px 0 14px', fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD }}>{note}</div>}
      {items.map((item,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:NAVY, marginBottom:item.description?3:0 }}>{item.name}</div>
            {item.description && <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:MUTED, fontStyle:'italic', lineHeight:1.5 }}>{item.description}</p>}
          </div>
          {item.price && <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, flexShrink:0, fontWeight:600 }}>${Number(item.price).toFixed(0)}</div>}
        </div>
      ))}
      {link && <a href={link} target="_blank" rel="noreferrer" style={{ display:'block', marginTop:20, fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, textDecoration:'none', borderBottom:`1px solid ${NAVY}`, paddingBottom:3, width:'fit-content' }}>View Full Menu →</a>}
    </div>
  )

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <div style={{ position:'relative', background:'#fff', width:'min(780px,95vw)', maxHeight:'85vh', display:'flex', flexDirection:'column', animation:'fadeUp 0.25s ease' }}>

        {/* Header */}
        <div style={{ padding:'24px 28px', borderBottom:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-between', alignItems:'center', flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, opacity:0.6, marginBottom:2 }}>Our Menus</div>
            <div style={{ fontFamily:'DM Sans', fontSize:11, color:MUTED, opacity:0.6 }}>{activeLoc?.name} Location</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', fontSize:22, color:MUTED, lineHeight:1 }}>✕</button>
        </div>

        {/* Desktop: sidebar + content */}
        {!isMobile && (
          <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
            {/* Vertical tab sidebar */}
            <div style={{ width:160, flexShrink:0, borderRight:`1px solid ${BORDER}`, display:'flex', flexDirection:'column', padding:'16px 0' }}>
              {display.map((s,i)=>(
                <button key={i} onClick={()=>setActiveTab(i)}
                  style={{ padding:'14px 24px', border:'none', background:activeTab===i?WARM:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', cursor:'pointer', color:activeTab===i?NAVY:MUTED, textAlign:'left', transition:'all 0.15s', borderLeft:activeTab===i?`3px solid ${NAVY}`:'3px solid transparent' }}>
                  {s.name}
                </button>
              ))}
            </div>
            {/* Content */}
            <div style={{ flex:1, overflowY:'auto', padding:'24px 32px 40px' }}>
              <ItemList items={active.items} note={active.note} link={active.link}/>
            </div>
          </div>
        )}

        {/* Mobile: accordion */}
        {isMobile && (
          <div style={{ flex:1, overflowY:'auto' }}>
            {display.map((s,i)=>(
              <div key={i}>
                <button onClick={()=>setOpenTab(openTab===i?null:i)}
                  style={{ width:'100%', padding:'18px 24px', background:'none', border:'none', borderBottom:`1px solid ${BORDER}`, display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }}>
                  <span style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY }}>{s.name}</span>
                  <span style={{ color:MUTED, fontSize:20, transition:'transform 0.2s', display:'inline-block', transform:openTab===i?'rotate(45deg)':'none' }}>+</span>
                </button>
                {openTab===i && (
                  <div style={{ padding:'8px 24px 24px' }}>
                    <ItemList items={s.items} note={s.note} link={s.link}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
// ─── Specials Popup ───────────────────────────────────────────
const SPECIALS_LIST = [
  { day:'Tuesday', deal:'$12 Burger Day + Kids Eat Free' },
  { day:'Wednesday', deal:'All Day Happy Hour + Prime Rib Night + $1 Red Wine' },
  { day:'Thursday', deal:'Steak Night + $1 Red Wine + $15 Caymus / Veuve Clicquot' },
  { day:'Friday', deal:'Fish & Chips Night + $1 Champagne' },
  { day:'Saturday', deal:'Brunch + All Day Happy Hour' },
  { day:'Sunday', deal:'Brunch + Fried Chicken Family Meal' },
]

function SpecialsPopup({ onClose, onReserve }) {
  const today = new Date().getDay() // 0=Sun
  const dayMap = { 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday', 0:'Sunday' }
  const todayName = dayMap[today]
  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])
  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.55)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <div style={{ position:'relative', background:'#fff', width:'min(520px,92vw)', maxHeight:'90vh', overflowY:'auto', animation:'fadeUp 0.3s ease' }}>
        <div style={{ padding:'32px 32px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:GOLD, marginBottom:8 }}>Weekly Specials</div>
            <h2 style={{ fontFamily:'DM Sans', fontSize:'clamp(18px,3vw,26px)', fontWeight:700, letterSpacing:'5px', textTransform:'uppercase', color:NAVY, lineHeight:1.2 }}>Deals You Don't Want to Miss</h2>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:MUTED, lineHeight:1, flexShrink:0, marginLeft:16 }}>✕</button>
        </div>
        <div style={{ padding:'24px 32px 32px' }}>
          {SPECIALS_LIST.map((s,i)=>(
            <div key={i} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:`1px solid ${BORDER}`, alignItems:'flex-start' }}>
              <div style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:s.day===todayName?GOLD:NAVY, minWidth:90, paddingTop:2, opacity:s.day===todayName?1:0.7 }}>
                {s.day}
                {s.day===todayName && <div style={{ fontSize:9, letterSpacing:'1px', color:GOLD, marginTop:2 }}>TODAY</div>}
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, color:NAVY, lineHeight:1.7, fontStyle:'italic' }}>{s.deal}</div>
            </div>
          ))}
          <button onClick={onReserve}
            style={{ ...PILL_BTN, marginTop:28, width:'100%', justifyContent:'center', display:'flex' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
            Reserve a Table
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Location Picker Modal ────────────────────────────────────
function LocPicker({ type, onClose }) {
  const locs = [BELLAIRE, MEMORIAL]
  const href = loc => type === 'reserve' || type === 'happyhour' ? loc.resy : loc.order
  return (
    <div style={{ position:'fixed', inset:0, zIndex:600, display:'flex', alignItems:'center', justifyContent:'center' }} onClick={onClose}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }}/>
      <div style={{ position:'relative', background:'#fff', width:'min(400px,90vw)', padding:'36px 32px' }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED }}>
            {type==='reserve'||type==='happyhour' ? 'Reserve a Table' : 'Order Online'}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:18, cursor:'pointer', color:MUTED }}>✕</button>
        </div>
        {locs.map(loc => (
          <a key={loc.name} href={href(loc)} target="_blank" rel="noreferrer"
            style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderTop:`1px solid ${BORDER}`, textDecoration:'none', transition:'opacity 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.6'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            <div>
              <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:NAVY, marginBottom:2 }}>{loc.name}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:13, color:MUTED, fontStyle:'italic' }}>{loc.address.split(',')[0]}</div>
              {type==='happyhour' && <div style={{ fontFamily:'DM Sans', fontSize:10, color:MUTED, marginTop:4, letterSpacing:'1px' }}>Mon – Fri · 4:00 – 6:00 PM</div>}
            </div>
            <span style={{ fontFamily:'DM Sans', fontSize:11, color:NAVY, fontWeight:600, letterSpacing:'2px' }}>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ─── Row 1: About (left) | Order Online photo (right) ────────
function KpsAbout({ onMenuOpen, onPick, onSpecials }) {
  return (
    <section style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text">
          <div style={{ fontFamily:'DM Sans', fontSize:10, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:20, opacity:0.6 }}>Houston, Texas</div>
          <h1 style={{ fontFamily:'DM Sans', fontSize:'clamp(15px,2vw,20px)', fontWeight:700, letterSpacing:'7px', textTransform:'uppercase', color:NAVY, marginBottom:24 }}>KP's Kitchen & Bar</h1>
          <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:NAVY, lineHeight:1.9, marginBottom:36, opacity:0.85, maxWidth:380 }}>
            Upscale American comfort food served with genuine neighborhood hospitality. From scratch-made classics and thoughtfully crafted cocktails — KP's Kitchen has become a Houston institution for those who want an elevated dining experience without the pretense.
          </p>
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={()=>onPick('reserve')} style={PILL_BTN}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              Reserve
            </button>
            <button onClick={onMenuOpen} style={PILL_BTN}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              View Menus
            </button>
            <button onClick={onSpecials} style={{...PILL_BTN, borderColor:GOLD, color:GOLD}}
              onMouseOver={e=>{e.currentTarget.style.background=GOLD;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=GOLD}}>
              Specials
            </button>
          </div>
        </div>
        <PaddedImage src="https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/burger.avif" label="Order Online" sub="Curbside & Delivery" cta="Order Now" onClick={()=>onPick('order')}/>
      </div>
    </section>
  )
}

// ─── Row 2: Menus (left) | Locations (right) ─────────────────
function KpsHoursSection({ onMenuOpen, onPick }) {
  const MENU_TABS = ['Lunch','Brunch','Happy Hour','Dinner','Specials']
  return (
    <section id="kps-menu" style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split kps-photo-first">
        <PaddedImage src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&q=85" label="Happy Hour" sub="Tue – Fri 3–6PM · Both Locations" cta="Reserve a Table" onClick={()=>onPick('happyhour')}/>
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text">
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'5px', textTransform:'uppercase', color:MUTED, marginBottom:36, opacity:0.6 }}>Menus</div>
          <div style={{ width:'100%', maxWidth:320 }}>
            {[
              { label:'Lunch', sub:'Tue – Fri · 11:00 AM – 4:00 PM', tab:'Lunch' },
              { label:'Brunch', sub:'Sat – Sun · 10:00 AM – 3:00 PM', tab:'Brunch' },
              { label:'Happy Hour', sub:'Tue – Fri 3–6PM · $7 for 7', tab:'Happy Hour' },
              { label:'Dinner', sub:'Tue – Sun · 5:00 PM – close', tab:'Dinner' },
              { label:'Specials', sub:'Daily deals you don\'t want to miss', tab:'Specials' },
            ].map((h,i)=>(
              <button key={i} onClick={()=>onMenuOpen(null, h.tab)}
                style={{ background:'none', border:'none', cursor:'pointer', padding:'14px 0', width:'100%', textAlign:'center', display:'block', transition:'opacity 0.2s' }}
                onMouseOver={e=>e.currentTarget.style.opacity='0.5'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:NAVY, marginBottom:3 }}>{h.label}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:MUTED, fontStyle:'italic' }}>{h.sub}</div>
              </button>
            ))}
          </div>
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
    <div style={{ marginBottom:24 }}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:'10px 0', width:'100%' }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:status.color, flexShrink:0, display:'inline-block' }}/>
        <span style={{ fontFamily:'DM Sans', fontSize:13, color:status.color, fontWeight:500 }}>{status.label}</span>
        <span style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:MUTED, marginLeft:8 }}>Hours {open?'↑':'↓'}</span>
      </button>
      {open && hours.map((h,i)=>{
        const isToday = dayNames[today]===h.day
        return (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0' }}>
            <span style={{ fontFamily:'DM Sans', fontSize:13, color:isToday?NAVY:MUTED, fontWeight:isToday?600:400 }}>{h.day}</span>
            <span style={{ fontFamily:'DM Sans', fontSize:13, fontStyle:'italic', color:isToday?NAVY:(h.closed?STONE:MUTED) }}>{h.closed?'Closed':h.time}</span>
          </div>
        )
      })}
    </div>
  )
}

function KpsLocations({ onEventsOpen, onMenuOpen, onPick }) {
  return (
    <section id="kps-locations" style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        {/* Left — photo, fills full height */}
        <div id="kps-private" style={{ position:'relative', overflow:'hidden', minHeight:560 }}>
          <img
            src="https://snthchxrqjtriorgvakk.supabase.co/storage/v1/object/public/restaurant-photos/ChatGPT%20Image%20Apr%2020,%202026,%2009_56_12%20PM.png"
            alt="Private Dining"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center', transition:'transform 0.7s ease' }}
            onMouseOver={e=>e.target.style.transform='scale(1.03)'}
            onMouseOut={e=>e.target.style.transform='scale(1)'}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)' }}/>
          <div style={{ position:'absolute', bottom:28, left:28, right:28, cursor:'pointer' }} onClick={onEventsOpen}>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'rgba(255,255,255,0.65)', marginBottom:6 }}>Office Lunches · Client Meetings · Celebrations</div>
            <div style={{ fontFamily:'DM Sans', fontSize:'clamp(14px,2vw,20px)', fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:'#fff', marginBottom:10 }}>Private Dining</div>
            <div style={{ fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.5)', display:'inline-block', paddingBottom:2 }}>Inquire About Events →</div>
          </div>
        </div>

        {/* Right — location info */}
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text">
          <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'5px', textTransform:'uppercase', color:MUTED, marginBottom:48, opacity:0.6 }}>Visit Us</div>
          <div style={{ display:'flex', flexDirection:'column', gap:48, width:'100%', maxWidth:340 }}>
            {[BELLAIRE, MEMORIAL].map((loc,i)=>(
              <div key={i}>
                <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:8, opacity:0.6 }}>{loc.name}</div>
                <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:NAVY, lineHeight:1.8, marginBottom:2, fontStyle:'italic' }}>{loc.address}</p>
                <a href={`tel:${loc.phone}`} style={{ fontFamily:'Georgia,serif', fontSize:14, color:MUTED, fontStyle:'italic', textDecoration:'none', display:'block', marginBottom:12, transition:'color 0.2s' }}
                  onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>{loc.phone}</a>
                <HoursDropdown hours={loc.hours}/>
                <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
                  <button onClick={()=>onPick('reserve')} style={PILL_BTN}
                    onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                    onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>Reserve</button>
                  <button onClick={()=>onPick('order')} style={{...PILL_BTN, color:MUTED, borderColor:MUTED}}
                    onMouseOver={e=>{e.currentTarget.style.background=MUTED;e.currentTarget.style.color='#fff'}}
                    onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=MUTED}}>Order</button>
                  <button onClick={()=>onMenuOpen(loc)} style={{...PILL_BTN, color:MUTED, borderColor:MUTED}}
                    onMouseOver={e=>{e.currentTarget.style.background=MUTED;e.currentTarget.style.color='#fff'}}
                    onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=MUTED}}>Menu</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Events Form Modal ────────────────────────────────────────
function EventsModal({ onClose }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', guests:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = k => e => setForm(f=>({...f,[k]:e.target.value}))

  const handleSubmit = () => {
    const body = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ADate: ${form.date}%0AGuests: ${form.guests}%0AMessage: ${form.message}`
    window.location.href = `mailto:events@kps-kitchen.com?subject=Private Event Inquiry&body=${body}`
    setSent(true)
  }

  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])

  const input = { width:'100%', fontFamily:'Georgia,serif', fontSize:14, color:NAVY, background:'#fff', border:'none', borderBottom:`1px solid ${BORDER}`, padding:'10px 0', outline:'none', marginBottom:20 }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)' }} onClick={onClose}/>
      <div style={{ position:'relative', background:'#fff', width:'min(540px,100vw)', maxHeight:'90vh', overflowY:'auto', padding:'48px 40px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32 }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:8 }}>Entertain</div>
            <h2 style={{ fontFamily:'DM Sans', fontSize:'clamp(16px,2vw,20px)', fontWeight:700, letterSpacing:'5px', textTransform:'uppercase', color:NAVY }}>Private Events & Catering</h2>
            <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:MUTED, fontStyle:'italic', marginTop:8, lineHeight:1.6 }}>Office lunches, client meetings, celebrations & holiday gatherings</p>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:20, cursor:'pointer', color:MUTED, lineHeight:1, flexShrink:0 }}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign:'center', padding:'24px 0' }}>
            <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, marginBottom:12 }}>Thank You</div>
            <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:MUTED, fontStyle:'italic', lineHeight:1.8 }}>
              Your inquiry has been sent. We'll be in touch shortly to discuss your event.
            </p>
            <button onClick={onClose} style={{ marginTop:24, background:'none', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', borderBottom:`1px solid ${NAVY}`, paddingBottom:3 }}>Close</button>
          </div>
        ) : (
          <>
            <input style={input} placeholder="Your Name" value={form.name} onChange={set('name')}/>
            <input style={input} placeholder="Email Address" value={form.email} onChange={set('email')}/>
            <input style={input} placeholder="Phone Number" value={form.phone} onChange={set('phone')}/>
            <input style={input} placeholder="Event Date" value={form.date} onChange={set('date')}/>
            <input style={input} placeholder="Number of Guests" value={form.guests} onChange={set('guests')}/>
            <textarea style={{...input, resize:'vertical', minHeight:80, marginBottom:32}} placeholder="Tell us about your event" value={form.message} onChange={set('message')}/>
            <button onClick={handleSubmit}
              style={{ width:'100%', padding:'16px', background:NAVY, color:'#fff', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', cursor:'pointer', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              Send Inquiry
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function KpsFooter() {
  return (
    <footer style={{ background:NAVY, padding:'56px 48px 40px', textAlign:'center' }}>
      <div style={{ maxWidth:640, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', marginBottom:16 }}>
          {[
            ['5427 Bissonnet St, Bellaire TX', `https://maps.google.com?q=${encodeURIComponent(BELLAIRE.address)}`],
            ['8412 I-10 Frontage Rd, Houston TX', `https://maps.google.com?q=${encodeURIComponent(MEMORIAL.address)}`],
          ].map(([label, href], i) => (
            <a key={i} href={href} target="_blank" rel="noreferrer"
              style={{ fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.5)', fontStyle:'italic', textDecoration:'none', transition:'color 0.2s' }}
              onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.5)'}>
              {label}
            </a>
          ))}
        </div>
        <a href={`tel:${BELLAIRE.phone}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.5)', fontStyle:'italic', textDecoration:'none', marginBottom:4, transition:'color 0.2s' }}
          onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.5)'}>Bellaire · {BELLAIRE.phone}</a>
        <a href={`tel:${MEMORIAL.phone}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.5)', fontStyle:'italic', textDecoration:'none', marginBottom:6, transition:'color 0.2s' }}
          onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.5)'}>Memorial · {MEMORIAL.phone}</a>
        <a href="mailto:events@kps-kitchen.com" style={{ display:'block', fontFamily:'Georgia,serif', fontSize:13, color:'rgba(255,255,255,0.5)', fontStyle:'italic', textDecoration:'none', marginBottom:36, transition:'color 0.2s' }}
          onMouseOver={e=>e.target.style.color='#fff'} onMouseOut={e=>e.target.style.color='rgba(255,255,255,0.5)'}>events@kps-kitchen.com</a>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:24, fontFamily:'DM Sans', fontSize:11, color:'rgba(255,255,255,0.25)', letterSpacing:'1px' }}>
          © {new Date().getFullYear()} KP's Kitchen & Bar · <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.25)', textDecoration:'none' }}>Website by EC Web Co</a>
        </div>
      </div>
    </footer>
  )
}

// ─── Sticky Bar ───────────────────────────────────────────────
function KpsStickyBar({ activeLoc, setActiveLoc, onPick }) {
  const [callPicker, setCallPicker] = useState(false)

  return (
    <>
      {callPicker && (
        <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'flex-end' }} onClick={()=>setCallPicker(false)}>
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.4)' }}/>
          <div style={{ position:'relative', width:'100%', background:'#fff', paddingBottom:'env(safe-area-inset-bottom)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ padding:'20px 24px 8px', fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:MUTED }}>Choose a Location</div>
            {[BELLAIRE, MEMORIAL].map(loc=>(
              <a key={loc.name} href={`tel:${loc.phone}`}
                style={{ display:'flex', justifyContent:'space-between', padding:'16px 24px', borderTop:`1px solid ${BORDER}`, textDecoration:'none', background:'#fff' }}>
                <div>
                  <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, color:NAVY, marginBottom:2 }}>{loc.name}</div>
                  <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED }}>{loc.phone}</div>
                </div>
                <span style={{ fontFamily:'DM Sans', fontSize:12, color:NAVY, alignSelf:'center' }}>Call →</span>
              </a>
            ))}
          </div>
        </div>
      )}
      <div className="kps-sticky" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, display:'none', background:'#fff', borderTop:`1px solid ${BORDER}`, paddingBottom:'env(safe-area-inset-bottom)' }}>
        <button onClick={()=>onPick('reserve')}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:NAVY, color:'#fff', border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </button>
        <button onClick={()=>onPick('order')}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:`1px solid ${BORDER}` }}>
          Order
        </button>
        <button onClick={()=>setCallPicker(true)}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' }}>
          Call
        </button>
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
  const [menuLoc, setMenuLoc] = useState(MEMORIAL)
  const [menuTab, setMenuTab] = useState(null)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [picker, setPicker] = useState(null)
  const [specialsOpen, setSpecialsOpen] = useState(false)
  const { sections } = data

  // Auto-show specials popup after 2 seconds on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem('kps-specials-seen')
    if (!seen) {
      const t = setTimeout(() => { setSpecialsOpen(true); sessionStorage.setItem('kps-specials-seen','1') }, 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const openMenu = (loc, tab) => { setMenuLoc(loc || activeLoc); setMenuTab(tab || null); setMenuOpen(true) }

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', background:'#fff', color:NAVY, overflowX:'hidden' }}>
      <KpsNav activeLoc={activeLoc} setActiveLoc={setActiveLoc} onMenuOpen={()=>openMenu()} onPick={setPicker}/>
      <KpsHero />
      <KpsAbout onMenuOpen={()=>openMenu()} onPick={setPicker} onSpecials={()=>setSpecialsOpen(true)} />
      <KpsLocations onEventsOpen={()=>setEventsOpen(true)} onMenuOpen={openMenu} onPick={setPicker} />
      <KpsHoursSection onMenuOpen={(loc,tab)=>openMenu(loc,tab)} onPick={setPicker} />
      <KpsFooter />
      <KpsStickyBar activeLoc={activeLoc} setActiveLoc={setActiveLoc} onPick={setPicker} />
      {menuOpen && <MenuModal sections={sections} activeLoc={menuLoc} initialTab={menuTab} onClose={()=>setMenuOpen(false)}/>}
      {eventsOpen && <EventsModal onClose={()=>setEventsOpen(false)}/>}
      {picker && <LocPicker type={picker} onClose={()=>setPicker(null)}/>}
      {specialsOpen && <SpecialsPopup onClose={()=>setSpecialsOpen(false)} onReserve={()=>{ setSpecialsOpen(false); setPicker('reserve') }}/>}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        img{display:block;max-width:100%}
        @media(max-width:768px){
          .kps-split{grid-template-columns:1fr!important}
          .kps-split-text{padding:48px 24px!important}
          .kps-hero{height:75vh!important;padding-top:0!important}
          nav{padding:0 24px!important}
          .kps-photo-first .kps-split-text{order:1}
          .kps-photo-first .kps-padded-img{order:2}
        }
      `}</style>
    </div>
  )
}
