import { trackEvent } from '../lib/supabase'

export default function ContactSection({ restaurant, links }) {
  return (
    <section id="contact-section" style={{ padding: '96px 48px', background: 'var(--off)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
          <span style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--gold)', fontFamily: 'DM Sans, sans-serif' }}>Contact</span>
          <div style={{ width: 24, height: 1, background: 'var(--gold)' }} />
        </div>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.05, marginBottom: 48, textAlign: 'center' }}>
          We'd Love to<br /><em style={{ fontWeight: 400 }}>Hear From You</em>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, background: 'var(--mist)' }} className="contact-grid">
          {[
            {
              icon: '✉',
              label: 'Email',
              value: restaurant.email || 'hello@restaurant.com',
              btn: 'Send Email',
              href: `mailto:${restaurant.email || ''}`,
              event: null
            },
            {
              icon: '◻',
              label: 'Reservations',
              value: 'Available Online',
              btn: 'Book a Table',
              href: links?.reservation_url,
              event: 'reserve_click'
            },
            {
              icon: '✆',
              label: 'Phone',
              value: links?.phone || '',
              btn: 'Call Now',
              href: links?.phone ? `tel:${links.phone}` : null,
              event: 'phone_click'
            }
          ].filter(c => c.href).map((card, i) => (
            <div key={i} style={{ background: 'var(--off)', padding: '48px 36px', textAlign: 'center', transition: '0.2s' }}
              onMouseOver={e => e.currentTarget.style.background = '#fff'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--off)'}
            >
              <div style={{ width: 48, height: 48, background: 'var(--gold-lt)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 18, color: 'var(--gold)' }}>
                {card.icon}
              </div>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10, fontFamily: 'DM Sans, sans-serif' }}>
                {card.label}
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, color: 'var(--ink)', marginBottom: 20 }}>
                {card.value}
              </div>
              <a href={card.href} target={card.href?.startsWith('http') ? '_blank' : '_self'} rel="noreferrer"
                onClick={() => card.event && trackEvent(restaurant.id, card.event)}
                style={{ display: 'block', padding: '12px 24px', background: 'var(--ink)', color: '#fff', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'DM Sans, sans-serif', transition: '0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--gold)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--ink)'}
              >
                {card.btn}
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #contact-section { padding: 64px 24px !important; }
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
