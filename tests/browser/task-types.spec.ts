import {test,expect,type Page} from '@playwright/test';
import {spawn,type ChildProcess} from 'node:child_process';
import type {Task} from '../../src/types';

// Exercise the reusable answer controls with fixtures, independent of lesson selection.
const origin='http://127.0.0.1:4189';
let server:ChildProcess;
test.beforeAll(async()=>{
 server=spawn(process.execPath,['--input-type=module','-e',"import {createServer} from 'vite';const server=await createServer({server:{host:'127.0.0.1',port:4189,strictPort:true,hmr:false}});await server.listen();"],{stdio:'ignore'});
 const deadline=Date.now()+15000;
 while(Date.now()<deadline){try{if((await fetch(origin)).ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,100));}
 expect((await fetch(origin)).ok).toBe(true);
});
test.afterAll(()=>server?.kill('SIGTERM'));

const baseTask={version:2 as const,prompt:'Prøv oppgaven.',hint:'Se én gang til.',explanation:'Undersøk det som hører sammen.'};
async function harness(page:Page){
 const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('**/__task_harness__',route=>route.fulfill({contentType:'text/html',body:`<!doctype html><html lang="nb"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:16px;font-family:Arial;color:#344e3d}button,input{font:inherit}button{cursor:pointer}.primary{padding:13px 20px;min-height:50px;background:#41664e;color:white;border:0;border-radius:9px}.text-button{display:inline-flex;align-items:center;gap:8px;background:none;border:0}.answer{display:flex;gap:15px;min-height:55px;background:#f5f6eb;border:1px solid #d8e1cd;padding:13px;margin:12px 0;border-radius:8px}.answer>span:first-child{flex-shrink:0}.answer-form label{display:block}.answer-form input{max-width:100%;box-sizing:border-box;padding:13px;margin:12px 0;display:block}</style><div id="root"></div><script type="module">import React from '/node_modules/.vite/deps/react.js';import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js';const {createRoot}=ReactDOM;import TaskAnswer from '/src/TaskAnswer.tsx';import TaskVisual from '/src/TaskVisual.tsx';const root=createRoot(document.getElementById('root'));window.lastAnswers=[];window.showTask=task=>{window.lastAnswers=[];root.render(React.createElement(React.Fragment,null,React.createElement(TaskVisual,{task}),React.createElement(TaskAnswer,{task,disabled:false,onSubmit:raw=>window.lastAnswers.push(raw)})));};</script></html>`}));
 await page.goto(origin+'/__task_harness__');
 await page.waitForFunction(()=>typeof (window as any).showTask==='function',{},{timeout:10000});
 return errors;
}
async function show(page:Page,task:Task){await page.evaluate(task=>(window as any).showTask(task),task);await expect(page.locator('[data-task-kind]')).toHaveAttribute('data-task-kind',task.kind);}
async function raw(page:Page){return page.evaluate(()=>(window as any).lastAnswers.at(-1));}

test('order emits the chosen sequence, supports undo/reset and keyboard selection',async({page})=>{
 const errors=await harness(page);const task:Task={...baseTask,id:'ui-order',kind:'order',tiles:['frø','spire','plante'],answer:JSON.stringify(['frø','spire','plante'])};await show(page,task);
 expect(await page.locator('.task-tile-bank .task-tile').allTextContents()).not.toEqual(task.tiles);
 await expect(page.getByRole('button',{name:'Prøv svaret'})).toBeDisabled();
 for(const value of ['plante','spire','frø'])await page.locator('.task-tile-bank').getByRole('button',{name:value,exact:true}).click();
 await page.getByRole('button',{name:'Prøv svaret'}).click();expect(JSON.parse(await raw(page))).toEqual(['plante','spire','frø']);
 await page.getByRole('button',{name:'Angre siste'}).click();await expect(page.getByRole('button',{name:'Prøv svaret'})).toBeDisabled();
 await page.getByRole('button',{name:'Begynn på nytt'}).click();await expect(page.locator('.task-sequence-board .task-tile')).toHaveCount(0);
 for(const value of task.tiles!){const tile=page.locator('.task-tile-bank').getByRole('button',{name:value,exact:true});await tile.focus();await page.keyboard.press('Enter');}
 await page.getByRole('button',{name:'Prøv svaret'}).click();expect(JSON.parse(await raw(page))).toEqual(task.tiles);expect(errors).toEqual([]);
});

