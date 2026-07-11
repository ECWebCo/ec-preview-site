import { useState, useEffect } from 'react'

const NAVY   = '#1B2B4B'
const CREAM  = '#FAFAF8'
const WARM   = '#F4F1EB'
const STONE  = '#E8E4DC'
const GOLD   = '#C9A84C'
const MUTED  = '#8A8278'
const BORDER = '#E4E0D8'
const RUST   = '#C4622D'

const LOGO_WHITE = '/kps/logo-white.png'
const LOGO_BLUE  = '/kps/logo-blue.png'
const PATTERN_URL = '/kps/pattern.jpg'

const MEMORIAL = {
  name: 'Memorial',
  address: '8412 Interstate 10 Frontage Rd #350, Houston, TX 77024',
  phone: '(713) 677-0921',
  email: 'events@kps-kitchen.com',
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

// ─── Design system ────────────────────────────────────────────
const EYEBROW_STYLE = { fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:14 }
const H2_STYLE = { fontFamily:'Playfair Display,serif', fontSize:'clamp(26px,3.5vw,42px)', fontWeight:400, fontStyle:'italic', color:NAVY, lineHeight:1.15 }
const PILL_BTN = { background:'none', border:`1px solid ${NAVY}`, borderRadius:999, fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, cursor:'pointer', padding:'11px 24px', transition:'all 0.2s' }
const SOLID_BTN = { background:NAVY, border:`1px solid ${NAVY}`, borderRadius:999, fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#fff', cursor:'pointer', padding:'12px 26px', transition:'opacity 0.2s' }

const PRESS_ITEMS = [
  { label:'EATER', quote:"One of Houston's best hidden gem restaurants.", url:'https://houston.eater.com/maps/best-hidden-gem-underrated-restaurants-houston' },
  { label:'BIZ JOURNAL', quote:"KP's Kitchen expands to a second Houston location.", url:'https://www.bizjournals.com/houston/news/2024/04/05/kps-kitchen-second-location-bellaire.html' },
  { label:'SHOUTOUT HTX', quote:'Heartfelt service meets culinary excellence.', url:'https://shoutouthtx.com/meet-kerry-pauly-owner-kps-kitchen/' },
]

// ─── Menu data (lunch & dinner) ───────────────────────────────
const MEMORIAL_MENU = [
  { name:'Starters', items:[
    { name:'Cheese & Charcuterie Plate*', description:'Houston Dairymaids cheeses and charcuterie, fruit, nuts and toasted crostini', price:'19' },
    { name:'Mama Pauly\'s Meatballs', description:'All beef meatballs, marinara and garlic bread', price:'16' },
    { name:'Popcorn Chicken Bites', price:'12' },
    { name:'Third-Coast Crab Cake*', price:'23' },
    { name:'Pear & Hazelnut Burrata', price:'16' },
    { name:"KP's Wicked Wings", description:'Buffalo, hot honey, bbq, lemon pepper', price:'12' },
    { name:'Chipotle Pimento Cheese Dip', description:'Crostinis', price:'12' },
    { name:'Spinach & Artichoke Dip', price:'14' },
    { name:'White Truffle Devil Eggs*', description:'Chips', price:'15' },
    { name:'Crispy Artichoke Hearts', price:'12' },
  ]},
  { name:'Soup & Salads', note:'Add a protein: grilled chicken $6 · chicken tenders (2) $6 · grilled salmon $10', items:[
    { name:'Simple House Salad', description:'Mixed greens, carrots, cucumbers and herb vinaigrette', price:'7' },
    { name:'Classic Caesar*', description:'Chopped romaine, Caesar dressing, rustic croutons, parmesan', price:'14' },
    { name:'Farro Salad', description:'Mixed greens, crispy artichokes, grapes, and herb vinaigrette', price:'16' },
    { name:'Cobb Salad*', description:'Blue cheese, avocado, egg, roasted chicken, ham, bacon', price:'20' },
    { name:'Crunchy Asian Salad*', description:'Mixed greens, wontons, snow peas, sprouts, sesame seeds', price:'16' },
  ]},
  { name:'Sides', note:'$12 each', items:[
    { name:"'Elote' Mac N Cheese", description:'Cheesy mac loaded with corn, chile-lime and cilantro. A Mexican twist.' },
    { name:'Fried Brussels Sprouts', description:'Fish sauce caramel' },
    { name:'Crispy Cauliflower', description:'Marcona almonds, currants, basil' },
    { name:'Braised Red Cabbage', description:'Goat cheese' },
    { name:'Truffle-Parmesan Fries' },
    { name:'Beans | Greens | Corn', description:'Fresh kale, sweet corn, and butter beans finished with fennel and rosemary' },
    { name:'Potatoes Au Gratin' },
    { name:'Market Veggie Medley', description:'Roasted broccoli, carrots and cauliflower with herb butter' },
  ]},
  { name:'Handhelds', items:[
    { name:"KP's Bacon Double Cheeseburger", description:'American cheese, dijonaise & brioche bun', price:'17' },
    { name:'Sliders & Fries', description:'Pick two: classic burger, Italian meatball, hot chicken or steak sandwich (+$1)', price:'14' },
    { name:'Veggie Burger', description:'Homemade veggie burger, red pepper aioli, lettuce, tomato, pickle, onions and toasted brioche', price:'16' },
    { name:'Hot Chicken Sandwich', description:'Hot honey & ranch, coleslaw, on a brioche bun', price:'17' },
    { name:'The Prime Drip Steak Sandwich*', description:'Shaved prime rib, Monterey Jack, red pepper aioli, & house made au jus', price:'23' },
    { name:'Club Sandwich', description:'Ham, turkey and bacon with basil aioli, tomato and dueling cheeses', price:'19' },
  ]},
  { name:'Fire Grill Features', items:[
    { name:"Today's Catch*", description:'Simply grilled and served over a savory succotash of sweet corn, gigante beans, and kale', price:'29' },
    { name:'Twelve Hour Ribs', description:'Hand cut fries and slaw', price:'28' },
    { name:'Grilled Salmon Plate*', description:'Atlantic Salmon, chimichurri, hazelnut vinegar, roasted veggies and pea puree', price:'26' },
    { name:"Papa Fred's Pork Chop", description:'Braised red cabbage, mashed potatoes, and apricot glaze', price:'32' },
    { name:'Steak Feature*', description:'Premium steak, expertly grilled and paired with gratin potatoes and grilled asparagus', price:'MKT' },
  ]},
  { name:'House Specialties', items:[
    { name:'Rigatoni Bolognese', description:'100% beef bolognese with tomatoes, red wine, rigatoni and parmigiano reggiano', price:'26' },
    { name:'Rosemary-Lemon Chicken', description:'Roasted half chicken over orzo, spinach and mushrooms', price:'26' },
    { name:"Crispy Sweet n' Sour Shrimp", description:'Served with fries, slaw and ranch', price:'26' },
    { name:'Buttermilk Chicken Platter', description:'Hand cut fries and ranch', price:'19' },
    { name:'Butternut & Chickpea Masala', description:'Indian spices, tomatoes, and roasted butternut squash, served with basmati rice', price:'21' },
  ]},
  { name:'Lunch', note:'Available 11 – 3, weekdays', items:[
    { name:'Seasonal Quiche*', description:'What is chef cooking in the kitchen? Order and find out. Served with house salad', price:'16' },
    { name:"KP's 'One & Done' Burger", description:'Single patty burger, American cheese, bacon, Dijonnaise & fries', price:'12' },
    { name:'Soup & Salad', description:'Soup of the day and your choice of house or caesar salad', price:'12' },
    { name:'Grilled Salmon Plate*', description:'Grilled salmon filet, sweet peas and chimichurri, market veggies', price:'20' },
    { name:'Hot Chicken Sandwich', description:'Crispy chicken breast, draped in hot honey with slaw, ranch & chips', price:'16' },
    { name:'Grilled Chicken & Veggies', description:'Herb grilled chicken breast on a bed of seasonal market fresh veggies', price:'16' },
  ]},
  { name:'Kids', note:'$10 each', items:[
    { name:'Cheeseburger', price:'10' },
    { name:'Chicken Tenders', price:'10' },
    { name:'Mac and Cheese and Corn', price:'10' },
    { name:'Grilled Cheese | Chips', price:'10' },
    { name:'Butter Pasta', price:'10' },
  ]},
]

// Menu-wide notes shown at the foot of the /menu page
const MENU_NOTES = [
  'All of our food is made from scratch. Some items will have limited availability. If you have allergies, please alert us — not all ingredients are listed. A 20% gratuity is added to parties of six or more.',
  '*Consuming raw or undercooked meat, seafood or eggs may increase your risk of foodborne illness.',
]

// Happy Hour is a separate menu with its own page.
const HAPPY_HOUR = { name:'Happy Hour', note:'Tue – Sun 3–6PM · 7 Drinks · 7 Bites · $7 each', items:[
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
] }

const SPECIALS_LIST = [
  { day:'Tuesday', deal:'$12 Burger Day + Kids Eat Free' },
  { day:'Wednesday', deal:'All Day Happy Hour + Prime Rib Night + $1 Red Wine' },
  { day:'Thursday', deal:'Steak Night + $1 Red Wine + $15 Caymus / Veuve Clicquot' },
  { day:'Friday', deal:'Fish & Chips Night + $1 Champagne' },
  { day:'Saturday', deal:'Brunch + All Day Happy Hour' },
  { day:'Sunday', deal:'Brunch + Fried Chicken Family Meal' },
]

const PROMO = {
  offers: [
    { icon:'🎁', title:'A Gift at Every Table', text:'Dine in with us this July and every table receives a complimentary gift — our way of saying thank you.' },
    { icon:'💳', title:'Buy $100, Get $25 Free', text:'Purchase a $100 gift card and we\'ll add a bonus $25 — perfect for the holidays or a treat for yourself.' },
  ],
  ends: 'Now through the end of July',
}

// ─── Router (tiny, dependency-free) ───────────────────────────
// Every path serves index.html (vercel rewrite), so we just read the
// pathname and render the matching page. ?site=kps is preserved in preview.
function useRoute() {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname)
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])
  return (path.replace(/\/+$/, '') || '/')
}

