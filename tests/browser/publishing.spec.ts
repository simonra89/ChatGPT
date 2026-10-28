import {test,expect} from '@playwright/test';

test('browser app runs under its GitHub Pages project path and restarts offline',async({page,context})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4174/ChatGPT/');
 await expect(page.getByRole('heading',{name:/Hei, lille oppdager/})).toBeVisible();
 const manifest=await page.evaluate(async()=>{const url=(document.querySelector('link[rel=manifest]') as HTMLLinkElement).href;return {url,data:await (await fetch(url)).json()};});
 expect(manifest.url).toContain('/ChatGPT/manifest.webmanifest');expect(manifest.data.display).toBe('standalone');
 for(const icon of manifest.data.icons){const response=await page.request.get(new URL(icon.src,manifest.url).href);expect(response.ok()).toBe(true);}
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 const scope=await page.evaluate(async()=>(await navigator.serviceWorker.ready).scope);expect(scope).toContain('/ChatGPT/');
 await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:/Hei, lille oppdager/})).toBeVisible();
 await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();await expect(page.locator('.task-question')).toBeVisible();
 expect(errors).toEqual([]);
});

test('optional Android install guide opens without requiring any installation',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Bruk som mobilapp'}).click();
 await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('dialog').getByRole('heading',{name:'Android',exact:true})).toBeVisible();
 await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();await page.getByRole('button',{name:'Start oppdraget'}).click();await expect(page.getByRole('heading',{name:'Vi prøver sammen først'})).toBeVisible();
});
