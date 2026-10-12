'use strict';
// A new cache version makes installed apps replace the older offline app shell.
const CACHE_NAME='mi-espanol-shell-v7';
const APP_SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache=>cache.addAll(APP_SHELL.map(path=>new Request(new URL(path,self.registration.scope),{cache:'reload'}))))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('mi-espanol-shell-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    // Prefer fresh HTML even in an installed app. Fall back to the shell only offline.
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(response=>{
        if(response.ok){
          const copy=response.clone();
          event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy)));
        }
        return response;
      }).catch(()=>caches.match('./index.html'))
    );
  }else if(APP_SHELL.some(path=>new URL(path,self.registration.scope).pathname===url.pathname)){
    event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
  }
});
// Review progress is stored in localStorage; audio recordings are stored in IndexedDB.
// Don't duplicate the large audio JSON in CacheStorage.
