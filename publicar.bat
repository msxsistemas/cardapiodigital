@echo off
cd /d "%~dp0"
git add .
git commit -m "Atualizacao %date% %time%"
git push
echo.
echo ✅ Publicado! O site atualiza em cerca de 1 minuto.
pause
