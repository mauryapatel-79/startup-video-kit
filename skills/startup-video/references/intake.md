# Intake: the questions before any video

The person should never have to know what a "recipe", "aspect ratio" or "LUFS" is. Ask about their **goal**, **how it should sound** and **where it will be posted**, in plain words, with a recommended answer already picked. Two short rounds, then the script.

## How to ask

- **Claude Code:** the `AskUserQuestion` tool. At most 4 questions per round and 4 options per question; the tool adds its own "Other" box, so never spend an option on "Something else". Exactly one option per question is the recommendation: first, with "(Recommended)" in its label. Headers (12 characters max): `Goal`, `Voice`, `Platforms`, `Length`, `Focus`, `Paid?`, `Audience`, `Music`, `Action`.
- **Codex, Cursor, Gemini and others:** one message with numbered questions and lettered options (here "Something else: tell me" can be the last letter), the recommendation marked, ending with: *Reply like `1A 2B`, or just "go" to take every recommendation.*
- **Never ask what the site or `brand.json` already answers** (product, audience, colours, call to action). Show it as the recommended option, or skip the question (each row below says when).
- **"Just make it" / "no questions":** skip both rounds, take every recommendation, and list what you chose in one line.

## Round 0: only when there is nothing to start from

> What's your website? (Or describe the product in two sentences.)

Then capture the brand (`references/brand.md`) before round 1, so the options can be specific to it.

## Round 1: goal and voice (2 questions)

These two don't depend on anything else, so they go first.

**1. Goal: "What should this video do?"** Offer the 4 best-fitting goals from the table below, ranked like this:

1. A goal the person's own words already name ("an ad for…", "a demo of…") is recommended; still ask, so they can change it.
2. The site is about a person (portfolio, consultant, freelancer) → *Get hired / grow my personal brand*.
3. The brand has no videos in `history` yet → *Launch or announce*. It already has a launch film → recommend the next most useful goal for its category (SaaS: *Get sign-ups (ad)*, then *Show how it works*).
4. Fill the remaining slots in the order of the goal table below, skipping goals already in `history` unless the person asks again.
5. A goal is ready when its proof exists: facts or features in `brand.json`, or real screens the agent can capture (demo, tutorial, feature). If it is missing (for example an explainer with no sourced number about the problem), still offer it, with "(needs: …)" in its description, and ask for that proof in round 2 when it is picked. Demo numbers on a marketing site are not results: show them only labelled as an example dashboard.

**2. Voice: "Which voice?"** (4 options; "my own recording" goes through Other, and say so in the question)

| Situation | Options, recommended first |
| --- | --- |
| `brand.json` has a voice | That voice (`voice` in `brand.json`), "same as last time" · the other free voice · Premium (ElevenLabs) · No voice |
| No saved voice, first person ("I") | Free voice matching the speaker (Kokoro `am_michael` or `af_heart`) · the other free voice · Premium (ElevenLabs) · No voice |
| No saved voice, brand voice ("we") | Free female (Kokoro `af_heart`) · Free male (Kokoro `am_michael`) · Premium (ElevenLabs, needs `ELEVENLABS_API_KEY`) · No voice (music + on-screen text) |

## Round 2: shaped by the goal (up to 4 questions)

Now the goal is known, so formats, length and focus can be recommended properly. Ask in this priority order, skipping any whose "skip when" holds, and stop at 4:

