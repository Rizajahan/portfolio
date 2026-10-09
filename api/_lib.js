import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

export const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, { auth: { persistSession: false } });

export const ipHash = req =>
  crypto.createHash('sha256').update(String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() + process.env.IP_SALT).digest('hex').slice(0, 32);

// POST only + only our own website may call the API
export function guard(req, res) {
  const allowed = process.env.SITE_ORIGIN, origin = req.headers.origin;
  if (req.method !== 'POST') { res.status(405).json({ error: 'method' }); return false; }
  if (allowed && origin && origin !== allowed) { res.status(403).json({ error: 'forbidden' }); return false; }
  return true;
}
export const clean = (s, n) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, n);

export async function tooMany(table, hash, max, seconds) {
  const since = new Date(Date.now() - seconds * 1000).toISOString();
  const { count } = await db.from(table).select('id', { count: 'exact', head: true }).eq('ip_hash', hash).gte('created_at', since);
  return (count || 0) >= max;
}
// free push notification to phone + laptop through ntfy.sh
export const notify = (title, body) =>
  fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, { method: 'POST', headers: { Title: title, Priority: 'high', Tags: 'envelope' }, body }).catch(() => {});
