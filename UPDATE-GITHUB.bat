@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ============================================
echo   Pushing updates to GitHub (N-A-METAL-)
echo ============================================
echo.

git add -A

git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to commit. Nothing to push.
    echo.
    pause
    exit /b 0
)

set "msg="
set /p msg=Commit message (leave blank for auto message):

if "%msg%"=="" (
    for /f "tokens=1-3 delims=/ " %%a in ("%date%") do set "d=%%a-%%b-%%c"
    set "msg=Update !d! !time!"
)

git commit -m "!msg!"
if not %errorlevel%==0 (
    echo.
    echo Commit failed. Aborting push.
    pause
    exit /b 1
)

git push origin main
if not %errorlevel%==0 (
    echo.
    echo Push failed. Check the error above.
    pause
    exit /b 1
)

echo.
echo Done. Changes pushed to:
echo https://github.com/boom93217-stack/N-A-METAL-
echo.
pause
