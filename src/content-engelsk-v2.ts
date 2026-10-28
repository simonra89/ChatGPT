import type {Task} from './types';

// Versioned, bounded content. English models read by an adult are practice, not
// evidence that the app has assessed listening or pronunciation.
type Draft=Omit<Task,'id'|'version'>;
type Pair={left:string;right:string};
const c=(prompt:string,choices:string[],answer:string,hint:string,explanation:string,extra:Partial<Draft>={}):Draft=>({kind:'choice',prompt,choices,answer,hint,explanation,...extra});
const w=(prompt:string,answer:string,hint:string,explanation:string,extra:Partial<Draft>={}):Draft=>({kind:'write',prompt,answer,hint,explanation,...extra});
const buildAlternatives:Record<string,string[]>={
 'My name is Sam':['Sam is my name'],
 'Here is your book':['Your book is here'],
 'My favourite colour is blue':['Blue is my favourite colour'],
 'We walk to school together':['We walk together to school','Together we walk to school'],
 'We play outside':['Outside we play'],
 'The cat sleeps under the chair':['Under the chair the cat sleeps'],
 'I like reading in the garden':['In the garden I like reading'],
 'I can swim but I cannot fly':['I cannot fly but I can swim'],
 'We have two apples and three pears':['We have three pears and two apples'],
 'My favourite day is Saturday':['Saturday is my favourite day'],
 'I am happy because my friend is here':['Because my friend is here I am happy'],
 'I like drawing because it is fun':['Because it is fun I like drawing'],
 'I like reading because I learn new things':['Because I learn new things I like reading'],
 'I prefer a quiet activity today':['Today I prefer a quiet activity'],
 'We can meet after lunch on Saturday':['We can meet on Saturday after lunch','On Saturday we can meet after lunch','After lunch on Saturday we can meet','On Saturday after lunch we can meet','After lunch we can meet on Saturday'],
 'I agree because the plan gives us more time':['Because the plan gives us more time I agree'],
 'I do not understand this word yet':['I do not yet understand this word'],
 'I can bring a new pencil tomorrow':['Tomorrow I can bring a new pencil'],
 'Could we meet next weekend instead':['Could we instead meet next weekend'],
 'A blue water bottle was found by the door':['By the door a blue water bottle was found'],
};
const b=(prompt:string,answer:string,hint:string,extra:Partial<Draft>={}):Draft=>({kind:'build',prompt,tiles:answer.split(' '),answer,hint,explanation:`En mulig formulering er «${answer}».`,...extra,acceptedAnswers:[...(buildAlternatives[answer]||[]),...(extra.acceptedAnswers||[])]});
const o=(prompt:string,hint:string,text?:string):Draft=>({kind:'open',prompt,hint,text,explanation:'Du har øvd. Appen vurderer ikke uttale, samtale eller fri tekst. Snakk gjerne om forsøket sammen med en voksen.'});
const m=(prompt:string,pairs:Pair[],hint='Les ett uttrykk om gangen og finn det som betyr det samme.'):Draft=>({kind:'match',prompt,pairs,answer:JSON.stringify(pairs.map(p=>p.right)),hint,explanation:pairs.map(p=>`«${p.left}» hører sammen med «${p.right}».`).join(' ')});
const s=(prompt:string,choices:string[],answers:string[],hint:string,explanation:string):Draft=>({kind:'select',prompt,choices,answer:JSON.stringify(answers),hint,explanation});
const order=(prompt:string,tiles:string[],hint:string,explanation:string,extra:Partial<Draft>={}):Draft=>({kind:'order',prompt,tiles,answer:JSON.stringify(tiles),hint,explanation,...extra});
const pairs=(data:string[][]):Pair[]=>data.map(([left,right])=>({left,right}));
const vocab=[
 ['🐈','cat','katt','dog','bird'],['🐕','dog','hund','cat','fish'],['🐟','fish','fisk','bird','dog'],['🐦','bird','fugl','fish','cat'],
 ['🍎','apple','eple','banana','pear'],['🍌','banana','banan','apple','orange'],['🍐','pear','pære','apple','banana'],['🍊','orange','appelsin','pear','banana'],
 ['📚','book','bok','chair','table'],['🚪','door','dør','window','chair'],['🪑','chair','stol','door','book'],['🪟','window','vindu','chair','table'],
 ['☀️','sun','sol','moon','star'],['🌙','moon','måne','sun','cloud'],['⭐','star','stjerne','cloud','moon'],['☁️','cloud','sky','sun','star'],
] as const;
function wordsAround():Draft[]{
 const tasks:Draft[]=vocab.map(([picture,en,no,d1,d2],i)=>c(`Hvilket engelsk ord passer til ${picture} (${no})?`,[en,d1,d2],en,`Les ordene sammen med en voksen hvis du trenger hjelp.`,`«${en}» betyr «${no}».`,{transfer:i>11}));
 for(const [picture,en,no] of vocab.slice(0,8))tasks.push(w(`Skriv det engelske ordet for ${picture} (${no}).`,en,'Tenk på et engelsk ord du har møtt i en bok eller sang.',`Det engelske ordet er «${en}».`,{transfer:true}));
 tasks.push(m('Koble dyrene til engelske ord.',pairs([['katt','cat'],['hund','dog'],['fugl','bird']])));
 tasks.push(m('Koble ting hjemme til engelske ord.',pairs([['bok','book'],['dør','door'],['stol','chair']])));
 tasks.push(m('Koble det du ser på himmelen.',pairs([['sol','sun'],['måne','moon'],['stjerne','star']])));
 tasks.push(m('Koble fruktene.',pairs([['eple','apple'],['banan','banana'],['pære','pear']])));
 tasks.push(s('Velg alle ordene som er dyr.',['cat','book','dog','sun'],['cat','dog'],'To av ordene kan være kjæledyr.','«Cat» og «dog» er dyr.'));
 tasks.push(s('Velg alle ordene som er frukt.',['chair','apple','pear','moon'],['apple','pear'],'Tenk på hva du kan spise.','«Apple» og «pear» er frukt.'));
 tasks.push(s('Velg alle ordene som kan passe på himmelen.',['sun','door','moon','chair'],['sun','moon'],'Se etter sol og måne.','«Sun» er sol, og «moon» er måne.'));
 tasks.push(s('Velg ordene for møbler og bøker.',['book','chair','fish','star'],['book','chair'],'Tenk på møbler og bøker, uten kjæledyr eller himmel.','«Book» og «chair» passer i denne gruppen.'));
 return tasks;
}
const commands1=[
 ['Clap your hands.','Klapp i hendene.','Ta på nesen.','Reis deg.'],['Touch your nose.','Ta på nesen.','Ta på kneet.','Klapp i hendene.'],
 ['Stand up.','Reis deg.','Sett deg.','Vink.'],['Sit down.','Sett deg.','Reis deg.','Smil.'],
 ['Wave your hand.','Vink med hånden.','Klapp i hendene.','Ta på foten.'],['Point to the door.','Pek på døren.','Pek på vinduet.','Pek på stolen.'],
 ['Touch your knee.','Ta på kneet.','Ta på nesen.','Vink med hånden.'],['Show two fingers.','Vis to fingre.','Vis én finger.','Klapp i hendene.'],
];
function listenDo():Draft[]{
 const tasks:Draft[]=commands1.map(([en,no,d1,d2])=>c(`Les sammen: «${en}» Hva betyr instruksjonen?`,[no,d1,d2],no,'En voksen kan lese den engelske setningen. Se etter en handling du kjenner.',`«${en}» betyr «${no}».`));
 tasks.push(...commands1.map(([en,no])=>o(`En voksen leser «${en}». Prøv å gjøre det setningen sier.`,'Den voksne kan vise én gang først. Bytt gjerne roller etterpå.',`For den voksne: ${no} Dette er praktisk øving, ikke en automatisk lyttetest.`)));
 const groups=[[[0,1],[2,3]],[[4,5],[6,7]],[[0,2],[1,3]],[[4,6],[5,7]]];
 for(const group of groups)for(const indices of group)tasks.push(m('Koble instruksjonen med handlingen.',indices.map(i=>({left:commands1[i][0],right:commands1[i][1]})),'Les sammen. Hvilken norsk handling passer til hvert uttrykk?'));
 tasks.push(s('Les «Show two fingers». Hvilke to ord gir handlingen og antallet?',['Show','two','fingers','red'],['Show','two'],'Se etter «vis» og «to».','«Show» betyr vis, og «two» betyr to.'));
 tasks.push(s('Les «Point to the red ball». Hvilke ord forteller farge og ting?',['red','ball','blue','book'],['red','ball'],'Det er en farge og en leke.','«Red ball» betyr rød ball.'));
 tasks.push(s('Velg de to setningene som ber deg bevege hendene.',['Clap your hands.','Wave your hand.','Sit down.','Stand up.'],['Clap your hands.','Wave your hand.'],'Se etter «hands» og «hand».','Klapping og vinking bruker hendene.'));
 tasks.push(s('Velg de to instruksjonene som ber deg peke på noe.',['Point to the door.','Touch your knee.','Point to the window.','Clap your hands.'],['Point to the door.','Point to the window.'],'«Point to» betyr «pek på».','Du peker på døren eller vinduet.'));
 return tasks;
}
function firstTalk():Draft[]{
 const scenes=[
 ['Du møter en venn. Hvilket uttrykk er en hilsen?','Hello!',['Goodbye!','Hello!','Thank you!'],'«Hello» brukes når vi hilser.'],
 ['Det er morgen. Hvordan kan du hilse?','Good morning!',['Good night!','Good morning!','Goodbye!'],'«Good morning» er en morgenhilsen.'],
 ['Du går hjem. Hva sier du til vennen din?','Goodbye!',['Goodbye!','My name is Sam.','Thank you!'],'«Goodbye» bruker vi når vi tar farvel.'],
 ['Du får hjelp med en leke. Hva kan du si?','Thank you!',['Hello!','Thank you!','Good night!'],'«Thank you» betyr takk.'],
 ['Noen takker deg. Hvilket svar passer?','You’re welcome!',['Goodbye!','You’re welcome!','My name is Ali.'],'«You’re welcome» er et vanlig svar på takk.'],
 ['Noen spør «What is your name?» Hva svarer på spørsmålet?','My name is Kim.',['I am fine.','My name is Kim.','Goodbye!'],'Spørsmålet handler om navnet ditt.'],
 ['Noen spør «How are you?» Hvilket svar passer?','I am fine, thank you.',['My name is Jo.','I am fine, thank you.','This is a book.'],'Du forteller hvordan du har det.'],
 ['Du vil be om et eple på en høflig måte. Hva passer?','An apple, please.',['Good night!','An apple, please.','My name is Sam.'],'«Please» kan gjøre en forespørsel høflig.'],
 ['Noen spør «Do you like cats?» Hvilket svar passer?','Yes, I do.',['I am seven.','Yes, I do.','It is a door.'],'«Yes, I do» svarer ja på spørsmålet.'],
 ['Noen spør «How old are you?» Hvilket svar passer?','I am seven.',['I am seven.','It is a cat.','Hello!'],'Spørsmålet handler om alder.'],
 ['Du skal legge deg. Hvilket uttrykk passer?','Good night!',['Good morning!','Good night!','An apple, please.'],'«Good night» passer når vi sier god natt.'],
 ['Du vil si at du heter Sam. Hva passer?','My name is Sam.',['I like apples.','My name is Sam.','I am fine.'],'«My name is» betyr «jeg heter».'],
 ] as const;
 const tasks:Draft[]=scenes.map(([prompt,answer,options,explanation])=>c(prompt,[...options],answer,'Tenk på hva personen prøver å si.',explanation));
 const phrases=[['God morgen','Good morning'],['Takk','Thank you'],['Jeg heter Sam','My name is Sam'],['Jeg er sju','I am seven'],['Jeg liker katter','I like cats'],['Et eple, vær så snill','An apple please'],['God natt','Good night'],['Jeg har det bra','I am fine']];
 tasks.push(...phrases.map(([no,phrase])=>b(`Bygg det engelske uttrykket for «${no}».`,phrase,'Se etter ordet med stor bokstav. Bruk alle brikkene.')));
 const oral=[
 ['Hils på en voksen med «Hello!» og si hva du heter.','Den voksne kan modellere «Hello! My name is …» først.'],
 ['Spør en voksen «What is your name?» og lytt til svaret.','Bytt på å spørre og svare.'],
 ['Si «Good morning» som om dere møtes om morgenen.','Den voksne gir en tydelig språkmodell.'],
 ['Be om en ting med «… please», og si takk etterpå.','Bruk en trygg ting dere allerede har, for eksempel en bok.'],
 ['Fortell en voksen «I like …» med noe du liker.','Du kan velge et dyr eller en frukt.'],
 ['Spør «How are you?» og prøv å svare selv.','Det er lov å prøve flere ganger. Appen vurderer ikke uttale.'],
 ['Lek at du går hjem. Si farvel på engelsk.','Voksne kan si «Goodbye» eller «Bye».'],
 ['Velg en bamse og la den hilse på en annen bamse.','Bruk «Hello» og «My name is …».'],
 ];
 tasks.push(...oral.map(([p,h])=>o(p,h)));return tasks;
}
type Story={text:string;questions:[string,string[],string,string][]};
function storyPack(stories:Story[],label:string):Draft[]{
 const tasks:Draft[]=[];
 stories.forEach((story,i)=>story.questions.forEach(([q,choices,answer,hint])=>tasks.push(c(q,choices,answer,hint,`Teksten støtter svaret «${answer}».`,{text:story.text,reading:true,evidenceGroup:`${label}-story-${i}`,transfer:i>=stories.length-2}))));
 return tasks;
}
const firstStories:Story[]=[
 {text:'This is Pip. Pip is a cat. Pip has a red ball.',questions:[['Hvilket dyr er Pip?',['A cat','A dog','A bird'],'A cat','Se etter «Pip is».'],['Hva har Pip?',['A blue book','A red ball','A yellow hat'],'A red ball','Se etter «Pip has».']]},
 {text:'Mia has a dog. The dog is small. It can run.',questions:[['Hvem har en hund?',['Mia','Pip','Ben'],'Mia','Les den første setningen.'],['Hva kan hunden gjøre?',['Swim','Fly','Run'],'Run','Se etter «It can».']]},
 {text:'Ben has a book. The book is blue. Ben reads.',questions:[['Hvilken farge har boken?',['Red','Blue','Green'],'Blue','Se etter ordet for blå.'],['Hva gjør Ben?',['He reads.','He sleeps.','He runs.'],'He reads.','Les den siste setningen.']]},
 {text:'A bird is in a tree. The bird has a nest.',questions:[['Hvor er fuglen?',['In a box','In a tree','In a bag'],'In a tree','Les den første setningen.'],['Hva har fuglen?',['A nest','A ball','A book'],'A nest','Et hjem for fugler heter «nest».']]},
 {text:'Liv has an apple. She gives it to Sam. Sam says thank you.',questions:[['Hva har Liv først?',['A pear','An apple','A banana'],'An apple','Les den første setningen.'],['Hvem får eplet?',['Liv','The bird','Sam'],'Sam','Se etter hvem Liv gir eplet til.']]},
 {text:'It is night. I see the moon. The cat is asleep.',questions:[['Hva ser fortelleren?',['The sun','The moon','A red ball'],'The moon','Se etter «I see».'],['Hva gjør katten?',['It runs.','It eats.','It sleeps.'],'It sleeps.','«Asleep» betyr at den sover.']]},
 {text:'Tom has two socks. One sock is red. One sock is blue.',questions:[['Hvor mange sokker har Tom?',['One','Two','Three'],'Two','«Two» betyr to.'],['Hvilke farger står i teksten?',['Red and blue','Green and red','Blue and yellow'],'Red and blue','Les setningene om sokkene.']]},
 {text:'A frog is on a log. A fish is in the water.',questions:[['Hvilket dyr er i vannet?',['A frog','A bird','A fish'],'A fish','Se etter «in the water».'],['Hvor er frosken?',['On a log','In a bag','Under a bed'],'On a log','«Log» er en trestokk.']]},
 {text:'Ella opens a box. A toy car is in the box. The car is green.',questions:[['Hva finner Ella i esken?',['A book','A toy car','A dog'],'A toy car','Se etter «in the box».'],['Hvilken farge har bilen?',['Green','Red','Blue'],'Green','Les den siste setningen.']]},
 {text:'I am in the garden. I see a yellow flower. A bee is on it.',questions:[['Hva er gult?',['The garden','The bee','The flower'],'The flower','Se etter «yellow».'],['Hvor er bien?',['On the flower','In a box','Under a chair'],'On the flower','«It» viser til blomsten her.']]},
];
function littleStory():Draft[]{
 const tasks=storyPack(firstStories,'e1');
 tasks.push(order('Legg handlingene i samme rekkefølge som i den lille fortellingen.',['Liv has an apple.','Liv gives the apple to Sam.','Sam says thank you.'],'Hva må Liv ha før hun kan gi det bort?','Først har Liv eplet. Så gir hun det til Sam, og Sam takker.',{text:firstStories[4].text,reading:true,evidenceGroup:'e1-story-4'}));
 tasks.push(order('Sett disse handlingene i en naturlig rekkefølge.',['Open the book.','Read a page.','Close the book.'],'Du må åpne boken før du kan lese en side.','Først åpner du boken, så leser du, så lukker du den.'));
 tasks.push({...m('Koble historietingen til fargen fra teksten.',pairs([['Ben’s book','blue'],['Pip’s ball','red'],['Ella’s car','green']]),'Les de tre setningene. Finn hvilken farge hver ting har.'),text:'Ben has a blue book. Pip has a red ball. Ella has a green toy car.',reading:true,evidenceGroup:'e1-colour-summary'});
 tasks.push(m('Koble setningen til norsk betydning.',pairs([['The cat sleeps.','Katten sover.'],['The dog runs.','Hunden løper.'],['The bird is in a tree.','Fuglen er i et tre.']])));
 tasks.push(o('Velg en av de små historiene. Fortell en voksen hva som skjedde.','Du kan bruke norske og engelske ord. Den voksne kan modellere en engelsk setning.'));
 tasks.push(o('Tegn Pip og den røde ballen. Si «a cat» og «a red ball» sammen med en voksen.','Det er tegning og språkøving, ikke uttalevurdering.'));
 tasks.push(o('Lag en ny liten historie med en bamse og en eske.','Bruk ord som «in», «box» og «bear» hvis du vil.'));
 tasks.push(o('Velg en figur fra en historie og hils på den på engelsk.','En voksen kan svare som figuren.'));
 return tasks;
}

