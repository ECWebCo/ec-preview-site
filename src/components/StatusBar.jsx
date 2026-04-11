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
    return { open: true, text: `Open now · closes ${closeH}:${String(cm).padStart(2,'0')} ${ch>=12?'PM':'AM'}` }
  }
  const openH = oh>12?oh-12:oh===0?12:oh
  return { open: false, text: `Opens at ${openH}:${String(om).padStart(2,'0')} ${oh>=12?'PM':'AM'}` }
}

export default function StatusBar({ hours, links }) {
  const status = getStatus(hours)

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      padding: '12px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12
    }}>
      {/* Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: status.open ? '#22C55E' : '#EF4444',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontSize: 13, color: '#1a1a1a', fontFamily: 'DM Sans', fontWeight: 500 }}>
          {status.text}
        </span>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {links?.order_url && (
          <a href={links.order_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none' }}
            onMouseOver={e => e.target.style.opacity = '0.7'}
            onMouseOut={e => e.target.style.opacity = '1'}>
            Order Online →
          </a>
        )}
        {links?.reservation_url && (
          <a href={links.reservation_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '0.3px', textDecoration: 'none' }}
            onMouseOver={e => e.target.style.opacity = '0.7'}
            onMouseOut={e => e.target.style.opacity = '1'}>
            Reserve a Table →
          </a>
        )}
        {links?.phone && (
          <a href={`tel:${links.phone}`} style={{ fontSize: 12, color: '#888', fontFamily: 'DM Sans', fontWeight: 500, textDecoration: 'none' }}>
            {links.phone}
          </a>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          #status-bar { padding: 12px 20px !important; }
        }
      `}</style>
    </div>
  )
}
