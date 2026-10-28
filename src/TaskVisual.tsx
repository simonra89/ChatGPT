import {useId} from 'react';
import type {Task} from './types';
import './task-types.css';

export default function TaskVisual({task}:{task:Task}){
 const titleId=useId();const visual=task.visual;if(!visual)return null;
 if(visual.type==='clock'){
  const minuteAngle=visual.minute*6;const hourAngle=(visual.hour%12)*30+visual.minute/2;
  return <figure className="task-visual task-clock"><svg viewBox="0 0 240 240" role="img" aria-labelledby={titleId}><title id={titleId}>Analog klokke. Les viserne for å finne tiden.</title><circle cx="120" cy="120" r="108" fill="#fffdf2" stroke="#9eaf89" strokeWidth="3"/>{Array.from({length:60},(_,i)=><line key={i} x1="120" y1={i%5===0?18:16} x2="120" y2={i%5===0?28:21} transform={`rotate(${i*6} 120 120)`} stroke="#8a9b76" strokeWidth={i%5===0?2:1}/>)}{Array.from({length:12},(_,i)=>{const n=i+1,a=(n*30-90)*Math.PI/180;return <text key={n} x={120+78*Math.cos(a)} y={120+78*Math.sin(a)+6} textAnchor="middle" fontSize="18" fill="#405a39">{n}</text>;})}<line x1="120" y1="120" x2="120" y2="63" transform={`rotate(${hourAngle} 120 120)`} stroke="#475e3f" strokeWidth="8" strokeLinecap="round"/><line x1="120" y1="120" x2="120" y2="36" transform={`rotate(${minuteAngle} 120 120)`} stroke="#ae744b" strokeWidth="5" strokeLinecap="round"/><circle cx="120" cy="120" r="7" fill="#475e3f"/></svg><figcaption>Den korte viseren viser timer. Den lange viser minutter.</figcaption></figure>;
 }
 if(visual.type==='grid'){
  const rows=Math.max(1,Math.min(visual.rows,20)),columns=Math.max(1,Math.min(visual.columns,20));const cell=32;
  return <figure className="task-visual"><svg viewBox={`0 0 ${columns*cell+4} ${rows*cell+4}`} className="task-grid-model" role="img" aria-labelledby={titleId}><title id={titleId}>Rutenett. Undersøk radene og kolonnene.</title>{Array.from({length:rows*columns},(_,i)=><rect key={i} x={i%columns*cell+2} y={Math.floor(i/columns)*cell+2} width={cell} height={cell} fill={Math.floor(i/columns)%2?'#e4ebd6':'#eef2e4'} stroke="#8eaa77" strokeWidth="1.5"/>)}</svg><figcaption>Hver liten rute er like stor.</figcaption></figure>;
 }
 if(visual.type==='place'){
  const tens=Math.max(0,Math.min(visual.tens,20)),ones=Math.max(0,Math.min(visual.ones,20));const rodsWidth=Math.max(tens*22,45);const unitColumns=5;const width=rodsWidth+145;
  return <figure className="task-visual"><svg viewBox={`0 0 ${width} 190`} role="img" aria-labelledby={titleId}><title id={titleId}>Plassverdimodell med tierstaver og enere.</title>{Array.from({length:tens},(_,i)=><g key={i}>{Array.from({length:10},(_,j)=><rect key={j} x={i*22+9} y={j*15+9} width="15" height="15" rx="1" fill="#8fa975" stroke="#f6f8ef"/>)}</g>)}{Array.from({length:ones},(_,i)=><rect key={i} x={rodsWidth+35+(i%unitColumns)*20} y={Math.floor(i/unitColumns)*20+9} width="15" height="15" rx="2" fill="#cf9c66" stroke="#b98956"/>)}<text x={rodsWidth/2+7} y="181" textAnchor="middle" fontSize="12" fill="#6f805d">Tiere</text><text x={rodsWidth+77} y="181" textAnchor="middle" fontSize="12" fill="#876c4e">Enere</text></svg><figcaption>Én lang stav består av ti enere.</figcaption></figure>;
 }
 if(visual.type==='groups'){
  const groups=Math.max(1,Math.min(visual.groups,20)),each=Math.max(0,Math.min(visual.each,20));const columns=Math.min(groups,4);const boxHeight=Math.max(80,Math.ceil(each/4)*17+18);const rows=Math.ceil(groups/columns);
  return <figure className="task-visual"><svg viewBox={`0 0 ${columns*100} ${rows*(boxHeight+12)}`} role="img" aria-labelledby={titleId}><title id={titleId}>Like grupper med prikker. Undersøk én gruppe om gangen.</title>{Array.from({length:groups},(_,i)=><g transform={`translate(${i%columns*100+3} ${Math.floor(i/columns)*(boxHeight+12)+3})`} key={i}><rect x="0" y="0" width="90" height={boxHeight} rx="11" fill="#eef2e4" stroke="#afbe99" strokeWidth="1.5"/>{Array.from({length:each},(_,j)=><circle key={j} cx={j%4*18+18} cy={Math.floor(j/4)*17+19} r="5.8" fill="#7d9863"/>)}</g>)}</svg><figcaption>Hver ramme viser én gruppe.</figcaption></figure>;
 }
 if(visual.type==='numberline'){
  const min=visual.min,max=visual.max,span=max-min;if(span<=0)return null;const labelsEvery=Math.max(1,Math.ceil(span/12));const x=(n:number)=>30+(n-min)/span*500;
  return <figure className="task-visual task-numberline"><svg viewBox="0 0 560 100" role="img" aria-labelledby={titleId}><title id={titleId}>Tallinje. Les av tallene og plasseringen av startpunktet.</title><line x1="25" y1="48" x2="535" y2="48" stroke="#8eaa77" strokeWidth="3"/>{Array.from({length:Math.min(201,Math.floor(span)+1)},(_,i)=>{const n=min+i;return <g key={n}><line x1={x(n)} y1={n%labelsEvery===0?38:43} x2={x(n)} y2={n%labelsEvery===0?58:53} stroke="#7f9768" strokeWidth="1.5"/>{(i%labelsEvery===0||n===max)&&<text x={x(n)} y="79" textAnchor="middle" fontSize="14" fill="#5b7350">{n}</text>}</g>;})}{visual.start!==undefined&&visual.start>=min&&visual.start<=max&&<g><path d={`M${x(visual.start)-6},24 L${x(visual.start)+6},24 L${x(visual.start)},35Z`} fill="#bd8956"/><text x={x(visual.start)} y="16" textAnchor="middle" fontSize="12" fill="#967148">Start</text></g>}</svg></figure>;
 }
 return null;
}