function knownWords():Draft[]{
 const meanings=[
 ['I put on my coat.','coat','jakke',['sko','jakke','lue'],'En «coat» er et ytterplagg.'],
 ['The rabbit has long ears.','ears','ører',['øyne','armer','ører'],'«Ears» betyr ører.'],
 ['Please open the window.','window','vindu',['vindu','dør','bok'],'Et «window» slipper inn lys.'],
 ['I eat breakfast in the morning.','breakfast','frokost',['middag','frokost','kveldsmat'],'«Breakfast» er dagens første måltid.'],
 ['The bag is under the chair.','under','under',['over','ved siden av','under'],'«Under» betyr under.'],
 ['The ball is next to the box.','next to','ved siden av',['inni','ved siden av','oppå'],'«Next to» betyr ved siden av.'],
 ['It is cold. I need my hat.','cold','kaldt',['varmt','vått','kaldt'],'Når det er «cold», kan du trenge varme klær.'],
 ['My hands are clean.','clean','rene',['rene','store','kalde'],'«Clean» betyr ren eller rene.'],
 ['The little mouse is quiet.','quiet','stille',['sulten','stille','rask'],'«Quiet» handler om lite lyd.'],
 ['The elephant is big.','big','stor',['liten','langsom','stor'],'«Big» betyr stor.'],
 ['I am thirsty. I need water.','thirsty','tørst',['trøtt','tørst','glad'],'Den som er tørst, trenger noe å drikke.'],
 ['We play outside.','outside','ute',['ute','inne','under'],'«Outside» betyr ute.'],
 ] as const;
 const tasks:Draft[]=meanings.map(([text,word,answer,choices,explanation],i)=>c(`Hva betyr «${word}» her?`,[...choices],answer,'Bruk resten av setningen som hjelp.',explanation,{text,reading:true,transfer:i>8}));
 const fill=[['I drink ___. (vann)','water','Vi trenger dette når vi er tørste.'],['This is my ___. (hånd)','hand','Vi kan vinke med den.'],['The sky is ___. (blå)','blue','Tenk på en farge du kjenner.'],['I have two ___. (øyne)','eyes','Du ser med dem.'],['The ball is in the ___. (eske)','box','Et kort ord som slutter på x.'],['I can ___. (løpe)','run','Dette er en handling.'],['My bag is ___. (rød)','red','Tenk på en farge med tre bokstaver.'],['I like ___. (melk)','milk','En vanlig drikk.']];
 tasks.push(...fill.map(([prompt,answer,hint])=>w(`Skriv bare ordet som mangler: ${prompt}`,answer,hint,`Ordet som mangler er «${answer}».`,{transfer:true})));
 tasks.push(m('Koble klærne.',pairs([['coat','jakke'],['hat','lue'],['shoes','sko']])));
 tasks.push(m('Koble ordene som beskriver plassering.',pairs([['in','i'],['under','under'],['next to','ved siden av']])));
 tasks.push(m('Koble ord for hvordan noen har det.',pairs([['thirsty','tørst'],['happy','glad'],['tired','trøtt']])));
 tasks.push(m('Koble kroppsdeler.',pairs([['eyes','øyne'],['ears','ører'],['hands','hender']])));
 tasks.push(s('Velg alle ordene som kan være klær.',['hat','coat','water','shoes'],['hat','coat','shoes'],'Se etter ting du tar på deg.','«Hat», «coat» og «shoes» er klær.'));
 tasks.push(s('Velg de to ordene som er handlinger.',['run','blue','jump','chair'],['run','jump'],'Tenk på hva du kan gjøre.','«Run» og «jump» betyr løpe og hoppe.'));
 tasks.push(s('Velg de to ordene som forteller hvordan noen kan ha det.',['happy','window','tired','door'],['happy','tired'],'Tenk på følelser og behov.','Du kan være «happy» eller «tired».'));
 tasks.push(s('Velg de to ordene som sier noe om plassering.',['under','apple','in','rabbit'],['under','in'],'Tenk på hvor noe er.','«Under» og «in» kan vise hvor noe er.'));
 return tasks;
}
const instructions2=[
 {text:'Put the book on the table.',q:'Hvor skal boken ligge?',choices:['Under bordet','På bordet','I sekken'],a:'På bordet',h:'«On» betyr på.'},
 {text:'Draw a small red circle.',q:'Hvilken figur skal du tegne?',choices:['En stor blå firkant','En liten rød sirkel','En liten gul trekant'],a:'En liten rød sirkel',h:'Se etter størrelse, farge og figur.'},
 {text:'Take the blue pencil, not the red one.',q:'Hvilken blyant skal du ta?',choices:['Den røde','Den grønne','Den blå'],a:'Den blå',h:'«Not the red one» betyr at du ikke skal ta den røde.'},
 {text:'Put three blocks in the box.',q:'Hvor mange klosser skal i esken?',choices:['To','Tre','Fire'],a:'Tre',h:'«Three» betyr tre.'},
 {text:'Open your book and point to a picture.',q:'Hva skal du gjøre først?',choices:['Peke på et bilde','Lukke boken','Åpne boken'],a:'Åpne boken',h:'Les handlingen før «and».'},
 {text:'Close the door, then sit down.',q:'Hva skal du gjøre etter å ha lukket døren?',choices:['Sette deg','Reise deg','Åpne vinduet'],a:'Sette deg',h:'«Then» betyr så eller deretter.'},
 {text:'Put the toy car next to the teddy bear.',q:'Hvor skal lekebilen stå?',choices:['Oppå bamsen','Ved siden av bamsen','Under bamsen'],a:'Ved siden av bamsen',h:'«Next to» betyr ved siden av.'},
 {text:'Draw a sun above the house.',q:'Hvor skal solen være på tegningen?',choices:['Over huset','Inne i huset','Under huset'],a:'Over huset',h:'«Above» betyr over.'},
 {text:'Find a green thing in the room.',q:'Hva skal du lete etter?',choices:['Noe blått','Noe grønt','Noe rødt'],a:'Noe grønt',h:'«Green» er en farge.'},
 {text:'Touch your head, then clap twice.',q:'Hvor mange ganger skal du klappe?',choices:['Én gang','To ganger','Tre ganger'],a:'To ganger',h:'«Twice» betyr to ganger.'},
 {text:'Leave the window closed.',q:'Hvordan skal vinduet være?',choices:['Åpent','Halvåpent','Lukket'],a:'Lukket',h:'«Closed» betyr lukket.'},
 {text:'Choose one apple and two pears.',q:'Hva skal du velge?',choices:['To epler og én pære','Ett eple og to pærer','Tre epler'],a:'Ett eple og to pærer',h:'Les ett antall om gangen.'},
];
function followInstructions():Draft[]{
 const tasks:Draft[]=instructions2.map((d,i)=>c(d.q,d.choices,d.a,d.h,`Instruksjonen er «${d.text}».`,{text:d.text,reading:true,transfer:i>8}));
 const sequences=[
 [['Open the box.','Take out the ball.','Close the empty box.'],'En eske må åpnes før du kan ta noe ut.'],
 [['Pick up the pencil.','Draw a circle.','Put the pencil down.'],'Du trenger blyanten før du kan tegne.'],
 [['Open the book.','Read a page.','Close the book.'],'Tenk på hvordan du bruker en bok.'],
 [['Put on your socks.','Put on your shoes.','Tie your shoes.'],'Sokkene kommer før skoene.'],
 [['Wash your hands.','Dry your hands.','Eat your apple.'],'Rene, tørre hender kommer før maten her.'],
 [['Find a sheet of paper.','Fold the paper.','Open the folded paper.'],'Du kan ikke åpne bretten før du har brettet.'],
 [['Take an empty cup.','Put water in the cup.','Drink the water.'],'Koppen trenger vann før du kan drikke av den.'],
 [['Open the bag.','Put the book in the bag.','Close the bag.'],'Hva må du åpne først?'],
 ] as [string[],string][];
 tasks.push(...sequences.map(([tiles,hint])=>order('Legg de engelske instruksjonene i en naturlig rekkefølge.',tiles,hint,tiles.join(' → '),{transfer:true})));
 tasks.push(m('Koble instruksjonene.',pairs([['Open the door.','Åpne døren.'],['Close the book.','Lukk boken.'],['Sit down.','Sett deg.']])));
 tasks.push(m('Koble plasseringsordene.',pairs([['above the house','over huset'],['under the chair','under stolen'],['in the box','i esken']])));
 tasks.push(m('Koble antall i instruksjoner.',pairs([['clap twice','klapp to ganger'],['take one','ta én'],['show three','vis tre']])));
 tasks.push(m('Koble små tegneoppdrag.',pairs([['a small circle','en liten sirkel'],['a red square','en rød firkant'],['a blue line','en blå strek']])));
 tasks.push(o('En voksen leser «Put a pencil under a book». Prøv med ting på bordet.','Den voksne kan vise hva «under» betyr først. Dette er øving med voksenmodell.'));
 tasks.push(o('En voksen leser «Touch your head, then clap twice». Vis det med kroppen.','Gjør det i rolig tempo. Voksen kan gjenta instruksjonen.'));
 tasks.push(o('Si en enkel instruksjon til en voksen: «Point to …».','Velg en trygg ting dere kan peke på, som «the door».'));
 tasks.push(o('Tegn noe etter en vokseninstruksjon på engelsk. Bytt så roller.','Prøv «Draw a small blue circle». Ingen automatisk vurdering av lytting eller uttale.'));
 return tasks;
}
function askAnswer():Draft[]{
 const dialogs=[
 ['What would you like to drink?','Water, please.',['Water, please.','I am eight.','It is blue.'],'Spørsmålet handler om hva du vil drikke.'],
 ['Can I borrow your pencil?','Yes, here you are.',['I like dogs.','Yes, here you are.','It is Monday.'],'Personen ber om å låne noe.'],
 ['Where is my bag?','It is under the chair.',['It is under the chair.','I am fine.','Yes, I do.'],'«Where» spør hvor noe er.'],
 ['What colour is your bike?','It is red.',['I am red.','It is red.','I am eight.'],'Svaret må være en farge på sykkelen.'],
 ['Do you like apples?','Yes, I do.',['Yes, I do.','My name is Sam.','It is on the table.'],'Et ja/nei-spørsmål om hva du liker.'],
 ['How many pencils do you have?','I have three pencils.',['I have three pencils.','My pencil is blue.','I like pencils.'],'«How many» spør etter et antall.'],
 ['What is your favourite animal?','My favourite animal is a rabbit.',['It is Tuesday.','My favourite animal is a rabbit.','I am hungry.'],'Spørsmålet handler om hvilket dyr du liker best.'],
 ['Are you hungry?','Yes, I am.',['Yes, I am.','I have a red bag.','It is under the bed.'],'«Are you» passer sammen med «I am».'],
 ['May I join the game?','Yes, come and play!',['Good night!','Yes, come and play!','It is a blue ball.'],'Noen spør om å få være med på leken.'],
 ['What are you reading?','I am reading a story.',['I am reading a story.','I am nine.','I live here.'],'Svaret må fortelle om lesing.'],
 ['What can you see?','I can see a bird.',['I can see a bird.','I like to sing.','It is Monday.'],'Spørsmålet handler om det du ser.'],
 ['How do you spell cat?','C-A-T.',['Three cats.','C-A-T.','A small cat.'],'«Spell» betyr å stave.'],
 ] as [string,string,string[],string][];
 const tasks:Draft[]=dialogs.map(([text,a,choices,h],i)=>c('Hvilket svar passer til spørsmålet?',choices,a,h,`Et passende svar er «${a}».`,{text,reading:true,transfer:i>8}));
 const phrases=[['Jeg vil gjerne ha vann.','Water please'],['Jeg liker epler.','I like apples'],['Bagen er under stolen.','The bag is under the chair'],['Jeg har tre blyanter.','I have three pencils'],['Kan jeg være med?','May I join the game'],['Min favorittfarge er blå.','My favourite colour is blue'],['Jeg kan se en fugl.','I can see a bird'],['Her er boken din.','Here is your book']];
 tasks.push(...phrases.map(([no,en])=>b(`Bygg en engelsk setning: «${no}»`,en,'Bruk alle brikkene og begynn med stor bokstav.',{transfer:true})));
 tasks.push(order('Legg samtalen i riktig rekkefølge.',['A: Hello! What is your name?','B: My name is Kim. What is your name?','A: My name is Alex. Nice to meet you.','B: Nice to meet you too.'],'Se etter hva hvert spørsmål trenger som svar.','Først spør A. Så spør B tilbake, før begge sier hyggelig å møte deg.'));
 tasks.push(order('Legg denne lånesamtalen i rekkefølge.',['A: Can I borrow a pencil?','B: Yes, here you are.','A: Thank you!','B: You’re welcome.'],'Forespørselen kommer før blyanten og takken.','Først spør du, så får du hjelp, og til slutt takker du.'));
 tasks.push(order('Legg samtalen om drikke i rekkefølge.',['A: What would you like to drink?','B: Water, please.','A: Here is your water.','B: Thank you.'],'Hva må A vite før vannet blir gitt?','Spørsmål → ønske → vann → takk.'));
 tasks.push(order('Ordne samtalen om en bortkommen bok.',['A: Where is my book?','B: It is on the table.','A: I can see it now.','B: Great!'],'Spørsmålet kommer før hjelpen.','Spørsmål → forklaring → boken blir funnet → respons.'));
 tasks.push(o('Spør en voksen «What is your favourite animal?» og svar på samme spørsmål.','Den voksne kan modellere svaret «My favourite animal is …».'));
 tasks.push(o('Lek butikk. Be om noe med «Can I have …, please?»','En voksen modellerer et tydelig svar. Uttale vurderes ikke automatisk.'));
 tasks.push(o('Finn noe på rommet. Spør en voksen «Where is my …?»','Bytt på å spørre og vise hvor noe er.'));
 tasks.push(o('Prøv å bli med i en lek med «May I join the game?»','Snakk om et hyggelig svar sammen med en voksen.'));
 return tasks;
}
function readWrite():Draft[]{
 const blanks=[
 ['I ___ cats. (liker)','like','Tenk på setningen «I like …».'],['This is my ___. (hund)','dog','Ordet har tre bokstaver.'],['The ball is ___. (rød)','red','Det er en farge.'],['I have two ___. (bøker)','books','Her er det mer enn én bok.'],
 ['The cat is in the ___. (eske)','box','Dette er en beholder.'],['I can ___. (svømme)','swim','Dette kan du gjøre i vann.'],['My name ___ Sam. (er)','is','Et lite ord med to bokstaver.'],['I ___ eight. (er)','am','Etter «I» bruker vi «am» her.'],
 ['The sky is ___. (blå)','blue','Tenk på fargen på en klar himmel.'],['Please open the ___. (dør)','door','Noe du kan gå gjennom.'],['I drink ___. (vann)','water','Du trenger dette når du er tørst.'],['I like my ___. (bok)','book','Du kan lese den.'],
 ];
 const tasks:Draft[]=blanks.map(([p,a,h],i)=>w(`Skriv bare ordet som mangler: ${p}`,a,h,`Riktig ord er «${a}».`,{transfer:i>8}));
 const sentences=[['Jeg liker bananer.','I like bananas'],['Dette er min katt.','This is my cat'],['Jeg kan løpe.','I can run'],['Solen er gul.','The sun is yellow'],['Hunden er liten.','The dog is small'],['Vi leker ute.','We play outside'],['Jeg har en blå bok.','I have a blue book'],['Ballen er i esken.','The ball is in the box']];
 tasks.push(...sentences.map(([no,en])=>b(`Bygg setningen «${no}» på engelsk.`,en,'Begynn med stor bokstav. Bruk alle brikkene.')));
 tasks.push(m('Koble setningene til betydningen.',pairs([['I can swim.','Jeg kan svømme.'],['I like books.','Jeg liker bøker.'],['My name is Liv.','Jeg heter Liv.']])));
 tasks.push(m('Koble setningsstarten med riktig avslutning.',pairs([['My name','is Sam.'],['I','am eight.'],['This','is my dog.']]),'Les hele setningen som dannes.'));
 tasks.push(m('Koble småord til norsk.',pairs([['my','min / mitt'],['two','to'],['and','og']])));
 tasks.push(m('Koble ordene i entall og flertall.',pairs([['one cat','two cats'],['one book','two books'],['one ball','two balls']])));
 tasks.push(o('Skriv én engelsk setning om noe du liker.','Du kan begynne med «I like …». Det finnes mange gode svar.'));
 tasks.push(o('Tegn et dyr og skriv en engelsk setning til tegningen.','Prøv «This is a …». Be gjerne en voksen om et ord.'));
 tasks.push(o('Skriv en liten hilsen til en voksen.','Begynn med «Hello» og avslutt med navnet ditt eller et kallenavn.'));
 tasks.push(o('Les en av dine egne setninger for en voksen. Vil du legge til ett ord?','Voksne kan svare på meningen. Ikke alt trenger å rettes på én gang.'));
 return tasks;
}

