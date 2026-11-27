# Startup Video Kit setup for Windows.
# Usage (from the repo root):
#   powershell -ExecutionPolicy Bypass -File setup/setup.ps1 [-LocalVoice] [-Captions] [-ElevenLabs] [-Yes]
#   -LocalVoice  install Kokoro (free on-device voice): pip install kokoro-onnx soundfile
#   -Captions    install Parakeet (free on-device transcription for word-timed captions)
#   -ElevenLabs  add the official ElevenLabs music and sound-effects skills
#   -Yes         install missing system packages without asking
param([switch]$LocalVoice, [switch]$Captions, [switch]$ElevenLabs, [switch]$Yes)

$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)

function Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Confirm-Install($what) {
    if ($Yes) { return $true }
    return (Read-Host "$what is missing. Install it now? [y/N]") -match '^[yY]'
}

Step 'Node.js 22+'
$node = Get-Command node -ErrorAction SilentlyContinue
$major = if ($node) { [int]((node -v).TrimStart('v').Split('.')[0]) } else { 0 }
if ($major -lt 22) {
    if (Confirm-Install 'Node.js 22+') { winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements }
    Write-Host 'Open a new terminal after installing Node, then run this script again.'; exit 1
}
Write-Host "node $(node -v)"

Step 'FFmpeg'
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    if (Confirm-Install 'FFmpeg') {
        winget install --id Gyan.FFmpeg -e --accept-package-agreements
        $env:Path = [Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [Environment]::GetEnvironmentVariable('Path', 'User')
    }
}
if (Get-Command ffmpeg -ErrorAction SilentlyContinue) { (ffmpeg -version | Select-Object -First 1) } else { Write-Warning 'FFmpeg still missing: rendering will fail.' }

Step 'HyperFrames skills (core set, for every coding agent on this machine)'
npx -y hyperframes@latest skills update

Step 'Startup Video skill (this kit) for Claude Code, Codex and Cursor'
npx -y skills add ./skills/startup-video -a claude-code -a codex -a cursor --copy -y

if ($ElevenLabs) {
    Step 'ElevenLabs music + sound-effects skills'
    npx -y skills add elevenlabs/skills --skill music --skill sound-effects -a claude-code -a codex -a cursor --copy -y
}

if ($LocalVoice) {
    Step 'Kokoro local voice'
    $py = Get-Command python, py -ErrorAction SilentlyContinue | Select-Object -First 1
    if (-not $py) { Write-Warning 'Python 3.10+ not found: winget install Python.Python.3.12, then rerun with -LocalVoice.' }
    else { & $py.Source -m pip install --user kokoro-onnx soundfile }
}

if ($Captions) {
    Step 'Parakeet local transcription'
    npx -y hyperframes models install parakeet
}

Step '.env'
if (-not (Test-Path .env)) { Copy-Item .env.example .env; Write-Host 'Created .env (all keys optional).' } else { Write-Host '.env already exists.' }

Step 'Health check'
npx -y hyperframes doctor
Write-Host "`nDone. Open this folder in Claude Code or Codex and ask: 'Make a 45-second launch video for https://your-site.com'" -ForegroundColor Green
