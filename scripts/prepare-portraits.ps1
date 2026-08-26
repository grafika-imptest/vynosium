# Prepares the team portraits from assets/img/lidi into public/photo/tym.
#
# Separate from prepare-photos.ps1 because portraits need a 3:4 frame and a
# per-file focus point: these are wide studio shots where the subject is off
# centre, and a centre crop cuts the face out of two of the four.
#
# Focus is the horizontal centre of the crop as a fraction of the source
# width (0.5 = centre). For sources taller than 3:4 the crop is limited by
# width instead and Focus is applied vertically, keeping the head in frame.
#
# GDI+ rather than sharp: sharp's native module is blocked by this machine's
# Application Control policy. Keep this file ASCII - PowerShell 5.1 reads
# .ps1 as ANSI.
#
# Run from the repo root:
#   powershell -ExecutionPolicy Bypass -File scripts/prepare-portraits.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$targetW = 600
$targetH = 800
$quality = 76

$jobs = @(
    @{ Source = '2149280717.jpg'; Name = 'financovani'; Focus = 0.45 },
    @{ Source = '343104.jpg';     Name = 'zakladatel';  Focus = 0.42 },
    @{ Source = '5365.jpg';       Name = 'realizace';   Focus = 0.30 },
    @{ Source = '5844.jpg';       Name = 'sprava';      Focus = 0.35 }
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)

$outDir = Join-Path $root 'public\photo\tym'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

foreach ($job in $jobs) {
    $sourcePath = Join-Path $root ('assets\img\lidi\' + $job.Source)
    if (-not (Test-Path $sourcePath)) {
        Write-Host ('SKIP  ' + $job.Source + ' - not found')
        continue
    }

    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $dstAspect = $targetW / $targetH

    if (($src.Width / $src.Height) -gt $dstAspect) {
        # Wider than 3:4 - crop the sides, focus horizontally.
        $cropH = $src.Height
        $cropW = [int][Math]::Round($src.Height * $dstAspect)
        $cropX = [int][Math]::Round($src.Width * $job.Focus - $cropW / 2)
        $cropY = 0
    } else {
        # Taller than 3:4 - crop top and bottom, focus vertically.
        $cropW = $src.Width
        $cropH = [int][Math]::Round($src.Width / $dstAspect)
        $cropX = 0
        $cropY = [int][Math]::Round($src.Height * $job.Focus - $cropH / 2)
    }

    # Clamp, so a focus near an edge cannot ask for pixels outside the source.
    $cropX = [Math]::Max(0, [Math]::Min($cropX, $src.Width - $cropW))
    $cropY = [Math]::Max(0, [Math]::Min($cropY, $src.Height - $cropH))

    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $dstRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $g.DrawImage($src, $dstRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $destination = Join-Path $outDir ($job.Name + '.jpg')
    $bmp.Save($destination, $jpegCodec, $encoderParams)
    $sizeKb = [int]((Get-Item $destination).Length / 1KB)
    Write-Host ('OK    ' + $job.Name + '.jpg  ' + $targetW + 'x' + $targetH + '  ' + $sizeKb + ' KB')

    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}
