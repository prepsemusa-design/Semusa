const CACHE='semusa-pwa-v1';
const SHELL=['./','index.html','manifest.json','icon-192.png','icon-512.png','maskable-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request,u=new URL(r.url);
 /* só mesmo domínio e GET: Supabase, Mercado Pago e pagamentos NUNCA passam pelo cache */
 if(r.method!=='GET'||u.origin!==location.origin)return;
 /* abre do cache na hora e atualiza em segundo plano (versão nova na próxima abertura) */
 e.respondWith(caches.open(CACHE).then(async c=>{
  const hit=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(res=>{if(res&&res.ok)c.put(r,res.clone());return res}).catch(()=>hit||(r.mode==='navigate'?c.match('index.html'):undefined));
  return hit||net;
 }));
});
