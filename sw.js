// Change VERSION for every release, including HTML-only changes.
const VERSION='5.0.5';
const PREFIX='black-shield-'+self.registration.scope+'-';
const CACHE=PREFIX+VERSION;
const HOME=new URL('./index.html',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{const response=await fetch(HOME,{cache:'reload'});if(!response.ok)throw Error('Release unavailable');const html=await response.clone().text();if(!html.includes("const VERSION='"+VERSION+"'"))throw Error('Release version mismatch');const cache=await caches.open(CACHE);await cache.put(HOME,response);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{if(event.request.mode!=='navigate'||!event.request.url.startsWith(self.registration.scope))return;event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(HOME))||fetch(event.request);})());});