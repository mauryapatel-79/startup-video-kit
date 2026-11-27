# Agent instructions

This repo is a kit for making marketing videos for startups and products. Claude Code, Codex, Cursor, Gemini CLI and other agents read this file.

## When someone asks for a video

Follow the `startup-video` skill: [skills/startup-video/SKILL.md](skills/startup-video/SKILL.md). It is installed into your agent's skills folder by the setup script, so `/startup-video` also works where slash skills are supported.

It depends on the HyperFrames skills (`/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry`, `/media-use`). If they are not installed, run the setup script first:

- Windows: `powershell -ExecutionPolicy Bypass -File setup/setup.ps1`
- macOS / Linux: `bash setup/setup.sh`

## Layout

| Path | What |
| --- | --- |
| `skills/startup-video/` | The producer skill: brand → brief → script → voice → build → deliver |
| `brands/<slug>/` | Brand memory: facts with sources, colours, fonts, logos, voice, rules, video history. Read it before any video; never re-research what is there. |
| `scripts/brand.mjs` | `init` / `check` / `list` / `use` / `log` for brand memory |
| `brief.example.md` | Brief template, copied per video |
| `scripts/voiceover.mjs` | ElevenLabs voiceover + word timings (optional paid path) |
| `videos/<slug>/` | One HyperFrames project per video. Only `example-launch` is committed. |
| `docs/` | Tool research, vetted skills, costs |
| `setup/` | One-command setup per OS |

## Rules

- Each video lives in its own `videos/<slug>/` folder. Do not write outside it except to improve the kit when asked.
- Each brand's facts live only in `brands/<slug>/brand.json`. Update it when the person gives a new fact or correction; never mix brands.
- Secrets live in `.env` (git-ignored). Never print them, put them in a composition, or commit them.
- Run `npm test` after changing `scripts/`.
