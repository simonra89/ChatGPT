import {useEffect,useRef,useState} from 'react';
import {Check,Download,Smartphone,X} from 'lucide-react';

type InstallPrompt=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};

export default function InstallApp(){
 const [prompt,setPrompt]=useState<InstallPrompt>();
 const [installed,setInstalled]=useState(()=>window.matchMedia('(display-mode: standalone)').matches);
 const [pending,setPending]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  const capture=(event:Event)=>{event.preventDefault();setPrompt(event as InstallPrompt);};
  const done=()=>{setInstalled(true);setPrompt(undefined);dialog.current?.close();};
  window.addEventListener('beforeinstallprompt',capture);
  window.addEventListener('appinstalled',done);
  return()=>{window.removeEventListener('beforeinstallprompt',capture);window.removeEventListener('appinstalled',done);};
 },[]);
 async function install(){
  if(!prompt){dialog.current?.showModal();return;}
  setPending(true);
  try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='dismissed')dialog.current?.showModal();}
  catch{dialog.current?.showModal();}
  finally{setPrompt(undefined);setPending(false);}
 }
 return <>
  <section className="install-card" aria-label="Mobilapp">
   <Smartphone size={25}/>
   <div><h3>{installed?'Din egen lille mobilapp':'Ta læringsreisen med på mobilen'}</h3><p>{installed?'Du åpnet appen fra hjemskjermen. God oppdagelsestur!':'Åpne i nettleseren, eller legg appen på hjemskjermen.'}</p></div>
   {installed?<Check size={23}/>:<button className="secondary" disabled={pending} onClick={()=>void install()}><Download size={17}/>{prompt?'Installer app':'Bruk som mobilapp'}</button>}
  </section>
  <dialog className="install-dialog" ref={dialog} aria-labelledby="install-title">
   <button className="close" aria-label="Lukk mobilveiledning" onClick={()=>dialog.current?.close()}><X size={22}/></button>
   <span className="modal-emblem"><Smartphone size={29}/></span>
   <h2 id="install-title">Læringsreisen på mobilen</h2>
   <p>Du kan teste direkte i nettleseren. På telefonen kan du også legge appen på hjemskjermen.</p>
   <h3>Android</h3>
   <ol><li>Åpne appens nettadresse i Chrome på mobilen.</li><li>Trykk på menyen med tre prikker øverst til høyre.</li><li>Velg «Legg til på startskjermen» eller «Installer app», og bekreft.</li></ol>
   <p>Appen får sitt eget ikon og kan åpnes i eget vindu. Menyvalget kan hete noe annet i andre nettlesere.</p>
   <details><summary>iPhone og iPad</summary><p>Åpne appen i Safari. Trykk Del, og velg «Legg til på Hjem-skjerm».</p></details>
   <p className="muted">Åpne appen med nett første gang. Nedlastet øvingsinnhold kan brukes uten nett; stemmer avhenger av telefonen. Fremgangen lagres på denne enheten.</p>
   <button className="primary" onClick={()=>dialog.current?.close()}>Skjønner <Check size={18}/></button>
  </dialog>
 </>;
}
