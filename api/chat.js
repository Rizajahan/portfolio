import { db, guard, ipHash, clean, tooMany } from './_lib.js';
import { reply } from './kb.js';

export default async function handler(req, res) {
  if (!guard(req, res)) return;
  try {
    const b = req.body || {}, hash = ipHash(req), sid = clean(b.sessionId, 64);
    if (b.type === 'visit') {
      if (await tooMany('visits', hash, 30, 600)) return res.json({ ok: true });
      await db.from('visits').insert({ session_id: sid, path: clean(b.path, 200), referrer: clean(b.ref, 200), user_agent: clean(req.headers['user-agent'], 200), ip_hash: hash });
      return res.json({ ok: true });
    }
    const q = clean(b.message, 500);
    if (!q) return res.status(400).json({ error: 'empty' });
    if (await tooMany('chat_messages', hash, 20, 60)) return res.status(429).json({ error: 'slow down' });
    const r = reply(q);
    await db.from('chat_messages').insert({ session_id: sid, question: q, answer: r.answer, ip_hash: hash });
    res.json(r);
  } catch { res.status(500).json({ error: 'server' }); }
}
