@echo off
chcp 65001 >nul
cd /d "%~dp0"
py APPLY_YANDEX_SDK.py
echo.
pause