function navigate(to) {
  const search = window.location.search
  if (to === window.location.pathname) { window.scrollTo(0, 0); return }
  window.history.pushState({}, '', to + search)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

const go = to => e => { e.preventDefault(); navigate(to) }

// Internal link styled as a pill button
function PillLink({ to, gold, children, style }) {
  const base = gold ? { ...PILL_BTN, borderColor:GOLD, color:GOLD } : PILL_BTN
  return (
    <a href={to} onClick={go(to)} style={{ ...base, display:'inline-block', textDecoration:'none', ...style }}
      onMouseOver={e=>{ e.currentTarget.style.background=gold?GOLD:NAVY; e.currentTarget.style.color='#fff' }}
      onMouseOut={e=>{ e.currentTarget.style.background='none'; e.currentTarget.style.color=gold?GOLD:NAVY }}>
      {children}
    </a>
  )
}

// One location, so Order / Reserve open the right link directly.
function openAction(type) {
  const url = type === 'order' ? MEMORIAL.order : MEMORIAL.resy
  window.open(url, '_blank', 'noopener,noreferrer')
}

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

// ─── Photo Collage (polaroid-style, up to 3 photos) ───────────
const COLLAGE_FOOD    = ['/kps/food-biscuits.jpg', '/kps/food-cobb.jpg', '/kps/food-burger.jpg']
const COLLAGE_DRINKS  = ['/kps/food-caymus.jpg', '/kps/food-dessert.jpg', '/kps/food-chickensandwich.jpg']
const COLLAGE_EVENTS  = ['/kps/catering-party.jpg', '/kps/catering-breakfast.jpg', '/kps/int-overhead.jpg']

const COLLAGE_LAYOUTS = [
  [ // slot 1
    { x:'8%',  y:'14%', w:'52%', h:'58%', rot:-3,   z:2 },
    { x:'52%', y:'6%',  w:'44%', h:'46%', rot:3.5,  z:1 },
    { x:'40%', y:'52%', w:'48%', h:'42%', rot:-1.5, z:3 },
  ],
  [ // slot 2
    { x:'40%', y:'8%',  w:'54%', h:'54%', rot:3,    z:2 },
    { x:'8%',  y:'24%', w:'44%', h:'48%', rot:-2.5, z:3 },
    { x:'36%', y:'50%', w:'50%', h:'44%', rot:1.5,  z:1 },
  ],
  [ // slot 3
    { x:'6%',  y:'10%', w:'48%', h:'52%', rot:2.5,  z:1 },
    { x:'50%', y:'20%', w:'46%', h:'50%', rot:-3,   z:3 },
    { x:'20%', y:'52%', w:'52%', h:'44%', rot:2,    z:2 },
  ],
]

function PhotoCollage({ photos, slot = 1 }) {
  if (!photos?.length) return null
  const layout = COLLAGE_LAYOUTS[(slot - 1) % COLLAGE_LAYOUTS.length]
  return (
    <div style={{ position:'relative', width:'100%', paddingBottom:'95%', height:0 }}>
      {photos.slice(0,3).map((src,i) => {
        const cfg = layout[i]
        if (!cfg) return null
        return (
          <div key={i}
            style={{ position:'absolute', left:cfg.x, top:cfg.y, width:cfg.w, height:cfg.h,
              transform:`rotate(${cfg.rot}deg)`, zIndex:cfg.z,
              transition:'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
              boxShadow:'0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)',
              overflow:'hidden', background:'#fff', padding:6 }}
            onMouseOver={e=>{ e.currentTarget.style.transform=`rotate(${cfg.rot}deg) scale(1.03)`; e.currentTarget.style.zIndex=10 }}
            onMouseOut={e=>{ e.currentTarget.style.transform=`rotate(${cfg.rot}deg) scale(1)`; e.currentTarget.style.zIndex=cfg.z }}>
            <img src={src} alt="" loading="lazy" decoding="async" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
          </div>
        )
      })}
    </div>
  )
}

// Collage in a padded column, with optional caption + CTA beneath.
// Pass either onCta (function) or ctaTo (internal route) for the button.
function CollageBlock({ id, photos, slot, eyebrow, title, cta, onCta, ctaTo, sub, subTo }) {
  return (
    <div id={id} className="kps-collage-col" style={{ padding:'48px 40px', display:'flex', flexDirection:'column', justifyContent:'center' }}>
      <PhotoCollage photos={photos} slot={slot} />
      {(eyebrow || title || cta || sub) && (
        <div style={{ textAlign:'center', marginTop:28 }}>
          {eyebrow && <div style={{ ...EYEBROW_STYLE, marginBottom:8 }}>{eyebrow}</div>}
          {title && <div style={{ fontFamily:'Playfair Display,serif', fontStyle:'italic', fontSize:'clamp(18px,2.4vw,24px)', color:NAVY, marginBottom:(cta||sub)?16:0 }}>{title}</div>}
          {cta && (ctaTo
            ? <PillLink to={ctaTo}>{cta}</PillLink>
            : <button onClick={onCta} style={PILL_BTN}
                onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>{cta}</button>)}
          {sub && subTo && (
            <div style={{ marginTop:14 }}>
              <a href={subTo} onClick={go(subTo)} style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:MUTED, textDecoration:'none', borderBottom:`1px solid ${BORDER}`, paddingBottom:3 }}>{sub} →</a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Shared: menu item list ───────────────────────────────────
function ItemList({ items, note, link }) {
  return (
    <div>
      {note && <div style={{ padding:'10px 0 14px', fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD }}>{note}</div>}
      {items.map((item,i)=>(
        <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', gap:16, padding:'14px 0', borderBottom:`1px solid ${BORDER}` }}>
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:NAVY, marginBottom:item.description?3:0 }}>{item.name}</div>
            {item.description && <p style={{ fontFamily:'Georgia,serif', fontSize:12, color:MUTED, fontStyle:'italic', lineHeight:1.5 }}>{item.description}</p>}
          </div>
          {item.price && <div style={{ fontFamily:'DM Sans', fontSize:12, color:MUTED, flexShrink:0, fontWeight:600 }}>{/^\d+$/.test(String(item.price)) ? `$${item.price}` : item.price}</div>}
        </div>
      ))}
      {link && <a href={link} target="_blank" rel="noreferrer" style={{ display:'block', marginTop:20, fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, textDecoration:'none', borderBottom:`1px solid ${NAVY}`, paddingBottom:3, width:'fit-content' }}>View Full Menu →</a>}
    </div>
  )
}

// ─── Shared: hours dropdown ───────────────────────────────────
function HoursDropdown({ hours, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
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

// ─── Shared: inquiry form (private events / catering) ─────────
function InquiryForm({ subject, successMsg, cta = 'Send Inquiry' }) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', date:'', guests:'', message:'' })
  const [sent, setSent] = useState(false)
  const set = k => e => setForm(f=>({ ...f, [k]:e.target.value }))
  const handleSubmit = () => {
    const body = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0ADate: ${form.date}%0AGuests: ${form.guests}%0AMessage: ${form.message}`
    window.location.href = `mailto:${MEMORIAL.email}?subject=${encodeURIComponent(subject)}&body=${body}`
    setSent(true)
  }
  const input = { width:'100%', fontFamily:'Georgia,serif', fontSize:14, color:NAVY, background:'#fff', border:'none', borderBottom:`1px solid ${BORDER}`, padding:'10px 0', outline:'none', marginBottom:20 }
  if (sent) return (
    <div style={{ textAlign:'center', padding:'24px 0' }}>
      <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:NAVY, marginBottom:12 }}>Thank You</div>
      <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:MUTED, fontStyle:'italic', lineHeight:1.8 }}>{successMsg}</p>
    </div>
  )
  return (
    <>
      <input style={input} placeholder="Your Name" value={form.name} onChange={set('name')}/>
      <input style={input} placeholder="Email Address" value={form.email} onChange={set('email')}/>
      <input style={input} placeholder="Phone Number" value={form.phone} onChange={set('phone')}/>
      <input style={input} placeholder="Preferred Date" value={form.date} onChange={set('date')}/>
      <input style={input} placeholder="Number of Guests" value={form.guests} onChange={set('guests')}/>
      <textarea style={{ ...input, resize:'vertical', minHeight:90, marginBottom:32 }} placeholder="Tell us about your event" value={form.message} onChange={set('message')}/>
      <button onClick={handleSubmit}
        style={{ width:'100%', padding:'16px', background:NAVY, color:'#fff', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', cursor:'pointer', transition:'opacity 0.2s' }}
        onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
        {cta}
      </button>
    </>
  )
}

// ─── Nav ──────────────────────────────────────────────────────
const NAV_LINKS = [
  ['/menu','Menu'], ['/happy-hour','Happy Hour'],
  ['/private-events','Private Events'], ['/catering','Catering'], ['/contact','Contact'],
]
const MOBILE_LINKS = [
  ['/menu','Menu'], ['/happy-hour','Happy Hour'], ['/specials','Specials'],
  ['/private-events','Private Events'], ['/catering','Catering'],
  ['/about','Our Story'], ['/contact','Contact'],
]

function KpsNav({ solid }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    fn()
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const show = solid || scrolled || menuOpen
  const goto = to => e => { e.preventDefault(); setMenuOpen(false); navigate(to) }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 72, display: 'flex', alignItems: 'center',
        padding: '0 48px', justifyContent: 'space-between',
        background: show ? 'rgba(250,250,248,0.97)' : 'transparent',
        borderBottom: show ? `1px solid ${BORDER}` : 'none',
        transition: 'background 0.4s ease, border-color 0.4s ease',
      }}>
        {/* Logo — links home; visible when nav is solid */}
        <a href="/" onClick={goto('/')} style={{ flexShrink: 0, width: 64, height: 52, display:'flex', alignItems:'center', opacity: show ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: show ? 'auto' : 'none' }}>
          <img src={LOGO_BLUE} alt="KP's Kitchen"
            style={{ height: 52, width: 'auto', objectFit: 'contain' }}
            onError={e => { e.target.style.display='none' }}/>
        </a>

        {/* Desktop nav */}
        <div className="kps-nav-links" style={{ display:'flex', gap:28, alignItems:'center' }}>
          {NAV_LINKS.map(([to,label])=>(
            <a key={to} href={to} onClick={goto(to)} style={{ fontSize:13, color:NAVY, cursor:'pointer', fontFamily:'DM Sans', fontWeight:500, textDecoration:'none', transition:'opacity 0.2s', opacity:0.85 }}
              onMouseOver={e=>e.currentTarget.style.opacity='1'} onMouseOut={e=>e.currentTarget.style.opacity='0.85'}>
              {label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="kps-nav-cta" style={{ display:'flex', gap:10, alignItems:'center' }}>
          <button onClick={()=>openAction('order')} style={{ padding:'8px 18px', background:'none', border:`1px solid ${NAVY}`, color:NAVY, fontSize:12, fontFamily:'DM Sans', fontWeight:500, cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
            onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
            Order
          </button>
          <button onClick={()=>openAction('reserve')} style={{ padding:'8px 20px', background:NAVY, border:`1px solid ${NAVY}`, color:'#fff', fontSize:12, fontFamily:'DM Sans', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Reserve
          </button>
        </div>

        {/* Hamburger */}
        <button className="kps-ham" onClick={()=>setMenuOpen(!menuOpen)} style={{ display:'none', background:'none', border:'none', flexDirection:'column', gap:5, cursor:'pointer', padding:4 }}>
          {[0,1,2].map(i=><span key={i} style={{ display:'block', width:24, height:2, background:NAVY, transition:'0.3s', transform:i===0&&menuOpen?'rotate(45deg) translate(5px,5px)':i===2&&menuOpen?'rotate(-45deg) translate(5px,-5px)':'none', opacity:i===1&&menuOpen?0:1 }}/>)}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position:'fixed', inset:0, background:'#fff', zIndex:199, paddingTop:72, display:'flex', flexDirection:'column', overflowY:'auto' }}>
          {MOBILE_LINKS.map(([to,label])=>(
            <a key={to} href={to} onClick={goto(to)}
              style={{ textDecoration:'none', borderBottom:`1px solid ${BORDER}`, padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'opacity 0.2s' }}
              onMouseOver={e=>e.currentTarget.style.opacity='0.5'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
              <span style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:NAVY }}>{label}</span>
              <span style={{ color:MUTED, fontSize:16, opacity:0.4 }}>→</span>
            </a>
          ))}
          <div style={{ display:'flex', gap:10, padding:'24px 32px' }}>
            <button onClick={()=>openAction('reserve')} style={{ ...SOLID_BTN, flex:1 }}>Reserve</button>
            <button onClick={()=>openAction('order')} style={{ ...PILL_BTN, flex:1 }}>Order</button>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:960px){
          .kps-nav-links{display:none!important}
          .kps-nav-cta{display:none!important}
          .kps-ham{display:flex!important}
          nav{padding:0 24px!important}
        }
      `}</style>
    </>
  )
}

// ─── Home Hero Slideshow ──────────────────────────────────────
const HERO_PHOTOS = ['/kps/hero-patio.jpg', '/kps/hero-table.jpg', '/kps/hero-room.jpg']

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

// ─── Interior page header ─────────────────────────────────────
function PageHero({ eyebrow, title, subtitle }) {
  return (
    <div style={{ position:'relative', background:NAVY, padding:'140px 32px 68px', textAlign:'center', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:`url(${PATTERN_URL})`, backgroundRepeat:'repeat', backgroundSize:'auto 100px', opacity:0.06 }}/>
      <div style={{ position:'relative' }}>
        {eyebrow && <div style={{ ...EYEBROW_STYLE, color:GOLD, marginBottom:14 }}>{eyebrow}</div>}
        <h1 style={{ fontFamily:'Playfair Display,serif', fontStyle:'italic', fontWeight:400, fontSize:'clamp(30px,5vw,48px)', color:'#fff', lineHeight:1.15 }}>{title}</h1>
        {subtitle && <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:'rgba(255,255,255,0.75)', fontStyle:'italic', margin:'16px auto 0', maxWidth:560, lineHeight:1.7 }}>{subtitle}</p>}
      </div>
    </div>
  )
}

// Bottom order/reserve CTA row used on interior pages
function CtaRow({ children }) {
  return (
    <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginTop:44 }}>
      <button onClick={()=>openAction('reserve')} style={SOLID_BTN}
        onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>Reserve a Table</button>
      <button onClick={()=>openAction('order')} style={PILL_BTN}
        onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
        onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>Order Online</button>
      {children}
    </div>
  )
}

