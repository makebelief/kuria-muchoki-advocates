const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, max-age=0',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function clean(value, max) {
  return String(value ?? '').trim().slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function POST(request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get('origin');
  if (origin && origin !== requestUrl.origin) {
    return json({ ok: false, message: 'Request origin not allowed.' }, 403);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return json({ ok: false, message: 'Unsupported request type.' }, 415);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, message: 'Invalid request body.' }, 400);
  }

  // Honeypot: bots often fill hidden fields. Return success without sending.
  if (clean(body.website, 120)) {
    return json({ ok: true, message: 'Thank you. Your enquiry has been received.' });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 160);
  const telephone = clean(body.telephone, 40);
  const service = clean(body.service, 120) || 'General legal matter';
  const preferredContact = clean(body.preferred_contact, 40) || 'Email';
  const enquiry = clean(body.enquiry, 2000);

  if (name.length < 2 || !validEmail(email) || enquiry.length < 10) {
    return json({ ok: false, message: 'Please complete the required fields correctly.' }, 400);
  }

  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'michaelmuchoki7@gmail.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendKey || !fromEmail) {
    return json({ ok: false, code: 'EMAIL_NOT_CONFIGURED', message: 'Web delivery is temporarily unavailable.' }, 503);
  }

  const subject = `Website enquiry: ${service}`;
  const text = [
    'New website enquiry — Kuria Muchoki & Co. Advocates',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Telephone: ${telephone || 'Not provided'}`,
    `Preferred contact: ${preferredContact}`,
    `Practice area: ${service}`,
    '',
    'Enquiry:',
    enquiry
  ].join('\n');

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#171717;max-width:680px;margin:auto">
      <h2 style="margin:0 0 18px">New website enquiry</h2>
      <table style="border-collapse:collapse;width:100%;margin-bottom:20px">
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Name</td><td>${escapeHtml(name)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Email</td><td>${escapeHtml(email)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Telephone</td><td>${escapeHtml(telephone || 'Not provided')}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Preferred contact</td><td>${escapeHtml(preferredContact)}</td></tr>
        <tr><td style="padding:6px 12px 6px 0;font-weight:700">Practice area</td><td>${escapeHtml(service)}</td></tr>
      </table>
      <h3 style="margin:0 0 8px">Enquiry</h3>
      <p style="white-space:pre-wrap">${escapeHtml(enquiry)}</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:24px 0">
      <p style="font-size:12px;color:#666">Submitted through the Kuria Muchoki &amp; Co. Advocates website.</p>
    </div>`;

  let resendResponse;
  try {
    resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${resendKey}`,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject,
        text,
        html
      })
    });
  } catch {
    return json({ ok: false, message: 'The enquiry could not be delivered right now.' }, 502);
  }

  if (!resendResponse.ok) {
    return json({ ok: false, message: 'The enquiry could not be delivered right now.' }, 502);
  }

  return json({ ok: true, message: 'Thank you. Your enquiry has been sent successfully.' });
}

export function GET() {
  return json({ ok: false, message: 'Method not allowed.' }, 405);
}
