/* RizaBot + reveal animations + contact form + visit tracking */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const sid = (() => { try { return localStorage.sid ||= crypto.randomUUID(); } catch { return 'anon'; } })();
const post = async (path, body) => {
  const r = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { status: r.status });
  return j;
};
const ROBO = `<svg class="robo" viewBox="0 0 100 100" aria-hidden="true">
<line x1="50" y1="11" x2="50" y2="21" stroke="#a4243b" stroke-width="3"/><circle class="ant" cx="50" cy="8" r="4.5"/>
<rect class="ear" x="10" y="36" width="8" height="16" rx="4"/><rect class="ear" x="82" y="36" width="8" height="16" rx="4"/>
<rect class="bod" x="30" y="72" width="40" height="22" rx="10"/><rect class="arm l" x="21" y="74" width="8" height="16" rx="4"/><rect class="arm r" x="71" y="74" width="8" height="16" rx="4"/>
<rect class="shell" x="18" y="20" width="64" height="52" rx="20"/><rect class="face" x="25" y="30" width="50" height="32" rx="13"/>
<ellipse class="eye" cx="40" cy="44" rx="7" ry="7.5"/><ellipse class="eye" cx="60" cy="44" rx="7" ry="7.5"/>
<circle class="pupil" cx="40" cy="44" r="3.5"/><circle class="pupil" cx="60" cy="44" r="3.5"/>
<circle class="cheek" cx="30" cy="55" r="3.5"/><circle class="cheek" cx="70" cy="55" r="3.5"/>
<path class="mouth" d="M43 54 Q50 60 57 54"/></svg>`;

const bot = document.createElement('div');
bot.id = 'rbot';
bot.innerHTML = `<div class="rb-tip" id="rbTip">Hi! Ask me about Riza 👋</div>
<section class="rb-panel" id="rbPanel" aria-label="Chat with RizaBot">
<header><span class="rb-mini">${ROBO}</span><div><b>RizaBot</b><small>Ask me anything about Riza</small></div><button id="rbClose" aria-label="Close chat">✕</button></header>
<div class="rb-msgs" id="rbMsgs"></div><div class="rb-chips" id="rbChips"></div>
<form id="rbForm"><input id="rbIn" maxlength="500" autocomplete="off" placeholder="Type your question…" aria-label="Your message"><button aria-label="Send">➤</button></form></section>
<button class="rb-fab" id="rbFab" aria-label="Open chat">${ROBO}</button>`;
document.body.append(bot);

const msgs = $('#rbMsgs'), panel = $('#rbPanel'), input = $('#rbIn');
let flow = null, moodTimer;
const mood = (m, ms = 0) => { bot.dataset.mood = m; clearTimeout(moodTimer); if (ms) moodTimer = setTimeout(() => bot.dataset.mood = '', ms); };

// eyes follow the cursor
addEventListener('pointermove', e => {
  bot.querySelectorAll('.rb-fab .pupil').forEach(p => {
    const b = p.getBoundingClientRect(), dx = e.clientX - (b.x + b.width / 2), dy = e.clientY - (b.y + b.height / 2);
    const d = Math.hypot(dx, dy) || 1, k = Math.min(3, d / 40);
    p.style.transform = `translate(${dx / d * k}px,${dy / d * k}px)`;
  });
});

const add = (who, text) => { const m = document.createElement('div'); m.className = 'rb-m ' + who; m.textContent = text; msgs.append(m); msgs.scrollTop = msgs.scrollHeight; return m; };
const typeOut = (text) => new Promise(res => {
  const m = add('bot', ''); let i = 0; mood('talk');
  const t = setInterval(() => { m.textContent = text.slice(0, ++i); msgs.scrollTop = msgs.scrollHeight; if (i >= text.length) { clearInterval(t); mood('happy', 2500); res(); } }, 14);
});
const typing = () => { const m = add('bot', ''); m.innerHTML = '<span class="rb-dots"><span></span><span></span><span></span></span>'; return m; };
const chips = list => { const c = $('#rbChips'); c.innerHTML = ''; list.forEach(t => { const b = document.createElement('button'); b.type = 'button'; b.textContent = t; b.onclick = () => send(t); c.append(b); }); };
const DEFAULT_CHIPS = ['Who is Riza?', 'Skills', 'Projects', 'Experience', 'Contact Riza'];

