$baseUrl = "https://balajihospitaljaipur.com/uploads/gallery/"
$dest = "d:\web\hospital-next\public\images\gallery\"

$files = @(
  "5965221775reception1-small.png|reception.png",
  "6729552157ot2-small.png|ot2.png",
  "5729652157ot-small.png|ot.png",
  "2956725571digitalXray-small.png|digital-xray.png",
  "6229751557physiotherapy-small.png|physiotherapy.png",
  "9526577152medicalStore1-small.png|medical-store.png",
  "img1.jpg|img1.jpg",
  "img2.jpg|img2.jpg",
  "img3.jpg|img3.jpg",
  "img4.jpg|img4.jpg",
  "2679257515generalWard1-small.png|general-ward.png",
  "5527579126dressingRoom2-small.png|dressing-room.png",
  "5722567159outdoor-small.png|outdoor.png",
  "9751225657generalWard-small.png|general-ward2.png",
  "9215725576xRay1-small.png|xray1.png",
  "5927156275xRay2-small.png|xray2.png",
  "6559512277xRay3-small.png|xray3.png",
  "5926721575physiotherapy1-small.png|physiotherapy1.png",
  "7755162295physiotherapy2-small.png|physiotherapy2.png",
  "2756915257physiotherapy3-small.png|physiotherapy3.png"
)

foreach ($line in $files) {
  $parts = $line -split "\|"
  $src = $baseUrl + $parts[0]
  $out = $dest + $parts[1]
  try {
    Invoke-WebRequest -Uri $src -OutFile $out -TimeoutSec 20 -ErrorAction Stop
    Write-Host "OK: $($parts[1])"
  } catch {
    Write-Host "FAIL: $($parts[1]) - $_"
  }
}

# Doctor images
$doctorDest = "d:\web\hospital-next\public\images\doctors\"
$doctorFiles = @(
  "https://balajihospitaljaipur.com/uploads/doctors/69b259bad37a8-small.png|ramesh-agarwal.png",
  "https://balajihospitaljaipur.com/uploads/doctors/69b25b84889d1-small.png|shitiz-agarwal.png"
)

foreach ($line in $doctorFiles) {
  $parts = $line -split "\|"
  $out = $doctorDest + $parts[1]
  try {
    Invoke-WebRequest -Uri $parts[0] -OutFile $out -TimeoutSec 20 -ErrorAction Stop
    Write-Host "OK: $($parts[1])"
  } catch {
    Write-Host "FAIL: $($parts[1]) - $_"
  }
}

Write-Host "All downloads complete."
