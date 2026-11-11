"""Generuje test-A.html, test-B.html, test-C.html (Unit 1 „Classmates”) z kluczem odpowiedzi.
Uruchom: python3 generuj-testy.py  (pliki powstają obok skryptu)."""
import html
from pathlib import Path

OUT = Path(__file__).resolve().parent
E = html.escape

CSS = """
  @page { size: A4; margin: 13mm 15mm 13mm 15mm; }
  * { box-sizing: border-box; }
  body { font: 11pt/1.45 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #111; margin: 0; }
  h1 { font-size: 17pt; margin: 0 0 1mm; }
  .sub { color: #444; margin: 0 0 4mm; font-size: 10pt; }
  .head { display: grid; grid-template-columns: 2.2fr 1fr 1fr 0.8fr; gap: 6mm; margin-bottom: 5mm; font-size: 10.5pt; }
  .head div { border-bottom: 1px solid #111; padding-top: 6mm; }
  .ver { float: right; font-size: 22pt; font-weight: 800; border: 2.5px solid #1f2a5a; color: #1f2a5a; border-radius: 3mm; padding: 0 4mm; }
  .chapter { font-size: 9.5pt; text-transform: uppercase; letter-spacing: .08em; color: #1f2a5a; font-weight: 700;
    border-bottom: 2px solid #1f2a5a; padding-bottom: 1mm; margin: 5mm 0 3mm; break-after: avoid; page-break-after: avoid; }
  .task { break-inside: avoid; margin-bottom: 4.5mm; }
  .q { display: flex; gap: 3mm; align-items: baseline; }
  .q .n { font-weight: 800; min-width: 7mm; }
  .q .t { flex: 1; font-weight: 600; }
  .q .p { white-space: nowrap; font-size: 9.5pt; color: #444; border: 1px solid #999; border-radius: 2mm; padding: .3mm 2mm; }
  .body { margin-left: 10mm; }
  .line { height: 8mm; border-bottom: 1px dotted #777; }
  .blank { display: inline-block; min-width: 30mm; border-bottom: 1px solid #333; height: 1.1em; vertical-align: -2px; }
  .blank.s { min-width: 16mm; }
  .blank.l { min-width: 55mm; }
  ol.items { margin: 1.5mm 0 0; padding-left: 6mm; }
  ol.items li { margin-bottom: 2.6mm; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8mm; }
  .grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 6mm; }
  table { border-collapse: collapse; width: 100%; margin-top: 2mm; font-size: 10.5pt; }
  th, td { border: 1px solid #555; padding: 1.8mm 2mm; vertical-align: top; text-align: left; }
  th { background: #f1f1f1; }
  .tf td:nth-child(n+2), .tf th:nth-child(n+2) { width: 14mm; text-align: center; }
  .text { border: 1.5px solid #1f2a5a; border-radius: 3mm; padding: 2.5mm 4mm; margin: 1mm 0 2mm; font-size: 10.5pt; }
  .text h4 { margin: 0 0 1mm; font-size: 11pt; }
  .hint { font-size: 9.5pt; color: #555; font-weight: 400; }
  .bank { border: 1px dashed #777; border-radius: 2mm; padding: 1.5mm 3mm; margin: 1mm 0 2mm; display: inline-block; }
  .page-break { break-before: page; }
  .key h1 { font-size: 15pt; margin-bottom: 1mm; }
  .key ol { padding-left: 6mm; margin: 0 0 2mm; }
  .key li { margin-bottom: .8mm; font-size: 10pt; line-height: 1.3; }
  .key h3 { font-size: 10.5pt; margin: 3mm 0 1mm; }
  .scale { width: auto; margin-top: 3mm; }
  .scale td, .scale th { padding: 1.2mm 4mm; }
"""

