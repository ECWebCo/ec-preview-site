import { useRef, useEffect } from 'react'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${hour}:${String(m).padStart(2,'0')} ${ampm}`
}
function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

export default function HoursSection({ hours, links }) {
  const today = new Date().getDay()
  const regular = hours.filter(h => !h.label)
  const special = hours.filter(h => h.label)
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef)

  return (
    <section id="hours-section" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="hours-grid">

        <div ref={leftRef} className="reveal">
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: 16 }}>Hours</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 20 }}>
            Come Visit Us
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 36, fontFamily: 'DM Sans', maxWidth: 320 }}>
            Walk-ins welcome. Reservations recommended on weekends.
          </p>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer" className="btn-primary">Reserve a Table</a>
          )}
          {special.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14, fontFamily: 'DM Sans' }}>Special Hours</p>
              {special.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'DM Sans' }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: 'var(--accent)', fontFamily: 'DM Sans', fontWeight: 600 }}>
                    {s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={rightRef} className="reveal d2">
          <div style={{ background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
            {DAYS.map((day, i) => {
              const h = regular.find(r => r.day_of_week === i)
              const isToday = i === today
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '15px 24px', borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
                  background: isToday ? 'rgba(201,168,76,0.06)' : 'transparent', position: 'relative'
                }}>
                  {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)' }} />}
                  <span style={{ fontSize: 14, fontFamily: 'DM Sans', color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 600 : 400 }}>{day}</span>
                  <span style={{ fontSize: 14, fontFamily: 'DM Sans', fontWeight: isToday ? 600 : 400, color: isToday ? 'var(--accent)' : (!h || h.closed ? '#ccc' : 'var(--muted)') }}>
                    {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 12, color: '#bbb', marginTop: 12, fontFamily: 'DM Sans' }}>Hours may vary on holidays.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hours-section { padding: 72px 0 !important; }
          #hours-section > div { padding: 0 24px !important; grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
