@echo off
echo.
echo ================================
echo Installing Video Converter Tool
echo ================================
echo.

cd /d "%~dp0"
node install-video-tool.js

if %ERRORLEVEL% == 0 (
    echo.
    echo ================================
    echo Installation Complete!
    echo ================================
    echo.
    echo You can now run: npm run dev
    echo Then visit: http://localhost:3000/tools/video/convert
    echo.
) else (
    echo.
    echo ================================
    echo Installation Failed
    echo ================================
    echo Please check the error messages above.
    echo.
)

pause