// ══════════════════════════════════════════════════════════════
// HOME PAGE SECTIONS
// ══════════════════════════════════════════════════════════════

// Row 1: About (left) | food collage (right)
function KpsAbout() {
  return (
    <section style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text">
          <a href="/about" onClick={go('/about')} style={{ ...EYEBROW_STYLE, marginBottom:20, textDecoration:'none' }}>Our Story</a>
          <h2 style={{ fontFamily:'DM Sans', fontSize:'clamp(15px,2vw,20px)', fontWeight:700, letterSpacing:'7px', textTransform:'uppercase', color:NAVY, marginBottom:24 }}>KP's Kitchen &amp; Bar</h2>
          <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:NAVY, lineHeight:1.9, marginBottom:36, opacity:0.85, maxWidth:380 }}>
            Upscale American comfort food served with genuine neighborhood hospitality. From scratch-made classics and thoughtfully crafted cocktails — KP's Kitchen has become a Houston institution for those who want an elevated dining experience without the pretense.
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            <button onClick={()=>openAction('reserve')} style={PILL_BTN}
              onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
              onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>
              Reserve
            </button>
            <PillLink to="/menu"><span className="kps-btn-full">View </span>Menu</PillLink>
            <PillLink to="/about">Our Story</PillLink>
          </div>
        </div>
        <CollageBlock photos={COLLAGE_FOOD} slot={1} eyebrow="From Our Kitchen" title="Scratch-made comfort classics" cta="Order Online" onCta={()=>openAction('order')} />
      </div>
    </section>
  )
}

