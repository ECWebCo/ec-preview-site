const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}${ampm}`
}

function GoogleMapEmbed({ address }) {
  if (!address) return null
  const src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72NouZr74WwhQu7yikjbs9T7I&q=${encodeURIComponent(address)}`
  // Use a static map link since embed API needs a key — link to Google Maps instead
  const mapsUrl = `https://maps.google.com?q=${encodeURIComponent(address)}`
  return (
    <a href={mapsUrl} target="_blank" rel="noreferrer" style={{ display: 'block', marginTop: 20, textDecoration: 'none' }}>
      <div style={{
        height: 180, background: 'var(--mist)', borderRadius: 4, overflow: 'hidden',
        position: 'relative', cursor: 'pointer'
      }}>
        <iframe
          title="map"
          width="100%" height="100%"
          style={{ border: 0, filter: 'grayscale(20%)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(to top, rgba(42,37,32,0.8), transparent)',
          padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{address}</span>
          <span style={{ fontSize: 11, color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif', letterSpacing: 1, textTransform: 'uppercase' }}>Get Directions →</span>
        </div>
      </div>
    </a>
  )
}

export default function LocationSection({ restaurant, hours, links }) {
  const today = new Date().getDay()
  const regularHours = hours.filter(h => !h.label)

  const locations = restaurant.locations?.length > 0
    ? restaurant.locations
    : [{ name: restaurant.name, address: restaurant.address, phone: links?.phone }]

  return (
    <section id="location-section" style={{ padding: '96px 48px', background: 'var(--warm)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {locations.length > 1 ? 'Our Locations' : 'Location'}
          </span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 48 }}>
          Come Find<br /><em style={{ fontWeight: 400 }}>Your Table</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(locations.length, 2)}, 1fr)`, gap: 24 }}>
          {locations.map((loc, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--mist)', padding: 32 }}>
              {locations.length > 1 && (
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 64, fontWeight: 900, color: 'var(--mist)', lineHeight: 1, marginBottom: -8 }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              )}
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 24, fontWeight: 700, color: 'var(--ink)', marginBottom: 20 }}>
                {loc.name || restaurant.name}
              </div>

              {loc.address && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0 }}>⊙</span>
                  {loc.address}
                </div>
              )}
              {(loc.phone || links?.phone) && (
                <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 14, color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--gold)' }}>✆</span>
                  <a href={`tel:${loc.phone || links.phone}`} style={{ color: 'var(--muted)' }}>
                    {loc.phone || links.phone}
                  </a>
                </div>
              )}

              {/* Hours summary */}
              {regularHours.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--mist)' }}>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>Hours</div>
                  {DAYS.map((day, di) => {
                    const h = regularHours.find(r => r.day_of_week === di)
                    const isToday = di === today
                    return (
                      <div key={di} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--mist)', fontSize: 13 }}>
                        <span style={{ color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 500 : 400 }}>{day}</span>
                        <span style={{ color: isToday ? 'var(--gold-dark)' : (!h || h.closed ? 'var(--subtle)' : 'var(--muted)'), fontStyle: (!h || h.closed) ? 'italic' : 'normal' }}>
                          {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <GoogleMapEmbed address={loc.address || restaurant.address} />
            </div>
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