function smallTalk():Draft[]{
 const scenes=[
 ['A: What do you like doing after school?','B: I like drawing animals.',['B: I like drawing animals.','B: The pencil is on the desk.','B: It is half past two.'],'Spørsmålet handler om hva personen liker å gjøre.'],
 ['A: Why do you like your bike?','B: Because I can ride it to the park.',['B: It is under the table.','B: Because I can ride it to the park.','B: My name is Alex.'],'«Why» spør etter en grunn.'],
 ['A: When do you go swimming?','B: On Saturdays.',['B: With my sister.','B: At the pool.','B: On Saturdays.'],'«When» spør etter tid.'],
 ['A: Who is coming with you?','B: My cousin is coming.',['B: My cousin is coming.','B: At four o’clock.','B: To the library.'],'«Who» spør hvem.'],
 ['A: Where shall we meet?','B: By the school gate.',['B: By the school gate.','B: At three o’clock.','B: Because it is fun.'],'«Where» spør etter et sted.'],
 ['A: Can you help me find the library?','B: Yes. It is next to the park.',['B: I have a blue library card.','B: Yes. It is next to the park.','B: I like stories.'],'Personen trenger hjelp til å finne et sted.'],
 ['A: Would you like to play a board game?','B: Yes, that sounds fun.',['B: Yes, that sounds fun.','B: My game is in a box.','B: I have two games.'],'Spørsmålet er en invitasjon.'],
 ['A: I don’t understand. Can you say it again?','B: Of course. I will say it slowly.',['B: Of course. I will say it slowly.','B: I have a red book.','B: It is Tuesday.'],'Personen ber om gjentakelse.'],
 ['A: Which fruit would you like: an apple or a pear?','B: A pear, please.',['B: A banana, please.','B: A pear, please.','B: Yes, I am.'],'Velg ett av de to alternativene som tilbys.'],
 ['A: What is the weather like today?','B: It is rainy and windy.',['B: It is rainy and windy.','B: My coat is red.','B: I like summer.'],'Spørsmålet handler om dagens vær.'],
 ['A: How do you get to school?','B: I walk with my dad.',['B: At eight o’clock.','B: I walk with my dad.','B: In the classroom.'],'«How» spør her om måten du reiser på.'],
 ['A: What would you like to learn?','B: I would like to learn to skate.',['B: It is on the ice.','B: I would like to learn to skate.','B: I am cold.'],'Svaret forteller om noe personen vil lære.'],
 ['A: Is this your scarf?','B: No, mine is green.',['B: No, mine is green.','B: I am wearing shoes.','B: It is cold outside.'],'Spørsmålet handler om hvem skjerfet tilhører.'],
 ['A: What did you see in the garden?','B: I saw a frog by the pond.',['B: I like gardens.','B: I saw a frog by the pond.','B: I will go tomorrow.'],'Svaret må fortelle om noe som ble sett.'],
 ['A: I feel nervous about the play.','B: We can practise together.',['B: We can practise together.','B: My bag is heavy.','B: The play is in a book.'],'Se etter en hjelpsom respons på at noen er nervøse.'],
 ['A: Do you want the window open or closed?','B: Closed, please. I am cold.',['B: I can see a window.','B: Closed, please. I am cold.','B: It is a big room.'],'Spørsmålet ber om et valg.'],
 ] as [string,string,string[],string][];
 const tasks:Draft[]=scenes.map(([text,answer,choices,hint],i)=>c('Hvilken replikk passer best i samtalen?',choices,answer,hint,answer,{text,reading:true,transfer:i>11}));
 tasks.push(order('Ordne en samtale om å finne fram.',['A: Excuse me. Where is the library?','B: It is next to the park.','A: Thank you for your help.','B: You’re welcome.'],'Spørsmålet må komme før svaret og takken.','En høflig forespørsel, veibeskrivelse, takk og svar på takk.'));
 tasks.push(order('Ordne en samtale om en invitasjon.',['A: Would you like to play a game?','B: Yes. Which game?','A: Let’s play this board game.','B: Good idea!'],'Svaret spør om hvilket spill før A velger det.','Invitasjon → spørsmål om spill → forslag → enighet.'));
 tasks.push(order('Ordne en samtale om å få gjentatt noe.',['A: Please take the blue pencil.','B: Sorry, can you say that again?','A: Yes. Take the blue pencil.','B: Thank you. I understand now.'],'B må høre noe før B kan be om gjentakelse.','Instruksjon → be om gjentakelse → gjentatt instruksjon → forståelse.'));
 tasks.push(order('Ordne en samtale om en mistet lue.',['A: I can’t find my hat.','B: What colour is it?','A: It is green.','B: There is a green hat by the door.'],'Fargeopplysningen trengs for å finne riktig lue.','Problem → spørsmål om farge → svar → et mulig funnsted.'));
 tasks.push(b('Bygg en høflig forespørsel om hjelp.','Can you help me please','Begynn med «Can». Spør om personen kan hjelpe.',{acceptedAnswers:['Can you please help me']}));
 tasks.push(b('Bygg setningen «Jeg liker å tegne fordi det er gøy».','I like drawing because it is fun','En grunn kommer etter «because».'));
 tasks.push(b('Bygg spørsmålet «Hvor skal vi møtes?»','Where shall we meet','Begynn med spørreordet «Where».'));
 tasks.push(b('Bygg «Jeg vil gjerne lære å svømme».','I would like to learn to swim','«Would like» uttrykker et ønske.'));
 tasks.push(o('Inviter en voksen til en aktivitet på engelsk. La den voksne spørre «When?» eller «Where?»','Prøv å svare med et sted eller en tid. Den voksne kan gi språkmodell først.'));
 tasks.push(o('Fortell en voksen om en interesse og én grunn til at du liker den.','Prøv «I like … because …». Det er lov å bruke hjelp.'));
 tasks.push(o('Be en voksen gjenta en setning på engelsk.','Prøv «Can you say that again, please?» Uttalen vurderes ikke av appen.'));
 tasks.push(o('Lek at dere finner en mistet ting. Bytt på å spørre om farge og sted.','Bruk «What colour is it?» og «Where is it?».'));
 return tasks;
}
const adventureStories:Story[]=[
 {text:'Nora and Amir walk to the pond with a small bucket. They see a frog beside a stone. Amir wants to pick it up, but Nora says they should watch quietly. Soon the frog jumps into the water.',questions:[['Where do Nora and Amir go?',['To a pond','To a shop','To a station'],'To a pond','Look for the place in the first sentence.'],['Why do they stay quiet?',['To watch the frog','To find the bucket','To hide from rain'],'To watch the frog','Think about what Nora wants them to do.']]},
 {text:'Milo packs a sandwich, a pear and some water for a walk. When he opens his bag, the pear is gone. He looks behind him. His little sister is holding it and smiling. She wanted to carry something too.',questions:[['What is missing from Milo’s bag?',['The sandwich','The pear','The water'],'The pear','Look for the thing that is gone.'],['Who has the missing thing?',['His sister','His teacher','His friend'],'His sister','Read what Milo sees behind him.']]},
 {text:'Aya wants to fly her kite. The sky is clear, but the air is still. She runs across the field and the kite rises for a moment. Then it falls. Aya decides to come back on a windy day.',questions:[['Why does Aya decide to come back?',['She needs more wind','She needs a new bag','It is too dark'],'She needs more wind','The air is still. What does a kite need?'],['Where does Aya run?',['Across the field','Through the kitchen','Under the table'],'Across the field','Find the sentence about running.']]},
 {text:'At the library, Theo looks for a book about insects. He finds a book about spiders instead. The librarian explains that spiders are not insects. She helps him find a book about bees and butterflies.',questions:[['What does Theo want a book about?',['Birds','Insects','Fish'],'Insects','Read what Theo is looking for.'],['Who helps Theo find the book?',['A librarian','A bus driver','A gardener'],'A librarian','Find the person who helps him.']]},
 {text:'Sana and Jo build a bridge with blocks. At first the bridge falls when they put a toy car on it. They add more blocks under the middle. This time the car crosses safely. They cheer together.',questions:[['What do Sana and Jo build?',['A tower','A bridge','A house'],'A bridge','Read the first sentence.'],['What helps the car cross safely?',['More blocks under the middle','A larger car','A longer road'],'More blocks under the middle','What do the children change?']]},
 {text:'It starts raining on the way home. Elliot has an umbrella, but his friend Kim has none. Elliot moves closer and holds the umbrella over both of them. Their shoes get wet, but their heads stay dry.',questions:[['Who has an umbrella?',['Kim','Elliot','Both children'],'Elliot','Read who has it at the start.'],['What do the children share?',['An umbrella','A pair of shoes','A coat'],'An umbrella','Look at what Elliot holds over them.']]},
 {text:'Lina finds a small key under a bench. She does not know whose key it is. She takes it to the school office and tells an adult where she found it. Later, the caretaker comes to collect it.',questions:[['Where does Lina find the key?',['Under a bench','In a bag','On a bus'],'Under a bench','Find the place in the first sentence.'],['Why does Lina take it to the office?',['To help the owner find it','To keep it in her pocket','To hide it from everyone'],'To help the owner find it','Think about why lost things go to an adult at school.']]},
 {text:'A class plants seeds in two pots. One pot stands near the window. The other stands inside a dark cupboard. Both get water. After a week, the plant by the window is green and strong. The other is pale.',questions:[['What is different for the two plants?',['The amount of light','The colour of the pots','The day they were planted'],'The amount of light','Compare where the pots stand.'],['Which plant is green and strong?',['The one by the window','The one in the cupboard','Both plants'],'The one by the window','Read the result after a week.']]},
 {text:'Max writes a sign for a small play: “The show starts at four.” He puts it by the classroom door. His friend points out that the room number is missing. Max adds “Room 3” so visitors know where to go.',questions:[['What does Max add to the sign?',['The room number','The ticket price','The weather'],'The room number','Look for the information that was missing.'],['Why is the new information useful?',['Visitors can find the room','Visitors can choose a snack','Visitors can see the time in two places'],'Visitors can find the room','Think about what “Room 3” tells a visitor.']]},
 {text:'Zoe wants to draw a bird, but it keeps moving. She watches it for a while and notices its long tail. After the bird flies away, she draws the shape she remembers. She adds a note: “A bird with a long tail.”',questions:[['What does Zoe notice about the bird?',['Its long tail','Its blue nest','Its red feet'],'Its long tail','Find the detail she watches.'],['When does Zoe finish drawing?',['After the bird flies away','Before she sees the bird','While she is asleep'],'After the bird flies away','Read the order of events.']]},
];
function smallAdventure():Draft[]{
 const tasks=storyPack(adventureStories,'e3-adventure');
 const refs=[
 {i:4,tiles:['The first bridge falls.','The children add blocks under the middle.','The car crosses safely.']},
 {i:6,tiles:['Lina finds a key.','Lina takes the key to the office.','The caretaker collects it.']},
 {i:8,tiles:['Max writes the starting time.','His friend notices the room number is missing.','Max adds Room 3.']},
 {i:9,tiles:['Zoe watches the bird.','The bird flies away.','Zoe draws what she remembers.']},
 ];
 tasks.push(...refs.map(({i,tiles})=>order('Legg hendelsene i rekkefølgen fra teksten.',tiles,'Se etter hva som må skje før det neste kan skje.',tiles.join(' → '),{text:adventureStories[i].text,reading:true,evidenceGroup:`e3-adventure-story-${i}`,transfer:true})));
 tasks.push(o('Velg en av historiene og gjenfortell tre hendelser på engelsk til en voksen.','Bruk «First …, then …, finally …». Den voksne kan gi støtte.'));
 tasks.push(o('Skriv en ny slutt på historien om dragen.','Du kan begynne med «The next day …». Flere gode løsninger er mulige.',adventureStories[2].text));
 tasks.push(o('Hva ville du gjort om du fant en nøkkel? Fortell en voksen på engelsk.','Prøv «I would …». Be om ord ved behov.',adventureStories[6].text));
 tasks.push(o('Fortell hva barna endret for å få broen til å holde.','Bruk tegning, engelske ord og hjelp fra en voksen.',adventureStories[4].text));
 return tasks;
}

