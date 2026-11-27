# Recipes

Word budget = seconds × 2.5 (150 words per minute) minus breathing room. Seconds are targets; ±10% is fine.

| Recipe | Length | Master aspect | Voice | Use for |
| --- | --- | --- | --- | --- |
| [Launch film](#launch-film) | 45–60 s | 16:9 | Yes | Product Hunt, landing page, launch tweet |
| [Product demo](#product-demo) | 60–120 s | 16:9 | Yes | Sales, onboarding, docs, YouTube |
| [Social ad](#social-ad) | 15–30 s | 9:16 | Optional | Reels, TikTok, Shorts, paid social |
| [Feature announcement](#feature-announcement) | 20–40 s | 16:9 + 1:1 | Optional | Changelog, X/LinkedIn post, email |
| [Explainer](#explainer) | 60–90 s | 16:9 | Yes | "What is X", category education, homepage |
| [Hero loop](#hero-loop) | 6–12 s | 16:9 | No | Muted autoplay at the top of a landing page |
| [Changelog / PR walkthrough](#changelog--pr-walkthrough) | 30–60 s | 16:9 | Yes | Release notes for developers |

---

## Launch film

45–60 s · budget 100–130 words · music: confident, builds

| # | Beat | Seconds | What is on screen |
| --- | --- | --- | --- |
| 1 | Hook | 0–3 | The problem as one sharp line of kinetic type, or the result in one frame |
| 2 | Problem | 3–10 | The painful old way: a messy real workflow, many tabs, a slow spinner |
| 3 | Reveal | 10–14 | Logo + one-line promise |
| 4 | Feature 1 | 14–24 | Real product screen, cursor doing the core action, punch-in on the result |
| 5 | Feature 2 | 24–32 | Second real screen |
| 6 | Feature 3 | 32–40 | Third real screen, or an integration grid |
| 7 | Proof | 40–48 | One number, customer logos or one quote (only if the brief has them) |
| 8 | CTA | 48–55 | Logo, URL, one action ("Start free at acme.com"), held 3 s+ |

## Product demo

60–120 s · budget 140–280 words · music: light, low

One user, one job, start to finish. Show the real UI the whole way.

| # | Beat | Share of time | What is on screen |
| --- | --- | --- | --- |
| 1 | Who and what | 8% | "If you're a <role> who needs <job>…" over the app's home screen |
| 2 | Setup | 12% | Sign-up or connect step, sped up 2–4× |
| 3 | Core flow | 50% | The main task, step by step, oversized cursor, zoom on every click that matters |
| 4 | Result | 15% | The output: report, dashboard, deployed site, sent email |
| 5 | Extra | 7% | One power feature or integration |
| 6 | CTA | 8% | URL + next step |

Use `/hyperframes-registry` for the cursor, zoom and device-frame blocks.

## Social ad

15–30 s · budget 30–65 words · 9:16 master, captions burned in · music: punchy

| # | Beat | Seconds | Rule |
| --- | --- | --- | --- |
| 1 | Hook | 0–2 | Pattern break: a bold claim, a question, or the result first. Text readable without sound. |
| 2 | Pain or desire | 2–6 | One relatable moment |
| 3 | Product | 6–20 | 2–3 fast real-UI shots, one idea each, big UI crops (phones show small text poorly) |
| 4 | CTA | last 3–4 | Offer + action. Keep inside the 9:16 safe zone (top 15% and bottom 20% are covered by platform UI) |

Make 2–3 hook variants of the same ad when the brief is for paid social; hooks are what gets tested.

## Feature announcement

20–40 s · budget 40–90 words

| # | Beat | Seconds |
| --- | --- | --- |
| 1 | "New in <Product>": feature name as title card | 0–3 |
| 2 | Before → after, or the problem it removes | 3–10 |
| 3 | The feature in use on the real UI | 10–30 |
| 4 | "Available today" + where to find it | last 4 |

## Explainer

60–90 s · budget 140–210 words · music: neutral

| # | Beat | Share | Visual style |
| --- | --- | --- | --- |
| 1 | Hook question | 8% | Kinetic type |
| 2 | Why it matters (stakes, a number) | 17% | Data block or chart from the registry |
| 3 | How it works in 3 steps | 50% | Diagram or icons per step, then the real UI doing it |
| 4 | Who it's for | 12% | Personas or logos |
| 5 | CTA | 13% | URL |

For a faceless series look, `/style-sampling` has five proven explainer styles.

## Hero loop

6–12 s · no voice · no captions · muted

- The core action on the real UI, looped seamlessly: the last frame matches the first.
- Export MP4 (H.264) and WebM, under 4 MB each, plus a poster PNG. See delivery.md.

## Changelog / PR walkthrough

30–60 s · budget 60–140 words

- Title card with version number.
- Animated code diff or before/after UI per change, at most 3 changes.
- Point the agent at the PR or release notes; numbers and names come from there.
- HyperFrames' repo-internal `changelog-video` skill is a good reference for the look.
