import {readdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function walk(dir){const out=[];for(const f of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${f.name}`;if(f.isDirectory())out.push(...await walk(path));else out.push(path);}return out;}
const files=(await walk('dist')).filter(f=>!f.endsWith('sw.js'));const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));const version=hash.digest('hex').slice(0,16);const urls=files.map(f=>'./'+f.slice(5));
await writeFile('dist/sw.js',`const BASE=new URL('./',self.location.href);const CACHE='laeringsreisen-'+BASE.pathname+'-${version}';const PREFIX='laeringsreisen-'+BASE.pathname+'-';const FILES=${JSON.stringify(['./',...urls])}.map(path=>new URL(path,BASE).href);
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim();for(const c of await self.clients.matchAll())c.postMessage('OFFLINE_READY');})()));
self.addEventListener('fetch',e=>{const url=new URL(e.request.url);if(e.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;e.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(e.request,{ignoreVary:true});if(cached)return cached;try{return await fetch(e.request);}catch(err){if(e.request.mode==='navigate')return await cache.match(new URL('index.html',BASE).href);throw err;}})());});`);
console.log('Offline package:',version,urls.length,'files');
