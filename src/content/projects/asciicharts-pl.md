---
title: "ASCII Charts"
description: "Zestaw narzędzi i skill agenta do tworzenia wykresów tekstowych w czatach agentów AI, terminalach, logach CI i dokumentacji."
tags: ["Open Source", "Python", "Agenci AI", "CLI", "Wizualizacja"]
lang: pl
date: 2026-09-21
projectSlug: "asciicharts"
status: active
url: "https://github.com/boligolov/asciicharts"
---

ASCII Charts tworzy wykresy tam, gdzie obrazy są niewygodne lub niedostępne: w odpowiedziach agentów AI, terminalach i sesjach SSH, logach CI, opisach pull requestów oraz dokumentacji tekstowej. Przyjmuje liczby lub CSV i zwraca gotowy do wklejenia tekst o stałej szerokości.

Renderer jest napisany w Pythonie i nie wymaga zewnętrznych zależności: główny plik można po prostu skopiować do repozytorium albo zadania CI. Wynik jest deterministyczny, dzięki czemu wykresy nadają się do przechowywania w Git, porównywania w diffach i testów snapshotowych.

Obsługiwane są poziome i pionowe wykresy słupkowe, linie, obszary, sparklines, scatter plot, dot plot, histogramy, box plot, wykresy kołowe, heatmapy oraz wykresy z dwiema osiami. Dostępne są grupowanie, stosy, wartości ujemne, style Unicode i czysty ASCII dla ograniczonych fontów terminalowych.

Projekt zawiera gotowy skill agenta, który pomaga dobrać typ wykresu, przetworzyć CSV i wygenerować czytelny wynik bezpośrednio w czacie. Dla integracji dostępny jest również bezstanowy serwer MCP z narzędziami katalogu i renderowania.

## Przykłady

#### Line (threshold + points)

<pre>
┌─────────────────────────────────────────────────────────────────────┐
│                        Response time vs SLA                         │
├─────────────────────────────────────────────────────────────────────┤
│    60 ┤                                   ··●·                      │
│ 54.29 ┤                               ·●··    ··                    │
│ 48.57 ┤- - - - - - - - - - - - - - -·- - - - - -·●·- - - - - - - -  │
│ 42.86 ┤                    ·●··   ··               ···              │
│ 37.14 ┤                  ··    ··●                    ·●··          │
│ 31.43 ┤               ·●·                                 ··●··     │
│ 25.71 ┤   ··●··    ···                                         ···● │
│    20 ┤●··     ··●·                                                 │
│                                                                     │
│ - - threshold: 50                                                   │
└─────────────────────────────────────────────────────────────────────┘
</pre>


#### HBar
<pre>
┌────────────────────────────────────────────────────────────────┐
│               Estimated sales growth (diverging)               │
├────────────────────────────────────────────────────────────────┤
│ ABB          │                     ████|                -8.20  │
│ Aetna        │                         ███              4.90   │
│ Apple        │                         ████████████████ 27.60  │
│ Bankers Pet. │ ████████████████████████|                -42.80 │
│ Biogen       │                         █████            7.80   │
└────────────────────────────────────────────────────────────────┘
</pre>

[Galeria wszystkich typów i stylów wykresów](https://github.com/boligolov/asciicharts/blob/master/docs/gallery.md)

[Kod źródłowy i dokumentacja na GitHubie](https://github.com/boligolov/asciicharts)
