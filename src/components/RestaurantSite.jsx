import { useState, useEffect, useMemo } from 'react'
import { trackEvent, submitInquiry } from '../lib/supabase'

/* ─── Design tokens ─────────────────────────────────────────── */
const NAVY = '#1B2B4B'
const CREAM = '#FAFAF8'
const WARM = '#F4F1EB'
const STONE = '#E8E4DC'
const GOLD = '#C9A84C'
const MUTED = '#8A8278'
const BORDER = '#E4E0D8'

const NAV_HEIGHT = 120

const PILL_BTN = {
  background: 'none',
  border: `1px solid ${NAVY}`,
  borderRadius: 999,
  fontFamily: 'DM Sans',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '3px',
  textTransform: 'uppercase',
  color: NAVY,
  cursor: 'pointer',
  padding: '11px 24px',
  transition: 'all 0.2s',
}

const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ─── Helpers ───────────────────────────────────────────────── */
function fmtTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function locationHoursToDisplay(locHours) {
  return DAYS_FULL.map((day, i) => {
    const h = locHours?.find(r => r.day_of_week === i)
    if (!h || h.closed) return { day, closed: true }
    return { day, time: `${fmtTime(h.open_time)} – ${fmtTime(h.close_time)}` }
  })
}

function getHoursStatus(locHours) {
  if (!locHours?.length) return { label: 'See hours', color: MUTED }
  const now = new Date()
  const todayRow = locHours.find(h => h.day_of_week === now.getDay())
  if (!todayRow || todayRow.closed) return { label: 'Closed today', color: '#C0392B' }
  const [oh, om] = (todayRow.open_time || '0:0').split(':').map(Number)
  const [ch, cm] = (todayRow.close_time || '0:0').split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  const openMins = oh * 60 + om
  const closeMins = ch * 60 + cm
  if (nowMins < openMins) return { label: `Opens ${fmtTime(todayRow.open_time)}`, color: MUTED }
  const remaining = closeMins - nowMins
  if (remaining <= 0) return { label: 'Closed now', color: '#C0392B' }
  if (remaining <= 60) return { label: `Closes soon · ${fmtTime(todayRow.close_time)}`, color: '#E67E22' }
  return { label: `Open until ${fmtTime(todayRow.close_time)}`, color: '#27AE60' }
}

function getLocLinks(loc) {
  return loc?.location_links?.[0] || {}
}

function anyLocationHas(locations, field) {
  return (locations || []).some(l => getLocLinks(l)[field] || (field === 'phone' && l.phone))
}

