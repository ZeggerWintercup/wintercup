// Zegger Wintercup - service worker (v3.5.4)
//
// Doel: de app "installeerbaar" maken voor Chrome op Android (automatische
// installatiemelding, en oudere Chrome-versies die een service worker eisen).
//
// Bewust GEEN caching: elke pagina en elk verzoek komt altijd vers van het
// netwerk, dus een nieuwe index.html is direct zichtbaar en er kan geen oude
// versie blijven hangen. Het enige dat deze worker doet is een nette melding
// tonen als de app wordt geopend zonder internetverbinding.

const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="nl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Zegger Wintercup</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:#1a3a2a;color:#f4efe6;font-family:-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;padding:32px}
  h1{font-size:1.4rem;color:#c9a84c;margin:0 0 12px}
  p{font-size:1rem;line-height:1.5;margin:0 0 24px;opacity:.85}
  button{background:#c9a84c;color:#1a3a2a;border:0;border-radius:24px;padding:12px 26px;font-size:1rem;font-weight:700}
</style></head>
<body><div>
  <h1>Zegger Wintercup</h1>
  <p>Geen internetverbinding.<br>Controleer je verbinding en probeer het opnieuw.</p>
  <button onclick="location.reload()">Opnieuw proberen</button>
</div></body></html>`;

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  // Alleen het openen/herladen van de pagina zelf; al het andere (Supabase,
  // iconen, lettertypen) gaat ongemoeid rechtstreeks naar het netwerk.
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(() => new Response(OFFLINE_HTML, {
      status: 503,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    }))
  );
});