let opened = false;
const toggle = open => {
  panel.classList.toggle('open', open); $('#rbTip').classList.remove('show');
  if (open && !opened) { opened = true; mood('happy', 2500); typeOut("Hi, I'm RizaBot 🤖 I can tell you about Riza's skills, projects and experience, or send her a message for you. What would you like to know?").then(() => chips(DEFAULT_CHIPS)); }
  if (open) input.focus();
};
$('#rbFab').onclick = () => toggle(!panel.classList.contains('open'));
$('#rbClose').onclick = () => toggle(false);
setTimeout(() => { if (!opened) { $('#rbTip').classList.add('show'); mood('happy', 2500); setTimeout(() => $('#rbTip').classList.remove('show'), 5000); } }, 3500);

const STEPS = [
  ['name', "Great! What's your name?"],
  ['email', 'Nice to meet you, {name}! What email can Riza reply to?'],
  ['message', 'And what would you like to tell her?']
];
async function handleFlow(text) {
  if (/^cancel$/i.test(text)) { flow = null; return typeOut('No problem, cancelled. Anything else?'); }
  const step = STEPS[flow.i][0];
  if (step === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)) return typeOut("That email doesn't look right. Try again? (or type cancel)");
  flow.data[step] = text; flow.i++;
  if (flow.i < STEPS.length) return typeOut(STEPS[flow.i][1].replace('{name}', flow.data.name));
  const d = flow.data; flow = null; mood('think'); const t = typing();
  try { await post('/api/contact', { ...d, source: 'chatbot' }); t.remove(); await typeOut('Done! ✅ Your message is on its way to Riza, She will get a notification right now.'); }
  catch (e) { t.remove(); await typeOut(e.status === 429 ? 'You have sent a lot of messages, please try again later.' : 'Sorry, something went wrong. You can email rizajahan63@gmail.com directly.'); }
}
async function send(text) {
  text = text.trim(); if (!text) return;
  add('me', text); input.value = ''; $('#rbChips').innerHTML = '';
  if (flow) return handleFlow(text);
  mood('think'); const t = typing();
  try {
    const r = await post('/api/chat', { sessionId: sid, message: text });
    t.remove(); await typeOut(r.answer);
    if (r.action === 'contact') { flow = { i: 0, data: {} }; await typeOut(STEPS[0][1]); } else chips(DEFAULT_CHIPS);
  } catch (e) { t.remove(); await typeOut(e.status === 429 ? 'Whoa, slow down a little 😅 try again in a minute.' : "I can't reach my brain right now. Please email rizajahan63@gmail.com."); }
}
$('#rbForm').onsubmit = e => { e.preventDefault(); send(input.value); };

// contact form on the page
const f = $('#contactForm'), note = $('#msg');
f?.addEventListener('submit', async e => {
  e.preventDefault(); const d = Object.fromEntries(new FormData(f)), b = f.querySelector('button'); b.disabled = true; note.textContent = 'Sending…';
  try { await post('/api/contact', { name: d.Name, email: d.Email, message: d.Message, website: d.website, source: 'form' }); note.textContent = 'Message sent ✔ Riza will get back to you soon.'; f.reset(); mood('happy', 3000); }
  catch (err) { note.textContent = err.status === 429 ? 'Too many attempts, please try later.' : 'Could not send. Please email me directly.'; }
  b.disabled = false; setTimeout(() => note.textContent = '', 6000);
});

// scroll reveal + progress bar
const io = new IntersectionObserver(es => es.forEach(x => x.isIntersecting && (x.target.classList.add('in'), io.unobserve(x.target))), { threshold: .12 });
document.querySelectorAll('.box,.project_list>div,.work,.about_col1,.about_col2,.contact_left,.contact_right,.service-header,.Sub_title').forEach(el => { el.classList.add('reveal'); io.observe(el); });
const bar = document.createElement('div'); bar.id = 'scrollbar'; document.body.prepend(bar);
addEventListener('scroll', () => bar.style.width = scrollY / (document.documentElement.scrollHeight - innerHeight) * 100 + '%', { passive: true });

// save the visit in the database
post('/api/chat', { type: 'visit', sessionId: sid, path: location.pathname, ref: document.referrer.slice(0, 200) }).catch(() => {});
})();
