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
    <section id="hours-section" style={{ padding: '120px 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '50%', left: -120, width: 400, height: 400, border: '1px solid rgba(255,92,0,0.06)', borderRadius: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 96, alignItems: 'start' }} className="hours-grid">
        <div ref={leftRef} className="reveal-left">
          <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', marginBottom: 24 }}>Hours</div>
          <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(44px,5.5vw,72px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px', marginBottom: 28 }}>
            We're<br />Open.<br /><span style={{ color: 'var(--orange)' }}>Come in.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, fontWeight: 300, marginBottom: 40, maxWidth: 320, fontFamily: 'DM Sans' }}>
            Walk-ins always welcome. For big groups, give us a heads up.
          </p>
          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer" className="btn-orange">Reserve a Table</a>
          )}
          {special.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: '#444', marginBottom: 16, fontFamily: 'DM Sans' }}>Special Hours</div>
              {special.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans' }}>{s.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--orange)', fontFamily: 'DM Sans', fontWeight: 700 }}>{s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div ref={rightRef} className="reveal d2">
          <div style={{ border: '1px solid var(--border)', overflow: 'hidden' }}>
            {DAYS.map((day, i) => {
              const h = regular.find(r => r.day_of_week === i)
              const isToday = i === today
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 24px', borderBottom: i < 6 ? '1px solid var(--border)' : 'none',
                  background: isToday ? 'rgba(255,92,0,0.08)' : 'transparent', position: 'relative'
                }}>
                  {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--orange)' }} />}
                  <span style={{ fontSize: 13, fontFamily: 'DM Sans', color: isToday ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: isToday ? 700 : 400 }}>{day}</span>
                  <span style={{ fontSize: 14, fontFamily: 'DM Sans', fontWeight: isToday ? 700 : 400, color: isToday ? 'var(--orange)' : (!h || h.closed ? '#333' : 'rgba(255,255,255,0.3)') }}>
                    {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: '#333', marginTop: 14, fontFamily: 'DM Sans' }}>Hours may vary on holidays.</p>
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
