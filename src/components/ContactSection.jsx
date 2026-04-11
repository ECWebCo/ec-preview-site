import { useRef, useEffect } from 'react'
import { trackEvent } from '../lib/supabase'

function useReveal(ref, delay = 0) {
  useEffect(() => {
    const el = ref.current; if (!el) return
    el.style.transitionDelay = `${delay}s`
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); obs.disconnect() } }, { threshold: 0.05 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, delay])
}

export default function ContactSection({ restaurant, links }) {
  const topRef = useRef(null); useReveal(topRef)
  const leftRef = useRef(null); useReveal(leftRef, 0.1)
  const rightRef = useRef(null); useReveal(rightRef, 0.22)

  return (
    <section id="contact-section" style={{ background: '#F5F2EC', borderTop: '1px solid #E8E4DE', overflow: 'hidden', position: 'relative' }}>

      {/* Giant background watermark */}
      <div style={{
        position: 'absolute', bottom: -40, right: -20,
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(100px, 16vw, 200px)',
        fontWeight: 700, fontStyle: 'italic',
        color: 'rgba(201,168,76,0.07)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap'
      }}>Hello.</div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 64px', position: 'relative' }}>

        {/* Top — big centered headline */}
        <div ref={topRef} className="reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 28 }}>
            <div style={{ flex: 1, maxWidth: 80, height: 1, background: '#C9A84C' }} />
            <span style={{ fontFamily: 'DM Sans', fontSize: 10, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#C9A84C' }}>Contact Us</span>
            <div style={{ flex: 1, maxWidth: 80, height: 1, background: '#C9A84C' }} />
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(40px, 6vw, 80px)',
            fontWeight: 700, fontStyle: 'italic',
            color: '#1C1C1A', lineHeight: 1.0,
            margin: 0, letterSpacing: '-0.5px'
          }}>
            We'd Love to<br />Hear From You
          </h2>
        </div>

        {/* Two column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="contact-cols">

          {/* Left — contact rows */}
          <div ref={leftRef} className="reveal-left">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                restaurant.email && {
                  href: `mailto:${restaurant.email}`,
                  icon: '✉',
                  label: 'Email us',
                  value: restaurant.email,
                },
                links?.phone && {
                  href: `tel:${links.phone}`,
                  icon: '☎',
                  label: 'Give us a call',
                  value: links.phone,
                  onClick: () => trackEvent(restaurant.id, 'phone_click'),
                },
                links?.reservation_url && {
                  href: links.reservation_url,
                  icon: '📅',
                  label: 'Make a reservation',
                  value: 'Book online →',
                  onClick: () => trackEvent(restaurant.id, 'reserve_click'),
                  external: true,
                },
              ].filter(Boolean).map(({ href, icon, label, value, onClick, external }) => (
                <a key={label} href={href}
                  target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
                  onClick={onClick}
                  style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '22px 0', borderBottom: '1px solid #E8E4DE', textDecoration: 'none', transition: 'padding-left 0.35s ease' }}
                  onMouseOver={e => { e.currentTarget.style.paddingLeft = '8px'; e.currentTarget.querySelector('.cv').style.color = '#C9A84C' }}
                  onMouseOut={e => { e.currentTarget.style.paddingLeft = '0'; e.currentTarget.querySelector('.cv').style.color = '#1C1C1A' }}>
                  <div style={{ width: 52, height: 52, background: '#fff', border: '1px solid #E8E4DE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20, transition: 'border-color 0.25s, background 0.25s' }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', color: '#C8C4BE', marginBottom: 4, fontFamily: 'DM Sans', fontWeight: 600 }}>{label}</div>
                    <div className="cv" style={{ fontSize: 15, color: '#1C1C1A', fontFamily: 'DM Sans', fontWeight: 600, transition: 'color 0.25s' }}>{value}</div>
                  </div>
                </a>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
              {links?.reservation_url && (
                <a href={links.reservation_url} target="_blank" rel="noreferrer"
                  onClick={() => trackEvent(restaurant.id, 'reserve_click')}
                  className="btn-gold">Reserve a Table</a>
              )}
              {links?.order_url && (
                <a href={links.order_url} target="_blank" rel="noreferrer"
                  onClick={() => trackEvent(restaurant.id, 'order_click')}
                  className="btn-outline">Order Online</a>
              )}
            </div>
          </div>

          {/* Right — brand card with personality */}
          <div ref={rightRef} className="reveal-right">
            <div style={{ background: '#1C1C1A', padding: '52px 48px', position: 'relative', overflow: 'hidden' }}>
              {/* Gold top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(to right, #C9A84C, #E8D080, #C9A84C)' }} />

              {/* Decorative circle */}
              <div style={{ position: 'absolute', top: 24, right: 24, width: 80, height: 80, border: '1px solid rgba(201,168,76,0.2)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', top: 40, right: 40, width: 48, height: 48, border: '1px solid rgba(201,168,76,0.1)', borderRadius: '50%' }} />

              {/* Content */}
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontStyle: 'italic', fontWeight: 700, color: '#fff', marginBottom: 6, letterSpacing: '-0.3px', position: 'relative' }}>
                {restaurant.name}
              </div>
              {restaurant.city && (
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'DM Sans', marginBottom: 32 }}>
                  {restaurant.city}
                </div>
              )}
              <div style={{ width: 36, height: 1, background: '#C9A84C', marginBottom: 32 }} />
              {restaurant.tagline && (
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, fontFamily: "'Playfair Display', serif", fontStyle: 'italic', marginBottom: 32 }}>
                  "{restaurant.tagline}"
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Sans', letterSpacing: 2, textTransform: 'uppercase' }}>
                  {restaurant.est ? `Est. ${restaurant.est}` : new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #contact-section > div { padding: 72px 24px !important; }
          .contact-cols { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  )
}
