---
title: "ASCII Charts"
description: "A toolkit and agent skill for rendering text charts in AI-agent chats, terminals, CI logs, and documentation."
tags: ["Open Source", "Python", "AI Agents", "CLI", "Visualization"]
lang: en
date: 2026-09-21
projectSlug: "asciicharts"
status: active
url: "https://github.com/boligolov/asciicharts"
---

ASCII Charts renders charts using pseudographics, wherever images or multimedia data aren't available. It can be used in AI-agent replies, terminals and SSH sessions, CI logs, pull-request descriptions, and plain-text documents. Feed it numbers or CSV and it returns a ready-to-paste monospace string.

The renderer is written in Python and has no third-party dependencies: its main file can simply be copied into a repository or CI job. Output is deterministic, making charts suitable for Git, readable diffs, and snapshot tests.

It supports horizontal and vertical bars, lines, areas, sparklines, scatter plots, dot plots, histograms, box plots, pie charts, heatmaps, and dual-axis charts. Grouping, stacking, negative values, Unicode styles, and pure ASCII output for limited terminal fonts are included.

The project ships with an agent skill that helps an agent choose a suitable chart, process CSV data, and produce readable output directly in chat. A stateless MCP server with chart-catalogue and rendering tools is also available for integrations.

## Examples

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

[Gallery of every chart type and style](https://github.com/boligolov/asciicharts/blob/master/docs/gallery.md)

[Source code and documentation on GitHub](https://github.com/boligolov/asciicharts)