function readDiscover():Draft[]{
 const notices=[
 {text:'LIBRARY CLUB\nTuesday, 3–5 pm. Bring a book you like. We read together and share ideas. Meet in Room 2.',q:'Hvilket rom skal du møte i?',choices:['Room 1','Room 2','Room 5'],a:'Room 2',blank:'Skriv dagen klubben møtes på engelsk.',word:'Tuesday',select:'Velg de to tingene teksten sier dere gjør i klubben.',options:['Read together','Share ideas','Play football','Bake bread'],correct:['Read together','Share ideas']},
 {text:'Hi Sam,\nI can’t meet at the park today because I have a cold. Can we meet on Saturday instead?\nFrom Lee',q:'Hvorfor kan ikke Lee møtes i dag?',choices:['Lee is ill','Lee lost a ball','The park is closed'],a:'Lee is ill',blank:'Skriv dagen Lee foreslår å møtes på engelsk.',word:'Saturday',select:'Velg to opplysninger som finnes i meldingen.',options:['Lee has a cold','Lee suggests Saturday','Sam has a dog','The park is closed'],correct:['Lee has a cold','Lee suggests Saturday']},
 {text:'LOST SCARF\nA green scarf was found beside the playground. Ask at the school office. Tell the adult what the scarf looks like.',q:'Hvor kan eieren spørre etter skjerfet?',choices:['At the shop','At the school office','At the pool'],a:'At the school office',blank:'Skriv fargen på skjerfet på engelsk.',word:'green',select:'Velg det teksten forteller om skjerfet.',options:['It is green','It was beside the playground','It is red','It is a hat'],correct:['It is green','It was beside the playground']},
 {text:'PICNIC LIST\nPlease bring water, a sandwich and a raincoat. We will walk to the lake. We will eat in the shelter if it rains.',q:'Hvor skal gruppen gå?',choices:['To the library','To the lake','To the station'],a:'To the lake',blank:'Skriv den engelske drikken på listen.',word:'water',select:'Velg de tre tingene på listen.',options:['Water','A sandwich','A raincoat','A kite'],correct:['Water','A sandwich','A raincoat']},
 {text:'Dear Jo,\nThe play starts at 4 pm in the hall. Please come at 3:45 pm so you can find a seat. You do not need a ticket.\nFrom the drama club',q:'Hvorfor bør Jo komme før klokken fire?',choices:['To find a seat','To buy a ticket','To water a plant'],a:'To find a seat',blank:'Skriv det engelske ordet i teksten som betyr «billett».',word:'ticket',select:'Velg de to påstandene teksten støtter.',options:['The play is in the hall','No ticket is needed','The play starts at noon','Jo must buy a ticket'],correct:['The play is in the hall','No ticket is needed']},
 {text:'GARDEN HELPERS\nMeet by the gate at 10 am on Sunday. Wear old clothes. We will plant flowers and water the new trees. Gloves are available.',q:'Hvorfor er gamle klær et lurt valg?',choices:['The work may make them dirty','The clothes must be blue','Everyone will swim'],a:'The work may make them dirty',blank:'Skriv den engelske dagen dere skal møtes.',word:'Sunday',select:'Velg de to oppgavene som nevnes.',options:['Plant flowers','Water trees','Paint the school','Clean a bus'],correct:['Plant flowers','Water trees']},
 {text:'Hi! My rabbit is called Bean. Bean eats hay and vegetables. I give Bean fresh water every day. Bean has a quiet place to hide and rest.',q:'Hva får Bean hver dag?',choices:['Fresh water','Cake','New shoes'],a:'Fresh water',blank:'Hva heter kaninen? Skriv navnet.',word:'Bean',select:'Velg de to tingene teksten sier at Bean spiser.',options:['Hay','Vegetables','Chocolate','Fish'],correct:['Hay','Vegetables']},
 {text:'WEATHER UPDATE\nIt will be sunny in the morning and rainy after lunch. Our class will play outside before lunch and do art inside afterwards.',q:'Når skal klassen være ute?',choices:['Before lunch','After lunch','At night'],a:'Before lunch',blank:'Skriv det engelske ordet som beskriver været etter lunsj.',word:'rainy',select:'Velg de to planene i teksten.',options:['Play outside before lunch','Do art inside after lunch','Swim at night','Play outside after lunch'],correct:['Play outside before lunch','Do art inside after lunch']},
 ];
 const tasks:Draft[]=[];
 notices.forEach((n,i)=>{
 const extra={text:n.text,reading:true,evidenceGroup:`e3-functional-${i}`,transfer:i>=6};
 tasks.push(c(n.q,n.choices,n.a,'Finn setningen som forteller om akkurat dette.',`Teksten støtter «${n.a}».`,extra));
 tasks.push(w(n.blank,n.word,'Se etter ordet i teksten.',`Ordet er «${n.word}».`,extra));
 tasks.push({...s(n.select,n.options,n.correct,'Velg bare det teksten faktisk forteller.',n.correct.join(' · ')),...extra});
 });
 tasks.push(m('Koble teksttypen til hensikten.',pairs([['Lost scarf notice','Help an owner find a scarf'],['Picnic list','Remember what to bring'],['Weather update','Plan for the weather']])));
 tasks.push(m('Koble tidsuttrykkene.',pairs([['before lunch','før lunsj'],['after lunch','etter lunsj'],['every day','hver dag']])));
 tasks.push(o('Skriv en liten beskjed om noe som er mistet.','Beskriv tingen og et trygt sted en voksen kan kontaktes. Ikke skriv ekte telefonnummer eller adresse.'));
 tasks.push(o('Velg en beskjed fra økten og forklar en voksen hva mottakeren bør gjøre.','Prøv på engelsk først, og bruk norsk støtte hvis du trenger det.'));
 return tasks;
}
function ownSentences():Draft[]{
 const sentences=[
 ['Jeg liker å lese i hagen.','I like reading in the garden'],['Vennen min har en grønn sykkel.','My friend has a green bike'],['Vi går til skolen sammen.','We walk to school together'],['Katten sover under stolen.','The cat sleeps under the chair'],['Jeg kan svømme, men jeg kan ikke fly.','I can swim but I cannot fly'],['Det regner, så jeg trenger en jakke.','It is raining so I need a coat'],['Jeg vil gjerne låne denne boken.','I would like to borrow this book'],['Vi har to epler og tre pærer.','We have two apples and three pears'],['Min favorittdag er lørdag.','My favourite day is Saturday'],['Jeg er glad fordi vennen min er her.','I am happy because my friend is here'],
 ];
 const tasks:Draft[]=sentences.map(([no,en],i)=>b(`Bygg setningen «${no}» på engelsk.`,en,'Finn hvem setningen handler om. Legg grunnen etter «because» når det finnes.',{transfer:i>=7}));
 const blanks=[
 ['She ___ a red bag. (har)','has','Etter «she» bruker vi «has» her.'],['I ___ a blue bike. (har)','have','Etter «I» bruker vi «have».'],['We ___ outside. (leker)','play','Vi er flere: «We play».'],['The dog ___ under the table. (er)','is','Én hund: «The dog is …».'],['The books ___ on the desk. (er)','are','Flere bøker: «The books are …».'],['I like apples ___ pears. (og)','and','Ordet binder sammen to ting.'],['It is cold ___ I need a coat. (så)','so','Det andre skjer som følge av det første.'],['I like the park ___ I can play there. (fordi)','because','Her kommer en grunn.'],
 ];
 tasks.push(...blanks.map(([p,a,h])=>w(`Skriv bare ordet som mangler: ${p}`,a,h,`Ordet som passer, er «${a}».`)));
 tasks.push(s('Velg de to setningene som gir en grunn.',['I like summer because I can swim.','I like my book because it is funny.','My book is blue.','I have a pencil.'],['I like summer because I can swim.','I like my book because it is funny.'],'Se etter «because».','Begge de valgte setningene forteller hvorfor noen liker noe.'));
 tasks.push(s('Velg de to setningene som forteller om et ønske.',['I would like to learn to skate.','I have a red coat.','I would like a glass of water.','The cat is asleep.'],['I would like to learn to skate.','I would like a glass of water.'],'Se etter «would like».','«Would like» kan uttrykke et ønske.'));
 tasks.push(s('Velg de to setningene som beskriver hvor noe er.',['The ball is under the bed.','The book is on the table.','I can run.','I like cats.'],['The ball is under the bed.','The book is on the table.'],'Se etter plassering som «under» og «on».','Begge setningene forteller hvor en ting er.'));
 tasks.push(s('Velg de to setningene som er spørsmål.',['Where is my bag?','Can I join the game?','My name is Kim.','It is raining.'],['Where is my bag?','Can I join the game?'],'Se både på ordstillingen og spørsmålstegnet.','Begge de valgte setningene spør om noe.'));
 tasks.push(s('Velg de to setningene som forteller noe du kan gjøre.',['I can draw a bird.','I can ride a bike.','My bike is red.','I am hungry.'],['I can draw a bird.','I can ride a bike.'],'Se etter «I can».','«I can» betyr «jeg kan».'));
 tasks.push(s('Velg de to setningene som passer som en hilsen eller avslutning i en beskjed.',['Hello, Sam!','See you soon!','The door is blue.','I have three socks.'],['Hello, Sam!','See you soon!'],'Tenk på begynnelsen og slutten av en beskjed.','«Hello» kan innlede, og «See you soon» kan avslutte.'));
 tasks.push(o('Skriv to setninger om noe du liker. La én setning forklare hvorfor.','Du kan bruke «I like … because …». Voksne kan hjelpe med ord.'));
 tasks.push(o('Beskriv et sted med to engelske setninger.','Fortell hva som finnes der, og hvor én ting er.'));
 tasks.push(o('Skriv en invitasjon med en aktivitet og en dag.','Prøv «Would you like to … on …?» Ikke bruk private adresser.'));
 tasks.push(o('Les teksten din for en voksen, og velg én ting du vil gjøre tydeligere.','Se etter stor bokstav, mellomrom og passende tegn. Appen gir ikke automatisk karakter på teksten.'));
 return tasks;
}

