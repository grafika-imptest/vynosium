# Prepares web-sized photography from assets/img into public/photo.
#
# Uses .NET GDI+ rather than sharp: sharp's native module is blocked by this
# machine's Application Control policy, and GDI+ ships with Windows, so the
# script needs no install. Output is JPEG (GDI+ has no WebP encoder) at a
# quality that keeps a 1200px card image around 120-180 KB.
#
# Run from the repo root:  powershell -File scripts/prepare-photos.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$targetW = 1200
$targetH = 750   # 16:10, the card and before/after aspect
$quality = 72

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)

function Convert-Photo {
    param([string]$Source, [string]$Destination)

    try {
        $src = [System.Drawing.Image]::FromFile($Source)
    } catch {
        Write-Host ("SKIP  " + (Split-Path -Leaf $Source) + " - " + $_.Exception.Message)
        return
    }

    # Center-crop to the target aspect, then scale down.
    $srcAspect = $src.Width / $src.Height
    $dstAspect = $targetW / $targetH
    if ($srcAspect -gt $dstAspect) {
        $cropH = $src.Height
        $cropW = [int][Math]::Round($src.Height * $dstAspect)
    } else {
        $cropW = $src.Width
        $cropH = [int][Math]::Round($src.Width / $dstAspect)
    }
    $cropX = [int](($src.Width - $cropW) / 2)
    $cropY = [int](($src.Height - $cropH) / 2)

    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $gfx = [System.Drawing.Graphics]::FromImage($bmp)
    $gfx.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $gfx.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $gfx.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $gfx.DrawImage($src,
        (New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)),
        (New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)),
        [System.Drawing.GraphicsUnit]::Pixel)

    $dir = Split-Path -Parent $Destination
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
    $bmp.Save($Destination, $jpegCodec, $encoderParams)

    $gfx.Dispose(); $bmp.Dispose(); $src.Dispose()
    $kb = [int]((Get-Item $Destination).Length / 1KB)
    Write-Host ("OK    " + (Split-Path -Leaf $Destination) + "  ${kb} KB")
}

# --- Project cards: one interior per project slug -------------------------
$projects = @(
    @{ src = 'interior1.jpg'; slug = 'vinohrady-byt-3kk' },
    @{ src = 'interior2.jpg'; slug = 'smichov-investicni-byt' },
    @{ src = 'interior3.jpg'; slug = 'brno-kralovo-pole' },
    @{ src = 'interior4.jpg'; slug = 'plzen-portfolio-3-byty' },
    @{ src = 'interior5.jpg'; slug = 'ostrava-poruba-1kk' },
    @{ src = 'interior6.jpg'; slug = 'karlin-loft-2kk' }
)
foreach ($p in $projects) {
    Convert-Photo -Source (Join-Path $root "assets/img/foto-bytu/$($p.src)") `
                  -Destination (Join-Path $root "public/photo/projekty/$($p.slug).jpg")
}

# --- Case studies: before/after pairs -------------------------------------
$pairs = @(
    @{ before = 'EP_pred.jpg';        after = 'EP_po.jpg';        slug = 'vinohrady-2plus1' },
    @{ before = 'jablonsky_pred.jpg'; after = 'jablonsky_po.jpg'; slug = 'karlin-loft' },
    @{ before = 'musilkova_pred.jpeg'; after = 'musilkova_po.jpg'; slug = 'brno-zabovresky-pronajem' },
    @{ before = 'pekarny_pred.jpg';   after = 'pekarny_po.jpg';   slug = 'plzen-portfolio' }
)
foreach ($pair in $pairs) {
    Convert-Photo -Source (Join-Path $root "assets/img/pred-po/$($pair.before)") `
                  -Destination (Join-Path $root "public/photo/pred-po/$($pair.slug)-pred.jpg")
    Convert-Photo -Source (Join-Path $root "assets/img/pred-po/$($pair.after)") `
                  -Destination (Join-Path $root "public/photo/pred-po/$($pair.slug)-po.jpg")
}

Write-Host ''
Write-Host 'Done. Sources stay in assets/img (untracked); only public/photo is committed.'