test('match emits pairs in left-column order and supports correction without dragging',async({page})=>{
 const errors=await harness(page);const task:Task={...baseTask,id:'ui-match',kind:'match',pairs:[{left:'rev',right:'fox'},{left:'katt',right:'cat'},{left:'hund',right:'dog'}],answer:JSON.stringify(['fox','cat','dog'])};await show(page,task);
 expect(await page.locator('.task-match-target').allTextContents()).not.toEqual(['fox','cat','dog']);
 for(const value of ['cat','dog','fox'])await page.locator('.task-match-right').getByRole('button',{name:value,exact:true}).click();
 await page.getByRole('button',{name:'Prøv svaret'}).click();expect(JSON.parse(await raw(page))).toEqual(['cat','dog','fox']);
 await page.getByRole('button',{name:'Angre siste'}).click();await expect(page.locator('.task-match-count')).toContainText('2 av 3');
 await page.getByRole('button',{name:'Begynn på nytt'}).click();await expect(page.locator('.task-match-count')).toContainText('0 av 3');
 for(const value of ['fox','cat','dog']){const tile=page.locator('.task-match-right').getByRole('button',{name:value,exact:true});await tile.focus();await page.keyboard.press('Space');}
 await page.getByRole('button',{name:'Prøv svaret'}).click();expect(JSON.parse(await raw(page))).toEqual(['fox','cat','dog']);
 await page.getByRole('button',{name:'Fjern koblingen for rev'}).click();await expect(page.getByRole('button',{name:'Prøv svaret'})).toBeDisabled();expect(errors).toEqual([]);
});

test('select keeps multiple distinct choices and toggles with keyboard',async({page})=>{
 const errors=await harness(page);await show(page,{...baseTask,id:'ui-select',kind:'select',choices:['tre','løper','bok'],answer:JSON.stringify(['tre','bok'])});
 await page.getByRole('checkbox',{name:'tre',exact:true}).click();const book=page.getByRole('checkbox',{name:'bok',exact:true});await book.focus();await page.keyboard.press('Space');
 await expect(book).toBeChecked();await page.getByRole('button',{name:'Prøv svaret'}).click();expect(new Set(JSON.parse(await raw(page)))).toEqual(new Set(['tre','bok']));
 await book.click();await page.getByRole('checkbox',{name:'løper',exact:true}).click();await page.getByRole('button',{name:'Prøv svaret'}).click();expect(new Set(JSON.parse(await raw(page)))).toEqual(new Set(['tre','løper']));expect(errors).toEqual([]);
});

test('text input preserves spelling and punctuation, and controls/diagrams fit small phones',async({page})=>{
 const errors=await harness(page);await show(page,{...baseTask,id:'ui-write',kind:'write',answer:'Hello!'});const input=page.getByLabel('Ditt svar');await expect(input).toHaveAttribute('autocapitalize','none');await expect(input).toHaveAttribute('autocorrect','off');await input.fill('Hello!');await page.getByRole('button',{name:'Prøv svaret'}).click();expect(await raw(page)).toBe('Hello!');
 const fixtures:Task[]=[{...baseTask,id:'ui-mobile-order',kind:'order',tiles:['Først legger vi frøet i jorda','Så vanner vi forsiktig','Til slutt vokser det en liten spire'],answer:'[]'},{...baseTask,id:'ui-mobile-match',kind:'match',pairs:[{left:'Trettito centimeter',right:'32 cm'},{left:'Et hundre og femti gram',right:'150 g'},{left:'Tre hele timer',right:'3 timer'}],answer:'[]'},{...baseTask,id:'ui-mobile-select',kind:'select',choices:['Et langt svar som må få plass på flere linjer på telefonen','Et annet svar','En tredje mulighet'],answer:'[]'}];
 const visuals:NonNullable<Task['visual']>[]=[{type:'clock',hour:3,minute:30},{type:'grid',rows:6,columns:8},{type:'place',tens:8,ones:9},{type:'groups',groups:6,each:9},{type:'numberline',min:0,max:100,start:40}];
 for(const width of [320,390]){await page.setViewportSize({width,height:844});for(const fixture of fixtures){await show(page,fixture);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}for(const [i,visual] of visuals.entries()){await show(page,{...baseTask,id:`ui-visual-${width}-${i}`,kind:'write',answer:'4',visual});await expect(page.locator('.task-visual svg')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);}}expect(errors).toEqual([]);
});
