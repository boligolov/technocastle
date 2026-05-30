---
title: "ExCSV"
description: "CSV, ale samoopisujący. Wbudowany schemat, metadane, kompaniony SQL i agregacje — zero zależności, przyjazny CLI, wstecznie kompatybilny."
tags: ["Open Source", "Dane", "Specyfikacja"]
lang: pl
date: 2026-03-24
projectSlug: "excsv"
status: active
url: "https://excsv.org"
---

ExCSV (Extended Comma-Separated Values) to samoopisujący się tabelaryczny format danych, który rozszerza zwykły CSV o wbudowany nagłówek z metadanymi, adnotacje schematu kolumn, wstępnie obliczone agregacje oraz kompaniony SQL — zachowując przy tym pełną kompatybilność z każdym istniejącym czytnikiem CSV.

Kluczowa zasada to progresywne rozszerzanie. Zaczynasz od zwykłego pliku CSV. Dodajesz linię `#!excsv`, żeby opisać dialekt. Dodajesz linie `#column`, gdy potrzebujesz typowanego schematu. Dodajesz wiersze agregacji `#%`, gdy konsumenci potrzebują statystyk bez skanowania danych. Dodajesz `#$ddl` i `#$dql`, gdy chcesz dostarczyć schemat bazy danych i zapytania źródłowe razem z danymi — oznaczone tagami dialektów SQL (MySQL, PostgreSQL, ClickHouse i inne obok siebie w jednym pliku).

Wszystkie linie metadanych zaczynają się od `#`, więc `grep`, `awk`, `head` i `cut` działają na sekcji danych bez żadnych modyfikacji. JSON nie jest potrzebny — metadane zapisywane są linia po linii w formacie „klucz=wartość". Łatwo czytać, łatwo pisać, łatwo porównywać.

Format obsługuje również kontener ZIP (`.excsv.zip`), który zawiera podsumowanie w komentarzu archiwum — można odczytać schemat i agregacje bez rozpakowywania.

ExCSV jest inspirowany formatami ECSV od Astropy i Annotated CSV od InfluxDB, łącząc mocne strony obu, pozostając jednocześnie prostszym i wygodniejszym do pracy z wiersza poleceń. Specyfikacja jest wydana na licencji CC0 1.0.

[Repozytorium na GitHub](https://github.com/boligolov/excsv) · [Specyfikacja i przykłady](https://excsv.org)
