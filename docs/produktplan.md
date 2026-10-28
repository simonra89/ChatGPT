# Læringsreisen – plan for en læringsapp for 1.–4. trinn

Dato: 28. oktober 2026. Arbeidsnavn: Læringsreisen.

## 1. Hva vi skal bygge

En rolig, leken mobilapp der et barn kan øve på norsk, matematikk og engelsk på en forelders telefon. Hovedeksempelet er en elev i 2. klasse. Første ferdige versjon skal ha brukbart innhold i alle tre fag på 1.–4. trinn.

Appen skal hjelpe barnet med å forstå, øve, huske og bruke det han lærer. En god økt skal ende med en konkret opplevelse: «Nå skjønner jeg hvordan jeg kan dele opp 8 + 5» eller «Nå kan jeg spørre om noe på engelsk».

Den skal være et supplement til skole, bøker, håndskrift, samtaler og praktisk arbeid. Noen deler av fagene øves derfor sammen med en voksen eller med ting hjemme. Appen skal skille mellom hva den selv har observert, og hva barnet bare har fått anledning til å øve på.

### Arbeidsvalg

- Bokmål er hovedmål i den første innholdspakken. Nynorske tekster og språkmøter inngår der de passer. En full nynorsk hovedmålspakke krever egen språklig kvalitetssikring.
- Stående mobilformat er hovedformatet. Barnet skal kunne navigere med lite lesing og få instruksjoner lest opp.
- Økter på omtrent 5 eller 10 minutter er et utgangspunkt som testes med barnet, ikke en forskningsfastsatt optimal varighet.
- Ett hovedfag per økt gir plass til forklaring og øving. Barnet kan også velge en blandet repetisjonsøkt.
- Forelderen velger startnivå og kan prioritere det klassen arbeider med denne uken.
- Vanlig bruk skal fungere uten konto. Flere lokale barneprofiler gjør det mulig å bruke samme telefon med søsken.

## 2. Læreplan og pedagogisk grunnlag

Planen er kontrollert mot Udirs gjeldende læreplaner fra 1. august 2026: norsk NOR01-08, matematikk MAT01-06 og engelsk ENG01-06. Norsk og engelsk har kompetansemål etter 2. og 4. trinn. Matematikk har mål etter 2., 3. og 4. trinn i den aktuelle aldersgruppen. Fordelingen mellom 1. og 2. trinn, og mellom 3. og 4. trinn i språkfagene, er dermed en foreslått progresjon for appen. Den enkelte skoles arbeidsplan kan følge en annen rekkefølge. [1–7, 11–13]

Læreplanene bestemmer retningen. De bestemmer ikke en ferdig oppgaverekkefølge eller et bestemt tallområde for hvert nivå. Tallgrenser, tekstlengder og repetisjonsregler nedenfor er produktvalg som må prøves og justeres.

### Prinsipper som skal merkes i selve appen

| Prinsipp | Konsekvens for appen |
| --- | --- |
| Vis først, øv sammen, prøv selv | Nye ferdigheter starter med en kort modell og gradvis mindre hjelp. |
| Hent fram det du har lært | Barnet får forsøke å huske før forklaringen vises, og møter stoffet igjen senere. |
| Fordel øvingen | En ferdighet kommer tilbake på senere bruksdager, med variasjon i eksemplene. |
| Knytt modeller til symboler | En mengde, en tegning og et regnestykke viser samme matematiske idé. |
| Arbeid med mening | Ord brukes i tekster, regning i situasjoner og engelsk i små kommunikative oppdrag. |
| Gi konkret hjelp | Tilbakemeldingen peker på et nyttig steg barnet kan prøve. |
| Gi rom for egen produksjon | Barnet bygger ord, lager uttrykk, skriver og forteller; flervalg brukes som støtte. |
| Bruk ferdigheten i nye sammenhenger | Noen oppgaver endrer situasjon eller svarform, slik at gjentatt gjetting ikke ser ut som læring. |

Prinsippene om repetisjon, gjenhenting, modeller og forklaringer støttes av IES' forskningsbaserte veiledning. Veiledningene om lesing og matematikk gir også støtte til systematisk arbeid med avkoding og representasjoner. Dette begrunner utformingen; det dokumenterer ikke effekten av denne appen. Flere av veiledningene gjelder engelskspråklig skole eller målrettet støtteundervisning, og overføring til norsk hjemmebruk må vurderes. [8–10]

## 3. Hvordan appen skal se ut

En liten oppdagelsesverden med en vennlig figur, for eksempel en rev eller ugle. Miljøet kan ha en skog, et verksted og en liten landsby. Fortellingen gir oppgavene sammenheng, men skjermen skal prioritere det barnet skal lære.

Tre tydelige fagkort bruker både ikon, navn og farge. Barnet skal kunne kjenne igjen fagene uten å være avhengig av fargesyn. Ett trykk skal være nok til å starte en anbefalt økt.

