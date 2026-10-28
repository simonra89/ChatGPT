import type {Task} from './types';
export const normalize=(s:string)=>s.trim().toLocaleLowerCase('nb').replace(/[.!?]+$/,'').replace(/\s+/g,' ');
function array(raw:string):string[]|undefined{
 try{const value=JSON.parse(raw);return Array.isArray(value)&&value.every(v=>typeof v==='string')?value:undefined;}catch{return undefined;}
}
export function evaluateAnswer(task:Task,raw:string):boolean{
 if(task.answer===undefined||task.kind==='open')return false;
 if(task.kind==='choice')return raw===task.answer;
 if(task.kind==='order'||task.kind==='match'||task.kind==='select'){
  const a=array(raw),b=array(task.answer);if(!a||!b||a.length!==b.length)return false;
  if(task.kind==='select'){if(new Set(a).size!==a.length)return false;return [...a].sort().every((v,i)=>v===[...b].sort()[i]);}
  return a.every((v,i)=>v===b[i]);
 }
 return [task.answer,...(task.acceptedAnswers||[])].some(a=>normalize(raw)===normalize(a));
}
