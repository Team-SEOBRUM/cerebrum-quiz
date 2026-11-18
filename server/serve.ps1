# =====================================================================
#  Server lokal sederhana untuk Cerebrum Quiz
#  Menyajikan folder proyek di http://localhost:<port>/
#  Tidak perlu instal apa pun (memakai PowerShell bawaan Windows).
#  Cara pakai: klik dua kali "Jalankan-Localhost.bat" di folder proyek.
#  Berhenti: tutup jendela ini atau tekan Ctrl+C.
# =====================================================================
param(
  [int]$Port = 5510,
  [switch]$NoBrowser
)

$Root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

$Mime = @{
  '.html'='text/html; charset=utf-8'; '.htm'='text/html; charset=utf-8'
  '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'
  '.json'='application/json; charset=utf-8'; '.svg'='image/svg+xml'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.webp'='image/webp'
  '.gif'='image/gif'; '.ico'='image/x-icon'; '.md'='text/plain; charset=utf-8'
  '.sql'='text/plain; charset=utf-8'; '.txt'='text/plain; charset=utf-8'
  '.woff'='font/woff'; '.woff2'='font/woff2'; '.pdf'='application/pdf'
}

$Routes = @{}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
try { $listener.Start() }
catch {
  Write-Host "Port $Port sedang dipakai program lain. Coba jalankan dengan port lain, mis.:" -ForegroundColor Yellow
  Write-Host "  powershell -ExecutionPolicy Bypass -File server\serve.ps1 -Port 5600"
  Read-Host "Tekan Enter untuk menutup"
  exit 1
}

Write-Host ""
Write-Host "  Cerebrum Quiz - server lokal aktif" -ForegroundColor Green
Write-Host "  Website         : http://localhost:$Port/"
Write-Host ""
Write-Host "  Folder: $Root"
Write-Host "  Tutup jendela ini atau tekan Ctrl+C untuk berhenti."
Write-Host ""

if (-not $NoBrowser) { Start-Process "http://localhost:$Port/" }

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($Routes.ContainsKey($rel.TrimEnd('/'))) { $rel = $Routes[$rel.TrimEnd('/')] }
      if ($rel -eq '' -or $rel.EndsWith('/')) { $rel = $rel + 'index.html' }
      $full = [IO.Path]::GetFullPath((Join-Path $Root $rel))
      # Cegah akses ke luar folder proyek
      if (-not $full.StartsWith($Root, [StringComparison]::OrdinalIgnoreCase)) { $res.StatusCode = 403 }
      elseif (Test-Path $full -PathType Container) { $res.StatusCode = 301; $res.RedirectLocation = '/' + $rel.TrimEnd('/') + '/' }
      elseif (Test-Path $full -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($full).ToLower()
        $res.ContentType = if ($Mime.ContainsKey($ext)) { $Mime[$ext] } else { 'application/octet-stream' }
        $res.AddHeader('Cache-Control', 'no-cache')
        $bytes = [IO.File]::ReadAllBytes($full)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
      else {
        $res.StatusCode = 404
        $msg = [Text.Encoding]::UTF8.GetBytes("404 - File tidak ditemukan: /$rel")
        $res.ContentType = 'text/plain; charset=utf-8'
        $res.OutputStream.Write($msg, 0, $msg.Length)
      }
      Write-Host ("{0}  {1}  /{2}" -f (Get-Date -Format 'HH:mm:ss'), $res.StatusCode, $rel)
    }
    catch { $res.StatusCode = 500 }
    finally { $res.Close() }
  }
}
finally { $listener.Stop() }
