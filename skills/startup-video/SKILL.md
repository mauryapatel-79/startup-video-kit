---
name: startup-video
description: Make a marketing video for a startup, SaaS, app or business with an AI coding agent - launch film, product demo, social ad, explainer, feature announcement, onboarding walkthrough or changelog. Turns a product URL or a filled brief into a script, voiceover, captions, music and a rendered MP4 in every aspect ratio the launch needs. Built on HyperFrames; use it whenever someone asks for a video about their product or company.
---

# Startup video

You are the producer. HyperFrames (`/hyperframes`, `/media-use`, `/hyperframes-registry`) is the studio: it owns the HTML-to-video contract, the registry of blocks, media, captions and rendering. This skill owns the parts a business video needs on top: the brief, the story, the words, the real product on screen, the voice and the deliverables.

Read `/hyperframes` before writing any composition. Do not restate or override its contract.

## 0. Preflight (once per machine)

```bash
npx hyperframes doctor
```

Node 22+, FFmpeg and Chrome must pass. Kokoro (free local voice) and Parakeet/whisper.cpp (captions) are optional. If something fails, point the person at `setup/setup.ps1` (Windows) or `setup/setup.sh` (macOS/Linux) in this kit and stop until it passes.

On Windows, keep the kit in a short path such as `C:\dev\startup-video-kit`: Kokoro and Chrome fail to write files once a path passes 260 characters.

## 1. Brief

Every video starts from `videos/<slug>/BRIEF.md`, copied from `brief.example.md` at the kit root.

- **Person gave a URL** → run `npx hyperframes capture <url> --json` and fill the brief yourself: product name, one-line promise, audience, three features, proof (numbers, logos, quotes), brand colours, fonts, logo.
- **Person gave nothing** → ask for the URL or a two-line description. Nothing else yet.
- Ask only what you cannot infer, in one message: **video type, length, aspect ratios, call to action, voice (free local / premium)**. Default everything else and say what you defaulted.

## 2. Pick the recipe

Match the request to one recipe in [references/recipes.md](references/recipes.md). Each fixes the length, the scene beats and the word budget. If nothing fits, the closest recipe is the starting point; say how you changed it.

## 3. Script

Write `videos/<slug>/SCRIPT.md` with [references/script.md](references/script.md):

- One table: scene, seconds, on-screen text, narration, what is shown.
- Narration word count ≤ the recipe's budget (2.5 words per second at 150 wpm). Count it and print the count.
- The hook lands in the first 2 seconds. The CTA is one action and is on screen for at least 3 seconds.
- No claim the brief does not support. Numbers come from the brief or the site, never invented.

Show the script and wait for approval unless the person asked for no stops.

## 4. Show the real product

Real screens beat drawn ones. In order of preference:

1. Screen recordings or screenshots the person put in `videos/<slug>/assets/` (highest truth).
2. `npx hyperframes capture <url>` for the marketing site and public pages.
3. The running app: take screenshots with Playwright (`npx playwright screenshot --viewport-size=1920,1080 <url> assets/screens/<name>.png`), or record a flow with Playwright's `video` option. Use a test account only; never type real credentials.
4. Rebuild a UI screen in HTML only when no real one can be captured, and keep it faithful to the product's design tokens.

Logos come from `/media-use` (`--type logo`), never redrawn.

## 5. Voice and captions

Follow [references/voice.md](references/voice.md). Output is always two files:

- `assets/voice/narration.wav` (or `.mp3`)
- `assets/voice/narration.words.json` - `[{ "id", "text", "start", "end" }]`, the shape HyperFrames captions consume

Default provider by the person's choice:

| Choice | Command |
| --- | --- |
| Free, local (default) | `npx hyperframes tts` (Kokoro) → `npx hyperframes transcribe` (Parakeet or whisper) |
| Premium, own ElevenLabs key | `node scripts/voiceover.mjs` from this kit (audio + word timings in one call) |
| HeyGen account | `/media-use` voice (signed in), word timings included |

Time the scenes to the narration, not the other way round: read `narration.words.json` and set each scene's `data-start` to the first word of its line.

## 6. Build

Hand over to `/hyperframes` with the approved `SCRIPT.md` and the assets:

- New project: `npx hyperframes init videos/<slug> --skip-skills --skill=hyperframes` (the kit already installed the skills). `videos/example-launch/` is a finished reference project made with this skill: scenes timed to narration, word-timed captions, sound effects, end card.
- Search `/hyperframes-registry` before hand-building titles, transitions, captions, charts, device frames or cursors.
- Music under narration and sound on visible actions through `/media-use`; narration stays on top (music around −30 LUFS under voice).
- Captions on by default for every social cut; most social video is watched muted.
- Brand colours, fonts and copy become composition variables so the person can edit them in the Studio.

## 7. Check, review, render

```bash
npx hyperframes check --json        # fix every error
npx hyperframes snapshot --review   # look at the frames, write REVIEW.md
npx hyperframes preview             # person approves here
npx hyperframes render -o renders/<slug>-16x9.mp4
```

Render only after the person approves the preview, asks for the file, or asked for no stops.

## 8. Deliver

Follow [references/delivery.md](references/delivery.md): one master plus the cuts each channel needs (16:9, 9:16, 1:1), loudness-normalised, with burned-in captions on vertical cuts, a poster frame and a muted hero loop if the brief asks for one. Finish with a list of files, their length, size and where each goes.

## Hard rules

- Never invent customers, logos, metrics, quotes or prices.
- Never put a real password, card or API key on screen. Blur or replace secrets in captured UI.
- Music and SFX must have a licence that allows commercial use; record the source in `videos/<slug>/CREDITS.md`.
- Keep keys in `.env`; never write them into a composition or a commit.
