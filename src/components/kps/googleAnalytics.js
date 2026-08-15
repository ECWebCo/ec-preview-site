// Google Analytics 4 for KP's Kitchen.
// Loaded only from KpsLayout, so it never runs for other tenants on this template.
// SPA route changes are captured by GA4's enhanced measurement (history events),
// which is on by default; initGA is idempotent.
const GA_ID = 'G-62CHRGJG8Q'

let initialized = false

export function initGA() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.dataLayer = window.dataLayer || []
  window.gtag = function () { window.dataLayer.push(arguments) }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID)
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)
}
