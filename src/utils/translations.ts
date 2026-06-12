import { Language } from '../types/game';

export interface StoryTranslation {
  instruction: string;
  subInstruction: string;
  tvDefault: string;
  boringHeadline: string;
  boringSub: string;
  cricketHeadline: string;
  cricketSub: string;
  coupleHeadline: string;
  coupleSub: string;
  peaceIsBoringHeadline: string;
  peaceIsBoringSub: string;
  niceHatHeadline: string;
  niceHatSub: string;
  hatsOverHeadline: string;
  hatsOverSub: string;
  crazedHeadline: string;
  crazedSub: string;
  fearHeadline: string;
  fearSub: string;
  snubHeadline: string;
  snubSub: string;
  hateHeadline: string;
  hateSub: string;
  allHateHeadline: string;
  allHateSub: string;
  climaxShotHeadline: string;
  climaxShotSub: string;
  climaxHeadline: string;
  climaxSub: string;
  epilogueHeadline: string;
  epilogueSub: string;
  finalMessage1: string;
  finalMessage2: string;
  finalMessage3: string;
}

export const translations: Record<Language, {
  title: string;
  subtitle: string;
  storyMode: string;
  sandboxMode: string;
  galleryMode: string;
  soundOn: string;
  soundOff: string;
  madeWith: string;
  byNickyCaseIntro: string;
  recreatedFor: string;
  cameraTip: string;
  photoCount: string;
  viewGallery: string;
  replay: string;
  secretPeace: string;
  sandboxControls: string;
  spawnCircle: string;
  spawnSquare: string;
  spawnHat: string;
  spawnCrazed: string;
  spawnCouple: string;
  spawnArmed: string;
  customHeadline: string;
  broadcast: string;
  clearCrowd: string;
  story: StoryTranslation;
}> = {
  it: {
    title: "We Become What We Behold",
    subtitle: "Siamo diventati ciò che abbiamo guardato",
    storyMode: "Storia",
    sandboxMode: "Sandbox",
    galleryMode: "Archivio Foto",
    soundOn: "Audio Attivo",
    soundOff: "Muto",
    madeWith: "Fedele al capolavoro di Nicky Case",
    byNickyCaseIntro: "Un gioco di 5 minuti sui cicli viziosi e i media.",
    recreatedFor: "Ricreato per il web e GitHub Pages",
    cameraTip: "Muovi il mirino e clicca per catturare una notizia!",
    photoCount: "Foto scattate",
    viewGallery: "Guarda l'Archivio Notizie",
    replay: "Rigioca dall'Inizio",
    secretPeace: "Memoria e Rispetto",
    sandboxControls: "Pannello di Controllo",
    spawnCircle: "Cerchio",
    spawnSquare: "Quadrato",
    spawnHat: "Uomo con Cappello",
    spawnCrazed: "Quadrato Folle",
    spawnCouple: "Coppia Innamorata",
    spawnArmed: "Personaggio Armato",
    customHeadline: "Notizia Personalizzata",
    broadcast: "Trasmetti Notizia",
    clearCrowd: "Pulisci Piazza",
    story: {
      instruction: "Sposta la fotocamera e scatta foto alla folla.",
      subInstruction: "Cattura gli eventi interessanti. La pace e l'amore sono noiosi!",
      tvDefault: "#NOTIZIE_IN_DIRETTA",
      boringHeadline: "#PERSONE_CHE_CAMMINANO",
      boringSub: "Booooring. Chi sintonizzerebbe la TV per guardare gente che va d'accordo?",
      cricketHeadline: "#CRI_CRI",
      cricketSub: "È solo un piccolo grillo. Niente di entusiasmante.",
      coupleHeadline: "#PRENDETEVI_UNA_STANZA",
      coupleSub: "Che schifo... Vogliamo storie interessanti, non piccioncini!",
      peaceIsBoringHeadline: "#LA_PACE_E_NOIOSA",
      peaceIsBoringSub: "LA PACE È NOIOSA! LA VIOLENZA DIVENTA VIRALE!",
      niceHatHeadline: "#CHE_BEL_CAPPELLO",
      niceHatSub: "Wow! Le bombette diventano all'improvviso una mania di moda!",
      hatsOverHeadline: "#CAPPELLI_FUORI_MODA",
      hatsOverSub: "Non importa, i cappelli non sono più di moda.",
      crazedHeadline: "#QUADRATO_FOLLE_ATTACCA",
      crazedSub: "UN QUADRATO IMPAZZITO URLA CONTRO UN POVERO CERCHIO!",
      fearHeadline: "#I_CERCHI_TEMONO_I_QUADRATI",
      fearSub: "I Cerchi sono terrorizzati dall'avvicinarsi ai Quadrati!",
      snubHeadline: "#I_QUADRATI_DISPREZZANO_I_CERCHI",
      snubSub: "I Quadrati si sentono offesi e voltano le spalle ai Cerchi!",
      hateHeadline: "#I_CERCHI_ODIANO_I_QUADRATI",
      hateSub: "I Quadrati odiano i Cerchi! Quasi tutti odiano tutti!",
      allHateHeadline: "#TUTTI_ODIANO_TUTTI",
      allHateSub: "TENSIONI INARRESTABILI! La folla è in preda alla rabbia!",
      climaxShotHeadline: "#UOMO_CON_CAPPELLO_SPARA",
      climaxShotSub: "L'elegante Cerchio estrae una pistola e fa fuoco contro il Quadrato folle!",
      climaxHeadline: "#ABBIATE_PAURA_SIATE_ARRABBIATI",
      climaxSub: "VIOLENZA TOTALE! IL CAOS SANGUINOSO PRENDE IL SOPRAVVENTO!",
      epilogueHeadline: "#SIAMO_DIVENTATI_CIO_CHE_ABBIAMO_GUARDATO",
      epilogueSub: "Alla fine, la coppia sopravvissuta piange le vittime davanti a un memoriale di candele.",
      finalMessage1: "Siamo diventati ciò che abbiamo guardato.",
      finalMessage2: "Diamo forma ai nostri strumenti, e poi i nostri strumenti danno forma a noi.",
      finalMessage3: "Una riflessione potente sulla responsabilità dei media e della società."
    }
  },
  en: {
    title: "We Become What We Behold",
    subtitle: "A 5-minute game about news cycles and vicious cycles.",
    storyMode: "Story",
    sandboxMode: "Sandbox",
    galleryMode: "Photo Archive",
    soundOn: "Sound On",
    soundOff: "Muted",
    madeWith: "Faithful to Nicky Case's Masterpiece",
    byNickyCaseIntro: "A 5-minute interactive exploration of how news shapes society.",
    recreatedFor: "Recreated for web and GitHub Pages",
    cameraTip: "Drag the camera frame and click to capture a news story!",
    photoCount: "Photos taken",
    viewGallery: "View News Archive",
    replay: "Replay from Start",
    secretPeace: "Memorial and Respect",
    sandboxControls: "Controls",
    spawnCircle: "Circle",
    spawnSquare: "Square",
    spawnHat: "Snazzy Hat",
    spawnCrazed: "Crazed Square",
    spawnCouple: "Couple in Love",
    spawnArmed: "Armed Peep",
    customHeadline: "Custom Headline",
    broadcast: "Broadcast",
    clearCrowd: "Reset Crowd",
    story: {
      instruction: "Move the camera indicator around and snap photographs.",
      subInstruction: "Capture unique stories. Normal peaceful things are boring!",
      tvDefault: "#LIVE_NEWS_FEED",
      boringHeadline: "#PEOPLE_GETTING_ALONG",
      boringSub: "Booooring. Who tunes in to watch people get along?",
      cricketHeadline: "#CRICKET_CHIRPING",
      cricketSub: "It's just a regular jumping cricket. Nothing sensational.",
      coupleHeadline: "#GET_A_ROOM",
      coupleSub: "Gross... Go get a room! We need drama!",
      peaceIsBoringHeadline: "#PEACE_IS_BORING",
      peaceIsBoringSub: "PEACE IS BORING! VIOLENCE GOES VIRAL!",
      niceHatHeadline: "#OOH_NICE_HAT",
      niceHatSub: "Snazzy! Bowler hats become an overnight fashion craze!",
      hatsOverHeadline: "#HATS_ARE_OVER",
      hatsOverSub: "Never mind, bowler hats aren't cool anymore.",
      crazedHeadline: "#CRAZED_SQUARE_ATTACKS",
      crazedSub: "UNHINGED SQUARE SCREAMS AT INNOCENT CIRCLE!",
      fearHeadline: "#CIRCLES_FEAR_SQUARES",
      fearSub: "Circles are now terrified of interacting with any Squares!",
      snubHeadline: "#SQUARES_SNUB_CIRCLES",
      snubSub: "Insulted Squares turn coldly away from frightened Circles!",
      hateHeadline: "#CIRCLES_HATE_SQUARES",
      hateSub: "Squares hate Circles! Almost everyone hates everyone!",
      allHateHeadline: "#EVERYONE_HATES_EVERYONE",
      allHateSub: "THE CROWD IS FURIOUS! Hostilities erupt between all shapes!",
      climaxShotHeadline: "#FANCY_GUY_SHOOTS",
      climaxShotSub: "The dapper Circle whips out a gun and shoots the formerly crazed Square!",
      climaxHeadline: "#BE_SCARED_BE_ANGRY",
      climaxSub: "VIOLENCE GOES VIRAL! ABSOLUTE BLOODSHED AND CHAOS!",
      epilogueHeadline: "#WE_BECAME_WHAT_WE_BEHELD",
      epilogueSub: "In the end, the surviving couple lights candles to pay their respects to the fallen.",
      finalMessage1: "We become what we behold.",
      finalMessage2: "We shape our tools, and thereafter our tools shape us.",
      finalMessage3: "A powerful critique of media culture and societal polarization."
    }
  }
};