# Wspólny typ zadań; treści różnią się w wersjach.
TESTS = {
    'A': {
        'subjects': [
            ('We learn about the past.', 'History'),
            ('We play football and run.', 'P.E.'),
            ('We sing songs and play the guitar.', 'Music'),
            ('We learn about different countries and maps.', 'Geography'),
            ('We do experiments.', 'Science'),
            ('We paint pictures.', 'Art'),
        ],
        'words': [('piórnik', 'pencil case'), ('linijka', 'ruler'), ('nożyczki', 'scissors'),
                  ('stołówka', 'canteen'), ('sala gimnastyczna', 'gym'), ('pokój nauczycielski', 'staff room')],
        'doplay': [('judo', 'do'), ('the piano', 'play'), ('chess', 'play'), ('ballet', 'do'), ('tennis', 'play'), ('pottery', 'do')],
        'verbs': [
            ('My sister', 'watch', 'TV after dinner.', 'watches'),
            ('Tom', 'study', 'English every day.', 'studies'),
            ('We', 'walk', 'to school in summer.', 'walk'),
            ('Elena', 'have', 'breakfast at 7.30.', 'has'),
            ('He', 'go', 'to bed at 9 p.m.', 'goes'),
            ('My parents', 'like', 'pizza.', 'like'),
        ],
        'neg': [
            ('I play the drums.', "I don't play the drums."),
            ('Anna does karate.', "Anna doesn't do karate."),
            ('We have Maths on Friday.', "We don't have Maths on Friday."),
            ('My dad watches football.', "My dad doesn't watch football."),
        ],
        'qs': [
            ('you like Science?', 'Yes, I', 'Do', 'do'),
            ('Lucas lose things?', 'Yes, he', 'Does', 'does'),
            ('your friends play basketball?', 'No, they', 'Do', "don't"),
        ],
        'order': [
            ('always / I / get up / at 7 o\'clock', "I always get up at 7 o'clock."),
            ('late / is / never / she / for school', 'She is never late for school.'),
            ('sometimes / we / pizza / have / on Friday', 'We sometimes have pizza on Friday.'),
            ('often / Tom / to the park / goes', 'Tom often goes to the park.'),
        ],
        'prep': [('Monday', 'on'), ('the morning', 'in'), ("8 o'clock", 'at'), ('the weekend', 'at'),
                 ('Friday afternoon', 'on'), ('the evening', 'in')],
        'info': [
            ('My name is Kate Grey.', "What's your name?"),
            ('G-R-E-Y.', 'How do you spell that?'),
            ('I live at 12 Green Street, Oxford.', 'Where do you live?'),
            ("It's kate.grey@mail.com.", "What's your email address?"),
            ("It's 07765 334128.", "What's your phone number?"),
        ],
        'reading': ('My school day', """Hi, I'm Ben and I'm twelve. On weekdays I get up at 7 o'clock. I have toast and milk
for breakfast and then I walk to school with my brother. Lessons start at 8.30. My favourite subject is P.E. because I love
sport. At lunchtime I eat in the canteen with my friends. After school I play football in the park. I never watch TV in the
evening – I read books or play the guitar. My favourite day is Saturday because I don't go to school!""", [
            ('Ben gets up at 7 o\'clock on weekdays.', 'T'),
            ('He goes to school by bus.', 'F'),
            ('His favourite subject is Maths.', 'F'),
            ('He has lunch in the canteen.', 'T'),
            ('He often watches TV in the evening.', 'F'),
        ]),
        'writing': 'Napisz 6 zdań o swoim <b>ulubionym dniu tygodnia</b>. Użyj co najmniej dwóch przysłówków częstotliwości (always, usually, often, sometimes, never) i wyrażeń z <b>at, in, on</b>.',
    },
    'B': {
        'subjects': [
            ('We speak and read in English.', 'English'),
            ('We learn French words.', 'French'),
            ('We use computers.', 'Computer Studies'),
            ('We count and do sums.', 'Maths'),
            ('We learn about kings and the past.', 'History'),
            ('We play the piano and sing.', 'Music'),
        ],
        'words': [('kalkulator', 'calculator'), ('słownik', 'dictionary'), ('gumka', 'rubber'),
                  ('trampki', 'trainers'), ('biblioteka', 'library'), ('plac zabaw, boisko', 'playground')],
        'doplay': [('karate', 'do'), ('football', 'play'), ('the guitar', 'play'), ('judo', 'do'), ('the drums', 'play'), ('ballet', 'do')],
        'verbs': [
            ('Lucas sometimes', 'lose', 'things.', 'loses'),
            ('My mum', 'finish', 'work at 5 p.m.', 'finishes'),
            ('They', 'play', 'chess after school.', 'play'),
            ('The bird', 'fly', 'in the sky.', 'flies'),
            ('Amy', 'do', 'her homework at school.', 'does'),
            ('I', 'listen', 'to music on the bus.', 'listen'),
        ],
        'neg': [
            ('She likes football.', "She doesn't like football."),
            ('I have a laptop.', "I don't have a laptop."),
            ('Rocco paints pictures.', "Rocco doesn't paint pictures."),
            ('They walk to school.', "They don't walk to school."),
        ],
        'qs': [
            ('Carla play the guitar?', 'Yes, she', 'Does', 'does'),
            ('you do judo?', 'No, I', 'Do', "don't"),
            ('Big Al like his new hobby?', 'Yes, he', 'Does', 'does'),
        ],
        'order': [
            ('usually / I / breakfast / have / at home', 'I usually have breakfast at home.'),
            ('is / always / happy / my dog', 'My dog is always happy.'),
            ('never / Elena / football / watches', 'Elena never watches football.'),
            ('often / we / noisy / are / in class', 'We are often noisy in class.'),
        ],
        'prep': [('lunchtime', 'at'), ('Tuesday', 'on'), ('the afternoon', 'in'), ("9 o'clock", 'at'),
                 ('Sunday morning', 'on'), ('a weekday', 'on')],
        'info': [
            ("Yes, I'd like to join the chess club, please.", 'Can I help you?'),
            ('My name is Oliver Brown.', "What's your name?"),
            ('B-R-O-W-N.', 'How do you spell that?'),
            ('I live at 5 Park Road, London.', 'Where do you live?'),
            ("It's 07723 115846.", "What's your phone number?"),
        ],
        'reading': ('A day at my school', """My name is Mia. I go to a boarding school in England, so I live at my school.
I wake up at 6.45 and I have breakfast in the canteen. Lessons start at 9.00 and finish at 3.30. I love Art – I paint
pictures every day! In the afternoon I sometimes go to the library. In the evening I do karate in the gym. I miss my parents,
but I phone them on Sundays. My favourite day is Wednesday because we have two Art lessons.""", [
            ('Mia lives at her school.', 'T'),
            ('She has breakfast at home.', 'F'),
            ('Lessons finish at 3.30.', 'T'),
            ('She does karate in the library.', 'F'),
            ('Her favourite day is Wednesday.', 'T'),
        ]),
        'writing': 'Napisz 6 zdań o swoim <b>typowym dniu szkolnym</b> (o której wstajesz, zaczynasz lekcje, co robisz po szkole i wieczorem). Użyj co najmniej dwóch przysłówków częstotliwości i wyrażeń z <b>at, in, on</b>.',
    },
    'C': {
        'subjects': [
            ('We paint and draw.', 'Art'),
            ('We learn about plants, animals and do experiments.', 'Science'),
            ('We run and play games in the gym.', 'P.E.'),
            ('We learn about maps and countries.', 'Geography'),
            ('We use laptops and computers.', 'Computer Studies'),
            ('We speak French.', 'French'),
        ],
        'words': [('mapa', 'map'), ('farby', 'paints'), ('słownik', 'dictionary'),
                  ('korytarz, aula', 'hall'), ('sala lekcyjna', 'classroom'), ('pracownia komputerowa', 'computer room')],
        'doplay': [('basketball', 'play'), ('karate', 'do'), ('pottery', 'do'), ('the piano', 'play'), ('tennis', 'play'), ('judo', 'do')],
        'verbs': [
            ('Tom', 'love', 'sport.', 'loves'),
            ('My brother', 'wash', 'the car on Sunday.', 'washes'),
            ('She', 'have', 'Maths on Monday.', 'has'),
            ('We', 'meet', 'friends after school.', 'meet'),
            ('Anna', 'go', 'to the cinema at the weekend.', 'goes'),
            ('The baby', 'cry', 'at night.', 'cries'),
        ],
        'neg': [
            ("Freddie and Fifi like Carla's paintings.", "Freddie and Fifi don't like Carla's paintings."),
            ('Big Al plays the guitar.', "Big Al doesn't play the guitar."),
            ('I watch TV in the morning.', "I don't watch TV in the morning."),
            ('School starts at 8 o\'clock.', "School doesn't start at 8 o'clock."),
        ],
        'qs': [
            ('your dad do karate?', 'No, he', 'Does', "doesn't"),
            ('they live in London?', 'Yes, they', 'Do', 'do'),
            ('Amy have breakfast at home?', 'Yes, she', 'Does', 'does'),
        ],
        'order': [
            ('never / I / chicken / have / for lunch', 'I never have chicken for lunch.'),
            ('are / sometimes / Elena and Amy / noisy', 'Elena and Amy are sometimes noisy.'),
            ('usually / Tom / TV / watches / after dinner', 'Tom usually watches TV after dinner.'),
            ('always / you / late / are / for English', 'You are always late for English.'),
        ],
        'prep': [('the weekend', 'at'), ('Wednesday', 'on'), ('7.30', 'at'), ('the evening', 'in'),
                 ('Monday morning', 'on'), ('the morning', 'in')],
        'info': [
            ("Yes, I'd like to join the art club.", 'Can I help you?'),
            ('My name is Daisy Smith.', "What's your name?"),
            ('S-M-I-T-H.', 'How do you spell that?'),
            ("It's daisy.smith@xnet.com.", "What's your email address?"),
            ('I live at 17 Park Road, Oxford.', 'Where do you live?'),
        ],
        'reading': ('My favourite day', """Hi! I'm Lily. My favourite day is Friday. I get up at 7.15 and I have cereal for
breakfast. I go to school by bike. On Friday we have Music and P.E. – my favourite subjects! At lunchtime I usually play table
tennis with my friends. After school I go to the swimming pool with my sister. In the evening we have pizza and watch a film.
I never do homework on Friday evening!""", [
            ('Lily gets up at 7.15.', 'T'),
            ('She walks to school.', 'F'),
            ('She has Music on Friday.', 'T'),
            ('At lunchtime she often plays basketball.', 'F'),
            ('She does her homework on Friday evening.', 'F'),
        ]),
        'writing': 'Napisz 6 zdań o <b>dniu swojego kolegi lub koleżanki</b> (he / she!), np. <i>Ola gets up at 7.</i> Użyj co najmniej dwóch przysłówków częstotliwości i wyrażeń z <b>at, in, on</b>. Uważaj na końcówkę <b>-s</b>!',
    },
}

