param(
  [string]$TextPath = "tmp/narration.txt",
  [string]$OutputPath = "public/audio/promise-narration.mp3",
  [string]$OutputCuesPath = "src/content/generated/promiseNarrationCues.ts",
  [string]$Text = ""
)

$resolvedOutputPath = [System.IO.Path]::GetFullPath($OutputPath)
$outputDir = Split-Path -Parent $resolvedOutputPath
if ($outputDir -and !(Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$resolvedOutputCuesPath = [System.IO.Path]::GetFullPath($OutputCuesPath)
$outputCuesDir = Split-Path -Parent $resolvedOutputCuesPath
if ($outputCuesDir -and !(Test-Path $outputCuesDir)) {
  New-Item -ItemType Directory -Path $outputCuesDir -Force | Out-Null
}

try {
  if ($Text) {
    $content = $Text
  } else {
    $content = Get-Content $TextPath -Raw -Encoding UTF8
  }

  if ([string]::IsNullOrWhiteSpace($content)) {
    throw "Narration text is empty."
  }

  $projectRoot = Split-Path -Parent $PSScriptRoot
  $edgeDeps = Join-Path $projectRoot ".pydeps"

  if (Test-Path $edgeDeps) {
    $tempDir = Join-Path $projectRoot ".tmp"
    if (!(Test-Path $tempDir)) {
      New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
    }

    $pythonScriptPath = Join-Path $tempDir ("edge-tts-" + [guid]::NewGuid().ToString() + ".py")
    @'
import asyncio
import json
import os
import sys

deps = os.environ.get("CODEX_PYDEPS")
if deps:
    sys.path.insert(0, deps)

import edge_tts

async def main():
    communicate = edge_tts.Communicate(
        os.environ["CODEX_NARRATION_TEXT"],
        voice=os.environ.get("CODEX_NARRATION_VOICE", "zh-CN-XiaoxiaoNeural"),
        boundary="SentenceBoundary",
    )
    cues = []
    with open(os.environ["CODEX_OUTPUT_PATH"], "wb") as audio_file:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_file.write(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                cues.append(
                    {
                        "startMs": round(chunk["offset"] / 10000),
                        "endMs": round((chunk["offset"] + chunk["duration"]) / 10000),
                        "text": chunk["text"],
                    }
                )

    with open(os.environ["CODEX_OUTPUT_CUES_PATH"], "w", encoding="utf-8") as cues_file:
        cues_file.write("export const narrationTimedCues = ")
        cues_file.write(json.dumps(cues, ensure_ascii=False, indent=2))
        cues_file.write(" as const;\n")

asyncio.run(main())
'@ | Set-Content $pythonScriptPath -Encoding UTF8

    $env:CODEX_PYDEPS = $edgeDeps
    $env:CODEX_NARRATION_TEXT = $content
    $env:CODEX_NARRATION_VOICE = "zh-CN-XiaoxiaoNeural"
    $env:CODEX_OUTPUT_PATH = $resolvedOutputPath
    $env:CODEX_OUTPUT_CUES_PATH = $resolvedOutputCuesPath
    python $pythonScriptPath
    if ($LASTEXITCODE -ne 0) {
      throw "edge-tts generation failed."
    }
    Remove-Item $pythonScriptPath -ErrorAction SilentlyContinue
    return
  }

  if ([System.IO.Path]::GetExtension($resolvedOutputPath).ToLowerInvariant() -ne ".wav") {
    throw "No local edge-tts fallback found. Install edge-tts into .pydeps or use a .wav output path for SAPI."
  }

  $voice = New-Object -ComObject SAPI.SpVoice
  $voice.Rate = 0
  $voice.Volume = 100

  $tempDir = "C:\Temp"
  if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
  }
  $tempOutputPath = Join-Path $tempDir ("codex-voice-" + [guid]::NewGuid().ToString() + ".wav")

  $stream = New-Object -ComObject SAPI.SpFileStream
  $stream.Open($tempOutputPath, 3, $false)
  $voice.AudioOutputStream = $stream
  $null = $voice.Speak($content)
  $stream.Close()
  Move-Item -Force $tempOutputPath $resolvedOutputPath
} finally {
  if ($stream) {
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($stream) | Out-Null
  }
  if ($voice) {
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($voice) | Out-Null
  }
}
