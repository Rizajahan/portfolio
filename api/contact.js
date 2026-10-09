import { db, guard, ipHash, clean, tooMany, notify } from './_lib.js';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  try {
    const b = req.body || {};
    if (b.website) return res.json({ ok: true });                 // honeypot: bots fill this hidden field
    const name = clean(b.name, 80), email = clean(b.email, 120), message = clean(b.message, 2000);
    if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: 'invalid' });
    const hash = ipHash(req);
    if (await tooMany('contacts', hash, 3, 600)) return res.status(429).json({ error: 'slow down' });
    const { error } = await db.from('contacts').insert({ name, email, message, source: clean(b.source, 20), ip_hash: hash });
    if (error) throw error;
    await notify('New portfolio message', `${name} <${email}>\n\n${message}`);
    res.json({ ok: true });
  } catch (e) { console.error('CONTACT ERROR:', e); res.status(500).json({ error: 'server' }); }
}