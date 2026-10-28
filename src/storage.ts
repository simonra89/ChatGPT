import type {Store,Session} from './types';
import {initialStore,validateStore} from './engine';
import {getTask} from './content';
const KEY='laeringsreisen-v1';
export function restoreSession(value:unknown,store:Store):Session|undefined{
 const s=value as Session;
 if(!s||!store.profiles.some(p=>p.id===s.profileId)||typeof s.moduleId!=='string'||!Array.isArray(s.taskIds)||!s.taskIds.length||!Number.isInteger(s.index)||s.index<0||s.index>s.taskIds.length||!['task','example','summary'].includes(s.phase)||!Array.isArray(s.support)||s.support.some(x=>typeof x!=='string')||!Array.isArray(s.observations))return;
 if(s.mixedModules&&(!Array.isArray(s.mixedModules)||s.mixedModules.length!==s.taskIds.length))return;
 if(!s.taskIds.every((id,i)=>typeof id==='string'&&getTask(s.mixedModules?.[i]||s.moduleId,id,s.contentVersion)))return;
 if(!s.observations.every(o=>store.observations.some(saved=>saved.id===o.id&&saved.profileId===s.profileId)))return;
 if(s.index===s.taskIds.length&&s.phase!=='summary')return;
 return s;
}
export function load():{store:Store;error?:string}{try{const raw=localStorage.getItem(KEY);if(!raw)return {store:initialStore()};const parsed=JSON.parse(raw);const store=validateStore(parsed);store.session=restoreSession(parsed.session,store);if(parsed.sessions&&typeof parsed.sessions==='object'){store.sessions={};for(const [id,value] of Object.entries(parsed.sessions)){const session=restoreSession(value,store);if(session&&session.profileId===id)store.sessions[id]=session;}}return {store};}catch{return {store:initialStore(),error:'Vi kunne ikke lese de lagrede dataene. De er ikke overskrevet. Last ned en kopi før du lagrer på nytt.'};}}
export function save(store:Store){localStorage.setItem(KEY,JSON.stringify(store));}
export function rawBackup(){return localStorage.getItem(KEY)||'{}';}
export function download(text:string,name:string){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
