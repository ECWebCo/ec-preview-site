import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])
}

export default function ContactSection({ restaurant, links }) {
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef)

  return (
    <section id="contact-section" style={{ padding: '120px 0', background: 'var(--charcoal)', position: 'relative', overflow: 'hidden' }}>
      {/* Giant background text */}
      <div style={{
        position: 'absolute', bottom: -60, left: -20,
        fontFamily: 'Playfair Display, serif', fontSize: 'clamp(120px, 18vw, 260px)',
        fontWeight: 900, color: 'rgba(255,255,255,0.02)', lineHeight: 1,
        userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap'
      }}>Hello.</div>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 96, alignItems: 'start' }} className="contact-grid">

          {/* Left */}
          <div ref={leftRef} className="reveal-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: 'var(--gold)' }} />
              <span style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans' }}>Contact</span>
            </div>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(44px, 5.5vw, 80px)', fontWeight: 900, color: '#fff', lineHeight: 0.95, letterSpacing: '-1px', marginBottom: 28 }}>
              We'd Love<br />
              to Hear<br />
              <em style={{ fontWeight: 400, color: 'var(--gold)' }}>From You</em>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.38)', lineHeight: 1.8, fontWeight: 300, marginBottom: 56, maxWidth: 380, fontFamily: 'DM Sans' }}>
              Whether it's a reservation, a question, or just a hello — our door is always open.
            </p>

            {/* Contact rows */}
            <div>
              {restaurant.email && (
                <a href={`mailto:${restaurant.email}`} className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'padding-left 0.4s ease' }}
                  onMouseOver={e => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseOut={e => e.currentTarget.style.paddingLeft = '0'}
                >
                  <div className="icon-ring">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5A1.5 1.5 0 013.5 3h11A1.5 1.5 0 0116 4.5v9A1.5 1.5 0 0114.5 15h-11A1.5 1.5 0 012 13.5v-9z" stroke="#C9A84C" strokeWidth="1.2"/><path d="M2 5l7 5 7-5" stroke="#C9A84C" strokeWidth="1.2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontFamily: 'DM Sans' }}>Email</div>
                    <div className="label" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', transition: 'color 0.3s' }}>{restaurant.email}</div>
                  </div>
                </a>
              )}
              {links?.phone && (
                <a href={`tel:${links.phone}`} onClick={() => trackEvent(restaurant.id, 'phone_click')}
                  className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'padding-left 0.4s ease' }}
                  onMouseOver={e => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseOut={e => e.currentTarget.style.paddingLeft = '0'}
                >
                  <div className="icon-ring">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="#C9A84C" strokeWidth="1.2"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontFamily: 'DM Sans' }}>Phone</div>
                    <div className="label" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', transition: 'color 0.3s' }}>{links.phone}</div>
                  </div>
                </a>
              )}
              {links?.reservation_url && (
                <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                  className="contact-row" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', transition: 'padding-left 0.4s ease' }}
                  onMouseOver={e => e.currentTarget.style.paddingLeft = '8px'}
                  onMouseOut={e => e.currentTarget.style.paddingLeft = '0'}
                >
                  <div className="icon-ring">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#C9A84C" strokeWidth="1.2"/><path d="M2 7h14M6 2v2M12 2v2" stroke="#C9A84C" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 4, fontFamily: 'DM Sans' }}>Reservations</div>
                    <div className="label" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', transition: 'color 0.3s' }}>Book a table online →</div>
                  </div>
                </a>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 48, flexWrap: 'wrap' }}>
              {links?.reservation_url && (
                <a href={links.reservation_url} target="_blank" rel="noreferrer"
                  onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                  className="btn-gold">Reserve a Table</a>
              )}
              {links?.order_url && (
                <a href={links.order_url} target="_blank" rel="noreferrer"
                  onClick={() => trackEvent(restaurant.id, 'order_click')}
                  className="btn-ghost">Order Online</a>
              )}
            </div>
          </div>

          {/* Right — editorial card */}
          <div ref={rightRef} className="reveal delay-3 contact-right">
            <div style={{ border: '1px solid rgba(255,255,255,0.07)', padding: 48, position: 'relative', minHeight: 460, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              {/* Decorative gold rings */}
              <div style={{ position: 'absolute', top: 28, right: 28, width: 100, height: 100, border: '1px solid rgba(201,168,76,0.18)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 44, right: 44, width: 68, height: 68, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 60, right: 60, width: 36, height: 36, border: '1px solid rgba(201,168,76,0.06)', borderRadius: '50%' }} />

              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, var(--gold), transparent)' }} />

              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(60px, 8vw, 100px)', fontWeight: 900, color: 'rgba(255,255,255,0.03)', lineHeight: 1, marginBottom: 24, userSelect: 'none' }}>
                {new Date().getFullYear()}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', marginBottom: 10 }}>
                {restaurant.name}
              </div>
              {restaurant.city && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 20 }}>
                  {restaurant.city}
                </div>
              )}
              {restaurant.tagline && (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, fontFamily: 'DM Sans', fontWeight: 300, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 20 }}>
                  "{restaurant.tagline}"
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact-section { padding: 80px 0 !important; }
          #contact-section > div { padding: 0 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 56px !important; }
          .contact-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
