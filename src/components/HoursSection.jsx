import { useRef, useEffect } from 'react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

export default function HoursSection({ hours, links }) {
  const today = new Date().getDay()
  const regularHours = hours.filter(h => !h.label)
  const specialHours = hours.filter(h => h.label)
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef)

  return (
    <section id="hours-section" style={{ padding: '120px 0', background: 'var(--stone)', position: 'relative', overflow: 'hidden' }}>
      {/* Rotating decorative ring */}
      <div style={{
        position: 'absolute', top: '50%', right: -160, width: 500, height: 500,
        transform: 'translateY(-50%)',
        border: '1px solid rgba(201,168,76,0.08)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', top: '50%', right: -100, width: 360, height: 360,
        transform: 'translateY(-50%)',
        border: '1px solid rgba(201,168,76,0.05)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 96, alignItems: 'start' }} className="hours-grid">

          {/* Left */}
          <div ref={leftRef} className="reveal-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>Hours</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(44px, 5.5vw, 76px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-1px', marginBottom: 32 }}>
              Come<br />
              Find<br />
              <em style={{ fontWeight: 400, color: 'var(--gold)' }}>Your Table</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.8, fontWeight: 300, marginBottom: 40, maxWidth: 320, fontFamily: 'DM Sans' }}>
              Walk-ins always welcome. Reservations recommended for Friday and Saturday evenings.
            </p>
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer" className="btn-gold">
                Reserve a Table
              </a>
            )}

            {specialHours.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 16, fontFamily: 'DM Sans' }}>Special Hours</div>
                {specialHours.map(s => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans' }}>{s.label}</span>
                    <span style={{ fontSize: 14, color: 'var(--gold)', fontFamily: 'Playfair Display, serif' }}>
                      {s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right — hours panel */}
          <div ref={rightRef} className="reveal delay-2">
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              {DAYS.map((day, i) => {
                const h = regularHours.find(r => r.day_of_week === i)
                const isToday = i === today
                return (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '18px 28px',
                    borderBottom: i < 6 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    background: isToday ? 'rgba(201,168,76,0.07)' : 'transparent',
                    position: 'relative',
                    transition: 'background 0.2s'
                  }}>
                    {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--gold)' }} />}
                    <span style={{
                      fontSize: 13, fontFamily: 'DM Sans',
                      color: isToday ? '#fff' : 'rgba(255,255,255,0.38)',
                      fontWeight: isToday ? 600 : 400,
                      letterSpacing: isToday ? 0.5 : 0
                    }}>{day}</span>
                    <span style={{
                      fontSize: 14, fontFamily: 'Playfair Display, serif',
                      color: isToday ? 'var(--gold)' : (!h || h.closed ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.4)'),
                      fontStyle: (!h || h.closed) && !isToday ? 'italic' : 'normal'
                    }}>
                      {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                    </span>
                  </div>
                )
              })}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.15)', marginTop: 16, fontFamily: 'DM Sans', letterSpacing: 0.3 }}>
              Hours may vary on holidays. Call ahead to confirm.
            </p>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hours-section { padding: 80px 0 !important; }
          #hours-section > div { padding: 0 24px !important; }
          .hours-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
        }
      `}</style>
    </section>
  )
}
