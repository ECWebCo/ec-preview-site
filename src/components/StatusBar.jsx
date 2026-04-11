function getStatus(hours) {
  if (!hours?.length) return { open: false, text: 'See hours below' }
  const now = new Date()
  const today = hours.find(h => h.day_of_week === now.getDay() && !h.label)
  if (!today || today.closed) return { open: false, text: 'Closed today' }
  const [oh, om] = today.open_time.split(':').map(Number)
  const [ch, cm] = today.close_time.split(':').map(Number)
  const nowMins = now.getHours() * 60 + now.getMinutes()
  if (nowMins >= oh * 60 + om && nowMins < ch * 60 + cm) {
    const closeH = ch > 12 ? ch - 12 : ch === 0 ? 12 : ch
    return { open: true, text: `Open now · closes ${closeH}:${String(cm).padStart(2, '0')} ${ch >= 12 ? 'PM' : 'AM'}` }
  }
  const openH = oh > 12 ? oh - 12 : oh === 0 ? 12 : oh
  return { open: false, text: `Opens ${openH}:${String(om).padStart(2, '0')} ${oh >= 12 ? 'PM' : 'AM'}` }
}

export default function StatusBar({ hours, links }) {
  const status = getStatus(hours)
  return (
    <div style={{ background: 'var(--section)', borderBottom: '1px solid var(--border)', padding: '11px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: status.open ? '#5CB85C' : '#D9534F', flexShrink: 0, animation: 'pulseDot 2.5s ease-in-out infinite' }} />
        <span style={{ fontSize: 12, color: '#666', fontFamily: 'DM Sans', fontWeight: 500 }}>{status.text}</span>
      </div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        {links?.order_url && <a href={links.order_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }} onMouseOver={e => e.target.style.opacity = '0.6'} onMouseOut={e => e.target.style.opacity = '1'}>Order Online</a>}
        {links?.reservation_url && <a href={links.reservation_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'DM Sans', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }} onMouseOver={e => e.target.style.opacity = '0.6'} onMouseOut={e => e.target.style.opacity = '1'}>Reserve</a>}
        {links?.phone && <a href={`tel:${links.phone}`} style={{ fontSize: 11, color: '#999', fontFamily: 'DM Sans' }}>{links.phone}</a>}
      </div>
      <style>{`@keyframes pulseDot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} } @media(max-width:768px){div[style*="padding: 11px 48px"]{padding:10px 20px!important}}`}</style>
    </div>
  )
}