| Skjerm | Hva barnet ser | Hovedhandling |
| --- | --- | --- |
| Velg profil | Avatar og kallenavn | Velg meg |
| Hjem | «Dagens oppdrag», tre fagkort og «Øv på noe» | Start en kort økt |
| Fag | Anbefalt aktivitet og et lite utvalg temaer | Velg hva jeg vil øve på |
| Oppgave | Ett spørsmål, relevant bilde/modell, lydknapp og få tydelige svarmuligheter | Prøv, få hjelp eller hopp over |
| Oppsummering | En konkret ting barnet har øvd på og en liten endring i oppdagelsesverdenen | Ferdig for i dag |
| Voksenområde | Nivåvalg, ukens tema, observasjoner og innstillinger | Tilpass neste økt |

På hjemmeskjermen kan det for eksempel stå: «I dag bygger vi med tiere. Vil du bli med?» Under står en stor startknapp og fagkortene «Norsk», «Matte» og «Engelsk».

### Krav til mobilopplevelsen

- Store trykkflater, med 48–56 CSS-piksler som praktisk designmål og god avstand mellom svar.
- Stor, tydelig tekst og rolig bakgrunn. Tekstmengden må passe skjermbredden; del heller en aktivitet i flere steg.
- Hele det norske alfabetet, inkludert æ, ø og å, må fungere i brikker, tastatur, skrift og lyd. Norske oppgaver bruker relevante norske begreper, kroner, måleenheter og klokkeformater.
- Enkle setninger i instruksjoner, konsekvente symboler og knapp for å høre instruksjonen igjen.
- Både trykk og dra-og-slipp når en oppgave innebærer flytting. Presis dragging skal ikke være et læringskrav.
- Ingen nedtelling i vanlig øving. Lesefart og raske trykk skal ikke styre nivåvalg.
- Barnet kan be om hjelp, ta pause eller avslutte. Neste oppstart fortsetter fra et naturlig sted.
- Lyd og små animasjoner kan slås av. Unødvendig bevegelse reduseres ved redusert bevegelse i systeminnstillingene.
- Klart skille mellom faglig lyd som trengs i en lytteoppgave, og pyntelyd som alltid kan slås av.

## 4. Nivåene

Forelderen velger 1.–4. trinn separat i hvert fag. Dette gir et startpunkt for anbefalinger. Under hvert fag ligger mindre ferdigheter med egne forutsetninger og egen progresjon.

Eksempel: En elev i 2. klasse kan lese tekster fra appens nivå 3, arbeide med regning på nivå 2 og begynne med engelsk muntlighet på nivå 1. Innen matematikk kan eleven samtidig være trygg på telling og trenge støtte i plassverdi.

I barnets visning brukes navn som «Lyder og ord», «Tallverkstedet» og «Snakk og lytt». Klassetrinnene finnes i voksenområdet og som et valgfritt nivåvalg. Barnet skal slippe meldinger om å være «bak» et klassetrinn.

Alle trinn skal være tilgjengelige gjennom manuelt valg. Appen kan foreslå et forkunnskapsoppdrag, men skal ikke låse et barn ute fra et helt fagområde.

### Foreslått faglig progresjon

Tabellen beskriver hovedretningene, ikke en uttømmende liste over læreplanmål.

| Trinn | Norsk | Matematikk | Engelsk |
| --- | --- | --- | --- |
| 1 | Språklek, bokstav–lyd, sammentrekking, enkle ord og egne skriveforsøk. Samtale om fortellinger. | Mengder og del–helhet, telling, enkle pluss/minus-situasjoner, former, mønstre og praktisk sammenligning. | Lytte, peke, gjøre og si kjente ord og korte uttrykk. Bildehistorier og språklek. |
| 2 | Sikrere ordlesing, korte sammenhengende tekster, forståelse, staving og små setninger. | Plassverdi, regnestrategier, likhet, tallinje, måling og tid. | Enkle spørsmål, svar og instruksjoner, språklyder og begynnende lesing og skriving av kjent språk. |
| 3 | Leseflyt, ordmønstre, gjenfortelling, forståelse og korte tekster med sammenheng. | Multiplikasjon som like grupper, sammenhenger mellom uttrykk, areal, koordinater og instruksjoner. | Små dialoger, korte tekster og egne setninger med støtte. |
| 4 | Mer selvstendig lesing og skriving, tekstbegrunnelser, språkutforsking og muntlig formidling. | Divisjon på to måter, sammenhenger mellom regneartene, modellering, romfigurer, volum og algoritmer. | Mer selvstendig kommunikasjon, leseforståelse, korte egne tekster, ordbok og kulturmøter. |

Norsk bygger på [1–2], matematikk på [3–5] og engelsk på [6–7]. Høyere trinn skal også vedlikeholde tidligere ferdigheter.

## 5. Norsk: lesing, skriving og muntlighet

### Aktiviteter

