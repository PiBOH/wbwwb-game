# Changelog

Tutte le modifiche rilevanti a questo progetto vengono documentate qui.
Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/) e il progetto segue il [Semantic Versioning](https://semver.org/lang/it/).

---

## [1.0.1c_BETA] — Massacro finale leggibile

### Aggiunto
- **Sistema di attacchi visibili nel finale**: ora gli attaccanti armati si avvicinano fisicamente alla vittima, sollevano il bastone, fanno lo **swing** dell'arma e colpiscono. Si vede chiaramente chi ammazza chi.
- **Animazione "BAM!"** rossa con flash giallo al momento dell'impatto.
- Lo swing del bastone è orientato verso la vittima (mirroring automatico se la vittima è a sinistra).
- Nuovi campi nel modello `Peep`: `attackingTargetId`, `attackTimer`, `attackPhase`, `killedById`, `deathFlashTimer`.

### Modificato
- Tempistica del massacro ricalibrata: ogni ~1.5s parte un nuovo duello (prima 1.25s) per rendere i singoli scontri più leggibili.
- Gli attaccanti durante l'attacco non sono più mossi dalla AI normale (il loro movimento è guidato dallo script del massacro).

---

## [1.0.1b_BETA] — Fix underscore residui

### Corretto
- Rimossi gli underscore rimasti in alcuni hashtag della **guida walkthrough** (sia IT che EN): `#CHE_BEL_CAPPELLO` → `#CheBelCappello`, `#OOH_NICE_HAT` → `#OohNiceHat`, ecc.
- Rimosso underscore dal placeholder dell'input delle notizie personalizzate in Sandbox: `#TITOLO_VIRALE` → `#TitoloVirale`.
- Aggiornato il check delle foto "Peace is Boring" nel Gallery Modal con i nuovi hashtag CamelCase.

---

## [1.0.1a_BETA] — Riscrittura testi & finale esteso

### Aggiunto
- File `CHANGELOG.md` per tracciare tutte le versioni.
- Auto-espansione in larghezza della barra delle news (si adatta al testo, come nell'originale).

### Modificato
- **Finale del gioco ulteriormente esteso**: il massacro ora dura circa **30 secondi** (prima 19 s), con uccisioni più dilazionate per maggiore impatto cinematografico.
- **Hashtag puliti**: rimossi gli underscore (`_`) tra le parole, ora in formato `#CamelCase` (es. `#TuttiOdianoTutti` invece di `#TUTTI_ODIANO_TUTTI`).
- **Testi riscritti in modo più naturale**: rimosse frasi enfatiche generate automaticamente (es. *"Fedele al capolavoro di Nicky Case"*, *"Una riflessione potente sulla responsabilità dei media"*, *"TENSIONI INARRESTABILI"*, ecc.).
- **Barra delle news** rimpicciolita: thumbnail 48×48 px (prima 80×96), padding e font ridotti, layout più compatto e discreto.

### Rimosso
- Frase *"Fedele al capolavoro di Nicky Case"* dalla schermata finale.
- Stringhe ridondanti dal pannello istruzioni e dall'epilogo.

---

## [1.0.0L_BETA] — Link corretto Nicky Case
- Il link *"Original 2016 game by Nicky Case"* nella schermata finale ora punta a https://github.com/ncase.

## [1.0.0k_BETA] — Pulizia e finale più lungo
- Durata del massacro finale aumentata a ~19 secondi (prima ~7 s).
- Link a Nicky Case nel footer aggiornato a https://github.com/ncase.
- Rimosse frasi non necessarie: *"Ricreato in React, Vite e Tailwind CSS..."*, *"GitHub Originale"* ecc.

## [1.0.0h_BETA] — Titolo pagina e versionamento
- `<title>` della pagina cambiato in: *"We Become What We Behold - Unofficial Port (By PiBOH)"*.
- Versionamento esplicito nella Navbar e nel Footer.

## [1.0.0g_BETA] — Banner news in basso a destra
- Spostato l'intero banner Breaking News dall'angolo basso-centrato all'**angolo in basso a destra**.
- Nuove animazioni `slide-in-right` / `slide-out-right`.
- Aggiunte info di **versione, autore (PiBOH) e licenza (Unlicense)** nel footer.

## [1.0.0f] — Fix titolo virale sulla TV
- Risolto sfarfallio del titolo sovrapposto sullo schermo della TV centrale.
- L'immagine catturata viene ora messa in cache (`tvImageRef`) invece di essere ricreata ad ogni frame.
- Rimossa la scritta sovrapposta sulla TV: il titolo resta solo nel banner Breaking News.

## [1.0.0e] — Banner news auto-dismiss
- Il banner della notizia ora scompare automaticamente dopo **3 secondi** con animazione di uscita.
- Aggiunta barra di progresso visiva del countdown.

## [1.0.0d] — Finale fedele all'originale
- Rimosso il "finale di pace" inventato: ora c'è il **finale unico fedele al gioco originale** di Nicky Case.
- Aggiunto l'evento dell'**uomo elegante che spara** (`#FancyGuyShoots`).
- Aggiunto epilogo finale con **coppia e grilli in lutto davanti al memoriale di candele**.
- Nuova schermata di fine gioco con elenco dei caduti.

## [1.0.0c] — Workflow GitHub Pages
- Aggiunto workflow `.github/workflows/deploy.yml` per il deploy automatico su GitHub Pages ad ogni push.

## [1.0.0b] — Sandbox e Gallery
- Aggiunta **modalità Sandbox**: pannello con controlli per aggiungere manualmente cerchi, quadrati, coppia, uomo con cappello, quadrato folle, peep armato.
- Aggiunta possibilità di **trasmettere notizie personalizzate** dalla sandbox.
- Aggiunto **Archivio Foto (Gallery)** con tutte le foto scattate durante la partita.
- Doppia lingua **IT/EN** con selettore.
- Audio sintetizzato proceduralmente via Web Audio API (no file esterni).

## [1.0.0a] — Prima implementazione
- Motore di gioco 2D su `<canvas>` con simulazione di cerchi e quadrati.
- Mirino fotografico con cattura di snapshot.
- Sistema di hashtag/titoli che reagiscono a ciò che inquadri.
- Progressione narrativa a fasi (intro → cappello → folle → paura → snobismo → odio → massacro → epilogo).
- Layout responsive con React + Vite + Tailwind CSS.
