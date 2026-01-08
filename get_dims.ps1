Add-Type -AssemblyName System.Drawing
$images = Get-ChildItem 'C:\Users\srikanth\.gemini\antigravity\brain\17fe0c8d-f30d-42db-a684-26535a72b025\uploaded_image_*.png'
foreach ($file in $images) {
    $img = [System.Drawing.Image]::FromFile($file.FullName)
    Write-Output "$($file.Name): $($img.Width)x$($img.Height)"
    $img.Dispose()
}
