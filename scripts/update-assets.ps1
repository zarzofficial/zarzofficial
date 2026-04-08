$rootDir = Split-Path -Parent $PSScriptRoot
Get-ChildItem -Path $rootDir -Recurse -Filter '*.html' | ForEach-Object {
    if ($_.Name -eq 'index.html' -and $_.Directory.FullName -eq $rootDir) { return }
    $content = Get-Content $_.FullName -Raw
    $changed = $false
    
    $newContent = $content -replace 'href="/style\.css\?v=\d+"', 'href="/style.min.css?v=7"'
    if ($newContent -ne $content) { $changed = $true; $content = $newContent }
    
    $newContent = $content -replace 'src="/script\.js\?v=\d+"', 'src="/script.js?v=18"'
    if ($newContent -ne $content) { $changed = $true; $content = $newContent }
    
    if ($changed) {
        Set-Content $_.FullName $content -NoNewline
        Write-Host "Updated: $($_.FullName)"
    }
}
