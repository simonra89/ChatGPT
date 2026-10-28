import type {Module,Task} from './types';
import {modules as legacyModules,subjects} from './content-v1';
import {mathTasksV2} from './content-math-v2';
import {norwegianTasksV2} from './content-norsk-v2';
import {englishTasksV2} from './content-engelsk-v2';
export {subjects};
export const CONTENT_VERSION=2;
export const taskFingerprint=(task:Task)=>JSON.stringify([task.kind,task.prompt,task.answer,task.text,task.model,task.visual,task.tiles,task.pairs]);
export const evidenceKey=(task:Task)=>task.evidenceGroup||taskFingerprint(task);
export const modules:Module[]=legacyModules.map(original=>{
 const index=Number(original.id.split('-').at(-1));
 const tasks=original.subject==='matte'?mathTasksV2(original.grade,index):original.subject==='norsk'?norwegianTasksV2(original.grade,index):englishTasksV2(original.grade,index);
 const first=tasks[0];
 const automatic=tasks.filter(t=>t.answer!==undefined&&t.kind!=='open'&&!t.practiceOnly);
 return {...original,contentVersion:2,tasks,
  goal:original.subject==='matte'&&index===1&&original.grade===2?'Bruke ti som mellomstasjon i pluss og minus.':original.goal,
  intro:'Se på et eksempel. Deretter får du prøve på flere måter. Du kan be om hjelp eller ta pause når du vil.',
  example:first?`${first.text?first.text+'\n\n':''}${first.prompt}\n\n${first.kind==='open'?first.hint:first.explanation}`:original.example,
  assessed:tasks.every(t=>t.kind!=='open')&&new Set(automatic.map(evidenceKey)).size>=10&&automatic.some(t=>t.transfer),
 };
});
export const getModule=(id:string)=>modules.find(m=>m.id===id)!;
// Old task definitions are immutable. They are retained for existing backups and paused rounds.
export const getTask=(moduleId:string,taskId:string,version?:1|2):Task|undefined=>
 (version!==1?getModule(moduleId)?.tasks.find(t=>t.id===taskId):undefined)||
 (version!==2?legacyModules.find(m=>m.id===moduleId)?.tasks.find(t=>t.id===taskId):undefined);
export const legacyTaskCount=legacyModules.reduce((sum,m)=>sum+m.tasks.length,0);
