const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}${ampm}`
}

export default function LocationSection({ restaurant, hours, links }) {
  const locations = restaurant.locations || [
    { name: restaurant.name, address: restaurant.address, phone: links?.phone }
  ]

  const regularHours = hours.filter(h => !h.label)

  const hoursText = regularHours.length ? (() => {
    const open = regularHours.filter(h => !h.closed)
    if (!open.length) return 'See hours above'
    const first = open[0]
    const last = open[open.length - 1]
    const days = open.length === 7 ? 'Daily' : `${DAYS[first.day_of_week].slice(0, 3)}–${DAYS[last.day_of_week].slice(0, 3)}`
    return `${days} ${formatTime(first.open_time)} — ${formatTime(first.close_time)}`
  })() : ''

  return (
    <section id="location-section" style={{ padding: '96px 48px', background: 'var(--warm)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Locations</span>
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 48 }}>
          Come Find<br /><em style={{ fontWeight: 400 }}>Your Table</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {locations.map((loc, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--mist)', padding: 36 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 72, fontWeight: 900, color: 'var(--mist)', lineHeight: 1, marginBottom: -12 }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontWeight: 700, color: 'var(--ink)', marginBottom: 24 }}>
                {loc.name || restaurant.name}
              </div>

              {loc.address && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--gold)', marginTop: 2 }}>⊙</span>
                  {loc.address}
                </div>
              )}
              {hoursText && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--gold)' }}>◷</span>
                  {hoursText}
                </div>
              )}
              {(loc.phone || links?.phone) && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, fontSize: 14, color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--gold)' }}>✆</span>
                  <a href={`tel:${loc.phone || links.phone}`} style={{ color: 'var(--muted)' }}>
                    {loc.phone || links.phone}
                  </a>
                </div>
              )}

              {/* Map placeholder — replace with Google Maps embed */}
              <div style={{ height: 160, background: 'var(--mist)', marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: 'var(--muted)', letterSpacing: 0.5 }}>
                {loc.address ? (
                  <a href={`https://maps.google.com?q=${encodeURIComponent(loc.address)}`} target="_blank" rel="noreferrer"
                    style={{ color: 'var(--gold)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
                    Get Directions →
                  </a>
                ) : 'Map'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #location-section { padding: 64px 24px !important; }
        }
      `}</style>
    </section>
  )
}
