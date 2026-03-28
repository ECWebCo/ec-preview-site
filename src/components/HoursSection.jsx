const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

export default function HoursSection({ hours, links }) {
  const today = new Date().getDay()
  const regularHours = hours.filter(h => !h.label)
  const specialHours = hours.filter(h => h.label)

  return (
    <section id="hours-section" style={{ padding: '96px 48px', background: 'var(--stone)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="hours-grid">

        {/* Left — CTA */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
            <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Hours</span>
          </div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Come Find<br /><em style={{ fontWeight: 400, color: 'var(--gold)' }}>Your Table</em>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontWeight: 300, marginBottom: 32, maxWidth: 320 }}>
            Walk-ins welcome. Reservations recommended for Friday and Saturday evenings.
          </p>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer" style={{
              display: 'inline-block', padding: '16px 36px', background: 'var(--gold)',
              color: '#fff', fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 500
            }}>Reserve a Table</a>
          )}

          {/* Special hours */}
          {specialHours.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12, fontFamily: 'DM Sans, sans-serif' }}>Special Hours</p>
              {specialHours.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--gold)' }}>
                    {s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — Hours list */}
        <div>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            {DAYS.map((day, i) => {
              const h = regularHours.find(r => r.day_of_week === i)
              const isToday = i === today
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 24px', borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  background: isToday ? 'rgba(201,168,76,0.08)' : 'transparent',
                  position: 'relative'
                }}>
                  {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--gold)' }} />}
                  <span style={{ fontSize: 13, color: isToday ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: isToday ? 500 : 400 }}>{day}</span>
                  <span style={{ fontSize: 13, color: isToday ? 'var(--gold)' : (!h || h.closed ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.45)'), fontStyle: (!h || h.closed) ? 'italic' : 'normal' }}>
                    {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 16, letterSpacing: 0.3 }}>Hours may vary on holidays. Call ahead to confirm.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hours-section { padding: 64px 24px !important; }
          .hours-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
