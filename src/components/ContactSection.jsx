import { trackEvent } from '../lib/supabase'

export default function ContactSection({ restaurant, links }) {
  return (
    <section id="contact-section" style={{ padding: '96px 48px', background: 'var(--stone)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, border: '1px solid rgba(201,168,76,0.15)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 180, height: 180, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="contact-grid">

          {/* Left — Contact info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
              <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Contact</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>
              We'd Love to<br /><em style={{ fontWeight: 400, color: 'var(--gold)' }}>Hear From You</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, fontWeight: 300, marginBottom: 40, maxWidth: 360 }}>
              Whether you want to make a reservation, ask about our menu, or just say hello — we're always happy to connect.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {restaurant.email && (
                <a href={`mailto:${restaurant.email}`} style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none', group: true }}
                  onMouseOver={e => e.currentTarget.querySelector('.contact-label').style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.querySelector('.contact-label').style.color = '#fff'}
                >
                  <div style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5A1.5 1.5 0 013.5 3h11A1.5 1.5 0 0116 4.5v9A1.5 1.5 0 0114.5 15h-11A1.5 1.5 0 012 13.5v-9z" stroke="#C9A84C" strokeWidth="1.2"/><path d="M2 5l7 5 7-5" stroke="#C9A84C" strokeWidth="1.2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>Email</div>
                    <div className="contact-label" style={{ fontSize: 15, color: '#fff', fontFamily: 'DM Sans, sans-serif', transition: '0.2s' }}>{restaurant.email}</div>
                  </div>
                </a>
              )}
              {links?.phone && (
                <a href={`tel:${links.phone}`} onClick={() => trackEvent(restaurant.id, 'phone_click')}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}
                  onMouseOver={e => e.currentTarget.querySelector('.contact-label').style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.querySelector('.contact-label').style.color = '#fff'}
                >
                  <div style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="#C9A84C" strokeWidth="1.2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>Phone</div>
                    <div className="contact-label" style={{ fontSize: 15, color: '#fff', fontFamily: 'DM Sans, sans-serif', transition: '0.2s' }}>{links.phone}</div>
                  </div>
                </a>
              )}
              {links?.reservation_url && (
                <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                  style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}
                  onMouseOver={e => e.currentTarget.querySelector('.contact-label').style.color = 'var(--gold)'}
                  onMouseOut={e => e.currentTarget.querySelector('.contact-label').style.color = '#fff'}
                >
                  <div style={{ width: 48, height: 48, border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#C9A84C" strokeWidth="1.2"/><path d="M2 7h14M6 2v2M12 2v2" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 3, fontFamily: 'DM Sans, sans-serif' }}>Reservations</div>
                    <div className="contact-label" style={{ fontSize: 15, color: '#fff', fontFamily: 'DM Sans, sans-serif', transition: '0.2s' }}>Book a table online →</div>
                  </div>
                </a>
              )}
            </div>

            {/* CTA buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 40, flexWrap: 'wrap' }}>
              {links?.reservation_url && (
                <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                  style={{ padding: '14px 28px', background: 'var(--gold)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', fontWeight: 500, textDecoration: 'none' }}>
                  Reserve a Table
                </a>
              )}
              {links?.order_url && (
                <a href={links.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'order_click')}
                  style={{ padding: '14px 28px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>
                  Order Online
                </a>
              )}
            </div>
          </div>

          {/* Right — decorative panel */}
          <div className="contact-right" style={{ position: 'relative' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: 40, height: 420, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ position: 'absolute', top: 32, right: 32, width: 80, height: 80, border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 48, right: 48, width: 48, height: 48, border: '1px solid rgba(201,168,76,0.2)', borderRadius: '50%' }} />
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1, marginBottom: 16, userSelect: 'none' }}>
                {new Date().getFullYear()}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 22, color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', marginBottom: 8 }}>
                {restaurant.name}
              </div>
              {restaurant.city && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif' }}>
                  {restaurant.city}
                </div>
              )}
              {restaurant.tagline && (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 16, lineHeight: 1.6, fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
                  "{restaurant.tagline}"
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact-section { padding: 64px 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
