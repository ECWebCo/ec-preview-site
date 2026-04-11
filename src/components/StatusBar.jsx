const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

function getStatus(hours) {
  if (!hours?.length) return { open: false, text: 'See hours below' }
  const now = new Date()
  const today = hours.find(h => h.day_of_week === now.getDay() && !h.label)
  if (!today || today.closed) return { open: false, text: 'Closed today' }
  const [oh, om] = today.open_time.split(':').map(Number)
  const [ch, cm] = today.close_time.split(':').map(Number)
  const nowMins = now.getHours()*60+now.getMinutes()
  if (nowMins >= oh*60+om && nowMins < ch*60+cm) {
    const closeH = ch>12?ch-12:ch===0?12:ch
    return { open: true, text: `Open now · Closes ${closeH}:${String(cm).padStart(2,'0')}${ch>=12?'PM':'AM'}` }
  }
  const openH = oh>12?oh-12:oh===0?12:oh
  return { open: false, text: `Opens at ${openH}:${String(om).padStart(2,'0')}${oh>=12?'PM':'AM'}` }
}

export default function StatusBar({ hours, links }) {
  const status = getStatus(hours)

  const items = [
    status.text,
    links?.order_url ? '🔥 Order Online' : null,
    links?.reservation_url ? '📅 Reserve a Table' : null,
    links?.phone || null,
    '✦ Fresh Every Day',
    '✦ Made to Order',
    status.text,
    links?.order_url ? '🔥 Order Online' : null,
    links?.reservation_url ? '📅 Reserve a Table' : null,
    links?.phone || null,
    '✦ Fresh Every Day',
    '✦ Made to Order',
  ].filter(Boolean)

  return (
    <div style={{ background: 'var(--orange)', height: 44, overflow: 'hidden', display: 'flex', alignItems: 'center', position: 'relative' }}>
      <div className="ticker-wrap" style={{ flex: 1 }}>
        <div className="ticker-track">
          {items.map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
              <span style={{ fontSize: 12, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: 0.5, whiteSpace: 'nowrap', padding: '0 4px' }}>{item}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 20px', fontSize: 10 }}>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Left status pill */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', padding: '0 20px', display: 'flex', alignItems: 'center', gap: 8, borderLeft: '1px solid rgba(255,255,255,0.15)', zIndex: 2 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: status.open ? '#fff' : 'rgba(255,255,255,0.4)' }} />
        <span style={{ fontSize: 11, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, whiteSpace: 'nowrap' }}>{status.open ? 'Open' : 'Closed'}</span>
      </div>
    </div>
  )
}
