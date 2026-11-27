# Credits

| Asset | Source | Licence |
| --- | --- | --- |
| Voice (`assets/voice/narration.wav`) | Kokoro-82M, voice `af_heart`, generated locally with `npx hyperframes tts` | Apache-2.0 model; output free to use |
| Captions (`narration.words.json`) | `npx hyperframes transcribe` (Parakeet), two words corrected by hand | Generated |
| Sound effects (`assets/sfx/`) | Bundled with the HyperFrames `media-use` skill, sourced from Pixabay | Pixabay Content License (commercial use, no attribution required) |
| Fonts | Inter, JetBrains Mono, bundled with HyperFrames | SIL Open Font License |
| Music | None. A bed needs a HeyGen sign-in (`npx hyperframes auth login`), an ElevenLabs key, or your own licensed track. | - |

## How it was made

```bash
npx hyperframes init videos/example-launch --skip-skills --skill=hyperframes
npx hyperframes tts --text-file assets/voice/narration.txt --voice af_heart -o assets/voice/narration.wav
npx hyperframes models install parakeet
npx hyperframes transcribe assets/voice/narration.wav      # writes assets/voice/transcript.json
npx hyperframes check --json                               # 0 errors
npx hyperframes render -o renders/example-launch-16x9.mp4  # 22.0 s, 2.0 MB, 1m05s on a laptop
```

Measured, not listened to by a person: −16.5 LUFS integrated, −1.0 dBTP true peak.
