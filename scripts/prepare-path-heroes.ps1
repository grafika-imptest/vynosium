# Prepares the path landing heroes from assets/img/hero_imgaes_investicni_cesty
# into public/photo/cesty, named by the route slug they belong to.
#
# The sources are 2048x1152 (16:9). The hero band is wider than that on a
# desktop and much taller on a phone, so the output keeps the full frame at
# 1800px wide and object-cover does the cropping per viewport - a fixed crop
# here would throw away the material the phone needs.
#
# GDI+ rather than sharp: sharp's native module is blocked by this machine's
# Application Control policy. Keep this file ASCII - PowerShell 5.1 reads
# .ps1 as ANSI.
#
# Run from the repo root:
#   powershell -ExecutionPolicy Bypass -File scripts/prepare-path-heroes.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$targetW = 1800
$quality = 74

# Source file -> route slug.
$jobs = @(
    @{ Source = 'zhodnotit_byt.jpg';        Name = 'zhodnotit-byt' },
    @{ Source = 'pasivni_prijem.jpeg';      Name = 'pasivni-prijem' },
    @{ Source = 'zhodnoceni_kapitalu.jpeg'; Name = 'zhodnoceni-kapitalu' },
    @{ Source = 'budovani_majetku.jpeg';    Name = 'budovani-majetku' }
)

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, [int64]$quality)

$outDir = Join-Path $root 'public\photo\cesty'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

foreach ($job in $jobs) {
    $sourcePath = Join-Path $root ('assets\img\hero_imgaes_investicni_cesty\' + $job.Source)
    if (-not (Test-Path $sourcePath)) {
        Write-Host ('SKIP  ' + $job.Source + ' - not found')
        continue
    }

    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $targetH = [int][Math]::Round($targetW * $src.Height / $src.Width)

    $bmp = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = 'HighQualityBicubic'
    $g.PixelOffsetMode = 'HighQuality'
    $g.DrawImage($src, 0, 0, $targetW, $targetH)

    $destination = Join-Path $outDir ($job.Name + '.jpg')
    $bmp.Save($destination, $jpegCodec, $encoderParams)
    $sizeKb = [int]((Get-Item $destination).Length / 1KB)
    Write-Host ('OK    ' + $job.Name + '.jpg  ' + $targetW + 'x' + $targetH + '  ' + $sizeKb + ' KB')

    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
}
