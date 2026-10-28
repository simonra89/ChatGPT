import {useId,useMemo,useState} from 'react';
import {Check,RotateCcw,Undo2,X} from 'lucide-react';
import type {Task} from './types';
import './task-types.css';

type Props={task:Task;disabled:boolean;firstAnswer?:string;onSubmit:(raw:string)=>void};

/** A repeatable permutation: answer order never depends on where the author put the answer. */
function shuffledIndices(length:number,seed:string,ensureChanged=false){
 const result=Array.from({length},(_,i)=>i);
 let state=2166136261;
 for(const c of seed)state=Math.imul(state^c.charCodeAt(0),16777619)>>>0;
 for(let i=length-1;i>0;i--){state=(Math.imul(state,1664525)+1013904223)>>>0;const j=state%(i+1);[result[i],result[j]]=[result[j],result[i]];}
 if(ensureChanged&&length>1&&result.every((value,i)=>value===i))result.push(result.shift()!);
 return result;
}

function arrayAnswer(raw?:string):string[]{
 try{const value=JSON.parse(raw||'null');return Array.isArray(value)&&value.every(x=>typeof x==='string')?value:[];}catch{return [];}
}

function restoreTiles(tiles:string[],answer:string[]):number[]{
 const selected:number[]=[];
 for(const value of answer){const index=tiles.findIndex((tile,i)=>tile===value&&!selected.includes(i));if(index>=0)selected.push(index);}
 return selected;
}

export default function TaskAnswer(props:Props){
 // The task ID resets unfinished local answers when the next task is displayed.
 return <div data-task-kind={props.task.kind}><AnswerFields key={props.task.id} {...props}/></div>;
}

