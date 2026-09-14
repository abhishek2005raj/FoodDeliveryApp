@echo off
title FoodExpress Server
set "PATH=%~dp0.node;%PATH%"
cd backend
echo ==============================================
echo Starting FoodExpress Server on http://localhost:5000
echo ==============================================
node server.js
pause
