param(
  [string]$OutputPath = "public/audio/default-bgm.wav",
  [int]$DurationSeconds = 45,
  [int]$SampleRate = 22050
)

$resolvedOutputPath = [System.IO.Path]::GetFullPath($OutputPath)
$outputDir = Split-Path -Parent $resolvedOutputPath
if ($outputDir -and !(Test-Path $outputDir)) {
  New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

$channels = 1
$bitsPerSample = 16
$blockAlign = $channels * ($bitsPerSample / 8)
$byteRate = $SampleRate * $blockAlign
$sampleCount = $DurationSeconds * $SampleRate
$dataSize = $sampleCount * $blockAlign

$stream = [System.IO.File]::Open($resolvedOutputPath, [System.IO.FileMode]::Create)
$writer = New-Object System.IO.BinaryWriter($stream)

try {
  $writer.Write([System.Text.Encoding]::ASCII.GetBytes("RIFF"))
  $writer.Write([int](36 + $dataSize))
  $writer.Write([System.Text.Encoding]::ASCII.GetBytes("WAVE"))
  $writer.Write([System.Text.Encoding]::ASCII.GetBytes("fmt "))
  $writer.Write([int]16)
  $writer.Write([int16]1)
  $writer.Write([int16]$channels)
  $writer.Write([int]$SampleRate)
  $writer.Write([int]$byteRate)
  $writer.Write([int16]$blockAlign)
  $writer.Write([int16]$bitsPerSample)
  $writer.Write([System.Text.Encoding]::ASCII.GetBytes("data"))
  $writer.Write([int]$dataSize)

  $twoPi = [Math]::PI * 2
  $masterGain = 0.18
  $pulseFrequency = 523.25
  $padFrequencies = @(220.0, 277.18, 329.63)

  for ($i = 0; $i -lt $sampleCount; $i++) {
    $t = $i / [double]$SampleRate
    $barPosition = $t % 4.0

    $fadeIn = [Math]::Min(1.0, $t / 3.0)
    $fadeOut = [Math]::Min(1.0, ($DurationSeconds - $t) / 3.0)
    $envelope = [Math]::Max(0.0, [Math]::Min($fadeIn, $fadeOut))

    $pad = 0.0
    foreach ($freq in $padFrequencies) {
      $pad += [Math]::Sin($twoPi * $freq * $t)
    }
    $pad = ($pad / $padFrequencies.Count) * 0.45

    $pulseWindow = [Math]::Max(0.0, 1.0 - ($barPosition / 0.55))
    $pulse = [Math]::Sin($twoPi * $pulseFrequency * $t) * $pulseWindow * 0.22

    $sample = ($pad + $pulse) * $masterGain * $envelope
    $sample = [Math]::Max(-1.0, [Math]::Min(1.0, $sample))

    $writer.Write([int16]($sample * [int16]::MaxValue))
  }
} finally {
  $writer.Dispose()
  $stream.Dispose()
}
