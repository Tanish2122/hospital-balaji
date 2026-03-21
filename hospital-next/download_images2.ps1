$urls = @(
  "https://balajihospitaljaipur.com/uploads/gallery/9197106986gallery-1.jpg",
  "https://balajihospitaljaipur.com/uploads/gallery/6607189991gallery-2.jpg",
  "https://balajihospitaljaipur.com/uploads/gallery/0916786692gallery-3.jpg",
  "https://balajihospitaljaipur.com/uploads/gallery/2996168706gallery-4.jpg",
  "https://balajihospitaljaipur.com/uploads/gallery/0686927981gallery-5.jpg",
  "https://balajihospitaljaipur.com/uploads/blog/1757917102-3D-LAPROSCOPY-SURGERY.jpg",
  "https://balajihospitaljaipur.com/uploads/blog/1757917461-Why_Regular_Gynecological_Check-ups_Are_Essential_for_Womens_Health-11.jpg",
  "https://balajihospitaljaipur.com/uploads/logo/6864d3c756898.png"
)

$destMap = @{
  "9197106986gallery-1.jpg" = "d:\web\hospital-next\public\images\gallery\event-1.jpg"
  "6607189991gallery-2.jpg" = "d:\web\hospital-next\public\images\gallery\event-2.jpg"
  "0916786692gallery-3.jpg" = "d:\web\hospital-next\public\images\gallery\event-3.jpg"
  "2996168706gallery-4.jpg" = "d:\web\hospital-next\public\images\gallery\event-4.jpg"
  "0686927981gallery-5.jpg" = "d:\web\hospital-next\public\images\gallery\event-5.jpg"
  "1757917102-3D-LAPROSCOPY-SURGERY.jpg" = "d:\web\hospital-next\public\images\blog\3d-laparoscopy.jpg"
  "1757917461-Why_Regular_Gynecological_Check-ups_Are_Essential_for_Womens_Health-11.jpg" = "d:\web\hospital-next\public\images\blog\gynecological.jpg"
  "6864d3c756898.png" = "d:\web\hospital-next\public\images\logo.png"
}

foreach ($url in $urls) {
  $filename = $url.Split("/")[-1]
  $dest = $destMap[$filename]
  if ($dest) {
    try {
      $dir = [System.IO.Path]::GetDirectoryName($dest)
      if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
      Invoke-WebRequest -Uri $url -OutFile $dest -TimeoutSec 20 -ErrorAction Stop
      Write-Host "OK: $filename"
    } catch {
      Write-Host "FAIL: $filename - $_"
    }
  }
}

# Try to fetch doctor images - common patterns
$doctorImages = @(
  @{ url = "https://balajihospitaljaipur.com/uploads/doctors/Dr.-Ramesh-Agarwal-small.png"; dest = "d:\web\hospital-next\public\images\doctors\ramesh-agarwal.png" },
  @{ url = "https://balajihospitaljaipur.com/uploads/doctors/Dr-Ramesh-Agarwal-small.png"; dest = "d:\web\hospital-next\public\images\doctors\ramesh-agarwal.png" },
  @{ url = "https://balajihospitaljaipur.com/uploads/doctors/ramesh-agarwal-small.png"; dest = "d:\web\hospital-next\public\images\doctors\ramesh-agarwal.png" },
  @{ url = "https://balajihospitaljaipur.com/uploads/img/doctors/dr-ramesh-small.png"; dest = "d:\web\hospital-next\public\images\doctors\ramesh-agarwal.png" }
)

foreach ($item in $doctorImages) {
  try {
    Invoke-WebRequest -Uri $item.url -OutFile $item.dest -TimeoutSec 8 -ErrorAction Stop
    Write-Host "Doctor OK: $($item.url)"
    break
  } catch {
    Write-Host "Doctor FAIL: $($item.url)"
  }
}

Write-Host "Download run complete."
