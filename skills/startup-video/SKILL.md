---
name: startup-video
description: Make a video for a startup, SaaS, app, business or personal brand with an AI coding agent - launch film, product demo, social ad, feature announcement, explainer, customer testimonial, "hire me" personal brand film, investor teaser, recruiting video, tutorial, event promo, hero loop or changelog. Asks the person's goal, platforms and voice first. Turns a product URL or a filled brief into a script, voiceover, captions, music and a rendered MP4 in every aspect ratio the launch needs. Built on HyperFrames; use it whenever someone asks for a video about their product or company.
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

## 1. Brand, then brief

Brand facts are captured once and kept in `brands/<slug>/brand.json`. Follow [references/brand.md](references/brand.md):

- `node scripts/brand.mjs list`. **Brand exists** → read its `brand.json`; do not re-capture the site. Run `check`; re-capture only when it flags stale facts or the person says something changed.
- **New brand** → `node scripts/brand.mjs init <url>`, fill the draft from `sources/`, confirm with the person, set `status: "ready"`.
- **Person gave nothing** → ask for the URL or a two-line description. Nothing else yet.

Then run the intake in [references/intake.md](references/intake.md), even when the request already names a video type: two short rounds of plain-language questions with a recommended answer pre-picked.

1. **Round 1:** what the video should do (the goal) and which voice.
2. **Round 2, shaped by the goal:** where it will be posted, the focus (which pain, feature, task, projects…), paid or organic, length, then audience, action, music or missing proof if still under 4 questions.

Use `AskUserQuestion` where it exists; otherwise one numbered message the person can answer like `1A 2B`. "Just make it" means: take every recommendation and say what you chose. A saved voice, platforms and paid answer are pre-picked; saved music is used without asking.

## 2. Pick the recipe, write the brief

The goal picks the recipe ([intake.md](references/intake.md) → goal table; recipes in [references/recipes.md](references/recipes.md)): launch, demo, ad, feature, explainer, testimonial, personal brand, investor teaser, recruiting, tutorial, event, hero loop, changelog. Each fixes the length, the scene beats, the word budget, which facts to show and how it ends. If nothing fits, start from the closest and say how you changed it.

Then write `videos/<video>/BRIEF.md`, where `<video>` is `<brand>-<goal id>` (ids in the intake goal table) (template: `brief.example.md`; add `-2`, `-3` if the folder exists), save the voice to `brand.json` → `voice` and `platforms`, `music`, `paid` to `defaults`, and say the plan back in one line, listing every default you took.

## 3. Script

Write `videos/<video>/SCRIPT.md` with [references/script.md](references/script.md):

- One table: scene, seconds, on-screen text, narration, what is shown.
- Narration word count ≤ the recipe's budget (2.5 words per second at 150 wpm). Count it and print the count.
- The hook lands in the first 2 seconds. The CTA is one action and is on screen for at least 3 seconds.
- No claim `brand.json` does not hold. Numbers come from its `facts`, never invented; a new fact is added there, with its source, before it is used.

Show the script and wait for approval unless the person asked for no stops.

## 4. Show the real product

Real screens beat drawn ones. In order of preference:

1. Screen recordings or screenshots the person put in `videos/<video>/assets/` (highest truth).
2. `npx hyperframes capture <url>` for the marketing site and public pages.
3. The running app: take screenshots with Playwright (`npx playwright screenshot --viewport-size=1920,1080 <url> assets/screens/<name>.png`), or record a flow with Playwright's `video` option. Use a test account only; never type real credentials.
4. Rebuild a UI screen in HTML only when no real one can be captured, and keep it faithful to the product's design tokens.

Logos, fonts and colours come from the brand: `node scripts/brand.mjs use <brand> videos/<video>` copies them into `assets/brand/` and writes `brand.css`. Never redraw a logo. The brand's `screens/` folder holds the last site capture; reuse it before capturing again.

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

- New project: `npx hyperframes init videos/<video> --skip-skills --skill=hyperframes` (the kit already installed the skills). `videos/example-launch/` is a finished reference project made with this skill: scenes timed to narration, word-timed captions, sound effects, end card.
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

Then write back to the brand: `node scripts/brand.mjs log <brand> videos/<video> --recipe <recipe>`, plus any fact, voice choice or rule the person gave you during this video.

## Hard rules

- Never invent customers, logos, metrics, quotes or prices. Never use one brand's facts or assets in another brand's video.
- Never put a real password, card or API key on screen. Blur or replace secrets in captured UI.
- Music and SFX must have a licence that allows commercial use; record the source in `videos/<video>/CREDITS.md`.
- Keep keys in `.env`; never write them into a composition or a commit.
