---
title: "ExCSV"
description: "CSV, but self-describing. Inline schema, metadata, SQL companions, and aggregations — zero dependencies, CLI-friendly, backward-compatible."
tags: ["Open Source", "Data", "Specification"]
lang: en
date: 2026-03-24
projectSlug: "excsv"
status: active
url: "https://excsv.org"
---

ExCSV (Extended Comma-Separated Values) is a self-describing tabular data format that extends plain CSV with an inline metadata header, column schema annotations, pre-computed aggregations, and SQL companions — all without breaking compatibility with any existing CSV reader.

The core idea is progressive enhancement. You start with a regular CSV file. Add a `#!excsv` header line to declare the dialect. Add `#column` lines when you need typed schemas. Add `#%` aggregation rows when consumers need stats without scanning the data. Add `#$ddl` and `#$dql` lines when you want to ship the database schema and provenance queries alongside the data itself, tagged per SQL dialect (MySQL, PostgreSQL, ClickHouse, and others side-by-side in the same file).

All metadata lines start with `#`, so `grep`, `awk`, `head`, and `cut` work on the data section out of the box. No JSON required — metadata is line-oriented key-value, not a nested structure. Easy to read, easy to write, easy to diff.

The format also supports a ZIP container (`.excsv.zip`) that carries its summary in the archive comment — you can read schema and aggregations without unzipping.

ExCSV is inspired by Astropy's ECSV and InfluxDB's Annotated CSV, combining the strengths of both while staying simpler and more CLI-friendly. The specification is released under CC0 1.0.

[GitHub repository](https://github.com/boligolov/excsv) · [Specification & examples](https://excsv.org)
