@echo off
echo Creating project structure...

cd /d "%~dp0"

mkdir components\ui 2>nul
mkdir components\layout 2>nul
mkdir components\shared 2>nul
mkdir lib 2>nul
mkdir types 2>nul
mkdir docs 2>nul
mkdir app\tools\pdf 2>nul
mkdir app\tools\image 2>nul
mkdir app\tools\video 2>nul

echo Installing dependencies...
call pnpm add class-variance-authority clsx tailwind-merge lucide-react

echo Setup complete!
pause
