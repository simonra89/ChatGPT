export type Subject = 'norsk' | 'matte' | 'engelsk';
export type TaskKind = 'choice' | 'write' | 'build' | 'open' | 'model' | 'order' | 'match' | 'select';
export type TaskVisual =
 | {type:'grid';rows:number;columns:number}
 | {type:'clock';hour:number;minute:number}
 | {type:'place';tens:number;ones:number}
 | {type:'numberline';min:number;max:number;start?:number}
 | {type:'groups';groups:number;each:number};
export type Task = {
 id:string; version?:1|2; kind:TaskKind; prompt:string; choices?:string[]; answer?:string;
 acceptedAnswers?:string[]; hint:string; explanation:string; text?:string; tiles?:string[];
 pairs?:{left:string;right:string}[]; model?:number[]; visual?:TaskVisual;
 practiceOnly?:boolean; transfer?:boolean; audioRequired?:boolean; reading?:boolean; lang?:string; evidenceGroup?:string;
};
export type Module = {id:string;subject:Subject;grade:number;title:string;goal:string;intro:string;example:string;family:string;tasks:Task[];curriculum:string;assessed:boolean;contentVersion?:1|2};
export type Observation = {id:string;profileId:string;moduleId:string;taskId:string;version:1|2;at:string;firstAnswer:string;correct:boolean|null;support:string[];skipped:boolean;transfer:boolean;form:TaskKind;adultConfirmed?:boolean};
export type Profile = {id:string;name:string;avatar:string;levels:Record<Subject,number>;minutes:5|10;roundSize?:8|12|18;theme:string;words:string[]};
export type Session = {contentVersion?:1|2;mixedModules?:string[];profileId:string;moduleId:string;taskIds:string[];index:number;phase:'task'|'example'|'summary';observations:Observation[];support:string[];firstAnswer?:string;feedback?:'correct'|'retry'|'done';paused:boolean};
export type Store = {sessions?:Record<string,Session>;version:1;profiles:Profile[];activeId:string;observations:Observation[];session?:Session;pin?:string;sound:boolean;motion:boolean};