1. **Hør og finn.** Lytt etter en bestemt lyd eller et rim, og knytt språklyden til bokstaven.
2. **Trekk sammen.** Se bokstaver og hør hvordan lydene blir til et ord. Barnet prøver deretter på et nytt ord med kjente forbindelser.
3. **Bygg ord.** Sett sammen bokstavbrikker og skriv etter hvert selv. Brikkene kan trekkes eller velges ved trykk.
4. **Les en liten tekst.** En kort, sammenhengende historie med et spørsmål om innholdet.
5. **Finn og forklar.** Pek på delen av teksten som støtter et svar, ordne hendelser eller fortell hva som skjedde.
6. **Lag noe selv.** Skriv en setning, lag en liten bok med bilder eller fortell til en voksen.

Ved sammentrekking brukes bokstavlyder, med korrekt artikulasjon og uten at bokstavnavn erstatter dem. Innleste, kvalitetssikrede lydklipp brukes til enkeltlyder og sammentrekking. Vanlig talesyntese kan brukes til instruksjoner etter lytting og kontroll. Statped fremhever skillet mellom bokstavlyd og bokstavnavn og gradvis overgang fra modellering til selvstendig arbeid. [14]

Ordutvalget starter med forbindelser barnet kjenner. Flere bokstaver, konsonantforbindelser og sammensatte grafemer introduseres gradvis. Kjente småord kobles også til lyd og stavemønster. Appen skal ikke lære barnet å basere ordlesing på første bokstav og et bilde.

Tekstforståelse øves fra starten gjennom både høytlesing og barnets egen lesing. En god høytlesingstekst kan være språklig rikere enn teksten barnet skal lese selv. Lytteforståelse og selvstendig lesing registreres som ulike aktiviteter. Sammenhengen mellom lydarbeid, ordlesing og sammenhengende tekst er også støttet av leseveiledningen fra IES. [8]

### Eksempel for 2. klasse

Barnet leser: «Maja tar på støvlene. Det regner ute.» Appen spør: «Hvorfor tar Maja på støvlene?» Senere følger en ny kort tekst der barnet må bruke samme type forståelse.

Knappen «Hør teksten» er tilgjengelig som støtte. Bruk av opplesning registreres, slik at et godt svar etter lytting ikke alene blir tolket som selvstendig lesemestring. Instruksjoner kan alltid leses opp uten slik faglig konsekvens.

I skriveoppgaver skal barnet få én tydelig tilbakemelding om gangen. I åpne tekster brukes en enkel sjekkliste og eventuell voksenrespons. Alle kreative svar skal ikke kontrolleres mot én forhåndsskrevet fasit.

### Fordeling av innhold

- **1.–2. trinn:** sammenhengen mellom lyd og skrift, ord og korte tekster; egen setningsskriving; muntlig fortelling og lek. [1]
- **3.–4. trinn:** gradvis større tekstutfordringer, begrunnelse og egen produksjon. Utvalgte aktiviteter arbeider med ordklasser, setninger, tegnsetting, fakta/meninger og møter med bokmål, nynorsk og oversatte tekster. [2]
- **Utenfor skjermen:** håndskrift med blyant, lese en bok sammen, velge bok på biblioteket og samtale om en tekst. Registreres som gjennomført aktivitet, ikke automatisk dokumentert mestring.

## 6. Matematikk: forstå, representer og forklar

### Aktiviteter

1. **Bygg mengden.** Bruk prikker, femmer-/tierrammer og brikker til å se del–helhet og sammenligne.
2. **Tallverksted.** Bytt ti enere til én tier og gå mellom modeller og tall.
3. **Hopp på tallinjen.** Vis regnestrategier og prøv dem på nye oppgaver.
4. **Like mye.** Fyll inn manglende tall og lag uttrykk med samme verdi, for eksempel 3 + 4 = 5 + 2.
5. **Grupper og del.** Bygg multiplikasjon og begge betydningene av divisjon med konkrete situasjoner.
6. **Løs et hverdagsoppdrag.** Velg relevant informasjon, bygg en modell og vurder om svaret gir mening.

Tallinje, gjennomtenkte visuelle modeller og arbeid med tekstoppgaver har støtte i IES' matematikkveiledning. Appens bruk av disse må tilpasses situasjonen; en visualisering skal hjelpe barnet å forstå noe konkret. [9]

### Eksempel for 2. klasse: 8 + 5

Først ser barnet åtte brikker i en tierramme og fem ved siden av. Modellen viser at to av de fem kan fylle opp til ti. Deretter gjenstår tre: 8 + 2 + 3 = 13. Barnet prøver samme strategi med et nytt regnestykke og velger eller viser hvordan tallet deles.

Et feilsvar møtes med et relevant hint: «Hvor mange mangler i rammen for å få ti?» Etter en demonstrasjon får barnet en lignende, ny oppgave. En demonstrert løsning skal ikke registreres som en selvstendig riktig besvarelse.

### Fordeling av innhold