function AnswerFields({task,disabled,firstAnswer,onSubmit}:Props){
 const inputId=useId();
 const [written,setWritten]=useState(firstAnswer||'');
 const [selected,setSelected]=useState<number[]>(()=>task.kind==='order'?restoreTiles(task.tiles||[],arrayAnswer(firstAnswer)):task.kind==='build'&&firstAnswer?restoreTiles(task.tiles||[],task.answer?.includes(' ')?firstAnswer.split(' '):firstAnswer.split('')):[]);
 const [checked,setChecked]=useState<string[]>(()=>arrayAnswer(firstAnswer));
 const [activePair,setActivePair]=useState(0);
 const [connections,setConnections]=useState<(number|undefined)[]>(()=>{
  const values=arrayAnswer(firstAnswer);const used=new Set<number>();
  return (task.pairs||[]).map((_,i)=>{const n=(task.pairs||[]).findIndex((p,j)=>p.right===values[i]&&!used.has(j));if(n<0)return undefined;used.add(n);return n;});
 });
 const [matchHistory,setMatchHistory]=useState<{connections:(number|undefined)[];active:number}[]>([]);
 const bankOrder=useMemo(()=>shuffledIndices((task.tiles||[]).length,task.id+':tiles',true),[task.id,task.tiles]);
 const choiceOrder=useMemo(()=>shuffledIndices((task.choices||[]).length,task.id+':choices'),[task.id,task.choices]);
 const pairOrder=useMemo(()=>shuffledIndices((task.pairs||[]).length,task.id+':pairs',true),[task.id,task.pairs]);
 function rememberMatch(){setMatchHistory(history=>[...history,{connections:[...connections],active:activePair}]);}
 function connect(index:number){
  rememberMatch();const next=[...connections];next[activePair]=next[activePair]===index?undefined:index;setConnections(next);
  const empty=next.findIndex(value=>value===undefined);if(empty>=0)setActivePair(empty);
 }

 if(task.kind==='choice')return <div className="task-answer"><div className="answers" aria-label="Velg ett svar">{choiceOrder.map(i=>{const value=task.choices![i];return <button type="button" key={i} disabled={disabled} className={`answer ${firstAnswer===value?'chosen':''}`} onClick={()=>onSubmit(value)}><span aria-hidden="true">{String.fromCharCode(65+choiceOrder.indexOf(i))}</span><span className="task-answer-label">{value}</span></button>;})}</div></div>;

 if(task.kind==='write'||task.kind==='model')return <form className="task-answer answer-form" onSubmit={event=>{event.preventDefault();if(written.trim()&&!disabled)onSubmit(written);}}><label htmlFor={inputId}>Ditt svar</label><input id={inputId} value={written} autoComplete="off" autoCorrect="off" autoCapitalize="none" spellCheck={false} inputMode={/^\d+$/.test(task.answer||'')?'numeric':'text'} maxLength={300} disabled={disabled} onChange={event=>setWritten(event.target.value)} placeholder={/^\d+$/.test(task.answer||'')?'Skriv et tall':'Skriv her'}/><button className="primary" type="submit" disabled={disabled||!written.trim()}>Prøv svaret <Check size={18}/></button></form>;

 if(task.kind==='build'||task.kind==='order'){
  const tiles=task.tiles||[];const isOrder=task.kind==='order';
  const labels=selected.map(i=>tiles[i]);
  return <div className="task-answer task-sequence"><p className="task-type-instruction">{isOrder?'Trykk på brikkene i riktig rekkefølge.':'Trykk på brikkene for å bygge svaret.'} Trykk på en valgt brikke for å ta den bort.</p><div className="task-sequence-board" aria-label={isOrder?'Din rekkefølge':'Ditt svar'}>{selected.length?selected.map((index,position)=><button className="task-tile selected" type="button" key={index} disabled={disabled} aria-label={`Fjern ${tiles[index]} fra plass ${position+1}`} onClick={()=>setSelected(items=>items.filter((_,i)=>i!==position))}>{isOrder&&<span className="task-position" aria-hidden="true">{position+1}</span>}<span>{tiles[index]}</span><X size={14} aria-hidden="true"/></button>):<span className="task-empty-slot">{isOrder?'Hva kommer først?':'Velg en brikke nedenfor'}</span>}</div><div className="task-tile-bank" aria-label="Tilgjengelige brikker">{bankOrder.map(index=><button type="button" key={index} className="task-tile" disabled={disabled||selected.includes(index)} onClick={()=>setSelected(items=>[...items,index])}>{tiles[index]}</button>)}</div><div className="task-edit-tools"><button className="text-button" type="button" disabled={disabled||!selected.length} onClick={()=>setSelected(items=>items.slice(0,-1))}><Undo2 size={17}/> Angre siste</button><button className="text-button" type="button" disabled={disabled||!selected.length} onClick={()=>setSelected([])}><RotateCcw size={16}/> Begynn på nytt</button></div><p className="task-sr-only" aria-live="polite">{selected.length} av {tiles.length} brikker er valgt.</p><button type="button" className="primary" disabled={disabled||!selected.length||(isOrder&&selected.length!==tiles.length)} onClick={()=>onSubmit(isOrder?JSON.stringify(labels):labels.join(task.answer?.includes(' ')?' ':''))}>Prøv svaret <Check size={18}/></button></div>;
 }

 if(task.kind==='select')return <div className="task-answer"><fieldset className="task-select-group"><legend>Velg alle som passer</legend><p className="task-type-instruction">Det kan være flere riktige svar. Trykk igjen for å ta bort et valg.</p><div className="task-multiple-choices">{choiceOrder.map(index=>{const value=task.choices![index];const selected=checked.includes(value);return <button type="button" role="checkbox" aria-checked={selected} key={index} className={`task-multiple-choice ${selected?'selected':''}`} disabled={disabled} onClick={()=>setChecked(items=>items.includes(value)?items.filter(x=>x!==value):[...items,value])}><span className="task-checkmark" aria-hidden="true">{selected&&<Check size={17}/>}</span><span>{value}</span></button>;})}</div></fieldset><button className="primary" type="button" disabled={disabled||!checked.length} onClick={()=>onSubmit(JSON.stringify(checked))}>Prøv svaret <Check size={18}/></button></div>;

 if(task.kind==='match'){
  const pairs=task.pairs||[];const complete=pairs.length>0&&connections.every(value=>value!==undefined);
  return <div className="task-answer task-matching"><p className="task-type-instruction">Velg en brikke til venstre. Trykk så på det som hører til, på høyre side.</p><div className="task-match-columns"><div className="task-match-left" aria-label="Det du skal koble">{pairs.map((pair,i)=><div className="task-match-row" key={i}><button className={`task-match-source ${activePair===i?'active':''} ${connections[i]!==undefined?'connected':''}`} type="button" disabled={disabled} aria-pressed={activePair===i} aria-label={`${pair.left}${connections[i]!==undefined?`. Koblet til ${pairs[connections[i]!].right}`:'. Ikke koblet ennå'}`} onClick={()=>setActivePair(i)}><span>{pair.left}</span><span className="task-match-assignment">{connections[i]!==undefined?pairs[connections[i]!].right:'Velg et par →'}</span></button>{connections[i]!==undefined&&<button type="button" className="task-unlink" aria-label={`Fjern koblingen for ${pair.left}`} disabled={disabled} onClick={()=>{rememberMatch();setConnections(items=>items.map((value,index)=>index===i?undefined:value));setActivePair(i);}}><X size={15}/></button>}</div>)}</div><div className="task-match-right" aria-label="Velg det som hører til">{pairOrder.map(index=><button className="task-match-target" key={index} type="button" disabled={disabled||connections.some((value,i)=>value===index&&i!==activePair)} onClick={()=>connect(index)}>{pairs[index].right}</button>)}</div></div><div className="task-edit-tools"><button type="button" className="text-button" disabled={disabled||!matchHistory.length} onClick={()=>{const last=matchHistory.at(-1)!;setConnections(last.connections);setActivePair(last.active);setMatchHistory(history=>history.slice(0,-1));}}><Undo2 size={17}/> Angre siste</button><button type="button" className="text-button" disabled={disabled||connections.every(value=>value===undefined)} onClick={()=>{rememberMatch();setConnections(pairs.map(()=>undefined));setActivePair(0);}}><RotateCcw size={16}/> Begynn på nytt</button></div><p className="task-match-count" aria-live="polite">{connections.filter(value=>value!==undefined).length} av {pairs.length} par er koblet.</p><button type="button" className="primary" disabled={disabled||!complete} onClick={()=>onSubmit(JSON.stringify(connections.map(index=>pairs[index!].right)))}>Prøv svaret <Check size={18}/></button></div>;
 }
 return null;
}
