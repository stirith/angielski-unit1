'use strict';

const STORE_KEY = 'slowka-en-unit1-v1';

// Listy startowe: English Class A1+ (Unit 1 „Classmates”, Wordlist str. 19 + dni tygodnia, przysłówki częstotliwości).
// Format "angielski = polski", kilka znaczeń po ukośniku. Pole `de` w kodzie = słówko angielskie (nazwa z wersji DE).
const START_DECKS = [
  ['subjects', 'Przedmioty', '📚', `Art = plastyka / sztuka
Computer Studies = informatyka / zajęcia komputerowe
English = język angielski / angielski
French = język francuski / francuski
Geography = geografia
History = historia
Maths = matematyka
Music = muzyka
P.E. = WF / W-F / wychowanie fizyczne
Science = przyroda / przedmioty ścisłe`],
  ['items', 'Przybory', '✏️', `calculator = kalkulator
dictionary = słownik
laptop = laptop
map = mapa
paints = farby
pencil case = piórnik
rubber = gumka
ruler = linijka
scissors = nożyczki
trainers = trampki`],
  ['routine', 'Mój dzień', '⏰', `get up = wstawać
have breakfast = jeść śniadanie
walk to school = iść do szkoły pieszo
listen to music = słuchać muzyki
study = uczyć się
bring = przynieść / przynosić
play sports = uprawiać sporty
dinner = kolacja / obiad
daily routine = codzienne zajęcia / plan dnia
on TV = w telewizji
tonight = dziś wieczorem
at home = w domu
at school = w szkole`],
  ['outclass', 'Out of class', '💬', `Hurry up! = Pospiesz się!
We're late! = Jesteśmy spóźnieni!
What a mess! = Ale bałagan!
at the same time = jednocześnie / w tym samym czasie
boring = nudny
in class = w klasie / podczas lekcji
late for class = spóźniony na lekcję
noisy = hałaśliwy`],
  ['often', 'Jak często?', '🔁', `always = zawsze
usually = zwykle / zazwyczaj
often = często
sometimes = czasami / czasem
never = nigdy`],
  ['doplay', 'do i play', '🎸', `do ballet = tańczyć w balecie
do judo = uprawiać judo / uprawiać dżudo
do karate = uprawiać karate
do pottery = zajmować się garncarstwem / lepić z gliny
play basketball = grać w koszykówkę
play chess = grać w szachy
play football = grać w piłkę nożną
play tennis = grać w tenisa
play the drums = grać na perkusji
play the guitar = grać na gitarze
play the piano = grać na pianinie
play in a band = grać w zespole
band = zespół
bored = znudzony
rest = odpoczywać`],
  ['personal', 'Pytania o dane', '🙋', `What's your name? = Jak masz na imię?
How do you spell that? = Jak to się pisze? / Czy możesz to przeliterować?
Where do you live? = Gdzie mieszkasz?
What's your email address? = Jaki jest twój e-mail? / Jaki jest twój adres e-mail?
What's your phone number? = Jaki jest twój numer telefonu?
Can I help you? = Czy mogę ci pomóc? / W czym mogę pomóc?
join a club = zapisać się do klubu
at (@) = małpa (w adresie e-mail)
dot (.) = kropka (w adresie e-mail)`],
  ['places', 'Miejsca w szkole', '🏫', `canteen = stołówka
classroom = sala lekcyjna / klasa
computer room = pracownia komputerowa
gym = sala gimnastyczna
hall = korytarz / aula
library = biblioteka
playground = plac zabaw / boisko
staff room = pokój nauczycielski
boarding school = szkoła z internatem`],
  ['reading', 'Z czytanki', '🏰', `assembly = apel szkolny / apel
bell = dzwonek
crazy = szalony / zwariowany
describe = opisać / opisywać
exciting = ekscytujący
finish = skończyć / kończyć
magic = magia
miss your parents = tęsknić za rodzicami
monster = potwór
typical = typowy
wake up = obudzić się / budzić się`],
  ['days', 'Dni tygodnia', '📅', `Monday = poniedziałek
Tuesday = wtorek
Wednesday = środa
Thursday = czwartek
Friday = piątek
Saturday = sobota
Sunday = niedziela
weekday = dzień powszedni / dzień roboczy
weekend = weekend`],
  ['time', 'at, in, on', '🕘', `at 9 o'clock = o dziewiątej / o godzinie 9
at the weekend = w weekend
at lunchtime = w czasie lunchu / w porze lunchu
in the morning = rano
in the afternoon = po południu
in the evening = wieczorem
on Monday = w poniedziałek
on Friday morning = w piątek rano
on a weekday = w dzień powszedni`],
];

const DEFAULT_SETTINGS = {
  direction: 'pl-de',   // pl-de (PL → EN) | de-pl (EN → PL) | mix
  testType: 'choice',   // choice | type | mix
  requireArticle: false,
  speak: true,
  planStart: '2026-11-11',
  testDate: '2026-11-25', // nauka do dnia przed testem
};

const LABELS = {
  direction: { 'pl-de': 'PL → EN', 'de-pl': 'EN → PL', mix: 'Mieszany' },
  testType: { choice: 'Wybór z 3', type: 'Wpisywanie', mix: 'Wybór + wpisywanie' },
};

const PRAISE = ['Brawo! 🎉', 'Super! ⭐', 'Świetnie! 🙌', 'Tak jest! 💪', 'Ekstra! 🌟'];

// Ile kolejnych dobrych odpowiedzi, żeby słówko liczyło się jako „umiem”.
const MASTERED_AFTER = 2;

// Nowe słówka dziennie w planie „Dzisiaj”.
const WORDS_PER_DAY = 10;

// ---------- czyste funkcje (testowalne bez przeglądarki) ----------

function parseWords(text) {
  const words = [];
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const m = line.match(/^(.+?)\s*(?:=|\t|\s[-–—]\s)\s*(.+)$/);
    if (m) words.push({ de: m[1].trim(), pl: m[2].trim() });
  }
  return words;
}

function wordsToText(words) {
  return words.map(w => `${w.de} = ${w.pl}`).join('\n');
}

function startDecks() {
  return START_DECKS.map(([id, name, emoji, text]) => ({ id, name, emoji, words: parseWords(text) }));
}

const FOLD = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z', ä: 'a', ö: 'o', ü: 'u', ß: 'ss' };
const ARTICLE = /^(to|the|a|an) /;

