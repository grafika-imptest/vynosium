# Prepares the partner logos from assets/img/loga_partneri into
# public/brand/partners, one PNG per partner named by its slug.
#
# The sources are a mixed bag: two are dark marks on a white canvas with a lot
# of empty margin baked in, two are full-bleed coloured tiles (white mark on
# blue). Sized to a single height as-is, the margin-heavy ones would render
# visibly smaller than the tiles, so this trims the white frame off the ones
# that have one and leaves the coloured tiles alone. No scaling happens here -
# the sources are small (one is 80px wide) and upscaling would only blur them;
# the strip caps both height and width in CSS instead.
#
# GDI+ rather than sharp: sharp's native module is blocked by this machine's
# Application Control policy. Keep this file ASCII - PowerShell 5.1 reads
# .ps1 as ANSI.
#
# Run from the repo root:
#   powershell -ExecutionPolicy Bypass -File scripts/prepare-partner-logos.ps1

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot

# Source file -> output slug.
$jobs = @(
    @{ Source = 'Logo-Audit-One-e1721908871961.png';        Name = 'audit-one' },
    @{ Source = 'Logo-Avant.png';                           Name = 'avant' },
    @{ Source = 'Logo-ceska-sporitelna.png';                Name = 'ceska-sporitelna' },
    @{ Source = 'Logo-Equity-Solutions-e1721909064632.png'; Name = 'equity-solutions' }
)

$outDir = Join-Path $root 'public\brand\partners'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

foreach ($job in $jobs) {
    $sourcePath = Join-Path $root ('assets\img\loga_partneri\' + $job.Source)
    if (-not (Test-Path $sourcePath)) {
        Write-Warning ("Missing source: " + $sourcePath)
        continue
    }

    $source = [System.Drawing.Image]::FromFile($sourcePath)
    $bmp = New-Object System.Drawing.Bitmap $source

    # A near-white top-left corner means the mark sits on a white canvas and
    # the margin is padding we can drop. Anything else is a coloured tile
    # whose edge is part of the logo.
    $corner = $bmp.GetPixel(0, 0)
    $onWhite = ($corner.R -gt 240) -and ($corner.G -gt 240) -and ($corner.B -gt 240)

    $x0 = 0; $y0 = 0; $x1 = $bmp.Width - 1; $y1 = $bmp.Height - 1

    if ($onWhite) {
        $minX = $bmp.Width; $maxX = -1; $minY = $bmp.Height; $maxY = -1
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            for ($x = 0; $x -lt $bmp.Width; $x++) {
                $p = $bmp.GetPixel($x, $y)
                # Ink = anything meaningfully darker or more saturated than paper.
                if (($p.R + $p.G + $p.B) -lt 720) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        if ($maxX -ge $minX) { $x0 = $minX; $x1 = $maxX; $y0 = $minY; $y1 = $maxY }
    }

    $w = $x1 - $x0 + 1
    $h = $y1 - $y0 + 1

    $out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($out)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)),
        (New-Object System.Drawing.Rectangle($x0, $y0, $w, $h)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $target = Join-Path $outDir ($job.Name + '.png')
    $out.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
    $out.Dispose()
    $bmp.Dispose()
    $source.Dispose()

    $trimmed = if ($onWhite) { 'trimmed' } else { 'tile, kept whole' }
    Write-Host ("{0} -> {1} ({2}x{3}, {4})" -f $job.Source, ($job.Name + '.png'), $w, $h, $trimmed)
}
