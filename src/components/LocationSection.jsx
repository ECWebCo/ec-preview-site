import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}${m > 0 ? ':' + String(m).padStart(2, '0') : ''} ${ampm}`
}

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

function MapEmbed({ address }) {
  if (!address) return null
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(address)}`
  return (
    <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 24, textDecoration: 'none' }}>
      <div style={{ height: 200, background: 'var(--mist)', overflow: 'hidden', position: 'relative' }}>
        <iframe title="map" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(30%) contrast(1.05)' }} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(20,18,16,0.9), transparent)',
          padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans', maxWidth: '70%' }}>{address}</span>
          <span style={{ fontSize: 10, color: 'var(--gold)', fontFamily: 'DM Sans', letterSpacing: 1.5, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Directions →</span>
        </div>
      </div>
    </a>
  )
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const cardRef = useRef(null)
  useReveal(cardRef)
  const locHours = loc.location_hours?.length > 0 ? loc.location_hours : fallbackHours
  const locLinks = loc.location_links?.[0] || fallbackLinks || {}

  return (
    <div ref={cardRef} className={`reveal location-card delay-${index + 1}`}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 96, fontWeight: 900, color: 'rgba(201,168,76,0.07)', lineHeight: 1, marginBottom: -12, userSelect: 'none' }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, fontWeight: 700, color: 'var(--ink)', marginBottom: 20, letterSpacing: '-0.3px' }}>
        {loc.name || restaurant.name}
      </div>

      {loc.address && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, fontFamily: 'DM Sans' }}>
          <span style={{ color: 'var(--gold)', flexShrink: 0 }}>↗</span>{loc.address}
        </div>
      )}
      {(loc.phone || locLinks.phone) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 14, color: 'var(--muted)', fontFamily: 'DM Sans' }}>
          <span style={{ color: 'var(--gold)', flexShrink: 0 }}>✆</span>
          <a href={`tel:${loc.phone || locLinks.phone}`} style={{ color: 'var(--muted)' }}>{loc.phone || locLinks.phone}</a>
        </div>
      )}

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 20, marginBottom: 24 }}>
        {locLinks.order_url && (
          <a href={locLinks.order_url} target="_blank" rel="noreferrer"
            onClick={() => trackEvent(restaurant.id, 'order_click')}
            className="btn-gold" style={{ padding: '10px 20px', fontSize: 10 }}>
            Order Online
          </a>
        )}
        {locLinks.reservation_url && (
          <a href={locLinks.reservation_url} target="_blank" rel="noreferrer"
            onClick={() => trackEvent(restaurant.id, 'reserve_click')}
            style={{ padding: '9px 20px', background: 'var(--stone)', color: '#fff', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans', display: 'inline-block', transition: 'opacity 0.2s' }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.75'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
          >Reserve</a>
        )}
        {(loc.phone || locLinks.phone) && (
          <a href={`tel:${loc.phone || locLinks.phone}`}
            onClick={() => trackEvent(restaurant.id, 'phone_click')}
            style={{ padding: '9px 20px', background: 'var(--mist)', color: 'var(--ink)', fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans', display: 'inline-block' }}
          >Call</a>
        )}
      </div>

      {/* Hours mini table */}
      {locHours.length > 0 && (
        <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 20 }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 12, fontFamily: 'DM Sans' }}>Hours</div>
          {DAYS.map((day, di) => {
            const h = locHours.find(r => r.day_of_week === di)
            const isToday = di === today
            return (
              <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(232,226,217,0.6)', fontSize: 13 }}>
                <span style={{ color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 600 : 400, fontFamily: 'DM Sans' }}>{day}</span>
                <span style={{ color: isToday ? 'var(--gold-dk)' : (!h || h.closed ? '#C2BFB8' : 'var(--muted)'), fontStyle: (!h || h.closed) ? 'italic' : 'normal', fontFamily: isToday ? 'Playfair Display, serif' : 'DM Sans' }}>
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
  const headerRef = useRef(null)
  useReveal(headerRef)

  const locs = locations?.length > 0
    ? locations
    : restaurant.locations?.length > 0
      ? restaurant.locations
      : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone, location_hours: [], location_links: [links] }]

  return (
    <section id="location-section" style={{ padding: '120px 0', background: 'var(--warm)' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 56px' }}>
        <div ref={headerRef} className="reveal" style={{ marginBottom: 72 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
            <span style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>
              {locs.length > 1 ? 'Our Locations' : 'Location'}
            </span>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(48px, 6vw, 88px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 0.95, letterSpacing: '-1px' }}>
            Where to<br />
            <em style={{ fontWeight: 400, color: 'transparent', WebkitTextStroke: '1.5px var(--gold-dk)' }}>Find Us</em>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(locs.length, 2)}, 1fr)`, gap: 28 }}>
          {locs.map((loc, i) => (
            <LocationCard key={loc.id || i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #location-section { padding: 80px 0 !important; }
          #location-section > div { padding: 0 24px !important; }
          #location-section .reveal { grid-template-columns: 1fr !important; }
          #location-section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
