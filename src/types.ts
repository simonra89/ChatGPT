export type Subject = 'norsk' | 'matte' | 'engelsk';
export type Task = {id:string; kind:'choice'|'write'|'build'|'open'|'model'|'order'; prompt:string; choices?:string[]; answer?:string; hint:string; explanation:string; text?:string; tiles?:string[]; model?:number[]; transfer?:boolean; audioRequired?:boolean; reading?:boolean; lang?:string};
export type Module = {id:string; subject:Subject; grade:number; title:string; goal:string; intro:string; example:string; family:string; tasks:Task[]; curriculum:string; assessed:boolean};
export type Observation = {id:string;profileId:string;moduleId:string;taskId:string;version:1;at:string;firstAnswer:string;correct:boolean|null;support:string[];skipped:boolean;transfer:boolean;form:Task['kind'];adultConfirmed?:boolean};
export type Profile={id:string;name:string;avatar:string;levels:Record<Subject,number>;minutes:5|10;theme:string;words:string[]};
export type Session={mixedModules?:string[];profileId:string;moduleId:string;taskIds:string[];index:number;phase:'task'|'example'|'summary';observations:Observation[];support:string[];firstAnswer?:string;feedback?:'correct'|'retry'|'done';paused:boolean};
export type Store={sessions?:Record<string,Session>;version:1;profiles:Profile[];activeId:string;observations:Observation[];session?:Session;pin?:string;sound:boolean;motion:boolean};
