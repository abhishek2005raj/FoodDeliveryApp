@echo off
title Push FoodExpress to GitHub
cd /d "%~dp0"
echo ========================================================
echo Pushing FoodExpress to GitHub Repository:
echo https://github.com/abhishek2005raj/FoodDeliveryApp.git
echo ========================================================
git push -u origin main
echo.
echo If you see a GitHub popup, click "Sign in with your browser"
echo ========================================================
pause
