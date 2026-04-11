import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.06 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

export default function ContactSection({ restaurant, links }) {
  const leftRef = useRef(null); useReveal(leftRef)
  const rightRef = useRef(null); useReveal(rightRef, 0.15)

  return (
    <section id="contact-section" style={{ padding: '100px 0', background: '#fff', borderTop: '1px solid var(--border)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="contact-grid">
        <div ref={leftRef} className="reveal-left">
          <p style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-block', width: 36, height: 1, background: 'var(--accent)' }} />Contact
          </p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(32px,4.5vw,50px)', fontWeight: 700, fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.1, marginBottom: 16 }}>
            We'd Love to<br />Hear From You
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 40, fontFamily: 'DM Sans', fontWeight: 300, maxWidth: 360 }}>
            Reach out for reservations, questions, catering, or just to say hello.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 36 }}>
            {[
              restaurant.email && { href: `mailto:${restaurant.email}`, label: 'Email', value: restaurant.email, onClick: null },
              links?.phone && { href: `tel:${links.phone}`, label: 'Phone', value: links.phone, onClick: () => trackEvent(restaurant.id, 'phone_click') },
              links?.reservation_url && { href: links.reservation_url, label: 'Reservations', value: 'Book a table online →', onClick: () => trackEvent(restaurant.id, 'reserve_click'), external: true },
            ].filter(Boolean).map(({ href, label, value, onClick, external }) => (
              <a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
                onClick={onClick}
                style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 0', borderBottom: '1px solid var(--border)', textDecoration: 'none', transition: 'padding-left 0.35s ease' }}
                onMouseOver={e => { e.currentTarget.style.paddingLeft = '6px'; e.currentTarget.querySelector('.cv').style.color = 'var(--accent)' }}
                onMouseOut={e => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.querySelector('.cv').style.color = 'var(--ink)' }}>
                <div style={{ width: 40, height: 40, background: 'var(--section)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>
                  {label === 'Email' ? '✉' : label === 'Phone' ? '☎' : '📅'}
                </div>
                <div>
                  <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2, fontFamily: 'DM Sans' }}>{label}</div>
                  <div className="cv" style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'DM Sans', fontWeight: 500, transition: 'color 0.25s' }}>{value}</div>
                </div>
              </a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {links?.reservation_url && <a href={links.reservation_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'reserve_click')} className="btn-gold">Reserve a Table</a>}
            {links?.order_url && <a href={links.order_url} target="_blank" rel="noreferrer" onClick={() => trackEvent(restaurant.id,'order_click')} className="btn-outline">Order Online</a>}
          </div>
        </div>

        <div ref={rightRef} className="reveal-right contact-card" style={{ background: 'var(--section)', border: '1px solid var(--border)', padding: 48, textAlign: 'center' }}>
          <div style={{ width: 60, height: 1, background: 'var(--accent)', margin: '0 auto 28px' }} />
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontStyle: 'italic', color: 'var(--ink)', marginBottom: 8, fontWeight: 700 }}>{restaurant.name}</div>
          {restaurant.city && <div style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 28 }}>{restaurant.city}</div>}
          <div style={{ width: 60, height: 1, background: 'var(--border)', margin: '0 auto 28px' }} />
          {restaurant.tagline && <div style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.75, fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>"{restaurant.tagline}"</div>}
        </div>
      </div>
      <style>{`
        @media (max-width:768px) {
          #contact-section { padding: 72px 0 !important; }
          .contact-grid { grid-template-columns: 1fr !important; gap: 48px !important; padding: 0 24px !important; }
          .contact-card { display: none !important; }
        }
      `}</style>
    </section>
  )
}
