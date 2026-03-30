import { trackEvent } from '../lib/supabase'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}${ampm}`
}

function MapEmbed({ address }) {
  if (!address) return null
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(address)}`
  return (
    <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 20, textDecoration: 'none' }}>
      <div style={{ height: 180, background: 'var(--mist)', borderRadius: 4, overflow: 'hidden', position: 'relative', cursor: 'pointer' }}>
        <iframe title="map" width="100%" height="100%" style={{ border: 0, filter: 'grayscale(20%)' }} loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(42,37,32,0.8), transparent)', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{address}</span>
          <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>Get Directions →</span>
        </div>
      </div>
    </a>
  )
}

function LocationCard({ loc, index, restaurant, fallbackHours, fallbackLinks }) {
  const today = new Date().getDay()
  const locHours = loc.location_hours?.length > 0 ? loc.location_hours : fallbackHours
  const locLinks = loc.location_links?.[0] || fallbackLinks || {}

  return (
    <div style={{ background: '#fff', border: '1px solid var(--mist)', padding: 32 }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 64, fontWeight: 900, color: 'var(--mist)', lineHeight: 1, marginBottom: -8 }}>
        {String(index + 1).padStart(2, '0')}
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>
        {loc.name || restaurant.name}
      </div>

      {loc.address && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          <span style={{ color: 'var(--gold)' }}>⊙</span>{loc.address}
        </div>
      )}
      {(loc.phone || locLinks.phone) && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'var(--muted)' }}>
          <span style={{ color: 'var(--gold)' }}>✆</span>
          <a href={`tel:${loc.phone || locLinks.phone}`} style={{ color: 'var(--muted)' }}>{loc.phone || locLinks.phone}</a>
        </div>
      )}

      {/* CTA buttons for this location */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16, marginBottom: 20 }}>
        {locLinks.order_url && (
          <a href={locLinks.order_url} target="_blank" rel="noreferrer"
            onClick={() => trackEvent(restaurant.id, 'order_click')}
            style={{ padding: '9px 18px', background: 'var(--gold)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none', fontWeight: 500 }}>
            Order Online
          </a>
        )}
        {locLinks.reservation_url && (
          <a href={locLinks.reservation_url} target="_blank" rel="noreferrer"
            onClick={() => trackEvent(restaurant.id, 'reserve_click')}
            style={{ padding: '9px 18px', background: 'var(--stone)', color: '#fff', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>
            Reserve
          </a>
        )}
        {(loc.phone || locLinks.phone) && (
          <a href={`tel:${loc.phone || locLinks.phone}`}
            onClick={() => trackEvent(restaurant.id, 'phone_click')}
            style={{ padding: '9px 18px', background: 'var(--mist)', color: 'var(--ink)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>
            Call
          </a>
        )}
      </div>

      {/* Hours */}
      {locHours.length > 0 && (
        <div style={{ borderTop: '1px solid var(--mist)', paddingTop: 16 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>Hours</div>
          {DAYS.map((day, di) => {
            const h = locHours.find(r => r.day_of_week === di)
            const isToday = di === today
            return (
              <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--mist)', fontSize: 13 }}>
                <span style={{ color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 500 : 400 }}>{day}</span>
                <span style={{ color: isToday ? 'var(--gold-dark)' : (!h || h.closed ? '#C2BFB8' : 'var(--muted)'), fontStyle: (!h || h.closed) ? 'italic' : 'normal' }}>
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
  // Use new locations table if available, fall back to legacy JSON locations
  const locs = locations?.length > 0
    ? locations
    : restaurant.locations?.length > 0
      ? restaurant.locations
      : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone, location_hours: [], location_links: [links] }]

  return (
    <section id="location-section" style={{ padding: '96px 48px', background: 'var(--warm)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {locs.length > 1 ? 'Our Locations' : 'Location'}
          </span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 48 }}>
          Where to<br /><em style={{ fontWeight: 400 }}>Find Us</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(locs.length, 2)}, 1fr)`, gap: 24 }}>
          {locs.map((loc, i) => (
            <LocationCard key={loc.id || i} loc={loc} index={i} restaurant={restaurant} fallbackHours={hours} fallbackLinks={links} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #location-section { padding: 64px 24px !important; }
          #location-section > div > div:last-child { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