// Row 2: Menus sneak-peek (left) | happy hour collage (right)
function KpsMenusTeaser() {
  const rows = [
    { label:'Lunch', sub:'Available 11 – 3 · weekdays', to:'/menu' },
    { label:'Dinner', sub:'Fire grill, handhelds & house specialties', to:'/menu' },
    { label:'Happy Hour', sub:'Tue – Sun 3–6PM · $7 for 7', to:'/happy-hour' },
    { label:'Specials', sub:'Daily deals you don\'t want to miss', to:'/specials' },
  ]
  return (
    <section style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text">
          <a href="/menu" onClick={go('/menu')} style={{ ...EYEBROW_STYLE, letterSpacing:'5px', marginBottom:36, textDecoration:'none' }}>Menus</a>
          <div style={{ width:'100%', maxWidth:320 }}>
            {rows.map((h,i)=>(
              <a key={i} href={h.to} onClick={go(h.to)}
                style={{ textDecoration:'none', cursor:'pointer', padding:'14px 0', width:'100%', textAlign:'center', display:'block', transition:'opacity 0.2s' }}
                onMouseOver={e=>e.currentTarget.style.opacity='0.5'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
                <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:NAVY, marginBottom:3 }}>{h.label}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:12, color:MUTED, fontStyle:'italic' }}>{h.sub}</div>
              </a>
            ))}
          </div>
        </div>
        <CollageBlock photos={COLLAGE_DRINKS} slot={2} eyebrow="Tuesday – Sunday · 3–6PM" title="Happy Hour · $7 for 7" cta="See Happy Hour" ctaTo="/happy-hour" />
      </div>
    </section>
  )
}