- **1. trinn:** start gjerne med 0–10 og utvid mot 20 etter behov; mengder, del–helhet, enkle regnesituasjoner, former og mønstre.
- **2. trinn:** fleksibel regning og plassverdi; tallområder kan utvides fra 20 mot 100 og videre ut fra ferdigheten. Ta med likhet, måling av lengde og masse, klokke og kalender. Penger brukes i meningsfulle situasjoner sammen med tydelige plassverdimodeller. [3]
- **3. trinn:** multiplikasjon, regneegenskaper, sammenligning og balanse, areal som dekking og rutenett med koordinater. [4]
- **4. trinn:** både «12 delt likt på tre» og «hvor mange grupper på tre er det i 12», regneartenes sammenhenger, overslag og modeller, figurer og volum. Enkle kodeoppdrag bruker etter hvert løkker, vilkår og variabler. [5]

Tallgrensene er justerbare oppgaveparametere. Brøk og andre ekstraområder kan komme som utvidelser etter egen læreplankontroll; de skal ikke fortrenge de prioriterte målene over.

Tekstoppgaver skal ha opplesning slik at leseferdighet ikke alene avgjør matematikkresultatet. Det skal også finnes oppgaver med flere mulige løsninger og muntlige «Hvordan tenkte du?»-oppdrag til en voksen.

## 7. Engelsk: forstå og bruke språk

### Aktiviteter

1. **Listen and find.** Hør et ord eller en frase og finn riktig bilde eller situasjon.
2. **Listen and do.** Følg enkle instruksjoner med figurer på skjermen eller gjennom bevegelse hjemme.
3. **Say it.** Hør en tydelig språkmodell og prøv selv. Mikrofon er ikke nødvendig.
4. **Small talk.** Øv på dialoger som «Can I have an apple, please?» og et passende svar.
5. **Read and discover.** Les korte tekster med lyd og bilde som justerbar støtte.
6. **Make a message.** Bygg og skriv egne utsagn med gradvis mindre hjelp.

Lytting, muntlig samhandling, lyd–skrift og gradvis lesing og skriving inngår i læreplanen tidlig. Derfor bør også appen tilby flere innganger til språket. [6–7]

### Eksempel for 2. klasse

En figur sier «Put the red ball in the box». Barnet velger riktig ball og riktig sted. I neste aktivitet spør figuren «What do you like?» Barnet prøver å svare «I like …» og kan høre et eksempel på nytt.

Å kjenne igjen ordet «ball» i et flervalg er én observasjon. Å forstå en instruksjon eller bruke uttrykket i en ny dialog gir en annen type informasjon. Appen skal holde dette atskilt.

### Fordeling av innhold

- **1. trinn:** kjente temaer som dyr, farger, kropp og ting hjemme; korte fraser med tydelig mening.
- **2. trinn:** spørsmål og svar, høflige uttrykk, instruksjoner og enkle historier; begynnende lesing av kjent språk. [6]
- **3. trinn:** dialoger med flere turer, korte tekster og setningsrammer som åpner for egne valg.
- **4. trinn:** mer selvstendig samtale og tekst, enkel språkutforsking, bruk av ordbok og møter med ulike engelskspråklige levemåter. [7]

Engelsk får egne lydmodeller og egne lyd–skrift-eksempler. Norske uttaleregler skal ikke brukes som fasit for engelsk.

Muntlig aktivitet uten voksenobservasjon merkes «øvd på». Appen skal ikke erklære at barnet kan uttalen basert på at han trykker «ferdig». En senere opptaksfunksjon må være valgfri; automatisk uttalevurdering inngår ikke i førsteversjonen.

## 8. Slik fungerer en økt

### Forslag til omtrent ti minutters økt

| Del | Innhold | Hensikt |
| --- | --- | --- |
| Kom i gang | To korte oppgaver fra tidligere øving | Hente fram og observere |
| Se et eksempel | En kort demonstrasjon av dagens ferdighet | Forstå hva som skal læres |
| Prøv med støtte | To oppgaver med tilgjengelige steg og modeller | Få hjelp til en nyttig strategi |
| Prøv selv | Tre varierte oppgaver | Observere mer selvstendig bruk |
| Bruk det på en ny måte | Ett oppdrag med endret situasjon eller svarform | Undersøke overføring |
| Avslutt | En konkret oppsummering og eventuelt et familieoppdrag | Avslutte på et naturlig sted |

Dette gir åtte svaroppgaver og én demonstrasjon. Antallet tilpasses oppgavetypen: en lesetekst kan oppta flere minutter og erstatte flere småoppgaver. Klokken skal ikke avbryte et barn midt i en god aktivitet.

En femminutters økt bruker færre steg eller repeterer en kjent ferdighet. Blandede økter brukes særlig til vedlikehold etter at barnet har møtt stoffet i en mer samlet sekvens.

### Hjelp ved feil eller usikkerhet

Først gis et konkret hint. Deretter kan barnet få en tydeligere modell. Ved behov viser appen et gjennomarbeidet eksempel og tilbyr et nytt, enklere forsøk eller en annen aktivitet. To feil i samme mønster kan utløse tilbud om mer støtte, men skal ikke alene føre til at et helt nivå senkes.

Det skal være like lett å be om hjelp som å svare. Ikke bruk tap av liv, rød blinkende skjerm eller negative lyder.

## 9. Tilpasning og repetisjon

