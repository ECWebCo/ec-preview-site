import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}${m > 0 ? ':'+String(m).padStart(2,'0') : ''} ${ampm}`
}
function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

function MapEmbed({ address }) {
  if (!address) return null
  return (
    <a href={`https://maps.google.com?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 20 }}>
      <div style={{ height: 180, background: '#111', overflow: 'hidden', position: 'relative' }}>
        <iframe title="map" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(1.1)' }} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.95), transparent)', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans', maxWidth: '70%' }}>{address}</span>
          <span style={{ fontSize: 10, color: 'var(--orange)', fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Get Directions →</span>
        </div>
      </div>
    </a>
  )
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const ref = useRef(null); useReveal(ref)
  const locHours = loc.location_hours?.length > 0 ? loc.location_hours : fallbackHours
  const locLinks = loc.location_links?.[0] || fallbackLinks || {}

  return (
    <div ref={ref} className={`reveal loc-card d${index+1}`}>
      <div style={{ fontFamily: 'DM Sans', fontSize: 80, fontWeight: 800, color: 'rgba(255,92,0,0.06)', lineHeight: 1, marginBottom: -8, userSelect: 'none' }}>
        {String(index+1).padStart(2,'0')}
      </div>
      <div style={{ fontFamily: 'DM Sans', fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 20, letterSpacing: '-0.5px' }}>
        {loc.name || restaurant.name}
      </div>
      {loc.address && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>
          <span style={{ color: 'var(--orange)' }}>→</span>{loc.address}
        </div>
      )}
      {(loc.phone || locLinks.phone) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, fontSize: 14, color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans' }}>
          <span style={{ color: 'var(--orange)' }}>✆</span>
          <a href={`tel:${loc.phone || locLinks.phone}`} style={{ color: 'rgba(255,255,255,0.4)' }}>{loc.phone || locLinks.phone}</a>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {locLinks.order_url && <a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-orange" style={{ padding: '10px 20px', fontSize: 11 }}>Order Online</a>}
        {locLinks.reservation_url && <a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} style={{ padding: '9px 20px', background: '#222', color: '#fff', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, display: 'inline-block', letterSpacing: 0.5 }}>Reserve</a>}
        {(loc.phone || locLinks.phone) && <a href={`tel:${loc.phone||locLinks.phone}`} onClick={() => trackEvent(restaurant.id,'phone_click')} style={{ padding: '9px 20px', background: '#1a1a1a', color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'DM Sans', display: 'inline-block', border: '1px solid #333' }}>Call</a>}
      </div>
      {locHours.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#444', marginBottom: 12, fontFamily: 'DM Sans' }}>Hours</div>
          {DAYS.map((day, di) => {
            const h = locHours.find(r => r.day_of_week === di)
            const isToday = di === today
            return (
              <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                <span style={{ color: isToday ? '#fff' : '#444', fontWeight: isToday ? 700 : 400, fontFamily: 'DM Sans' }}>{day}</span>
                <span style={{ color: isToday ? 'var(--orange)' : '#333', fontFamily: 'DM Sans', fontWeight: isToday ? 700 : 400 }}>
                  {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                </span>
              </div>
            )
          })}
        </div>
      )}
      <MapEmbed address={loc.address} />
    </div>
  )
}

export default function LocationSection({ restaurant, hours, links, locations }) {
  const headerRef = useRef(null); useReveal(headerRef)
  const locs = locations?.length > 0 ? locations : restaurant.locations?.length > 0 ? restaurant.locations : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone, location_hours: [], location_links: [links] }]

  return (
    <section id="location-section" style={{ padding: '120px 0', background: 'var(--black)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px' }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 64 }}>
          <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', marginBottom: 20 }}>{locs.length > 1 ? 'Our Locations' : 'Find Us'}</div>
          <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(44px,6vw,80px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px' }}>
            Come<br /><span style={{ color: 'var(--orange)' }}>find us.</span>
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(locs.length,2)},1fr)`, gap: 24 }}>
          {locs.map((loc, i) => <LocationCard key={loc.id||i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} />)}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          #location-section { padding: 80px 0 !important; }
          #location-section > div { padding: 0 24px !important; }
          #location-section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
