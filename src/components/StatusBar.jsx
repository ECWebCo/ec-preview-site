const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getStatus(hours) {
  if (!hours?.length) return { open: false, text: 'See hours below' }
  const now = new Date()
  const today = hours.find(h => h.day_of_week === now.getDay() && !h.label)
  if (!today || today.closed) return { open: false, text: 'Closed today' }
  const [oh, om] = today.open_time.split(':').map(Number)
  const [ch, cm] = today.close_time.split(':').map(Number)
  const openMins = oh * 60 + om
  const closeMins = ch * 60 + cm
  const nowMins = now.getHours() * 60 + now.getMinutes()
  if (nowMins >= openMins && nowMins < closeMins) {
    const closeH = ch > 12 ? ch - 12 : ch === 0 ? 12 : ch
    const closeAmPm = ch >= 12 ? 'PM' : 'AM'
    return { open: true, text: `Open now — closes ${closeH}:${String(cm).padStart(2,'0')} ${closeAmPm}` }
  }
  const openH = oh > 12 ? oh - 12 : oh === 0 ? 12 : oh
  const openAmPm = oh >= 12 ? 'PM' : 'AM'
  return { open: false, text: `Opens at ${openH}:${String(om).padStart(2,'0')} ${openAmPm}` }
}

const Diamond = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" style={{ flexShrink: 0, margin: '0 20px' }}>
    <polygon points="4,0 8,4 4,8 0,4" fill="rgba(201,168,76,0.5)" />
  </svg>
)

export default function StatusBar({ hours, links }) {
  const status = getStatus(hours)

  const tickerItems = [
    status.text,
    links?.order_url ? 'Order Online' : null,
    links?.reservation_url ? 'Book a Table' : null,
    links?.phone || null,
    'Fresh Daily · Locally Sourced',
    status.text,
    links?.order_url ? 'Order Online' : null,
    links?.reservation_url ? 'Book a Table' : null,
    links?.phone || null,
    'Fresh Daily · Locally Sourced',
  ].filter(Boolean)

  return (
    <div style={{
      background: 'var(--charcoal)',
      borderTop: '1px solid rgba(201,168,76,0.15)',
      borderBottom: '1px solid rgba(201,168,76,0.15)',
      padding: '0',
      display: 'flex',
      alignItems: 'stretch',
      overflow: 'hidden',
      position: 'relative',
      height: 48,
    }}>
      {/* Left status badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 28px',
        borderRight: '1px solid rgba(201,168,76,0.15)',
        flexShrink: 0, zIndex: 2,
        background: 'var(--charcoal)'
      }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: status.open ? '#4CAF50' : '#E53935',
          animation: status.open ? 'pulse 2.5s ease-in-out infinite' : 'none',
          flexShrink: 0
        }} />
        <span style={{ fontSize: 11, color: '#fff', fontFamily: 'DM Sans', fontWeight: 500, letterSpacing: 0.3, whiteSpace: 'nowrap' }}>
          {status.open ? 'Open Now' : 'Closed'}
        </span>
      </div>

      {/* Fade edge left */}
      <div style={{ position: 'absolute', left: 120, top: 0, bottom: 0, width: 40, background: 'linear-gradient(to right, var(--charcoal), transparent)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Ticker */}
      <div className="ticker-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="ticker-track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans', whiteSpace: 'nowrap' }}>
                {item}
              </span>
              <Diamond />
            </span>
          ))}
        </div>
      </div>

      {/* Fade edge right */}
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, var(--charcoal), transparent)', zIndex: 1, pointerEvents: 'none' }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(76,175,80,0.5); }
          70% { box-shadow: 0 0 0 6px rgba(76,175,80,0); }
        }
      `}</style>
    </div>
  )
}