### En enkel første regelmotor

1. Forelderen velger starttrinn per fag og eventuelt ett aktuelt tema.
2. De første korte øktene inneholder noen enkle sjekkoppgaver rundt startpunktet. Dette er ikke en diagnostisk test.
3. Appen velger en aktuell ferdighet, noe fra tidligere øving og eventuelt en forkunnskap som trenger støtte.
4. Den justerer støtte, eksempeltype og vanskelighetsgrad innen ferdigheten.
5. Ferdigheter tas fram igjen på senere bruksdager. Et mulig utgangspunkt er etter omtrent 1, 3, 7 og 14 dager; en uteblitt økt gir ingen straff eller oppgavegjeld.

Intervallene er startverdier. Prinsippet om fordelt repetisjon og aktiv gjenhenting har støtte i [10]; akkurat denne tidsplanen og grenseverdiene er ikke validert for appen.

### Hvordan fremgang registreres

- **Ikke prøvd:** for lite informasjon.
- **Øver med støtte:** barnet arbeider med ferdigheten og bruker faglig hjelp.
- **Får til selv i appen:** flere uavhengige observasjoner tyder på at barnet klarer akkurat denne oppgavetypen.
- **Til repetisjon:** tidligere læring skal hentes fram på nytt.

En mulig terskel for «får til selv i appen» er minst 8 riktige førsteforsøk av de siste 10 kvalifiserte forsøkene, fordelt over minst to forskjellige dager og varierte eksempler. Minst én oppgave skal endre kontekst eller representasjon. Når ferdigheten egner seg for det, brukes mer enn én svarform. En senere oppgave uten faglig hjelp kontrollerer vedlikehold før appen reduserer øvingen mye.

Et kvalifisert forsøk er et reelt førsteforsøk på et selvstendig eksempel. Å se fasiten, svare igjen på samme oppgave eller gjenta identiske oppgaver skal ikke produsere nye mestringsobservasjoner. Ti oppgaver generert fra samme smale mal gir heller ikke grunnlag for brede påstander om faget.

Instruksjonslyd og tilgjengelighetstilpasninger skal ikke generelt redusere fremgang. Det er støtte som endrer den målte ferdigheten som må registreres særskilt, for eksempel opplesning av selve teksten ved vurdering av egenlesing.

Muntlighet, håndskrift og åpne tekster har egne regler: «øvd på» og eventuell voksenobservasjon holdes atskilt fra automatiske svarresultater. Appen skal ikke vise én samlet «prosent ferdig med 2. klasse».

## 10. Motivasjon og voksenområde

### For barnet

Barnet kan velge figur og noen interesser. Interessen påvirker situasjonene rundt faginnholdet: samme regneidé kan handle om fotballer, dyr eller romskip. Den faglige vanskelighetsgraden følger ferdigheten.

Etter en økt kan figuren bygge litt videre på et hus eller oppdage et nytt sted. Belønningen skal være forutsigbar og liten. Vis konkrete faglige fremskritt: «Du brukte tierrammen til å finne svaret». Barnet kan selv velge å avslutte uten tap av opparbeidet fremgang.

Førsteversjonen skal være uten topplister, daglige tapsrekker, tilfeldige belønningskasser, reklame og kjøp i barnets flyt. Målet for utformingen er at barnet vil prøve og får en god avslutning.

### For forelderen

Et voksenområde med PIN gir vern mot utilsiktede innstillingsendringer. Det er en praktisk foreldreport, ikke en sikkerhetsgrense mot telefonens eier.

Forelderen skal kunne velge nivå per fag, velge 5 eller 10 minutter som standard, sette ukens tema og legge inn et lite utvalg øveord. Egendefinerte ord må ha en enkel forhåndsvisning og kontroll av eventuell lyd før de brukes av barnet.

Oversikten skal vise konkrete observasjoner, for eksempel:

- «Løste 8 av 10 varierte oppgaver med tierovergang uten faglige hint, på tre dager.»
- «Svaret på tekstspørsmål var godt etter opplesning; vi har lite informasjon om egenlesing.»
- «Har øvd på å spørre om noe på engelsk. Muntlig bruk er ikke vurdert av appen.»

Vis også ett enkelt forslag til hva dere kan gjøre sammen. Forelderen skal kunne eksportere sikkerhetskopi, importere den igjen og slette én profil uten å påvirke andre.

## 11. Innholdsmodell for Codex

Faglig innhold skal ligge separat fra skjermkomponentene. Nye oppgaver skal som regel kunne legges til gjennom innholdsdata. Hver oppgave skal ha ett tydelig hovedmål.

| Innholdstype | Viktige felt |
| --- | --- |
| Læreplankobling | Fag, læreplankode, versjon, URL, milepæl og en kort identifikasjon av relevant mål |
| Ferdighet | Stabil ID, navn, fag, anbefalt trinn, forutsetninger og kjennetegn på hva barnet skal vise |
| Forklaring | Modell, tekst, lyd og eventuell konkret aktivitet hjemme |
| Oppgave | ID, ferdighet, type, parametere, instruksjon, støtte, svarregel, forklaring og innholdsversjon |
| Observasjon | Profil-ID, oppgave-ID og versjon, tidspunkt, førstesvar, resultat og hvilken faglig støtte som ble brukt |
| Progresjon | Observasjonsgrunnlag, status, neste repetisjon og eventuell manuell innstilling |

