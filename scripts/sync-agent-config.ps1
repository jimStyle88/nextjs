[CmdletBinding()]
param(
    [switch]$Check
)

$ErrorActionPreference = 'Stop'
$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot '.claude'
$targetRoots = @(
    (Join-Path $repoRoot '.codex'),
    (Join-Path $repoRoot '.agents')
)

$relativePaths = @('docs', 'skills')

function Get-RelativeFiles([string]$root) {
    if (-not (Test-Path $root)) {
        return @()
    }

    return @(Get-ChildItem -LiteralPath $root -File -Recurse | ForEach-Object {
        $_.FullName.Substring($root.Length).TrimStart('\')
    })
}

function Get-PathSet([string]$root) {
    $set = @{}
    foreach ($file in (Get-RelativeFiles $root)) {
        $set[$file] = $true
    }
    return $set
}

$hasDifferences = $false

foreach ($targetRoot in $targetRoots) {
    foreach ($relativePath in $relativePaths) {
        $sourcePath = Join-Path $sourceRoot $relativePath
        $targetPath = Join-Path $targetRoot $relativePath
        $sourceFiles = Get-PathSet $sourcePath

        if (-not $Check) {
            New-Item -ItemType Directory -Force -Path $targetPath | Out-Null
        }

        foreach ($relativeFile in $sourceFiles.Keys) {
            $sourceFile = Join-Path $sourcePath $relativeFile
            $targetFile = Join-Path $targetPath $relativeFile

            if ($Check) {
                if (-not (Test-Path $targetFile)) {
                    Write-Output "Missing: $targetFile"
                    $hasDifferences = $true
                    continue
                }

                $sourceHash = (Get-FileHash -LiteralPath $sourceFile -Algorithm SHA256).Hash
                $targetHash = (Get-FileHash -LiteralPath $targetFile -Algorithm SHA256).Hash
                if ($sourceHash -ne $targetHash) {
                    Write-Output "Different: $targetFile"
                    $hasDifferences = $true
                }
            } else {
                $targetParent = Split-Path -Parent $targetFile
                New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
                Copy-Item -LiteralPath $sourceFile -Destination $targetFile -Force
            }
        }

        foreach ($relativeFile in (Get-RelativeFiles $targetPath)) {
            if ($sourceFiles.ContainsKey($relativeFile)) {
                continue
            }

            $targetFile = Join-Path $targetPath $relativeFile
            if ($Check) {
                Write-Output "Extra: $targetFile"
                $hasDifferences = $true
            } else {
                Remove-Item -LiteralPath $targetFile -Force
            }
        }
    }
}

if ($Check) {
    if ($hasDifferences) {
        exit 1
    }

    Write-Output 'Agent configuration mirrors are synchronized.'
} else {
    Write-Output 'Synchronized .claude/docs and .claude/skills to .codex and .agents.'
}
