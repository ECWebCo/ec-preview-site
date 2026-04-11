import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}${m > 0 ? ':' + String(m).padStart(2,'0') : ''} ${h >= 12 ? 'PM' : 'AM'}`
}
function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

function MapEmbed({ address }) {
  if (!address) return null
  return (
    <a href={`https://maps.google.com?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 20 }}>
      <div style={{ height: 180, background: '#eee', overflow: 'hidden', position: 'relative' }}>
        <iframe title="map" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(15%)' }} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.45), transparent)', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans', maxWidth: '72%' }}>{address}</span>
          <span style={{ fontSize: 10, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 0.5 }}>Directions →</span>
        </div>
      </div>
    </a>
  )
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const ref = useRef(null); useReveal(ref, index * 0.1)
  const locHours = loc.location_hours?.length > 0 ? loc.location_hours : fallbackHours
  const locLinks = loc.location_links?.[0] || fallbackLinks || {}

  return (
    <div ref={ref} className="reveal" style={{ background: '#fff', border: '1px solid var(--border)', padding: 32, transition: 'transform 0.35s ease, box-shadow 0.35s ease' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.07)' }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 20 }}>
        {loc.name || restaurant.name}
      </div>
      {loc.address && <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 8, fontFamily: 'DM Sans', lineHeight: 1.6 }}>📍 {loc.address}</div>}
      {(loc.phone || locLinks.phone) && (
        <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 20, fontFamily: 'DM Sans' }}>
          📞 <a href={`tel:${loc.phone || locLinks.phone}`} style={{ color: 'var(--muted)' }}>{loc.phone || locLinks.phone}</a>
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {locLinks.order_url && <a href={locLinks.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-gold" style={{ padding: '9px 18px', fontSize: 11 }}>Order</a>}
        {locLinks.reservation_url && <a href={locLinks.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} className="btn-outline" style={{ padding: '8px 18px', fontSize: 11 }}>Reserve</a>}
        {(loc.phone || locLinks.phone) && <a href={`tel:${loc.phone||locLinks.phone}`} onClick={() => trackEvent(restaurant.id,'phone_click')} style={{ padding: '8px 18px', background: 'var(--section)', color: 'var(--ink)', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, display: 'inline-block', border: '1px solid var(--border)' }}>Call</a>}
      </div>
      {locHours.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 18 }}>
          <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Sans' }}>Hours</p>
          {DAYS.map((day, di) => {
            const h = locHours.find(r => r.day_of_week === di)
            const isToday = di === today
            return (
              <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #f8f8f6', fontSize: 13 }}>
                <span style={{ color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 600 : 400, fontFamily: 'DM Sans' }}>{day}</span>
                <span style={{ color: isToday ? 'var(--accent)' : (!h || h.closed ? '#ddd' : 'var(--muted)'), fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
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
  const ref = useRef(null); useReveal(ref)
  const locs = locations?.length > 0 ? locations : restaurant.locations?.length > 0 ? restaurant.locations : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone, location_hours: [], location_links: [links] }]

  return (
    <section id="location-section" style={{ padding: '100px 0', background: 'var(--section)', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px' }}>
        <div ref={ref} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 36, height: 1, background: 'var(--accent)' }} />
            {locs.length > 1 ? 'Our Locations' : 'Find Us'}
            <span style={{ display: 'inline-block', width: 36, height: 1, background: 'var(--accent)' }} />
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.1 }}>
            Come See Us
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(locs.length, 2)}, 1fr)`, gap: 24 }}>
          {locs.map((loc, i) => <LocationCard key={loc.id || i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} />)}
        </div>
      </div>
      <style>{`
        @media (max-width:768px) {
          #location-section { padding: 72px 0 !important; }
          #location-section > div { padding: 0 24px !important; }
          #location-section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
