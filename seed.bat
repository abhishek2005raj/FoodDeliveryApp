@echo off
title FoodExpress Seeder
set "PATH=%~dp0.node;%PATH%"
cd backend
echo ==============================================
echo Seeding FoodExpress Database with 8 Menu Items
echo ==============================================
node seed/seedFoods.js
pause
