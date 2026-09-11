@echo off
REM VCI Magic Browser - Build Script for Windows

echo.
echo ========================================
echo  VCI Magic Browser - Build System
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1] Install Dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2] Build Process...
echo.
echo Options:
echo   1. Build Portable Executable (x64 + x86)
echo   2. Build Installer (x64 + x86) - Must install in C:\Program Files
echo   3. Build Both Versions
echo   4. Run Development Version
echo.

set /p choice=Select option (1-4): 

if "%choice%"=="1" (
    echo.
    echo Building Portable Version...
    call npm run build:portable
    echo.
    echo Portable files created in: dist\
    pause
) else if "%choice%"=="2" (
    echo.
    echo Building Installer Version...
    call npm run build
    echo.
    echo Installer files created in: dist\
    pause
) else if "%choice%"=="3" (
    echo.
    echo Building All Versions...
    call npm run build
    echo.
    echo All build files created in: dist\
    pause
) else if "%choice%"=="4" (
    echo.
    echo Starting Development Version...
    call npm run dev
) else (
    echo Invalid option!
    pause
    exit /b 1
)
