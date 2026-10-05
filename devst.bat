@echo off
set "ROOT=%~dp0"

for /f "usebackq tokens=1,* delims==" %%A in ("%ROOT%.env") do set "%%A=%%B"


tasklist /FI "IMAGENAME eq %CONTAINER_APP%" | find /I "%CONTAINER_APP%" >nul
if errorlevel 1 (
    echo Opening docker
    start "" "%CONTAINER_APP_PATH%\%CONTAINER_APP%"
    timeout /t 30
)

echo Running DB
:repeat
docker start %CONTAINER_ID% 2>nul || goto :repeat
echo Done!

tasklist /FI "IMAGENAME eq %DB_ADMIN_APP%" | FIND /i "%DB_ADMIN_APP%" >nul
if errorlevel 1 (

    choice /C YN /T 10 /D Y /M "Do you want to open DB visualizer? "
    if %errorlevel%==1 goto yes
    if %errorlevel%==2 goto no

    :yes
    echo Opening %DB_ADMIN_APP%
    start "" "%DB_ADMIN_PATH%\%DB_ADMIN_APP%"

    :no
    echo Continuing without opening visualizer
)

echo Launching Server...
wt -w 0 new-tab --title "TOG Server" --startingDirectory "%ROOT%tog_backend" cmd /k "node --watch index.js"
echo Done!

echo Launching Website
wt -w 0 new-tab --title "TOG Frontend" --startingDirectory "%ROOT%tog_frontend" cmd /k "ng serve"
echo Done!

echo Script finished, ready to code!
pause