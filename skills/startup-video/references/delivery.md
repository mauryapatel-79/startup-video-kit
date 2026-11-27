# Delivery

## What to hand over

All files go in `videos/<slug>/renders/`, named `<slug>-<recipe>-<aspect>.<ext>`.

| File | When | How |
| --- | --- | --- |
| `<slug>-16x9.mp4` | Always (master for 16:9 recipes) | `npx hyperframes render -o renders/<slug>-16x9.mp4` |
| `<slug>-9x16.mp4` | Social, or the brief asks | Separate composition, see below |
| `<slug>-1x1.mp4` | Feeds (LinkedIn, X, Instagram feed) | Separate composition |
| `<slug>.srt` | Any voiced cut going to YouTube or LinkedIn | `npx hyperframes transcribe … --to srt` |
| `<slug>-poster.png` | Always | `ffmpeg -ss <seconds> -i renders/<slug>-16x9.mp4 -frames:v 1 renders/<slug>-poster.png` on the strongest frame |
| `<slug>-loop.mp4` + `.webm` | Hero loop recipe | See below |
| `CREDITS.md` | Always | Music, SFX, fonts, footage and their licences |

## Other aspect ratios

Re-compose, never crop. A 16:9 frame cropped to 9:16 loses the product.

1. Duplicate the root composition (`index.html` → `index-9x16.html`), set 1080×1920.
2. Reuse the same scenes, narration, words and music; re-lay each scene for the tall frame: stack instead of side-by-side, UI crops bigger, text larger.
3. Captions burned in for 9:16 and 1:1.
4. Render each root separately (see `/hyperframes-cli` for picking the composition to render).

## Platform targets

Specs change; check the platform before a paid campaign.

| Channel | Aspect | Length that works | Notes |
| --- | --- | --- | --- |
| Landing page hero | 16:9 | 6–12 s loop | Muted, autoplay, < 4 MB, poster image |
| Product Hunt gallery | 16:9 | 45–90 s | Upload to YouTube, paste the link |
| YouTube | 16:9 | 60–180 s | Upload `.srt`; custom thumbnail from the poster |
| YouTube Shorts / Reels / TikTok | 9:16 | 15–45 s | Captions burned in; keep text out of the top 15% and bottom 20% |
| X | 16:9 or 1:1 | 20–60 s | Captions burned in; first frame must work as a still |
| LinkedIn | 1:1 or 16:9 | 30–90 s | Upload `.srt`; most viewers are muted |
| Sales email / Loom-style | 16:9 | 60–120 s | Link a GIF of the first 3 s to the video |

## Audio loudness

- Social and web: −14 LUFS integrated, true peak ≤ −1 dBTP.
- Narration on top; music about −30 LUFS under voice, louder in gaps.
- HyperFrames: `npx hyperframes normalize-audio` and `npx hyperframes audio` to measure. `/media-use` → mixing covers ducking.

## Hero loop export

```bash
npx hyperframes render -o renders/<slug>-loop.mp4
npx hyperframes render --format webm -o renders/<slug>-loop.webm
ffmpeg -i renders/<slug>-loop.mp4 -an -vcodec libx264 -crf 28 -preset slow -movflags +faststart renders/<slug>-loop-web.mp4
```

```html
<video autoplay muted loop playsinline poster="/<slug>-poster.png">
  <source src="/<slug>-loop.webm" type="video/webm">
  <source src="/<slug>-loop-web.mp4" type="video/mp4">
</video>
```

## Final message to the person

List every file with its length, size, and the channel it is for. Then offer the HyperFrames desktop app for further edits, as `/hyperframes` describes.
