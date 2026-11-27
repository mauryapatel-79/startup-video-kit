# The stack, and why

Researched November 2026. Prices change; links go to the source.

## What the kit uses

| Job | Default (free) | Premium option | Why |
| --- | --- | --- | --- |
| Video engine | [HyperFrames](https://github.com/heygen-com/hyperframes) (Apache-2.0) | HyperFrames cloud render | HTML/CSS/GSAP rendered frame by frame, so renders are identical every time. Agents already write HTML well. Ships its own agent skills, ~450 registry blocks, TTS, transcription and media tools. |
| Voiceover | Kokoro-82M via `npx hyperframes tts` | ElevenLabs via `scripts/voiceover.mjs`, or HeyGen voices | Kokoro is free, on-device, Apache-2.0. ElevenLabs is the quality leader and returns timings with the audio. |
| Word timings / captions | Parakeet or whisper.cpp via `npx hyperframes transcribe` | ElevenLabs `with-timestamps` (no transcription pass) | Local, free, outputs the exact JSON HyperFrames captions read. |
| Sound effects | HyperFrames bundled set (Pixabay licence) + Openverse | ElevenLabs SFX | Bundled set covers clicks, whooshes, pops, risers. |
| Music | Your own licensed track, or the HeyGen catalog (free sign-in) | ElevenLabs Music | |
| Product screens | `npx hyperframes capture <url>`, Playwright screenshots, your recordings | | Real UI beats generated UI. |
| Agent | Claude Code, Codex, Cursor, Gemini CLI | | All read the same skills (`npx skills`). |

## Video engines compared

| Engine | Authoring | Agent fit | Licence | Verdict |
| --- | --- | --- | --- | --- |
| **HyperFrames** | HTML + CSS + GSAP | Official skills for Claude Code, Codex, Cursor; CLI with JSON output, lint, snapshot review | Apache-2.0 | **Chosen.** Built for agents, no React, local or cloud render. |
| Remotion | React components | Official skills (`remotion-dev/skills`) | Free for individuals and teams up to 3; company licence above that | Strong alternative if your team lives in React. HyperFrames can port Remotion projects (`/remotion-to-hyperframes`). |
| Motion Canvas | TypeScript generators | No official agent skills | MIT | Good for code explainers; less agent tooling. |
| Plain FFmpeg | Filters and slideshows | Many community skills | LGPL/GPL | Fine for cutting and encoding, not for designed motion. |

## Voiceover

| Rank | Tool | Free / entry | API | Commercial use | Verdict |
| --- | --- | --- | --- | --- | --- |
| 1 | [ElevenLabs](https://elevenlabs.io/pricing/api) | 10k chars free; Starter $6/mo; ~$0.08 per 1k chars (multilingual v2 / v3 / v4), ~$0.04 (Flash) | REST, char timestamps | Starter and up | Best quality. Models: `eleven_multilingual_v2` (default here), `eleven_v4`, `eleven_flash_v2_5`. |
| 2 | [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) | Free, local | Built into HyperFrames CLI | Apache-2.0 | **Default.** Good enough for demos and first drafts; 54 voices. |
| 3 | [Inworld TTS](https://inworld.ai/pricing) | Free tier; Creator $25/mo | REST | Yes | Cheap and good. |
| 4 | [Cartesia Sonic](https://cartesia.ai/pricing) | 20k free credits; Pro $5/mo | REST / WebSocket | Pro and up | Low latency, built for voice agents. |
| 5 | HeyGen voices | 3 min/month free with HyperFrames sign-in | Via `/media-use` | Yes | Returns word timings too. |
| - | OpenAI `tts-1`, `gpt-4o-mini-tts` | | | | **Avoid.** OpenAI lists these for shutdown on 2027-01-06 ([models](https://developers.openai.com/api/docs/pricing)). |

## Music

| Tool | Price | API | Licence | Verdict |
| --- | --- | --- | --- | --- |
| [ElevenLabs Music](https://elevenlabs.io/docs/api-reference/music/compose) | ~$0.15/min | `POST /v1/music`, 3 s–10 min, instrumental flag | Commercial on paid plans | Best official API. |
| HeyGen catalog | Free with sign-in | Via `/media-use` (`--type bgm`) | Per catalog terms | 10k+ tracks, easiest inside HyperFrames. |
| [Pixabay Music](https://pixabay.com/service/license-summary/) | Free | Manual download | No attribution; no standalone resale | Best free library. |
| YouTube Audio Library | Free | None | Some tracks need attribution | Manual. |
| Suno / Udio | - | No public API | Unofficial wrappers are a licence risk | Avoid for commercial work. |

## Sound effects

| Tool | Price | Licence | Verdict |
| --- | --- | --- | --- |
| HyperFrames bundled set | Free | Pixabay Content License | Default. |
| Openverse (via `/media-use`) | Free | CC0 / CC BY (credit) | Wider choice. |
| [ElevenLabs SFX](https://elevenlabs.io/docs/api-reference/text-to-sound-effects/convert) | ~$0.12/min | Paid plans | Generate exactly the sound you need. |

## Captions and word timings

| Tool | Price | Verdict |
| --- | --- | --- |
| `npx hyperframes transcribe` (Parakeet / whisper.cpp) | Free, local | Default. Parakeet installs with one command on Windows, macOS and Linux. |
| ElevenLabs `with-timestamps` | Included in TTS | Exact timings for generated voice; what `scripts/voiceover.mjs` uses. |
| ElevenLabs Scribe | ~$0.20/hr | Best hosted transcription for real recordings. |
| OpenAI `whisper-1` | $0.006/min | Listed for shutdown 2027-02-26. Avoid for new work. |

## Optional: AI presenter and generated b-roll

Not needed for most SaaS videos (real UI converts better), but available:

| Need | Tool | Price floor | Notes |
| --- | --- | --- | --- |
| Talking avatar | HeyGen | Prepaid API wallet | Native in HyperFrames (`/media-use --type video`). |
| Talking avatar | Synthesia | Free 10 min with watermark; $19/mo | |
| Generated b-roll | [Runway API](https://docs.dev.runwayml.com/guides/pricing/) (Veo 3.1, Gen-4.5, Kling) | ~$0.05–0.40 per second | One key, several models. |
| Generated b-roll | Local LTX | Free, needs a strong GPU / Apple Silicon | Via `/media-use`. |

OpenAI's Sora 2 API was shut down on 2026-09-24.

## Not confirmed

- ElevenLabs free-tier commercial rights for TTS and SFX (assume paid plan for commercial use).
- Google and Azure TTS current per-character prices.
- HeyGen's official per-second API rates.
