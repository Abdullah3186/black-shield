const VERSION='5.0.12';
const PREFIX='black-shield-'+self.registration.scope+'-';
const CACHE=PREFIX+VERSION;
const HOME=new URL('./index.html',self.registration.scope).href;
const ASSETS=['manifest.webmanifest','icon.svg'].map(p=>new URL(p,self.registration.scope).href);
self.addEventListener('install',event=>event.waitUntil((async()=>{const response=await fetch(HOME,{cache:'reload'});if(!response.ok)throw Error('Release unavailable');const html=await response.clone().text();if(!html.includes("const VERSION='"+VERSION+"'"))throw Error('Release version mismatch');const cache=await caches.open(CACHE);await cache.put(HOME,response);await cache.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(event.request.mode==='navigate'&&url.href.startsWith(self.registration.scope)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(HOME))||fetch(event.request);})());}else if(ASSETS.includes(url.href)){event.respondWith((async()=>{const cache=await caches.open(CACHE);return (await cache.match(url.href))||fetch(event.request);})());}});