Lagre hvilken ferdighet en oppgave faktisk måler. «Les ordet og velg bildet» og «hør ordet og velg bildet» skal ha forskjellige vurderingsetiketter.

Minst disse gjenbrukbare oppgavetypene trengs: velge bilde/tekst, sortere/koble, bygge ord/setning, skrive kort svar, manipulere matematisk modell og lese-/lytteaktivitet med oppfølging. Åpne muntlige og praktiske aktiviteter har egne fullføringsregler.

Tilfeldig variasjon skal være begrenset av faglige regler. Et regnestykke har beregnet fasit; en tekst har kvalitetssikrede spørsmål; et bilde skal være entydig nok for det aktuelle spørsmålet. Ikke bygg en generell generator som forventes å finne opp trygge læringsløp under bruk.

## 12. Teknisk retning

En mobiltilpasset webapp som kan legges på hjemskjermen er et praktisk førstevalg. React, TypeScript og Vite er et mulig utgangspunkt. En PWA-løsning og IndexedDB kan støtte nedlastet innhold og lokal progresjon. Velg konkrete pakker og versjoner når byggingen starter, og kontroller da dokumentasjonen.

Anbefalt oppdeling:

- Visning og interaksjon.
- Oppgaverenderere for de ulike svarformene.
- Faglig innhold og mediefiler.
- Regler for oppgavevalg, støtte og repetisjon.
- Lokal lagring, eksport/import og innholdsoppdatering.

Førsteversjonen trenger ikke en server for ordinære økter. Kjerneinnhold og nødvendige lydfiler skal kunne brukes etter at de er lastet ned. Oppdateringer må versjoneres slik at nye fasiter og ferdighetsdefinisjoner ikke stille endrer betydningen av gamle resultater.

Bokstavlyder, engelske språkmodeller og lyd i lytteoppgaver er faktiske innholdsressurser. Tilfeldige standardstemmer eller manglende lydfiler skal ikke skjules bak en generell høyttalerknapp. Hvis nødvendig lyd mangler, skal aktiviteten forklare dette og tilby et passende alternativ.

Praktisk installasjon, lydavspilling, lagring, tastatur og offlinebruk må testes på forelders faktiske telefon. Lokale data kan forsvinne ved sletting av nettleserdata; voksenområdet skal derfor tilby forståelig sikkerhetskopi og gjenoppretting.

### Personvern som produktvalg

Bruk kallenavn og avatar. Vanlig øving trenger ikke fullt navn, fødselsdato, skole, bilde eller mikrofon. Læringshistorikken lagres lokalt i førsteversjonen. Bruk ingen annonser, eksterne sporingstjenester eller åpen chat. Synkronisering og lydopptak er eventuelle senere funksjoner med egne valg og en ny vurdering før innføring.

## 13. Byggerekkefølge og innhold i førsteversjonen

### Steg A: en gjennomgående prøve for 2. klasse

Bygg profil, hjem, fagvalg, oppgave, hjelp, oppsummering og lagring. Lag ett lite læringsløp per fag:

- Norsk: en ordleseaktivitet, en kort tekst med forståelsesspørsmål og en skriveaktivitet.
- Matte: del–helhet, tierovergang og plassverdi.
- Engelsk: lytteforståelse, en instruksjon og en enkel muntlig frase med voksenoppdrag.

Denne prøven brukes internt til å kontrollere flyt og pedagogisk funksjon. Den er ikke den ferdige 1.–4.-trinnsversjonen.

### Steg B: alle tolv kombinasjoner av fag og trinn

Legg inn aktive innholdspakker i norsk, matematikk og engelsk for hvert av de fire trinnene. Startinnholdet skal ha minst fire avgrensede ferdighetsmoduler i hver kombinasjon, altså minst 48 moduler. Bruk tabellens hovedretninger til å velge modulene og vis hvilke områder som fortsatt gjenstår.

Dette er et konkret forslag til de fire første modulene per kombinasjon. En modul kan inneholde flere delsteg; den er en innholdspakke, ikke nødvendigvis én samlet ferdighetsmåling.

