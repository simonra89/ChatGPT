import {getModule,modules,taskFingerprint} from './content';
import type {Store,Profile,Observation,Session,Subject} from './types';
export const uid=()=>crypto.randomUUID();
export const newProfile=(name:string,avatar='fox'):Profile=>({id:uid(),name:name.trim().slice(0,24)||'Oppdager',avatar,levels:{norsk:2,matte:2,engelsk:2},minutes:5,theme:'Skogen',words:[]});
export const initialStore=():Store=>{const p=newProfile('Oppdager');return {version:1,profiles:[p],activeId:p.id,observations:[],sound:true,motion:true};};
export const normalize=(s:string)=>s.trim().toLocaleLowerCase('nb').replace(/[.!?]+$/,'').replace(/\s+/g,' ');
export function progress(moduleId:string,observations:Observation[],now=new Date()){
 const m=getModule(moduleId);const all=observations.filter(o=>o.moduleId===moduleId&&!o.skipped);const eligible=all.filter(o=>o.correct!==null&&o.support.length===0);
 // One observation per independently answered task per day. Repeated attempts never create evidence.
 const fingerprint=(o:Observation)=>{const t=m.tasks.find(t=>t.id===o.taskId);return t?taskFingerprint(t):o.taskId;};
 const unique=eligible.filter((o,i,a)=>a.findIndex(x=>fingerprint(x)===fingerprint(o)&&x.at.slice(0,10)===o.at.slice(0,10))===i).slice(-10);
 const dates=new Set(unique.map(o=>o.at.slice(0,10)));const examples=new Set(unique.map(fingerprint));
 const mastered=m.assessed&&unique.length===10&&unique.filter(o=>o.correct).length>=8&&dates.size>=2&&examples.size>=8&&unique.some(o=>o.transfer&&o.correct);
 const last=all.at(-1);const days=last?Math.floor((now.getTime()-Date.parse(last.at))/86400000):0;
 const interval=mastered?([1,3,7,14][Math.min(dates.size-2,3)]):1;
 const due=!!last&&days>=interval;
 return {status:due?'Til repetisjon':mastered?'Får til selv i appen':all.length?'Øver med støtte':'Ikke prøvd',mastered,due,correct:unique.filter(o=>o.correct).length,total:unique.length,days:dates.size,practiced:all.filter(o=>o.correct===null).length,adult:all.filter(o=>o.adultConfirmed).length,next:last?new Date(Date.parse(last.at)+interval*86400000):null};
}
export function recommended(profile:Profile,obs:Observation[],subject:Subject='matte'){
 const pool=modules.filter(m=>m.subject===subject&&m.grade===profile.levels[subject]);
 if(!obs.some(o=>pool.some(m=>m.id===o.moduleId)))return pool[subject==='matte'&&profile.levels.matte===2?1:0];
 return pool.find(m=>progress(m.id,obs).due)||pool.find(m=>!obs.some(o=>o.moduleId===m.id))||pool[0];
}
export function makeSession(profile:Profile,moduleId:string,obs:Observation[]):Session{
 const m=getModule(moduleId);const demonstrated=taskFingerprint(m.tasks[0]);
 const candidates=m.tasks.filter(t=>taskFingerprint(t)!==demonstrated).filter((t,i,a)=>a.findIndex(x=>taskFingerprint(x)===taskFingerprint(t))===i); // Example is never assessed later in the same session.
 const used=new Set(obs.filter(o=>o.moduleId===moduleId).slice(-8).map(o=>o.taskId));
 const ordered=[...candidates.filter(t=>!used.has(t.id)),...candidates.filter(t=>used.has(t.id))];
 return {profileId:profile.id,moduleId,taskIds:ordered.slice(0,profile.minutes===5?5:8).map(t=>t.id),index:0,phase:'example',observations:[],support:[],paused:false};
}
export function makeMixedSession(profile:Profile,obs:Observation[]):Session|null{
 const pool=modules.filter(m=>obs.some(o=>o.moduleId===m.id&&!o.skipped));
 if(!pool.length)return null;
 const selected=pool.sort((a,b)=>Number(progress(b.id,obs).due)-Number(progress(a.id,obs).due));
 const refs:{moduleId:string;taskId:string}[]=[];
 for(let round=0;round<8;round++)for(const m of selected){const tasks=m.tasks.filter((t,i,a)=>a.findIndex(x=>taskFingerprint(x)===taskFingerprint(t))===i);const t=tasks[round];if(t)refs.push({moduleId:m.id,taskId:t.id});}
 const chosen=refs.slice(0,profile.minutes===5?5:8);
 return {...makeSession(profile,chosen[0].moduleId,obs),phase:'task',taskIds:chosen.map(r=>r.taskId),mixedModules:chosen.map(r=>r.moduleId)};
}
export function validateStore(raw:unknown):Store{
 const s=raw as Store;if(!s||s.version!==1||!Array.isArray(s.profiles)||!s.profiles.length||s.profiles.length>20||!Array.isArray(s.observations)||s.observations.length>100000)throw Error('Filen er ikke en gyldig sikkerhetskopi.');
 const ids=new Set<string>();
 for(const p of s.profiles){if(typeof p.id!=='string'||ids.has(p.id)||typeof p.name!=='string'||!p.name.trim()||p.name.length>24||!['fox','owl','rabbit','bear'].includes(p.avatar)||![5,10].includes(p.minutes)||typeof p.theme!=='string'||!Array.isArray(p.words)||p.words.length>10||p.words.some(w=>typeof w!=='string'||!/^[a-zæøåéèüäö-]{1,24}$/i.test(w))||!['norsk','matte','engelsk'].every(k=>Number.isInteger(p.levels?.[k as Subject])&&p.levels[k as Subject]>=1&&p.levels[k as Subject]<=4))throw Error('En profil i filen er ugyldig.');ids.add(p.id);}
 for(const o of s.observations){const m=modules.find(m=>m.id===o.moduleId);if(!ids.has(o.profileId)||!m||!m.tasks.some(t=>t.id===o.taskId)||o.version!==1||typeof o.id!=='string'||!Number.isFinite(Date.parse(o.at))||typeof o.firstAnswer!=='string'||![true,false,null].includes(o.correct)||!Array.isArray(o.support)||o.support.some(x=>typeof x!=='string')||typeof o.skipped!=='boolean'||typeof o.transfer!=='boolean'||!['choice','write','build','open','model','order'].includes(o.form))throw Error('En observasjon i filen er ugyldig.');}
 if(s.pin&&(!/^[a-f0-9]{64}$/.test(s.pin)))throw Error('PIN-formatet er ugyldig.');
 return {version:1,profiles:s.profiles,activeId:ids.has(s.activeId)?s.activeId:s.profiles[0].id,observations:s.observations,pin:s.pin,sound:s.sound!==false,motion:s.motion!==false}; // Imported sessions are deliberately not restored.
}
export async function hashPin(pin:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode('laeringsreisen-local-pin:'+pin));return Array.from(new Uint8Array(b),v=>v.toString(16).padStart(2,'0')).join('');}