POINTS = [6, 6, 6, 6, 4, 6, 4, 6, 5, 5, 6]
TOTAL = sum(POINTS)


def task(n, title, body, hint=''):
    h = f' <span class="hint">{hint}</span>' if hint else ''
    return (f'<div class="task"><div class="q"><span class="n">{n}.</span><span class="t">{title}{h}</span>'
            f'<span class="p">&nbsp;&nbsp;&nbsp;/ {POINTS[n - 1]} pkt</span></div><div class="body">{body}</div></div>')


def lines(k):
    return ''.join('<div class="line"></div>' for _ in range(k))


def build(v, d):
    out = []
    out.append(f'<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>Sprawdzian Unit 1 – wersja {v}</title><style>{CSS}</style></head><body>')
    out.append(f'<span class="ver">{v}</span><h1>Sprawdzian z angielskiego – Unit 1 „Classmates”</h1>')
    out.append('<p class="sub">Słownictwo · Present Simple · do/play · at, in, on · przysłówki częstotliwości · pytania o dane · czytanie · pisanie</p>')
    out.append(f'<div class="head"><div>Imię i nazwisko:</div><div>Data:</div><div>Punkty: &nbsp;&nbsp;&nbsp;&nbsp;/ {TOTAL}</div><div>Ocena:</div></div>')

    out.append('<div class="chapter">Vocabulary – słownictwo</div>')
    items = ''.join(f'<li>{E(s)} → <span class="blank l"></span></li>' for s, _ in d['subjects'])
    out.append(task(1, 'Napisz nazwę przedmiotu szkolnego po angielsku.', f'<ol class="items">{items}</ol>'))
    items = ''.join(f'<li>{E(pl)} – <span class="blank"></span></li>' for pl, _ in d['words'])
    out.append(task(2, 'Napisz po angielsku (przybory i miejsca w szkole).', f'<ol class="items grid2">{items}</ol>'))
    items = ''.join(f'<li><span class="blank s"></span> {E(w)}</li>' for w, _ in d['doplay'])
    out.append(task(3, 'Wpisz <i>do</i> albo <i>play</i>.', f'<ol class="items grid3">{items}</ol>'))

    out.append('<div class="chapter">Grammar – gramatyka</div>')
    items = ''.join(f'<li>{E(a)} <span class="blank"></span> ({E(vb)}) {E(b)}</li>' for a, vb, b, _ in d['verbs'])
    out.append(task(4, 'Wpisz czasownik z nawiasu w odpowiedniej formie (Present Simple).', f'<ol class="items">{items}</ol>'))
    items = ''.join(f'<li>{E(s)}<div class="line"></div></li>' for s, _ in d['neg'])
    out.append(task(5, 'Zamień zdania na przeczenia (don\'t / doesn\'t).', f'<ol class="items">{items}</ol>'))
    items = ''.join(f'<li><span class="blank s"></span> {E(q)} – {E(a)} <span class="blank s"></span>.</li>' for q, a, _, _ in d['qs'])
    out.append(task(6, 'Uzupełnij pytania (<i>Do</i> / <i>Does</i>) i krótkie odpowiedzi.', f'<ol class="items">{items}</ol>', '(1 pkt za każdą lukę)'))
    items = ''.join(f'<li>{E(s)}<div class="line"></div></li>' for s, _ in d['order'])
    out.append(task(7, 'Ułóż wyrazy w poprawnej kolejności.', f'<ol class="items">{items}</ol>'))
    items = ''.join(f'<li><span class="blank s"></span> {E(w)}</li>' for w, _ in d['prep'])
    out.append(task(8, 'Wpisz <i>at</i>, <i>in</i> albo <i>on</i>.', f'<ol class="items grid3">{items}</ol>'))

    out.append('<div class="chapter">Speaking – pytania o dane</div>')
    items = ''.join(f'<li>A: <span class="blank l" style="min-width:90mm"></span><br>B: {E(a)}</li>' for a, _ in d['info'])
    out.append(task(9, 'Napisz pytania do tych odpowiedzi.', f'<ol class="items">{items}</ol>'))

    out.append('<div class="chapter">Reading – czytanie</div>')
    title, text, tf = d['reading']
    rows = ''.join(f'<tr><td>{i}. {E(s)}</td><td></td><td></td></tr>' for i, (s, _) in enumerate(tf, 1))
    out.append(task(10, 'Przeczytaj tekst. Zaznacz T (true – prawda) albo F (false – fałsz).',
                    f'<div class="text"><h4>{E(title)}</h4>{E(" ".join(text.split()))}</div>'
                    f'<table class="tf"><tr><th>zdanie</th><th>T</th><th>F</th></tr>{rows}</table>'))

    out.append('<div class="chapter">Writing – pisanie</div>')
    out.append(task(11, d['writing'], lines(9), '(1 pkt za każde poprawne zdanie)'))

    # klucz
    out.append(f'<div class="page-break key"><h1>Klucz odpowiedzi – wersja {v}</h1><p class="sub">Dla rodzica. Razem {TOTAL} pkt.</p>')
    def kl(n, title, arr):
        return f'<h3>{n}. {title} ({POINTS[n - 1]} pkt)</h3><ol>' + ''.join(f'<li>{x}</li>' for x in arr) + '</ol>'
    out.append('<div class="grid2"><div>')
    out.append(kl(1, 'Przedmioty', [E(a) for _, a in d['subjects']]))
    out.append(kl(2, 'Słówka', [E(a) for _, a in d['words']]))
    out.append(kl(3, 'do / play', [f'<b>{E(a)}</b> {E(w)}' for w, a in d['doplay']]))
    out.append(kl(4, 'Present Simple', [f'{E(a)} <b>{E(ans)}</b> {E(b)}' for a, _, b, ans in d['verbs']]))
    out.append(kl(8, 'at / in / on', [f'<b>{E(a)}</b> {E(w)}' for w, a in d['prep']]))
    out.append('</div><div>')
    out.append(kl(5, 'Przeczenia', [E(a) for _, a in d['neg']]))
    out.append(kl(6, 'Do / Does + krótkie odpowiedzi', [f'<b>{E(q1)}</b> {E(q)} – {E(a)} <b>{E(a2)}</b>.' for q, a, q1, a2 in d['qs']]))
    out.append(kl(7, 'Szyk zdania', [E(a) for _, a in d['order']]))
    out.append(kl(9, 'Pytania', [E(a) for _, a in d['info']]))
    out.append(kl(10, 'Czytanie', [f'{E(s)} – <b>{a}</b>' for s, a in tf]))
    out.append('</div></div>')
    out.append('<h3>11. Pisanie (6 pkt)</h3><p style="font-size:10pt">1 pkt za każde zrozumiałe zdanie na temat, bez błędów w formie czasownika '
               '(he/she + -s, don\'t/doesn\'t). Drobne błędy w pisowni nie odbierają punktu. Zad. 5, 7, 9: zdanie liczy się, gdy jest poprawne gramatycznie '
               '(skróty i pełne formy – <i>don\'t / do not</i>, <i>What\'s / What is</i> – są równie dobre).</p>')
    pct = [(96, 'celujący (6)'), (86, 'bardzo dobry (5)'), (71, 'dobry (4)'), (51, 'dostateczny (3)'), (31, 'dopuszczający (2)'), (0, 'niedostateczny (1)')]
    rows = []
    hi = TOTAL
    for p, g in pct:
        lo = -(-p * TOTAL // 100)  # zaokrąglenie w górę
        rows.append(f'<tr><td>{lo}–{hi} pkt</td><td>{p}%+</td><td>{g}</td></tr>')
        hi = lo - 1
    out.append('<h3>Orientacyjna skala ocen</h3><table class="scale"><tr><th>punkty</th><th>procent</th><th>ocena</th></tr>' + ''.join(rows) + '</table>')
    out.append('</div></body></html>')
    return '\n'.join(out)


for v, d in TESTS.items():
    assert [len(d['subjects']), len(d['words']), len(d['doplay']), len(d['verbs']), len(d['neg']), len(d['qs']) * 2,
            len(d['order']), len(d['prep']), len(d['info']), len(d['reading'][2])] == POINTS[:10], v
    (OUT / f'test-{v}.html').write_text(build(v, d), encoding='utf-8')
    print('ok', v)
