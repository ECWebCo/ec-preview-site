import { trackEvent } from '../lib/supabase'

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
    const closeH = ch > 12 ? ch - 12 : ch
    const closeAmPm = ch >= 12 ? 'PM' : 'AM'
    return { open: true, text: `Open now — closes at ${closeH}:${String(cm).padStart(2, '0')} ${closeAmPm}` }
  }
  const openH = oh > 12 ? oh - 12 : oh
  const openAmPm = oh >= 12 ? 'PM' : 'AM'
  return { open: false, text: `Opens at ${openH}:${String(om).padStart(2, '0')} ${openAmPm}` }
}

export default function StatusBar({ hours, links }) {
  const status = getStatus(hours)

  return (
    <div style={{ background: 'var(--stone)', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 7, height: 7, borderRadius: '50%',
          background: status.open ? '#4CAF50' : '#E53935',
          animation: status.open ? 'pulse 2s infinite' : 'none'
        }} />
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{status.text}</span>
      </div>

      <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.15)' }} />

      <div style={{ display: 'flex', gap: 24, marginLeft: 'auto', flexWrap: 'wrap' }}>
        {links?.order_url && (
          <a href={links.order_url} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            Order Online
          </a>
        )}
        {links?.reservation_url && (
          <a href={links.reservation_url} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            Book a Table
          </a>
        )}
        {links?.phone && (
          <a href={`tel:${links.phone}`}
            style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>
            {links.phone}
          </a>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
        @media (max-width: 768px) {
          .status-bar { padding: 14px 24px !important; gap: 16px !important; }
        }
      `}</style>
    </div>
  )
}