| Trinn | Norsk: fire startmoduler | Matematikk: fire startmoduler | Engelsk: fire startmoduler |
| --- | --- | --- | --- |
| 1 | Lyd og bokstav; trekk sammen og bygg ord; forstå en høytlest historie; lag en egen bildesetning. | Mengder og tall; del–helhet og enkel regning; former og mønstre; sammenlign og mål praktisk. | Kjente ord i situasjoner; lytt og gjør; hils og fortell noe om deg; forstå en bildehistorie. |
| 2 | Les ord med kjente mønstre; les og forstå en kort tekst; bygg og skriv setninger; gjenfortell og samtal. | Plassverdi og tallinje; addisjon/subtraksjon med strategi; likhet og manglende tall; måling, klokke og kalender. | Forstå ord og fraser; følg instruksjoner; spør og svar; les og skriv kjent språk. |
| 3 | Les sammenhengende tekst; utforsk ord og stavemønstre; finn informasjon og gjenfortell; skriv en liten fortelling. | Like grupper og multiplikasjon; regneegenskaper og balanse; areal som dekking; koordinater og instruksjoner. | Gjennomfør en liten dialog; forstå en kort historie; les og finn mening; lag egne setninger. |
| 4 | Begrunn forståelsen med tekst; sorter fakta og meninger; skriv og forbedre en tekst; utforsk språk og presenter muntlig. | Divisjon som deling og gruppering; regnearter og hverdagsmodeller; figurer og volum; mønstre og algoritmer. | Samtal om dagligliv og interesser; les med kontekst og ordbok; skriv en kort tekst; utforsk språk og kultur. |

For automatisk vurderte moduler som skal kunne oppnå status «får til selv», trengs minst ti selvstendige eksempler eller en kontrollert mal som gir tilstrekkelig ulike eksempler. Lese- og samtalemoduler får flere korte tekster og situasjoner samt korrekt observasjonstype. Samme tekst kan gi flere aktiviteter, men ikke automatisk flere uavhengige bevis for samme ferdighet.

Et minste antall moduler er en avgrensning av produktet, ikke bevis på full læreplandekning. Lag en egen oversikt over hvilke mål som støttes digitalt, hvilke som støttes med familieoppdrag, og hvilke som ennå ikke er dekket.

### Steg C: repetisjon, innholdskontroll og ferdig førsteversjon

Legg til regelmotoren, voksenområdet, sikkerhetskopi og kontrollert offlinebruk. Gå gjennom alle tolv fag-/trinnskombinasjoner. Ingen av dem skal bare være en knapp med «kommer snart» i første ferdige versjon.

Prioriter mest innhold og best flyt på 2. trinn, fordi dette er den første hovedbrukeren. Behold reelt startinnhold på de øvrige trinnene.

### Senere forbedringer

Større tekstbibliotek, fyldigere dekning av hele læreplanen, full nynorsk hovedmålspakke, flere spillmekanikker som tjener fagene, frivillig synkronisering og mer avansert tilpasning. Taleteknologi vurderes først etter at selve læringsopplegget fungerer godt.

## 14. Hvordan vi avgjør om appen fungerer

### Faglig og språklig kvalitet

En lærer på småtrinnet bør gjennomgå progresjon, eksempler, lyd og tilbakemeldinger før appen beskrives som faglig kvalitetssikret. Norsk, engelsk og matematikk trenger hver sin kontroll; automatisk genererte oppgaver skal ha samme kvalitetssjekk som håndlagde.

Kontroller blant annet at ingen oppgave gir bort svaret gjennom bildeplassering, at et feilsvar utløser relevant hjelp, og at riktig svar etter fasitvisning blir registrert som støttet. Norsk uttale skal tåle relevant dialektvariasjon, og egne tekster skal få rom for mer enn én formulering.

### Prøving med barnet

Prøv to eller tre korte økter sammen først, og la barnet deretter bruke appen med mindre hjelp. Se etter om han finner fram, forstår hva han skal gjøre, får nytte av hint og klarer å avslutte. Spør «Hva tror du denne knappen gjør?» fremfor å forklare grensesnittet med en gang.

Etter omtrent en uke med faktisk bruk prøver dere nye, lignende oppgaver. Undersøk også en enkel aktivitet på papir eller med gjenstander. Dette gir nyttigere informasjon enn antall stjerner og minutter. Et hjemmeforsøk med ett barn er produktutprøving, ikke dokumentasjon av generell læringseffekt.

### Akseptansekriterier før førsteversjonen er ferdig

- Alle tre fag har reelt innhold på 1.–4. trinn, med synlig avgrensning av innholdet.
- Barnet kan starte en anbefalt aktivitet fra hjem med ett trykk, og kan høre instruksjonen.
- Støtte, pause, hopp over og avslutning fungerer på telefonen.
- Førsteforsøk, støttede forsøk, lytting og voksenobservasjoner lagres med korrekt betydning.
- Nivåvalg og faglig fremgang påvirker bare riktig profil og riktig ferdighet.
- Repetisjon virker på senere bruksdager, og fravær lager ikke press eller oppgavegjeld.
- Godkjent innhold og lyd er tilgjengelig uten nett etter nedlasting; dette er faktisk prøvd på telefonen.
- Oppdatering, eksport, import og sletting er prøvd uten utilsiktet tap av andre profiler.
- Fasit og forklaringer er kontrollert for alle oppgavemaler, og språklige lydressurser er lyttet gjennom.

## 15. Startprompt som kan gis til Codex senere

