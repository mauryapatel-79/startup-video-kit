# Writing the script

## Format

`SCRIPT.md` is one table plus a word count. The table is the contract between narration and picture.

```markdown
# <Product> - <recipe> - <length>s - <aspect>

| # | Time | On screen (text) | Narration | Visual |
| --- | --- | --- | --- | --- |
| 1 | 0–3 | Still copying data by hand? | Still copying data between tools by hand? | Kinetic type over a blur of spreadsheet tabs |
| 2 | 3–10 | | Every week your team loses hours to it. | Real screen: CSV export dialog, cursor, sped up |
| ... | | | | |

Narration: 112 words / budget 125 · CTA: "Start free at acme.com"
```

## Rules

- **Budget.** 2.5 words per second. Leave 0.5 s of air after each scene's last word.
- **Hook in 2 seconds.** Open on the problem, the result, or a number. Never on the logo.
- **One idea per scene.** If a line needs "and", split it.
- **Write for the ear.** Short words, contractions, numbers spoken as people say them ("two hours", not "2h").
- **On-screen text ≠ narration.** Text is 3–7 words and reinforces; narration explains. Do not caption the narration in the scene text (captions do that).
- **Concrete over abstract.** "Turns a 40-minute report into one click" beats "streamlines workflows".
- **Proof only from the brief.** No invented numbers, logos, testimonials or awards.
- **One CTA.** One verb, one place: "Start free at acme.com". Same words spoken and shown.

## Banned phrases

"revolutionize", "game-changer", "seamless", "cutting-edge", "next-level", "unlock the power of", "in today's fast-paced world", "say goodbye to", "look no further", "elevate". Replace each with what the product actually does.

## Hook formulas

| Formula | Example |
| --- | --- |
| Problem question | "Still writing release notes by hand?" |
| Result first | "This report took 4 seconds." |
| Number | "Teams lose 6 hours a week to status meetings." (only with a source) |
| Contrarian | "Your dashboard is lying to you." |
| Before/after | Split screen: the old way vs. the product, no words needed |

## Story structures

- **PAS** (problem, agitate, solve): best for launch films and ads.
- **BAB** (before, after, bridge): best for feature announcements.
- **Job story** ("When I…, I want to…, so I can…"): best for product demos.
- **What / why / how**: best for explainers.

## Tone by voice

| Brand tone | Narration style | Kokoro voice | ElevenLabs direction |
| --- | --- | --- | --- |
| Friendly SaaS | Warm, conversational, 150 wpm | `af_heart` | Warm female/male, "conversational" |
| Developer tool | Plain, precise, a little dry, 160 wpm | `am_michael` | Neutral, "informative" |
| Enterprise | Calm, confident, 140 wpm | `bf_emma` | Deep, measured |
| Consumer app | Energetic, 165 wpm | `af_bella` | Upbeat, young |

Run `npx hyperframes tts --list` for every Kokoro voice.