function normalizeSocialUrl(value, platform) {
  if (!value) return null
  const v = value.trim()
  if (!v) return null
  if (v.startsWith('http')) return v
  const handle = v.replace(/^@/, '').replace(/^\//, '')
  if (platform === 'instagram') return `https://instagram.com/${handle}`
  if (platform === 'facebook') return `https://facebook.com/${handle}`
  if (platform === 'tiktok') return `https://tiktok.com/@${handle.replace(/^@/, '')}`
  return v
}

/* ─── Photo Collage ─────────────────────────────────────────── */
function PhotoCollage({ photos, slot }) {
  if (!photos || photos.length === 0) return null

  const configs = [
    {
      1: [{ x: '10%', y: '10%', w: '80%', h: '80%', rot: -2.5, z: 1 }],
      2: [
        { x: '5%',  y: '8%',  w: '60%', h: '70%', rot: -3,   z: 1 },
        { x: '50%', y: '38%', w: '48%', h: '55%', rot: 4,    z: 2 },
      ],
      3: [
        { x: '8%',  y: '14%', w: '52%', h: '58%', rot: -3,   z: 2 },
        { x: '52%', y: '6%',  w: '44%', h: '46%', rot: 3.5,  z: 1 },
        { x: '40%', y: '52%', w: '48%', h: '42%', rot: -1.5, z: 3 },
      ],
    },
    {
      1: [{ x: '8%', y: '12%', w: '78%', h: '78%', rot: 2.5, z: 1 }],
      2: [
        { x: '38%', y: '6%',  w: '58%', h: '66%', rot: 3,    z: 1 },
        { x: '5%',  y: '34%', w: '50%', h: '58%', rot: -2.5, z: 2 },
      ],
      3: [
        { x: '40%', y: '8%',  w: '54%', h: '54%', rot: 3,    z: 2 },
        { x: '8%',  y: '24%', w: '44%', h: '48%', rot: -2.5, z: 3 },
        { x: '36%', y: '50%', w: '50%', h: '44%', rot: 1.5,  z: 1 },
      ],
    },
    {
      1: [{ x: '12%', y: '8%', w: '76%', h: '82%', rot: -2, z: 1 }],
      2: [
        { x: '8%',  y: '12%', w: '52%', h: '64%', rot: 2,    z: 2 },
        { x: '46%', y: '40%', w: '50%', h: '54%', rot: -3.5, z: 1 },
      ],
      3: [
        { x: '6%',  y: '10%', w: '48%', h: '52%', rot: 2.5,  z: 1 },
        { x: '50%', y: '20%', w: '46%', h: '50%', rot: -3,   z: 3 },
        { x: '20%', y: '52%', w: '52%', h: '44%', rot: 2,    z: 2 },
      ],
    },
    {
      1: [{ x: '11%', y: '11%', w: '78%', h: '78%', rot: 1.5, z: 1 }],
      2: [
        { x: '7%',  y: '20%', w: '52%', h: '58%', rot: -3,   z: 1 },
        { x: '48%', y: '8%',  w: '46%', h: '52%', rot: 3.5,  z: 2 },
      ],
      3: [
        { x: '10%', y: '6%',  w: '48%', h: '50%', rot: -2,   z: 1 },
        { x: '46%', y: '36%', w: '50%', h: '52%', rot: 3,    z: 3 },
        { x: '20%', y: '54%', w: '46%', h: '40%', rot: -3,   z: 2 },
      ],
    },
  ]

  const slotIndex = ((slot || 1) - 1) % configs.length
  const slotConfig = configs[slotIndex]
  const count = Math.min(photos.length, 3)
  const layout = slotConfig[count] || slotConfig[1]
  if (!layout) return null

  return (
    <div className="site-collage" style={{ position: 'relative', width: '100%', paddingBottom: '95%', height: 0 }}>
      {photos.slice(0, 3).map((photo, i) => {
        const cfg = layout[i]
        if (!cfg) return null
        return (
          <div
            key={photo.id || i}
            style={{
              position: 'absolute',
              left: cfg.x, top: cfg.y, width: cfg.w, height: cfg.h,
              transform: `rotate(${cfg.rot}deg)`, zIndex: cfg.z,
              transition: 'transform 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)',
              overflow: 'hidden', background: '#fff', padding: 6,
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = `rotate(${cfg.rot}deg) scale(1.03)`
              e.currentTarget.style.zIndex = 10
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = `rotate(${cfg.rot}deg) scale(1)`
              e.currentTarget.style.zIndex = cfg.z
            }}
          >
            <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        )
      })}
    </div>
  )
}

/* ─── Nav ───────────────────────────────────────────────────── */
function Nav({ restaurant, locations, onMenuOpen, onPick, onEventsOpen, onContactOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > window.innerHeight - 100)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const hasOrder = anyLocationHas(locations, 'order_url')
  const hasReserve = anyLocationHas(locations, 'reservation_url')
  const hasEvents = !!restaurant.events_email
  const logoSrc = restaurant.logo_url

  const navItems = []
  navItems.push({ label: 'Menu', action: () => { setMenuOpen(false); onMenuOpen() } })
  if (hasEvents) navItems.push({ label: 'Private Events', action: () => { setMenuOpen(false); onEventsOpen() } })
  navItems.push({ label: (locations?.length || 0) > 1 ? 'Locations' : 'Location', id: 'site-locations' })
  navItems.push({ label: 'Contact', action: () => { setMenuOpen(false); onContactOpen() } })

  return (
    <>
      <nav
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          height: NAV_HEIGHT, display: 'flex', alignItems: 'center',
          padding: '0 48px', justifyContent: 'space-between',
          background: scrolled || menuOpen ? 'rgba(250,250,248,0.97)' : 'transparent',
          borderBottom: scrolled ? `1px solid ${BORDER}` : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        <div
          style={{
            flexShrink: 0, width: 128, height: 104, display: 'flex', alignItems: 'center',
            opacity: scrolled || menuOpen ? 1 : 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: scrolled || menuOpen ? 'auto' : 'none',
          }}
        >
          {logoSrc && (
            <img
              src={logoSrc}
              alt={restaurant.name}
              style={{ height: 104, width: 'auto', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none' }}
            />
          )}
        </div>

        <div className="site-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => (item.action ? item.action() : scrollTo(item.id))}
              style={{
                background: 'none', border: 'none',
                fontSize: 13, color: NAVY, cursor: 'pointer',
                fontFamily: 'DM Sans', fontWeight: 500,
                transition: 'opacity 0.2s', opacity: 0.85,
                whiteSpace: 'nowrap',
              }}
              onMouseOver={e => (e.target.style.opacity = '1')}
              onMouseOut={e => (e.target.style.opacity = '0.85')}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="site-nav-cta" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {hasOrder && (
            <button
              onClick={() => onPick('order')}
              style={{
                padding: '8px 18px', background: 'none',
                border: `1px solid ${NAVY}`, color: NAVY,
                fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = NAVY }}
            >
              Order
            </button>
          )}
          {hasReserve && (
            <button
              onClick={() => onPick('reserve')}
              style={{
                padding: '8px 20px', background: NAVY,
                border: `1px solid ${NAVY}`, color: '#fff',
                fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              Reserve
            </button>
          )}
        </div>

        <button
          className="site-ham"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', background: 'none', border: 'none', flexDirection: 'column', gap: 5, cursor: 'pointer', padding: 4 }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              style={{
                display: 'block', width: 24, height: 2, background: NAVY, transition: '0.3s',
                transform:
                  i === 0 && menuOpen ? 'rotate(45deg) translate(5px,5px)'
                    : i === 2 && menuOpen ? 'rotate(-45deg) translate(5px,-5px)'
                    : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: '#fff', zIndex: 199,
            paddingTop: NAV_HEIGHT, display: 'flex', flexDirection: 'column',
          }}
        >
          {navItems.map((item, i) => (
            <button
              key={i}
              onClick={() => (item.action ? item.action() : scrollTo(item.id))}
              style={{
                background: 'none', border: 'none',
                borderBottom: `1px solid ${BORDER}`,
                padding: '22px 32px', textAlign: 'left',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <span style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: NAVY }}>
                {item.label}
              </span>
              <span style={{ color: MUTED, fontSize: 16, opacity: 0.4 }}>→</span>
            </button>
          ))}
        </div>
      )}

      <style>{`
        @media(max-width:900px){
          .site-nav-links{display:none!important}
          .site-nav-cta{display:none!important}
          .site-ham{display:flex!important}
          nav{padding:0 24px!important}
        }
      `}</style>
    </>
  )
}

/* ─── Hero ──────────────────────────────────────────────────── */
function Hero({ restaurant, heroPhotos }) {
  const [current, setCurrent] = useState(0)
  const photos = heroPhotos || []

  useEffect(() => {
    if (photos.length <= 1) return
    const t = setInterval(() => setCurrent(c => (c + 1) % photos.length), 5000)
    return () => clearInterval(t)
  }, [photos.length])

  const lightLogo = restaurant.logo_light_url
  const fallbackLogo = !lightLogo ? restaurant.logo_url : null

  return (
    <div
      className="site-hero"
      style={{
        height: '85vh', minHeight: 500, position: 'relative', overflow: 'hidden',
        background: CREAM, paddingTop: NAV_HEIGHT,
      }}
    >
      {photos.map((p, i) => (
        <img
          key={p.id || i}
          src={p.url}
          alt=""
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: i === current ? 1 : 0, transition: 'opacity 1.2s ease',
          }}
        />
      ))}
      {photos.length === 0 && (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,#1B2B4B,#0d1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase' }}>
            Add hero photos in your dashboard
          </p>
        </div>
      )}

      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 200,
          background: 'linear-gradient(to bottom, rgba(250,250,248,1) 0%, rgba(250,250,248,0.6) 50%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {(lightLogo || fallbackLogo) && (
        <div style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <img
            src={lightLogo || fallbackLogo}
            alt={restaurant.name}
            style={{
              width: 'clamp(400px,56vw,680px)', height: 'auto', objectFit: 'contain',
              filter: lightLogo
                ? 'drop-shadow(0 4px 24px rgba(0,0,0,0.55)) drop-shadow(0 1px 6px rgba(0,0,0,0.4))'
                : 'brightness(0) invert(1) drop-shadow(0 4px 24px rgba(0,0,0,0.55))',
            }}
            onError={e => (e.target.style.display = 'none')}
          />
        </div>
      )}
    </div>
  )
}