function everydayLife():Draft[]{
 const scenes=[
 ['A: I enjoy making things, but I don’t know what to make next.','B: You could build a model bridge.',['B: You could build a model bridge.','B: My shoes are by the door.','B: Yesterday was Tuesday.'],'Se etter et forslag som passer til interessen.'],
 ['A: I can’t come on Friday. Could we meet another day?','B: How about Saturday morning?',['B: See you on Friday.','B: How about Saturday morning?','B: I have a green bike.'],'Personen trenger et nytt tidspunkt.'],
 ['A: What do you usually do before school?','B: I eat breakfast and pack my bag.',['B: I eat breakfast and pack my bag.','B: Last year I went camping.','B: I will visit the zoo next month.'],'«Usually» spør om det man pleier å gjøre.'],
 ['A: Why did you choose that book?','B: Because I wanted to learn about whales.',['B: It is on the shelf.','B: Because I wanted to learn about whales.','B: The library closes at five.'],'Spørsmålet ber om en begrunnelse for valget.'],
 ['A: I’m not sure what “shelter” means.','B: Let’s look at the words around it.',['B: Let’s look at the words around it.','B: Let’s close the book forever.','B: You must know every word already.'],'En hjelpsom strategi bruker konteksten.'],
 ['A: Would you prefer a quiet game or a running game?','B: A quiet game, please. My leg hurts.',['B: Yes, games are fun.','B: A quiet game, please. My leg hurts.','B: I played yesterday.'],'Svaret bør gi et av valgene og kan forklare hvorfor.'],
 ['A: How was your trip to the museum?','B: It was interesting. I learned how boats were built.',['B: It is next to the park.','B: It was interesting. I learned how boats were built.','B: I will take a bus tomorrow.'],'Spørsmålet handler om en opplevelse som allerede har skjedd.'],
 ['A: What should we take if it rains?','B: A raincoat and waterproof shoes.',['B: A raincoat and waterproof shoes.','B: A sunhat and sunglasses only.','B: A book about deserts.'],'Velg det som hjelper i regn.'],
 ['A: I disagree, but I want to say it politely.','B: You could say, “I see your point, but I think …”',['B: You could say, “I see your point, but I think …”','B: Never listen to anyone else.','B: Just shout louder.'],'Høflig uenighet gir plass til begge syn.'],
 ['A: How can we include a new player?','B: We can explain the rules and invite them to join.',['B: We can hide the equipment.','B: We can explain the rules and invite them to join.','B: We can leave without saying anything.'],'Velg en inkluderende handling.'],
 ['A: I missed the last part. Did you say fifteen or fifty?','B: Fifteen. One-five.',['B: Fifteen. One-five.','B: It is a number.','B: My favourite number is six.'],'Svaret bør avklare akkurat det som var uklart.'],
 ['A: What would you change about the plan?','B: I would start earlier so we have more time.',['B: I would start earlier so we have more time.','B: We started yesterday.','B: The plan is on blue paper.'],'Velg et konkret endringsforslag.'],
 ] as [string,string,string[],string][];
 const tasks:Draft[]=scenes.map(([text,answer,choices,hint],i)=>c('Velg en respons som passer til situasjonen.',choices,answer,hint,answer,{text,reading:true,transfer:i>=8}));
 const sentences=[
 ['Jeg liker å lese fordi jeg lærer nye ting.','I like reading because I learn new things'],['Kan du forklare regelen en gang til?','Can you explain the rule again'],['Jeg foretrekker en rolig aktivitet i dag.','I prefer a quiet activity today'],['Vi kan møtes etter lunsj på lørdag.','We can meet after lunch on Saturday'],['Jeg vil gjerne lære mer om hvaler.','I would like to learn more about whales'],['Jeg er enig fordi planen gir oss mer tid.','I agree because the plan gives us more time'],['Jeg forstår ikke dette ordet ennå.','I do not understand this word yet'],['Vi kan invitere den nye spilleren til å bli med.','We can invite the new player to join'],
 ];
 tasks.push(...sentences.map(([no,en])=>b(`Bygg setningen «${no}» på engelsk.`,en,'Finn først hvem setningen handler om. Se etter en grunn eller tid til slutt.',{transfer:true})));
 tasks.push(order('Ordne en samtale der dere blir enige om en ny dag.',['A: Shall we meet on Friday?','B: I can’t on Friday. How about Saturday?','A: Saturday works. What time?','B: Let’s meet at ten.'],'Et nytt forslag må komme etter at den første dagen ikke passer.','Forslag → annen dag → spørsmål om tid → avtale.'));
 tasks.push(order('Ordne en samtale om et ukjent ord.',['A: What does shelter mean?','B: Read the next sentence. They stay dry under its roof.','A: So it is a place that protects them from rain.','B: Yes, that fits the text.'],'Forklaringen fra teksten kommer før slutningen.','Spørsmål → kontekst → tolkning → bekreftelse.'));
 tasks.push(order('Ordne samtalen om å inkludere en ny spiller.',['A: I would like to join, but I don’t know the rules.','B: I can explain them. First, choose a team.','A: Thank you. What do I do next?','B: Stand by the start line.'],'Se etter hvem som ber om hjelp og hvem som forklarer.','Be om å bli med → første instruksjon → oppfølgingsspørsmål → neste instruksjon.'));
 tasks.push(order('Ordne denne høflige uenigheten.',['A: I think we should play outside.','B: I see your point, but it is raining hard.','A: You’re right. Shall we play inside instead?','B: Yes, that sounds good.'],'Motargumentet får den første personen til å endre forslaget.','Forslag → hensyn til været → nytt forslag → enighet.'));
 tasks.push(o('Fortell en voksen om noe du pleier å gjøre, og noe du gjorde sist helg.','Prøv «I usually …» og «Last weekend I …». Be om hjelp ved behov.'));
 tasks.push(o('Planlegg en liten aktivitet på engelsk med en voksen. Avtal hva, hvor og når.','Prøv «How about …?», «Where shall we meet?» og «What time?».'));
 tasks.push(o('Forklar en spilleregel på engelsk til en voksen. La den voksne be om en avklaring.','Prøv «First …, then …». Appen vurderer ikke muntlig ferdighet automatisk.'));
 tasks.push(o('Øv på å være høflig uenig og gi en grunn.','Du kan bruke «I understand, but I think … because …». Flere formuleringer passer.'));
 return tasks;
}
function helpfulWords():Draft[]{
 const entries=[
 {text:'We sat under the shelter while rain drummed on its roof.',word:'shelter',meaning:'et sted som gir ly',options:['en åpen bok','et sted som gir ly','en type sko'],clue:'Tak og regn viser hva stedet beskytter mot.',q:'Skriv det engelske ordet i setningen som viser at lyet har et tak.',a:'roof'},
 {text:'The path was narrow, so we walked in a line instead of side by side.',word:'narrow',meaning:'smal',options:['smal','bratt','våt'],clue:'De kan ikke gå ved siden av hverandre.',q:'Skriv de engelske ordene som betyr «side om side» i setningen.',a:'side by side'},
 {text:'The tiny seed was smaller than a grain of rice.',word:'tiny',meaning:'veldig liten',options:['veldig tung','veldig høy','veldig liten'],clue:'Sammenligningen med et riskorn hjelper.',q:'Skriv det engelske ordet som betyr «frø» i setningen.',a:'seed'},
 {text:'The fragile model broke when it fell from the shelf.',word:'fragile',meaning:'lett å ødelegge',options:['lett å ødelegge','umulig å flytte','veldig varm'],clue:'Modellen går i stykker når den faller.',q:'Skriv det engelske ordet som betyr «hylle» i setningen.',a:'shelf'},
 {text:'Mia whispered so the sleeping baby would not wake up.',word:'whispered',meaning:'hvisket',options:['ropte','hvisket','lo høyt'],clue:'Stemmen må være lav for at babyen skal sove.',q:'Skriv det engelske ordet som betyr «baby» i setningen.',a:'baby'},
 {text:'After the long walk, we were exhausted and needed a rest.',word:'exhausted',meaning:'veldig slitne',options:['veldig sinte','veldig slitne','veldig våte'],clue:'De trenger hvile etter turen.',q:'Skriv det engelske ordet som betyr «hvile» i setningen.',a:'rest'},
 {text:'The pond was shallow. The water only reached our ankles.',word:'shallow',meaning:'grunn',options:['dyp','iskald','grunn'],clue:'Vannet rekker bare til anklene.',q:'Skriv det engelske ordet som betyr «vann» i setningen.',a:'water'},
 {text:'The curious child asked how the clock worked and looked carefully inside.',word:'curious',meaning:'nysgjerrig',options:['nysgjerrig','søvnig','redd for klokker'],clue:'Barnet spør hvordan noe virker.',q:'Skriv det engelske ordet som betyr «klokke» i setningen.',a:'clock'},
 {text:'The muddy boots left brown marks on the clean floor.',word:'muddy',meaning:'gjørmete',options:['nye','gjørmete','tørre'],clue:'Brune spor på gulvet gir et hint.',q:'Skriv det engelske ordet som betyr «gulv» i setningen.',a:'floor'},
 {text:'We postponed the picnic until Sunday because the storm made Saturday unsafe.',word:'postponed',meaning:'utsatte til senere',options:['avlyste for alltid','begynte tidligere','utsatte til senere'],clue:'Turen flyttes fra lørdag til søndag.',q:'Skriv den nye dagen for pikniken på engelsk.',a:'Sunday'},
 {text:'Please return the borrowed book by Friday so someone else can read it.',word:'return',meaning:'levere tilbake',options:['levere tilbake','tegne i','gjemme bort'],clue:'Boken er lånt og skal kunne leses av noen andre.',q:'Skriv fristen, altså dagen i setningen, på engelsk.',a:'Friday'},
 {text:'The sign was visible from the gate, so visitors could easily see where to go.',word:'visible',meaning:'mulig å se',options:['mulig å se','vanskelig å åpne','lett å høre'],clue:'Besøkende kan se skiltet fra porten.',q:'Skriv det engelske ordet som betyr «port» i setningen.',a:'gate'},
 ];
 const tasks:Draft[]=[];
 entries.forEach((e,i)=>{const extra={text:e.text,reading:true,evidenceGroup:`e4-context-${i}`,transfer:i>=8};tasks.push(c(`Hva betyr «${e.word}» mest sannsynlig her?`,e.options,e.meaning,e.clue,`Her betyr «${e.word}» «${e.meaning}».`,extra));tasks.push(w(e.q,e.a,'Finn ordet eller uttrykket i teksten.',`Svaret er «${e.a}».`,extra));});
 tasks.push(m('Koble ord og forklaring.',pairs([['borrow','take something for a time and give it back'],['return','give something back'],['lend','let someone use something for a time']]),'«Borrow» er låne av noen. «Lend» er låne bort.'));
 tasks.push(m('Koble ordene som betyr omtrent det samme.',pairs([['tiny','very small'],['exhausted','very tired'],['quiet','not noisy']])));
 tasks.push(s('Hvilke to strategier kan hjelpe med et ukjent ord?',['Read the surrounding sentences','Check a dictionary','Always guess from the first letter only','Stop reading every time'],['Read the surrounding sentences','Check a dictionary'],'Bruk mening og en kilde du kan undersøke.','Kontekst og ordbok kan brukes sammen.'));
 tasks.push(s('En miniordbok sier «bank: 1) a place for money, 2) the side of a river». Hvilke to setninger bruker betydning 2?',['We sat on the river bank.','She put money in the bank.','The boat reached the bank.','The bank gave him a card.'],['We sat on the river bank.','The boat reached the bank.'],'Se etter elv og båt.','Setningene om elv og båt handler om bredden ved vannet.'));
 return tasks;
}

