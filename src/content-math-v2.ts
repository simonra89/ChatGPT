import type {Task} from './types';

/** Controlled mathematics content. Every answer is derived from the stated quantities.
 * Choice alternatives target a plausible counting, place-value or operation error.
 * A matching exercise counts as one observation, not one per pair.
 */
export function mathTasksV2(grade:number,moduleIndex:number):Task[]{
 const tasks:Task[]=[];
 const add=(task:Omit<Task,'id'>)=>tasks.push({...task,id:`v2-m-${grade}-${moduleIndex}-${tasks.length}`,version:2});
 const write=(prompt:string,answer:number|string,hint:string,explanation:string,extra:Partial<Task>={})=>add({kind:'write',prompt,answer:String(answer),hint,explanation,...extra});
 const choice=(prompt:string,answer:string,wrong:string[],hint:string,explanation:string,extra:Partial<Task>={})=>add({kind:'choice',prompt,choices:[answer,...wrong.filter(x=>x!==answer)].filter((v,i,a)=>a.indexOf(v)===i),answer,hint,explanation,...extra});
 const order=(prompt:string,tiles:string[],hint:string,explanation:string,extra:Partial<Task>={})=>add({kind:'order',prompt,tiles,answer:JSON.stringify(tiles),hint,explanation,...extra});
 const match=(prompt:string,pairs:{left:string;right:string}[],hint:string,explanation:string,extra:Partial<Task>={})=>add({kind:'match',prompt,pairs,answer:JSON.stringify(pairs.map(p=>p.right)),hint,explanation,...extra});
 const select=(prompt:string,correct:string[],wrong:string[],hint:string,explanation:string,extra:Partial<Task>={})=>add({kind:'select',prompt,choices:[...correct,...wrong],answer:JSON.stringify(correct),hint,explanation,...extra});
 const count=(n:number)=>`${n} ${n===1?'prikk':'prikker'}`;
 const group=(n:number)=>`${n} ${n===1?'gruppe':'grupper'}`;
 const pair=(left:string,right:string)=>({left,right});
 const textNumber=(n:number)=>String(n);
 const unit=(n:number,singular:string,plural:string)=>`${n} ${n===1?singular:plural}`;

 if(grade===1&&moduleIndex===0){
  for(const n of [2,5,7,3,9,6,4,8])write('Hvor mange prikker er det i rammen?',n,'Pek på én prikk om gangen. Si ett tall for hver prikk.',`Det er ${count(n)}. Tallet ${n} viser hele mengden.`,{kind:'model',model:[n]});
  for(let i=0;i<8;i++){const a=i+2,b=a+(i%3)+1,mia=i%2?a:b,ali=i%2?b:a;choice(`Mia har ${mia} kongler. Ali har ${ali} kongler. Hvem har flest?`,mia>ali?'Mia':'Ali',[mia>ali?'Ali':'Mia','De har like mange'],'Sammenlign de to mengdene. Hvem har det største tallet?',`${b} er større enn ${a}. ${mia>ali?'Mia':'Ali'} har flest.`,{transfer:true});}
  for(let i=0;i<8;i++){const start=i+1;order('Legg tallene fra minst til størst.',[start,start+1,start+3,start+5].map(textNumber),'Finn det minste tallet først. Fortsett oppover.',`${start} < ${start+1} < ${start+3} < ${start+5}.`);}
  for(let i=0;i<8;i++){const n=i+2;select(`Velg alle mengdene som viser ${n}.`,[`${n} brikker`,`${n-1} brikker og 1 brikke`],[`${n+1} brikker`,`${n-1} brikker`],'Tell alle brikkene, også når de er delt i to grupper.',`${n-1} + 1 = ${n}. Mengden forandres ikke når vi deler den opp.`,{transfer:true});}
 }
 if(grade===1&&moduleIndex===1){
  for(const [a,b] of [[3,2],[4,3],[5,4],[2,6],[6,3],[7,2],[4,4],[5,3]])write(`${a} + ${b} = ?`,a+b,'Tell den første gruppen. Fortsett å telle med den andre.',`${a} og ${b} er ${a+b} til sammen.`,{kind:'model',model:[a,b]});
  for(let i=0;i<8;i++){const total=i+5,take=i%3+1;write(`Det sitter ${total} fugler i treet. ${take} flyr bort. Hvor mange sitter igjen?`,total-take,'Start med alle fuglene. Ta bort dem som flyr.',`${total} − ${take} = ${total-take}.`,{transfer:true,visual:{type:'numberline',min:0,max:15,start:total}});}
  for(let i=0;i<8;i++){const total=i+3,part=i%3+1;write(`Vi skal ha ${total} klosser. Vi har ${part}. Hvor mange mangler?`,total-part,`Tell videre fra ${part} til ${total}.`,`${part} + ${total-part} = ${total}. Den manglende delen er ${total-part}.`);}
  for(let i=0;i<8;i++){const n=i+4;select(`Velg begge måtene å dele ${n} på.`,[`${n-1} og 1`,`${n-2} og 2`],[`${n-1} og 2`,`${n-2} og 1`],'Legg delene sammen. De skal bli like mange som hele mengden.',`${n-1} + 1 = ${n}, og ${n-2} + 2 = ${n}.`,{transfer:true});}
 }
 if(grade===1&&moduleIndex===2){
  const shapes=[['△','trekant','3'],['□','kvadrat','4'],['○','sirkel','0'],['▭','rektangel','4']] as const;
  shapes.forEach(([shape,name,corners])=>{choice(`Hva heter figuren ${shape}?`,name,shapes.map(s=>s[1]).filter(s=>s!==name),'Se på rette sider og hjørner.',`Figuren er en ${name}.`);write(`Hvor mange hjørner har en ${name} ${shape}?`,corners,'Et hjørne er stedet der to rette sider møtes.',`En ${name} har ${corners} hjørner.`);});
  const patterns=[['● ▲ ● ▲ ●','▲'],['□ ○ □ ○ □','○'],['▲ ▲ ● ▲ ▲','●'],['● □ □ ● □','□'],['● ▲ □ ● ▲','□'],['○ ○ □ ○ ○','□'],['▲ ● ● ▲ ●','●'],['□ ▲ ○ □ ▲','○']];
  patterns.forEach(([sequence,next])=>choice(`Hvilken figur fortsetter mønsteret? ${sequence} …`,next,['●','▲','□','○'].filter(s=>s!==next).slice(0,3),'Finn den lille delen som gjentar seg.',`Neste figur er ${next}. Se hvordan den samme delen gjentas.`));
  const shapeSelections:[string,string[],string[]][]=[
   ['Velg alle figurene med fire hjørner.',['kvadrat □','rektangel ▭'],['trekant △','sirkel ○']],
   ['Velg figuren uten hjørner.',['sirkel ○'],['trekant △','kvadrat □']],
   ['Velg figuren med tre hjørner.',['trekant △'],['sirkel ○','rektangel ▭']],
   ['Velg alle figurene med rette sider.',['trekant △','kvadrat □','rektangel ▭'],['sirkel ○']],
   ['Velg alle figurene med færre enn fire hjørner.',['trekant △','sirkel ○'],['kvadrat □','rektangel ▭']],
   ['Velg alle figurene som har minst ett hjørne.',['trekant △','kvadrat □','rektangel ▭'],['sirkel ○']],
   ['Velg ord som beskriver et kvadrat □.',['fire hjørner','fire like lange sider'],['tre sider','ingen hjørner']],
   ['Velg ord som beskriver en sirkel ○.',['rund','ingen hjørner'],['tre sider','fire hjørner']]
  ];
  shapeSelections.forEach(([p,c,w],i)=>select(p,c,w,'Se på én figur eller beskrivelse om gangen. Tell sider og hjørner.',`Disse passer: ${c.join(' og ')}.`,{evidenceGroup:`shape-property-${i}`,transfer:true}));
  match('Koble de tre figurene til navn.',[pair('○','sirkel'),pair('△','trekant'),pair('□','kvadrat')],'Se på rette sider og hjørner.','Sirkel, trekant og kvadrat har forskjellige former.',{evidenceGroup:'shape-names'});
  match('Koble utsnittet av mønsteret til delen som gjentas.',[pair('○ △ ○ △ ○ △','○ △'),pair('□ □ ○ □ □ ○','□ □ ○'),pair('△ ○ □ △ ○ □','△ ○ □')],'Finn den minste delen som gjentas igjen og igjen.','Et mønster har en del som blir gjentatt.',{transfer:true});
  match('Koble figur til antall hjørner.',[pair('sirkel ○','0 hjørner'),pair('trekant △','3 hjørner'),pair('kvadrat □','4 hjørner')],'Et hjørne er der to rette sider møtes.','Vi kan beskrive figurer ved å telle hjørnene.',{evidenceGroup:'shape-corners',transfer:true});
  match('Koble figuren til beskrivelsen. Rektangelet her er ikke et kvadrat.',[pair('kvadrat □','fire like lange sider'),pair('rektangel ▭','to lange og to korte sider'),pair('trekant △','tre sider')],'Sammenlign både antallet sider og lengden på dem.','Kvadratet og rektangelet har fire sider, men ikke samme sidelengder.',{transfer:true});
  match('Koble navnet til den riktige figuren.',[pair('rektangel','▭'),pair('trekant','△'),pair('sirkel','○')],'Se etter den avlange firkanten, figuren med tre hjørner og den runde figuren.','Navn og form beskriver den samme figuren.',{evidenceGroup:'shape-names',transfer:true});
  match('Koble mønsteret til den neste figuren.',[pair('○ △ ○ △ ○ …','△'),pair('□ ○ □ ○ □ …','○'),pair('△ □ △ □ △ …','□')],'Se på hva som kommer etter hver figur i den gjentatte delen.','Hver rad veksler mellom to figurer.',{transfer:true});
  match('Koble antallet hjørner til figurnavnet.',[pair('tre hjørner','trekant'),pair('ingen hjørner','sirkel'),pair('fire like lange sider og fire rette hjørner','kvadrat')],'Bruk egenskapene, ikke størrelsen på figuren.','Trekant, sirkel og kvadrat har ulike kjennetegn.',{evidenceGroup:'shape-corners',transfer:true});
  match('Koble figuren til navnet, også når figuren peker en annen vei.',[pair('▽','trekant'),pair('▯','rektangel'),pair('○','sirkel')],'En figur beholder navnet sitt når vi snur den.','Retningen endrer ikke antall sider og hjørner.',{transfer:true});
 }
 if(grade===1&&moduleIndex===3){
  for(let i=0;i<8;i++){const a=i+2,b=a+2,red=i%2?a:b,blue=i%2?b:a;choice(`Et rødt bånd er ${red} like klosser langt. Et blått bånd er ${blue} slike klosser langt. Hvilket er lengst?`,red>blue?'Det røde båndet':'Det blå båndet',[red>blue?'Det blå båndet':'Det røde båndet','De er like lange'],'Når måleklossene er like store, viser flest klosser størst lengde.',`${b} klosser er mer enn ${a} klosser. ${red>blue?'Det røde':'Det blå'} båndet er lengst.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i+2;order('Legg båndene fra kortest til lengst. Alle er målt med like klosser.',[`${n} klosser`,`${n+2} klosser`,`${n+4} klosser`],'Sammenlign antallet like måleklosser.',`${n} < ${n+2} < ${n+4}.`);}
  for(let i=0;i<8;i++){const a=i+1,b=a+(i%3)+1;choice(`Den ene posen veier like mye som ${a} like steiner. Den andre veier like mye som ${b} slike steiner. Hvilken er tyngst?`,`Posen med ${b} steiner`,[`Posen med ${a} steiner`,'De er like tunge'],'Steinene er like tunge. Sammenlign hvor mange steiner det er.',`${b} er flere enn ${a}, så posen med ${b} steiner er tyngst.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i+7,difference=i%4+1;write(`Boka er ${n} like binders lang. Penalhuset er ${n-difference} slike binders langt. Hvor mange binders lengre er boka?`,difference,'Hvor mye må vi legge til lengden på penalhuset for å få bokas lengde?',`${n} − ${n-difference} = ${difference}. Boka er ${difference} binders lengre.`,{transfer:true});}
 }
 if(grade===2&&moduleIndex===0){
  for(let i=0;i<8;i++){const t=i+1,u=(i*3+2)%10;write(`Hvilket tall viser ${t} tiere og ${u} enere?`,10*t+u,'Hver tier er ti. Tell tierne først, og legg til enerne.',`${t} tiere er ${10*t}. ${10*t} + ${u} = ${10*t+u}.`,{visual:{type:'place',tens:t,ones:u}});}
  for(let i=0;i<8;i++){const t=i+2,u=(i*2+1)%10,n=t*10+u;choice(`Hvilket siffer viser antall tiere i ${n}?`,String(t),[String(u),String((t+1)%10)],'Tierplassen står rett til venstre for enerplassen.',`${n} har ${t} tiere og ${u} enere.`);}
  for(let i=0;i<8;i++){const n=10+i*10-2;order('Legg tallene i stigende rekkefølge.',[n,n+1,n+3,n+10].map(textNumber),'Sammenlign tierne først. Hvis tierne er like, sammenligner du enerne.',`${n} < ${n+1} < ${n+3} < ${n+10}.`,{transfer:true});}
  for(let i=0;i<4;i++){const t=i+2;match('Koble tallet til tiere og enere.',[pair(String(t*10+3),`${t} tiere og 3 enere`),pair(String((t+1)*10+2),`${t+1} tiere og 2 enere`),pair(String((t+2)*10),`${t+2} tiere og 0 enere`)],'Tell hele tiere først. Enerplassen kan også være null.','Tallet forteller både hvor mange tiere og hvor mange enere det er.');}
  for(let i=0;i<4;i++){const start=23+i*12,jump=i%2===0?10:-10;write(`Start på ${start}. Hopp ${jump>0?'ti fram':'ti tilbake'}. Hvilket tall lander du på?`,start+jump,'Et tierhopp endrer antall tiere. Enerne er de samme.',`${start} ${jump>0?'+':'−'} 10 = ${start+jump}.`,{transfer:true,visual:{type:'numberline',min:start-10,max:start+10,start}});}
 }
 if(grade===2&&moduleIndex===1){
  for(const [a,b] of [[8,5],[7,6],[9,4],[6,7],[8,6],[9,8],[7,8],[6,9]])write(`${a} + ${b} = ?`,a+b,`Fyll først opp fra ${a} til ti. Hvor mye av ${b} er da igjen?`,`${a} + ${10-a} + ${b-(10-a)} = 10 + ${b-(10-a)} = ${a+b}.`,{kind:'model',model:[a,b]});
  for(const [a,b] of [[13,5],[14,6],[12,7],[16,8],[15,7],[17,9],[11,4],[18,9]])write(`${a} − ${b} = ?`,a-b,`Trekk først fra ${a-10}, så kommer du til ti. Trekk deretter fra resten.`,`${a} − ${a-10} − ${b-(a-10)} = 10 − ${b-(a-10)} = ${a-b}.`,{visual:{type:'numberline',min:0,max:20,start:a}});
  for(const [a,b] of [[8,7],[7,5],[9,6],[6,8]])choice(`Vi vil regne ${a} + ${b} ved først å lage ti. Hvordan skal ${b} deles? Skriv først delen som fyller opp til ti, og deretter resten.`,`${10-a} og ${b-(10-a)}`,[`${9-a} og ${b-(9-a)}`,`${11-a} og ${b-(11-a)}`],`Finn tallet som gjør ${a} til ti.`,`${a} trenger ${10-a}. Derfor deler vi ${b} i ${10-a} og ${b-(10-a)}.`);
  for(let i=0;i<4;i++){const d=i+1;match('Koble regnestykkene til riktig sum.',[pair(`6 + ${6+d}`,String(12+d)),pair(`8 + ${6+d}`,String(14+d)),pair(`9 + ${7+d}`,String(16+d))],'Gå gjerne om ti i hvert regnestykke.','Finn først ti, og legg så til det som er igjen.');}
  for(let i=0;i<4;i++){const target=i+12;select(`Velg alle regnestykkene som blir ${target}.`,[`10 + ${target-10}`,`8 + ${target-8}`],[`9 + ${target-8}`,`10 + ${target-9}`],'Regn ut hver sum. Flere uttrykk kan ha samme verdi.',`10 + ${target-10} og 8 + ${target-8} blir begge ${target}.`,{transfer:true});}
  const stories=[['Nora har 8 klistremerker og får 7 til. Hvor mange har hun nå?',15,'8 + 7 = 15.'],['Det er 14 epler i kurven. Familien spiser 6. Hvor mange er igjen?',8,'14 − 6 = 8.'],['Toget har 9 passasjerer. På neste stopp kommer 8 på. Hvor mange er på toget nå?',17,'9 + 8 = 17.'],['En bok har 16 sider. Du har lest 7. Hvor mange sider gjenstår?',9,'16 − 7 = 9.']] as const;
  stories.forEach(([prompt,answer,explanation])=>write(prompt,answer,'Skal mengden bli større eller mindre? Velg regneart først.',explanation,{transfer:true}));
 }
 if(grade===2&&moduleIndex===2){
  for(let i=0;i<8;i++){const a=i+5,b=i%4+3,c=i%3+2;write(`${a} + ${b} = ${c} + □. Hvilket tall mangler?`,a+b-c,'Begge sider av likhetstegnet skal ha samme verdi.',`Venstre side er ${a+b}. ${c} + ${a+b-c} er også ${a+b}.`);}
  for(let i=0;i<8;i++){const n=i+8;select(`Velg alle uttrykkene som er lik ${n}.`,[`${n-3} + 3`,`${n+2} − 2`],[`${n-2} + 3`,`${n+2} − 3`],'Likhet handler om verdi. Regn ut ett uttrykk om gangen.',`${n-3} + 3 og ${n+2} − 2 blir begge ${n}.`);}
  for(let i=0;i<8;i++){const n=i+7;match('Koble uttrykk som er like mye.',[pair(`${n} + 2`,`${n+5} − 3`),pair(`${n} + 4`,`${n+6} − 2`),pair(`${n} + 6`,`${n+8} − 2`)],'Finn verdien til hvert uttrykk før du kobler.','Uttrykk på samme rad må ha samme verdi.',{transfer:true});}
  for(let i=0;i<8;i++){const n=i+6;choice('Hvilken likhet er riktig?',`${n} + 3 = ${n+1} + 2`,[`${n} + 3 = ${n+1} + 3`,`${n} + 3 = ${n+1} + 1`],'Sjekk både venstre og høyre side.',`${n} + 3 og ${n+1} + 2 blir begge ${n+3}.`,{transfer:true});}
 }
 if(grade===2&&moduleIndex===3){
  for(let i=0;i<8;i++){const hour=i+1,minute=i%2?30:0;const label=minute?`${hour}:30`:`${hour}:00`;write('Hva viser klokka? Skriv timer og minutter, for eksempel 3:00.',label,'Den lange viseren viser minutter. Den korte viser hvilken time vi er i.',minute?`Klokka viser ${hour}:30. Det er en halv time etter ${hour}.`:`Klokka viser ${hour}:00. Minuttviseren står på tolv.`,{visual:{type:'clock',hour,minute},acceptedAnswers:[label,label.replace(':','.'),`${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`,`${String(hour).padStart(2,'0')}.${String(minute).padStart(2,'0')}`]});}
  for(let i=0;i<8;i++){const a=12+i*3,b=4+i;write(`Et bånd er ${a} cm langt. Vi klipper av ${b} cm. Hvor mange cm er igjen?`,a-b,'Vi tar bort en lengde. Bruk minus.',`${a} cm − ${b} cm = ${a-b} cm.`,{transfer:true});}
  const days=['mandag','tirsdag','onsdag','torsdag','fredag','lørdag','søndag'];
  for(let i=0;i<4;i++){const start=i;order(`I dag er det ${days[start]}. Legg de neste tre dagene i riktig rekkefølge.`,[days[(start+1)%7],days[(start+2)%7],days[(start+3)%7]],'Si ukedagene i rekkefølge fra i dag.',`Etter ${days[start]} kommer ${days[(start+1)%7]}, ${days[(start+2)%7]} og ${days[(start+3)%7]}.`,{transfer:true});}
  for(let i=0;i<4;i++){const hour=i+8;write(`Klokka er ${hour}:30. Hva er klokka om én time? Skriv timer og minutter.`,`${hour+1}:30`,'En hel time endrer timetallet med én. Minuttene er de samme.',`${hour}:30 + én time = ${hour+1}:30.`,{acceptedAnswers:[`${hour+1}:30`,`${hour+1}.30`,`${String(hour+1).padStart(2,'0')}:30`],transfer:true});}
  for(let i=0;i<4;i++){const a=i+2,b=i+4;choice(`En pose poteter veier ${a} kg. En annen veier ${b} kg. Hvor mye tyngre er den andre?`,`${b-a} kg`,[`${a+b} kg`,`${b} kg`],'Forskjellen mellom vektene viser hvor mye tyngre posen er.',`${b} kg − ${a} kg = ${b-a} kg.`,{transfer:true});}
  for(let i=0;i<4;i++){const pairs=[pair(`${i+2} cm`,`${(i+2)*10} mm`),pair(`${i+3} m`,`${(i+3)*100} cm`),pair(`${i+4} timer`,`${(i+4)*60} minutter`)];match('Bruk omregningene: 1 cm = 10 mm, 1 m = 100 cm og 1 time = 60 minutter. Koble like mengder.',pairs,'Bruk opplysningene i spørsmålet. Du trenger ikke huske dem utenat.','Like stor mengde kan beskrives med ulike enheter.',{transfer:true});}
 }
 if(grade===3&&moduleIndex===0){
  for(let i=0;i<8;i++){const g=i%4+2,n=Math.floor(i/4)+3;write(`Hvor mange klosser er det i ${group(g)} med ${n} i hver?`,g*n,`Du kan legge sammen ${n}, ${g} ganger.`,`${g} × ${n} = ${g*n}.`,{visual:{type:'groups',groups:g,each:n}});}
  for(let i=0;i<8;i++){const g=i%4+2,n=Math.floor(i/4)+4;write(`Det er ${g*n} barn. De står i like rekker med ${n} i hver. Hvor mange rekker er det?`,g,`Hvor mange ganger må du ta ${n} for å få ${g*n}?`,`${g} rekker med ${n} barn gir ${g*n} barn.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i+2;match('Koble like grupper til riktig antall.',[pair(`2 grupper med ${n}`,String(2*n)),pair(`3 grupper med ${n}`,String(3*n)),pair(`4 grupper med ${n}`,String(4*n))],'Antall grupper ganger antall i hver gruppe gir hele mengden.','2, 3 og 4 like grupper gir ulike multipler av samme tall.');}
  for(let i=0;i<8;i++){const n=i%4+2,g=Math.floor(i/4)+3;select(`Velg alle uttrykkene for ${g} grupper med ${n} i hver.`,[`${g} × ${n}`,Array(g).fill(n).join(' + ')],[`${g} + ${n}`,`${g} × ${n+1}`],'Multiplikasjon kan skrives som gjentatt addisjon.',`${g} × ${n} betyr ${Array(g).fill(n).join(' + ')}. Begge blir ${g*n}.`,{transfer:true});}
 }
 if(grade===3&&moduleIndex===1){
  for(let i=0;i<8;i++){const a=i+2,b=i%4+3;write(`${a} × ${b} = ${b} × □. Hvilket tall mangler?`,a,'Når vi bytter rekkefølgen på faktorene, blir produktet det samme.',`${a} × ${b} og ${b} × ${a} er begge ${a*b}.`);}
  for(let i=0;i<8;i++){const a=i%4+2,b=Math.floor(i/4)+6;write(`${a} × ${b} = ${a} × 5 + ${a} × □. Hvilket tall mangler?`,b-5,`Del ${b} i 5 og resten.`,`${b} = 5 + ${b-5}, så ${a} × ${b} = ${a*5} + ${a*(b-5)}.`);}
  for(let i=0;i<8;i++){const a=i%4+2,b=Math.floor(i/4)+4;select(`Velg alle uttrykk som er like mye som ${a} × ${b}.`,[`${b} × ${a}`,`${a} × ${b-1} + ${a}`],[`${a} + ${b}`,`${a} × ${b+1}`],'Du kan bytte rekkefølgen, eller dele en faktor i to deler.',`Alle riktige uttrykk blir ${a*b}.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i+2;match('Koble regnestykker som gir samme produkt.',[pair(`2 × ${n+1}`,`2 × ${n} + 2`),pair(`3 × ${n+1}`,`3 × ${n} + 3`),pair(`4 × ${n+1}`,`4 × ${n} + 4`)],'Én ekstra gruppe betyr at vi legger til én gruppe av samme størrelse.','Når en faktor øker med én, legges én ny gruppe til.',{transfer:true});}
 }
 if(grade===3&&moduleIndex===2){
  for(let i=0;i<8;i++){const r=i%4+2,c=Math.floor(i/4)+3;write('Hvor mange like ruter dekker rektangelet?',r*c,'Tell rader og kolonner. Gang dem sammen.',`${r} rader med ${c} ruter gir et areal på ${r*c} ruter.`,{visual:{type:'grid',rows:r,columns:c}});}
  for(let i=0;i<8;i++){const a=i%4+2,b=Math.floor(i/4)+3;write(`Et teppe dekker ${a} rader med ${b} like fliser. Vi legger til én hel rad. Hvor mange fliser dekker teppet nå?`,(a+1)*b,`Den nye raden har også ${b} fliser.`,`${a*b} + ${b} = ${(a+1)*b} fliser.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i%4+2,m=Math.floor(i/4)+6;select(`Velg alle rektanglene som har areal ${n*m} ruter.`,[`${n} rader med ${m} ruter`,`${m} rader med ${n} ruter`],[`${n} rader med ${m+1} ruter`,`${n+1} rader med ${m} ruter`],'Regn ut rader ganger ruter i hver rad. Formen kan snus.',`${n} × ${m} og ${m} × ${n} blir begge ${n*m}.`,{transfer:true});}
  for(let i=0;i<8;i++){const a=i%4+2,b=Math.floor(i/4)+4;choice(`Et rektangel dekker ${a*b} ruter og har ${a} like rader. Hvor mange ruter er i hver rad?`,String(b),[String(a+b),String(a*b)],`Hvilket tall ganget med ${a} blir ${a*b}?`,`${a} × ${b} = ${a*b}. Det er ${b} ruter i hver rad.`,{transfer:true});}
 }
 if(grade===3&&moduleIndex===3){
  const moves=[['høyre',2,0],['venstre',-2,0],['opp',0,2],['ned',0,-2]] as const;
  for(let i=0;i<8;i++){const [direction,dx,dy]=moves[i%4],x=i%3+3,y=Math.floor(i/3)+3;const nx=x+dx,ny=y+dy;choice(`Du står på (${x}, ${y}) og går to ruter mot ${direction}. Hvor ender du?`,`(${nx}, ${ny})`,[`(${x-dx}, ${y-dy})`,`(${x+dy}, ${y+dx})`],'Det første tallet viser sideveis plassering. Det andre viser høyde.',`Etter flyttingen er du på (${nx}, ${ny}).`);}
  for(let i=0;i<8;i++){const x=i%4+1,y=Math.floor(i/4)+1;order(`Gå først én rute til høyre, så to ruter opp. Start på (${x}, ${y}). Legg stedene du er innom i riktig rekkefølge.`,[`(${x}, ${y})`,`(${x+1}, ${y})`,`(${x+1}, ${y+1})`,`(${x+1}, ${y+2})`],'Følg én instruksjon om gangen. Begynn på startstedet.','Først endres x-koordinaten. Etterpå øker y-koordinaten to ganger.',{transfer:true});}
  for(let i=0;i<8;i++){const x=i%4+1,y=Math.floor(i/4)+1;match('Start på (0, 0). Koble instruksjon til sluttpunkt.',[pair(`${x} høyre, ${y} opp`,`(${x}, ${y})`),pair(`${x+1} høyre, ${y} opp`,`(${x+1}, ${y})`),pair(`${x} høyre, ${y+1} opp`,`(${x}, ${y+1})`)],'Første koordinat teller ruter mot høyre. Andre koordinat teller ruter opp.','Hver instruksjon beskriver både sideveis flytting og høyde.',{transfer:true});}
  for(let i=0;i<8;i++){const x=i%4+2,y=Math.floor(i/4)+2;choice(`Du skal fra (${x}, ${y}) til (${x+2}, ${y-1}). Hvilken instruksjon passer?`,'To ruter til høyre og én rute ned',['To ruter til venstre og én rute ned','Én rute til høyre og to ruter opp'],'Sammenlign første koordinat med første koordinat, og andre med andre.',`x øker med 2 og y minker med 1.`,{transfer:true});}
 }
 if(grade===4&&moduleIndex===0){
  for(let i=0;i<8;i++){const children=i%4+2,each=Math.floor(i/4)+4;write(`${children*each} jordbær skal deles likt mellom ${children} barn. Hvor mange får hvert barn?`,each,'Vi kjenner antall barn. Finn hvor mye hver del får.',`${children*each} ÷ ${children} = ${each}. Hvert barn får ${each}.`);}
  for(let i=0;i<8;i++){const each=i%4+2,groups=Math.floor(i/4)+4;choice(`Du har ${each*groups} jordbær. Hver skål skal ha ${each}. Hvor mange skåler kan du fylle?`,String(groups),[String(groups+1),String(each*groups)],'Vi kjenner størrelsen på hver gruppe. Finn hvor mange grupper som får plass.',`${each*groups} ÷ ${each} = ${groups} skåler.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=i+2;match('Koble divisjonsstykket til et gangestykke som kontrollerer svaret.',[pair(`${3*n} ÷ 3 = ${n}`,`3 × ${n} = ${3*n}`),pair(`${4*n} ÷ 4 = ${n}`,`4 × ${n} = ${4*n}`),pair(`${5*n} ÷ 5 = ${n}`,`5 × ${n} = ${5*n}`)],'Gange kan kontrollere deling: antall grupper ganger gruppestørrelse er hele mengden.','Divisjon og multiplikasjon henger sammen.');}
  for(let i=0;i<8;i++){const size=i%4+3,full=Math.floor(i/4)+3,rest=i%2+1,total=size*full+rest;write(`${total} boller pakkes i poser med ${size} i hver. Vi fyller ${full} poser. Hvor mange boller blir til overs?`,rest,`De fulle posene inneholder ${full} × ${size} boller. Trekk det fra ${total}.`,`${total} − ${full*size} = ${rest}. Det blir ${unit(rest,'bolle','boller')} til overs.`,{transfer:true});}
 }
 if(grade===4&&moduleIndex===1){
  for(let i=0;i<8;i++){const price=7+i,n=i%3+2,total=price*n;write(`Du kjøper ${n} boller til ${price} kroner hver og betaler med 100 kroner. Hvor mange kroner får du tilbake?`,100-total,'Finn totalprisen først. Trekk den så fra hundre.',`${n} × ${price} = ${total}. 100 − ${total} = ${100-total} kroner.`,{transfer:true});}
  for(let i=0;i<8;i++){const n=21+i*7,a=Math.round(n/10)*10;choice(`Rund ${n} til nærmeste tier. Tall med 5 enere rundes opp.`,String(a),[String(a+10),String(Math.max(0,a-10))],'Se på enerne. Er tallet nærmest tieren under eller over?',`${n} rundes til ${a}. Det er tieren som ligger nærmest.`);}
  for(let i=0;i<8;i++){const price=i+4,n=i%3+2;select(`Du skal finne prisen for ${n} like bøker. Hver bok koster ${price} kroner. Bøkene har 24 sider og står på en blå hylle. Hvilke to opplysninger trenger du?`,[`${n} bøker`,`${price} kroner per bok`],['24 sider','Blå hylle'],'For å finne totalpris trenger du antall bøker og pris per bok.',`${n} × ${price} = ${n*price}. Sidetall og hyllefarge endrer ikke prisen.`,{transfer:true});}
  for(let i=0;i<8;i++){const price=i+5,n=i%3+2,total=n*price;order(`Du kjøper ${n} varer til ${price} kroner og betaler med 100 kroner. Legg løsningsstegene i riktig rekkefølge.`,[`Finn totalprisen: ${n} × ${price} = ${total}`,`Finn veksel: 100 − ${total} = ${100-total}`,`Svar: ${100-total} kroner tilbake`],'Først må du vite hva alle varene koster. Deretter finner du vekselen.','En flertrinnsoppgave blir enklere når vi regner ut én ting om gangen.',{transfer:true});}
 }
 if(grade===4&&moduleIndex===2){
  for(let i=0;i<8;i++){const l=i%4+2,w=Math.floor(i/4)+2,h=i%2+2;write(`En eske er ${l} enhetsklosser lang, ${w} bred og ${h} høy. Hvor mange enhetsklosser fyller esken?`,l*w*h,`Ett lag inneholder ${l} × ${w} klosser. Gang med antall lag.`,`${l} × ${w} × ${h} = ${l*w*h}.`);}
  const solids=[['kube','seks like kvadratiske flater'],['trekantet prisme','to trekantede endeflater og tre rektangulære sideflater'],['sylinder','to sirkelflater og en krum sideflate'],['kule','en rund, krum overflate uten hjørner']] as const;
  for(let i=0;i<4;i++){const [name,property]=solids[i];choice(`Hvilken romfigur har ${property}?`,name,solids.map(s=>s[0]).filter(s=>s!==name),'Se for deg både flater og hjørner.',`En ${name} har ${property}.`,{evidenceGroup:`solid-properties-${i}`});}
  write('Hvor mange hjørner har en kube?',8,'Tenk på hjørnene både i bunnen og på toppen.','En kube har fire hjørner nede og fire oppe, altså åtte.');
  write('Hvor mange flater har en kube?',6,'Tenk på topp, bunn og de fire sidene rundt.','En kube har seks kvadratiske flater.');
  choice('Hvilken romfigur har ingen hjørner og kan rulle i alle retninger?','kule',['kube','trekantet prisme'],'Se for deg en helt rund ball.','En kule har en krum overflate og ingen hjørner.',{transfer:true});
  choice('En terning har seks like kvadratiske flater. Hvilken romfigur er den?','kube',['sylinder','kule'],'Alle kantene på denne figuren er like lange.','En vanlig terning har form som en kube.',{transfer:true});
  for(let i=0;i<4;i++){const subset=[0,1,2].map(n=>solids[(n+i)%4]);match('Koble romfigur til egenskap.',subset.map(([name,property])=>pair(name,property)),'En kule er rund i alle retninger. En kube har flate, kvadratiske sider.','Figurer kan beskrives med formen på flatene sine.',{evidenceGroup:'solid-description-match',transfer:true});}
  match('Koble formbeskrivelsen til romfiguren.',[pair('en helt rund ball','kule'),pair('en terning med seks like kvadratiske flater','kube'),pair('en rett boks med to sirkelflater','sylinder')],'Sammenlign de krumme og de flate delene.','Gjenstander kan ha form som kjente romfigurer.',{transfer:true});
  match('Koble romfiguren til antall hjørner.',[pair('kube','8'),pair('trekantet prisme','6'),pair('kule','0')],'Et trekantet prisme har tre hjørner i hver av de to trekantene.','Antall hjørner er en egenskap ved romfiguren.',{transfer:true});
  match('Koble navnet til endeflatene. Vi ser på en rett figur som ligger mellom to parallelle endeflater.',[pair('trekantet prisme','to trekanter'),pair('rett rektangulært prisme','to rektangler'),pair('sylinder','to sirkler')],'Endeflatene har samme form og størrelse.','Prismets navn henger sammen med formen på endeflatene.',{transfer:true});
  match('Koble romfiguren til en riktig beskrivelse av flatene.',[pair('kube','bare flate kvadratiske flater'),pair('kule','bare en krum overflate'),pair('sylinder','både flate sirkler og en krum sideflate')],'Tenk på om overflaten er flat eller bøyd.','Flate og krumme overflater gir ulike kjennetegn.',{transfer:true});
  for(let i=0;i<8;i++){const l=i%4+2,w=Math.floor(i/4)+2,h=i%2+2;write(`En stabel har ${l*w*h} enhetsklosser. Hvert lag har ${l*w} klosser. Hvor mange like lag er det?`,h,`Hvor mange grupper på ${l*w} blir ${l*w*h}?`,`${l*w*h} ÷ ${l*w} = ${h} lag.`,{transfer:true});}
 }
 if(grade===4&&moduleIndex===3){
  for(let i=0;i<8;i++){const start=i+2,step=i%3+2;if(i<4)write(`Regelen er «legg til ${step}». Hvilket tall kommer etter ${start}, ${start+step}, ${start+2*step}?`,start+3*step,`Bruk den samme regelen én gang til.`,`${start+2*step} + ${step} = ${start+3*step}.`);else select(`Start med ${start} og legg til ${step} fire ganger. Velg alle tallene nedenfor som du kommer til etter starttallet.`,[String(start+step),String(start+2*step)],[String(start+step-1),String(start+2*step+1)],'Skriv eller si de fire tallene du kommer til. Sjekk hvert alternativ.',`De neste fire tallene er ${start+step}, ${start+2*step}, ${start+3*step} og ${start+4*step}.`,{transfer:true});}
  for(let i=0;i<8;i++){const start=i+1,step=i%3+2,repeats=i%4+2;write(`Start med tallet ${start}. Gjenta «legg til ${step}» ${repeats} ganger. Hvilket tall ender du på?`,start+step*repeats,'Du skal bruke instruksjonen akkurat så mange ganger som det står.',`${start} + ${repeats} × ${step} = ${start+step*repeats}.`,{transfer:true});}
  for(let i=0;i<8;i++){const start=i+4;const answer=start%2===0?start/2:start+3;write(`Start med ${start}. Hvis tallet er partall, del det på to. Ellers legg til tre. Hva blir resultatet?`,answer,'Partall kan deles i to like hele grupper. Velg bare én av grenene.',start%2===0?`${start} er partall, så ${start} ÷ 2 = ${answer}.`:`${start} er oddetall, så ${start} + 3 = ${answer}.`,{transfer:true});}
  for(let i=0;i<4;i++){const start=i+2,a=start+3,b=a*2;order(`Følg oppskriften: start med ${start}, legg til 3, gang deretter med 2, og trekk til slutt fra 1. Legg beregningene i riktig rekkefølge.`,[`${start} + 3 = ${a}`,`${a} × 2 = ${b}`,`${b} − 1 = ${b-1}`],'Oppskriften bestemmer rekkefølgen. Bruk resultatet fra forrige steg.','En algoritme er en presis oppskrift med steg som kan følges.',{transfer:true});}
  for(let i=0;i<4;i++){const a=i+2,start=i+3;write(`En variabel «tall» starter på ${start}. Først settes tall til tall + ${a}. Deretter settes tall til tall × 2. Hva er verdien til slutt?`,(start+a)*2,'Den andre instruksjonen bruker den nye verdien av variabelen.',`Først blir tall ${start+a}. Deretter blir tall ${start+a} × 2 = ${(start+a)*2}.`,{transfer:true});}
 }
 if(tasks.length!==32)throw Error(`Expected 32 mathematics tasks for ${grade}/${moduleIndex}, got ${tasks.length}`);
 return tasks;
}
