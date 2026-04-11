import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function useReveal(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [ref])
}

export default function ContactSection({ restaurant, links }) {
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef)

  return (
    <section id="contact-section" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }} className="contact-grid">

        <div ref={leftRef} className="reveal">
          <p style={{ fontFamily: 'DM Sans', fontSize: 12, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 600, marginBottom: 16 }}>Contact</p>
          <h2 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 16 }}>
            We'd Love to Hear From You
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, marginBottom: 40, fontFamily: 'DM Sans', maxWidth: 380 }}>
            Questions, reservations, or just want to say hello — reach out anytime.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
            {restaurant.email && (
              <a href={`mailto:${restaurant.email}`} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity='0.7'}
                onMouseOut={e => e.currentTarget.style.opacity='1'}>
                <div style={{ width: 44, height: 44, background: 'var(--section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5A1.5 1.5 0 013.5 3h11A1.5 1.5 0 0116 4.5v9A1.5 1.5 0 0114.5 15h-11A1.5 1.5 0 012 13.5v-9z" stroke="#C9A84C" strokeWidth="1.3"/><path d="M2 5l7 5 7-5" stroke="#C9A84C" strokeWidth="1.3"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2, fontFamily: 'DM Sans', letterSpacing: 1, textTransform: 'uppercase' }}>Email</div>
                  <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'DM Sans', fontWeight: 500 }}>{restaurant.email}</div>
                </div>
              </a>
            )}
            {links?.phone && (
              <a href={`tel:${links.phone}`} onClick={() => trackEvent(restaurant.id,'phone_click')} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity='0.7'}
                onMouseOut={e => e.currentTarget.style.opacity='1'}>
                <div style={{ width: 44, height: 44, background: 'var(--section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="#C9A84C" strokeWidth="1.3"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2, fontFamily: 'DM Sans', letterSpacing: 1, textTransform: 'uppercase' }}>Phone</div>
                  <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'DM Sans', fontWeight: 500 }}>{links.phone}</div>
                </div>
              </a>
            )}
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', transition: 'opacity 0.2s' }}
                onMouseOver={e => e.currentTarget.style.opacity='0.7'}
                onMouseOut={e => e.currentTarget.style.opacity='1'}>
                <div style={{ width: 44, height: 44, background: 'var(--section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#C9A84C" strokeWidth="1.3"/><path d="M2 7h14M6 2v2M12 2v2" stroke="#C9A84C" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2, fontFamily: 'DM Sans', letterSpacing: 1, textTransform: 'uppercase' }}>Reservations</div>
                  <div style={{ fontSize: 15, color: 'var(--ink)', fontFamily: 'DM Sans', fontWeight: 500 }}>Book a table online →</div>
                </div>
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {links?.reservation_url && <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} className="btn-primary">Reserve a Table</a>}
            {links?.order_url && <a href={links.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-secondary">Order Online</a>}
          </div>
        </div>

        <div ref={rightRef} className="reveal d2 contact-right" style={{ background: 'var(--section)', border: '1px solid var(--border)', padding: 48, textAlign: 'center' }}>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8 }}>{restaurant.name}</div>
          {restaurant.city && <div style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 24 }}>{restaurant.city}</div>}
          <div style={{ width: 40, height: 1, background: 'var(--accent)', margin: '0 auto 24px' }} />
          {restaurant.tagline && <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, fontFamily: 'DM Sans', fontStyle: 'italic' }}>"{restaurant.tagline}"</div>}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact-section { padding: 72px 0 !important; }
          #contact-section > div { padding: 0 24px !important; grid-template-columns: 1fr !important; gap: 48px !important; }
          .contact-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
