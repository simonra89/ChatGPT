import {test,expect} from '@playwright/test';
test('child journey, hints, pause, reload, summary and isolated profiles',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{name:/Hei, lille oppdager/})).toBeVisible();
 await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();
 await page.getByRole('button',{name:'Få et hint'}).click();await expect(page.locator('.feedback.hint')).toBeVisible();
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('heading',{name:'En liten pust i bakken'})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Fortsett reisen'}).click();await expect(page.locator('.feedback.hint')).toBeVisible();
 for(let i=0;i<5;i++){await page.getByRole('button',{name:'Hopp over'}).click();await page.getByRole('button',{name:i===4?'Se hva du har øvd på':'Neste oppdagelse'}).click();}
 await expect(page.getByRole('heading',{name:'Et lite steg videre!'})).toBeVisible();await page.getByRole('button',{name:'Ferdig for i dag'}).click();
 const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));expect(first.observations.length).toBe(5);expect(first.observations[0].support).toContain('hint');
 await page.locator('.profile-pill').click();await page.getByRole('button',{name:'Legg til en oppdager'}).click();await page.getByRole('textbox',{name:'Kallenavn'}).fill('Maja');await page.getByRole('button',{name:'La reisen begynne'}).click();
 await expect(page.getByRole('heading',{name:/Hei, Maja/})).toBeVisible();const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));expect(data.profiles.length).toBe(2);expect(data.observations.every((o:any)=>o.profileId!==data.activeId)).toBe(true);expect(errors).toEqual([]);
});
test('parent gate, per-subject levels, backup and malformed import',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('1234');await page.getByRole('button',{name:'Lagre PIN og åpne'}).click();await expect(page.getByRole('heading',{name:'Små steg, med god støtte'})).toBeVisible();
 await page.getByLabel('Norsk trinn').selectOption('4');await page.getByLabel('Matte trinn').selectOption('1');await page.getByLabel('Engelsk trinn').selectOption('3');
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Eksporter',exact:true}).click();expect((await download).suggestedFilename()).toMatch(/laeringsreisen/);
 await page.locator('input[type=file]').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":1,"profiles":[]}')});await expect(page.getByRole('status')).toContainText('gyldig');
 await page.getByRole('button',{name:'Lukk',exact:true}).first().click();await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('9999');await page.getByRole('button',{name:'Åpne voksenområdet'}).click();await expect(page.getByRole('alert')).toContainText('stemmer ikke');
});
test('mobile layout and service-worker offline restart',async({page,context})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload();
 await expect(page.locator('.mobile-nav')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.screenshot({path:'test-results/mobile.png',fullPage:true});
 await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
 await context.setOffline(true);await page.reload();await expect(page.getByRole('heading',{name:/Hei, lille oppdager/})).toBeVisible();await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();await expect(page.locator('.task-question')).toBeVisible();await context.setOffline(false);
});
test('desktop screenshot',async({page})=>{await page.goto('/');await page.screenshot({path:'test-results/desktop.png',fullPage:true});});
test('backup import confirms replacement; deleting one profile preserves the other',async({page})=>{
 await page.goto('/');await page.locator('.profile-pill').click();await page.getByRole('button',{name:'Legg til en oppdager'}).click();await page.getByLabel('Kallenavn').fill('Søsken');await page.getByRole('button',{name:'La reisen begynne'}).click();
 await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('4321');await page.getByRole('button',{name:'Lagre PIN og åpne'}).click();
 const backup=await page.evaluate(()=>localStorage.getItem('laeringsreisen-v1')!);
 await page.getByLabel('Kallenavn').fill('Endret navn');await page.locator('input[type=file]').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(backup)});await expect(page.getByRole('heading',{name:'Gjenopprett sikkerhetskopi?'})).toBeVisible();await page.getByRole('button',{name:'Gjenopprett',exact:true}).click();await expect(page.getByRole('heading',{name:/Hei, Søsken/})).toBeVisible();
 await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('4321');await page.getByRole('button',{name:'Åpne voksenområdet'}).click();page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Slett denne profilen'}).click();
 const data=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));expect(data.profiles).toHaveLength(1);expect(data.profiles[0].name).toBe('Oppdager');
});
test('all twelve combinations expose four runnable modules',async({page})=>{
 await page.goto('/');for(const subject of ['norsk','matte','engelsk'])for(let grade=1;grade<=4;grade++){
 await page.evaluate(({subject,grade})=>{const s=JSON.parse(localStorage.getItem('laeringsreisen-v1')!);s.profiles[0].levels[subject]=grade;delete s.session;localStorage.setItem('laeringsreisen-v1',JSON.stringify(s));},{subject,grade});await page.reload();await page.locator(`.subject-card`).nth(['norsk','matte','engelsk'].indexOf(subject)).click();await expect(page.locator('.module-card')).toHaveCount(4);await page.locator('.module-card').first().click();await expect(page.getByRole('heading',{name:'Vi prøver sammen først'})).toBeVisible();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();await expect(page.locator('.task-question')).toBeVisible();
 }
});
test('own words require preview, and run as a separate written family activity',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('1234');await page.getByRole('button',{name:'Lagre PIN og åpne'}).click();
 await page.getByLabel('Ord, atskilt med komma').fill('måne, båt, skog');await page.getByRole('button',{name:'Forhåndsvis ordlisten'}).click();await expect(page.getByRole('button',{name:'Lagre øveord'})).toBeDisabled();await page.getByLabel('Jeg har kontrollert ordene').check();await page.getByRole('button',{name:'Lagre øveord'}).click();await expect(page.getByRole('status')).toContainText('klar');
 await page.getByRole('button',{name:'Lukk',exact:true}).click();await page.locator('.subject-card').first().click();await expect(page.getByRole('heading',{name:'Bygg ordet «måne»'})).toBeVisible();for(const letter of ['m','å','n','e'])await page.locator('.own-words .tiles').getByRole('button',{name:letter,exact:true}).click();await page.locator('.own-words').getByRole('button',{name:'Prøv svaret'}).click();await expect(page.locator('.word-feedback')).toContainText('Du bygde ordet');
});
test('siblings retain their own pause sessions and mixed review uses prior modules',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();await page.getByRole('button',{name:'Hopp over'}).click();await page.getByRole('button',{name:'Neste oppdagelse'}).click();
 await page.locator('.profile-pill').click();await page.getByRole('button',{name:'Legg til en oppdager'}).click();await page.getByLabel('Kallenavn').fill('Maja');await page.getByRole('button',{name:'La reisen begynne'}).click();await page.getByRole('button',{name:'Start oppdraget'}).click();await page.locator('.profile-pill').click();await page.getByRole('button',{name:/Oppdager/}).click();await page.getByRole('button',{name:'Fortsett reisen'}).click();await expect(page.locator('.task-label')).toContainText('2 AV 5');
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Avslutt økten'}).click();
 // Add a genuine practiced observation through the answer UI, then start review.
 await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();await page.getByLabel('Ditt svar').fill('0');await page.getByRole('button',{name:'Prøv svaret',exact:true}).click();await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Avslutt økten'}).click();
 await page.getByRole('button',{name:'Min reise',exact:true}).click();await page.getByRole('button',{name:'Blandet repetisjon'}).click();await expect(page.locator('.task-question')).toBeVisible();const s=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!).session);expect(s.mixedModules.length).toBeGreaterThan(0);
});
