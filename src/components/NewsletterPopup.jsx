import { useEffect, useState } from 'react'

/* ─── NewsletterPopup ─────────────────────────────────────────
   Shows once per visitor (localStorage), 15 seconds after page load.
   Multi-tenant: only renders if restaurant.newsletter_signup_url is set.
   Opens Toast (or whatever URL) in a new tab.
*/

const NAVY = 'var(--c-ink)'
const CREAM = 'var(--c-bg)'
const GOLD = 'var(--c-accent)'
const MUTED = 'var(--c-muted)'

const DISMISS_DELAY_MS = 15000

export default function NewsletterPopup({ restaurant }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!restaurant?.newsletter_signup_url) return
    // Per-restaurant key so dismissal on one site doesn't suppress another
    const key = `ec_newsletter_dismissed_${restaurant.id || restaurant.slug || 'default'}`
    if (typeof window === 'undefined') return
    if (localStorage.getItem(key)) return

    const timer = setTimeout(() => setOpen(true), DISMISS_DELAY_MS)
    return () => clearTimeout(timer)
  }, [restaurant])

  if (!open || !restaurant?.newsletter_signup_url) return null

  const dismiss = () => {
    const key = `ec_newsletter_dismissed_${restaurant.id || restaurant.slug || 'default'}`
    try { localStorage.setItem(key, '1') } catch (e) {}
    setOpen(false)
  }

  const handleSubscribe = () => {
    // Mark dismissed before opening so they don't see it again
    dismiss()
    window.open(restaurant.newsletter_signup_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      animation: 'np-fadeIn 0.35s ease',
    }}>
      <div
        onClick={dismiss}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />
      <div style={{
        position: 'relative',
        width: 'min(440px, 100%)',
        background: CREAM,
        boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
        animation: 'np-slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 2,
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 22, lineHeight: 1, color: MUTED,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'color 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.color = NAVY)}
          onMouseOut={e => (e.currentTarget.style.color = MUTED)}
        >
          ✕
        </button>

        <div style={{ padding: '44px 36px 36px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-block', marginBottom: 16,
            fontSize: 10, fontWeight: 700, letterSpacing: '4px',
            textTransform: 'uppercase', color: GOLD,
          }}>
            Stay In Touch
          </div>
          <h3 style={{
            fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400,
            color: NAVY, lineHeight: 1.2, marginBottom: 14,
          }}>
            Join Our Newsletter
          </h3>
          <p style={{
            fontFamily: 'DM Sans, sans-serif', fontSize: 14,
            color: MUTED, lineHeight: 1.7, marginBottom: 28, maxWidth: 320, margin: '0 auto 28px',
          }}>
            Be the first to know about specials, new menu items, events, and what's happening at {restaurant.name}.
          </p>
          <button
            onClick={handleSubscribe}
            style={{
              background: NAVY, color: '#fff', border: 'none',
              padding: '15px 32px', fontSize: 12, fontWeight: 700,
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '3px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'opacity 0.2s',
              width: '100%', maxWidth: 280,
            }}
            onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseOut={e => (e.currentTarget.style.opacity = '1')}
          >
            Sign Up →
          </button>
          <button
            onClick={dismiss}
            style={{
              display: 'block', margin: '18px auto 0',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontSize: 11,
              color: MUTED, letterSpacing: '1px',
              textTransform: 'uppercase', fontWeight: 600,
            }}
          >
            No thanks
          </button>
        </div>
      </div>

      <style>{`
        @keyframes np-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes np-slideUp {
          from { opacity: 0; transform: translateY(20px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </div>
  )
}