// Row 3: events collage (left) | location sneak-peek (right)
function KpsLocationTeaser() {
  return (
    <section style={{ background:'#fff' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr' }} className="kps-split">
        <div className="kps-loc-photo">
          <CollageBlock
            photos={COLLAGE_EVENTS}
            slot={3}
            eyebrow="Private Dining & Catering"
            title="Office lunches, celebrations & events"
            cta="Private Events"
            ctaTo="/private-events"
            sub="Catering & drop-off"
            subTo="/catering"
          />
        </div>
        <div style={{ padding:'72px 56px', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }} className="kps-split-text kps-loc-text">
          <a href="/contact" onClick={go('/contact')} style={{ ...EYEBROW_STYLE, letterSpacing:'5px', marginBottom:40, textDecoration:'none' }}>Visit Us</a>
          <div style={{ width:'100%', maxWidth:340 }}>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:8, opacity:0.6 }}>{MEMORIAL.name}</div>
            <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:NAVY, lineHeight:1.8, marginBottom:2, fontStyle:'italic' }}>{MEMORIAL.address}</p>
            <a href={`tel:${MEMORIAL.phone}`} style={{ fontFamily:'Georgia,serif', fontSize:14, color:MUTED, fontStyle:'italic', textDecoration:'none', display:'block', marginBottom:12 }}
              onMouseOver={e=>e.target.style.color=NAVY} onMouseOut={e=>e.target.style.color=MUTED}>{MEMORIAL.phone}</a>
            <HoursDropdown hours={MEMORIAL.hours}/>
            <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={()=>openAction('reserve')} style={PILL_BTN}
                onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>Reserve</button>
              <PillLink to="/contact" style={{ color:MUTED, borderColor:MUTED }}>Hours &amp; Map</PillLink>
              <PillLink to="/menu" style={{ color:MUTED, borderColor:MUTED }}>Menu</PillLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  return (
    <>
      <KpsHero />
      <KpsAbout />
      <KpsLocationTeaser />
      <KpsMenusTeaser />
    </>
  )
}

// ══════════════════════════════════════════════════════════════
// INTERIOR PAGES
// ══════════════════════════════════════════════════════════════

