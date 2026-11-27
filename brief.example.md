# Video brief

Copy to `videos/<brand>-<goal id>/BRIEF.md` (e.g. `videos/selixer-ad/`). The agent fills this from the intake questions (`skills/startup-video/references/intake.md`). Product facts, colours, fonts, logos and voice come from the brand's memory, so this file only holds what is specific to **this** video.

## Brand

- **Brand:** `brands/<brand>/brand.json` (create it once with `node scripts/brand.mjs init <url>`)
- **Facts this video uses** (ids from `brand.json` facts):
- **Anything new or changed since the brand was captured** (add it to `brand.json` too):

## Round 1

- **What should this video do?** launch / show how it works / get sign-ups (ad) / announce a feature / explain the problem / build trust (customer story) / get hired (personal brand) / raise money / hire people / teach a task / promote an event / website header loop / release notes
- **Recipe** (from the goal):
- **Voice:** free female (Kokoro af_heart) / free male (Kokoro am_michael) / ElevenLabs / my own recording / none

## Round 2 (shaped by the goal)

- **Where it will be posted:** website · YouTube · Product Hunt · email / Reels · TikTok · Shorts / LinkedIn · X · feed
- **Formats** (from the platforms): 16:9 / 9:16 / 1:1
- **Focus** (the pain, feature, task, customer, projects, numbers, roles or event):
- **Paid or organic:** (paid: every fact shown must be verified, plus 2-3 hook variants)
- **Length (seconds):**
- **Who should feel it's for them:**
- **What viewers should do after watching** (default: `cta` in brand.json):
- **Music:** upbeat / calm / cinematic / none
- **Missing proof the person supplied:**
- **Screen recordings or test login:**

## Plan in one line

> e.g. "A 30-second Reels + LinkedIn ad for Shopify founders, female voice, upbeat music, ending on 'Start free at acme.com'."

## References

- **Videos you like** (links):
- **Must not say or show in this video** (brand-wide rules go in brand.json `rules.never`):

## Assets for this video

Screen recordings, screenshots, a test account for the app (never your real password), a founder voice memo. Put files in `videos/<slug>/assets/`.
