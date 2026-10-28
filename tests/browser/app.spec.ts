import {test,expect,type Page} from '@playwright/test';
import {getTask} from '../../src/content';
import type {Session,Store} from '../../src/types';

async function readStore(page:Page):Promise<Store>{
 return page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));
}
async function currentSession(page:Page):Promise<Session>{
 const session=(await readStore(page)).session;
 expect(session,'An active round should have been persisted').toBeTruthy();
 return session!;
}
/** Answer the actual active task through its public UI, including shuffled/repeated tiles. */
async function solveCurrentTask(page:Page){
 const session=await currentSession(page);
 const moduleId=session.mixedModules?.[session.index]||session.moduleId;
 const task=getTask(moduleId,session.taskIds[session.index],session.contentVersion);
 expect(task,'The active task reference must resolve to current or retained content').toBeTruthy();
 const panel=page.locator('.task-panel');
 if(task!.kind==='choice'){
  await panel.locator('.answers').getByText(task!.answer!,{exact:true}).click();
 }else if(task!.kind==='write'||task!.kind==='model'){
  await panel.getByLabel('Ditt svar',{exact:true}).fill(task!.answer!);
  await panel.getByRole('button',{name:'Prøv svaret',exact:true}).click();
 }else if(task!.kind==='build'||task!.kind==='order'){
  const labels:string[]=task!.kind==='order'?JSON.parse(task!.answer!):task!.answer!.includes(' ')?task!.answer!.split(' '):[...task!.answer!];
  for(const label of labels)await panel.locator('.task-tile-bank').getByRole('button',{name:label,exact:true}).and(page.locator('button:enabled')).first().click();
  await panel.getByRole('button',{name:'Prøv svaret',exact:true}).click();
 }else if(task!.kind==='select'){
  const labels:string[]=JSON.parse(task!.answer!);
  for(const label of labels)await panel.getByRole('checkbox',{name:label,exact:true}).click();
  await panel.getByRole('button',{name:'Prøv svaret',exact:true}).click();
 }else if(task!.kind==='match'){
  for(let i=0;i<task!.pairs!.length;i++){
   await panel.locator('.task-match-source').nth(i).click();
   await panel.locator('.task-match-right').getByRole('button',{name:task!.pairs![i].right,exact:true}).click();
  }
  await panel.getByRole('button',{name:'Prøv svaret',exact:true}).click();
 }else if(task!.kind==='open'){
  await panel.getByRole('textbox',{name:'Din tekst (valgfritt)'}).fill('Jeg har prøvd aktiviteten og kan fortelle om den.');
  await panel.getByRole('button',{name:'Jeg har øvd',exact:true}).click();
 }else throw Error(`Unsupported answer renderer: ${task!.kind}`);
 await expect(panel.locator('.feedback.success')).toBeVisible();
 const answered=(await currentSession(page)).observations.at(-1)!;
 expect(answered.taskId).toBe(task!.id);
 expect(answered.correct).toBe(task!.kind==='open'?null:true);
}

test('child journey, hints, pause, reload, summary and isolated profiles',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.getByRole('heading',{name:/Hei, lille oppdager/})).toBeVisible();
 await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();
 await page.getByRole('button',{name:'Få et hint'}).click();await expect(page.locator('.feedback.hint')).toBeVisible();
 await page.getByRole('button',{name:'Pause',exact:true}).click();await expect(page.getByRole('heading',{name:'En liten pust i bakken'})).toBeVisible();
 await page.reload();await page.getByRole('button',{name:'Fortsett reisen'}).click();await expect(page.locator('.feedback.hint')).toBeVisible();
 const taskCount=(await currentSession(page)).taskIds.length;expect(taskCount).toBe(12);
 for(let i=0;i<taskCount;i++){await solveCurrentTask(page);await page.getByRole('button',{name:i===taskCount-1?'Se hva du har øvd på':'Neste oppdagelse'}).click();}
 await expect(page.getByRole('heading',{name:'Et lite steg videre!'})).toBeVisible();await page.getByRole('button',{name:'Ferdig for i dag'}).click();
 const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('laeringsreisen-v1')!));expect(first.observations.length).toBe(taskCount);expect(first.observations[0].support).toContain('hint');
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
 await page.goto('/');await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();
 const originalCount=(await currentSession(page)).taskIds.length;expect(originalCount).toBe(12);
 await solveCurrentTask(page);await page.getByRole('button',{name:'Neste oppdagelse'}).click();
 await page.locator('.profile-pill').click();await page.getByRole('button',{name:'Legg til en oppdager'}).click();await page.getByLabel('Kallenavn').fill('Maja');await page.getByRole('button',{name:'La reisen begynne'}).click();await page.getByRole('button',{name:'Start oppdraget'}).click();await page.locator('.profile-pill').click();await page.getByRole('button',{name:/Oppdager/}).click();await page.getByRole('button',{name:'Fortsett reisen'}).click();
 await expect(page.locator('.task-label')).toContainText(`2 AV ${originalCount}`);
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Avslutt økten'}).click();
 // A genuinely answered task above supplies the practiced module; no fabricated observations.
 await page.getByRole('button',{name:'Min reise',exact:true}).click();await page.getByRole('button',{name:'Blandet repetisjon'}).click();await expect(page.locator('.task-question')).toBeVisible();
 const mixed=await currentSession(page);expect(mixed.taskIds).toHaveLength(12);expect(mixed.mixedModules?.length).toBe(mixed.taskIds.length);
 await solveCurrentTask(page);
});

test('parent can choose an eighteen-task round without changing a round already in progress',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Start oppdraget'}).click();
 const original=await currentSession(page);expect(original.taskIds).toHaveLength(12);
 await page.getByRole('button',{name:'For voksne',exact:true}).click();await page.getByLabel('PIN-kode').fill('1234');await page.getByRole('button',{name:'Lagre PIN og åpne'}).click();
 await page.getByLabel('Oppgaver i en runde').selectOption('18');
 const configured=await readStore(page);expect(configured.profiles[0].roundSize).toBe(18);expect(configured.session?.taskIds).toEqual(original.taskIds);
 await page.getByRole('button',{name:'Lukk',exact:true}).click();await page.getByRole('button',{name:'Fortsett reisen'}).click();
 await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'Avslutt økten'}).click();
 await page.getByRole('button',{name:'Start oppdraget'}).click();await page.getByRole('button',{name:'Nå vil jeg prøve'}).click();
 const longer=await currentSession(page);expect(longer.taskIds).toHaveLength(18);await expect(page.locator('.task-label')).toContainText('1 AV 18');await solveCurrentTask(page);
 await page.getByRole('button',{name:'Neste oppdagelse'}).click();await page.getByRole('button',{name:'Pause',exact:true}).click();await page.reload();await page.getByRole('button',{name:'Fortsett reisen'}).click();
 await expect(page.locator('.task-label')).toContainText('2 AV 18');expect((await currentSession(page)).taskIds).toEqual(longer.taskIds);
});