function basic(s) {
  return String(s).toLowerCase().replace(/[’`´]/g, "'").replace(/\s+/g, ' ').trim().replace(/[.!?]+$/, '').trim();
}

// Wersja „wyrozumiała”: bez umlautów (ä = a = ae), bez polskich znaków, bez interpunkcji.
function loose(s, stripArticle) {
  let t = basic(s).replace(/\(.*?\)/g, ' ');
  t = t.replace(/[ąćęłńóśźżäöüß]/g, c => FOLD[c]);
  t = t.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
  t = t.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  if (stripArticle) t = t.replace(ARTICLE, '');
  return t;
}

// Nawiasy to tylko podpowiedź; ukośnik, przecinek i średnik rozdzielają kilka poprawnych odpowiedzi.
function alternatives(target) {
  const s = String(target);
  const variants = [s];
  return [...new Set(variants.flatMap(v =>
    v.replace(/\(.*?\)/g, ' ').split(/[/,;]/).map(x => x.trim()).filter(Boolean)))];
}

// 'exact' – idealnie, 'close' – dobrze, ale bez apostrofu/kropki/polskiej litery, 'wrong'.
function checkTyped(input, target, german, requireArticle) {
  const inp = basic(input);
  if (!inp) return 'wrong';
  const alts = alternatives(target);
  if (alts.some(a => basic(a) === inp)) return 'exact';
  const strip = german && !requireArticle;
  const li = loose(input, strip);
  if (li && alts.some(a => loose(a, strip) === li)) return 'close';
  return 'wrong';
}

function overlaps(a, b) {
  const la = alternatives(a).map(x => loose(x, false));
  return alternatives(b).some(x => la.includes(loose(x, false)));
}

// W wersji angielskiej „rodzajnik” to czasownik do / play: "play chess" → {art: 'play', rest: 'chess'}.
function splitArticle(de) {
  const m = String(de).match(/^(\()?(do|play)\)?\s+(?!in a\b)(.+)$/);
  return m ? { art: m[2], rest: m[3], paren: !!m[1] } : null;
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const keyOf = w => w.de + '|' + w.pl;

function uniqueWords(words) {
  const seen = new Set();
  return words.filter(w => (seen.has(keyOf(w)) ? false : seen.add(keyOf(w))));
}

// Daty jako 'YYYY-MM-DD' w czasie lokalnym; dayNum to numer dnia do odejmowania.
function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayNum(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}

function isoFromNum(n) {
  return new Date(n * 86400000).toISOString().slice(0, 10);
}

// Podział planu: najpierw dni z nowymi słówkami (ok. perDay dziennie), potem dni powtórek mieszanych,
// a ostatnie 2 dni przed testem to powtórka całości i próbny test (jak w planie z PDF).
// Gdy dni jest za mało, nowych słówek dziennie jest więcej.
function splitPlan(words, start, test, perDay = WORDS_PER_DAY) {
  const totalDays = Math.max(1, test - start);
  const reviewDays = totalDays >= 8 ? 2 : totalDays >= 4 ? 1 : 0;
  const slots = totalDays - reviewDays;
  const learnDays = Math.max(1, Math.min(slots, Math.ceil(words.length / perDay)));
  const mixDays = slots - learnDays;
  const chunks = Array.from({ length: learnDays }, (_, i) =>
    words.slice(Math.round((i * words.length) / learnDays), Math.round(((i + 1) * words.length) / learnDays)));
  return { totalDays, reviewDays, learnDays, mixDays, chunks };
}

function dni(n) {
  return n === 1 ? 'dzień' : 'dni';
}

// ---------- stan ----------

let state;
let view = 'home';
let session = null;
let editingId = null;
let advanceTimer = null;

function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { /* brak dostępu do pamięci */ }
  if (!s || !Array.isArray(s.decks)) {
    return { decks: startDecks(), selected: [], settings: { ...DEFAULT_SETTINGS }, stats: {}, plan: { days: {} }, activity: {} };
  }
  return {
    decks: s.decks,
    selected: Array.isArray(s.selected) ? s.selected : [],
    settings: { ...DEFAULT_SETTINGS, ...(s.settings || {}) },
    stats: s.stats || {},
    plan: s.plan && s.plan.days ? s.plan : { days: {} },
    activity: s.activity || {},
  };
}

function save() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny */ }
}

// ?dzis=2026-11-05 w adresie podmienia dzisiejszą datę (do sprawdzania planu).
function todayIso() {
  const forced = typeof location !== 'undefined' && new URLSearchParams(location.search).get('dzis');
  return forced && /^\d{4}-\d{2}-\d{2}$/.test(forced) ? forced : isoDate(new Date());
}

function selectedWords() {
  return uniqueWords(state.decks.filter(d => state.selected.includes(d.id)).flatMap(d => d.words));
}

function allWords() {
  return uniqueWords(state.decks.flatMap(d => d.words));
}

function wordByKey(k) {
  return allWords().find(w => keyOf(w) === k);
}

const statOf = w => state.stats[keyOf(w)] || { r: 0, w: 0, c: 0 };
const isMastered = w => (statOf(w).c || 0) >= MASTERED_AFTER;

function hardWords() {
  return allWords().filter(w => {
    const st = state.stats[keyOf(w)];
    return st && st.w > 0 && st.w >= st.r;
  });
}

// Poziom trudności: ocena po samym słowie (długość, liczba wyrazów, trudna pisownia angielska).
const LEVEL_OF_KEY = {};

function guessLevel(de) {
  const t = String(de).replace(/\(.*?\)/g, '').replace(/^(to|the) /, '').trim();
  let score = 0;
  if (t.length > 12) score += 2; else if (t.length > 7) score += 1;
  if (t.split(/\s+/).length >= 3) score += 1;
  if (/ough|augh|ph|ie|ei|sc|ss|wh|ue|ea|oo|ai|ou|ture|tion|y\b|'/i.test(t)) score += 1;
  return score >= 3 ? 'hard' : score >= 1 ? 'medium' : 'easy';
}

function levelOf(w) {
  return LEVEL_OF_KEY[keyOf(w)] || guessLevel(w.de);
}

const LEVELS = [['easy', '😊', 'Łatwe'], ['medium', '🙂', 'Średnie'], ['hard', '😕', 'Trudne']];

// Najpierw nieopanowane, potem te z największą liczbą błędów.
function weakFirst(a, b) {
  const sa = statOf(a), sb = statOf(b);
  return (isMastered(a) - isMastered(b)) || ((sb.w - sb.r) - (sa.w - sa.r)) || ((sa.c || 0) - (sb.c || 0));
}

function record(w, ok) {
  const st = { c: 0, ...statOf(w) };
  if (ok) { st.r++; st.c++; } else { st.w++; st.c = 0; }
  state.stats[keyOf(w)] = st;
  state.activity[todayIso()] = true;
  save();
}

function streak() {
  let n = dayNum(todayIso());
  if (!state.activity[isoFromNum(n)]) n--;
  let count = 0;
  while (state.activity[isoFromNum(n)]) { count++; n--; }
  return count;
}

function pickMode(value, a, b) {
  return value === 'mix' ? (Math.random() < 0.5 ? a : b) : value;
}

// Inne słówka o tym samym pytaniu, np. babcia = die Oma i die Großmutter, sein = być i jego.
function sameMeaning(w, dir) {
  const p = dir === 'pl-de' ? 'pl' : 'de';
  return allWords().filter(c => keyOf(c) !== keyOf(w) && overlaps(c[p], w[p]));
}

function makeOptions(w, dir) {
  const field = dir === 'pl-de' ? 'de' : 'pl';
  const prompt = dir === 'pl-de' ? 'pl' : 'de';
  const correct = w[field];
  const used = [correct];
  const out = [];
  for (const source of [shuffle(selectedWords()), shuffle(allWords())]) {
    for (const c of source) {
      if (out.length === 2) break;
      if (overlaps(c[prompt], w[prompt]) || used.some(u => overlaps(u, c[field]))) continue;
      used.push(c[field]);
      out.push(c[field]);
    }
  }
  return out.length < 2 ? null : shuffle([correct, ...out]);
}

// opts.type: choice | type | mix | auto (wybór, dopóki słówko nie było znane, potem wpisywanie) | listen | article
function buildQuestion(w, opts = {}) {
  if (opts.type === 'article') return { w, dir: 'pl-de', type: 'article', options: ['do', 'play'] };
  if (opts.type === 'listen') {
    const options = makeOptions(w, 'de-pl');
    if (options) return { w, dir: 'de-pl', type: 'listen', options };
  }
  const dir = opts.dir || pickMode(state.settings.direction, 'pl-de', 'de-pl');
  let type = opts.type === 'auto' ? (statOf(w).r > 0 ? 'type' : 'choice')
    : opts.type === 'choice' || opts.type === 'type' ? opts.type
    : pickMode(state.settings.testType, 'choice', 'type');
  let options = null;
  if (type === 'choice') {
    options = makeOptions(w, dir);
    if (!options) type = 'type';
  }
  return { w, dir, type, options };
}

function answerOf(q) {
  if (q.type === 'article') return splitArticle(q.w.de).art;
  return q.dir === 'pl-de' ? q.w.de : q.w.pl;
}

// ---------- plan „Dzisiaj” ----------

function planInfo() {
  const s = state.settings;
  const start = dayNum(s.planStart);
  const test = dayNum(s.testDate);
  const words = allWords();
  const today = dayNum(todayIso());
  return { ...splitPlan(words, start, test), start, test, words, idx: today - start, daysToTest: test - today };
}

// Oglądany dzień planu (indeks od 0); null = dzisiaj.
let planDay = null;

function viewedDay(info) {
  const today = Math.min(Math.max(info.idx, 0), info.totalDays);
  return planDay === null ? today : Math.min(Math.max(planDay, 0), info.totalDays);
}

// Wpis dnia planu. Dni bez zaliczonego kroku liczy od nowa, gdy zmienią się ustawienia albo dzień jest jeszcze przed nami.
function dayEntry(info, i) {
  const date = isoFromNum(info.start + i);
  const cfg = [state.settings.planStart, state.settings.testDate, WORDS_PER_DAY].join('|');
  const old = state.plan.days[date];
  if (old && (Object.keys(old.done).length || (old.cfg === cfg && i <= info.idx))) return old;
  let e;
  if (i >= info.totalDays) {
    e = { steps: ['mock'], newKeys: [], reviewKeys: [] };
  } else if (i >= info.learnDays + info.mixDays) {
    const weak = info.words.filter(w => !isMastered(w)).sort(weakFirst).slice(0, 20);
    e = { steps: weak.length ? ['weak', 'mock'] : ['mock'], newKeys: [], reviewKeys: weak.map(keyOf) };
  } else if (i >= info.learnDays) {
    // Powtórka mieszana: najpierw nieopanowane, resztę dobiera losowo; do tego do / play.
    const mix = shuffle(info.words).sort(weakFirst).slice(0, 15);
    const nouns = shuffle(info.words.filter(w => splitArticle(w.de))).sort(weakFirst).slice(0, 10);
    const steps = nouns.length ? ['mix', 'articles'] : ['mix'];
    e = { steps, newKeys: [], reviewKeys: shuffle(mix).map(keyOf), artKeys: nouns.map(keyOf) };
  } else {
    // Nowe: słówka przypisane do tego dnia; powtórka z tych, które już były.
    const fresh = info.chunks[i];
    const freshKeys = new Set(fresh.map(keyOf));
    const review = info.words.filter(w => state.stats[keyOf(w)] && !freshKeys.has(keyOf(w))).sort(weakFirst).slice(0, 8);
    const steps = [];
    if (review.length) steps.push('review');
    if (fresh.length) steps.push('cards', 'newtest');
    if (!steps.length) steps.push('mock');
    e = { steps, newKeys: fresh.map(keyOf), reviewKeys: review.map(keyOf) };
  }
  Object.assign(e, { cfg, done: {}, day: i });
  state.plan.days[date] = e;
  save();
  return e;
}

const dayDone = e => !!e && e.steps.every(s => e.done[s]);

const STEP_INFO = {
  review: ['🔁', 'Powtórka z poprzednich dni', 'reviewKeys'],
  cards: ['🃏', 'Nowe słówka: fiszki', 'newKeys'],
  newtest: ['✅', 'Nowe słówka: test', 'newKeys'],
  weak: ['🔁', 'Powtórka nieopanowanych', 'reviewKeys'],
  mix: ['🔀', 'Powtórka mieszana', 'reviewKeys'],
  articles: ['🎸', 'do czy play?', 'artKeys'],
  mock: ['📝', 'Próbny test (wpisywanie)', null],
};

function runStep(step, date) {
  const e = state.plan.days[date];
  if (!e) return;
  const words = keys => keys.map(wordByKey).filter(Boolean);
  const onDone = () => { e.done[step] = true; save(); };
  if (step === 'articles') startTest(words(e.artKeys || []), { type: 'article', all: true, plan: true, onDone });
  if (step === 'review' || step === 'weak' || step === 'mix') startTest(words(e.reviewKeys), { type: 'auto', all: true, plan: true, onDone });
  if (step === 'cards') startCards(words(e.newKeys), { plan: true, onDone });
  if (step === 'newtest') startTest(words(e.newKeys), { type: 'choice', all: true, plan: true, onDone });
  if (step === 'mock') {
    startTest(planInfo().words, { dir: 'pl-de', type: 'type', noRequeue: true, all: true, mock: true, plan: true, onDone });
  }
}

// ---------- mowa ----------

let deVoice = null;

function pickVoice() {
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices();
  deVoice = vs.find(v => v.lang === 'en-GB') || vs.find(v => v.lang && v.lang.startsWith('en')) || null;
}

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const t = String(text).replace(/\(.*?\)/g, '').split('/')[0].replace(/^P\.E\.$/, 'P E').trim();
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(t);
  u.lang = 'en-GB';
  if (deVoice) u.voice = deVoice;
  u.rate = 0.9;
  speechSynthesis.speak(u);
}

function autoSpeak(text) {
  if (state.settings.speak) speak(text);
}

// ---------- widoki ----------

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Angielskie słówko z kolorowym do / play: do niebieski, play czerwony.
function deHtml(de) {
  const a = splitArticle(de);
  if (!a) return esc(de);
  const art = a.paren ? `(${a.art})` : a.art;
  return `<span class="art art-${a.art}">${art}</span> ${esc(a.rest)}`;
}

const fmt = (text, german) => (german ? deHtml(text) : esc(text));

function speakBtn(de, extra = '') {
  return `<button type="button" class="speak ${extra}" data-action="speak" data-text="${esc(de)}" aria-label="Posłuchaj">🔊</button>`;
}

function topbar(idx, total) {
  const pct = total ? Math.round((idx / total) * 100) : 0;
  return `<div class="bar">
    <button class="close" data-action="home" aria-label="Zakończ">✕</button>
    <div class="progress"><span style="width:${pct}%"></span></div>
    <span class="pos">${Math.min(idx + 1, total)}/${total}</span>
  </div>`;
}

function viewToday() {
  const info = planInfo();
  const v = viewedDay(info);
  const e = dayEntry(info, v);
  const date = isoFromNum(info.start + v);
  const mastered = info.words.filter(isMastered).length;
  const fire = streak();
  let title;
  if (v >= info.totalDays) title = info.daysToTest === 0 ? 'Dziś test! Powodzenia 🍀' : info.daysToTest < 0 ? 'Plan zakończony 🎉' : 'Dzień testu 🍀';
  else if (v >= info.learnDays + info.mixDays) title = `Ostatnia prosta · dzień ${v + 1} z ${info.totalDays}`;
  else if (v >= info.learnDays) title = `Powtórka · dzień ${v + 1} z ${info.totalDays}`;
  else title = `Dzień ${v + 1} z ${info.totalDays}`;
  const rel = info.start + v - dayNum(todayIso());
  const label = rel === 0 ? 'Dzisiaj' : rel === -1 ? 'Wczoraj' : rel === 1 ? 'Jutro' : plDate(date);
  const meta = [
    info.daysToTest > 0 ? `do testu <b>${info.daysToTest} ${dni(info.daysToTest)}</b>` : '',
    `umiesz <b>${mastered}/${info.words.length}</b>`,
  ].filter(Boolean).join(' · ');
  const steps = e.steps.map((s, i) => {
    const [ico, label, keys] = STEP_INFO[s];
    const n = keys ? e[keys].length : info.words.length;
    const done = e.done[s];
    return `<button class="step ${done ? 'done' : ''}" data-action="planStep" data-step="${s}" data-date="${date}">
      <span class="num">${done ? '✓' : i + 1}</span><span class="lbl">${ico} ${label}</span><small>${n}</small></button>`;
  }).join('');
  const strip = Array.from({ length: info.totalDays }, (_, i) => {
    const d = state.plan.days[isoFromNum(info.start + i)];
    const cls = [dayDone(d) ? 'done' : i === info.idx ? 'now' : i < info.idx ? 'missed' : '', i === v ? 'sel' : ''].join(' ');
    return `<button class="${cls}" data-action="planGo" data-day="${i}" aria-label="Dzień ${i + 1}, ${plDate(isoFromNum(info.start + i))}">${dayDone(d) ? '★' : '☆'}</button>`;
  }).join('');
  const done = dayDone(e)
    ? `<p class="today-done">Dzień zaliczony! ⭐${rel === 0 ? ' Do jutra!' : ''}</p>`
    : '';
  return `
  <section class="today">
    <div class="daynav">
      <button data-action="planGo" data-day="${v - 1}" ${v > 0 ? '' : 'disabled'} aria-label="Poprzedni dzień">‹</button>
      <small>${esc(label)}</small>
      <button data-action="planGo" data-day="${v + 1}" ${v < info.totalDays ? '' : 'disabled'} aria-label="Następny dzień">›</button>
      ${rel !== 0 && info.idx >= 0 && info.idx <= info.totalDays ? '<button class="daynav-today" data-action="planToday">wróć do dziś</button>' : ''}
    </div>
    <div class="today-head">
      <div><h2>${title}</h2>${info.idx < 0 && v === 0 ? `<small>plan startuje ${esc(plDate(state.settings.planStart))}</small>` : ''}</div>
      ${fire ? `<div class="streak" title="Dni nauki z rzędu">🔥 ${fire}</div>` : ''}
    </div>
    <p class="today-meta">${meta}</p>
    <div class="meter"><span style="width:${Math.round((mastered / Math.max(1, info.words.length)) * 100)}%"></span></div>
    <div class="steps">${steps}</div>
    ${done}
    ${dayDone(e) && v < info.totalDays ? `<button class="next-day" data-action="planGo" data-day="${v + 1}">Następny dzień →</button>` : ''}
    <div class="strip" aria-label="Dni planu">${strip}<button class="flag ${v === info.totalDays ? 'sel' : ''}" data-action="planGo" data-day="${info.totalDays}" aria-label="Dzień testu">🏁</button></div>
  </section>`;
}

function plDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
}

function viewHome() {
  const sel = selectedWords();
  const hard = hardWords();
  const nouns = sel.filter(w => splitArticle(w.de));
  const s = state.settings;
  const dis = sel.length ? '' : 'disabled';
  return `
  <header class="top">
    <h1>English · Unit 1 <span aria-hidden="true">🇬🇧</span></h1>
  </header>
  ${viewToday()}
  <h2 class="section">Wolna nauka</h2>
  <section class="chips">
    ${state.decks.map(d => `<button class="chip ${state.selected.includes(d.id) ? 'on' : ''}" data-action="toggleDeck" data-id="${esc(d.id)}">
      <span>${esc(d.emoji || '📘')}</span>${esc(d.name)}<small>${d.words.length}</small></button>`).join('')}
  </section>
  <p class="count">${sel.length ? `Wybrane słówka: <b>${sel.length}</b>` : 'Zaznacz listy, które chcesz poćwiczyć'}</p>
  <div class="big">
    <button class="big-btn cards" data-action="startCards" ${dis}>
      <span class="ico">🃏</span><span><b>Fiszki</b><small>${LABELS.direction[s.direction]}</small></span>
    </button>
    <button class="big-btn test" data-action="startTest" ${dis}>
      <span class="ico">✅</span><span><b>Test</b><small>${LABELS.testType[s.testType]} · ${LABELS.direction[s.direction]}</small></span>
    </button>
    <div class="levels" aria-label="Fiszki według poziomu">
      ${LEVELS.map(([lvl, ico, label]) => {
        const n = sel.filter(w => levelOf(w) === lvl).length;
        return `<button class="level-btn level-${lvl}" data-action="startCardsLevel" data-level="${lvl}" ${n ? '' : 'disabled'}>
          <span>${ico}</span><b>${label}</b><small>${n} ${n === 1 ? 'fiszka' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'fiszki' : 'fiszek'}</small></button>`;
      }).join('')}
    </div>
    <div class="extra">
      <button class="mini-btn" data-action="startListen" ${dis}><span>🎧</span><b>Posłuchaj i wybierz</b></button>
      <button class="mini-btn" data-action="startArticles" ${nouns.length ? '' : 'disabled'}>
        <span><i class="art art-do">do</i> <i class="art art-play">play</i></span><b>do czy play?</b></button>
    </div>
    ${hard.length ? `<button class="big-btn hard" data-action="startHard">
      <span class="ico">🔁</span><span><b>Trudne słówka</b><small>${hard.length} do powtórki</small></span>
    </button>` : ''}
  </div>`;
}

function viewLists() {
  return `
  <header class="top"><h1>Listy słówek</h1><p class="sub">Dotknij listy, żeby ją zmienić</p></header>
  <ul class="lists">
    ${state.decks.map(d => `<li><button class="list-row" data-action="editDeck" data-id="${esc(d.id)}">
      <span class="ico">${esc(d.emoji || '📘')}</span><span class="name">${esc(d.name)}</span><small>${d.words.length} słówek</small><span class="chev">›</span>
    </button></li>`).join('')}
  </ul>
  <button class="primary wide" data-action="newDeck">+ Nowa lista</button>`;
}

function viewEdit() {
  const d = state.decks.find(x => x.id === editingId) || { name: '', emoji: '📘', words: [] };
  return `
  <header class="top"><h1>${editingId ? 'Edytuj listę' : 'Nowa lista'}</h1></header>
  <div class="form">
    <div class="row2">
      <label class="field emoji"><span>Ikona</span><input id="deck-emoji" maxlength="4" value="${esc(d.emoji || '')}"></label>
      <label class="field"><span>Nazwa</span><input id="deck-name" value="${esc(d.name)}" placeholder="np. Lekcja 5"></label>
    </div>
    <label class="field"><span>Słówka</span>
      <textarea id="deck-text" rows="14" autocapitalize="off" autocorrect="off" spellcheck="false"
        placeholder="dog = pies&#10;cat = kot">${esc(wordsToText(d.words))}</textarea>
    </label>
    <p class="hint">Każde słówko w nowej linii: <b>angielski = polski</b>.
      Kilka znaczeń po ukośniku: <i>mum = mama / matka</i>.</p>
    <button class="primary wide" data-action="saveDeck">Zapisz</button>
    <button class="ghost wide" data-action="lists">Anuluj</button>
    ${editingId ? '<button class="danger wide" data-action="deleteDeck">Usuń listę</button>' : ''}
  </div>`;
}

function seg(key, options) {
  const cur = state.settings[key];
  return `<div class="seg" role="radiogroup">${options.map(([val, label]) =>
    `<button role="radio" aria-checked="${cur === val}" class="${cur === val ? 'on' : ''}" data-action="set" data-key="${key}" data-val="${val}">${label}</button>`).join('')}</div>`;
}

function toggle(key, label, hint) {
  return `<label class="toggle"><span><b>${label}</b>${hint ? `<small>${hint}</small>` : ''}</span>
    <input type="checkbox" data-setting="${key}" ${state.settings[key] ? 'checked' : ''}><i></i></label>`;
}

function viewSettings() {
  const s = state.settings;
  return `
  <header class="top"><h1>Ustawienia</h1></header>
  <div class="settings">
    <section><h2>Plan „Dzisiaj”</h2>
      <div class="row2 dates">
        <label class="field"><span>Początek nauki</span><input type="date" data-date="planStart" value="${esc(s.planStart)}"></label>
        <label class="field"><span>Data testu</span><input type="date" data-date="testDate" value="${esc(s.testDate)}"></label>
      </div>
      <p class="hint">Codziennie ok. ${WORDS_PER_DAY} nowych słówek. Gdy się skończą, są powtórki mieszane.
        Ostatnie 2 dni przed testem to powtórka całości i próbny test.
        Ustaw datę sprawdzianu, a plan sam się przeliczy.</p></section>
    <section><h2>Kierunek</h2>${seg('direction', [['pl-de', 'PL → EN'], ['de-pl', 'EN → PL'], ['mix', 'Mieszany']])}
      <p class="hint">Dotyczy fiszek i testu. Mieszany losuje kierunek przy każdym słówku.</p></section>
    <section><h2>Rodzaj testu</h2>${seg('testType', [['choice', 'Wybór z 3'], ['type', 'Wpisywanie'], ['mix', 'Mix']])}</section>
    <section class="toggles">
      ${toggle('speak', 'Czytaj po angielsku', 'Wymowa słówka po odpowiedzi')}
    </section>
    <p class="hint">Przy wpisywaniu wielkie litery, apostrof i kropki nie są błędem: <b>whats your name</b> i <b>PE</b>
      są zaliczane, a aplikacja pokazuje poprawną pisownię. Po polsku brak ogonków też jest OK.</p>
    <section><h2>Dane</h2>
      <button class="ghost wide" data-action="resetStats">Wyzeruj postępy</button>
      <button class="ghost wide" data-action="resetDecks">Przywróć listy startowe</button>
    </section>
  </div>`;
}

function viewCards() {
  const s = session;
  if (s.idx >= s.queue.length) return cardsSummary();
  const it = s.queue[s.idx];
  const frontDe = it.dir === 'de-pl';
  const front = frontDe ? it.w.de : it.w.pl;
  const back = frontDe ? it.w.pl : it.w.de;
  const also = sameMeaning(it.w, it.dir).map(c => (frontDe ? c.pl : c.de));
  return `
  ${topbar(s.idx, s.queue.length)}
  <div class="stage ${s.flipped ? 'flipped' : ''}" id="stage">
    <button class="flashcard" data-action="flip" aria-label="Odwróć fiszkę">
      <span class="inner">
        <span class="face front"><small>${frontDe ? 'angielski' : 'polski'}</small><b>${fmt(front, frontDe)}</b><em>Dotknij, aby odwrócić</em></span>
        <span class="face back"><small>${frontDe ? 'polski' : 'angielski'}</small><b>${fmt(back, !frontDe)}</b>${also.length
          ? `<em>też: ${also.map(a => fmt(a, !frontDe)).join(', ')}</em>` : ''}</span>
      </span>
    </button>
    <div class="card-tools">${speakBtn(it.w.de, frontDe ? '' : 'only-flipped')}</div>
    <div class="rate">
      <button class="rate-btn no" data-action="cardNo">😕 Jeszcze nie</button>
      <button class="rate-btn yes" data-action="cardYes">😊 Umiem</button>
    </div>
  </div>`;
}

function cardsSummary() {
  const s = session;
  return `
  <div class="summary">
    <div class="big-emoji">${s.unknown.length ? '💪' : '🏆'}</div>
    <h1>Umiesz ${s.known.length} z ${s.queue.length}</h1>
    <p class="sub">${s.unknown.length ? 'Powtórz te, których jeszcze nie znasz.' : 'Wszystkie słówka opanowane!'}</p>
    ${s.unknown.length ? `<button class="primary wide" data-action="repeatCards">Powtórz nieumiane (${s.unknown.length})</button>` : ''}
    ${s.opts.plan ? '<button class="primary wide" data-action="home">Dalej: następny krok →</button>'
      : '<button class="ghost wide" data-action="startTestFromCards">Zrób test z tych słówek</button>'}
    <button class="ghost wide" data-action="home">Wróć</button>
  </div>`;
}

function viewTest() {
  const s = session;
  if (s.idx >= s.items.length) return testSummary();
  const q = s.items[s.idx];
  const toGerman = q.dir === 'pl-de';
  const target = answerOf(q);
  const f = s.feedback;
  let prompt;
  if (q.type === 'listen') {
    prompt = `<small>Posłuchaj i wybierz znaczenie</small>
      <button class="listen-big" data-action="speak" data-text="${esc(q.w.de)}" aria-label="Posłuchaj jeszcze raz">🔊</button>
      ${f ? `<b>${deHtml(q.w.de)}</b>` : '<em class="listen-hint">Dotknij, żeby posłuchać jeszcze raz</em>'}`;
  } else if (q.type === 'article') {
    prompt = `<small>do czy play?</small><b>${f ? deHtml(q.w.de) : esc(splitArticle(q.w.de).rest)}</b>
      <em class="listen-hint">${esc(q.w.pl)}</em>`;
  } else {
    prompt = `<small>${toGerman ? 'Jak to jest po angielsku?' : 'Co to znaczy po polsku?'}</small>
      <b>${fmt(toGerman ? q.w.pl : q.w.de, !toGerman)}</b>${!toGerman ? speakBtn(q.w.de) : ''}`;
  }
  let body;
  if (q.type === 'article') {
    body = `<div class="art-options">${q.options.map((o, i) => {
      const cls = f ? (o === target ? 'right' : o === f.given ? 'wrong' : 'dim') : '';
      return `<button class="art-btn art-bg-${o} ${cls}" data-action="choose" data-i="${i}" ${f ? 'disabled' : ''}>${o}</button>`;
    }).join('')}</div>`;
  } else if (q.type === 'choice' || q.type === 'listen') {
    const german = q.type === 'choice' && toGerman;
    body = `<div class="options">${q.options.map((o, i) => {
      const cls = f ? (o === target ? 'right' : o === f.given ? 'wrong' : 'dim') : '';
      return `<button class="opt ${cls}" data-action="choose" data-i="${i}" ${f ? 'disabled' : ''}>${fmt(o, german)}</button>`;
    }).join('')}</div>`;
  } else {
    body = `<form id="type-form" class="type" autocomplete="off">
      <input id="answer" type="text" lang="${toGerman ? 'en' : 'pl'}" autocapitalize="off" autocomplete="off" autocorrect="off"
        spellcheck="false" enterkeyhint="done" placeholder="${toGerman ? 'Wpisz po angielsku' : 'Wpisz po polsku'}"
        value="${f ? esc(f.given) : ''}" ${f ? 'disabled' : ''} class="${f ? (f.ok ? 'ok' : 'bad') : ''}">
      ${f ? '' : '<button class="primary wide" type="submit">Sprawdź</button>'}
    </form>`;
  }
  let fb = '';
  if (f) {
    const lines = [];
    if (q.type === 'article' || q.type === 'listen') {
      if (!f.ok || q.type === 'listen') lines.push(`<p>${deHtml(q.w.de)} = <b>${esc(q.w.pl)}</b></p>`);
    } else {
      const others = [target, ...sameMeaning(q.w, q.dir).map(c => (toGerman ? c.de : c.pl))].filter(t => t !== f.matched);
      if (f.result === 'close') lines.push(`<p>Poprawna pisownia: <b>${fmt(f.matched, toGerman)}</b></p>`);
      if (!f.ok) lines.push(`<p>Poprawnie: <b>${fmt(target, toGerman)}</b></p>`);
      if (f.ok && q.type === 'type' && others.length) lines.push(`<p>Też dobrze: ${others.map(o => fmt(o, toGerman)).join(', ')}</p>`);
      if (!f.ok && others.length > 1) lines.push(`<p>albo: ${others.slice(1).map(o => fmt(o, toGerman)).join(', ')}</p>`);
    }
    if (f.requeued) lines.push('<p class="again">🔁 To słówko wróci za chwilę.</p>');
    fb = `<div class="feedback ${f.ok ? 'ok' : 'bad'}">
      <p class="fb-title">${f.title}</p>${lines.join('')}
      <div class="fb-actions">${speakBtn(q.w.de)}<button class="primary" data-action="next">Dalej →</button></div>
    </div>`;
  }
  return `
  ${topbar(s.idx, s.items.length)}
  <div class="prompt">${prompt}</div>
  ${body}
  ${fb}`;
}

function testSummary() {
  const s = session;
  const total = s.base;
  const pct = total ? Math.round((s.score / total) * 100) : 0;
  const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  const retried = s.items.length > s.base;
  return `
  <div class="summary">
    <div class="stars">${[1, 2, 3].map(i => `<span class="${i <= stars ? 'on' : ''}">★</span>`).join('')}</div>
    ${s.opts.mock ? '<p class="sub">Wynik próbnego testu</p>' : ''}
    <h1>${s.score} / ${total}</h1>
    <p class="sub">${retried ? 'za pierwszym razem · ' : ''}${pct >= 90 ? 'Rewelacja!' : pct >= 70 ? 'Bardzo dobrze!' : pct >= 40 ? 'Nieźle, ćwicz dalej!' : 'Spróbuj jeszcze raz, dasz radę!'}</p>
    ${s.mistakes.length ? `<ul class="mistakes">${s.mistakes.map(m => {
      const toGerman = m.q.dir === 'pl-de';
      return `<li><span>${fmt(toGerman ? m.q.w.pl : m.q.w.de, !toGerman)}</span><b>${fmt(toGerman ? m.q.w.de : m.q.w.pl, toGerman)}</b></li>`;
    }).join('')}</ul>
    <button class="${s.opts.plan && !s.opts.mock ? 'ghost' : 'primary'} wide" data-action="repeatMistakes">Powtórz błędy (${s.mistakes.length})</button>` : ''}
    ${s.opts.plan ? '<button class="primary wide" data-action="home">Dalej: następny krok →</button>'
      : '<button class="ghost wide" data-action="again">Jeszcze raz</button>'}
    <button class="ghost wide" data-action="home">Wróć</button>
  </div>`;
}

const VIEWS = { home: viewHome, lists: viewLists, edit: viewEdit, settings: viewSettings, cards: viewCards, test: viewTest };
const TABS = [['home', '📚', 'Nauka'], ['lists', '📝', 'Listy'], ['settings', '⚙️', 'Ustawienia']];

function render() {
  document.getElementById('app').innerHTML = VIEWS[view]();
  const tabs = document.getElementById('tabs');
  const tabbed = view === 'home' || view === 'lists' || view === 'settings' || view === 'edit';
  tabs.hidden = !tabbed;
  const active = view === 'edit' ? 'lists' : view;
  tabs.innerHTML = tabbed ? TABS.map(([v, ico, label]) =>
    `<button class="${active === v ? 'on' : ''}" data-action="${v}"><span>${ico}</span>${label}</button>`).join('') : '';
  if (view === 'test' && session && !session.feedback) {
    const input = document.getElementById('answer');
    if (input) input.focus();
  }
}

function go(v) {
  clearTimeout(advanceTimer);
  view = v;
  render();
  window.scrollTo(0, 0);
}

// ---------- akcje ----------

function finishSession() {
  if (session.onDone && !session.finished) {
    session.finished = true;
    session.onDone();
  }
}

function startCards(words, opts = {}) {
  if (!words.length) return;
  session = {
    queue: shuffle(words).map(w => ({ w, dir: pickMode(state.settings.direction, 'pl-de', 'de-pl') })),
    idx: 0, flipped: false, known: [], unknown: [], opts, onDone: opts.onDone,
  };
  go('cards');
  speakCardFront();
}

function speakCardFront() {
  const it = session.queue[session.idx];
  if (it && it.dir === 'de-pl') autoSpeak(it.w.de);
}

function rateCard(knew) {
  const it = session.queue[session.idx];
  (knew ? session.known : session.unknown).push(it.w);
  session.idx++;
  session.flipped = false;
  if (session.idx >= session.queue.length) finishSession();
  render();
  speakCardFront();
}

function startTest(words, opts = {}) {
  if (!words.length) return;
  // Test zawsze ze wszystkich podanych słówek, np. ze wszystkich zaznaczonych dni.
  const chosen = shuffle(words);
  session = {
    items: chosen.map(w => buildQuestion(w, opts)), base: chosen.length, idx: 0, score: 0, mistakes: [],
    feedback: null, words, opts, onDone: opts.onDone,
  };
  go('test');
  speakListen();
}

function speakListen() {
  const q = session.items[session.idx];
  if (q && q.type === 'listen') speak(q.w.de);
}

function answer(given, result, matched) {
  const s = session;
  const q = s.items[s.idx];
  const ok = result !== 'wrong';
  record(q.w, ok);
  if (!q.retry) {
    if (ok) s.score++;
    else s.mistakes.push({ q, given });
  }
  // Błędne słówko wraca 3 pytania później, aż padnie dobra odpowiedź.
  let requeued = false;
  if (!ok && !s.opts.noRequeue) {
    const again = { ...buildQuestion(q.w, { dir: q.dir, type: q.type }), retry: true };
    s.items.splice(Math.min(s.idx + 4, s.items.length), 0, again);
    requeued = true;
  }
  const title = !ok ? 'Ups, nie tym razem' : result === 'close' ? 'Dobrze! 👍' : PRAISE[Math.floor(Math.random() * PRAISE.length)];
  s.feedback = { ok, result, given, title, matched, requeued };
  render();
  if (q.type !== 'listen') autoSpeak(q.w.de);
  // Mowa z timera bywa blokowana na iPhonie, więc przy słuchaniu zawsze „Dalej”.
  if (result === 'exact' && q.type !== 'listen') advanceTimer = setTimeout(nextQuestion, 1100);
}

function nextQuestion() {
  clearTimeout(advanceTimer);
  if (view !== 'test' || !session.feedback) return;
  session.idx++;
  session.feedback = null;
  if (session.idx >= session.items.length) finishSession();
  render();
  speakListen();
}

function submitTyped() {
  const input = document.getElementById('answer');
  if (!input || session.feedback || !input.value.trim()) return;
  const q = session.items[session.idx];
  const toGerman = q.dir === 'pl-de';
  const requireArticle = session.opts.requireArticle ?? state.settings.requireArticle;
  // Zaliczamy każde słówko o tym samym pytaniu (babcia: die Oma albo die Großmutter).
  const targets = [q.w, ...sameMeaning(q.w, q.dir)].map(w => (toGerman ? w.de : w.pl));
  let result = 'wrong';
  let matched = targets[0];
  for (const t of targets) {
    const r = checkTyped(input.value, t, toGerman, requireArticle);
    if (r === 'exact') { result = r; matched = t; break; }
    if (r === 'close' && result === 'wrong') { result = r; matched = t; }
  }
  answer(input.value.trim(), result, matched);
}

const actions = {
  home: () => go('home'),
  lists: () => go('lists'),
  settings: () => go('settings'),
  toggleDeck(el) {
    const id = el.dataset.id;
    state.selected = state.selected.includes(id) ? state.selected.filter(x => x !== id) : [...state.selected, id];
    save();
    render();
  },
  planStep: el => runStep(el.dataset.step, el.dataset.date),
  planGo(el) { planDay = Number(el.dataset.day); render(); },
  planToday() { planDay = null; render(); },
  startCards: () => startCards(selectedWords()),
  startCardsLevel: el => startCards(selectedWords().filter(w => levelOf(w) === el.dataset.level)),
  startTest: () => startTest(selectedWords()),
  startHard: () => startTest(hardWords()),
  startListen: () => startTest(selectedWords(), { type: 'listen' }),
  startArticles: () => startTest(selectedWords().filter(w => splitArticle(w.de)), { type: 'article' }),
  again: () => startTest(session.words, session.opts),
  flip() {
    session.flipped = !session.flipped;
    document.getElementById('stage').classList.toggle('flipped', session.flipped);
    const it = session.queue[session.idx];
    if (session.flipped && it.dir === 'pl-de') autoSpeak(it.w.de);
  },
  cardYes: () => rateCard(true),
  cardNo: () => rateCard(false),
  repeatCards: () => startCards(session.unknown),
  startTestFromCards: () => startTest(session.queue.map(it => it.w)),
  speak: el => speak(el.dataset.text),
  choose(el) {
    const q = session.items[session.idx];
    const given = q.options[Number(el.dataset.i)];
    const target = answerOf(q);
    answer(given, given === target ? 'exact' : 'wrong', target);
  },
  uml(el) {
    const input = document.getElementById('answer');
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? input.value.length;
    input.setRangeText(el.dataset.c, start, end, 'end');
    input.focus();
  },
  next: () => nextQuestion(),
  repeatMistakes() {
    const { onDone, mock, ...opts } = session.opts;
    startTest(session.mistakes.map(m => m.q.w), { ...opts, all: true, plan: false });
  },
  set(el) {
    const key = el.dataset.key;
    state.settings[key] = el.dataset.val;
    save();
    render();
  },
  editDeck(el) { editingId = el.dataset.id; go('edit'); },
  newDeck() { editingId = null; go('edit'); },
  saveDeck() {
    const name = document.getElementById('deck-name').value.trim() || 'Moja lista';
    const emoji = document.getElementById('deck-emoji').value.trim() || '📘';
    const words = parseWords(document.getElementById('deck-text').value);
    if (!words.length) { alert('Dodaj co najmniej jedno słówko w formacie: angielski = polski'); return; }
    const d = state.decks.find(x => x.id === editingId);
    if (d) Object.assign(d, { name, emoji, words });
    else {
      const id = 'l' + Date.now().toString(36);
      state.decks.push({ id, name, emoji, words });
      state.selected.push(id);
    }
    save();
    go('lists');
  },
  deleteDeck() {
    if (!confirm('Usunąć tę listę?')) return;
    state.decks = state.decks.filter(x => x.id !== editingId);
    state.selected = state.selected.filter(x => x !== editingId);
    save();
    go('lists');
  },
  resetStats() {
    if (!confirm('Wyzerować postępy (plan, serię dni i trudne słówka)?')) return;
    state.stats = {};
    state.plan = { days: {} };
    state.activity = {};
    save();
    render();
  },
  resetDecks() {
    if (!confirm('Przywrócić listy startowe? Twoje własne listy zostaną.')) return;
    const fresh = startDecks();
    const ids = fresh.map(d => d.id);
    state.decks = [...fresh, ...state.decks.filter(d => !ids.includes(d.id))];
    save();
    render();
  },
};

function init() {
  state = load();
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el, e);
  });
  // Klawisze umlautów nie zabierają fokusu z pola (na iPhonie klawiatura zostaje).
  document.addEventListener('pointerdown', e => { if (e.target.closest('.uml-key')) e.preventDefault(); });
  document.addEventListener('submit', e => { e.preventDefault(); if (e.target.id === 'type-form') submitTyped(); });
  document.addEventListener('change', e => {
    const key = e.target.dataset.setting;
    if (key) { state.settings[key] = e.target.checked; save(); }
    const date = e.target.dataset.date;
    if (date && /^\d{4}-\d{2}-\d{2}$/.test(e.target.value)) { state.settings[date] = e.target.value; save(); }
  });
  if ('speechSynthesis' in window) {
    pickVoice();
    speechSynthesis.onvoiceschanged = pickVoice;
  }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
  render();
}

if (typeof document !== 'undefined') init();
