@echo off
chcp 65001 >nul
cd /d "%~dp0"
py patch_neon.py
if errorlevel 1 echo Обновление не применено. Сообщи мне текст ошибки.
pause
