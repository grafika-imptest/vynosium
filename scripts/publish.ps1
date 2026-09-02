# Builds the current working tree and publishes it to the gh-pages branch,
# which is what GitHub Pages serves while Actions is unavailable.
#
# WHY THIS EXISTS
#
# The site is deployed from a branch that holds build output only, so a git
# tag alone does not bring the live site back - it brings the source back.
# Rolling production back to an earlier state means checking that state out
# and publishing it again, and doing that by hand is a dozen steps where one
# wrong path force-pushes the wrong thing over the live site.
#
# ROLL PRODUCTION BACK TO A TAG
#
#   git checkout v1-client-review
#   powershell -ExecutionPolicy Bypass -File scripts/publish.ps1
#   git checkout redesign-2026-09      # back to where you were working
#
# PUBLISH WHAT YOU ARE WORKING ON
#
#   powershell -ExecutionPolicy Bypass -File scripts/publish.ps1
#
# NEXT_DIST_DIR only moves the EXPORTED FILES to .next-deploy. The build
# itself still writes .next, whatever that variable says - measured, see the
# comment in next.config.mjs. So publishing DOES disturb a running dev server:
# afterwards it serves a production build it did not make, the chunks 404 and
# nothing hydrates. Restart the dev server after publishing, or move the build
# into a throwaway git worktree.
#
# WHEN GITHUB ACTIONS IS BACK, this script stops being the deploy path: set
# Pages back to "GitHub Actions" in the repo settings and pushing master
# deploys on its own. Keep the script for emergencies.
#
# Keep this file ASCII - PowerShell 5.1 reads .ps1 as ANSI.

$ErrorActionPreference = 'Stop'

$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo

$head = (git rev-parse --short HEAD).Trim()
# `git describe --exact-match` writes to stderr when HEAD carries no tag, and
# PowerShell 5.1 turns a native command's stderr into an error record even
# with 2>$null - which, under ErrorActionPreference Stop, killed the publish
# on any commit that is not tagged. `tag --points-at` prints nothing and
# exits 0 instead.
$ref = (git tag --points-at HEAD | Select-Object -First 1)
if (-not $ref) { $ref = (git rev-parse --abbrev-ref HEAD).Trim() }
$dirty = (git status --porcelain)

Write-Host ''
Write-Host ("Publishing " + $ref + " (" + $head + ")")
if ($dirty) {
    Write-Host 'NOTE  working tree has uncommitted changes - they WILL be published.'
}

# --- build -----------------------------------------------------------------

$env:NEXT_DIST_DIR = '.next-deploy'
$env:NEXT_PUBLIC_BASE_PATH = '/vynosium'
$env:NEXT_PUBLIC_SITE_URL = 'https://grafika-imptest.github.io'

Write-Host 'Building...'
npm run build 2>&1 | Select-Object -Last 2
if ($LASTEXITCODE -ne 0) { throw 'Build failed - nothing was published.' }

$out = Join-Path $repo '.next-deploy'
if (-not (Test-Path (Join-Path $out 'index.html'))) {
    throw 'Build produced no index.html - nothing was published.'
}

# --- publish ---------------------------------------------------------------

$remote = (git remote get-url origin).Trim()
$work = Join-Path $env:TEMP ('vynosium-ghpages-' + [Guid]::NewGuid().ToString('N').Substring(0, 8))

try {
    New-Item -ItemType Directory -Path $work | Out-Null
    Copy-Item (Join-Path $out '*') $work -Recurse -Force
    # .nojekyll or GitHub Pages drops every _next/ directory.
    New-Item -ItemType File -Path (Join-Path $work '.nojekyll') | Out-Null

    Push-Location $work
    git init -q -b gh-pages
    git add -A
    git -c user.name='lukas.hutter-impnet' -c user.email='lukas.hutter@impnet.cz' `
        commit -q -m ("Publish the static export at " + $head + " (" + $ref + ")")
    git remote add origin $remote
    git push -q --force origin gh-pages
    Pop-Location

    Write-Host ''
    Write-Host ("Published " + $ref + " to gh-pages.")
    Write-Host 'Live in a minute or two: https://grafika-imptest.github.io/vynosium/'
} finally {
    if ((Get-Location).Path -eq $work) { Pop-Location }
    Remove-Item $work -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item (Join-Path $repo '.next-deploy') -Recurse -Force -ErrorAction SilentlyContinue
}
