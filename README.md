# Læringsreisen

En kjørbar utprøvingsversjon av en rolig læringsapp for 1.–4. trinn, bygget fra [produktplanen](docs/produktplan.md). Bokmål, tre fag, 48 aktive startmoduler og lokal fremgang. Ingen konto, server, annonser eller analyseverktøy.

## Bruk direkte i nettleseren

Brukeren trenger ingen installasjon. Publisering fra GitHub-repoet er klargjort; [nettsideveiledningen](docs/nettleser.md) viser engangsaktivering i GitHub Pages. Når adressen er aktiv, åpnes appen direkte på PC og mobil. Android-installasjon på hjemskjermen er valgfritt.

## Kjør appen som utvikler

Node.js 24 og npm 11 ble brukt ved bygging. Avhengighetene er låst i `package-lock.json`.

```sh
npm ci
npm run dev
```

Vite skriver serveradressen i terminalen. For produksjon og offlinebruk:

```sh
npm run build
npm run preview
```

En service worker laster ned appskallet og alt inkludert innhold ved første besøk. Offlinefunksjonen finnes i produksjonsbygget, ikke utviklingsserveren. Installasjon på hjemskjerm krever en sikker HTTPS-adresse på telefonen. Opplasting av nettsidebygget og aktivering av GitHub Pages er separate steg.

## Slik bruker dere appen

1. Velg profilen øverst for å opprette en oppdager med kallenavn og figur. Standardprofilen kan endres i voksenområdet.
2. Start dagens oppdrag, eller velg Norsk, Matte eller Engelsk. Økten viser først et eksempel som ikke vurderes, deretter oppgaver.
3. Bruk hint, vis forklaring, hopp over eller ta pause. Ved ny oppstart finner dere økten med «Fortsett reisen». En avsluttet økt beholder registrerte forsøk.
4. Åpne «For voksne». Første gang velger dere en lokal PIN med fire siffer. Still starttrinn separat i hvert fag og velg omtrent 5 eller 10 minutter. Ingen nedtelling brukes.
5. Egne øveord legges inn og forhåndsvises i voksenområdet. Bekreft ordene før de brukes skriftlig under Norsk. Blandet repetisjon finnes under Min reise når barnet har øvd på noe.
6. Eksporter regelmessig. JSON-filen inneholder alle profiler, observasjoner og lokal PIN-hash; oppbevar den privat. Import validerer filen og ber om bekreftelse før alle lokale data erstattes. Pågående økter gjenopprettes ikke ved import. Sletting fjerner bare valgt profil; siste profil krever at en annen opprettes først.

PIN er en praktisk foreldreport, ikke kryptering. Data ligger i nettleserens localStorage og deles ikke mellom enheter. Lagringsfeil vises tydelig. Uleselige originaldata bevares til brukeren velger å erstatte dem.

## Faglig avgrensning

Dette er **ikke en faglig godkjent eller ferdig førsteversjon** etter hele planen. [Innholdsoversikten](docs/innhold.md) skiller det som finnes fra det som gjenstår.

- Åpne tekster, muntlige aktiviteter og praktisk arbeid registreres som «øvd på». Voksenbekreftelse er gjennomføring, ikke automatisk mestring.
- Hint, fasitvisning, flytting i strategimodellen og opplesning av lesetekst registreres som faglig støtte. Instruksjonslyd påvirker ikke resultatet.
- Førstesvaret lagres én gang, også ved dobbelttrykk. Demonstrasjonen og like eksempler utelates fra økten. Identisk innhold samme dag gir ikke flere mestringsbevis.
- Bare pakker med minst ti ulike eksempler og endret kontekst kan oppnå «får til selv». Det krever ti kvalifiserte observasjoner, minst åtte riktige, minst to dager, minst åtte ulike eksempler og riktig overføringsoppgave. Små språkpakker og repeterte formmønstre kan ikke oppnå statusen.
- Repetisjon foreslås senere uten poengtap eller oppgavegjeld. Intervallene 1, 3, 7 og 14 dager er foreløpige produktregler.
- Passende nettleserstemme kan lese instruksjoner og lesetekster. Manglende stemme gir melding. **Godkjente bokstavlyder og engelske lydmodeller er ikke inkludert.** Slike aktiviteter har et eksplisitt voksenalternativ og dokumenterer ikke automatisk lytteforståelse eller uttale.

## Struktur

- `src/content.ts`: 48 moduler, matematiske maler og små tekst-/språkpakker.
- `src/engine.ts`: oppgavevalg, repetisjon, progresjon, importvalidering og PIN-hash.
- `src/types.ts`: innhold, observasjoner, profiler og økter.
- `src/storage.ts`: lokal lagring og eksport.
- `src/App.tsx`: skjermflyt, voksenområde og oppgaverenderere.
- `src/Art.tsx`, `src/style.css`: lokale illustrasjoner og responsive stiler. Ingen eksterne fonter eller bilder.
- `scripts/offline.mjs`: offlinepakke med hash av byggets innhold. Oppdateringer aktiveres når gammel app er lukket. Ved faglige endringer må innholds-/observasjonsversjon migreres eksplisitt; ikke endre betydningen av gamle oppgave-ID-er stille.

## Kontroller

```sh
npm test
npm run build
npx playwright test
```

Playwright bruker `/usr/bin/chromium` i skymiljøet. Tilpass `executablePath` eller installer Playwrights Chromium på andre maskiner. Nettleser og lokale servere trenger tillatelse til lokale sockets.

11 regel-/innholdstester og 10 nettleserkontroller bestod. De dekker øktflyt, hint, pause, ny oppstart, profilskille, PIN, nivåvalg, eksport, import med bekreftelse, sletting, alle tolv fag-/trinnskombinasjoner, mobilbredde, offlineoppstart, egne øveord, blandet repetisjon og separate pauseøkter for søsken, GitHub Pages-prosjektstien og valgfri Android-veiledning. Skjermbilder er også kontrollert visuelt. Bygget er typekontrollert.

Fysisk telefon, iOS/Safari, hjemskjerminstallasjon, faktiske stemmer og pedagogisk kvalitet er ikke verifisert. Gjennomfør planens lærer- og barneutprøving før ordinær bruk.
