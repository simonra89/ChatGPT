# Åpne Læringsreisen i nettleseren

Brukeren trenger ingen installasjon, Node.js eller terminal. Appen kan åpnes på en HTTPS-adresse i Chrome, Edge eller Safari, på PC og mobil. Android-installasjon på hjemskjermen er valgfritt.

## GitHub Pages

Den ferdigbygde appen publiseres til grenen `gh-pages` i `simonra89/ChatGPT`. Kildekoden finnes på `laeringsreisen-app`; eksisterende `main` beholdes.

Repoeieren aktiverer webadressen én gang:

1. Åpne https://github.com/simonra89/ChatGPT/settings/pages.
2. Under **Build and deployment**, velg **Deploy from a branch**.
3. Velg **gh-pages** og **/(root)**, og trykk **Save**.
4. Vent til GitHub viser publisert adresse og åpne den. For et vanlig prosjekt uten eget domene er forventet adresse `https://simonra89.github.io/ChatGPT/`.

Publisering av filer til en gren er ikke bevis på at Pages er aktivert eller at adressen er tilgjengelig. Bruk adressen GitHub faktisk viser etter aktivering. Ingen repo-synlighet eller abonnement endres av publiseringsskriptet. Pages må være tilgjengelig for repositoryets eksisterende innstillinger og plan.

Slik oppdaterer utvikleren siden senere:

```sh
npm ci
npm run build
npm test
npx playwright test
node scripts/publish-pages.mjs
```

Publiseringsskriptet sender kun produksjonsbygget til `gh-pages` og bevarer grenens historikk. Barnas lokale profiler, svarhistorikk, kildekode og private sikkerhetskopier er ikke med i nettsidebygget. Alle som har tilgang til nettsiden kan åpne læringsinnholdet. Hver nettleser har sine egne profiler og sin egen fremgang.

## Android, helt valgfritt

Åpne den publiserte nettadressen i Chrome på Android. Bruk appen direkte, eller velg menyen med tre prikker → **Legg til på startskjermen / Installer app**. Dersom Chrome tilbyr automatisk installasjon, kan knappen i appen åpne samme valg. Telefonens menyord kan variere.

Første besøk trenger nett. Etter nedlasting kan innholdet brukes uten nett. Nettleserstemmer og telefonens lagringsbevaring kan variere. Ingen appbutikkpublisering er gjort eller nødvendig for nettleserbruk.

## Kontroller før lenken deles

Bygget bruker relative filbaner, så manifest, ikoner og service worker fungerer både på domenets rot og under `/ChatGPT/`. Nettlesertesten åpner denne prosjektstien og starter appen uten nett. Faktisk offentlig nettadresse og fysisk Android-telefon må bekreftes etter Pages-aktivering.
