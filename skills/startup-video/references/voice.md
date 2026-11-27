# Voice and captions

Every path ends with the same two files in `videos/<slug>/assets/voice/`:

- `narration.wav` or `narration.mp3`
- `narration.words.json` → `[{ "id": "w0", "text": "Still", "start": 0.0, "end": 0.31 }, …]`

Extract the narration column of `SCRIPT.md` into `assets/voice/narration.txt` first, one scene per paragraph.

## Path A - free, local (default)

Kokoro-82M runs on the machine through the HyperFrames CLI. Needs Python 3.10+ with `pip install kokoro-onnx soundfile` (the setup script does this with `-LocalVoice` / `--local-voice`). The first run downloads the model (about 2 minutes).

```bash
npx hyperframes tts --text-file assets/voice/narration.txt --voice af_heart -o assets/voice/narration.wav
npx hyperframes transcribe assets/voice/narration.wav
# writes transcript.json next to the audio:
mv assets/voice/transcript.json assets/voice/narration.words.json
```

- Transcription uses Parakeet when installed (`npx hyperframes models install parakeet`, works on Windows, macOS and Linux), else whisper.cpp, which needs CMake and a C++ compiler on Windows.
- With whisper: English voices start with `a` (American) or `b` (British), use `--model small.en`.
- Other languages: `--model small --language <code>`. Never a `.en` model for non-English audio; it translates.
- Check the transcript against the script: names and numbers are where whisper slips. Fix the `text` fields, keep the timings.

## Path B - premium, ElevenLabs (own key)

Best quality, and the timings come back with the audio, so no transcription pass. Needs `ELEVENLABS_API_KEY` in `.env`.

```bash
node scripts/voiceover.mjs assets/voice/narration.txt -o assets/voice/narration.mp3
# options: --voice <voice_id>  --model eleven_multilingual_v2|eleven_v4|eleven_flash_v2_5  --speed 0.7-1.2
```

Run it from the kit root, or pass absolute paths. It writes `narration.mp3` and `narration.words.json`.

- Default voice is River (`SAz9YHcvj6GT2YYXdXww`, relaxed, neutral, informative). Pick others in the ElevenLabs voice library and pass `--voice`.
- Default model `eleven_multilingual_v2`. `eleven_v4` is higher quality; `eleven_flash_v2_5` is half the price.
- Commercial use needs a paid ElevenLabs plan (Starter and up).

ElevenLabs also does music (`POST /v1/music`) and sound effects (`POST /v1/sound-generation`) with the same key. Their official skills teach the calls: `npx skills add elevenlabs/skills --skill music --skill sound-effects`.

## Path C - HeyGen account

Signed in with `npx hyperframes auth login`, `/media-use` makes HeyGen voices (3 free minutes a month on the free plan) and returns word timings in one call. Follow `/media-use` → voiceover.

## Path D - the founder's own voice

Often the most convincing option for a launch. Record in a quiet room (phone voice memo is fine), drop the file in `assets/voice/`, then:

```bash
npx hyperframes transcribe assets/voice/founder.m4a --model small.en
```

## Not recommended

- **OpenAI TTS** (`tts-1`, `gpt-4o-mini-tts`): OpenAI has scheduled these models to shut down on 2027-01-06, and `whisper-1` word timestamps on 2027-02-26. Do not build new pipelines on them.
- **Unofficial Suno/Udio wrappers** for music: no public API, licence risk.

## Captions

- Feed `narration.words.json` to the caption blocks in `/hyperframes-registry` (search "captions"). HyperFrames' `captions.md` covers styles.
- 2–4 words per caption group for vertical; up to 7 for 16:9.
- Keep captions inside the 80% title-safe box, and above the bottom 20% on 9:16.
- Export a sidecar `.srt` for YouTube/LinkedIn: `npx hyperframes transcribe assets/voice/narration.words.json --to srt -o renders/<slug>.srt`. Its times are relative to the audio file, so if the voice clip starts later than 0 s in the film, shift the SRT by that offset.
