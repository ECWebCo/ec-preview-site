import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}${m > 0 ? ':'+String(m).padStart(2,'0') : ''} ${h >= 12 ? 'PM' : 'AM'}`
}

function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.04 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const ref = useRef(null); useReveal(ref, index * 0.12)
  const locHours = loc.location_hours?.length > 0 ? loc.location_hours : fallbackHours
  const locLinks = loc.location_links?.[0] || fallbackLinks || {}
  const address = loc.address

  return (
    <div ref={ref} className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'start' }} id={`loc-card-${index}`}>

      {/* Info column */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 40, height: 1, background: '#C9A84C' }} />
          <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C' }}>
            {index === 0 ? 'Find Us' : `Location ${index + 1}`}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, fontStyle: 'italic', color: '#1C1C1A', lineHeight: 1.05, margin: '0 0 24px' }}>
          {loc.name || restaurant.name}
        </h3>

        {address && (
          <div style={{ fontSize: 15, color: '#9A958E', marginBottom: 10, fontFamily: 'DM Sans', lineHeight: 1.6, display: 'flex', gap: 10 }}>
            <span style={{ color: '#C9A84C', flexShrink: 0 }}>→</span>
            <span>{address}</span>
          </div>
        )}
        {(loc.phone || locLinks.phone) && (
          <div style={{ fontSize: 15, color: '#9A958E', marginBottom: 32, fontFamily: 'DM Sans', display: 'flex', gap: 10 }}>
            <span style={{ color: '#C9A84C', flexShrink: 0 }}>✆</span>
            <a href={`tel:${loc.phone || locLinks.phone}`} style={{ color: '#9A958E', textDecoration: 'none' }} onMouseOver={e => e.target.style.color='#1a1a1a'} onMouseOut={e => e.target.style.color='#9A958E'}>
              {loc.phone || locLinks.phone}
            </a>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {locLinks.order_url && <a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-gold" style={{ padding: '11px 24px', fontSize: 12 }}>Order Online</a>}
          {locLinks.reservation_url && <a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} className="btn-outline" style={{ padding: '10px 24px', fontSize: 12 }}>Reserve</a>}
          {(loc.phone || locLinks.phone) && <a href={`tel:${loc.phone||locLinks.phone}`} onClick={() => trackEvent(restaurant.id,'phone_click')} style={{ padding: '10px 20px', background: '#F5F2EC', color: '#1C1C1A', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, display: 'inline-block', border: '1px solid #E8E4DE', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background='#EDE9E2'} onMouseOut={e => e.currentTarget.style.background='#F5F2EC'}>Call</a>}
        </div>

        {locHours.length > 0 && (
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#C8C4BE', marginBottom: 12, fontFamily: 'DM Sans', fontWeight: 600 }}>Hours</p>
            <div style={{ background: '#fff', border: '1px solid #E8E4DE', overflow: 'hidden' }}>
              {DAYS.map((day, di) => {
                const h = locHours.find(r => r.day_of_week === di)
                const isToday = di === today
                return (
                  <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 18px', borderBottom: di < 6 ? '1px solid #F0EDE8' : 'none', background: isToday ? 'rgba(201,168,76,0.05)' : 'transparent', position: 'relative' }}>
                    {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: '#C9A84C' }} />}
                    <span style={{ fontSize: 12, fontFamily: 'DM Sans', color: isToday ? '#1C1C1A' : '#9A958E', fontWeight: isToday ? 700 : 400 }}>{day}</span>
                    <span style={{ fontSize: 13, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: isToday ? '#C9A84C' : (!h || h.closed ? '#D8D5CF' : '#9A958E') }}>
                      {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Map column — large, prominent */}
      {address && (
        <a href={`https://maps.google.com?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer"
          style={{ display: 'block', textDecoration: 'none', overflow: 'hidden', position: 'relative', aspectRatio: '4/3', background: '#E8E4DE', boxShadow: '0 16px 64px rgba(0,0,0,0.1)', transition: 'transform 0.4s ease, box-shadow 0.4s ease' }}
          onMouseOver={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 24px 80px rgba(0,0,0,0.15)' }}
          onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 16px 64px rgba(0,0,0,0.1)' }}>
          <iframe title="map" width="100%" height="100%" style={{ border: 0, display: 'block', filter: 'grayscale(25%) contrast(1.05)', pointerEvents: 'none' }} loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(28,28,26,0.75), transparent)', padding: '20px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans', maxWidth: '75%', lineHeight: 1.4 }}>{address}</span>
            <span style={{ fontSize: 11, color: '#C9A84C', fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Get Directions →</span>
          </div>
        </a>
      )}
    </div>
  )
}

export default function LocationSection({ restaurant, hours, links, locations }) {
  const headerRef = useRef(null); useReveal(headerRef)
  const locs = locations?.length > 0 ? locations
    : restaurant.locations?.length > 0 ? restaurant.locations
    : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone, location_hours: [], location_links: [links] }]

  return (
    <section id="location-section" style={{ background: '#fff', borderTop: '1px solid #E8E4DE' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 64px' }}>
        {locs.map((loc, i) => (
          <div key={loc.id || i}>
            {i > 0 && <div style={{ height: 1, background: '#E8E4DE', margin: '80px 0' }} />}
            <LocationCard loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          #location-section > div { padding: 72px 24px !important; }
          [id^="loc-card-"] { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
