# Brand memory

Every brand's facts live in `brands/<slug>/`, captured once and reused by every video. Read the brand before writing a word; write back what you learn.

```
brands/<slug>/
  brand.json        the facts: identity, features, numbers, pricing, CTA, voice, colours, rules, history
  assets/logos/     the brand's own logo files (never redrawn)
  assets/fonts/     the brand's web fonts (.woff2)
  screens/          site screenshots from the last capture
  sources/          the captured site text and tokens, dated: where every fact came from
```

## Commands

```bash
node scripts/brand.mjs list                              # what brands exist
node scripts/brand.mjs init https://acme.com             # first time: capture the site into a draft
node scripts/brand.mjs check acme                        # validate before using it
node scripts/brand.mjs use acme videos/acme-launch       # copy fonts + logos, write assets/brand/brand.css
node scripts/brand.mjs log acme videos/acme-launch --recipe launch   # after delivery
node scripts/brand.mjs init https://acme.com --force     # re-capture sources; brand.json edits are kept
```

## The workflow

1. **Find the brand.** `list`. Match by name or domain. Exists → skip capturing the site; go to step 4.
2. **New brand.** `init <url>`. It fills what a machine can: name, one-liner, colours, palette, fonts, logos, screenshots and the site text in `sources/`.
3. **Fill the draft yourself** from the `sources/` text and screenshots, then ask the person only what a page cannot tell you:
   - `identity`: tagline, oneLiner, category, audience.
   - `features`: name + description in the site's own words, with `source`.
   - `facts`: every number, customer, award or claim a video might show. One entry each: `claim`, `value`, `kind`, `source` (URL), `captured` (date), `verified` (false until the person confirms), `note` (for example "demo dashboard data, not customer data").
   - `pricing`, `integrations`, `cta` (primary action, URL, offer, secondary).
   - `voice`: provider and voice id once the person picks one; `tone`.
   - `rules.say` / `rules.never`: words the brand uses, claims or competitors it must not mention.
   - Confirm `visual.colors.primary` and the logo picks by looking at the screenshots.
   - Set `"status": "ready"` and run `check` until it has no errors.
4. **Use it.** `use <slug> <video-dir>` copies the fonts and logos into the project and writes `assets/brand/brand.css`. Paste its `@font-face` lines into each scene's `<style>` (HyperFrames checks fonts per file) and use the `--brand-*` colour variables.
5. **Write back.** Anything new the person tells you (a new metric, a corrected claim, a preferred voice, a phrase to avoid) goes into `brand.json` with its source and date, in the same turn. After delivery, `log` the video.

## Rules

- On screen and in narration, numbers and claims come from `brand.json` facts only. A fact not there gets added (with its source) before it is used.
- `verified: false` facts are fine for drafts and organic posts; ask the person to confirm them before a paid ad.
- `check` warns when a fact is older than 180 days: re-check the source before reusing it.
- Never copy a brand's facts into another brand's folder. A logo or claim from the wrong brand is the costliest mistake this folder exists to prevent.
- `brands/` is git-ignored except the kit's own example, so client facts never land in a public fork.
