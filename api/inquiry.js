// KP's Kitchen inquiry form handler — sends Private Events / Catering
// inquiries via Resend. Requires RESEND_API_KEY in the project env.
// Optional: INQUIRY_TO (default kerrypauly@gmail.com), INQUIRY_FROM.

const FORM_SUBJECTS = ['Private Event Inquiry', 'Catering Inquiry']

const NAVY = '#1B2B4B'
const MUTED = '#8A8278'

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function row(label, value) {
  if (!value) return ''
  return `<tr>
    <td style="padding:8px 16px 8px 0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${MUTED};vertical-align:top;white-space:nowrap;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:${NAVY};line-height:1.6;">${escapeHtml(value)}</td>
  </tr>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { subject, name, email, phone, date, guests, message, company } = req.body || {}

  // Honeypot — bots fill the hidden "company" field; pretend success
  if (company) return res.status(200).json({ success: true })

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address' })
  }

  const formSubject = FORM_SUBJECTS.includes(subject) ? subject : 'Website Inquiry'
  const to = process.env.INQUIRY_TO || 'kerrypauly@gmail.com'
  const from = process.env.INQUIRY_FROM || "KP's Kitchen Website <noreply@ecwebco.com>"

  const html = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;padding:32px 24px;">
      <div style="border-bottom:3px solid ${NAVY};padding-bottom:16px;margin-bottom:24px;">
        <div style="font-family:sans-serif;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">KP's Kitchen &middot; kps-kitchen.com</div>
        <h2 style="margin:0;font-size:20px;color:${NAVY};">${escapeHtml(formSubject)}</h2>
      </div>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;">
        ${row('Name', name)}
        ${row('Email', email)}
        ${row('Phone', phone)}
        ${row('Date', date)}
        ${row('Guests', guests)}
      </table>
      ${message ? `<div style="background:#FAFAF8;border-left:3px solid ${NAVY};padding:16px 20px;margin-top:16px;font-family:sans-serif;font-size:14px;color:${NAVY};line-height:1.7;">${escapeHtml(message)}</div>` : ''}
      <p style="margin:24px 0 0;font-family:sans-serif;font-size:12px;color:${MUTED};">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
    </div>`

  const text = [
    `${formSubject} - kps-kitchen.com`,
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    date && `Date: ${date}`,
    guests && `Guests: ${guests}`,
    message && `\n${message}`,
  ].filter(Boolean).join('\n')

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `${formSubject} - ${name}`,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      console.error('Resend error:', response.status, err)
      throw new Error(err.message || 'Failed to send email')
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Inquiry error:', err)
    return res.status(500).json({ error: 'Failed to send inquiry' })
  }
}
