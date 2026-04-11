import { useRef, useEffect } from 'react'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
function formatTime(t) {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${h > 12 ? h - 12 : h === 0 ? 12 : h}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

export default function HoursSection({ hours, links }) {
  const today = new Date().getDay()
  const regular = hours.filter(h => !h.label)
  const special = hours.filter(h => h.label)
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef, 0.18)

  return (
    <section id="hours-section" style={{ background: '#F5F2EC', position: 'relative', overflow: 'hidden', borderTop: '1px solid #E8E4DE' }}>

      {/* Giant background watermark */}
      <div style={{
        position: 'absolute', right: -32, top: '50%', transform: 'translateY(-50%)',
        fontFamily: "'Playfair Display', serif", fontSize: 'clamp(120px, 18vw, 220px)',
        fontWeight: 700, fontStyle: 'italic', color: 'rgba(201,168,76,0.06)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap'
      }}>Hours</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 64px', display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 96, alignItems: 'start', position: 'relative' }} className="hours-main-grid">

        {/* LEFT — editorial copy */}
        <div ref={leftRef} className="reveal-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ width: 40, height: 1, background: '#C9A84C' }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C' }}>Hours</span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(40px, 5.5vw, 70px)',
            fontWeight: 700, fontStyle: 'italic',
            color: '#1C1C1A', lineHeight: 1.0,
            margin: '0 0 24px', letterSpacing: '-0.5px'
          }}>
            Come Find<br />Your Table
          </h2>

          <p style={{ fontSize: 15, color: '#9A958E', lineHeight: 1.85, fontFamily: 'DM Sans', fontWeight: 300, marginBottom: 40, maxWidth: 300 }}>
            Walk-ins are always welcome. We recommend reserving ahead on Friday and Saturday evenings.
          </p>

          {links?.reservation_url && (
            <a href={links.reservation_url} target="_blank" rel="noreferrer" className="btn-gold">
              Reserve a Table
            </a>
          )}

          {special.length > 0 && (
            <div style={{ marginTop: 48, paddingTop: 40, borderTop: '1px solid #E8E4DE' }}>
              <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#bbb', marginBottom: 16, fontFamily: 'DM Sans', fontWeight: 600 }}>Special Hours</p>
              {special.map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #E8E4DE' }}>
                  <span style={{ fontSize: 14, color: '#1C1C1A', fontFamily: 'DM Sans' }}>{s.label}</span>
                  <span style={{ fontSize: 14, color: '#C9A84C', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
                    {s.closed ? 'Closed' : `${formatTime(s.open_time)} — ${formatTime(s.close_time)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — hours table with character */}
        <div ref={rightRef} className="reveal-right">
          <div style={{ background: '#fff', border: '1px solid #E8E4DE', overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.06)' }}>
            {DAYS.map((day, i) => {
              const h = regular.find(r => r.day_of_week === i)
              const isToday = i === today
              return (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '17px 28px',
                  borderBottom: i < 6 ? '1px solid #F0EDE8' : 'none',
                  background: isToday ? 'rgba(201,168,76,0.05)' : 'transparent',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}>
                  {isToday && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: '#C9A84C' }} />
                  )}
                  <span style={{
                    fontFamily: 'DM Sans', fontSize: 14,
                    color: isToday ? '#1C1C1A' : '#9A958E',
                    fontWeight: isToday ? 700 : 400,
                    paddingLeft: isToday ? 4 : 0,
                    transition: 'all 0.2s'
                  }}>{day}</span>
                  <span style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 15, fontStyle: 'italic',
                    color: isToday ? '#C9A84C' : (!h || h.closed ? '#D8D5CF' : '#9A958E'),
                    fontWeight: isToday ? 700 : 400
                  }}>
                    {!h || h.closed ? 'Closed' : `${formatTime(h.open_time)} — ${formatTime(h.close_time)}`}
                  </span>
                </div>
              )
            })}
          </div>
          <p style={{ fontSize: 11, color: '#C8C4BE', marginTop: 14, fontFamily: 'DM Sans', fontStyle: 'italic' }}>Hours may vary on holidays.</p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hours-main-grid { grid-template-columns: 1fr !important; gap: 48px !important; padding: 72px 24px !important; }
        }
      `}</style>
    </section>
  )
}
