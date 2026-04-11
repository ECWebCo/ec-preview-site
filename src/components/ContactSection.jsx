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
    <section id="contact-section" style={{ padding: '120px 0', background: '#0d0d0d', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: -80, left: -20, fontFamily: 'DM Sans', fontSize: 'clamp(100px,16vw,240px)', fontWeight: 800, color: 'rgba(255,255,255,0.02)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', letterSpacing: '-4px' }}>
        HEY.
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 56px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 96, alignItems: 'start' }} className="contact-grid">
        <div ref={leftRef} className="reveal-left">
          <div style={{ display: 'inline-block', background: 'var(--orange)', color: '#fff', fontSize: 10, fontFamily: 'DM Sans', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '6px 14px', marginBottom: 24 }}>Contact</div>
          <h2 style={{ fontFamily: 'DM Sans', fontSize: 'clamp(44px,5.5vw,76px)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-2px', marginBottom: 24 }}>
            Let's<br />talk<span style={{ color: 'var(--orange)' }}>.</span>
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, fontWeight: 300, marginBottom: 52, maxWidth: 360, fontFamily: 'DM Sans' }}>
            Questions, reservations, catering, or just want to say hi — we're always happy to hear from you.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {restaurant.email && (
              <a href={`mailto:${restaurant.email}`} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'padding-left 0.4s' }}
                onMouseOver={e => { e.currentTarget.style.paddingLeft='8px'; e.currentTarget.querySelector('.cl').style.color='var(--orange)' }}
                onMouseOut={e => { e.currentTarget.style.paddingLeft='0'; e.currentTarget.querySelector('.cl').style.color='#fff' }}>
                <div style={{ width: 48, height: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'border-color 0.3s' }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 4.5A1.5 1.5 0 013.5 3h11A1.5 1.5 0 0116 4.5v9A1.5 1.5 0 0114.5 15h-11A1.5 1.5 0 012 13.5v-9z" stroke="#FF5C00" strokeWidth="1.4"/><path d="M2 5l7 5 7-5" stroke="#FF5C00" strokeWidth="1.4"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#444', marginBottom: 4, fontFamily: 'DM Sans' }}>Email</div>
                  <div className="cl" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.3s' }}>{restaurant.email}</div>
                </div>
              </a>
            )}
            {links?.phone && (
              <a href={`tel:${links.phone}`} onClick={() => trackEvent(restaurant.id,'phone_click')}
                style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'padding-left 0.4s' }}
                onMouseOver={e => { e.currentTarget.style.paddingLeft='8px'; e.currentTarget.querySelector('.cl').style.color='var(--orange)' }}
                onMouseOut={e => { e.currentTarget.style.paddingLeft='0'; e.currentTarget.querySelector('.cl').style.color='#fff' }}>
                <div style={{ width: 48, height: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3.5a1 1 0 011-1h2l1.5 3.5-1.5 1.5c.8 1.6 2 2.8 3.5 3.5L11 9.5l3.5 1.5v2a1 1 0 01-1 1C5.5 14.5 3 7 3 3.5z" stroke="#FF5C00" strokeWidth="1.4"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#444', marginBottom: 4, fontFamily: 'DM Sans' }}>Phone</div>
                  <div className="cl" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.3s' }}>{links.phone}</div>
                </div>
              </a>
            )}
            {links?.reservation_url && (
              <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')}
                style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'padding-left 0.4s' }}
                onMouseOver={e => { e.currentTarget.style.paddingLeft='8px'; e.currentTarget.querySelector('.cl').style.color='var(--orange)' }}
                onMouseOut={e => { e.currentTarget.style.paddingLeft='0'; e.currentTarget.querySelector('.cl').style.color='#fff' }}>
                <div style={{ width: 48, height: 48, background: '#1a1a1a', border: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="13" rx="2" stroke="#FF5C00" strokeWidth="1.4"/><path d="M2 7h14M6 2v2M12 2v2" stroke="#FF5C00" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: '#444', marginBottom: 4, fontFamily: 'DM Sans' }}>Reservations</div>
                  <div className="cl" style={{ fontSize: 16, color: '#fff', fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.3s' }}>Book online →</div>
                </div>
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 44, flexWrap: 'wrap' }}>
            {links?.reservation_url && <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} className="btn-orange">Reserve a Table</a>}
            {links?.order_url && <a href={links.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-outline">Order Online</a>}
          </div>
        </div>

        <div ref={rightRef} className="reveal d3 contact-right">
          <div style={{ border: '1px solid var(--border)', padding: 44, position: 'relative', minHeight: 440, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'var(--orange)' }} />
            <div style={{ position: 'absolute', top: 24, right: 24, width: 80, height: 80, border: '1px solid rgba(255,92,0,0.15)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', top: 40, right: 40, width: 48, height: 48, border: '1px solid rgba(255,92,0,0.08)', borderRadius: '50%' }} />
            <div style={{ fontFamily: 'DM Sans', fontSize: 'clamp(60px,9vw,100px)', fontWeight: 800, color: 'rgba(255,255,255,0.03)', lineHeight: 1, marginBottom: 24, userSelect: 'none', letterSpacing: '-3px' }}>{new Date().getFullYear()}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 8, letterSpacing: '-0.5px' }}>{restaurant.name}</div>
            {restaurant.city && <div style={{ fontSize: 11, color: '#444', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 20 }}>{restaurant.city}</div>}
            {restaurant.tagline && <div style={{ fontSize: 14, color: '#444', lineHeight: 1.7, fontFamily: 'DM Sans', borderTop: '1px solid var(--border)', paddingTop: 20 }}>"{restaurant.tagline}"</div>}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact-section { padding: 80px 0 !important; }
          #contact-section > div { padding: 0 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .contact-right { display: none !important; }
        }
      `}</style>
    </section>
  )
}
