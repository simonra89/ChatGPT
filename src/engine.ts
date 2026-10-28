import {evidenceKey,getModule,getTask,modules,taskFingerprint} from './content';
import type {Store,Profile,Observation,Session,Subject,Task} from './types';
export {normalize} from './assessment';
export const uid=()=>crypto.randomUUID();
export const newProfile=(name:string,avatar='fox'):Profile=>({id:uid(),name:name.trim().slice(0,24)||'Oppdager',avatar,levels:{norsk:2,matte:2,engelsk:2},minutes:10,roundSize:12,theme:'Skogen',words:[]});
export const initialStore=():Store=>{const p=newProfile('Oppdager');return {version:1,profiles:[p],activeId:p.id,observations:[],sound:true,motion:true};};
export const roundTarget=(profile:Profile)=>profile.roundSize||12;
const day=(at:string)=>new Intl.DateTimeFormat('sv-SE').format(new Date(at));
export function progress(moduleId:string,observations:Observation[],now=new Date()){
 const m=getModule(moduleId);const all=observations.filter(o=>o.moduleId===moduleId&&!o.skipped);
 const current=all.filter(o=>o.version===(m.contentVersion||1)&&getTask(moduleId,o.taskId,o.version));
 const eligible=current.filter(o=>o.correct!==null&&o.support.length===0&&!getTask(moduleId,o.taskId,o.version)?.practiceOnly);
 const key=(o:Observation)=>evidenceKey(getTask(moduleId,o.taskId,o.version)!);
 // A passage/context can contribute at most one independent observation on each local day.
 const unique=eligible.filter((o,i,a)=>a.findIndex(x=>key(x)===key(o)&&day(x.at)===day(o.at))===i).slice(-10);
 const dates=new Set(unique.map(o=>day(o.at)));const examples=new Set(unique.map(key));
 const availableForms=new Set(m.tasks.filter(t=>t.answer!==undefined).map(t=>t.kind));const observedForms=new Set(unique.map(o=>o.form));
 const mastered=m.assessed&&(availableForms.size<2||observedForms.size>=2)&&unique.length===10&&unique.filter(o=>o.correct).length>=8&&dates.size>=2&&examples.size>=8&&unique.some(o=>o.transfer&&o.correct);
 const last=current.at(-1);const days=last?Math.floor((now.getTime()-Date.parse(last.at))/86400000):0;
 const interval=mastered?[1,3,7,14][Math.min(dates.size-2,3)]:1;const due=!!last&&days>=interval;
 return {status:due?'Til repetisjon':mastered?'Får til selv i appen':current.length?(current.some(o=>o.support.length)?'Øver med støtte':'På vei'):all.length?'Klar for nye oppgaver':'Ikke prøvd',mastered,due,correct:unique.filter(o=>o.correct).length,total:unique.length,days:dates.size,practiced:current.filter(o=>o.correct===null).length,adult:current.filter(o=>o.adultConfirmed).length,previousTotal:all.length-current.length,next:last?new Date(Date.parse(last.at)+interval*86400000):null};
}
export function recommended(profile:Profile,obs:Observation[],subject:Subject='matte'){
 obs=obs.filter(o=>o.profileId===profile.id);const pool=modules.filter(m=>m.subject===subject&&m.grade===profile.levels[subject]);
 if(!obs.some(o=>pool.some(m=>m.id===o.moduleId)))return pool[subject==='matte'&&profile.levels.matte===2?1:0];
 return pool.find(m=>progress(m.id,obs).due)||pool.find(m=>!obs.some(o=>o.moduleId===m.id&&o.version===m.contentVersion))||pool[0];
}
// Interleave answer forms, prefer unseen contexts, and avoid repeating the same passage in a round.
function selectTasks(tasks:Task[],observations:Observation[],count:number):Task[]{
 const recent=observations.slice(-60);
 const pool=tasks.filter((t,i,a)=>a.findIndex(x=>taskFingerprint(x)===taskFingerprint(t))===i);
 const result:Task[]=[];const contexts=new Set<string>();
 while(result.length<count&&pool.length){
  const previous=result.at(-1)?.kind;
  const rank=(t:Task)=>{const last=recent.reduce((last,o,i)=>o.taskId===t.id?i:last,-1);return (last<0?0:8+last/Math.max(1,recent.length))+(contexts.has(evidenceKey(t))?4:0)+result.filter(x=>x.kind===t.kind).length+(t.kind===previous?2:0)+(t.kind==='open'&&result.filter(t=>t.kind==='open').length>=Math.ceil(count/3)?3:0);};
  let best=0;for(let i=1;i<pool.length;i++)if(rank(pool[i])<rank(pool[best]))best=i;
  const [task]=pool.splice(best,1);result.push(task);contexts.add(evidenceKey(task));
 }
 return result;
}
export function makeSession(profile:Profile,moduleId:string,obs:Observation[]):Session{
 const m=getModule(moduleId);const demo=evidenceKey(m.tasks[0]);
 const candidates=m.tasks.filter(t=>evidenceKey(t)!==demo);
 const chosen=selectTasks(candidates,obs.filter(o=>o.moduleId===moduleId&&o.profileId===profile.id),roundTarget(profile));
 return {contentVersion:2,profileId:profile.id,moduleId,taskIds:chosen.map(t=>t.id),index:0,phase:'example',observations:[],support:[],paused:false};
}
export function makeMixedSession(profile:Profile,obs:Observation[]):Session|null{
 obs=obs.filter(o=>o.profileId===profile.id);const pool=modules.filter(m=>obs.some(o=>o.moduleId===m.id&&!o.skipped));if(!pool.length)return null;
 const selected=pool.sort((a,b)=>Number(progress(b.id,obs).due)-Number(progress(a.id,obs).due));
 const lists=selected.map(m=>({m,tasks:selectTasks(m.tasks,obs.filter(o=>o.moduleId===m.id),roundTarget(profile))}));
 const refs:{moduleId:string;taskId:string}[]=[];
 for(let round=0;round<roundTarget(profile);round++)for(const {m,tasks} of lists){const t=tasks[round];if(t)refs.push({moduleId:m.id,taskId:t.id});}
 const chosen=refs.slice(0,roundTarget(profile));if(!chosen.length)return null;
 return {...makeSession(profile,chosen[0].moduleId,obs),phase:'task',taskIds:chosen.map(r=>r.taskId),mixedModules:chosen.map(r=>r.moduleId)};
}
export function validateStore(raw:unknown):Store{
 const s=raw as Store;if(!s||s.version!==1||!Array.isArray(s.profiles)||!s.profiles.length||s.profiles.length>20||!Array.isArray(s.observations)||s.observations.length>100000)throw Error('Filen er ikke en gyldig sikkerhetskopi.');
 const ids=new Set<string>();
 for(const p of s.profiles){if(typeof p.id!=='string'||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>24||!['fox','owl','rabbit','bear'].includes(p.avatar)||![5,10].includes(p.minutes)||(p.roundSize!==undefined&&![8,12,18].includes(p.roundSize))||typeof p.theme!=='string'||!Array.isArray(p.words)||p.words.length>10||p.words.some(w=>typeof w!=='string'||!/^[a-zæøåéèüäö-]{1,24}$/i.test(w))||!['norsk','matte','engelsk'].every(k=>Number.isInteger(p.levels?.[k as Subject])&&p.levels[k as Subject]>=1&&p.levels[k as Subject]<=4))throw Error('En profil i filen er ugyldig.');ids.add(p.id);}
 for(const o of s.observations){if(!ids.has(o.profileId)||![1,2].includes(o.version)||!getTask(o.moduleId,o.taskId,o.version)||typeof o.id!=='string'||!Number.isFinite(Date.parse(o.at))||typeof o.firstAnswer!=='string'||![true,false,null].includes(o.correct)||!Array.isArray(o.support)||o.support.some(x=>typeof x!=='string')||typeof o.skipped!=='boolean'||typeof o.transfer!=='boolean'||!['choice','write','build','open','model','order','match','select'].includes(o.form))throw Error('En observasjon i filen er ugyldig.');}
 if(s.pin&&!/^[a-f0-9]{64}$/.test(s.pin))throw Error('PIN-formatet er ugyldig.');
 return {version:1,profiles:s.profiles,activeId:ids.has(s.activeId)?s.activeId:s.profiles[0].id,observations:s.observations,pin:s.pin,sound:s.sound!==false,motion:s.motion!==false};
}
export async function hashPin(pin:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('laeringsreisen-local-pin:'+pin));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');}