| # | Question | Options (recommended first) | Skip when |
| --- | --- | --- | --- |
| 1 | **Platforms: "Where will you post it?"** (single choice) | `defaults.platforms` if saved, else the goal's formats as one combo (e.g. "Reels + LinkedIn feed (9:16 + 1:1)") · each single format of that combo · "Everywhere (16:9 + 9:16 + 1:1)" | Hero loop (always 16:9 website) |
| 2 | **Focus** (wording per goal): ad "Which pain should it hit?", demo/tutorial "Which task?", feature "Which feature?", testimonial "Which customer?", personal brand "Which projects?", investor "Which numbers?", recruiting "Which roles?", event "Which event?" | Up to 3 matching `features` / `facts` from `brand.json`, strongest first | Launch, explainer, hero loop, changelog (the recipe fixes the content) |
| 3 | **Paid?: "Will you pay to promote it?"** | `defaults.paid` if saved, else No, organic posts · Yes, paid ads | Goals other than ad, event, testimonial |
| 4 | **Audience: "Who should feel it's for them?"** | 2–3 segments from `identity.audience` and the site | The site names one audience only |
| 5 | **Length: "How long?"** | Standard (middle of the recipe's range) · Short (recipe's minimum) · Long (recipe's maximum) | Hero loop, or the person gave a length |
| 6 | **Action: "What should viewers do after watching?"** | `cta.primary` · `cta.secondary` · a goal-specific action (apply, register, meet) | `brand.json` has a `cta` and the goal uses it (launch, demo, ad, feature, explainer, testimonial, personal brand) |
| 7 | **Music** | Upbeat (ads, launches, events) / Calm (demos, tutorials, testimonials) / Cinematic (investors) · the other two · None | `defaults.music` is set: use it and name it in the plan line |
| 8 | **Proof the goal needs but `brand.json` lacks** (e.g. a sourced number, a testimonial, traction) | Free text, or "skip that beat" | The proof exists |
| 9 | **Screen recordings or test login** (demo, tutorial, feature only) | "Use the website" · "I'll add recordings to `videos/<video>/assets/`" · "I'll give a test account" | Other goals |

Questions beyond the first 4 that still apply take their recommended answer; list those defaults in the plan line so the person can change them.

**If they say Paid = yes:** every fact the video shows must be `verified: true`; ask them to confirm the unverified ones in the same message as the script. Make 2–3 hook variants of the first 3 seconds (`recipes.md` → Social ad).

**Visual feel** follows the brand's own look (`visual.style`); ask only if the person brings it up. `voice.tone` describes the narration, not the visuals.

## After the answers

1. Pick the recipe from the goal (`SKILL.md` step 2), then write `videos/<video>/BRIEF.md`, where `<video>` is `<brand>-<goal id>` using the id column below (e.g. `selixer-ad`, `iamaurya-hire`), with `-2`, `-3` if it already exists.
2. Save what carries over: the voice in `brand.json` → `voice`, and `{ "platforms", "music", "paid" }` in `brand.json` → `defaults`. Not the goal: it usually changes. Next time the saved voice, platforms and paid answer are the recommended options, and the saved music is used without asking.
3. Say the plan back in one line, including every default you took: *"A 25-second Reels + LinkedIn ad (9:16 + 1:1, captions on) for Shopify brands on Meta and Google, female voice, upbeat music, ending on 'Start your 14-day free trial at selixer.com'."*
4. Then the script and its approval (`SKILL.md` step 3).

## Goals, recipes and what each needs

| Goal (say it this way) | id | Recipe | Length | Formats | Proof needed from `brand.json` | Default action |
| --- | --- | --- | --- | --- | --- | --- |
| Launch or announce the product | `launch` | [Launch film](recipes.md#launch-film) | 45–60 s | 16:9 + 9:16 | Top 3 features, one headline number | Try it / sign up |
| Show how it works | `demo` | [Product demo](recipes.md#product-demo) | 60–120 s | 16:9 | The core flow on real screens | Start free / book demo |
| Get sign-ups or sales (ad) | `ad` | [Social ad](recipes.md#social-ad) | 15–30 s | 9:16 + 1:1 | One pain, one result, the offer | Offer + link |
| Announce a new feature | `feature` | [Feature announcement](recipes.md#feature-announcement) | 20–40 s | 16:9 + 1:1 | The feature, before/after on the real UI | "Available today" |
| Explain the problem we solve | `explainer` | [Explainer](recipes.md#explainer) | 60–90 s | 16:9 | A sourced number about the problem | Learn more |
| Build trust (customer story) | `story` | [Testimonial / case study](recipes.md#testimonial--case-study) | 30–60 s | 16:9 + 9:16 | A testimonial and its result | Book a call |
| Get hired / grow my personal brand | `hire` | [Personal brand](recipes.md#personal-brand) | 45–60 s | 16:9 + 9:16 + 1:1 | Stats, 2 projects, 1 testimonial | Book a call / contact |
| Raise money from investors | `investor` | [Investor teaser](recipes.md#investor-teaser) | 60–90 s | 16:9 | Traction, market, team (all verified) | Meet / see the deck |
| Hire people for my team | `recruiting` | [Recruiting](recipes.md#recruiting) | 30–60 s | 9:16 + 16:9 | Mission, team, open roles | Apply |
| Teach users a task | `tutorial` | [Tutorial / how-to](recipes.md#tutorial--how-to) | 60–180 s | 16:9 | Every step on real screens | Try it yourself |
| Promote an event or webinar | `event` | [Event promo](recipes.md#event-promo) | 15–30 s | 9:16 + 1:1 | Date, speaker, what they'll learn | Register |
| Website header background | `loop` | [Hero loop](recipes.md#hero-loop) | 6–12 s | 16:9 | The core action, looping | (none, muted) |
| Release notes for developers | `changelog` | [Changelog](recipes.md#changelog--pr-walkthrough) | 30–60 s | 16:9 | The PR or release notes | Update / read more |

## Goal shapes the whole video

The goal is not a label: it decides the hook, which facts are shown, the pacing and the ending.

| Goal | Hook | Pacing | Ends on |
| --- | --- | --- | --- |
| Launch | The problem or the result | Builds to the reveal | Logo + action |
| Demo, tutorial | Who it's for and what they'll get done | Steady, one step per scene | The finished result, then action |
| Ad | Pattern break in 2 s, readable muted | Fast, 1–2 s shots | Offer, held 3 s |
| Testimonial | The customer's result as a number or quote | Calm, let the quote breathe | Customer name + action |
| Personal brand | The market's problem, then "I" | Confident, proof-dense | Name lockup + contact |
| Investor teaser | The size of the problem | Deliberate, one number per beat | The ask |
| Recruiting | The mission in one line | Warm, human | Roles + apply link |
| Event | Date and the one thing they'll learn | Fast | Register link + date |