function writeMessage():Draft[]{
 const messages=[
 {greeting:'Hello, Jo!',body:'Would you like to play chess on Saturday? Please tell me if you can come.',signoff:'From Sam',q:'Hva er hensikten med beskjeden?',options:['Å invitere til sjakk','Å forklare en oppskrift','Å melde fra om en mistet ting'],answer:'Å invitere til sjakk',no:'Vil du spille sjakk på lørdag?',en:'Would you like to play chess on Saturday',own:'Skriv en invitasjon til en oppdiktet aktivitet. Ta med aktivitet og dag.'},
 {greeting:'Dear Kim,',body:'Thank you for helping me find my book. I was happy to read it again.',signoff:'From Alex',q:'Hva takker Alex for?',options:['Hjelp til å finne en bok','En ny sykkel','En invitasjon til kino'],answer:'Hjelp til å finne en bok',no:'Takk for at du hjalp meg.',en:'Thank you for helping me',own:'Skriv en takkebeskjed til en oppdiktet person. Fortell hva du takker for.'},
 {greeting:'Hello, Lee!',body:'I am sorry I broke your pencil. I can bring you a new one tomorrow.',signoff:'From Pat',q:'Hva gjør Pat i beskjeden?',options:['Inviterer til en tur','Sier unnskyld og tilbyr å rette opp','Ber om et nytt spill'],answer:'Sier unnskyld og tilbyr å rette opp',no:'Jeg kan ta med en ny blyant i morgen.',en:'I can bring a new pencil tomorrow',own:'Skriv en beskjed der en oppdiktet figur sier unnskyld og foreslår å rette opp.'},
 {greeting:'Hi, team!',body:'Our practice starts at five in the school hall. Please bring water and indoor shoes.',signoff:'From Coach Ali',q:'Hvilken viktig informasjon gir beskjeden?',options:['Tid, sted og hva man skal ta med','Bare navnet på treneren','Prisen på en billett'],answer:'Tid, sted og hva man skal ta med',no:'Ta med vann og innesko.',en:'Please bring water and indoor shoes',own:'Skriv en kort beskjed om en oppdiktet øving. Ta med tid, sted og utstyr.'},
 {greeting:'Hello, class!',body:'A blue water bottle was found by the door. Please ask an adult at the school office if it is yours.',signoff:'From the school office',q:'Hva bør eieren av flasken gjøre?',options:['Spørre en voksen på skolekontoret','Kaste flasken','Kjøpe en ny dør'],answer:'Spørre en voksen på skolekontoret',no:'En blå vannflaske ble funnet ved døren.',en:'A blue water bottle was found by the door',own:'Skriv en beskjed om en oppdiktet funnet ting. Beskriv den og et trygt sted å spørre etter den.'},
 {greeting:'Dear Jo,',body:'Could you explain the last homework question? I understand the first part, but I am not sure what to do next.',signoff:'From Rowan',q:'Hva trenger Rowan hjelp med?',options:['Den siste lekseoppgaven','Å finne sykkelen','Å velge klær'],answer:'Den siste lekseoppgaven',no:'Kan du forklare det siste spørsmålet?',en:'Could you explain the last question',own:'Skriv en høflig forespørsel om hjelp til en oppdiktet oppgave. Si hva som er uklart.'},
 {greeting:'Hi, Maya!',body:'I cannot meet at the park because I have a cold. Could we meet next weekend instead?',signoff:'From Noa',q:'Hvorfor foreslår Noa en ny helg?',options:['Noa er forkjølet','Parken har en ny benk','Maya har bursdag'],answer:'Noa er forkjølet',no:'Kan vi møtes neste helg i stedet?',en:'Could we meet next weekend instead',own:'Skriv en beskjed der en oppdiktet avtale flyttes. Gi en grunn og foreslå en ny dag.'},
 ];
 const tasks:Draft[]=[];
 messages.forEach((msg,i)=>{
 const text=[msg.greeting,msg.body,msg.signoff].join('\n');const group=`e4-message-${i}`;
 tasks.push(c(msg.q,msg.options,msg.answer,'Finn delen som forteller hvorfor beskjeden er skrevet.',`Beskjeden forteller: ${msg.answer}.`,{text,reading:true,evidenceGroup:group,transfer:i>4}));
 tasks.push(order('Ordne beskjedens tre deler: hilsen først, innhold i midten og avsender til slutt.',[msg.greeting,msg.body,msg.signoff],'Se etter hilsenen og hvem beskjeden er fra.','En leser får først en hilsen, så selve beskjeden, og til slutt hvem den er fra.',{evidenceGroup:group}));
 tasks.push(b(`Bygg setningen «${msg.no}» på engelsk.`,msg.en,'Begynn med stor bokstav og bruk alle brikkene.',{evidenceGroup:group}));
 tasks.push(o(msg.own,'Bruk en hilsen, en tydelig beskjed og en avslutning. Ikke skriv ekte adresse eller telefonnummer.'));
 });
 return tasks;
}
function aroundWorld():Draft[]{
 const stories:Story[]=[
 {text:'Hi! I am Asha. My family lives in London. At home we speak English and Gujarati. My friend speaks English and Polish at home. We like teaching each other a few words.',questions:[['Hva viser teksten om språk hjemme?',['Familier kan bruke flere språk','Alle i London snakker bare engelsk','Alle familier bruker de samme språkene'],'Familier kan bruke flere språk','Sammenlign Ashas familie og vennens familie.'],['Hvilket språk bruker begge familiene i teksten?',['English','Gujarati','Polish'],'English','Finn språket som nevnes hos begge.']]},
 {text:'Hello from Wellington! My name is Ari. At our school, some people greet each other with “hello” and some say “kia ora”, a greeting in te reo Māori. I am learning when and how to use both respectfully.',questions:[['Hva er «kia ora» i denne teksten?',['En hilsen på te reo Māori','Navnet på et engelsk spill','Et ord for regnjakke'],'En hilsen på te reo Māori','Teksten forklarer uttrykket.'],['Hvilken by nevner Ari?',['Wellington','London','Dublin'],'Wellington','Les den første setningen.']]},
 {text:'I am Ben in Canada. I write the word “colour” in my school notebook. My cousin in the United States writes “color”. The spelling is different, but we understand the same meaning.',questions:[['Hva viser «colour» og «color» her?',['To skrivemåter med samme betydning','To helt ulike farger','At bare ett ord kan forstås'],'To skrivemåter med samme betydning','Les hva Ben sier om betydningen.'],['Hvilken skrivemåte bruker Ben i notatboken?',['colour','color','coler'],'colour','Se etter ordet Ben selv skriver.']]},
 {text:'My name is Siti. I live in Singapore. I use English with some friends and Malay with my grandparents. My neighbour uses other languages. The language I choose depends on who I am talking to.',questions:[['Hva påvirker språket Siti velger?',['Hvem hun snakker med','Bare været','Bare ukedagen'],'Hvem hun snakker med','Les den siste setningen.'],['Hvilket språk bruker Siti med besteforeldrene i teksten?',['Malay','Polish','French'],'Malay','Finn setningen om grandparents.']]},
 {text:'Hello! I am Tessa. My friend calls our game “football”, and my cousin calls the same game “soccer”. We all mean the game where players kick a ball and try to score goals.',questions:[['Hva mener de med «football» og «soccer» her?',['Den samme sporten','To ulike bøker','To ulike værtyper'],'Den samme sporten','Teksten sier «the same game».'],['Hva prøver spillerne å score?',['Goals','Books','Tickets'],'Goals','Les den siste delen.']]},
 {text:'Dear friends, our class received an invitation dated 04/05. Some readers thought it meant 4 May, and others thought it meant 5 April. We asked the sender to write the month in words.',questions:[['Hvorfor ba klassen om måneden skrevet med bokstaver?',['Datoen kunne tolkes på to måter','De kunne ikke lese noen tall','De ville endre navnet på måneden'],'Datoen kunne tolkes på to måter','Sammenlign de to datoene leserne tenkte på.'],['Hvilket ord i teksten betyr «måned»?',['month','sender','class'],'month','Se etter det klassen ba avsenderen skrive.']]},
 {text:'I am Finn in Ireland. In my family, we enjoy telling stories after dinner. My neighbour prefers drawing stories as comics. Our families have different habits, even though we live on the same street.',questions:[['Hva kan vi si sikkert ut fra teksten?',['Disse to familiene har ulike vaner','Alle i Ireland forteller historier etter middag','Alle på gaten tegner tegneserier'],'Disse to familiene har ulike vaner','En historie om to familier gjelder ikke automatisk alle.'],['Hva liker naboen å tegne?',['Comics','Maps','Tickets'],'Comics','Finn det naboen foretrekker.']]},
 {text:'Hello from South Africa! I am Lindi. My class has made a welcome poster using several languages spoken by people in our school. We ask each person to check the words they contributed before we display it.',questions:[['Hvorfor får bidragsyterne sjekke ordene?',['For å hjelpe med at ordene blir riktige','For å velge den største bokstaven','For å fjerne alle språkene'],'For å hjelpe med at ordene blir riktige','Tenk på hvorfor noen kontrollerer egne språkbidrag.'],['Hva lager klassen?',['A poster','A boat','A clock'],'A poster','Les setningen om hva klassen har laget.']]},
 {text:'I am Mei in Australia. It is warm where I live in December. My pen pal in Norway says it is cold where she lives then. We compare our local weather instead of assuming it is the same everywhere.',questions:[['Hva sammenligner brevvennene?',['Været der de selv bor','Alle verdens skoler','Antall bøker de eier'],'Været der de selv bor','De forteller om varmt og kaldt.'],['Hvilken måned nevnes?',['December','June','April'],'December','Se etter navnet på måneden.']]},
 {text:'At our English club, we read a story from another country. Before talking about it, we ask who wrote it and whose experiences it describes. One story can show one person’s life without describing everyone in a country.',questions:[['Hvorfor undersøker klubben hvem historien handler om?',['Én persons erfaring gjelder ikke nødvendigvis alle','Alle i et land har samme erfaring','Bare lange historier kan være sanne'],'Én persons erfaring gjelder ikke nødvendigvis alle','Les den siste setningen.'],['Hva leser klubben?',['A story','A timetable','A recipe'],'A story','Se etter teksten de har valgt.']]},
 {text:'Hi! I am Sam. When I visit my friend’s home, I ask whether to take off my shoes. Different homes can have different rules. Asking politely helps me understand what the family prefers.',questions:[['Hva hjelper Sam å forstå familiens ønske?',['Å spørre høflig','Å anta at alle hjem er like','Å ignorere familiens svar'],'Å spørre høflig','Les hva Sam gjør når han kommer på besøk.'],['Hva spør Sam om å ta av?',['Shoes','Gloves','A hat'],'Shoes','Finn tingen i spørsmålet hans.']]},
 {text:'Our class made a video greeting for another school. Some children spoke, some wrote subtitles, and some used drawings. We wanted more people to understand our message, so we used several ways to share it.',questions:[['Hvorfor brukte klassen flere uttrykksmåter?',['For at flere skulle forstå','For å skjule beskjeden','For å gjøre alt umulig å lese'],'For at flere skulle forstå','Se etter hensikten i siste setning.'],['Hva skrev noen av barna til videoen?',['Subtitles','Shopping lists','Addresses'],'Subtitles','Finn det noen av barna skrev.']]},
 ];
 const tasks=storyPack(stories,'e4-world');
 tasks.push(m('Koble uttrykk som kan vise samme betydning.',pairs([['colour','color'],['football, in the game described','soccer'],['hello','en hilsen']]),'Noen ord har ulike skrivemåter eller brukes forskjellig ulike steder. Se på sammenhengen.'));
 tasks.push(m('Koble en kildevane med hvorfor den er nyttig.',pairs([['Ask who wrote the story','Understand whose experience it shows'],['Write the month in words','Make a date clearer'],['Ask about a home’s rules','Avoid assuming all homes are the same']])));
 tasks.push(o('Velg en av brevene og fortell en voksen én ting du lærte og ett spørsmål du vil stille.','Bruk gjerne engelsk: «I learned …» og «I wonder …». Dette er samtaleøving.'));
 tasks.push(o('Lag en kort engelsk velkomsthilsen med tegning, tekst eller muntlig sammen med en voksen.','Velg hvem hilsenen er til, og hvordan mottakeren best kan forstå. Ingen automatisk vurdering av uttale eller fri tekst.'));
 return tasks;
}

export function englishTasksV2(grade:number,moduleIndex:number):Task[]{
 const factories=[
  [wordsAround,listenDo,firstTalk,littleStory],
  [knownWords,followInstructions,askAnswer,readWrite],
  [smallTalk,smallAdventure,readDiscover,ownSentences],
  [everydayLife,helpfulWords,writeMessage,aroundWorld],
 ];
 const factory=factories[grade-1]?.[moduleIndex];
 if(!factory)return [];
 return factory().map((task,index)=>({...task,id:`v2-e-${grade}-${moduleIndex}-${index}`,version:2,lang:'en-GB'}));
}
