#!/usr/bin/env bash
# Startup Video Kit setup for macOS and Linux.
# Usage (from the repo root): bash setup/setup.sh [--local-voice] [--captions] [--elevenlabs] [--yes]
#   --local-voice  install Kokoro (free on-device voice): pip install kokoro-onnx soundfile
#   --captions     install Parakeet (free on-device transcription for word-timed captions)
#   --elevenlabs   add the official ElevenLabs music and sound-effects skills
#   --yes          install missing system packages without asking
set -euo pipefail
cd "$(dirname "$0")/.."

LOCAL_VOICE=0 CAPTIONS=0 ELEVEN=0 YES=0
for arg in "$@"; do
  case "$arg" in
    --local-voice) LOCAL_VOICE=1 ;; --captions) CAPTIONS=1 ;;
    --elevenlabs) ELEVEN=1 ;; --yes|-y) YES=1 ;;
    *) echo "unknown option: $arg"; exit 1 ;;
  esac
done

step() { printf '\n\033[36m==> %s\033[0m\n' "$1"; }
confirm() { [ "$YES" = 1 ] && return 0; read -r -p "$1 is missing. Install it now? [y/N] " a; [[ "$a" =~ ^[yY] ]]; }
pkg_install() {
  if command -v brew >/dev/null; then brew install "$1"
  elif command -v apt-get >/dev/null; then sudo apt-get update && sudo apt-get install -y "$1"
  elif command -v dnf >/dev/null; then sudo dnf install -y "$1"
  else echo "Install $1 with your package manager, then rerun."; return 1; fi
}

step "Node.js 22+"
major=$(node -v 2>/dev/null | sed 's/^v//; s/\..*//' || echo 0)
if [ "${major:-0}" -lt 22 ]; then
  echo "Node 22+ is required: https://nodejs.org (or: brew install node@22 / nvm install 22)"; exit 1
fi
node -v

step "FFmpeg"
if ! command -v ffmpeg >/dev/null; then confirm "FFmpeg" && pkg_install ffmpeg || true; fi
command -v ffmpeg >/dev/null && ffmpeg -version | head -1 || echo "WARNING: FFmpeg still missing: rendering will fail."

step "HyperFrames skills (core set, for every coding agent on this machine)"
npx -y hyperframes@latest skills update

step "Startup Video skill (this kit) for Claude Code, Codex and Cursor"
npx -y skills add ./skills/startup-video -a claude-code -a codex -a cursor -y

if [ "$ELEVEN" = 1 ]; then
  step "ElevenLabs music + sound-effects skills"
  npx -y skills add elevenlabs/skills --skill music --skill sound-effects -a claude-code -a codex -a cursor -y
fi

if [ "$LOCAL_VOICE" = 1 ]; then
  step "Kokoro local voice"
  python3 -m pip install --user kokoro-onnx soundfile || echo "WARNING: needs Python 3.10+ with pip."
fi

if [ "$CAPTIONS" = 1 ]; then
  step "Parakeet local transcription"
  npx -y hyperframes models install parakeet
fi

step ".env"
if [ ! -f .env ]; then cp .env.example .env; echo "Created .env (all keys optional)."; else echo ".env already exists."; fi

step "Health check"
npx -y hyperframes doctor || true
printf "\n\033[32mDone. Open this folder in Claude Code or Codex and ask: 'Make a 45-second launch video for https://your-site.com'\033[0m\n"