function MenuPage() {
  return (
    <>
      <PageHero eyebrow="KP's Kitchen &amp; Bar" title="Our Menu"
        subtitle="Scratch-made American comfort classics, craft cocktails, and a $7-for-7 happy hour — served all week in Memorial." />
      <div style={{ maxWidth:720, margin:'0 auto', padding:'64px 24px 88px' }}>
        {MEMORIAL_MENU.map((s,i)=>(
          <div key={i} style={{ marginBottom:56 }}>
            <h2 style={{ ...H2_STYLE, textAlign:'center', marginBottom:s.note?6:22 }}>{s.name}</h2>
            {s.note && <div style={{ textAlign:'center', fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>{s.note}</div>}
            <ItemList items={s.items} link={s.link}/>
          </div>
        ))}
        <div style={{ marginTop:8 }}>
          {MENU_NOTES.map((n,i)=>(
            <p key={i} style={{ fontFamily:'Georgia,serif', fontSize:12, color:MUTED, fontStyle:'italic', lineHeight:1.6, textAlign:'center', marginBottom:10 }}>{n}</p>
          ))}
        </div>
        <CtaRow/>
      </div>
    </>
  )
}

function HappyHourPage() {
  const hh = HAPPY_HOUR
  return (
    <>
      <PageHero eyebrow="Tuesday – Sunday · 3–6PM" title="Happy Hour"
        subtitle="Seven drinks. Seven bites. $7 each. Our neighborhood's favorite way to unwind — from Grey Goose martinis to Mama Pauly's meatballs." />
      <div style={{ maxWidth:900, margin:'0 auto', padding:'56px 24px 88px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'center' }} className="kps-split">
          <div style={{ padding:'8px 24px' }}>
            <PhotoCollage photos={COLLAGE_DRINKS} slot={2} />
          </div>
          <div style={{ padding:'8px 24px' }}>
            <ItemList items={hh.items} note={hh.note}/>
          </div>
        </div>
        <CtaRow/>
      </div>
    </>
  )
}

function SpecialsPage() {
  const dayMap = { 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday', 0:'Sunday' }
  const todayName = dayMap[new Date().getDay()]
  return (
    <>
      <PageHero eyebrow="Every Week at KP's" title="Weekly Specials"
        subtitle="A different reason to come in every day — from $12 Burger Tuesdays to Prime Rib Wednesdays and Sunday family meals." />
      <div style={{ maxWidth:620, margin:'0 auto', padding:'56px 24px 88px' }}>
        {SPECIALS_LIST.map((s,i)=>(
          <div key={i} style={{ display:'flex', gap:20, padding:'18px 0', borderBottom:`1px solid ${BORDER}`, alignItems:'flex-start' }}>
            <div style={{ fontFamily:'DM Sans', fontSize:12, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:s.day===todayName?GOLD:NAVY, minWidth:100, paddingTop:2, opacity:s.day===todayName?1:0.75 }}>
              {s.day}
              {s.day===todayName && <div style={{ fontSize:9, letterSpacing:'1px', color:GOLD, marginTop:2 }}>TODAY</div>}
            </div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:15, color:NAVY, lineHeight:1.7, fontStyle:'italic' }}>{s.deal}</div>
          </div>
        ))}
        <CtaRow/>
      </div>
    </>
  )
}

function InquiryPage({ eyebrow, title, subtitle, blurb, photos, slot, subject, successMsg }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'56px 24px 88px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'center' }} className="kps-split">
          <div style={{ padding:'8px 16px' }}>
            <PhotoCollage photos={photos} slot={slot} />
            <p style={{ fontFamily:'Georgia,serif', fontSize:14.5, color:NAVY, lineHeight:1.9, opacity:0.85, marginTop:28, textAlign:'center' }}>{blurb}</p>
          </div>
          <div style={{ padding:'8px 16px' }}>
            <div style={{ ...EYEBROW_STYLE, marginBottom:10 }}>Tell Us About Your Event</div>
            <p style={{ fontFamily:'Georgia,serif', fontSize:13, color:MUTED, fontStyle:'italic', marginBottom:28, lineHeight:1.6 }}>
              Fill out the form below and our team will be in touch, or email <a href={`mailto:${MEMORIAL.email}`} style={{ color:NAVY }}>{MEMORIAL.email}</a> directly.
            </p>
            <InquiryForm subject={subject} successMsg={successMsg}/>
          </div>
        </div>
      </div>
    </>
  )
}

function PrivateEventsPage() {
  return (
    <InquiryPage
      eyebrow="Entertain at KP's"
      title="Private Events"
      subtitle="Rehearsal dinners, birthdays, corporate gatherings and holiday parties — hosted with the warmth KP's is known for."
      blurb="From intimate dinners to full buyouts, our team handles every detail — custom menus, wine pairings, and service that makes your guests feel at home."
      photos={COLLAGE_EVENTS}
      slot={3}
      subject="Private Event Inquiry"
      successMsg="Your private event inquiry has been sent. We'll be in touch shortly to plan the details."
    />
  )
}

function CateringPage() {
  return (
    <InquiryPage
      eyebrow="KP's To Go"
      title="Catering"
      subtitle="Office lunches, client meetings, and celebrations — KP's comfort classics delivered and set up wherever you gather."
      blurb="Drop-off and full-service catering for groups of every size. Crowd-favorite spreads, breakfast to dinner, made from scratch and ready to impress."
      photos={['/kps/catering-breakfast.jpg', '/kps/catering-party.jpg', '/kps/food-cobb.jpg']}
      slot={1}
      subject="Catering Inquiry"
      successMsg="Your catering inquiry has been sent. We'll be in touch shortly to build your order."
    />
  )
}

function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Houston, Texas" title="Our Story"
        subtitle="A neighborhood kitchen built on scratch-made comfort food and genuine hospitality." />
      <div style={{ maxWidth:680, margin:'0 auto', padding:'64px 24px 40px', textAlign:'center' }}>
        <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:NAVY, lineHeight:1.95, marginBottom:28 }}>
          KP's Kitchen &amp; Bar is upscale American comfort food served with the warmth of your favorite neighborhood spot. Founded by Kerry Pauly, KP's pairs scratch-made classics — Mama Pauly's meatballs, smashed cheeseburgers, shrimp &amp; grits — with a thoughtfully built bar and a $7-for-7 happy hour that keeps regulars coming back.
        </p>
        <p style={{ fontFamily:'Georgia,serif', fontSize:16, color:NAVY, lineHeight:1.95, opacity:0.85 }}>
          What began as a single Houston dining room has grown into a local institution for people who want an elevated experience without the pretense — the kind of place where the team knows your name and the kitchen never cuts a corner.
        </p>
      </div>
      <div style={{ maxWidth:560, margin:'0 auto', padding:'0 24px' }}>
        <PhotoCollage photos={['/kps/hero-room.jpg', '/kps/food-burger.jpg', '/kps/int-overhead.jpg']} slot={2} />
      </div>
      <div style={{ maxWidth:820, margin:'0 auto', padding:'56px 24px 88px' }}>
        <div style={{ ...EYEBROW_STYLE, textAlign:'center', marginBottom:28 }}>In the Press</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:24 }}>
          {PRESS_ITEMS.map((p,i)=>(
            <a key={i} href={p.url} target="_blank" rel="noreferrer"
              style={{ textDecoration:'none', border:`1px solid ${BORDER}`, padding:'28px 24px', textAlign:'center', transition:'box-shadow 0.2s', display:'block' }}
              onMouseOver={e=>e.currentTarget.style.boxShadow='0 8px 30px rgba(0,0,0,0.08)'} onMouseOut={e=>e.currentTarget.style.boxShadow='none'}>
              <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:12 }}>{p.label}</div>
              <p style={{ fontFamily:'Georgia,serif', fontSize:14, color:NAVY, fontStyle:'italic', lineHeight:1.6 }}>"{p.quote}"</p>
            </a>
          ))}
        </div>
        <CtaRow/>
      </div>
    </>
  )
}

