# Agent skills for video, vetted

Found with Vercel's skills CLI (`npx skills find <query>`, the [skills.sh](https://skills.sh) directory) on 2026-11-27. Install counts are what the directory reported that day.

Skills run with your agent's full permissions. Install from the vendor's own GitHub org, and read a skill before installing it.

## Installed by the setup script

| Skill | Publisher | Installs | What it does |
| --- | --- | --- | --- |
| `hyperframes` | heygen-com | 1.7M | Render contract, work loop, film types. Read first. |
| `hyperframes-cli` | heygen-com | 1.7M | Scaffold, check, snapshot, preview, render. |
| `hyperframes-registry` | heygen-com | 1.5M | ~450 blocks: captions, transitions, charts, cursors, device frames. |
| `media-use` | heygen-com | 1.6M | Voice, music, SFX, images, logos, transcripts, grading. |
| `reverse-any-video` | heygen-com | - | Rebuild a video you like as an editable project. |
| `style-sampling` | heygen-com | - | Five proven explainer styles. |
| `startup-video` | this repo | - | The producer workflow on top of HyperFrames. |

The HyperFrames core set installs with `npx hyperframes skills update`, which pins the skills to the CLI version.

## Optional, worth adding

| Skill | Install | Use when |
| --- | --- | --- |
| ElevenLabs `music`, `sound-effects`, `text-to-speech` | `npx skills add elevenlabs/skills --skill music --skill sound-effects` (or `setup -ElevenLabs`) | You have an ElevenLabs key and want generated music and SFX. |
| HyperFrames `slideshow` | `npx hyperframes skills update slideshow` | Pitch deck instead of a video. |
| HyperFrames `figma` | `npx hyperframes skills update figma` | Your designs are in Figma. |
| HyperFrames `remotion-to-hyperframes` | `npx hyperframes skills update remotion-to-hyperframes` | Porting a Remotion project. |
| Remotion `remotion-best-practices` | `npx skills add remotion-dev/skills` | Your team prefers React/Remotion over HyperFrames. |
| `anthropics/skills@webapp-testing` | `npx skills add anthropics/skills --skill webapp-testing` | Driving your web app with Playwright to capture real screens. |
| `samber/developer-relations-skills@technical-video-script` | `npx skills add samber/developer-relations-skills --skill technical-video-script` | Long developer tutorials. |

## Seen, not recommended

| Result | Why not |
| --- | --- |
| `*/superpowers@ai-video-generation` (0.6–1.1M installs each, under 7+ different owners) | The same skill name republished under many unrelated accounts with near-identical install counts. Treat as untrusted. |
| `prime-skills/runcomfy-agent-skills@*` (~390k each) | Wrappers around a paid third-party API; route your keys through the vendor directly instead. |
| Small `saas-product-demo-*` skills (<200 installs) | Overlap with this kit; unreviewed. |
| OpenAI `speech` skill | OpenAI TTS models are scheduled to shut down 2027-01-06. |

## Re-run the search

```bash
npx skills find video
npx skills find voiceover
npx skills find captions
npx skills find "product demo"
```
