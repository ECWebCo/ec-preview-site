// Meta (Facebook) Pixel for KP's Kitchen.
// Loaded only from KpsLayout, so it never runs for other tenants on this template.
const PIXEL_ID = '729537555595489'

let initialized = false

// Standard Meta Pixel bootstrap (queues calls until fbevents.js loads)
function ensureFbq() {
  if (window.fbq) return window.fbq
  const fbq = function () {
    fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments)
  }
  fbq.push = fbq
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.queue = []
  window.fbq = fbq
  window._fbq = fbq
  const s = document.createElement('script')
  s.async = true
  s.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(s)
  return fbq
}

// Init + first PageView — call once on mount
export function initPixel() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  const fbq = ensureFbq()
  fbq('init', PIXEL_ID)
  fbq('track', 'PageView')
}

// SPA route changes — call on every navigation after the first render
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) window.fbq('track', 'PageView')
}

// Inquiry form conversions (Private Events / Catering)
export function trackLead(formName) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', { content_name: formName, content_category: 'Inquiry Form' })
  }
}
