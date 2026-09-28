@echo off
set "ROOT=%~dp0"

for /f "usebackq tokens=1,* delims==" %%A in ("%ROOT%.env") do set "%%A=%%B"


echo Running DB
docker start 975c952806d0320cc25b709c03de0661b724f91917af31afe34d4e9f21b92f38
echo Done!
pause

echo Launching Server...
wt -w 0 new-tab --title "TOG Server" --startingDirectory "%ROOT%tog_backend" cmd /k "node --watch index.js"
echo Done!

echo Launching Website
wt -w 0 new-tab --title "TOG Frontend" --startingDirectory "%ROOT%tog_frontend" cmd /k "ng serve"
echo Done!

echo Running db GUI
wt -w 0 new-tab --title "Mongo Express" cmd /k "docker run -it --rm --network mtg_rg_default --name mongo-express -p 8081:8081 -e ME_CONFIG_OPTIONS_EDITORTHEME=pastel-on-dark -e ME_CONFIG_BASICAUTH_USERNAME=admin -e ME_CONFIG_BASICAUTH_PASSWORD=%MONGO_PASS% mongo-express"
echo Done!

echo Script finished, ready to code!
pause