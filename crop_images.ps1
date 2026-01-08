Add-Type -AssemblyName System.Drawing

function Crop-Image ($source, $dest, $x, $y, $w, $h) {
    if ($w -le 0) { $w = 1 }
    if ($h -le 0) { $h = 1 }
    $img = [System.Drawing.Image]::FromFile($source)
    $cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $target = New-Object System.Drawing.Bitmap($w, $h)
    $graphics = [System.Drawing.Graphics]::FromImage($target)
    $graphics.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $target.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $target.Dispose()
    $img.Dispose()
    Write-Output "Cropped $source to $dest"
}

$basePath = 'C:\Users\srikanth\.gemini\antigravity\brain\17fe0c8d-f30d-42db-a684-26535a72b025\'
$outPath = 'c:\Users\srikanth\Desktop\cogniqAI\Kalra''s dental\'

# Re-cropping with deeper top margin (135px) to remove all browser UI
# Poster 1
Crop-Image ($basePath + 'uploaded_image_0_1767774528592.png') ($outPath + 'implant-poster-1.png') 345 135 334 380
# Poster 2
Crop-Image ($basePath + 'uploaded_image_1_1767774528592.png') ($outPath + 'implant-poster-2.png') 345 135 334 380
# Achievement 1
Crop-Image ($basePath + 'uploaded_image_2_1767774528592.png') ($outPath + 'achievement-1.png') 345 135 334 380
# Achievement 2
Crop-Image ($basePath + 'uploaded_image_3_1767774528592.png') ($outPath + 'achievement-2.png') 345 135 334 380
# Team Group
Crop-Image ($basePath + 'uploaded_image_4_1767774528592.png') ($outPath + 'team-group.png') 205 135 614 380
