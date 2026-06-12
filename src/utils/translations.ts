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
    subtitle: "Diventiamo ciò che guardiamo",
    storyMode: "Storia",
    sandboxMode: "Sandbox",
    galleryMode: "Archivio",
    soundOn: "Audio",
    soundOff: "Muto",
    madeWith: "",
    byNickyCaseIntro: "",
    recreatedFor: "",
    cameraTip: "Sposta il mirino e clicca per scattare",
    photoCount: "foto",
    viewGallery: "Archivio",
    replay: "Rigioca",
    secretPeace: "",
    sandboxControls: "Controlli",
    spawnCircle: "Cerchio",
    spawnSquare: "Quadrato",
    spawnHat: "Uomo con cappello",
    spawnCrazed: "Quadrato folle",
    spawnCouple: "Coppia",
    spawnArmed: "Armato",
    customHeadline: "Titolo personalizzato",
    broadcast: "Trasmetti",
    clearCrowd: "Pulisci",
    story: {
      instruction: "Scatta foto alla folla",
      subInstruction: "Cerca i momenti interessanti",
      tvDefault: "#NotizieInDiretta",
      boringHeadline: "#PersoneCheCamminano",
      boringSub: "Chi mai guarderebbe gente che va d'accordo?",
      cricketHeadline: "#CriCri",
      cricketSub: "Solo un grillo. Niente di che.",
      coupleHeadline: "#PrendeteviUnaStanza",
      coupleSub: "Vogliamo dramma, non smancerie.",
      peaceIsBoringHeadline: "#LaPaceÈNoiosa",
      peaceIsBoringSub: "La pace è noiosa. La violenza diventa virale.",
      niceHatHeadline: "#CheBelCappello",
      niceHatSub: "Le bombette sono di moda all'improvviso.",
      hatsOverHeadline: "#CappelliFuoriModa",
      hatsOverSub: "Lasciate stare, i cappelli non vanno più.",
      crazedHeadline: "#QuadratoFolleAttacca",
      crazedSub: "Un quadrato urla contro un cerchio innocente.",
      fearHeadline: "#ICerchiTemonoIQuadrati",
      fearSub: "I cerchi non vogliono più stare vicino ai quadrati.",
      snubHeadline: "#IQuadratiDisprezzanoICerchi",
      snubSub: "I quadrati offesi voltano le spalle ai cerchi.",
      hateHeadline: "#ICerchiOdianoIQuadrati",
      hateSub: "I quadrati odiano i cerchi. Quasi tutti odiano tutti.",
      allHateHeadline: "#TuttiOdianoTutti",
      allHateSub: "La folla è una polveriera.",
      climaxShotHeadline: "#UomoConCappelloSpara",
      climaxShotSub: "Il cerchio elegante estrae una pistola e fa fuoco.",
      climaxHeadline: "#AbbiatePauraSiateArrabbiati",
      climaxSub: "Tutti contro tutti.",
      epilogueHeadline: "#DiventiamoCiòCheGuardiamo",
      epilogueSub: "La coppia accende candele per i caduti.",
      finalMessage1: "Diventiamo ciò che guardiamo.",
      finalMessage2: "Diamo forma ai nostri strumenti, e poi loro danno forma a noi.",
      finalMessage3: ""
    }
  },
  en: {
    title: "We Become What We Behold",
    subtitle: "A short game about news cycles",
    storyMode: "Story",
    sandboxMode: "Sandbox",
    galleryMode: "Archive",
    soundOn: "Sound",
    soundOff: "Mute",
    madeWith: "",
    byNickyCaseIntro: "",
    recreatedFor: "",
    cameraTip: "Move the viewfinder and click to snap",
    photoCount: "photos",
    viewGallery: "Archive",
    replay: "Replay",
    secretPeace: "",
    sandboxControls: "Controls",
    spawnCircle: "Circle",
    spawnSquare: "Square",
    spawnHat: "Hat man",
    spawnCrazed: "Crazed square",
    spawnCouple: "Couple",
    spawnArmed: "Armed",
    customHeadline: "Custom headline",
    broadcast: "Broadcast",
    clearCrowd: "Reset",
    story: {
      instruction: "Take photos of the crowd",
      subInstruction: "Find the interesting moments",
      tvDefault: "#LiveNews",
      boringHeadline: "#PeopleGettingAlong",
      boringSub: "Who tunes in to watch people get along?",
      cricketHeadline: "#CricketChirping",
      cricketSub: "Just a cricket. Nothing special.",
      coupleHeadline: "#GetARoom",
      coupleSub: "Gross. We need drama.",
      peaceIsBoringHeadline: "#PeaceIsBoring",
      peaceIsBoringSub: "Peace is boring. Violence goes viral.",
      niceHatHeadline: "#OohNiceHat",
      niceHatSub: "Bowler hats become an overnight craze.",
      hatsOverHeadline: "#HatsAreOver",
      hatsOverSub: "Never mind, hats aren't cool anymore.",
      crazedHeadline: "#CrazedSquareAttacks",
      crazedSub: "A square screams at an innocent circle.",
      fearHeadline: "#CirclesFearSquares",
      fearSub: "Circles don't want to be near any squares.",
      snubHeadline: "#SquaresSnubCircles",
      snubSub: "Insulted squares turn away from circles.",
      hateHeadline: "#CirclesHateSquares",
      hateSub: "Squares hate circles. Almost everyone hates everyone.",
      allHateHeadline: "#EveryoneHatesEveryone",
      allHateSub: "The crowd is a powder keg.",
      climaxShotHeadline: "#FancyGuyShoots",
      climaxShotSub: "The dapper circle pulls out a gun and fires.",
      climaxHeadline: "#BeScaredBeAngry",
      climaxSub: "Everyone against everyone.",
      epilogueHeadline: "#WeBecomeWhatWeBehold",
      epilogueSub: "The couple lights candles for the fallen.",
      finalMessage1: "We become what we behold.",
      finalMessage2: "We shape our tools, and thereafter our tools shape us.",
      finalMessage3: ""
    }
  }
};