function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(MEMORIAL.address)}&output=embed`
  return (
    <>
      <PageHero eyebrow="Visit Us" title="Contact &amp; Hours"
        subtitle="Find us in Memorial, off the I-10 frontage road. Walk-ins welcome, reservations recommended." />
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'56px 24px 88px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }} className="kps-split">
          <div style={{ textAlign:'center', padding:'8px 16px' }}>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:MUTED, marginBottom:10, opacity:0.6 }}>{MEMORIAL.name}</div>
            <p style={{ fontFamily:'Georgia,serif', fontSize:15, color:NAVY, lineHeight:1.8, fontStyle:'italic', marginBottom:14 }}>{MEMORIAL.address}</p>
            <a href={`tel:${MEMORIAL.phone}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:15, color:NAVY, fontStyle:'italic', textDecoration:'none', marginBottom:6 }}>{MEMORIAL.phone}</a>
            <a href={`mailto:${MEMORIAL.email}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:15, color:MUTED, fontStyle:'italic', textDecoration:'none', marginBottom:24 }}>{MEMORIAL.email}</a>
            <div style={{ maxWidth:300, margin:'0 auto', textAlign:'left' }}>
              <HoursDropdown hours={MEMORIAL.hours} defaultOpen/>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap', marginTop:8 }}>
              <button onClick={()=>openAction('reserve')} style={SOLID_BTN}
                onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>Reserve</button>
              <a href={`https://maps.google.com?q=${encodeURIComponent(MEMORIAL.address)}`} target="_blank" rel="noreferrer" style={{ ...PILL_BTN, textDecoration:'none' }}
                onMouseOver={e=>{e.currentTarget.style.background=NAVY;e.currentTarget.style.color='#fff'}}
                onMouseOut={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color=NAVY}}>Get Directions</a>
            </div>
          </div>
          <div style={{ padding:'8px 16px' }}>
            <iframe title="KP's Kitchen map" src={mapSrc} width="100%" height="380" style={{ border:0, display:'block' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Christmas in July Promo Popup (temporary) ────────────────
function HolidayPromoPopup({ onClose }) {
  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow='' } }, [])
  return (
    <div style={{ position:'fixed', inset:0, zIndex:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)' }} onClick={onClose}/>
      <div style={{ position:'relative', background:CREAM, width:'min(500px,92vw)', maxHeight:'90vh', overflowY:'auto', animation:'fadeUp 0.3s ease', boxShadow:'0 24px 70px rgba(0,0,0,0.4)' }}>
        <div style={{ position:'relative', background:NAVY, padding:'40px 32px 34px', textAlign:'center', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, backgroundImage:`url(${PATTERN_URL})`, backgroundRepeat:'repeat', backgroundSize:'auto 100px', opacity:0.08 }}/>
          <button onClick={onClose} style={{ position:'absolute', top:16, right:18, background:'none', border:'none', fontSize:22, cursor:'pointer', color:'rgba(255,255,255,0.7)', lineHeight:1, zIndex:2 }}>✕</button>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:34, marginBottom:10 }}>❄️ 🎄 ❄️</div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'5px', textTransform:'uppercase', color:GOLD, marginBottom:12 }}>Limited-Time Celebration</div>
            <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(28px,5vw,40px)', fontWeight:400, fontStyle:'italic', color:'#fff', lineHeight:1.15 }}>Christmas in July</h2>
          </div>
        </div>
        <div style={{ padding:'30px 32px 8px' }}>
          {PROMO.offers.map((o,i)=>(
            <div key={i} style={{ display:'flex', gap:18, padding:'18px 0', borderBottom:i<PROMO.offers.length-1?`1px solid ${BORDER}`:'none', alignItems:'flex-start' }}>
              <div style={{ fontSize:28, flexShrink:0, lineHeight:1.1 }}>{o.icon}</div>
              <div>
                <div style={{ fontFamily:'DM Sans', fontSize:13, fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:NAVY, marginBottom:6 }}>{o.title}</div>
                <p style={{ fontFamily:'Georgia,serif', fontSize:13.5, color:MUTED, fontStyle:'italic', lineHeight:1.65 }}>{o.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:'20px 32px 34px' }}>
          <div style={{ textAlign:'center', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:RUST, marginBottom:22 }}>{PROMO.ends}</div>
          <button onClick={()=>{ onClose(); openAction('reserve') }}
            style={{ width:'100%', padding:'16px', background:NAVY, color:'#fff', border:'none', fontFamily:'DM Sans', fontSize:11, fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', cursor:'pointer', transition:'opacity 0.2s' }}
            onMouseOver={e=>e.currentTarget.style.opacity='0.85'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
            Reserve a Table
          </button>
          <button onClick={onClose}
            style={{ display:'block', margin:'16px auto 0', background:'none', border:'none', fontFamily:'DM Sans', fontSize:10, fontWeight:600, letterSpacing:'2px', textTransform:'uppercase', color:MUTED, cursor:'pointer' }}>
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────
function KpsFooter() {
  const cols = [
    { head:'Explore', links:[['/menu','Menu'],['/happy-hour','Happy Hour'],['/specials','Specials'],['/about','Our Story']] },
    { head:'Events', links:[['/private-events','Private Events'],['/catering','Catering'],['/contact','Contact & Hours']] },
  ]
  return (
    <footer style={{ background:NAVY, padding:'56px 48px 40px', color:'#fff' }}>
      <div style={{ maxWidth:900, margin:'0 auto' }}>
        <div style={{ display:'flex', gap:48, justifyContent:'center', flexWrap:'wrap', marginBottom:40, textAlign:'center' }}>
          {cols.map((c,i)=>(
            <div key={i}>
              <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>{c.head}</div>
              {c.links.map(([to,label])=>(
                <a key={to} href={to} onClick={go(to)} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:14, color:'rgba(255,255,255,0.6)', fontStyle:'italic', textDecoration:'none', marginBottom:10, transition:'color 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>{label}</a>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontFamily:'DM Sans', fontSize:10, fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Visit</div>
            <a href={`https://maps.google.com?q=${encodeURIComponent(MEMORIAL.address)}`} target="_blank" rel="noreferrer" style={{ display:'block', fontFamily:'Georgia,serif', fontSize:14, color:'rgba(255,255,255,0.6)', fontStyle:'italic', textDecoration:'none', marginBottom:10, maxWidth:200 }}
              onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>8412 I-10 Frontage Rd, Houston TX</a>
            <a href={`tel:${MEMORIAL.phone}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:14, color:'rgba(255,255,255,0.6)', fontStyle:'italic', textDecoration:'none', marginBottom:10 }}
              onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>{MEMORIAL.phone}</a>
            <a href={`mailto:${MEMORIAL.email}`} style={{ display:'block', fontFamily:'Georgia,serif', fontSize:14, color:'rgba(255,255,255,0.6)', fontStyle:'italic', textDecoration:'none' }}
              onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.6)'}>{MEMORIAL.email}</a>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:24, textAlign:'center', fontFamily:'DM Sans', fontSize:11, color:'rgba(255,255,255,0.25)', letterSpacing:'1px' }}>
          © {new Date().getFullYear()} KP's Kitchen &amp; Bar · <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,0.25)', textDecoration:'none' }}>Website by EC Web Co</a>
        </div>
      </div>
    </footer>
  )
}

// ─── Sticky Bar (mobile) ──────────────────────────────────────
function KpsStickyBar() {
  return (
    <>
      <div className="kps-sticky" style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:200, display:'none', background:'#fff', borderTop:`1px solid ${BORDER}`, paddingBottom:'env(safe-area-inset-bottom)' }}>
        <button onClick={()=>openAction('reserve')}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:NAVY, color:'#fff', border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:'1px solid rgba(255,255,255,0.1)' }}>
          Reserve
        </button>
        <button onClick={()=>openAction('order')}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, border:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase', borderRight:`1px solid ${BORDER}` }}>
          Order
        </button>
        <a href={`tel:${MEMORIAL.phone}`}
          style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'14px 8px', background:'#fff', color:NAVY, textDecoration:'none', cursor:'pointer', fontFamily:'DM Sans', fontSize:11, fontWeight:500, letterSpacing:'0.5px', textTransform:'uppercase' }}>
          Call
        </a>
      </div>
      <div className="kps-sticky-spacer" style={{ display:'none', height:56 }}/>
      <style>{`@media(max-width:768px){.kps-sticky{display:flex!important}.kps-sticky-spacer{display:block!important}}`}</style>
    </>
  )
}

// ─── Route table + document titles ────────────────────────────
const PAGES = {
  '/': { title: "KP's Kitchen | Your Go-To for Comfort Classics", render: () => <HomePage/> },
  '/menu': { title: "Menu | KP's Kitchen & Bar", render: () => <MenuPage/> },
  '/happy-hour': { title: "Happy Hour · $7 for 7 | KP's Kitchen & Bar", render: () => <HappyHourPage/> },
  '/specials': { title: "Weekly Specials | KP's Kitchen & Bar", render: () => <SpecialsPage/> },
  '/private-events': { title: "Private Events | KP's Kitchen & Bar", render: () => <PrivateEventsPage/> },
  '/catering': { title: "Catering | KP's Kitchen & Bar", render: () => <CateringPage/> },
  '/about': { title: "Our Story | KP's Kitchen & Bar", render: () => <AboutPage/> },
  '/contact': { title: "Contact & Hours | KP's Kitchen & Bar", render: () => <ContactPage/> },
}

// ─── Main ─────────────────────────────────────────────────────
export default function KpsLayout() {
  const route = useRoute()
  const [promoOpen, setPromoOpen] = useState(false)
  const page = PAGES[route] || PAGES['/']
  const isHome = route === '/'

  useEffect(() => { document.title = page.title }, [page])
  useEffect(() => { window.scrollTo(0, 0) }, [route])

  // Auto-show Christmas in July promo after 2s — once per browser session
  useEffect(() => {
    if (sessionStorage.getItem('kps-promo-seen')) return
    const t = setTimeout(() => {
      setPromoOpen(true)
      sessionStorage.setItem('kps-promo-seen', '1')
    }, 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', background:'#fff', color:NAVY, overflowX:'hidden' }}>
      <KpsNav solid={!isHome} />
      {page.render()}
      <KpsFooter />
      <KpsStickyBar />
      {promoOpen && <HolidayPromoPopup onClose={()=>setPromoOpen(false)} />}

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
          .kps-loc-text{order:1}
          .kps-loc-photo{order:2}
          .kps-btn-full{display:none}
        }
      `}</style>
    </div>
  )
}
