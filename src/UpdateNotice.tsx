import {useEffect,useState} from 'react';
import {RefreshCw} from 'lucide-react';
export default function UpdateNotice(){
 const [waiting,setWaiting]=useState<ServiceWorker>();
 useEffect(()=>{
  if(!('serviceWorker'in navigator))return;
  let disposed=false;let registration:ServiceWorkerRegistration|undefined;
  const inspect=()=>{if(registration?.waiting&&!disposed)setWaiting(registration.waiting);};
  const found=()=>{registration?.installing?.addEventListener('statechange',inspect);inspect();};
  navigator.serviceWorker.ready.then(reg=>{if(disposed)return;registration=reg;inspect();reg.addEventListener('updatefound',found);void reg.update().catch(()=>{});});
  return()=>{disposed=true;registration?.removeEventListener('updatefound',found);};
 },[]);
 if(!waiting)return null;
 function update(){navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});waiting!.postMessage('ACTIVATE_UPDATE');}
 return <div className="update-notice" role="status"><div><strong>Nye oppgaver er klare</strong><p>Besvarte oppgaver er lagret. Oppdater for å få den nye pakken.</p></div><button className="secondary" onClick={update}><RefreshCw size={17}/> Oppdater appen</button></div>;
}