> Bruk denne planen som produktspesifikasjon for Læringsreisen. Bygg en mobiltilpasset læringsapp for norsk barneskole med norsk, matematikk og engelsk, nivåer for 1.–4. trinn og separate ferdigheter innen hvert fag. Start med steg A for å få en fungerende gjennomgående prøve. Fortsett deretter med steg B og C før du beskriver førsteversjonen som ferdig.
>
> Bruk stående mobilformat, store trykkflater, rolige skjermer, opplesbare instruksjoner og én hovedoppgave om gangen. Bruk bokmål som hovedmål i første innholdspakke. La barnet øve gjennom både valg, egen produksjon, visuelle modeller og familieoppdrag.
>
> Skill innholdsdata, visning, oppgavetyper, progresjonsregler og lagring. Lagre fremgang per profil og ferdighet. Skill selvstendige førsteforsøk fra faglig støttede svar. Registrer muntlige oppdrag uten vurdering som «øvd på». Bruk gjennomgåtte oppgaver og kontrollerte oppgavemaler med beregnet eller kvalitetssikret fasit.
>
> Lag en oversikt over innhold og læreplankobling før du fyller alle trinn. Bruk gjeldende læreplaner på byggetidspunktet; planens kildegrunnlag er fra oktober 2026. Alle tolv kombinasjoner av fag og trinn skal ha aktivt startinnhold i første ferdige versjon, og udekkede mål skal være synlige i dokumentasjonen.
>
> Bruk lokal lagring, flere lokale profiler, et enkelt voksenområde, eksport/import og ingen innlogging i ordinær bruk. Velg konkrete rammeverk og pakkeversjoner etter kontroll av gjeldende dokumentasjon. Test særlig nivåvalg, tolkning av støtte, repetisjon, mobilbruk, lyd og offlinebruk. Lag meningsfulle kontroller av progresjons- og vurderingsreglene. Lever en kjørbar løsning med kort veiledning for bruk og sikkerhetskopi.

## 16. Kilder og hva de er brukt til

Kildene er kontrollert 28. oktober 2026. Lenker til kompetansemål viser den aktuelle læreplanversjonen. Planens konkrete oppgaver, produktvalg og byggeetapper er forslag, ikke formuleringer fra Udir.

1. [Udir: Norsk NOR01-08, kompetansemål etter 2. trinn](https://www.udir.no/lk20/nor01-08/kompetansemaal-og-vurdering/kv1107) – tidlig lesing, skriving, muntlighet og tekstmøter.
2. [Udir: Norsk NOR01-08, kompetansemål etter 4. trinn](https://www.udir.no/lk20/nor01-08/kompetansemaal-og-vurdering/kv1108) – videre tekst- og språkarbeid.
3. [Udir: Matematikk MAT01-06, kompetansemål etter 2. trinn](https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1021?lang=nob) – tall, representasjoner, regning, mønstre, figurer, måling og tid.
4. [Udir: Matematikk MAT01-06, kompetansemål etter 3. trinn](https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1022?lang=nob) – blant annet multiplikasjon, areal og koordinater.
5. [Udir: Matematikk MAT01-06, kompetansemål etter 4. trinn](https://www.udir.no/lk20/mat01-06/kompetansemaal-og-vurdering/kv1023?lang=nob) – blant annet divisjon, modellering, geometri, volum og algoritmer.
6. [Udir: Engelsk ENG01-06, kompetansemål etter 2. trinn](https://www.udir.no/lk20/eng01-06/kompetansemaal-og-vurdering/kv1030) – lytting, samhandling, lyd–skrift og kjent språk.
7. [Udir: Engelsk ENG01-06, kompetansemål etter 4. trinn](https://www.udir.no/lk20/eng01-06/kompetansemaal-og-vurdering/kv1031) – videre kommunikasjon, lesing, skriving og kultur.
8. [IES/WWC: Foundational Skills to Support Reading for Understanding in Kindergarten Through 3rd Grade](https://ies.ed.gov/ncee/wwc/PracticeGuide/21/) – forskningsbasert veiledning om grunnleggende leseferdigheter.
9. [IES/WWC: Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades](https://ies.ed.gov/ncee/wwc/PracticeGuide/26) – systematisk støtte, matematiske modeller, tallinje og tekstoppgaver.
10. [IES/WWC: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) – fordelt læring, gjenhenting, eksempler og forklaringer.
11. [Udir: Gyldighet for Norsk NOR01-08](https://www.udir.no/lk20/nor01-08/gyldighet-og-innfoering?lang=nob).
12. [Udir: Gyldighet for Matematikk MAT01-06](https://www.udir.no/lk20/mat01-06/gyldighet-og-innfoering?lang=nob).
13. [Udir: Gyldighet for Engelsk ENG01-06](https://www.udir.no/lk20/eng01-06/gyldighet-og-innfoering?lang=nob).
14. [Statped: Bokstav, analyse, syntese og avkoding](https://www.statped.no/ressurser-og-verktoy/ressurser/literacy/bokstav-analyse-syntese-og-avkoding/) – bokstavlyd, avkoding og gradvis støtte; ressursen er skrevet med særlig vekt på ASK.
