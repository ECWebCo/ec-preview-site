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
    <section id="hours-section" style={{ background: 'var(--section)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(120px,18vw,220px)', fontStyle: 'italic', fontWeight: 300, color: 'rgba(28,28,26,0.04)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>Hours</div>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '96px 48px', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 80, alignItems: 'start', position: 'relative' }} className="hours-grid">
        <div ref={leftRef} className="reveal-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <div style={{ height: 1, width: 32, background: 'var(--accent)' }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 500 }}>Hours</span>
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,4.5vw,60px)', fontWeight: 300, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 24 }}>Come Find Your Table</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, fontFamily: 'DM Sans', fontWeight: 300, marginBottom: 36, maxWidth: 320 }}>Walk-ins always welcome. Reservations recommended on weekends.</p>
          {links?.reservation_url && <a href={links.reservation_url} target="_blank" rel="noreferrer" className="btn-accent">Reserve a Table</a>}
          {special.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <p style={{ fontFamily: 'DM Sans', fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Special Hours</p>
              {special.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'DM Sans' }}>{s.label}</span>
                  <span style={{ fontSize: 16, color: 'var(--accent)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div ref={rightRef} className="reveal d2">
          <div style={{ background: '#fff', border: '1px solid var(--border)' }}>
            {DAYS.map((day, i) => {
              const h = regular.find(r => r.day_of_week === i)
              const isToday = i === today
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderBottom: i < 6 ? '1px solid var(--border)' : 'none', background: isToday ? 'rgba(201,168,76,0.05)' : 'transparent', position: 'relative' }}>
                  {isToday && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: 'var(--accent)' }} />}
                  <span style={{ fontSize: 14, fontFamily: 'DM Sans', color: isToday ? 'var(--ink)' : 'var(--muted)', fontWeight: isToday ? 600 : 400 }}>{day}</span>
                  <span style={{ fontFamily: isToday ? 'Cormorant Garamond, serif' : 'DM Sans', fontStyle: isToday ? 'italic' : 'normal', fontSize: isToday ? 17 : 14, color: isToday ? 'var(--accent)' : (!h || h.closed ? '#ccc' : 'var(--muted)') }}>
                    {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 12, color: '#c0bbb5', marginTop: 12, fontFamily: 'DM Sans' }}>Hours may vary on holidays.</p>
        </div>
      </div>
      <style>{`@media(max-width:768px){#hours-section>div{padding:72px 24px!important;grid-template-columns:1fr!important;gap:48px!important}}`}</style>
    </section>
  )
}
