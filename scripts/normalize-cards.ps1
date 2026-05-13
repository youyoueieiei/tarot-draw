Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot "..\public\cards"
$targetDir = Join-Path $PSScriptRoot "..\public\cards-normalized"

if (!(Test-Path $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir | Out-Null
}

$targetWidth = 768
$targetHeight = 1152
$targetRatio = $targetWidth / $targetHeight

Get-ChildItem -Path $sourceDir -Filter "*.png" | ForEach-Object {
  $sourcePath = $_.FullName
  $targetPath = Join-Path $targetDir $_.Name
  $image = [System.Drawing.Image]::FromFile($sourcePath)

  try {
    $sourceRatio = $image.Width / $image.Height

    if ($sourceRatio -gt $targetRatio) {
      $cropHeight = $image.Height
      $cropWidth = [int] [Math]::Round($cropHeight * $targetRatio)
      $cropX = [int] [Math]::Round(($image.Width - $cropWidth) / 2)
      $cropY = 0
    } else {
      $cropWidth = $image.Width
      $cropHeight = [int] [Math]::Round($cropWidth / $targetRatio)
      $cropX = 0
      $cropY = [int] [Math]::Round(($image.Height - $cropHeight) / 2)
    }

    $bitmap = New-Object System.Drawing.Bitmap $targetWidth, $targetHeight
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    try {
      $destRect = New-Object System.Drawing.Rectangle 0, 0, $targetWidth, $targetHeight
      $srcRect = New-Object System.Drawing.Rectangle $cropX, $cropY, $cropWidth, $cropHeight
      $graphics.DrawImage($image, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
      $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }

    Write-Output "$($_.Name) -> ${targetWidth}x${targetHeight}"
  } finally {
    $image.Dispose()
  }
}

