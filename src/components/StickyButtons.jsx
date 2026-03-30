import { trackEvent } from '../lib/supabase'

export default function StickyButtons({ restaurant, links }) {
  if (!links) return null

  const buttons = [
    links.order_url && {
      label: 'Order',
      href: links.order_url,
      event: 'order_click',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 2h2l2.5 8h7l1.5-5H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="13" cy="14" r="1" fill="currentColor"/></svg>,
      bg: 'var(--gold)', color: '#fff'
    },
    links.reservation_url && {
      label: 'Reserve',
      href: links.reservation_url,
      event: 'reserve_click',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7h14M6 2v2M12 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
      bg: 'var(--stone)', color: '#fff'
    },
    links.phone && {
      label: 'Call',
      href: `tel:${links.phone}`,
      event: 'phone_click',
      icon: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="currentColor" strokeWidth="1.5"/></svg>,
      bg: '#fff', color: 'var(--stone)', border: '1px solid #E8E2D9'
    }
  ].filter(Boolean)

  if (!buttons.length) return null

  return (
    <>
      <div className="sticky-mobile-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
        display: 'none', background: '#fff',
        borderTop: '1px solid #E8E2D9',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {buttons.map((btn, i) => (
          <a key={i} href={btn.href}
            target={btn.href.startsWith('http') ? '_blank' : '_self'}
            rel="noreferrer"
            onClick={() => trackEvent(restaurant.id, btn.event)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, padding: '10px 8px',
              background: i === 0 ? btn.bg : '#fff',
              color: i === 0 ? btn.color : 'var(--stone)',
              textDecoration: 'none', fontFamily: 'DM Sans, sans-serif',
              fontSize: 11, fontWeight: 500, letterSpacing: 0.3,
              borderRight: i < buttons.length - 1 ? '1px solid #E8E2D9' : 'none'
            }}
          >
            {btn.icon}
            {btn.label}
          </a>
        ))}
      </div>

      <div className="sticky-mobile-spacer" style={{ display: 'none', height: 68 }} />

      <style>{`
        @media (max-width: 768px) {
          .sticky-mobile-bar { display: flex !important; }
          .sticky-mobile-spacer { display: block !important; }
        }
      `}</style>
    </>
  )
}