/* ─── About row — text LEFT, collage RIGHT ──────────────────── */
function AboutRow({ restaurant, locations, onMenuOpen, onPick, onSpecials, hasSpecials, collage }) {
  const safeCollage = collage || []
  return (
    <section style={{ background: '#fff' }}>
      <div className="site-split site-row-text-left" style={{ display: 'grid', gridTemplateColumns: safeCollage.length ? '1fr 1fr' : '1fr' }}>
        {/* TEXT (left on desktop, top on mobile) */}
        <div className="site-text-col" style={{ padding: '96px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {restaurant.city && (
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: '4px', textTransform: 'uppercase', color: MUTED, marginBottom: 20, opacity: 0.6 }}>
              {restaurant.city}
            </div>
          )}
          <h1 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(15px,2vw,20px)', fontWeight: 700, letterSpacing: '7px', textTransform: 'uppercase', color: NAVY, marginBottom: 24 }}>
            {restaurant.name}
          </h1>
          {restaurant.about && (
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 15, color: NAVY, lineHeight: 1.9, marginBottom: 36, opacity: 0.85, maxWidth: 380 }}>
              {restaurant.about}
            </p>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {anyLocationHas(locations, 'reservation_url') && (
              <button onClick={() => onPick('reserve')} style={PILL_BTN}
                onMouseOver={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
                onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = NAVY }}>
                Reserve
              </button>
            )}
            <button onClick={onMenuOpen} style={PILL_BTN}
              onMouseOver={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = NAVY }}>
              Menus
            </button>
            {hasSpecials && (
              <button onClick={onSpecials} style={{ ...PILL_BTN, borderColor: GOLD, color: GOLD }}
                onMouseOver={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = '#fff' }}
                onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = GOLD }}>
                Specials
              </button>
            )}
          </div>
        </div>

        {/* COLLAGE (right on desktop, bottom on mobile) */}
        {safeCollage.length > 0 && (
          <div className="site-collage-col" style={{ padding: '64px 48px', display: 'flex', alignItems: 'center' }}>
            <PhotoCollage photos={safeCollage} slot={1} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Hours dropdown ────────────────────────────────────────── */
function HoursDropdown({ locHours }) {
  const [open, setOpen] = useState(false)
  const status = getHoursStatus(locHours || [])
  const today = new Date().getDay()
  const display = locationHoursToDisplay(locHours || [])

  return (
    <div style={{ marginBottom: 24 }}>
      <button onClick={() => setOpen(o => !o)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '10px 0', width: '100%' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: status.color, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: status.color, fontWeight: 500 }}>{status.label}</span>
        <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: MUTED, marginLeft: 8 }}>
          Hours {open ? '↑' : '↓'}
        </span>
      </button>
      {open && display.map((h, i) => {
        const isToday = i === today
        return (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
            <span style={{ fontFamily: 'DM Sans', fontSize: 13, color: isToday ? NAVY : MUTED, fontWeight: isToday ? 600 : 400 }}>{h.day}</span>
            <span style={{ fontFamily: 'DM Sans', fontSize: 13, fontStyle: 'italic', color: isToday ? NAVY : (h.closed ? STONE : MUTED) }}>
              {h.closed ? 'Closed' : h.time}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Locations row — text LEFT, collage RIGHT (desktop) ────── */
function LocationsRow({ restaurant, locations, onPick, onMenuOpen, collage }) {
  const safeCollage = collage || []
  return (
    <section id="site-locations" style={{ background: '#fff' }}>
      <div className="site-split site-row-text-left" style={{ display: 'grid', gridTemplateColumns: safeCollage.length ? '1fr 1fr' : '1fr' }}>
        {/* TEXT (left on desktop, top on mobile) */}
        <div className="site-text-col" style={{ padding: '96px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: MUTED, marginBottom: 36, opacity: 0.6 }}>
            Visit Us
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: '100%', maxWidth: 380 }}>
            {(locations || []).map((loc, i) => {
              const links = getLocLinks(loc)
              const phone = loc.phone || links.phone
              return (
                <div key={loc.id || i}>
                  {locations.length > 1 && (
                    <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: MUTED, marginBottom: 8, opacity: 0.6 }}>
                      {loc.name}
                    </div>
                  )}
                  {loc.address && (
                    <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: NAVY, lineHeight: 1.8, marginBottom: 2, fontStyle: 'italic' }}>
                      {loc.address}
                    </p>
                  )}
                  {phone && (
                    <a href={`tel:${phone}`} onClick={() => trackEvent(restaurant.id, 'phone_click')}
                      style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: MUTED, fontStyle: 'italic', textDecoration: 'none', display: 'block', marginBottom: 12, transition: 'color 0.2s' }}
                      onMouseOver={e => (e.target.style.color = NAVY)} onMouseOut={e => (e.target.style.color = MUTED)}>
                      {phone}
                    </a>
                  )}
                  <HoursDropdown locHours={loc.location_hours} />
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {links.reservation_url && (
                      <button onClick={() => onPick('reserve')} style={PILL_BTN}
                        onMouseOver={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = NAVY }}>Reserve</button>
                    )}
                    {links.order_url && (
                      <button onClick={() => onPick('order')} style={{ ...PILL_BTN, color: MUTED, borderColor: MUTED }}
                        onMouseOver={e => { e.currentTarget.style.background = MUTED; e.currentTarget.style.color = '#fff' }}
                        onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = MUTED }}>Order</button>
                    )}
                    <button onClick={() => onMenuOpen(loc)} style={{ ...PILL_BTN, color: MUTED, borderColor: MUTED }}
                      onMouseOver={e => { e.currentTarget.style.background = MUTED; e.currentTarget.style.color = '#fff' }}
                      onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = MUTED }}>Menu</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* COLLAGE (right on desktop, bottom on mobile) */}
        {safeCollage.length > 0 && (
          <div className="site-collage-col" style={{ padding: '64px 48px', display: 'flex', alignItems: 'center' }}>
            <PhotoCollage photos={safeCollage} slot={2} />
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Menu Links row — collage LEFT, text RIGHT (desktop) ──── */
function MenuLinksRow({ restaurant, sections, locations, onMenuOpen, collage }) {
  const highlights = restaurant.menu_highlights || []
  if (!Array.isArray(highlights) || highlights.length === 0) return null
  const safeCollage = collage || []

  return (
    <section id="site-menu" style={{ background: WARM }}>
      <div className="site-split site-row-text-right" style={{ display: 'grid', gridTemplateColumns: safeCollage.length ? '1fr 1fr' : '1fr' }}>
        {/* COLLAGE (left on desktop, bottom on mobile via CSS order) */}
        {safeCollage.length > 0 && (
          <div className="site-collage-col" style={{ padding: '64px 48px', display: 'flex', alignItems: 'center' }}>
            <PhotoCollage photos={safeCollage} slot={3} />
          </div>
        )}
        {/* TEXT (right on desktop, top on mobile via CSS order) */}
        <div className="site-text-col" style={{ padding: '96px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: MUTED, marginBottom: 36, opacity: 0.6 }}>
            Menus
          </div>
          <div style={{ width: '100%', maxWidth: 320 }}>
            {highlights.map((h, i) => (
              <button
                key={i}
                onClick={() => onMenuOpen(null, h.section_name || h.label)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '14px 0', width: '100%', textAlign: 'center', display: 'block', transition: 'opacity 0.2s' }}
                onMouseOver={e => (e.currentTarget.style.opacity = '0.6')}
                onMouseOut={e => (e.currentTarget.style.opacity = '1')}
              >
                <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: NAVY, marginBottom: 3 }}>
                  {h.label}
                </div>
                {h.time && (
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 12, color: MUTED, fontStyle: 'italic' }}>
                    {h.time}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Private Events row — collage LEFT, text RIGHT (desktop) ─ */
function PrivateEventsRow({ restaurant, onEventsOpen, collage }) {
  if (!restaurant.events_email) return null
  const safeCollage = collage || []

  const title = restaurant.private_events_title || 'Private Events & Catering'
  const body = restaurant.private_events_body ||
    'Office lunches, client meetings, celebrations, and holiday gatherings. We host events of all sizes.'

  return (
    <section id="site-events" style={{ background: WARM }}>
      <div className="site-split site-row-text-right" style={{ display: 'grid', gridTemplateColumns: safeCollage.length ? '1fr 1fr' : '1fr' }}>
        {/* COLLAGE (left on desktop, bottom on mobile) */}
        {safeCollage.length > 0 && (
          <div className="site-collage-col" style={{ padding: '64px 48px', display: 'flex', alignItems: 'center' }}>
            <PhotoCollage photos={safeCollage} slot={4} />
          </div>
        )}
        {/* TEXT (right on desktop, top on mobile) */}
        <div className="site-text-col" style={{ padding: '96px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: GOLD, marginBottom: 24 }}>
            Entertain
          </div>
          <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(15px,2vw,22px)', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: NAVY, marginBottom: 24, lineHeight: 1.3 }}>
            {title}
          </h2>
          <p style={{ fontFamily: 'Georgia,serif', fontSize: 15, color: NAVY, lineHeight: 1.9, marginBottom: 36, opacity: 0.85, maxWidth: 420 }}>
            {body}
          </p>
          <button
            onClick={onEventsOpen}
            style={{ ...PILL_BTN, background: NAVY, color: '#fff' }}
            onMouseOver={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.borderColor = GOLD }}
            onMouseOut={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.borderColor = NAVY }}
          >
            Inquire About Events
          </button>
        </div>
      </div>
    </section>
  )
}

/* ─── Menu Modal ────────────────────────────────────────────── */
function MenuModal({ restaurant, sections, locations, activeLoc, initialTab, onClose }) {
  const filteredSections = useMemo(() => {
    if (restaurant.menu_mode === 'per_location' && activeLoc?.id) {
      return (sections || []).filter(s => s.location_id === activeLoc.id)
    }
    return (sections || []).filter(s => !s.location_id || restaurant.menu_mode !== 'per_location')
  }, [sections, activeLoc, restaurant.menu_mode])

  const initIdx = Math.max(0, filteredSections.findIndex(s => s.name === initialTab))
  const [activeTab, setActiveTab] = useState(initIdx >= 0 ? initIdx : 0)
  const [openTab, setOpenTab] = useState(initIdx >= 0 ? initIdx : 0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const active = filteredSections[activeTab] || filteredSections[0]

  const ItemList = ({ section }) => {
    if (!section) return null
    const items = [
      ...((section.items || []).filter(i => i.available !== false)),
      ...((section.items || []).filter(i => i.available === false)),
    ]
    return (
      <div>
        {section.note && (
          <div style={{ padding: '10px 0 14px', fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: GOLD }}>
            {section.note}
          </div>
        )}
        {items.map((item, i) => (
          <div key={item.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '14px 0', borderBottom: `1px solid ${BORDER}`, opacity: item.available === false ? 0.4 : 1 }}>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: NAVY, marginBottom: item.description ? 3 : 0 }}>
                {item.name}
              </div>
              {item.description && (
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 12, color: MUTED, fontStyle: 'italic', lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}
            </div>
            {item.price && (
              <div style={{ fontFamily: 'DM Sans', fontSize: 12, color: MUTED, flexShrink: 0, fontWeight: 600 }}>
                ${Number(item.price).toFixed(0)}
              </div>
            )}
          </div>
        ))}
        {section.external_url && (
          <a href={section.external_url} target="_blank" rel="noreferrer"
            style={{ display: 'block', marginTop: 20, fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: NAVY, textDecoration: 'none', borderBottom: `1px solid ${NAVY}`, paddingBottom: 3, width: 'fit-content' }}>
            View Full Menu →
          </a>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: 'min(780px,95vw)', maxHeight: '85vh', display: 'flex', flexDirection: 'column', animation: 'fadeUp 0.25s ease' }}>
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: MUTED, opacity: 0.6, marginBottom: 2 }}>
              {restaurant.menu_mode === 'per_location' ? 'Our Menu' : 'Menu'}
            </div>
            {restaurant.menu_mode === 'per_location' && activeLoc?.name && (
              <div style={{ fontFamily: 'DM Sans', fontSize: 11, color: MUTED, opacity: 0.6 }}>{activeLoc.name}</div>
            )}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, color: MUTED, lineHeight: 1 }}>✕</button>
        </div>

        {filteredSections.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: MUTED, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>Menu coming soon.</div>
        ) : !isMobile ? (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: 160, flexShrink: 0, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', padding: '16px 0' }}>
              {filteredSections.map((s, i) => (
                <button key={s.id || i} onClick={() => setActiveTab(i)}
                  style={{
                    padding: '14px 24px', border: 'none',
                    background: activeTab === i ? WARM : 'none',
                    fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                    letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
                    color: activeTab === i ? NAVY : MUTED, textAlign: 'left', transition: 'all 0.15s',
                    borderLeft: activeTab === i ? `3px solid ${NAVY}` : '3px solid transparent',
                  }}>
                  {s.name}
                </button>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px 40px' }}>
              <ItemList section={active} />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filteredSections.map((s, i) => (
              <div key={s.id || i}>
                <button onClick={() => setOpenTab(openTab === i ? null : i)}
                  style={{ width: '100%', padding: '18px 24px', background: 'none', border: 'none', borderBottom: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: NAVY }}>{s.name}</span>
                  <span style={{ color: MUTED, fontSize: 20, transition: 'transform 0.2s', display: 'inline-block', transform: openTab === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </button>
                {openTab === i && <div style={{ padding: '8px 24px 24px' }}><ItemList section={s} /></div>}
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

/* ─── Location Picker ───────────────────────────────────────── */
function LocPicker({ locations, type, onClose, onTrack }) {
  const getUrl = loc => {
    const l = getLocLinks(loc)
    if (type === 'reserve') return l.reservation_url
    if (type === 'order') return l.order_url
    return `tel:${l.phone || loc.phone || ''}`
  }
  const validLocs = (locations || []).filter(l => getUrl(l) && getUrl(l) !== 'tel:')

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: '#fff', width: 'min(400px,90vw)', padding: '36px 32px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: MUTED }}>
            {type === 'reserve' ? 'Reserve a Table' : type === 'order' ? 'Order Online' : 'Call Us'}
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: MUTED }}>✕</button>
        </div>
        {validLocs.map(loc => (
          <a key={loc.id} href={getUrl(loc)} target={type !== 'call' ? '_blank' : undefined} rel="noreferrer" onClick={() => onTrack && onTrack(`${type}_click`)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: `1px solid ${BORDER}`, textDecoration: 'none', transition: 'opacity 0.2s' }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}>
            <div>
              <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: NAVY, marginBottom: 2 }}>{loc.name}</div>
              {loc.address && <div style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: MUTED, fontStyle: 'italic' }}>{loc.address.split(',')[0]}</div>}
            </div>
            <span style={{ fontFamily: 'DM Sans', fontSize: 11, color: NAVY, fontWeight: 600, letterSpacing: '2px' }}>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}

/* ─── Inquiry Modal ─────────────────────────────────────────── */
function InquiryModal({ restaurant, mode, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', guests: '', message: '' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const isEvents = mode === 'events'
  const eyebrow = isEvents ? 'Entertain' : 'Contact'
  const heading = isEvents ? 'Private Events & Catering' : 'Get in Touch'
  const subline = isEvents
    ? 'Office lunches, client meetings, celebrations & holiday gatherings'
    : 'Have a question or want to get in touch? Send us a message.'

  async function handleSubmit() {
    if (!form.name || !form.email) return
    setSubmitting(true)
    const result = await submitInquiry({
      restaurantId: restaurant.id,
      type: isEvents ? 'events' : 'contact',
      ...form,
    })

    if (result.fallback === 'mailto') {
      const target = result.email || (isEvents ? restaurant.events_email : restaurant.email) || restaurant.email
      if (target) {
        const subject = encodeURIComponent(isEvents ? 'Private Event Inquiry' : 'Inquiry')
        const body = encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n` +
          (isEvents ? `Date: ${form.date}\nGuests: ${form.guests}\n\n` : '\n') +
          form.message
        )
        window.location.href = `mailto:${target}?subject=${subject}&body=${body}`
        setSent(true)
      }
    } else if (result.error) {
      alert('Something went wrong. Please try again or call us directly.')
    } else {
      setSent(true)
    }
    setSubmitting(false)
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const input = {
    width: '100%', fontFamily: 'Georgia,serif', fontSize: 14,
    color: NAVY, background: '#fff', border: 'none',
    borderBottom: `1px solid ${BORDER}`, padding: '10px 0',
    outline: 'none', marginBottom: 20,
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: 'min(540px,100vw)', maxHeight: '90vh', overflowY: 'auto', padding: '48px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: MUTED, marginBottom: 8 }}>{eyebrow}</div>
            <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(16px,2vw,20px)', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: NAVY }}>{heading}</h2>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: MUTED, fontStyle: 'italic', marginTop: 8, lineHeight: 1.6 }}>{subline}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: MUTED, lineHeight: 1, flexShrink: 0 }}>✕</button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontFamily: 'DM Sans', fontSize: 13, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: NAVY, marginBottom: 12 }}>Thank You</div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: MUTED, fontStyle: 'italic', lineHeight: 1.8 }}>Your message has been sent. We'll be in touch shortly.</p>
            <button onClick={onClose} style={{ marginTop: 24, background: 'none', border: 'none', fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: NAVY, cursor: 'pointer', borderBottom: `1px solid ${NAVY}`, paddingBottom: 3 }}>Close</button>
          </div>
        ) : (
          <>
            <input style={input} placeholder="Your Name" value={form.name} onChange={set('name')} />
            <input style={input} placeholder="Email Address" value={form.email} onChange={set('email')} />
            <input style={input} placeholder="Phone Number" value={form.phone} onChange={set('phone')} />
            {isEvents && <input style={input} placeholder="Event Date" value={form.date} onChange={set('date')} />}
            {isEvents && <input style={input} placeholder="Number of Guests" value={form.guests} onChange={set('guests')} />}
            <textarea style={{ ...input, resize: 'vertical', minHeight: 80, marginBottom: 32 }} placeholder={isEvents ? 'Tell us about your event' : 'Your message'} value={form.message} onChange={set('message')} />
            <button onClick={handleSubmit} disabled={submitting || !form.name || !form.email}
              style={{
                width: '100%', padding: '16px',
                background: NAVY, color: '#fff', border: 'none',
                fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700,
                letterSpacing: '4px', textTransform: 'uppercase',
                cursor: submitting ? 'wait' : 'pointer',
                opacity: submitting || !form.name || !form.email ? 0.6 : 1,
              }}>
              {submitting ? 'Sending…' : 'Send Inquiry'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/* ─── Announcement Popup ────────────────────────────────────── */
function AnnouncementPopup({ restaurant, onClose, onReserve }) {
  const items = (restaurant.announcement_items || []).filter(it => (it?.label?.trim() || it?.text?.trim()))
  const today = new Date().getDay()
  const dayName = DAYS_FULL[today]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (items.length === 0) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div style={{ position: 'relative', background: '#fff', width: 'min(520px,92vw)', maxHeight: '90vh', overflowY: 'auto', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ padding: '32px 32px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {restaurant.announcement_eyebrow && (
              <div style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: GOLD, marginBottom: 8 }}>
                {restaurant.announcement_eyebrow}
              </div>
            )}
            <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(18px,3vw,26px)', fontWeight: 700, letterSpacing: '5px', textTransform: 'uppercase', color: NAVY, lineHeight: 1.2 }}>
              {restaurant.announcement_title || 'Announcements'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: MUTED, lineHeight: 1, flexShrink: 0, marginLeft: 16 }}>✕</button>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>
          {items.map((s, i) => {
            const isToday = s.label === dayName
            return (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 0', borderBottom: `1px solid ${BORDER}`, alignItems: 'flex-start' }}>
                {s.label && (
                  <div style={{ fontFamily: 'DM Sans', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: isToday ? GOLD : NAVY, minWidth: 90, paddingTop: 2, opacity: isToday ? 1 : 0.7 }}>
                    {s.label}
                    {isToday && <div style={{ fontSize: 9, letterSpacing: '1px', color: GOLD, marginTop: 2 }}>TODAY</div>}
                  </div>
                )}
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: NAVY, lineHeight: 1.7, fontStyle: 'italic', flex: 1 }}>{s.text}</div>
              </div>
            )
          })}
          {onReserve && (
            <button onClick={onReserve}
              style={{ ...PILL_BTN, marginTop: 28, width: '100%', justifyContent: 'center', display: 'flex' }}
              onMouseOver={e => { e.currentTarget.style.background = NAVY; e.currentTarget.style.color = '#fff' }}
              onMouseOut={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = NAVY }}>
              Reserve a Table
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ─── Social icons ──────────────────────────────────────────── */
function SocialIcons({ restaurant, color = 'rgba(255,255,255,0.5)', hoverColor = '#fff' }) {
  const ig = normalizeSocialUrl(restaurant.instagram, 'instagram')
  const fb = normalizeSocialUrl(restaurant.facebook, 'facebook')
  const tt = normalizeSocialUrl(restaurant.tiktok, 'tiktok')

  if (!ig && !fb && !tt) return null

  const Icon = ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `1px solid ${color}`, color,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', transition: 'all 0.2s',
      }}
      onMouseOver={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.borderColor = hoverColor }}
      onMouseOut={e => { e.currentTarget.style.color = color; e.currentTarget.style.borderColor = color }}>
      {children}
    </a>
  )

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16 }}>
      {ig && (
        <Icon href={ig}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
        </Icon>
      )}
      {fb && (
        <Icon href={fb}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
          </svg>
        </Icon>
      )}
      {tt && (
        <Icon href={tt}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.3a8.16 8.16 0 0 0 4.77 1.52V6.36a4.85 4.85 0 0 1-1.84-.27z" />
          </svg>
        </Icon>
      )}
    </div>
  )
}

/* ─── Footer ────────────────────────────────────────────────── */
function Footer({ restaurant, locations, onContactOpen, onEventsOpen }) {
  const hasEvents = !!restaurant.events_email
  return (
    <footer style={{ background: NAVY, padding: '56px 48px 40px', textAlign: 'center' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
          {(locations || []).map((loc, i) =>
            loc.address ? (
              <a key={i} href={`https://maps.google.com?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer"
                style={{ fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseOver={e => (e.target.style.color = '#fff')}
                onMouseOut={e => (e.target.style.color = 'rgba(255,255,255,0.5)')}>
                {loc.address}
              </a>
            ) : null
          )}
        </div>
        {(locations || []).map((loc, i) => {
          const phone = loc.phone || getLocLinks(loc).phone
          if (!phone) return null
          return (
            <a key={i} href={`tel:${phone}`}
              style={{ display: 'block', fontFamily: 'Georgia,serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', textDecoration: 'none', marginBottom: 4, transition: 'color 0.2s' }}
              onMouseOver={e => (e.target.style.color = '#fff')}
              onMouseOut={e => (e.target.style.color = 'rgba(255,255,255,0.5)')}>
              {locations.length > 1 ? `${loc.name} · ` : ''}{phone}
            </a>
          )
        })}

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
          <button onClick={onContactOpen}
            style={{ background: 'none', border: 'none', fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseOver={e => (e.target.style.color = '#fff')}
            onMouseOut={e => (e.target.style.color = 'rgba(255,255,255,0.5)')}>
            Contact Us
          </button>
          {hasEvents && (
            <button onClick={onEventsOpen}
              style={{ background: 'none', border: 'none', fontFamily: 'DM Sans', fontSize: 11, fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={e => (e.target.style.color = '#fff')}
              onMouseOut={e => (e.target.style.color = 'rgba(255,255,255,0.5)')}>
              Private Events
            </button>
          )}
        </div>

        <SocialIcons restaurant={restaurant} />

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, marginTop: 32, fontFamily: 'DM Sans', fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '1px' }}>
          © {new Date().getFullYear()} {restaurant.name} ·{' '}
          <a href="https://ecwebco.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}>Website by EC Web Co</a>
        </div>
      </div>
    </footer>
  )
}

/* ─── Sticky Bar ────────────────────────────────────────────── */
function StickyBar({ locations, onPick }) {
  const hasOrder = anyLocationHas(locations, 'order_url')
  const hasReserve = anyLocationHas(locations, 'reservation_url')
  const hasPhone = (locations || []).some(l => l.phone || getLocLinks(l).phone)

  if (!hasOrder && !hasReserve && !hasPhone) return null

  const btn = (label, onClick, primary = false) => (
    <button onClick={onClick}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '14px 8px',
        background: primary ? NAVY : '#fff',
        color: primary ? '#fff' : NAVY, border: 'none', cursor: 'pointer',
        fontFamily: 'DM Sans', fontSize: 11, fontWeight: primary ? 600 : 500,
        letterSpacing: '0.5px', textTransform: 'uppercase',
        borderRight: primary ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${BORDER}`,
      }}>
      {label}
    </button>
  )

  return (
    <>
      <div className="site-sticky" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200, display: 'none', background: '#fff', borderTop: `1px solid ${BORDER}`, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {hasReserve && btn('Reserve', () => onPick('reserve'), true)}
        {hasOrder && btn('Order', () => onPick('order'))}
        {hasPhone && btn('Call', () => onPick('call'))}
      </div>
      <div className="site-sticky-spacer" style={{ display: 'none', height: 56 }} />
      <style>{`@media(max-width:768px){.site-sticky{display:flex!important}.site-sticky-spacer{display:block!important}}`}</style>
    </>
  )
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function RestaurantSite({ data }) {
  const restaurant = data?.restaurant || {}
  const sections = data?.sections || []
  const heroPhotos = data?.heroPhotos || []
  const locations = data?.locations || []
  const collages = data?.collages || {}

  const [activeLoc, setActiveLoc] = useState(locations[0] || null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuLoc, setMenuLoc] = useState(locations[0] || null)
  const [menuTab, setMenuTab] = useState(null)
  const [inquiry, setInquiry] = useState(null)
  const [picker, setPicker] = useState(null)
  const [announcementOpen, setAnnouncementOpen] = useState(false)

  const isMulti = locations.length > 1
  const announcementItems = (restaurant.announcement_items || []).filter(it => (it?.label?.trim() || it?.text?.trim()))
  const hasAnnouncement = restaurant.announcement_enabled && announcementItems.length > 0

  useEffect(() => {
    if (!hasAnnouncement) return
    const seen = sessionStorage.getItem(`ann_${restaurant.id}`)
    if (seen) return
    const t = setTimeout(() => {
      setAnnouncementOpen(true)
      sessionStorage.setItem(`ann_${restaurant.id}`, '1')
    }, 2000)
    return () => clearTimeout(t)
  }, [restaurant.id, hasAnnouncement])

  function handlePick(type) {
    if (type === 'call') {
      if (!isMulti) {
        const phone = locations[0]?.phone || getLocLinks(locations[0]).phone
        if (phone) {
          trackEvent(restaurant.id, 'phone_click')
          window.location.href = `tel:${phone}`
        }
        return
      }
      setPicker('call')
      return
    }

    if (!isMulti) {
      const links = getLocLinks(locations[0])
      const url = type === 'order' ? links.order_url : links.reservation_url
      if (url) {
        trackEvent(restaurant.id, `${type}_click`)
        window.open(url, '_blank')
      }
      return
    }
    setPicker(type)
  }

  function openMenu(loc, tab) {
    setMenuLoc(loc || activeLoc)
    setMenuTab(tab || null)
    setMenuOpen(true)
  }

  const showPrivateEvents = !!restaurant.events_email

  return (
    <div style={{ fontFamily: 'DM Sans,sans-serif', background: '#fff', color: NAVY, overflowX: 'hidden' }}>
      <Nav
        restaurant={restaurant}
        locations={locations}
        onMenuOpen={() => openMenu()}
        onPick={handlePick}
        onEventsOpen={() => setInquiry('events')}
        onContactOpen={() => setInquiry('contact')}
      />

      <Hero restaurant={restaurant} heroPhotos={heroPhotos} />

      <AboutRow
        restaurant={restaurant}
        locations={locations}
        onMenuOpen={() => openMenu()}
        onPick={handlePick}
        onSpecials={() => setAnnouncementOpen(true)}
        hasSpecials={hasAnnouncement}
        collage={collages.collage_1}
      />

      {showPrivateEvents && (
        <PrivateEventsRow
          restaurant={restaurant}
          onEventsOpen={() => setInquiry('events')}
          collage={collages.collage_4}
        />
      )}

      <LocationsRow
        restaurant={restaurant}
        locations={locations}
        onPick={handlePick}
        onMenuOpen={openMenu}
        collage={collages.collage_2}
      />

      <MenuLinksRow
        restaurant={restaurant}
        sections={sections}
        locations={locations}
        onMenuOpen={openMenu}
        collage={collages.collage_3}
      />

      <Footer
        restaurant={restaurant}
        locations={locations}
        onContactOpen={() => setInquiry('contact')}
        onEventsOpen={() => setInquiry('events')}
      />

      <StickyBar locations={locations} onPick={handlePick} />

      {menuOpen && (
        <MenuModal restaurant={restaurant} sections={sections} locations={locations} activeLoc={menuLoc} initialTab={menuTab} onClose={() => setMenuOpen(false)} />
      )}
      {inquiry && <InquiryModal restaurant={restaurant} mode={inquiry} onClose={() => setInquiry(null)} />}
      {picker && (
        <LocPicker locations={locations} type={picker} onClose={() => setPicker(null)} onTrack={evt => trackEvent(restaurant.id, evt)} />
      )}
      {announcementOpen && (
        <AnnouncementPopup
          restaurant={restaurant}
          onClose={() => setAnnouncementOpen(false)}
          onReserve={anyLocationHas(locations, 'reservation_url') ? () => { setAnnouncementOpen(false); handlePick('reserve') } : null}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        img{display:block;max-width:100%}

        @media(max-width:768px){
          .site-split{grid-template-columns:1fr!important}
          .site-text-col{padding:64px 24px!important}
          .site-collage-col{padding:32px 24px 64px!important}
          .site-hero{height:75vh!important;padding-top:0!important}
          nav{padding:0 24px!important}
          /* On mobile, ALWAYS show text first then collage, regardless of desktop side */
          .site-row-text-right .site-text-col{order:1}
          .site-row-text-right .site-collage-col{order:2}
        }
      `}</style>
    </div>
  )
}
