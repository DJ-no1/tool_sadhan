# Setup script for Tool Library project

Write-Host "Creating project structure..." -ForegroundColor Cyan

$folders = @(
    "components\ui",
    "components\layout",
    "components\shared",
    "lib",
    "types", 
    "docs",
    "app\tools\pdf",
    "app\tools\image",
    "app\tools\video"
)

foreach ($folder in $folders) {
    if (!(Test-Path $folder)) {
        New-Item -ItemType Directory -Path $folder -Force | Out-Null
        Write-Host "  ✓ Created $folder" -ForegroundColor Green
    } else {
        Write-Host "  → $folder already exists" -ForegroundColor Yellow
    }
}

Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
pnpm add class-variance-authority clsx tailwind-merge lucide-react

Write-Host "`n✨ Setup complete!" -ForegroundColor Green
Write-Host "Run 'pnpm dev' to start the development server" -ForegroundColor Cyan
