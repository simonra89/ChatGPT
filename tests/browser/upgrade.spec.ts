import {test,expect} from '@playwright/test';
import {createServer,type Server} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {initialStore} from '../../src/engine';
import {modules as oldModules} from '../../src/content-v1';

let server:Server;let revision=0;
test.beforeAll(async()=>{
 const root=resolve('dist');
 server=createServer(async(req,res)=>{try{const path=new URL(req.url!,'http://test').pathname;let file=resolve(root,'.'+(path==='/'?'/index.html':path));if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}let bytes=await readFile(file);if(path==='/sw.js')bytes=Buffer.from(bytes.toString()+`\n// Test update revision ${revision}`);res.writeHead(200,{'Content-Type':({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json'} as Record<string,string>)[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);}catch{res.writeHead(404).end();}});
 await new Promise<void>(resolve=>server.listen(4188,'127.0.0.1',resolve));
});
test.afterAll(async()=>{await new Promise<void>((resolve,reject)=>server.close(e=>e?reject(e):resolve()));});

test('a saved v1 round resumes with unchanged answers, then a new round uses v2',async({page})=>{
 const store=initialStore();delete store.profiles[0].roundSize;store.profiles[0].minutes=5;
 const module=oldModules.find(m=>m.id==='matte-2-1')!;const task=module.tasks[0];
 store.session={profileId:store.activeId,moduleId:module.id,taskIds:[task.id],index:0,phase:'task',observations:[],support:[],paused:true};
 await page.addInitScript(s=>{if(!localStorage.getItem('laeringsreisen-v1'))localStorage.setItem('laeringsreisen-v1',JSON.stringify(s));},store);
 await page.goto('/');await page.getByRole('button',{name:'Fortsett reisen'}).click();
 await expect(page.locator('.task-question')).toHaveText(task.prompt);await page.getByLabel('Ditt svar').fill(task.answer!);await page.getByRole('button',{name:'Prøv svaret'}).click();await expect(page.getByRole('heading',{name:'Der fant du det!'})).toBeVisible();
 await page.getByRole('button',{name:'Se hva du har øvd på'}).click();await page.getByRole('button',{name:'Ferdig for i dag'}).click();await page.getByRole('button',{name:'Start oppdraget'}).click();
 const updated=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));expect(updated.observations[0].version).toBe(1);expect(updated.observations[0].firstAnswer).toBe(task.answer);expect(updated.session.contentVersion).toBe(2);expect(updated.session.taskIds.length).toBe(12);expect(updated.session.taskIds.every((id:string)=>id.startsWith('v2-'))).toBe(true);
});

test('a waiting offline-package update is offered and preserves local profiles when applied',async({page})=>{
 await page.goto('http://127.0.0.1:4188/');await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('laeringsreisen-v1')!);s.profiles[0].name='Oppdateringstest';localStorage.setItem('laeringsreisen-v1',JSON.stringify(s));});await page.reload();await expect(page.getByRole('heading',{name:/Hei, Oppdateringstest/})).toBeVisible();
 revision++;
 await page.evaluate(async()=>{await (await navigator.serviceWorker.ready).update();});
 await expect(page.getByRole('button',{name:'Oppdater appen'})).toBeVisible();
 await page.getByRole('button',{name:'Oppdater appen'}).click();await expect(page.getByRole('heading',{name:/Hei, Oppdateringstest/})).toBeVisible();await expect(page.getByRole('button',{name:'Oppdater appen'})).toHaveCount(0);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!).profiles[0].name)).toBe('Oppdateringstest');
});
