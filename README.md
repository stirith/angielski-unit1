# English – Unit 1 (Classmates)

PWA do nauki słówek z Unit 1 podręcznika „English Class A1+” (Classmates): fiszki i test (wybór z 3, wpisywanie albo mix),
kierunek PL→EN, EN→PL lub mieszany. Kopia aplikacji `slowka-niemiecki`, przerobiona na angielski.
Bez serwera i bez kont, wszystko w przeglądarce (`localStorage`).

- **108 słówek w 11 listach**: przedmioty, przybory, mój dzień, Out of class, jak często (always…never), do i play,
  pytania o dane, miejsca w szkole, słówka z czytanki, dni tygodnia, at/in/on (Wordlist str. 19 + str. 18, 13).
- Przy wpisywaniu wielkie litery, apostrof i kropki nie są błędem (`whats your name`, `PE`), po polsku brak ogonków też nie.
- Zamiast rodzajników z wersji niemieckiej jest tryb **„do czy play?”** (do niebieski, play czerwony).
- **Plan „Dzisiaj”**: po 10 nowych słówek dziennie od daty startu, potem powtórki i do/play, ostatnie 2 dni przed
  sprawdzianem to powtórka i próbny test. Datę startu i sprawdzianu zmienisz w Ustawieniach (domyślnie 11.11 → 25.11.2026).
- Wymowa: głos en-GB (🔊), tryb „Posłuchaj i wybierz”.
- Pole `de` w kodzie oznacza słówko obce (tu: angielskie) – nazwa została z wersji niemieckiej.

## Materiały do druku (`druk/`)

- `powtorka-unit1.pdf` – co trzeba umieć: słownictwo, Present Simple, do/play, at/in/on, przysłówki częstotliwości, pytania o dane, pisanie.
- `test-A.pdf`, `test-B.pdf`, `test-C.pdf` – trzy wersje sprawdzianu (60 pkt) z kluczem odpowiedzi na ostatniej stronie.

PDF-y powstają z plików `.html` w tym samym folderze (Chrome headless, `--print-to-pdf`).

## Uruchomienie lokalne

```sh
python3 -m http.server 8765
```

## Instalacja na iPhonie

Adres: https://stirith.github.io/angielski-unit1/ → w Safari
**Udostępnij → Do ekranu początkowego**. Działa offline. Po zmianie plików podbij `CACHE` w `sw.js`.
