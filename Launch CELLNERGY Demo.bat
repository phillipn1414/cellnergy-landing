@echo off
title CELLNERGY Demo Server
start "" http://localhost:4173/
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -Port 4173
